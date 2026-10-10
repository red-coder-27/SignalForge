import { ResearchReport } from "@/types/evidence";

export const FIXTURE_MCP: ResearchReport = {
  technology: "Model Context Protocol",
  queryTimestamp: "2026-10-10T12:00:00.000Z",
  executionTimeMs: 420,
  mode: "DEMO FIXTURE",
  totalSourcesExamined: 18,
  deduplicatedSourcesCount: 12,
  disclaimer: "This research was generated from verified synthetic demonstration fixtures. Use Live Mode with SERPAPI_KEY for real-time live retrieval.",
  enginesContacted: [
    { engine: "google", status: "SUCCESS", itemCount: 5, durationMs: 210 },
    { engine: "google_scholar", status: "SUCCESS", itemCount: 3, durationMs: 340 },
    { engine: "google_jobs", status: "SUCCESS", itemCount: 4, durationMs: 290 }
  ],
  evidence: [
    {
      id: "ev-mcp-1",
      technology: "Model Context Protocol",
      sourceEngine: "google",
      engineLabel: "Google Search",
      title: "Model Context Protocol (MCP) - Anthropic Official Documentation",
      snippet: "MCP is an open standard that enables developers to build secure, two-way connections between their data sources and AI-powered tools. Documentation and SDKs available for TypeScript and Python.",
      url: "https://modelcontextprotocol.io/introduction",
      publishedAt: "2024-11-25",
      retrievedAt: "2026-10-10T12:00:00.000Z",
      evidenceType: "web",
      relevanceScore: 0.98,
      relevanceExplanation: "Official primary documentation and protocol specification.",
      sourceStatus: "DEMO FIXTURE",
      limitations: ["Self-published documentation by protocol creators; reflects intended architectural design."]
    },
    {
      id: "ev-mcp-2",
      technology: "Model Context Protocol",
      sourceEngine: "google",
      engineLabel: "Google Search",
      title: "GitHub - modelcontextprotocol/servers: Model Context Protocol Reference Servers",
      snippet: "Repository of reference MCP servers including Postgres, SQLite, Filesystem, GitHub, Brave Search, and Slack integrations. Open source under MIT license.",
      url: "https://github.com/modelcontextprotocol/servers",
      publishedAt: "2024-11-25",
      retrievedAt: "2026-10-10T12:00:00.000Z",
      evidenceType: "web",
      relevanceScore: 0.95,
      relevanceExplanation: "Primary source code repository showing active server implementations and open ecosystem.",
      sourceStatus: "DEMO FIXTURE",
      limitations: ["Commit counts and stars alone do not guarantee enterprise stability in production."]
    },
    {
      id: "ev-mcp-3",
      technology: "Model Context Protocol",
      sourceEngine: "google",
      engineLabel: "Google Search",
      title: "Building MCP Clients: How IDEs and Agents Integrate Data",
      snippet: "Guide on embedding Model Context Protocol clients within desktop developer environments, AI coding assistants, and orchestration pipelines.",
      url: "https://developers.anthropic.com/docs/mcp-client-architecture",
      publishedAt: "2024-12-05",
      retrievedAt: "2026-10-10T12:00:00.000Z",
      evidenceType: "web",
      relevanceScore: 0.88,
      relevanceExplanation: "Developer integration guide detailing client-server handshake and tool invocation semantics.",
      sourceStatus: "DEMO FIXTURE",
      limitations: ["Focuses primarily on Claude Desktop and select early clients."]
    },
    {
      id: "ev-mcp-4",
      technology: "Model Context Protocol",
      sourceEngine: "google_scholar",
      engineLabel: "Google Scholar",
      title: "Standardized Context Exchange: Decoupling Tool Interfaces in Multi-Agent Systems",
      snippet: "We evaluate standardized context interchange protocols across 14 LLM agent frameworks, measuring latency reduction and error recovery in tool orchestration.",
      url: "https://arxiv.org/abs/2501.08942",
      publishedAt: "2025-01-14",
      retrievedAt: "2026-10-10T12:00:00.000Z",
      evidenceType: "research",
      relevanceScore: 0.82,
      relevanceExplanation: "Preprint evaluating protocol performance and architectural trade-offs.",
      sourceStatus: "DEMO FIXTURE",
      limitations: ["Academic laboratory benchmark; preliminary peer review status."],
      metadata: { authorOrPublisher: "K. Chen, R. Nair, D. Hoffman (arXiv:2501.08942)", citations: 14 }
    },
    {
      id: "ev-mcp-5",
      technology: "Model Context Protocol",
      sourceEngine: "google_scholar",
      engineLabel: "Google Scholar",
      title: "Security and Isolation in Agent Protocol Architectures: A Threat Model",
      snippet: "Analysis of sandboxing vulnerabilities, prompt injection propagation, and privilege escalation in bidirectional client-server agent protocols.",
      url: "https://scholar.google.com/citations?view_op=view_citation&id=mcp-threat-2025",
      publishedAt: "2025-02-18",
      retrievedAt: "2026-10-10T12:00:00.000Z",
      evidenceType: "research",
      relevanceScore: 0.79,
      relevanceExplanation: "Security analysis highlighting operational risks in untrusted MCP server deployment.",
      sourceStatus: "DEMO FIXTURE",
      limitations: ["Focuses on adversary simulation rather than deployment frequency."],
      metadata: { authorOrPublisher: "M. Varma et al. (IEEE AI Security Symposium)", citations: 6 }
    },
    {
      id: "ev-mcp-6",
      technology: "Model Context Protocol",
      sourceEngine: "google_jobs",
      engineLabel: "Google Jobs",
      title: "Senior AI Platform Engineer - Agent Protocols & Tooling",
      snippet: "Seeking engineers experienced in building agent tool connectors, Model Context Protocol (MCP) servers, and scalable retrieval pipelines with TypeScript and Python.",
      url: "https://www.linkedin.com/jobs/view/ai-platform-mcp-engineer-101",
      publishedAt: "2026-09-28",
      retrievedAt: "2026-10-10T12:00:00.000Z",
      evidenceType: "hiring",
      relevanceScore: 0.86,
      relevanceExplanation: "Explicit employer demand citing MCP implementation skills.",
      sourceStatus: "DEMO FIXTURE",
      limitations: ["Sample of single open requisition; geographical distribution unknown."],
      metadata: { companyName: "Nexus AI Labs", location: "San Francisco, CA / Remote", viaPlatform: "LinkedIn" }
    },
    {
      id: "ev-mcp-7",
      technology: "Model Context Protocol",
      sourceEngine: "google_jobs",
      engineLabel: "Google Jobs",
      title: "Staff Software Engineer, Developer Infrastructure",
      snippet: "Design next-gen enterprise SDKs. Qualifications include hands-on experience integrating LLM context protocols (MCP, LangChain tools) and secure IPC transports.",
      url: "https://www.indeed.com/viewjob?jk=mcp-staff-infra-2026",
      publishedAt: "2026-10-02",
      retrievedAt: "2026-10-10T12:00:00.000Z",
      evidenceType: "hiring",
      relevanceScore: 0.81,
      relevanceExplanation: "Enterprise software infrastructure listing requiring protocol integration.",
      sourceStatus: "DEMO FIXTURE",
      limitations: ["Broader infra role with MCP listed alongside other frameworks."],
      metadata: { companyName: "CloudScale Systems", location: "Bengaluru, India / Hybrid", viaPlatform: "Indeed" }
    }
  ],
  signals: {
    hiring: {
      listingCount: 2,
      companies: ["Nexus AI Labs", "CloudScale Systems"],
      locations: ["San Francisco, CA / Remote", "Bengaluru, India / Hybrid"],
      skillKeywordsObserved: ["MCP servers", "TypeScript", "Python", "IPC transports", "LLM context protocols"],
      observations: [
        "Identified 2 job postings directly referencing Model Context Protocol implementation.",
        "Demand centers on AI platform and developer infrastructure engineering.",
        "Commonly paired with TypeScript, Python, and secure IPC transports."
      ],
      coverage: "Sample derived from Google Jobs query; covers select technology companies.",
      limitations: ["Small sample size; hiring volume is emerging rather than widespread commodity demand."]
    },
    research: {
      paperCount: 2,
      totalCitationsKnown: 20,
      themesObserved: ["Agent standardization", "Security isolation & threat modeling", "Latency benchmarks"],
      observations: [
        "Academic literature focuses on multi-agent protocol decoupling and security threat models.",
        "Total 20 citations recorded across indexed preprints."
      ],
      coverage: "Google Scholar search across computer science archives.",
      limitations: ["Most research is recent (late 2024–2025); long-term longitudinal studies not yet available."]
    },
    web: {
      hasOfficialDocumentation: true,
      docOrRepoLinks: ["https://modelcontextprotocol.io/introduction", "https://github.com/modelcontextprotocol/servers"],
      recentMentions: 3,
      observations: [
        "Official specification and documentation actively maintained.",
        "Open source ecosystem with dozens of community and official server connectors.",
        "Broad support across IDEs and coding agents."
      ],
      coverage: "Primary web results and open source repositories.",
      limitations: ["Rapidly evolving specification may result in breaking changes between minor versions."]
    },
    temporal: {
      trendObservation: "Protocol introduced in late 2024; adoption accelerating across agent developer tooling through 2025–2026.",
      hasComparableHistoricalData: false,
      limitations: ["Insufficient historical baseline to establish multi-year growth velocity curves."]
    }
  },
  recommendation: {
    outcome: "BUILD",
    summary: "Model Context Protocol possesses official documentation, reference server implementations, peer research on protocol security, and emerging hiring demand. It is suitable for bounded experimentation and tool building.",
    supportingObservations: [
      "Official specification and reference server repository actively maintained at modelcontextprotocol.io.",
      "Verified hiring listings requesting hands-on MCP server and client development skills.",
      "Peer research benchmarks confirm protocol efficiency, with explicit security threat models available to guide implementation."
    ],
    contradictoryOrMissingEvidence: [
      "Protocol is relatively young (post-late 2024); standardized enterprise governance is still solidifying.",
      "Security threat models highlight sandbox risks when running untrusted third-party servers."
    ],
    sourceCoverage: [
      { engine: "google", label: "Google Search", status: "SUCCESS", itemCount: 3, note: "Official spec and documentation confirmed" },
      { engine: "google_scholar", label: "Google Scholar", status: "SUCCESS", itemCount: 2, note: "Architectural & security papers identified" },
      { engine: "google_jobs", label: "Google Jobs", status: "SUCCESS", itemCount: 2, note: "Verified active requisitions" }
    ],
    exactRule: "RULE_BUILD_VALIDATED: Official primary docs present + Active developer ecosystem + Observed employer hiring demand + Peer research identified.",
    ruleId: "SF-RULE-001",
    evidenceToImproveConfidence: [
      "Conduct long-term production reliability benchmarks under heavy IPC load.",
      "Monitor enterprise security audit reports for third-party connector isolation."
    ],
    confidenceLevel: "HIGH",
    limitationDisclaimer: "Analysis is based on indexed search and academic surfaces at the time of retrieval. It does not constitute commercial market validation or an investment guarantee."
  }
};

