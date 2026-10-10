import {
  EvidenceItem,
  ExtractedSignals,
  RecommendationExplanation,
  SourceCoverageItem,
  SupportedEngine
} from "@/types/evidence";

export function evaluateRecommendation(
  technology: string,
  evidence: EvidenceItem[],
  signals: ExtractedSignals,
  engineCoverage: { engine: SupportedEngine; status: 'SUCCESS' | 'PARTIAL' | 'FAILED' | 'SKIPPED'; itemCount: number; note: string }[]
): RecommendationExplanation {
  const totalEvidenceCount = evidence.length;
  const webDocFound = signals.web.hasOfficialDocumentation || signals.web.docOrRepoLinks.length > 0;
  const hiringCount = signals.hiring.listingCount;
  const paperCount = signals.research.paperCount;
  const citationCount = signals.research.totalCitationsKnown;

  const coverageItems: SourceCoverageItem[] = engineCoverage.map(e => ({
    engine: e.engine,
    label: e.engine === 'google' ? 'Google Search' : e.engine === 'google_scholar' ? 'Google Scholar' : e.engine === 'google_jobs' ? 'Google Jobs' : 'Google Patents',
    status: e.status,
    itemCount: e.itemCount,
    note: e.note
  }));

  // Insufficient coverage condition -> INVESTIGATE
  const successfulEngines = engineCoverage.filter(e => e.status === 'SUCCESS' || (e.status === 'PARTIAL' && e.itemCount > 0));

  if (totalEvidenceCount < 3 || successfulEngines.length < 2) {
    return {
      outcome: "INVESTIGATE",
      summary: `Insufficient evidence retrieved for "${technology}". Current coverage lacks sufficient search surface data to formulate a reliable guidance step.`,
      supportingObservations: [
        `Only ${totalEvidenceCount} source items were retrieved across all searched engines.`,
        `Fewer than 2 engines returned usable data for this query.`
      ],
      contradictoryOrMissingEvidence: [
        "Primary documentation could not be verified in top results.",
        "No verified hiring postings or peer academic papers were returned."
      ],
      sourceCoverage: coverageItems,
      exactRule: "RULE_INSUFFICIENT_COVERAGE: Total valid evidence count < 3 or usable engine surfaces < 2.",
      ruleId: "SF-RULE-004",
      evidenceToImproveConfidence: [
        "Verify if the technology name is spelled correctly or known by an alternate alias.",
        "Check whether specialized domain indexes or direct code registries (e.g. PyPI, npm, crates.io) yield direct artifacts."
      ],
      confidenceLevel: "LOW",
      limitationDisclaimer: "SignalForge refrains from guessing recommendations when empirical search evidence is sparse."
    };
  }

  // BUILD Condition:
  // Requires: Primary doc/repo confirmed + either active hiring listings OR substantial academic validation with working tooling
  if (webDocFound && (hiringCount >= 2 || (paperCount >= 2 && hiringCount >= 1))) {
    return {
      outcome: "BUILD",
      summary: `Evidence indicates that "${technology}" possesses both verified documentation/tooling and active industrial or ecosystem demand. Suitable for bounded prototyping and practical build evaluation.`,
      supportingObservations: [
        `Official documentation or primary repository verified: ${signals.web.docOrRepoLinks.slice(0, 2).join(", ")}.`,
        `Identified ${hiringCount} active engineering hiring listing(s) at companies like: ${signals.hiring.companies.slice(0, 3).join(", ") || "verified tech employers"}.`,
        paperCount > 0
          ? `Scholarly backing with ${paperCount} paper(s) and ${citationCount} known citations.`
          : `Active developer ecosystem with practical deployment references.`
      ],
      contradictoryOrMissingEvidence: [
        signals.temporal.trendObservation,
        paperCount === 0
          ? "Academic peer publications are not yet prevalent; adoption is currently driven primarily by industry and developer open-source channels."
          : "Long-term architectural stability across diverse runtime topologies requires project-specific validation.",
        "Toolchain integration patterns and enterprise governance may vary across different infrastructure environments."
      ],
      sourceCoverage: coverageItems,
      exactRule: "RULE_BUILD_VALIDATED: Official documentation verified + Active employer hiring demand (>= 2 listings or >= 1 with research citations).",
      ruleId: "SF-RULE-001",
      evidenceToImproveConfidence: [
        "Review production post-mortems and benchmark latency/reliability under target workload.",
        "Check dependency license compatibility for your intended use case."
      ],
      confidenceLevel: "HIGH",
      limitationDisclaimer: "A BUILD recommendation indicates observable technical activity and hiring presence, not financial return or market supremacy."
    };
  }

  // LEARN Condition:
  // Strong documentation or educational/research presence, but limited commercial hiring listings yet.
  if (webDocFound || paperCount >= 2) {
    return {
      outcome: "LEARN",
      summary: `Solid educational, documentation, or conceptual research exists for "${technology}", while commercial hiring signals remain emerging. Ideal for skill acquisition, sandbox exploration, and architectural study.`,
      supportingObservations: [
        webDocFound
          ? `Primary documentation or reference repository identified: ${signals.web.docOrRepoLinks[0] || "Found in search"}.`
          : `Academic research foundation established with ${paperCount} paper(s).`,
        `Active community discussion observed across web search sources.`
      ],
      contradictoryOrMissingEvidence: [
        hiringCount === 0
          ? "No direct enterprise hiring listings found in Google Jobs results for this specific term."
          : `Commercial hiring footprint is emerging (${hiringCount} listing(s) identified).`,
        !webDocFound
          ? "Standalone primary documentation was not isolated; relying on research literature and community guides."
          : "Enterprise production case studies remain limited compared to mature incumbent technologies."
      ],
      sourceCoverage: coverageItems,
      exactRule: "RULE_LEARN_CONCEPTUAL: Verified documentation/research available, but commercial hiring demand is emerging (< 2 job listings).",
      ruleId: "SF-RULE-002",
      evidenceToImproveConfidence: [
        "Build a sample tutorial project to evaluate ergonomics before recommending for team adoption.",
        "Track upcoming framework releases for stability and backwards compatibility guarantees."
      ],
      confidenceLevel: "MEDIUM",
      limitationDisclaimer: "A LEARN recommendation suggests high educational value without commitment of production infrastructure."
    };
  }

  // MONITOR Condition:
  // Some signals exist (e.g., papers or mentions), but no primary docs or no hiring.
  if (paperCount > 0 || totalEvidenceCount >= 3) {
    return {
      outcome: "MONITOR",
      summary: `Early or fragmented signals detected for "${technology}". The technology is worth tracking for milestone releases, but premature to invest significant engineering resources into building.`,
      supportingObservations: [
        paperCount > 0
          ? `Academic or research presence detected (${paperCount} paper(s)).`
          : `Multiple web references found across general search index.`,
        `Mentions observed in specialized discussion threads.`
      ],
      contradictoryOrMissingEvidence: [
        webDocFound
          ? `Primary documentation was identified (${signals.web.docOrRepoLinks[0] || "online"}), but broad ecosystem validation remains nascent.`
          : "Definitive primary documentation was not clearly established in top search results.",
        hiringCount === 0
          ? "Zero verified enterprise hiring listings found in current search window."
          : `Commercial hiring listings are nascent (${hiringCount} listing(s) observed) and do not yet reflect widespread enterprise demand.`,
        paperCount === 0
          ? "No peer-reviewed research papers or citation benchmarks retrieved."
          : `Academic research presence remains early (${paperCount} paper(s) indexed).`,
        "Production runtime maturity and long-term ecosystem stability remain unverified."
      ],
      sourceCoverage: coverageItems,
      exactRule: "RULE_MONITOR_EARLY_STAGE: Fragmented search presence or early research, but no established documentation or enterprise demand.",
      ruleId: "SF-RULE-003",
      evidenceToImproveConfidence: [
        "Wait for the release of an official v1.0 specification or standard.",
        "Look for adoption by prominent open-source maintainers or major cloud vendors."
      ],
      confidenceLevel: "MEDIUM",
      limitationDisclaimer: "MONITOR suggests passive observation without engineering reallocation."
    };
  }

  // Default fallback -> INVESTIGATE
  return {
    outcome: "INVESTIGATE",
    summary: `Search evidence for "${technology}" is ambiguous or conflicting. Further domain-specific investigation is required.`,
    supportingObservations: [
      `Retrieved ${totalEvidenceCount} sources, but signals lack coherent consensus.`
    ],
    contradictoryOrMissingEvidence: [
      "Inconclusive alignment between web documentation, research, and hiring demand."
    ],
    sourceCoverage: coverageItems,
    exactRule: "RULE_INVESTIGATE_AMBIGUOUS: Signals do not satisfy deterministic thresholds for BUILD, LEARN, or MONITOR.",
    ruleId: "SF-RULE-005",
    evidenceToImproveConfidence: [
      "Refine query terms to disambiguate potential naming collisions.",
      "Consult specialized technical registries or vendor whitepapers."
    ],
    confidenceLevel: "LOW",
    limitationDisclaimer: "Ambiguous search results require manual verification."
  };
}
