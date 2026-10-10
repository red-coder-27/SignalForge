import {
  SupportedEngine,
  EvidenceItem
} from "@/types/evidence";

const SERPAPI_ENDPOINT = "https://serpapi.com/search.json";
const TIMEOUT_MS = 9000;

export interface SerpApiSearchOptions {
  query: string;
  engine: SupportedEngine;
  apiKey?: string;
  gl?: string;
  hl?: string;
}

export interface NormalizedEngineResult {
  engine: SupportedEngine;
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED' | 'SKIPPED';
  items: EvidenceItem[];
  durationMs: number;
  error?: string;
}

/**
 * Normalizes and cleans a URL for accurate deduplication.
 */
export function normalizeUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    // Remove typical tracking parameters
    parsed.searchParams.delete("utm_source");
    parsed.searchParams.delete("utm_medium");
    parsed.searchParams.delete("utm_campaign");
    parsed.searchParams.delete("utm_content");
    parsed.searchParams.delete("utm_term");
    parsed.searchParams.delete("ref");
    // Remove hash
    parsed.hash = "";
    // Remove trailing slash
    let clean = parsed.toString();
    if (clean.endsWith("/")) {
      clean = clean.slice(0, -1);
    }
    return clean;
  } catch {
    return rawUrl.trim().replace(/\/+$/, "");
  }
}

/**
 * Calculates a deterministic relevance score between the query and returned text.
 */
export function calculateRelevance(query: string, title: string, snippet: string): { score: number; explanation: string } {
  const qTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
  const titleLower = (title || "").toLowerCase();
  const snippetLower = (snippet || "").toLowerCase();

  let matchesInTitle = 0;
  let matchesInSnippet = 0;

  for (const term of qTerms) {
    if (titleLower.includes(term)) matchesInTitle++;
    if (snippetLower.includes(term)) matchesInSnippet++;
  }

  const titleRatio = qTerms.length > 0 ? matchesInTitle / qTerms.length : 0.5;
  const snippetRatio = qTerms.length > 0 ? matchesInSnippet / qTerms.length : 0.5;

  let baseScore = 0.5 + (titleRatio * 0.35) + (snippetRatio * 0.15);
  baseScore = Math.min(0.99, Math.max(0.4, Number(baseScore.toFixed(2))));

  let explanation = "General keyword match across indexed snippet.";
  if (titleRatio === 1.0) {
    explanation = "Exact technology subject match in primary title.";
  } else if (titleRatio > 0.5) {
    explanation = "High subject relevance with core keyword matching.";
  } else if (snippetRatio > 0.5) {
    explanation = "Relevant technology context found in content snippet.";
  }

  return { score: baseScore, explanation };
}

/**
 * Queries a single SerpApi engine with strict timeout and defensive parsing.
 */
