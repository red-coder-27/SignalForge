import { ResearchReport, TechnologyComparison } from "@/types/evidence";

export function exportReportToMarkdown(report: ResearchReport): string {
  const {
    technology,
    queryTimestamp,
    mode,
    recommendation,
    signals,
    evidence,
    enginesContacted
  } = report;

  return `# SignalForge Research Report: ${technology}

**Generated At:** ${new Date(queryTimestamp).toUTCString()}  
**Data Mode:** \`${mode}\`  
**Recommendation:** **${recommendation.outcome}** (Confidence: ${recommendation.confidenceLevel})  
**Applied Rule:** \`${recommendation.ruleId}\` — ${recommendation.exactRule}

---

## 1. Executive Summary & Recommendation
${recommendation.summary}

### Supporting Observations
${recommendation.supportingObservations.map(o => `- ${o}`).join("\n")}

### Contradictory or Missing Evidence
${recommendation.contradictoryOrMissingEvidence.map(c => `- ${c}`).join("\n")}

### Evidence Needed to Improve Confidence
${recommendation.evidenceToImproveConfidence.map(e => `- ${e}`).join("\n")}

---

## 2. Deterministic Signal Analysis

### Hiring Signals (Google Jobs)
- **Direct Listings Found:** ${signals.hiring.listingCount}
- **Companies Observed:** ${signals.hiring.companies.join(", ") || "None"}
- **Skill Requirements Observed:** ${signals.hiring.skillKeywordsObserved.join(", ") || "None"}
- **Observations:**
${signals.hiring.observations.map(o => `  - ${o}`).join("\n")}
- **Limitations:** ${signals.hiring.limitations.join(" ")}

### Research & Scholarly Signals (Google Scholar)
- **Scholarly Papers Retrieved:** ${signals.research.paperCount}
- **Total Known Citations:** ${signals.research.totalCitationsKnown}
- **Key Themes Observed:** ${signals.research.themesObserved.join(", ") || "None"}
- **Observations:**
${signals.research.observations.map(o => `  - ${o}`).join("\n")}
- **Limitations:** ${signals.research.limitations.join(" ")}

### Web & Developer Ecosystem Signals (Google Search)
- **Official Documentation Found:** ${signals.web.hasOfficialDocumentation ? "Yes" : "Inconclusive"}
- **Documentation / Repository Links:** ${signals.web.docOrRepoLinks.join(", ") || "None"}
- **Observations:**
${signals.web.observations.map(o => `  - ${o}`).join("\n")}
- **Limitations:** ${signals.web.limitations.join(" ")}

### Temporal Trend Signal
- **Observation:** ${signals.temporal.trendObservation}
- **Baseline Available:** ${signals.temporal.hasComparableHistoricalData ? "Yes" : "No"}
- **Limitations:** ${signals.temporal.limitations.join(" ")}

---

## 3. Search Engine Coverage & Retrieval Status
| Engine | Status | Items Retrieved | Details |
|---|---|---|---|
${enginesContacted.map(e => `| ${e.engine} | ${e.status} | ${e.itemCount} | ${e.error || "Completed successfully"} |`).join("\n")}

---

## 4. Normalized Primary Evidence Sources (${evidence.length} items)
${evidence.map((item, idx) => `
### [${idx + 1}] ${item.title}
- **Engine:** \`${item.engineLabel}\` (${item.sourceEngine})
- **Type:** \`${item.evidenceType.toUpperCase()}\` | **Status:** \`${item.sourceStatus}\`
- **Relevance:** ${(item.relevanceScore * 100).toFixed(0)}% — *${item.relevanceExplanation}*
- **URL:** [${item.url}](${item.url})
- **Retrieved At:** ${item.retrievedAt}
${item.publishedAt ? `- **Published Date:** ${item.publishedAt}` : ""}
${item.metadata?.authorOrPublisher ? `- **Publication Info:** ${item.metadata.authorOrPublisher}` : ""}
${item.metadata?.citations ? `- **Citations:** ${item.metadata.citations}` : ""}
${item.metadata?.companyName ? `- **Company:** ${item.metadata.companyName} (${item.metadata.location || ""})` : ""}

> ${item.snippet}

*Limitations:* ${item.limitations.join("; ")}
`).join("\n")}

---

## 5. Analytical Limitations & Transparency Notice
${report.disclaimer}
`;
}

export function exportComparisonToMarkdown(comparison: TechnologyComparison): string {
  return `# SignalForge Comparative Technology Radar

**Generated At:** ${new Date(comparison.generatedAt).toUTCString()}  
**Technologies Compared:** ${comparison.technologies.join(" vs ")}

---

## Comparison Matrix

| Technology | Recommendation | Evidence Count | Official Docs | Hiring Demand | Scholarly Citations | Confidence |
|---|---|---|---|---|---|---|
${comparison.matrix.map(m => `| **${m.technology}** | \`${m.recommendation}\` | ${m.evidenceCount} | ${m.webDocsFound ? "Verified" : "Unverified"} | ${m.hiringDemandObserved ? "Observed" : "None"} | ${m.researchCitationsFound ? "Present" : "None"} | ${m.confidence} |`).join("\n")}

---

## Key Observations
${comparison.comparativeObservations.map(o => `- ${o}`).join("\n")}

## Coverage Discrepancies
${comparison.coverageDiscrepancies.map(c => `- ${c}`).join("\n")}

## Methodological Limitations
${comparison.limitations.map(l => `- ${l}`).join("\n")}
`;
}
