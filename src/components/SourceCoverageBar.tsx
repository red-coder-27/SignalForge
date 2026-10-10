"use client";

import React from "react";
import { EngineContactStatus, SourceStatus } from "@/types/evidence";
import { CheckCircle2, AlertCircle, Clock, Database, Layers } from "lucide-react";

interface SourceCoverageBarProps {
  enginesContacted: EngineContactStatus[];
  mode: SourceStatus;
  executionTimeMs: number;
  totalExamined: number;
  deduplicatedCount: number;
  timestamp: string;
}

export function SourceCoverageBar({
  enginesContacted,
  mode,
  executionTimeMs,
  totalExamined,
  deduplicatedCount,
  timestamp
}: SourceCoverageBarProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Engine pills */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs uppercase font-semibold tracking-wider text-slate-400 mr-1 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            Engines Contacted:
          </span>

          {enginesContacted.map((eng) => {
            const isSuccess = eng.status === "SUCCESS";
            const isPartial = eng.status === "PARTIAL";
            const label =
              eng.engine === "google"
                ? "Google Search"
                : eng.engine === "google_scholar"
                ? "Google Scholar"
                : "Google Jobs";

            return (
              <div
                key={eng.engine}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border ${
                  isSuccess
                    ? "bg-slate-800/80 border-slate-700 text-slate-200"
                    : isPartial
                    ? "bg-amber-950/30 border-amber-800/50 text-amber-300"
                    : "bg-rose-950/30 border-rose-800/50 text-rose-300"
                }`}
              >
                {isSuccess ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : isPartial ? (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                )}
                <span>{label}</span>
                <span className="font-mono text-[10px] text-slate-400">
                  ({eng.itemCount})
                </span>
              </div>
            );
          })}
        </div>

        {/* Right: Mode & Telemetry */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            <span>Mode:</span>
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                mode === "LIVE"
                  ? "bg-emerald-950/60 text-emerald-300 border-emerald-700/50"
                  : mode === "CACHED"
                  ? "bg-sky-950/60 text-sky-300 border-sky-700/50"
                  : "bg-amber-950/60 text-amber-300 border-amber-700/50"
              }`}
            >
              {mode}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{executionTimeMs}ms</span>
          </div>

          <div className="text-slate-500">
            {deduplicatedCount} verified / {totalExamined} examined
          </div>

          {timestamp && (
            <div className="text-slate-500 hidden sm:block">
              {new Date(timestamp).toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
