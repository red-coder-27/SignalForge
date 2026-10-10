"use client";

import React from "react";
import { ExtractedSignals } from "@/types/evidence";
import {
  Briefcase,
  GraduationCap,
  Globe,
  Clock,
  Building,
  Tag,
  ExternalLink,
  Info
} from "lucide-react";

interface SignalCardsProps {
  signals: ExtractedSignals;
}

export function SignalCards({ signals }: SignalCardsProps) {
  const { hiring, research, web, temporal } = signals;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* 1. Hiring Signal Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">Hiring Signal</h3>
                <p className="text-[11px] text-slate-400">Google Jobs Engine</p>
              </div>
            </div>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {hiring.listingCount} listings found
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {hiring.companies.length > 0 && (
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 flex items-center gap-1 font-semibold">
                  <Building className="w-3 h-3 text-emerald-400" />
                  Employers Hiring:
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {hiring.companies.map((comp, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-200 border border-slate-700/60"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {hiring.skillKeywordsObserved.length > 0 && (
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 flex items-center gap-1 font-semibold">
                  <Tag className="w-3 h-3 text-indigo-400" />
                  Observed Stack Requirements:
                </span>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {hiring.skillKeywordsObserved.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-indigo-950/60 text-indigo-300 border border-indigo-800/40 font-mono"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="text-xs text-slate-300 space-y-1 mt-2">
              {hiring.observations.map((obs, idx) => (
                <p key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-400">•</span>
                  <span>{obs}</span>
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-500">
          <span className="font-semibold text-slate-400">Coverage:</span> {hiring.coverage}
        </div>
      </div>

      {/* 2. Research Signal Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">Research Signal</h3>
                <p className="text-[11px] text-slate-400">Google Scholar Engine</p>
              </div>
            </div>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {research.paperCount} papers
              {research.totalCitationsKnown > 0 ? ` · ${research.totalCitationsKnown} cites` : ""}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {research.themesObserved.length > 0 && (
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 flex items-center gap-1 font-semibold">
                  <Tag className="w-3 h-3 text-purple-400" />
                  Key Research Themes:
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {research.themesObserved.map((theme, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-0.5 rounded-md bg-purple-950/40 text-purple-300 border border-purple-800/40"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="text-xs text-slate-300 space-y-1 mt-2">
              {research.observations.map((obs, idx) => (
                <p key={idx} className="flex items-start gap-1.5">
                  <span className="text-purple-400">•</span>
                  <span>{obs}</span>
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-500">
          <span className="font-semibold text-slate-400">Coverage:</span> {research.coverage}
        </div>
      </div>

      {/* 3. Web Ecosystem Signal Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">Web Ecosystem Signal</h3>
                <p className="text-[11px] text-slate-400">Google Search Engine</p>
              </div>
            </div>
            <span
              className={`font-mono text-xs px-2 py-0.5 rounded border ${
                web.hasOfficialDocumentation
                  ? "bg-emerald-950/60 text-emerald-300 border-emerald-800/50"
                  : "bg-slate-800 text-slate-400 border-slate-700"
              }`}
            >
              {web.hasOfficialDocumentation ? "Primary Docs Found" : "Docs Unverified"}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {web.docOrRepoLinks.length > 0 && (
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                  Identified Primary Endpoints:
                </span>
                <div className="space-y-1 mt-1.5">
                  {web.docOrRepoLinks.slice(0, 2).map((link, idx) => (
                    <a
                      key={idx}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-sky-400 hover:text-sky-300 truncate flex items-center gap-1 hover:underline"
                    >
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{link}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="text-xs text-slate-300 space-y-1 mt-2">
              {web.observations.map((obs, idx) => (
                <p key={idx} className="flex items-start gap-1.5">
                  <span className="text-sky-400">•</span>
                  <span>{obs}</span>
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-500">
          <span className="font-semibold text-slate-400">Coverage:</span> {web.coverage}
        </div>
      </div>

      {/* 4. Temporal Signal Card (Strict Hackathon Rule: NO fake growth curves) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">Temporal Signal</h3>
                <p className="text-[11px] text-slate-400">Historical Trend Baseline</p>
              </div>
            </div>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
              Point-in-Time
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/30 text-amber-200/90 text-xs">
              <div className="font-semibold mb-1 flex items-center gap-1.5 text-amber-300">
                <Info className="w-3.5 h-3.5" />
                <span>Analytical Integrity Policy:</span>
              </div>
              <p>{temporal.trendObservation}</p>
            </div>

            <div className="text-xs text-slate-400 space-y-1">
              <p>
                Search result item counts are <strong className="text-slate-300">not</strong> market size measurements. SignalForge refuses to manufacture fabricated adoption percentages without verified longitudinal data.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-500">
          <span className="font-semibold text-slate-400">Policy:</span> Strict separation of observed search facts from inferences.
        </div>
      </div>
    </div>
  );
}
