"use client";

import React, { useState } from "react";
import { Search, Loader2, Sparkles, RefreshCw, AlertCircle } from "lucide-react";

interface SearchBoxProps {
  onSearch: (technology: string, isDemo: boolean, forceRefresh: boolean) => void;
  isLoading: boolean;
  hasApiKey: boolean;
  defaultTopic?: string;
  isDemoMode?: boolean;
  onToggleDemoMode?: (val: boolean) => void;
}

const SUGGESTED_TOPICS = [
  "Model Context Protocol",
  "WebAssembly",
  "DuckDB",
  "Rust",
  "Apache Arrow"
];

export function SearchBox({
  onSearch,
  isLoading,
  hasApiKey,
  defaultTopic = "Model Context Protocol",
  isDemoMode: controlledDemoMode,
  onToggleDemoMode
}: SearchBoxProps) {
  const [query, setQuery] = useState(defaultTopic);
  const [internalDemoMode, setInternalDemoMode] = useState(!hasApiKey);
  const [forceRefresh, setForceRefresh] = useState(false);

  const isDemoMode = controlledDemoMode !== undefined ? controlledDemoMode : internalDemoMode;
  const setIsDemoMode = (val: boolean) => {
    if (onToggleDemoMode) {
      onToggleDemoMode(val);
    } else {
      setInternalDemoMode(val);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim(), isDemoMode, forceRefresh);
    }
  };

  const handleSelectTopic = (topic: string) => {
    setQuery(topic);
    onSearch(topic, isDemoMode, forceRefresh);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center shadow-2xl rounded-2xl bg-slate-900/90 border border-slate-700/80 p-2 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
          <div className="pl-3 pr-2 text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter technology (e.g., Model Context Protocol, WebAssembly, DuckDB)..."
            disabled={isLoading}
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-base sm:text-lg focus:outline-none px-2 py-1.5 font-normal"
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium text-sm transition-all shadow-md shadow-indigo-600/25 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Research Technology</span>
              </>
            )}
          </button>
        </div>

        {/* Options & Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-3 px-1 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer select-none hover:text-slate-200 transition-colors">
              <input
                type="checkbox"
                checked={isDemoMode}
                onChange={(e) => setIsDemoMode(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0 focus:ring-offset-0"
              />
              <span>Demo Fixtures Mode</span>
              {isDemoMode && (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/30">
                  Zero Quota Used
                </span>
              )}
            </label>

            {hasApiKey && !isDemoMode && (
              <label className="flex items-center gap-1.5 cursor-pointer select-none hover:text-slate-200 transition-colors">
                <input
                  type="checkbox"
                  checked={forceRefresh}
                  onChange={(e) => setForceRefresh(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0 focus:ring-offset-0"
                />
                <RefreshCw className="w-3 h-3 text-slate-400" />
                <span>Force Fresh SerpApi Query</span>
              </label>
            )}
          </div>

          <div className="text-[11px] text-slate-500 hidden sm:block">
            Cross-references: Google Search + Scholar + Jobs
          </div>
        </div>
      </form>

      {/* Suggested Topic Chips */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
          Suggested:
        </span>
        {SUGGESTED_TOPICS.map((topic) => (
          <button
            key={topic}
            type="button"
            onClick={() => handleSelectTopic(topic)}
            disabled={isLoading}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 hover:border-slate-600 text-slate-300 hover:text-white transition-all disabled:opacity-50"
          >
            {topic}
          </button>
        ))}
      </div>

      {!hasApiKey && !isDemoMode && (
        <div className="mt-3 p-3 rounded-lg bg-amber-950/40 border border-amber-800/50 text-amber-300 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Notice:</span> SERPAPI_KEY is not configured in .env.local. The system will automatically use high-fidelity synthetic demo fixtures. To query real live search engines, add your key to <code className="bg-amber-900/50 px-1 py-0.5 rounded">.env.local</code>.
          </div>
        </div>
      )}
    </div>
  );
}
