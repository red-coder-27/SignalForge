"use client";

import React from "react";
import { Radar, Compass, GitCompare, BookOpen, ShieldCheck, Zap } from "lucide-react";

interface HeaderProps {
  activeTab: "radar" | "compare" | "methodology";
  setActiveTab: (tab: "radar" | "compare" | "methodology") => void;
  hasApiKey: boolean;
  historyCount: number;
  onOpenHistory: () => void;
}

export function Header({
  activeTab,
  setActiveTab,
  hasApiKey,
  historyCount,
  onOpenHistory,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#090d16]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("radar")}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white shadow-lg shadow-indigo-500/20">
            <Radar className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white">SignalForge</span>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800/50">
                2026 Hackathon
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Technology Opportunity Radar</p>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab("radar")}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "radar"
                ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Radar</span>
          </button>

          <button
            onClick={() => setActiveTab("compare")}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "compare"
                ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <GitCompare className="w-4 h-4" />
            <span>Compare</span>
          </button>

          <button
            onClick={() => setActiveTab("methodology")}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "methodology"
                ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Rules & Logic</span>
          </button>
        </nav>

        {/* Actions & Status */}
        <div className="flex items-center gap-3">
          {historyCount > 0 && (
            <button
              onClick={onOpenHistory}
              className="text-xs text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md hidden md:flex items-center gap-1.5 transition-colors"
            >
              <span>Saved ({historyCount})</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border bg-slate-900/90 border-slate-800">
            {hasApiKey ? (
              <>
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">SerpApi Active</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-300">Demo Fixtures Ready</span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
