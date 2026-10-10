import { ResearchReport } from "@/types/evidence";

// In-memory server-side cache for research reports and raw search results
interface CacheEntry<T> {
  data: T;
  cachedAt: number;
  ttlMs: number;
}

const memoryStore = new Map<string, CacheEntry<any>>();

// Default 24 hours TTL to strictly preserve user's limited SerpApi quota (250/mo)
const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000;

export function getCachedReport(technology: string): ResearchReport | null {
  const key = `report:${technology.trim().toLowerCase()}`;
  const entry = memoryStore.get(key);
  if (!entry) return null;

  const now = Date.now();
  if (now - entry.cachedAt > entry.ttlMs) {
    memoryStore.delete(key);
    return null;
  }

  // Return a cloned report with 'CACHED' status
  const report = JSON.parse(JSON.stringify(entry.data)) as ResearchReport;
  report.mode = 'CACHED';
  report.evidence = report.evidence.map(e => ({
    ...e,
    sourceStatus: 'CACHED' as const
  }));
  return report;
}

export function setCachedReport(technology: string, report: ResearchReport, ttlMs = DEFAULT_TTL_MS): void {
  const key = `report:${technology.trim().toLowerCase()}`;
  memoryStore.set(key, {
    data: report,
    cachedAt: Date.now(),
    ttlMs
  });
}

export function clearReportCache(technology?: string): void {
  if (technology) {
    memoryStore.delete(`report:${technology.trim().toLowerCase()}`);
  } else {
    memoryStore.clear();
  }
}
