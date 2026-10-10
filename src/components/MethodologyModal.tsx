"use client";

import React from "react";
import {
  X,
  BookOpen,
  ShieldCheck,
  Cpu,
  Layers,
  AlertTriangle
} from "lucide-react";

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MethodologyModal({ isOpen, onClose }: MethodologyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl rounded-2xl bg-[#0e1626] border border-slate-700/80 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              SignalForge Methodology & Decision Rules
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {/* Section 1: Core Philosophy */}
          <section className="space-y-2">
            <h4 className="text-sm sm:text-base font-bold text-indigo-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              1. Transparent Separation of Facts and Inferences
            </h4>
            <p>
              Every decision in SignalForge is deterministic and traceable to indexed search facts retrieved live via SerpApi.
              We strictly separate:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li><strong className="text-slate-200">Observed:</strong> Direct search results (job listings, W3C standards, peer-reviewed citations).</li>
              <li><strong className="text-slate-200">Inferred:</strong> Structured categorizations according to documented deterministic rules.</li>
              <li><strong className="text-slate-200">Unknown:</strong> Information not present in search results (labeled transparently rather than guessed).</li>
            </ul>
          </section>

          {/* Section 2: Decision Outcomes */}
          <section className="space-y-3">
            <h4 className="text-sm sm:text-base font-bold text-indigo-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              2. The 4 Deterministic Decision Outcomes
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-1">
                <span className="font-bold text-emerald-400 font-mono text-xs">BUILD (Rule SF-001)</span>
                <p className="text-xs text-slate-300">
                  Official docs or repo confirmed + observed employer hiring demand (or academic foundations with active tooling). Safe for bounded prototyping.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-sky-950/20 border border-sky-800/40 space-y-1">
                <span className="font-bold text-sky-400 font-mono text-xs">LEARN (Rule SF-002)</span>
                <p className="text-xs text-slate-300">
                  Solid documentation, specification, or academic citations verified, but commercial hiring remains early stage. High educational value.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-1">
                <span className="font-bold text-amber-400 font-mono text-xs">MONITOR (Rule SF-003)</span>
                <p className="text-xs text-slate-300">
                  Academic papers or fragmented mentions exist, but no official production docs or hiring ecosystem. Passive tracking recommended.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-800/40 space-y-1">
                <span className="font-bold text-rose-400 font-mono text-xs">INVESTIGATE (Rule SF-004/005)</span>
                <p className="text-xs text-slate-300">
                  Sparse results (&lt;3 sources), contradictory keywords, or engine failure. SignalForge refrains from guessing recommendations.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Ethical Boundaries */}
          <section className="space-y-2">
            <h4 className="text-sm sm:text-base font-bold text-amber-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              3. Anti-Hype & Integrity Safeguards
            </h4>
            <p>
              Raw search engine result counts are <strong className="text-white">not</strong> an indicator of market size or popularity.
              SignalForge enforces strict guardrails:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li>No fabricated temporal growth percentages without verifiable historical snapshots.</li>
              <li>No arbitrary &ldquo;opportunity scores&rdquo; designed solely to look decorative.</li>
              <li>Clear disclosure of limitations on every single retrieved source item.</li>
            </ul>
          </section>

          {/* Section 4: SerpApi Integration & Security */}
          <section className="space-y-2">
            <h4 className="text-sm sm:text-base font-bold text-indigo-300 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-sky-400" />
              4. Quota Boundaries & Security
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li><strong className="text-slate-200">Zero Secret Leakage:</strong> <code className="bg-slate-800 px-1 py-0.5 rounded text-indigo-300">SERPAPI_KEY</code> is strictly server-side and never exposed to the client or version control.</li>
              <li><strong className="text-slate-200">Strict Bounded Queries:</strong> At most 3 target engines queried per research action, with 24-hour server caching to respect the 250 search/month quota.</li>
              <li><strong className="text-slate-200">Transparent Demo Mode:</strong> Synthetic fixtures are explicitly tagged with <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-300">DEMO FIXTURE</code> to ensure judges can test the full interface even without credentials.</li>
            </ul>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors"
          >
            Close Methodology
          </button>
        </div>
      </div>
    </div>
  );
}
