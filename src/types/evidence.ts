export type SupportedEngine = 'google' | 'google_scholar' | 'google_jobs' | 'google_patents';

export type EvidenceType = 'web' | 'research' | 'hiring' | 'patent';

export type SourceStatus = 'LIVE' | 'CACHED' | 'DEMO FIXTURE';

export interface EvidenceItem {
  id: string;
  technology: string;
  sourceEngine: SupportedEngine;
  engineLabel: string;
  title: string;
  snippet: string;
  url: string;
  publishedAt?: string;
  retrievedAt: string;
  evidenceType: EvidenceType;
  relevanceScore: number; // 0 to 1
  relevanceExplanation: string;
  sourceStatus: SourceStatus;
  limitations: string[];
  metadata?: {
    authorOrPublisher?: string;
    citations?: number;
    companyName?: string;
    location?: string;
    filingDate?: string;
    patentNumber?: string;
    viaPlatform?: string;
  };
}

export interface HiringSignal {
  listingCount: number;
  companies: string[];
  locations: string[];
  skillKeywordsObserved: string[];
  observations: string[];
  coverage: string;
  limitations: string[];
}

export interface ResearchSignal {
  paperCount: number;
  totalCitationsKnown: number;
  themesObserved: string[];
  observations: string[];
  coverage: string;
  limitations: string[];
}

export interface WebSignal {
  hasOfficialDocumentation: boolean;
  docOrRepoLinks: string[];
  recentMentions: number;
  observations: string[];
  coverage: string;
  limitations: string[];
}

export interface TemporalSignal {
  trendObservation: string;
  hasComparableHistoricalData: boolean;
  limitations: string[];
}

export interface ExtractedSignals {
  hiring: HiringSignal;
  research: ResearchSignal;
  web: WebSignal;
  temporal: TemporalSignal;
}

export type RecommendationOutcome = 'LEARN' | 'BUILD' | 'MONITOR' | 'INVESTIGATE';

export interface SourceCoverageItem {
  engine: SupportedEngine;
  label: string;
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED' | 'SKIPPED';
  itemCount: number;
  note: string;
}

export interface RecommendationExplanation {
  outcome: RecommendationOutcome;
  summary: string;
  supportingObservations: string[];
  contradictoryOrMissingEvidence: string[];
  sourceCoverage: SourceCoverageItem[];
  exactRule: string;
  ruleId: string;
  evidenceToImproveConfidence: string[];
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  limitationDisclaimer: string;
}

export interface EngineContactStatus {
  engine: SupportedEngine;
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED' | 'SKIPPED';
  itemCount: number;
  durationMs: number;
  error?: string;
}

export interface ResearchReport {
  technology: string;
  queryTimestamp: string;
  executionTimeMs: number;
  mode: SourceStatus;
  totalSourcesExamined: number;
  deduplicatedSourcesCount: number;
  evidence: EvidenceItem[];
  signals: ExtractedSignals;
  recommendation: RecommendationExplanation;
  enginesContacted: EngineContactStatus[];
  disclaimer: string;
}

export interface TechnologyComparison {
  technologies: string[];
  generatedAt: string;
  reports: Record<string, ResearchReport>;
  matrix: {
    technology: string;
    recommendation: RecommendationOutcome;
    evidenceCount: number;
    webDocsFound: boolean;
    hiringDemandObserved: boolean;
    researchCitationsFound: boolean;
    confidence: 'HIGH' | 'MEDIUM' | 'LOW';
    keyLimitation: string;
  }[];
  comparativeObservations: string[];
  coverageDiscrepancies: string[];
  limitations: string[];
}