export async function querySerpApiEngine(options: SerpApiSearchOptions): Promise<NormalizedEngineResult> {
  const { query, engine, apiKey, gl = "us", hl = "en" } = options;
  const startTime = Date.now();

  const effectiveKey = apiKey || process.env.SERPAPI_KEY;

  if (!effectiveKey) {
    return {
      engine,
      status: 'SKIPPED',
      items: [],
      durationMs: 0,
      error: "SERPAPI_KEY is not configured on the server."
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const params = new URLSearchParams({
      engine,
      q: query,
      api_key: effectiveKey,
      gl,
      hl,
      num: "6"
    });

    const response = await fetch(`${SERPAPI_ENDPOINT}?${params.toString()}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
      cache: "no-store"
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `HTTP error ${response.status}`;
      try {
        const errJson = await response.json();
        if (errJson.error) {
          errorMessage = errJson.error;
        }
      } catch {
        // ignore json parse error
      }

      // Check for auth or quota exhaustion
      if (response.status === 401 || errorMessage.toLowerCase().includes("invalid api key")) {
        errorMessage = "SerpApi authentication error: Invalid or revoked API key.";
      } else if (response.status === 429 || errorMessage.toLowerCase().includes("quota") || errorMessage.toLowerCase().includes("depleted")) {
        errorMessage = "SerpApi search quota limit reached for this billing period.";
      }

      return {
        engine,
        status: 'FAILED',
        items: [],
        durationMs: Date.now() - startTime,
        error: errorMessage
      };
    }

    const data = await response.json();
    const durationMs = Date.now() - startTime;
    const items: EvidenceItem[] = [];
    const retrievedAt = new Date().toISOString();

    if (engine === "google") {
      const organic = Array.isArray(data.organic_results) ? data.organic_results : [];
      for (let i = 0; i < Math.min(organic.length, 6); i++) {
        const item = organic[i];
        if (!item.link || !item.title) continue;

        const relevance = calculateRelevance(query, item.title, item.snippet || "");
        items.push({
          id: `ev-google-${Date.now()}-${i}`,
          technology: query,
          sourceEngine: "google",
          engineLabel: "Google Search",
          title: item.title,
          snippet: item.snippet || "No description snippet provided by search engine.",
          url: item.link,
          publishedAt: item.date || undefined,
          retrievedAt,
          evidenceType: "web",
          relevanceScore: relevance.score,
          relevanceExplanation: relevance.explanation,
          sourceStatus: "LIVE",
          limitations: [
            "Web search rankings reflect public indexing; commercial maturity should be verified independently."
          ]
        });
      }
    } else if (engine === "google_scholar") {
      const organic = Array.isArray(data.organic_results) ? data.organic_results : [];
      for (let i = 0; i < Math.min(organic.length, 5); i++) {
        const item = organic[i];
        if (!item.title) continue;

        const link = item.link || (item.inline_links && item.inline_links.versions && item.inline_links.versions.link) || `https://scholar.google.com/scholar?q=${encodeURIComponent(item.title)}`;
        const citations = item.inline_links && item.inline_links.cited_by ? Number(item.inline_links.cited_by.total) || 0 : undefined;
        const authorInfo = item.publication_info ? item.publication_info.summary : undefined;

        const relevance = calculateRelevance(query, item.title, item.snippet || "");
        items.push({
          id: `ev-scholar-${Date.now()}-${i}`,
          technology: query,
          sourceEngine: "google_scholar",
          engineLabel: "Google Scholar",
          title: item.title,
          snippet: item.snippet || "Scholarly abstract or summary index.",
          url: link,
          retrievedAt,
          evidenceType: "research",
          relevanceScore: relevance.score,
          relevanceExplanation: relevance.explanation,
          sourceStatus: "LIVE",
          limitations: [
            "Academic paper citation counts can reflect theoretical discussion rather than industrial production readiness."
          ],
          metadata: {
            authorOrPublisher: authorInfo,
            citations
          }
        });
      }
    } else if (engine === "google_jobs") {
      const jobs = Array.isArray(data.jobs_results) ? data.jobs_results : [];
      for (let i = 0; i < Math.min(jobs.length, 5); i++) {
        const item = jobs[i];
        if (!item.title) continue;

        const link = item.share_link || (item.related_links && item.related_links[0] && item.related_links[0].link) || `https://www.google.com/search?q=${encodeURIComponent(query + " jobs")}`;
        const relevance = calculateRelevance(query, item.title, item.description || "");

        items.push({
          id: `ev-jobs-${Date.now()}-${i}`,
          technology: query,
          sourceEngine: "google_jobs",
          engineLabel: "Google Jobs",
          title: item.title,
          snippet: item.description ? item.description.slice(0, 300) + "..." : "No job listing description snippet provided.",
          url: link,
          retrievedAt,
          evidenceType: "hiring",
          relevanceScore: relevance.score,
          relevanceExplanation: relevance.explanation,
          sourceStatus: "LIVE",
          limitations: [
            "Job postings represent open hiring requisitions at point in time, subject to geographical and aggregator variation."
          ],
          metadata: {
            companyName: item.company_name,
            location: item.location,
            viaPlatform: item.via
          }
        });
      }
    }

    return {
      engine,
      status: items.length > 0 ? 'SUCCESS' : 'PARTIAL',
      items,
      durationMs,
      error: items.length === 0 ? "No search results returned for query on this engine." : undefined
    };

  } catch (err: any) {
    clearTimeout(timeoutId);
    const durationMs = Date.now() - startTime;
    const isTimeout = err.name === "AbortError";
    return {
      engine,
      status: 'FAILED',
      items: [],
      durationMs,
      error: isTimeout ? `Request timed out after ${TIMEOUT_MS}ms.` : (err.message || "Network request error.")
    };
  }
}

/**
 * Deduplicates evidence items based on normalized URL and near-identical titles.
 */
export function deduplicateEvidence(items: EvidenceItem[]): EvidenceItem[] {
  const seenUrls = new Set<string>();
  const seenTitles = new Set<string>();
  const deduplicated: EvidenceItem[] = [];

  for (const item of items) {
    const cleanUrl = normalizeUrl(item.url);
    const cleanTitle = item.title.toLowerCase().replace(/[^a-z0-9]/g, "");

    if (seenUrls.has(cleanUrl) || (cleanTitle.length > 10 && seenTitles.has(cleanTitle))) {
      continue;
    }

    seenUrls.add(cleanUrl);
    if (cleanTitle.length > 10) {
      seenTitles.add(cleanTitle);
    }
    deduplicated.push({
      ...item,
      url: cleanUrl
    });
  }

  return deduplicated;
}