export const FIXTURE_WASM: ResearchReport = {
  technology: "WebAssembly",
  queryTimestamp: "2026-10-10T12:00:00.000Z",
  executionTimeMs: 460,
  mode: "DEMO FIXTURE",
  totalSourcesExamined: 24,
  deduplicatedSourcesCount: 16,
  disclaimer: "This research was generated from verified synthetic demonstration fixtures. Use Live Mode with SERPAPI_KEY for real-time live retrieval.",
  enginesContacted: [
    { engine: "google", status: "SUCCESS", itemCount: 6, durationMs: 230 },
    { engine: "google_scholar", status: "SUCCESS", itemCount: 5, durationMs: 310 },
    { engine: "google_jobs", status: "SUCCESS", itemCount: 5, durationMs: 270 }
  ],
  evidence: [
    {
      id: "ev-wasm-1",
      technology: "WebAssembly",
      sourceEngine: "google",
      engineLabel: "Google Search",
      title: "WebAssembly Specification - W3C Recommendation",
      snippet: "WebAssembly defines a binary code format and a corresponding text format for executable code in web and standalone environments, designed for native execution speeds.",
      url: "https://www.w3.org/TR/wasm-core-2/",
      publishedAt: "2024-04-12",
      retrievedAt: "2026-10-10T12:00:00.000Z",
      evidenceType: "web",
      relevanceScore: 0.99,
      relevanceExplanation: "Official international standard specification by W3C.",
      sourceStatus: "DEMO FIXTURE",
      limitations: ["Formal specification document; does not capture runtime implementation ergonomics."]
    },
    {
      id: "ev-wasm-2",
      technology: "WebAssembly",
      sourceEngine: "google_scholar",
      engineLabel: "Google Scholar",
      title: "Bringing the Web up to Speed with WebAssembly",
      snippet: "The seminal paper presenting WebAssembly's design, formal semantics, and browser performance evaluations demonstrating near-native execution efficiency.",
      url: "https://dl.acm.org/doi/10.1145/3062341.3062363",
      publishedAt: "2017-06-18",
      retrievedAt: "2026-10-10T12:00:00.000Z",
      evidenceType: "research",
      relevanceScore: 0.95,
      relevanceExplanation: "Foundational peer-reviewed academic publication with massive academic consensus.",
      sourceStatus: "DEMO FIXTURE",
      limitations: ["Initial publication dated 2017; subsequent WASI extensions addressed in later literature."],
      metadata: { authorOrPublisher: "A. Haas, A. Rossberg et al. (PLDI 2017)", citations: 1420 }
    },
    {
      id: "ev-wasm-3",
      technology: "WebAssembly",
      sourceEngine: "google_jobs",
      engineLabel: "Google Jobs",
      title: "Principal Systems Engineer (WebAssembly / WASI)",
      snippet: "Architect high-performance distributed edge runtimes using Rust and WebAssembly Component Model. Experience with Wasmtime or Wasmer required.",
      url: "https://boards.greenhouse.io/fastly/jobs/wasm-systems-eng",
      publishedAt: "2026-09-15",
      retrievedAt: "2026-10-10T12:00:00.000Z",
      evidenceType: "hiring",
      relevanceScore: 0.91,
      relevanceExplanation: "Mature edge infrastructure hiring requiring deep systems-level Wasm experience.",
      sourceStatus: "DEMO FIXTURE",
      limitations: ["Specialized systems engineering role with high experience bar."],
      metadata: { companyName: "Cloud Edge Networks", location: "Remote, US/EU", viaPlatform: "Greenhouse" }
    }
  ],
  signals: {
    hiring: {
      listingCount: 5,
      companies: ["Cloud Edge Networks", "BrowserTech", "Fintech HighFreq"],
      locations: ["Remote", "London, UK", "Bengaluru, India"],
      skillKeywordsObserved: ["Wasmtime", "WASI", "Rust", "C++", "Component Model", "Sandboxing"],
      observations: [
        "Mature hiring demand across cloud edge runtimes, browser engine engineering, and high-performance computing.",
        "Strong cross-correlation with Rust and C++ compilation toolchains."
      ],
      coverage: "Google Jobs international search.",
      limitations: ["High technical barrier; hiring tends toward senior systems specialists."]
    },
    research: {
      paperCount: 5,
      totalCitationsKnown: 2850,
      themesObserved: ["Formal semantics", "WASI sandboxing", "Component Model interoperability", "JIT compilation"],
      observations: [
        "Extensive scholarly literature with thousands of citations spanning 8+ years.",
        "Deep formal verification and compiler architecture research."
      ],
      coverage: "Google Scholar comprehensive archive.",
      limitations: ["Academic benchmarks may not reflect developer experience in web applications."]
    },
    web: {
      hasOfficialDocumentation: true,
      docOrRepoLinks: ["https://www.w3.org/TR/wasm-core-2/", "https://webassembly.org/"],
      recentMentions: 6,
      observations: [
        "W3C standard with complete browser vendor consensus (Chrome, Firefox, Safari, Edge).",
        "Ecosystem expanding beyond the browser into WASI serverless and plugin architectures."
      ],
      coverage: "Official standards bodies and vendor docs.",
      limitations: ["Component Model tooling is still maturing for non-Rust languages."]
    },
    temporal: {
      trendObservation: "Established W3C standard since 2017 with mature production adoption and continued evolution via WASI.",
      hasComparableHistoricalData: true,
      limitations: ["Search volume reflects maturity rather than early-stage hype cycles."]
    }
  },
  recommendation: {
    outcome: "BUILD",
    summary: "WebAssembly is an established, standardized technology with mature academic consensus, comprehensive cross-browser support, and strong industry hiring across edge compute and systems engineering.",
    supportingObservations: [
      "W3C official standard with universal browser vendor adoption.",
      "High academic citation density (>2,800 verified citations) and formal verification.",
      "Consistent employer demand for systems, edge, and browser compilation."
    ],
    contradictoryOrMissingEvidence: [
      "Complex toolchain ergonomics when debugging across non-Rust language barriers."
    ],
    sourceCoverage: [
      { engine: "google", label: "Google Search", status: "SUCCESS", itemCount: 6, note: "W3C standard validated" },
      { engine: "google_scholar", label: "Google Scholar", status: "SUCCESS", itemCount: 5, note: "Massive citation foundation" },
      { engine: "google_jobs", label: "Google Jobs", status: "SUCCESS", itemCount: 5, note: "Strong systems hiring" }
    ],
    exactRule: "RULE_BUILD_STANDARDIZED: International standard + Massive peer research (>500 citations) + Persistent enterprise hiring demand.",
    ruleId: "SF-RULE-002",
    evidenceToImproveConfidence: [
      "Track adoption rates of the WebAssembly Component Model across cloud platforms."
    ],
    confidenceLevel: "HIGH",
    limitationDisclaimer: "Analysis is based on indexed search and academic surfaces at the time of retrieval. It does not constitute commercial market validation or an investment guarantee."
  }
};

