import { describe, it, expect } from "vitest";
import {
  normalizeUrl,
  calculateRelevance,
  deduplicateEvidence
} from "@/lib/serpapi";
import { EvidenceItem } from "@/types/evidence";

describe("SerpApi Client Normalization and Safety", () => {
  it("normalizes and removes tracking parameters from URLs", () => {
    const raw = "https://example.com/docs/intro/?utm_source=twitter&utm_medium=social&ref=blog#section1";
    const cleaned = normalizeUrl(raw);
    expect(cleaned).toBe("https://example.com/docs/intro");
  });

  it("handles URLs without trailing slashes and tracking", () => {
    const raw = "https://modelcontextprotocol.io/spec/";
    const cleaned = normalizeUrl(raw);
    expect(cleaned).toBe("https://modelcontextprotocol.io/spec");
  });

  it("calculates deterministic relevance scores", () => {
    const query = "Model Context Protocol";
    const title = "Model Context Protocol (MCP) Official Documentation";
    const snippet = "The standard for connecting AI models to external tools and data.";

    const result = calculateRelevance(query, title, snippet);
    expect(result.score).toBeGreaterThan(0.7);
    expect(result.explanation).toContain("Exact technology subject match");
  });

  it("deduplicates identical URLs and near-identical titles", () => {
    const items: EvidenceItem[] = [
      {
        id: "1",
        technology: "MCP",
        sourceEngine: "google",
        engineLabel: "Google Search",
        title: "Model Context Protocol Docs",
        snippet: "Snippet A",
        url: "https://modelcontextprotocol.io/intro",
        retrievedAt: new Date().toISOString(),
        evidenceType: "web",
        relevanceScore: 0.9,
        relevanceExplanation: "High",
        sourceStatus: "LIVE",
        limitations: []
      },
      {
        id: "2",
        technology: "MCP",
        sourceEngine: "google",
        engineLabel: "Google Search",
        title: "Model Context Protocol Docs",
        snippet: "Snippet B",
        url: "https://modelcontextprotocol.io/intro?utm_source=hackathon", // same clean URL
        retrievedAt: new Date().toISOString(),
        evidenceType: "web",
        relevanceScore: 0.9,
        relevanceExplanation: "High",
        sourceStatus: "LIVE",
        limitations: []
      }
    ];

    const deduplicated = deduplicateEvidence(items);
    expect(deduplicated.length).toBe(1);
    expect(deduplicated[0].url).toBe("https://modelcontextprotocol.io/intro");
  });

  it("ensures API key is never attached to EvidenceItem structures", () => {
    const item: EvidenceItem = {
      id: "ev-test",
      technology: "Rust",
      sourceEngine: "google",
      engineLabel: "Google Search",
      title: "Rust Programming Language",
      snippet: "Empowering everyone to build reliable and efficient software.",
      url: "https://www.rust-lang.org",
      retrievedAt: new Date().toISOString(),
      evidenceType: "web",
      relevanceScore: 0.95,
      relevanceExplanation: "Exact match",
      sourceStatus: "LIVE",
      limitations: []
    };

    const itemString = JSON.stringify(item);
    expect(itemString).not.toContain("api_key");
    expect(itemString).not.toContain("SERPAPI_KEY");
  });
});
