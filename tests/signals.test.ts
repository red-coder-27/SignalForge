import { describe, it, expect } from "vitest";
import { extractSignals } from "@/lib/signals";
import { EvidenceItem } from "@/types/evidence";

describe("Deterministic Signal Extraction", () => {
  const sampleEvidence: EvidenceItem[] = [
    {
      id: "ev-job-1",
      technology: "WebAssembly",
      sourceEngine: "google_jobs",
      engineLabel: "Google Jobs",
      title: "Senior Systems Engineer (WebAssembly / Rust)",
      snippet: "Design edge runtimes using Rust, Wasmtime, and WASI Component Model.",
      url: "https://example.com/jobs/wasm-1",
      retrievedAt: new Date().toISOString(),
      evidenceType: "hiring",
      relevanceScore: 0.9,
      relevanceExplanation: "High match",
      sourceStatus: "LIVE",
      limitations: [],
      metadata: { companyName: "Fastly", location: "Remote" }
    },
    {
      id: "ev-sch-1",
      technology: "WebAssembly",
      sourceEngine: "google_scholar",
      engineLabel: "Google Scholar",
      title: "Bringing the Web up to Speed with WebAssembly",
      snippet: "Seminal paper on Wasm bytecode and compiler verification.",
      url: "https://dl.acm.org/doi/10.1145/3062341.3062363",
      retrievedAt: new Date().toISOString(),
      evidenceType: "research",
      relevanceScore: 0.95,
      relevanceExplanation: "Academic foundation",
      sourceStatus: "LIVE",
      limitations: [],
      metadata: { citations: 1420 }
    },
    {
      id: "ev-web-1",
      technology: "WebAssembly",
      sourceEngine: "google",
      engineLabel: "Google Search",
      title: "WebAssembly Core Specification (W3C)",
      snippet: "Official standard specifications for WebAssembly 2.0.",
      url: "https://www.w3.org/TR/wasm-core-2",
      retrievedAt: new Date().toISOString(),
      evidenceType: "web",
      relevanceScore: 0.98,
      relevanceExplanation: "Official standard",
      sourceStatus: "LIVE",
      limitations: []
    }
  ];

  it("extracts hiring employer demand and skill keywords", () => {
    const signals = extractSignals("WebAssembly", sampleEvidence);
    expect(signals.hiring.listingCount).toBe(1);
    expect(signals.hiring.companies).toContain("Fastly");
    expect(signals.hiring.skillKeywordsObserved).toContain("rust");
    expect(signals.hiring.skillKeywordsObserved).toContain("wasm");
  });

  it("aggregates academic citations and research presence", () => {
    const signals = extractSignals("WebAssembly", sampleEvidence);
    expect(signals.research.paperCount).toBe(1);
    expect(signals.research.totalCitationsKnown).toBe(1420);
  });

  it("identifies official web documentation / specifications", () => {
    const signals = extractSignals("WebAssembly", sampleEvidence);
    expect(signals.web.hasOfficialDocumentation).toBe(true);
    expect(signals.web.docOrRepoLinks).toContain("https://www.w3.org/TR/wasm-core-2");
  });

  it("strictly enforces temporal policy by refusing to fabricate growth percentages", () => {
    const signals = extractSignals("WebAssembly", sampleEvidence);
    expect(signals.temporal.hasComparableHistoricalData).toBe(false);
    expect(signals.temporal.trendObservation).toContain("Insufficient historical baseline");
  });

  it("rejects unrelated engineering jobs that do not mention the queried technology", () => {
    const mixedEvidence: EvidenceItem[] = [
      {
        id: "ev-unrelated-job",
        technology: "Model Context Protocol",
        sourceEngine: "google_jobs",
        engineLabel: "Google Jobs",
        title: "Senior Java Spring Developer",
        snippet: "Enterprise banking backend service in Java and Spring Boot.",
        url: "https://example.com/job/java",
        retrievedAt: new Date().toISOString(),
        evidenceType: "hiring",
        relevanceScore: 0.4,
        relevanceExplanation: "Low match",
        sourceStatus: "LIVE",
        limitations: [],
        metadata: { companyName: "BankCorp" }
      }
    ];

    const signals = extractSignals("Model Context Protocol", mixedEvidence);
    expect(signals.hiring.listingCount).toBe(0);
    expect(signals.hiring.companies).not.toContain("BankCorp");
  });

  it("does not classify arbitrary .io or .org domains as official documentation without doc indicators", () => {
    const blogEvidence: EvidenceItem[] = [
      {
        id: "ev-blog",
        technology: "Model Context Protocol",
        sourceEngine: "google",
        engineLabel: "Google Search",
        title: "Thoughts on AI trends in 2026",
        snippet: "General thoughts on tech developments.",
        url: "https://randomthoughtblog.io/posts/ai-trends",
        retrievedAt: new Date().toISOString(),
        evidenceType: "web",
        relevanceScore: 0.5,
        relevanceExplanation: "Blog post",
        sourceStatus: "LIVE",
        limitations: []
      }
    ];

    const signals = extractSignals("Model Context Protocol", blogEvidence);
    expect(signals.web.hasOfficialDocumentation).toBe(false);
    expect(signals.web.docOrRepoLinks).toHaveLength(0);
  });
});
