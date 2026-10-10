import { NextRequest, NextResponse } from "next/server";
import { getCachedReport, setCachedReport } from "@/lib/cache";
import { getFixtureForQuery, FIXTURE_MCP } from "@/lib/fixtures";
import { querySerpApiEngine, deduplicateEvidence } from "@/lib/serpapi";
import { extractSignals } from "@/lib/signals";
import { evaluateRecommendation } from "@/lib/decision-engine";
import { ResearchReport, TechnologyComparison, SupportedEngine } from "@/types/evidence";

async function getOrFetchReport(tech: string, isDemoRequested: boolean): Promise<ResearchReport> {
  const cached = getCachedReport(tech);
  if (cached) return cached;

  const hasApiKey = Boolean(process.env.SERPAPI_KEY && process.env.SERPAPI_KEY.trim().length > 5);

  if (isDemoRequested || !hasApiKey) {
    const fixture = getFixtureForQuery(tech);
    if (fixture) return fixture;

    const fallback = JSON.parse(JSON.stringify(FIXTURE_MCP)) as ResearchReport;
    fallback.technology = tech;
    fallback.mode = "DEMO FIXTURE";
    return fallback;
  }

  // Live fetch
  const startTime = Date.now();
  const engines: SupportedEngine[] = ["google", "google_scholar", "google_jobs"];
  const results = await Promise.allSettled(engines.map(engine => querySerpApiEngine({ query: tech, engine })));

  const rawEvidence = [];
  const engineCoverageItems = [];
  const enginesContacted = [];

  for (let i = 0; i < engines.length; i++) {
    const engine = engines[i];
    const res = results[i];
    if (res.status === "fulfilled") {
      enginesContacted.push({
        engine,
        status: res.value.status,
        itemCount: res.value.items.length,
        durationMs: res.value.durationMs,
        error: res.value.error
      });
      engineCoverageItems.push({
        engine,
        status: res.value.status,
        itemCount: res.value.items.length,
        note: res.value.error || `Retrieved ${res.value.items.length} items`
      });
      rawEvidence.push(...res.value.items);
    } else {
      enginesContacted.push({
        engine,
        status: "FAILED" as const,
        itemCount: 0,
        durationMs: 0,
        error: res.reason?.message
      });
      engineCoverageItems.push({
        engine,
        status: "FAILED" as const,
        itemCount: 0,
        note: "Failed"
      });
    }
  }

  const deduplicated = deduplicateEvidence(rawEvidence);
  const signals = extractSignals(tech, deduplicated);
  const recommendation = evaluateRecommendation(tech, deduplicated, signals, engineCoverageItems);

  const report: ResearchReport = {
    technology: tech,
    queryTimestamp: new Date().toISOString(),
    executionTimeMs: Date.now() - startTime,
    mode: "LIVE",
    totalSourcesExamined: rawEvidence.length,
    deduplicatedSourcesCount: deduplicated.length,
    evidence: deduplicated,
    signals,
    recommendation,
    enginesContacted,
    disclaimer: "Live research report retrieved via SerpApi."
  };

  setCachedReport(tech, report);
  return report;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const technologies: string[] = Array.isArray(body.technologies)
      ? body.technologies.map((t: any) => String(t).trim()).filter((t: string) => t.length > 1)
      : [];
    const isDemoRequested = Boolean(body.demo);

    if (technologies.length < 2 || technologies.length > 3) {
      return NextResponse.json(
        { error: "Comparison requires 2 or 3 distinct technologies." },
        { status: 400 }
      );
    }

    const reports: Record<string, ResearchReport> = {};

    for (const tech of technologies) {
      reports[tech] = await getOrFetchReport(tech, isDemoRequested);
    }

    // Build comparison matrix
    const matrix = technologies.map(tech => {
      const rep = reports[tech];
      return {
        technology: tech,
        recommendation: rep.recommendation.outcome,
        evidenceCount: rep.evidence.length,
        webDocsFound: rep.signals.web.hasOfficialDocumentation || rep.signals.web.docOrRepoLinks.length > 0,
        hiringDemandObserved: rep.signals.hiring.listingCount > 0,
        researchCitationsFound: rep.signals.research.paperCount > 0,
        confidence: rep.recommendation.confidenceLevel,
        keyLimitation: rep.signals.temporal.trendObservation
      };
    });

    const comparativeObservations: string[] = [];
    const coverageDiscrepancies: string[] = [];

    // Comparative analysis
    for (const tech of technologies) {
      const rep = reports[tech];
      comparativeObservations.push(
        `${tech} yielded ${rep.evidence.length} normalized evidence items, resulting in a "${rep.recommendation.outcome}" recommendation.`
      );
    }

    // Check for coverage discrepancies
    const counts = technologies.map(t => reports[t].evidence.length);
    const minCount = Math.min(...counts);
    const maxCount = Math.max(...counts);
    if (maxCount - minCount > 5) {
      coverageDiscrepancies.push(
        `Discrepancy in search result volume (${minCount} vs ${maxCount} sources). Raw counts should not be compared as a proxy for adoption popularity.`
      );
    }

    const comparison: TechnologyComparison = {
      technologies,
      generatedAt: new Date().toISOString(),
      reports,
      matrix,
      comparativeObservations,
      coverageDiscrepancies,
      limitations: [
        "Comparative radar highlights relative evidence availability across identical search engines.",
        "Disparities in search volume may stem from term naming specificity rather than real-world utility.",
        "Each technology should be evaluated within its architectural domain."
      ]
    };

    return NextResponse.json(comparison);
  } catch (err: any) {
    return NextResponse.json(
      { error: "Error running comparison: " + (err.message || "") },
      { status: 500 }
    );
  }
}
