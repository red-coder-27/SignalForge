import { describe, it, expect } from "vitest";
import { evaluateRecommendation } from "@/lib/decision-engine";
import { EvidenceItem, ExtractedSignals } from "@/types/evidence";

describe("Deterministic Explainable Decision Engine", () => {
  const dummyCoverage = [
    { engine: "google" as const, status: "SUCCESS" as const, itemCount: 5, note: "ok" },
    { engine: "google_scholar" as const, status: "SUCCESS" as const, itemCount: 3, note: "ok" },
    { engine: "google_jobs" as const, status: "SUCCESS" as const, itemCount: 2, note: "ok" }
  ];

  it("triggers BUILD when official docs and hiring demand are validated (Rule SF-001)", () => {
    const dummyEvidence: EvidenceItem[] = [
      { id: "1", technology: "MCP", sourceEngine: "google", engineLabel: "Google", title: "Doc", snippet: "", url: "https://modelcontextprotocol.io", retrievedAt: "", evidenceType: "web", relevanceScore: 1, relevanceExplanation: "", sourceStatus: "LIVE", limitations: [] },
      { id: "2", technology: "MCP", sourceEngine: "google_jobs", engineLabel: "Jobs", title: "Job 1", snippet: "", url: "https://job1", retrievedAt: "", evidenceType: "hiring", relevanceScore: 1, relevanceExplanation: "", sourceStatus: "LIVE", limitations: [] },
      { id: "3", technology: "MCP", sourceEngine: "google_jobs", engineLabel: "Jobs", title: "Job 2", snippet: "", url: "https://job2", retrievedAt: "", evidenceType: "hiring", relevanceScore: 1, relevanceExplanation: "", sourceStatus: "LIVE", limitations: [] }
    ];

    const signals: ExtractedSignals = {
      hiring: { listingCount: 2, companies: ["Anthropic", "CloudScale"], locations: [], skillKeywordsObserved: [], observations: [], coverage: "", limitations: [] },
      research: { paperCount: 1, totalCitationsKnown: 10, themesObserved: [], observations: [], coverage: "", limitations: [] },
      web: { hasOfficialDocumentation: true, docOrRepoLinks: ["https://modelcontextprotocol.io"], recentMentions: 1, observations: [], coverage: "", limitations: [] },
      temporal: { trendObservation: "Point in time", hasComparableHistoricalData: false, limitations: [] }
    };

    const result = evaluateRecommendation("MCP", dummyEvidence, signals, dummyCoverage);
    expect(result.outcome).toBe("BUILD");
    expect(result.ruleId).toBe("SF-RULE-001");
    expect(result.confidenceLevel).toBe("HIGH");
  });

  it("triggers LEARN when documentation exists but commercial hiring is nascent (Rule SF-002)", () => {
    const dummyEvidence: EvidenceItem[] = [
      { id: "1", technology: "NewProtocol", sourceEngine: "google", engineLabel: "Google", title: "Doc", snippet: "", url: "https://newprotocol.org", retrievedAt: "", evidenceType: "web", relevanceScore: 1, relevanceExplanation: "", sourceStatus: "LIVE", limitations: [] },
      { id: "2", technology: "NewProtocol", sourceEngine: "google_scholar", engineLabel: "Scholar", title: "Paper", snippet: "", url: "https://paper", retrievedAt: "", evidenceType: "research", relevanceScore: 1, relevanceExplanation: "", sourceStatus: "LIVE", limitations: [] },
      { id: "3", technology: "NewProtocol", sourceEngine: "google", engineLabel: "Google", title: "Tutorial", snippet: "", url: "https://tutorial", retrievedAt: "", evidenceType: "web", relevanceScore: 1, relevanceExplanation: "", sourceStatus: "LIVE", limitations: [] }
    ];

    const signals: ExtractedSignals = {
      hiring: { listingCount: 0, companies: [], locations: [], skillKeywordsObserved: [], observations: [], coverage: "", limitations: [] },
      research: { paperCount: 1, totalCitationsKnown: 5, themesObserved: [], observations: [], coverage: "", limitations: [] },
      web: { hasOfficialDocumentation: true, docOrRepoLinks: ["https://newprotocol.org"], recentMentions: 2, observations: [], coverage: "", limitations: [] },
      temporal: { trendObservation: "Point in time", hasComparableHistoricalData: false, limitations: [] }
    };

    const result = evaluateRecommendation("NewProtocol", dummyEvidence, signals, dummyCoverage);
    expect(result.outcome).toBe("LEARN");
    expect(result.ruleId).toBe("SF-RULE-002");
    expect(result.confidenceLevel).toBe("MEDIUM");
  });

  it("triggers INVESTIGATE when evidence is sparse or insufficient (Rule SF-004)", () => {
    const sparseEvidence: EvidenceItem[] = [
      { id: "1", technology: "ObscureTech", sourceEngine: "google", engineLabel: "Google", title: "Blog post", snippet: "", url: "https://blog", retrievedAt: "", evidenceType: "web", relevanceScore: 0.5, relevanceExplanation: "", sourceStatus: "LIVE", limitations: [] }
    ];

    const signals: ExtractedSignals = {
      hiring: { listingCount: 0, companies: [], locations: [], skillKeywordsObserved: [], observations: [], coverage: "", limitations: [] },
      research: { paperCount: 0, totalCitationsKnown: 0, themesObserved: [], observations: [], coverage: "", limitations: [] },
      web: { hasOfficialDocumentation: false, docOrRepoLinks: [], recentMentions: 1, observations: [], coverage: "", limitations: [] },
      temporal: { trendObservation: "None", hasComparableHistoricalData: false, limitations: [] }
    };

    const sparseCoverage = [
      { engine: "google" as const, status: "PARTIAL" as const, itemCount: 1, note: "sparse" },
      { engine: "google_scholar" as const, status: "FAILED" as const, itemCount: 0, note: "empty" },
      { engine: "google_jobs" as const, status: "FAILED" as const, itemCount: 0, note: "empty" }
    ];

    const result = evaluateRecommendation("ObscureTech", sparseEvidence, signals, sparseCoverage);
    expect(result.outcome).toBe("INVESTIGATE");
    expect(result.ruleId).toBe("SF-RULE-004");
    expect(result.confidenceLevel).toBe("LOW");
  });

  it("never outputs contradictory negative claims in MONITOR when hiring listings exist", () => {
    const dummyEvidence: EvidenceItem[] = [
      { id: "1", technology: "EarlyTech", sourceEngine: "google_jobs", engineLabel: "Jobs", title: "Dev", snippet: "Dev job", url: "https://job1", retrievedAt: "", evidenceType: "hiring", relevanceScore: 0.9, relevanceExplanation: "", sourceStatus: "LIVE", limitations: [] },
      { id: "2", technology: "EarlyTech", sourceEngine: "google", engineLabel: "Google", title: "Article", snippet: "Some article", url: "https://news.com/tech", retrievedAt: "", evidenceType: "web", relevanceScore: 0.8, relevanceExplanation: "", sourceStatus: "LIVE", limitations: [] },
      { id: "3", technology: "EarlyTech", sourceEngine: "google", engineLabel: "Google", title: "Forum", snippet: "Forum post", url: "https://forum.com/post", retrievedAt: "", evidenceType: "web", relevanceScore: 0.8, relevanceExplanation: "", sourceStatus: "LIVE", limitations: [] }
    ];

    const signals: ExtractedSignals = {
      hiring: { listingCount: 1, companies: ["TestCorp"], locations: [], skillKeywordsObserved: [], observations: [], coverage: "", limitations: [] },
      research: { paperCount: 0, totalCitationsKnown: 0, themesObserved: [], observations: [], coverage: "", limitations: [] },
      web: { hasOfficialDocumentation: false, docOrRepoLinks: [], recentMentions: 2, observations: [], coverage: "", limitations: [] },
      temporal: { trendObservation: "Point in time", hasComparableHistoricalData: false, limitations: [] }
    };

    const result = evaluateRecommendation("EarlyTech", dummyEvidence, signals, dummyCoverage);
    expect(result.outcome).toBe("MONITOR");
    expect(result.ruleId).toBe("SF-RULE-003");
    // Verify contradictoryOrMissingEvidence does NOT claim "Zero verified enterprise hiring listings found"
    const hasZeroClaim = result.contradictoryOrMissingEvidence.some(s => s.includes("Zero verified enterprise hiring listings"));
    expect(hasZeroClaim).toBe(false);
    expect(result.contradictoryOrMissingEvidence.some(s => s.includes("1 listing(s) observed"))).toBe(true);
  });
});
