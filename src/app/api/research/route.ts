import { NextRequest, NextResponse } from "next/server";
import {
  querySerpApiEngine,
  deduplicateEvidence
} from "@/lib/serpapi";
import { extractSignals } from "@/lib/signals";
import { evaluateRecommendation } from "@/lib/decision-engine";
import { getCachedReport, setCachedReport } from "@/lib/cache";
import { getFixtureForQuery, FIXTURE_MCP } from "@/lib/fixtures";
import { ResearchReport, SupportedEngine, EngineContactStatus } from "@/types/evidence";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const query = typeof body.technology === "string" ? body.technology.trim() : "";
    const isDemoRequested = Boolean(body.demo);
    const forceRefresh = Boolean(body.refresh);

    return handleResearchRequest(query, isDemoRequested, forceRefresh);
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal server error parsing request: " + (err.message || "") },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim() || "";
  const isDemoRequested = searchParams.get("demo") === "true";
  const forceRefresh = searchParams.get("refresh") === "true";

  return handleResearchRequest(query, isDemoRequested, forceRefresh);
}

async function handleResearchRequest(
  technology: string,
  isDemoRequested: boolean,
  forceRefresh: boolean
) {
  if (!technology || technology.length < 2) {
    return NextResponse.json(
      { error: "Technology search term must be at least 2 characters." },
      { status: 400 }
    );
  }

  if (technology.length > 100) {
    return NextResponse.json(
      { error: "Technology search term is too long (maximum 100 characters)." },
      { status: 400 }
    );
  }

  const hasApiKey = Boolean(process.env.SERPAPI_KEY && process.env.SERPAPI_KEY.trim().length > 5);

  // If user requested DEMO or if SERPAPI_KEY is not configured, return DEMO FIXTURE
  if (isDemoRequested || !hasApiKey) {
    const fixture = getFixtureForQuery(technology);
    if (fixture) {
      // Ensure clone has explicit DEMO FIXTURE status
      const cloned = JSON.parse(JSON.stringify(fixture)) as ResearchReport;
      cloned.mode = "DEMO FIXTURE";
      cloned.evidence = cloned.evidence.map(e => ({
        ...e,
        sourceStatus: "DEMO FIXTURE" as const
      }));
      return NextResponse.json(cloned);
    }

    // Synthesize a transparently labeled demo report for arbitrary queries when in demo mode or without API key
    const sample = JSON.parse(JSON.stringify(FIXTURE_MCP)) as ResearchReport;
    sample.technology = technology;
    sample.mode = "DEMO FIXTURE";
    sample.disclaimer = isDemoRequested
      ? `DEMO FIXTURE: This research report for "${technology}" is synthetic demonstration data generated for evaluation without consuming live SerpApi quota.`
      : `DEMO FIXTURE: SERPAPI_KEY is not configured on this server. This report for "${technology}" is synthetic demonstration data showcasing SignalForge's analysis interface. To enable live SerpApi requests, configure SERPAPI_KEY in .env.local.`;
    sample.evidence = sample.evidence.map(e => ({
      ...e,
      technology,
      sourceStatus: "DEMO FIXTURE" as const
    }));
    return NextResponse.json(sample);
  }

  // Check cache first if not force refresh
  if (!forceRefresh) {
    const cached = getCachedReport(technology);
    if (cached) {
      return NextResponse.json(cached);
    }
  }

  // Execute LIVE SerpApi Queries
  const startTime = Date.now();
  const engines: SupportedEngine[] = ["google", "google_scholar", "google_jobs"];

  const enginePromises = engines.map(engine =>
    querySerpApiEngine({
      query: technology,
      engine
    })
  );

  const results = await Promise.allSettled(enginePromises);

  const rawEvidence = [];
  const enginesContacted: EngineContactStatus[] = [];
  const engineCoverageItems = [];

  for (let i = 0; i < engines.length; i++) {
    const engine = engines[i];
    const res = results[i];

    if (res.status === "fulfilled") {
      const data = res.value;
      enginesContacted.push({
        engine,
        status: data.status,
        itemCount: data.items.length,
        durationMs: data.durationMs,
        error: data.error
      });

      engineCoverageItems.push({
        engine,
        status: data.status,
        itemCount: data.items.length,
        note: data.error || `Successfully retrieved ${data.items.length} items.`
      });

      rawEvidence.push(...data.items);
    } else {
      enginesContacted.push({
        engine,
        status: "FAILED",
        itemCount: 0,
        durationMs: 0,
        error: res.reason?.message || "Unknown engine error"
      });

      engineCoverageItems.push({
        engine,
        status: "FAILED" as const,
        itemCount: 0,
        note: res.reason?.message || "Failed to contact engine"
      });
    }
  }

  const deduplicated = deduplicateEvidence(rawEvidence);
  const signals = extractSignals(technology, deduplicated);
  const recommendation = evaluateRecommendation(
    technology,
    deduplicated,
    signals,
    engineCoverageItems
  );

  const executionTimeMs = Date.now() - startTime;
  const report: ResearchReport = {
    technology,
    queryTimestamp: new Date().toISOString(),
    executionTimeMs,
    mode: "LIVE",
    totalSourcesExamined: rawEvidence.length,
    deduplicatedSourcesCount: deduplicated.length,
    evidence: deduplicated,
    signals,
    recommendation,
    enginesContacted,
    disclaimer: "Live research report retrieved via SerpApi. Signals and recommendations are computed deterministically from retrieved search observations and do not constitute investment or commercial advice."
  };

  // Cache successful live report only if evidence was retrieved
  if (deduplicated.length > 0) {
    setCachedReport(technology, report);
  }

  return NextResponse.json(report);
}
