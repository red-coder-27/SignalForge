"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { SearchBox } from "@/components/SearchBox";
import { RecommendationCard } from "@/components/RecommendationCard";
import { SignalCards } from "@/components/SignalCards";
import { SourceCoverageBar } from "@/components/SourceCoverageBar";
import { EvidenceExplorer } from "@/components/EvidenceExplorer";
import { ComparisonView } from "@/components/ComparisonView";
import { ExportModal } from "@/components/ExportModal";
import { MethodologyModal } from "@/components/MethodologyModal";
import { ResearchReport } from "@/types/evidence";
import {
  Download,
  Bookmark,
  BookmarkCheck,
  Compass,
  AlertCircle,
  Loader2,
  Trash2,
  X,
  History as HistoryIcon
} from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"radar" | "compare" | "methodology">("radar");
  const [report, setReport] = useState<ResearchReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // Modals & Panels
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Local storage history
  const [savedReports, setSavedReports] = useState<ResearchReport[]>([]);

  // 1. Initial health check & local history hydration
  useEffect(() => {
    // Hydrate saved history
    try {
      const stored = localStorage.getItem("signalforge_history");
      if (stored) {
        setSavedReports(JSON.parse(stored));
      }
    } catch {
      // ignore
    }

    // Check API health and initialize search with matching demo state
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        const keyPresent = Boolean(data.hasSerpApiKey);
        setHasApiKey(keyPresent);
        const demo = !keyPresent;
        setIsDemoMode(demo);
        handleSearch("Model Context Protocol", demo, false);
      })
      .catch(() => {
        setHasApiKey(false);
        setIsDemoMode(true);
        handleSearch("Model Context Protocol", true, false);
      });
  }, []);

  // Save report to local storage
  const handleSaveToHistory = () => {
    if (!report) return;
    const exists = savedReports.some(
      (r) => r.technology.toLowerCase() === report.technology.toLowerCase()
    );
    let updated: ResearchReport[];
    if (exists) {
      updated = savedReports.map((r) =>
        r.technology.toLowerCase() === report.technology.toLowerCase() ? report : r
      );
    } else {
      updated = [report, ...savedReports.slice(0, 9)];
    }
    setSavedReports(updated);
    try {
      localStorage.setItem("signalforge_history", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleDeleteHistory = (tech: string) => {
    const updated = savedReports.filter(
      (r) => r.technology.toLowerCase() !== tech.toLowerCase()
    );
    setSavedReports(updated);
    try {
      localStorage.setItem("signalforge_history", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Perform Research
  const handleSearch = async (
    technology: string,
    isDemo: boolean,
    forceRefresh: boolean
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          technology,
          demo: isDemo,
          refresh: forceRefresh,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP request error: ${res.status}`);
      }

      const data: ResearchReport = await res.json();
      setReport(data);
    } catch (err: any) {
      setError(err.message || "Failed to complete technology research.");
    } finally {
      setIsLoading(false);
    }
  };

  const isCurrentSaved =
    report &&
    savedReports.some(
      (r) => r.technology.toLowerCase() === report.technology.toLowerCase()
    );

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100">
      {/* Top Navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === "methodology") {
            setIsMethodologyOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        hasApiKey={hasApiKey}
        historyCount={savedReports.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
        {activeTab === "radar" && (
          <>
            {/* Hero & Search Header */}
            <section className="text-center space-y-4 pt-2 pb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 text-xs font-mono">
                <Compass className="w-3.5 h-3.5 text-indigo-400" />
                <span>Multi-Source Live Evidence Analysis via SerpApi</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto">
                Find the signal. Verify the evidence.{" "}
                <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
                  Decide what to build next.
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
                Turn noisy search results into transparent, evidence-backed next steps (BUILD, LEARN, MONITOR, INVESTIGATE) across Google Search, Google Scholar, and Google Jobs.
              </p>

              {/* Search Bar */}
              <div className="pt-3">
                <SearchBox
                  onSearch={handleSearch}
                  isLoading={isLoading}
                  hasApiKey={hasApiKey}
                  isDemoMode={isDemoMode}
                  onToggleDemoMode={setIsDemoMode}
                  defaultTopic={report?.technology || "Model Context Protocol"}
                />
              </div>
            </section>

            {/* Error Message */}
            {error && (
              <div className="max-w-3xl mx-auto p-4 rounded-2xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
                <div className="space-y-1">
                  <h4 className="font-semibold text-rose-200">Research Interrupted</h4>
                  <p className="text-xs leading-relaxed">{error}</p>
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="py-16 text-center space-y-4">
                <div className="relative inline-flex items-center justify-center">
                  <Loader2 className="w-10 h-10 animate-spin text-indigo-400" />
                  <span className="absolute animate-ping inline-flex h-8 w-8 rounded-full bg-indigo-500 opacity-20"></span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-200">
                    Retrieving Live Search Evidence
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    Contacting Google Search, Google Scholar, and Google Jobs engines via SerpApi, deduplicating URLs, and extracting deterministic signals...
                  </p>
                </div>
              </div>
            )}

            {/* Complete Report Vertical Slice */}
            {report && !isLoading && (
              <section className="space-y-8 animate-in fade-in duration-300">
                {/* Actions Top Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
                  <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2">
                      <span>{report.technology}</span>
                      <span className="text-xs font-mono font-medium text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-full">
                        {report.evidence.length} normalized evidence items
                      </span>
                    </h2>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={handleSaveToHistory}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                        isCurrentSaved
                          ? "bg-emerald-950/50 border-emerald-700/50 text-emerald-300"
                          : "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300"
                      }`}
                    >
                      {isCurrentSaved ? (
                        <>
                          <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                          <span>Saved</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-4 h-4" />
                          <span>Save to History</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setIsExportOpen(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export Report</span>
                    </button>
                  </div>
                </div>

                {/* 1. Decision Recommendation Card */}
                <RecommendationCard
                  recommendation={report.recommendation}
                  technology={report.technology}
                />

                {/* 2. Source Coverage & Retrieval Telemetry */}
                <SourceCoverageBar
                  enginesContacted={report.enginesContacted}
                  mode={report.mode}
                  executionTimeMs={report.executionTimeMs}
                  totalExamined={report.totalSourcesExamined}
                  deduplicatedCount={report.deduplicatedSourcesCount}
                  timestamp={report.queryTimestamp}
                />

                {/* 3. Deterministic Extracted Signal Cards */}
                <SignalCards signals={report.signals} />

                {/* 4. Detailed Primary Evidence Explorer */}
                <EvidenceExplorer
                  evidence={report.evidence}
                  technology={report.technology}
                />
              </section>
            )}
          </>
        )}

        {activeTab === "compare" && (
          <ComparisonView hasApiKey={hasApiKey} />
        )}
      </main>

      {/* History Slide-over Drawer */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#0e1626] border-l border-slate-800 h-full p-6 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <HistoryIcon className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-base">Saved Research History</h3>
              </div>
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {savedReports.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No saved research yet. Click &ldquo;Save to History&rdquo; after researching any technology.
                </div>
              ) : (
                savedReports.map((saved) => (
                  <div
                    key={saved.technology}
                    className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-3 group transition-colors"
                  >
                    <div
                      className="cursor-pointer flex-1"
                      onClick={() => {
                        setReport(saved);
                        setActiveTab("radar");
                        setIsHistoryOpen(false);
                      }}
                    >
                      <h4 className="text-sm font-semibold text-slate-200 group-hover:text-indigo-300">
                        {saved.technology}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1 font-mono">
                        <span
                          className={`font-bold px-1.5 py-0.2 rounded text-[10px] ${
                            saved.recommendation.outcome === "BUILD"
                              ? "text-emerald-400 bg-emerald-950/60"
                              : saved.recommendation.outcome === "LEARN"
                              ? "text-sky-400 bg-sky-950/60"
                              : saved.recommendation.outcome === "MONITOR"
                              ? "text-amber-400 bg-amber-950/60"
                              : "text-rose-400 bg-rose-950/60"
                          }`}
                        >
                          {saved.recommendation.outcome}
                        </span>
                        <span>{saved.evidence.length} sources</span>
                        <span>• {saved.mode}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteHistory(saved.technology)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 text-center">
              Stored locally in browser localStorage.
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {report && (
        <ExportModal
          report={report}
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
        />
      )}

      {/* Methodology Modal */}
      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070b13] py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">SignalForge</span>
            <span>— SerpApi India Hackathon 2026</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsMethodologyOpen(true)}
              className="hover:text-slate-200 transition-colors"
            >
              Methodology & Rules
            </button>
            <a
              href="https://serpapi.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-200 transition-colors"
            >
              Powered by SerpApi
            </a>
            <a
              href="https://serpapi.github.io/serpapi-india-hackathon-2026/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-200 transition-colors"
            >
              Official Hackathon
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