export const FIXTURE_DUCKDB: ResearchReport = {
  technology: "DuckDB",
  queryTimestamp: "2026-10-10T12:00:00.000Z",
  executionTimeMs: 390,
  mode: "DEMO FIXTURE",
  totalSourcesExamined: 20,
  deduplicatedSourcesCount: 14,
  disclaimer: "This research was generated from verified synthetic demonstration fixtures. Use Live Mode with SERPAPI_KEY for real-time live retrieval.",
  enginesContacted: [
    { engine: "google", status: "SUCCESS", itemCount: 5, durationMs: 200 },
    { engine: "google_scholar", status: "SUCCESS", itemCount: 4, durationMs: 280 },
    { engine: "google_jobs", status: "SUCCESS", itemCount: 4, durationMs: 250 }
  ],
  evidence: [
    {
      id: "ev-duck-1",
      technology: "DuckDB",
      sourceEngine: "google",
      engineLabel: "Google Search",
      title: "DuckDB - An in-process SQL OLAP database management system",
      snippet: "DuckDB is an in-process SQL OLAP DBMS designed to be fast, reliable, portable, and easy to use. Provides rich SQL support and seamless integration with Python, R, Java, and Node.js.",
      url: "https://duckdb.org/",
      publishedAt: "2024-06-03",
      retrievedAt: "2026-10-10T12:00:00.000Z",
      evidenceType: "web",
      relevanceScore: 0.98,
      relevanceExplanation: "Official project homepage and release notes.",
      sourceStatus: "DEMO FIXTURE",
      limitations: ["Project documentation highlights optimal use-cases; concurrent writes have architectural limitations."]
    },
    {
      id: "ev-duck-2",
      technology: "DuckDB",
      sourceEngine: "google_scholar",
      engineLabel: "Google Scholar",
      title: "DuckDB: an Embeddable Analytical Database",
      snippet: "Mark Raasveldt and Hannes Mühleisen introduce DuckDB, presenting its columnar vectorized execution engine, zero-copy integration with Apache Arrow, and benchmarking results.",
      url: "https://dl.acm.org/doi/10.1145/3318464.3386134",
      publishedAt: "2019-06-30",
      retrievedAt: "2026-10-10T12:00:00.000Z",
      evidenceType: "research",
      relevanceScore: 0.94,
      relevanceExplanation: "SIGMOD conference paper detailing execution architecture.",
      sourceStatus: "DEMO FIXTURE",
      limitations: ["Peer review covers early architecture; version 1.0 added significant storage and query capabilities."],
      metadata: { authorOrPublisher: "M. Raasveldt, H. Mühleisen (ACM SIGMOD)", citations: 320 }
    },
    {
      id: "ev-duck-3",
      technology: "DuckDB",
      sourceEngine: "google_jobs",
      engineLabel: "Google Jobs",
      title: "Data Analytics Engineer (DuckDB, dbt, Python)",
      snippet: "Build low-latency local data pipelines and analytical dashboards using DuckDB, MotherDuck, dbt, and Parquet on AWS S3.",
      url: "https://jobs.lever.co/modern-data/duckdb-analyst",
      publishedAt: "2026-09-20",
      retrievedAt: "2026-10-10T12:00:00.000Z",
      evidenceType: "hiring",
      relevanceScore: 0.89,
      relevanceExplanation: "Direct employer requirement for modern data stack engineer skilled in DuckDB.",
      sourceStatus: "DEMO FIXTURE",
      limitations: ["Specific data engineering sub-discipline; not applicable to transactional OLTP."],
      metadata: { companyName: "Vector Analytics", location: "New York, NY / Hybrid", viaPlatform: "Lever" }
    }
  ],
  signals: {
    hiring: {
      listingCount: 4,
      companies: ["Vector Analytics", "FinMetrics", "DataMesh Group"],
      locations: ["New York, NY", "London, UK", "Remote"],
      skillKeywordsObserved: ["Parquet", "dbt", "MotherDuck", "Python data science", "OLAP", "Apache Arrow"],
      observations: [
        "Rapid growth in data engineering job descriptions replacing heavy local Spark/Postgres with DuckDB for analytical workflows.",
        "Strong synergy with Parquet and Arrow workflows."
      ],
      coverage: "Google Jobs listings in analytics and data engineering.",
      limitations: ["Specialized for analytical query workloads, not transactional OLTP."]
    },
    research: {
      paperCount: 4,
      totalCitationsKnown: 480,
      themesObserved: ["Vectorized execution", "In-process analytical database", "Zero-copy Arrow interop"],
      observations: [
        "Originating from CWI research institute with robust SIGMOD peer review pedigree.",
        "Over 480 academic citations evaluating embedded OLAP."
      ],
      coverage: "ACM / IEEE / Google Scholar indexed papers.",
      limitations: ["Research focuses on engine benchmarks rather than cloud deployment ops."]
    },
    web: {
      hasOfficialDocumentation: true,
      docOrRepoLinks: ["https://duckdb.org/", "https://github.com/duckdb/duckdb"],
      recentMentions: 5,
      observations: [
        "Milestone 1.0 released in 2024; active community extensions and client libraries across all major languages.",
        "Extensive documentation, interactive Wasm demo on web, and ecosystem adoption."
      ],
      coverage: "Documentation, GitHub, and data community blogs.",
      limitations: ["Single-writer storage format imposes concurrency constraints."]
    },
    temporal: {
      trendObservation: "Transitioned from research prototype (2019) to widely adopted standard analytical tool (2024-2026).",
      hasComparableHistoricalData: true,
      limitations: ["Historical data reflects open-source project milestones rather than broader market revenues."]
    }
  },
  recommendation: {
    outcome: "BUILD",
    summary: "DuckDB has reached 1.0+ stability, validated by strong peer-reviewed academic foundations (SIGMOD), extensive ecosystem integration (Python, Arrow, dbt), and growing enterprise analytics hiring.",
    supportingObservations: [
      "In-process execution model provides exceptional analytical performance without operational overhead.",
      "Proven academic origin with >480 citations and rigorous vectorized execution engine design.",
      "Active corporate adoption and hiring across modern analytics data stacks."
    ],
    contradictoryOrMissingEvidence: [
      "Not designed for transactional concurrency or multi-writer OLTP databases."
    ],
    sourceCoverage: [
      { engine: "google", label: "Google Search", status: "SUCCESS", itemCount: 5, note: "Version 1.0+ stability confirmed" },
      { engine: "google_scholar", label: "Google Scholar", status: "SUCCESS", itemCount: 4, note: "CWI & SIGMOD research verified" },
      { engine: "google_jobs", label: "Google Jobs", status: "SUCCESS", itemCount: 4, note: "Active data stack hiring observed" }
    ],
    exactRule: "RULE_BUILD_PRODUCTION_READY: Version 1.0+ stability + Multi-language SDKs + Robust peer citations + Active enterprise hiring demand.",
    ruleId: "SF-RULE-003",
    evidenceToImproveConfidence: [
      "Benchmark concurrent read performance against distributed cloud warehouses."
    ],
    confidenceLevel: "HIGH",
    limitationDisclaimer: "Analysis is based on indexed search and academic surfaces at the time of retrieval. It does not constitute commercial market validation or an investment guarantee."
  }
};

export const FIXTURE_REGISTRY: Record<string, ResearchReport> = {
  "model context protocol": FIXTURE_MCP,
  "mcp": FIXTURE_MCP,
  "webassembly": FIXTURE_WASM,
  "wasm": FIXTURE_WASM,
  "duckdb": FIXTURE_DUCKDB
};

export function getFixtureForQuery(query: string): ResearchReport | null {
  const normalized = query.trim().toLowerCase();
  return FIXTURE_REGISTRY[normalized] || null;
}
