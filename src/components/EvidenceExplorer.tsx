"use client";

import React, { useState } from "react";
import { EvidenceItem } from "@/types/evidence";
import {
  ExternalLink,
  Filter,
  Search,
  Calendar,
  Building,
  User
} from "lucide-react";

interface EvidenceExplorerProps {
  evidence: EvidenceItem[];
  technology?: string;
}

export function EvidenceExplorer({ evidence }: EvidenceExplorerProps) {
  const [filterEngine, setFilterEngine] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredItems = evidence.filter((item) => {
    if (filterEngine !== "all" && item.sourceEngine !== filterEngine) return false;
    if (filterType !== "all" && item.evidenceType !== filterType) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSnippet = item.snippet.toLowerCase().includes(q);
      const matchCompany = item.metadata?.companyName?.toLowerCase().includes(q);
      return matchTitle || matchSnippet || matchCompany;
    }
    return true;
  });

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 space-y-6">
      {/* Header and Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-100">Primary Evidence Explorer</h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/50">
              {filteredItems.length} of {evidence.length} evidence items
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Inspect raw search evidence normalized and deduplicated across SerpApi engines.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Engine filter */}
          <div className="flex items-center gap-1 bg-slate-800/90 border border-slate-700/80 rounded-lg px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterEngine}
              onChange={(e) => setFilterEngine(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none"
            >
              <option value="all" className="bg-slate-900">All Engines</option>
              <option value="google" className="bg-slate-900">Google Search</option>
              <option value="google_scholar" className="bg-slate-900">Google Scholar</option>
              <option value="google_jobs" className="bg-slate-900">Google Jobs</option>
            </select>
          </div>

          {/* Type filter */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-lg px-2.5 py-1.5">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none"
            >
              <option value="all" className="bg-slate-900">All Types</option>
              <option value="web" className="bg-slate-900">Web & Docs</option>
              <option value="research" className="bg-slate-900">Research Papers</option>
              <option value="hiring" className="bg-slate-900">Hiring Listings</option>
            </select>
          </div>

          {/* Quick search input */}
          <div className="relative flex items-center bg-slate-800/90 border border-slate-700/80 rounded-lg px-2.5 py-1.5 w-40 sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 mr-1.5 flex-shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter keywords..."
              className="bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none w-full text-xs"
            />
          </div>
        </div>
      </div>

      {/* List of Evidence Items */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm">
          No items match the selected filters.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item, index) => {
            const isScholar = item.sourceEngine === "google_scholar";
            const isJobs = item.sourceEngine === "google_jobs";

            return (
              <article
                key={item.id}
                className="rounded-xl border border-slate-800/90 bg-slate-900/90 hover:border-indigo-500/40 p-4 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono text-slate-500">#{index + 1}</span>
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${
                          isScholar
                            ? "bg-purple-950/60 text-purple-300 border-purple-800/50"
                            : isJobs
                            ? "bg-emerald-950/60 text-emerald-300 border-emerald-800/50"
                            : "bg-sky-950/60 text-sky-300 border-sky-800/50"
                        }`}
                      >
                        {item.engineLabel}
                      </span>
                      <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                        {(item.relevanceScore * 100).toFixed(0)}% Match
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        Status: {item.sourceStatus}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-semibold text-slate-100 hover:text-indigo-300 transition-colors">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5"
                      >
                        <span>{item.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 text-slate-400 hover:text-indigo-400" />
                      </a>
                    </h4>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                      {item.metadata?.companyName && (
                        <span className="flex items-center gap-1 text-emerald-400">
                          <Building className="w-3 h-3" />
                          <span>{item.metadata.companyName} {item.metadata.location ? `(${item.metadata.location})` : ""}</span>
                        </span>
                      )}

                      {item.metadata?.authorOrPublisher && (
                        <span className="flex items-center gap-1 text-purple-400">
                          <User className="w-3 h-3" />
                          <span className="truncate max-w-xs">{item.metadata.authorOrPublisher}</span>
                        </span>
                      )}

                      {item.metadata?.citations !== undefined && (
                        <span className="font-mono text-purple-300 bg-purple-950/50 px-1.5 py-0.2 rounded border border-purple-800/40">
                          {item.metadata.citations} Citations
                        </span>
                      )}

                      {item.publishedAt && (
                        <span className="flex items-center gap-1 text-slate-400">
                          <Calendar className="w-3 h-3" />
                          <span>Published: {item.publishedAt}</span>
                        </span>
                      )}
                    </div>

                    {/* Snippet */}
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1.5">
                      {item.snippet}
                    </p>

                    {/* Collapsible Diagnostic & Methodology Metadata */}
                    <details className="group pt-2 text-[11px] text-slate-500 border-t border-slate-800/60 cursor-pointer">
                      <summary className="font-mono text-[10px] text-indigo-400/80 hover:text-indigo-300 transition-colors select-none flex items-center gap-1.5 py-1">
                        <span className="group-open:rotate-90 transition-transform">▸</span>
                        <span>Scoring & Diagnostic Metadata</span>
                      </summary>
                      <div className="mt-1.5 pl-3 border-l-2 border-indigo-500/20 space-y-1 text-slate-400">
                        <div>
                          <span className="font-semibold text-slate-300">Relevance Breakdown:</span> {item.relevanceExplanation}
                        </div>
                        {item.limitations.length > 0 && (
                          <div className="text-slate-400 italic">
                            <span className="font-semibold not-italic text-slate-300">Methodology Limitations:</span> {item.limitations.join(" ")}
                          </div>
                        )}
                        <div className="text-[10px] font-mono text-slate-500">
                          Item ID: {item.id} • Retrieved: {new Date(item.retrievedAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="text-[11px] text-slate-500 text-center pt-2">
        SerpApi retrieves search results from underlying engines; source credibility and software verification remain an independent responsibility.
      </div>
    </div>
  );
}
