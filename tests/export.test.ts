import { describe, it, expect } from "vitest";
import { exportReportToMarkdown, exportComparisonToMarkdown } from "@/lib/export";
import { FIXTURE_MCP } from "@/lib/fixtures";
import { TechnologyComparison } from "@/types/evidence";

describe("Report Export Functionality", () => {
  it("exports research report into valid Markdown preserving URLs and timestamps", () => {
    const md = exportReportToMarkdown(FIXTURE_MCP);

    expect(md).toContain("# SignalForge Research Report: Model Context Protocol");
    expect(md).toContain("Data Mode:");
    expect(md).toContain("DEMO FIXTURE");
    expect(md).toContain("Recommendation:");
    expect(md).toContain("BUILD");
    expect(md).toContain("https://modelcontextprotocol.io/introduction");
    expect(md).toContain("Google Scholar");
    expect(md).toContain("Google Jobs");
  });

  it("exports comparative technology matrix to Markdown", () => {
    const comparison: TechnologyComparison = {
      technologies: ["MCP", "WebAssembly"],
      generatedAt: new Date().toISOString(),
      reports: { MCP: FIXTURE_MCP },
      matrix: [
        {
          technology: "MCP",
          recommendation: "BUILD",
          evidenceCount: 7,
          webDocsFound: true,
          hiringDemandObserved: true,
          researchCitationsFound: true,
          confidence: "HIGH",
          keyLimitation: "Point in time"
        }
      ],
      comparativeObservations: ["MCP demonstrates active ecosystem."],
      coverageDiscrepancies: [],
      limitations: ["Search snapshots differ."]
    };

    const md = exportComparisonToMarkdown(comparison);
    expect(md).toContain("# SignalForge Comparative Technology Radar");
    expect(md).toContain("MCP vs WebAssembly");
    expect(md).toContain("| **MCP** |");
  });
});
