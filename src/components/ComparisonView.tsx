"use client";

import React, { useState } from "react";
import { TechnologyComparison } from "@/types/evidence";
import { exportComparisonToMarkdown } from "@/lib/export";
import {
  GitCompare,
  Loader2,
  CheckCircle2,
  XCircle,
  Download,
  Copy,
  Check,
  AlertTriangle,
  Info
} from "lucide-react";

interface ComparisonViewProps {
  hasApiKey: boolean;
}

export function ComparisonView({ hasApiKey }: ComparisonViewProps) {
  const [tech1, setTech1] = useState("Model Context Protocol");
  const [tech2, setTech2] = useState("WebAssembly");
  const [tech3, setTech3] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [comparison, setComparison] = useState<TechnologyComparison | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    const list = [tech1.trim(), tech2.trim(), tech3.trim()].filter(t => t.length > 0);
    if (list.length < 2) {
      setError("Please specify at least 2 technologies to compare.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          technologies: list,
          demo: !hasApiKey
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Error ${res.status}`);
      }

      const data: TechnologyComparison = await res.json();
      setComparison(data);
    } catch (err: any) {
      setError(err.message || "Failed to generate comparison.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMarkdown = () => {
    if (!comparison) return;
    const md = exportComparisonToMarkdown(comparison);
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!comparison) return;
    const md = exportComparisonToMarkdown(comparison);
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SignalForge_Comparison_${comparison.technologies.join("_vs_")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 py-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center justify-center gap-2.5">
          <GitCompare className="w-6 h-6 text-indigo-400" />
          <span>Technology Comparison Radar</span>
        </h2>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          Evaluate 2 to 3 candidate technologies side-by-side across identical SerpApi search surfaces with transparent coverage discrepancy warnings.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleCompare} className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Technology 1 (Required)
            </label>
            <input
              type="text"
              value={tech1}
              onChange={(e) => setTech1(e.target.value)}
              placeholder="e.g. Model Context Protocol"
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Technology 2 (Required)
            </label>
            <input
              type="text"
              value={tech2}
              onChange={(e) => setTech2(e.target.value)}
              placeholder="e.g. WebAssembly"
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Technology 3 (Optional)
            </label>
            <input
              type="text"
              value={tech3}
              onChange={(e) => setTech3(e.target.value)}
              placeholder="e.g. DuckDB"
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-indigo-400" />
            <span>Reuses cached search evidence where available to conserve SerpApi quota.</span>
          </div>

          <button
            type="submit"
            disabled={isLoading || !tech1.trim() || !tech2.trim()}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Running Comparative Analysis...</span>
              </>
            ) : (
              <>
                <GitCompare className="w-4 h-4" />
                <span>Compare Technologies</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs">
            {error}
          </div>
        )}
      </form>

      {/* Comparison Results */}
      {comparison && (
        <div className="space-y-6">
          {/* Actions Bar */}
          <div className="flex items-center justify-between pb-2">
            <div className="text-xs font-mono text-slate-400">
              Generated: {new Date(comparison.generatedAt).toLocaleString()}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyMarkdown}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy Report"}</span>
              </button>
              <button
                onClick={handleDownloadMarkdown}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Markdown</span>
              </button>
            </div>
          </div>

          {/* Matrix Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-800/80 text-slate-400 font-mono uppercase text-[11px] tracking-wider border-b border-slate-700">
                <tr>
                  <th className="py-3 px-4">Technology</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Sources</th>
                  <th className="py-3 px-4">Docs / Spec</th>
                  <th className="py-3 px-4">Hiring Demand</th>
                  <th className="py-3 px-4">Research Basis</th>
                  <th className="py-3 px-4">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {comparison.matrix.map((row) => (
                  <tr key={row.technology} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-100">{row.technology}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${
                          row.recommendation === "BUILD"
                            ? "bg-emerald-950/60 text-emerald-400 border-emerald-800/50"
                            : row.recommendation === "LEARN"
                            ? "bg-sky-950/60 text-sky-400 border-sky-800/50"
                            : row.recommendation === "MONITOR"
                            ? "bg-amber-950/60 text-amber-400 border-amber-800/50"
                            : "bg-rose-950/60 text-rose-400 border-rose-800/50"
                        }`}
                      >
                        {row.recommendation}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">{row.evidenceCount} verified</td>
                    <td className="py-3.5 px-4">
                      {row.webDocsFound ? (
                        <span className="flex items-center gap-1 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-slate-500">
                          <XCircle className="w-3.5 h-3.5" /> None
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {row.hiringDemandObserved ? (
                        <span className="flex items-center gap-1 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Observed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-slate-500">
                          <XCircle className="w-3.5 h-3.5" /> None
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {row.researchCitationsFound ? (
                        <span className="flex items-center gap-1 text-purple-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Present
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-slate-500">
                          <XCircle className="w-3.5 h-3.5" /> None
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{row.confidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Observations & Discrepancy Warnings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Comparative Observations
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {comparison.comparativeObservations.map((obs, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-indigo-400">•</span>
                    <span>{obs}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Coverage Discrepancies & Caution
              </h4>
              {comparison.coverageDiscrepancies.length > 0 ? (
                <ul className="space-y-1.5 text-xs text-amber-200/90">
                  {comparison.coverageDiscrepancies.map((disc, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span>!</span>
                      <span>{disc}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400">
                  Evidence volume is comparable across target technologies within this query snapshot.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
