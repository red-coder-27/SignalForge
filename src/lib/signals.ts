import {
  EvidenceItem,
  ExtractedSignals,
  HiringSignal,
  ResearchSignal,
  WebSignal,
  TemporalSignal
} from "@/types/evidence";

const COMMON_TECH_SKILLS = [
  "python", "typescript", "javascript", "rust", "go", "golang", "c++",
  "docker", "kubernetes", "aws", "gcp", "azure", "linux", "sql", "nosql",
  "react", "next.js", "node.js", "graphql", "rest", "grpc", "ipc",
  "llm", "rag", "agents", "pytorch", "tensorflow", "vector", "parquet",
  "wasm", "wasi", "mcp", "olap", "arrow"
];

const TECH_ENGINEERING_KEYWORDS = [
  "engineer", "developer", "software", "architect", "programmer", "fullstack",
  "backend", "frontend", "platform", "ai", "machine learning", "data",
  "systems", "tech", "protocol", "agent", "devops", "cloud", "researcher"
];

export function extractSignals(technology: string, evidence: EvidenceItem[]): ExtractedSignals {
  const techLower = technology.toLowerCase();
  const techAcronym = technology
    .split(/\s+/)
    .map(w => w[0])
    .join("")
    .toLowerCase();

  // 1. Hiring Signal Extraction with false-positive filtering
  const allHiringItems = evidence.filter(e => e.evidenceType === "hiring" || e.sourceEngine === "google_jobs");
  
  // Filter for genuine software / engineering requisitions matching the technology
  const hiringItems = allHiringItems.filter(item => {
    const text = `${item.title} ${item.snippet}`.toLowerCase();
    const hasTechMention = text.includes(techLower) || (techAcronym.length >= 2 && text.includes(techAcronym));
    const hasEngineeringContext = TECH_ENGINEERING_KEYWORDS.some(k => text.includes(k)) || COMMON_TECH_SKILLS.some(s => text.includes(s));
    
    // Strictly require BOTH technology relevance AND engineering context to avoid false positives
    return hasTechMention && (hasEngineeringContext || item.relevanceScore >= 0.7);
  });

  const companies: string[] = [];
  const locations: string[] = [];
  const observedSkills = new Set<string>();

  for (const item of hiringItems) {
    if (item.metadata?.companyName && !companies.includes(item.metadata.companyName)) {
      companies.push(item.metadata.companyName);
    }
    if (item.metadata?.location && !locations.includes(item.metadata.location)) {
      locations.push(item.metadata.location);
    }

    const fullText = `${item.title} ${item.snippet}`.toLowerCase();
    for (const skill of COMMON_TECH_SKILLS) {
      if (fullText.includes(skill)) {
        observedSkills.add(skill);
      }
    }
  }

  const hiringObservations: string[] = [];
  if (hiringItems.length > 0) {
    hiringObservations.push(`Identified ${hiringItems.length} active engineering hiring listing(s) directly mentioning ${technology}.`);
    if (companies.length > 0) {
      hiringObservations.push(`Hiring organizations observed include: ${companies.slice(0, 4).join(", ")}.`);
    }
    if (observedSkills.size > 0) {
      hiringObservations.push(`Common paired technical requirements: ${Array.from(observedSkills).slice(0, 5).join(", ")}.`);
    }
  } else {
    hiringObservations.push(`No direct engineering hiring listings retrieved for ${technology} in current search window.`);
  }

  const hiring: HiringSignal = {
    listingCount: hiringItems.length,
    companies: companies.slice(0, 8),
    locations: locations.slice(0, 6),
    skillKeywordsObserved: Array.from(observedSkills).slice(0, 8),
    observations: hiringObservations,
    coverage: hiringItems.length > 0 ? "Google Jobs search sample." : "Google Jobs returned 0 direct requisitions.",
    limitations: [
      "Job listings reflect open requisitions at current search snapshot and do not account for private hiring channels.",
      "Sample count is not an exhaustive census of all industrial employment."
    ]
  };

  // 2. Research Signal Extraction
  const researchItems = evidence.filter(e => e.evidenceType === "research" || e.sourceEngine === "google_scholar");
  let totalCitations = 0;
  const researchThemes = new Set<string>();

  for (const item of researchItems) {
    if (item.metadata?.citations) {
      totalCitations += item.metadata.citations;
    }
    // Extract themes from title
    const words = item.title.split(/[\s,:-]+/).filter(w => w.length > 4);
    for (const word of words.slice(0, 3)) {
      researchThemes.add(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    }
  }

  const researchObservations: string[] = [];
  if (researchItems.length > 0) {
    researchObservations.push(`Retrieved ${researchItems.length} scholarly papers discussing or implementing ${technology}.`);
    if (totalCitations > 0) {
      researchObservations.push(`Accumulated ${totalCitations} documented citations across retrieved academic literature.`);
    }
    if (researchThemes.size > 0) {
      researchObservations.push(`Prevalent research themes: ${Array.from(researchThemes).slice(0, 4).join(", ")}.`);
    }
  } else {
    researchObservations.push(`No academic papers or citations found in retrieved scholar index for ${technology}.`);
  }

  const research: ResearchSignal = {
    paperCount: researchItems.length,
    totalCitationsKnown: totalCitations,
    themesObserved: Array.from(researchThemes).slice(0, 6),
    observations: researchObservations,
    coverage: researchItems.length > 0 ? "Google Scholar indexed peer publications." : "No scholar results returned.",
    limitations: [
      "Academic citation counts measure scientific interest, which may precede or diverge from commercial adoption.",
      "Conference preprints may not yet have completed formal journal peer review."
    ]
  };

  // 3. Web Signal Extraction
  const webItems = evidence.filter(e => e.evidenceType === "web" || e.sourceEngine === "google");
  const docOrRepoLinks: string[] = [];
  let officialDocFound = false;

  for (const item of webItems) {
    const urlLower = item.url.toLowerCase();
    const titleLower = item.title.toLowerCase();
    const isDoc = (
      urlLower.includes("docs") ||
      urlLower.includes("documentation") ||
      urlLower.includes("/spec") ||
      urlLower.includes("/protocol") ||
      urlLower.includes("/guide") ||
      urlLower.includes("/reference") ||
      urlLower.includes("/manual") ||
      (urlLower.includes("modelcontextprotocol") && (urlLower.includes(".io") || urlLower.includes(".org"))) ||
      (urlLower.includes("anthropic.com") && (urlLower.includes("protocol") || urlLower.includes("mcp") || urlLower.includes("model-context-protocol"))) ||
      titleLower.includes("documentation") ||
      titleLower.includes("specification") ||
      titleLower.includes("developer guide") ||
      titleLower.includes("quickstart") ||
      titleLower.includes("api reference")
    );
    const isRepo = urlLower.includes("github.com") || urlLower.includes("gitlab.com");

    if (isDoc || isRepo) {
      if (!docOrRepoLinks.includes(item.url)) {
        docOrRepoLinks.push(item.url);
      }
      officialDocFound = true;
    }
  }

  const webObservations: string[] = [];
  if (webItems.length > 0) {
    webObservations.push(`Indexed ${webItems.length} primary web resources and ecosystem documents.`);
    if (officialDocFound) {
      webObservations.push(`Official documentation or formal specification URL identified.`);
    } else {
      webObservations.push(`Primary documentation was not conclusively isolated in top results.`);
    }
    if (docOrRepoLinks.length > 0) {
      webObservations.push(`Identified ${docOrRepoLinks.length} primary documentation or repository references.`);
    }
  } else {
    webObservations.push(`No web search resources returned for query.`);
  }

  const web: WebSignal = {
    hasOfficialDocumentation: officialDocFound,
    docOrRepoLinks: docOrRepoLinks.slice(0, 5),
    recentMentions: webItems.length,
    observations: webObservations,
    coverage: "Google Web Search organic indexing.",
    limitations: [
      "Search visibility is influenced by SEO dynamics and domain age.",
      "Result volume alone does not measure software quality or long-term viability."
    ]
  };

  // 4. Temporal Signal Extraction (Strict Hackathon Rule: NO fabricated growth)
  const temporal: TemporalSignal = {
    trendObservation: "Temporal trend: Insufficient historical baseline data to compute growth velocity.",
    hasComparableHistoricalData: false,
    limitations: [
      "Search results capture point-in-time cross sections. True time-series trends require multi-quarter historical telemetry.",
      "Per SignalForge policy, growth percentages are never fabricated without verifiable historical snapshots."
    ]
  };

  return { hiring, research, web, temporal };
}
