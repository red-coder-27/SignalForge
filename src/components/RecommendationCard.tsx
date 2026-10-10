"use client";

import React from "react";
import {
  RecommendationExplanation,
  RecommendationOutcome
} from "@/types/evidence";
import {
  Hammer,
  GraduationCap,
  Eye,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  ArrowRight,
  ShieldAlert
} from "lucide-react";

interface RecommendationCardProps {
  recommendation: RecommendationExplanation;
  technology: string;
}

const OUTCOME_CONFIG: Record<
  RecommendationOutcome,
  {
    label: string;
    actionPhrase: string;
    colorClass: string;
    borderClass: string;
    bgClass: string;
    glowClass: string;
    icon: React.ElementType;
    badgeBg: string;
  }
> = {
  BUILD: {
    label: "BUILD",
    actionPhrase: "Consider a bounded prototype or implementation experiment",
    colorClass: "text-emerald-400",
    borderClass: "border-emerald-500/40",
    bgClass: "bg-emerald-950/20",
    glowClass: "glow-build",
    icon: Hammer,
    badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
  },
  LEARN: {
    label: "LEARN",
    actionPhrase: "Study the architecture, run tutorials, and explore practical concepts",
    colorClass: "text-sky-400",
    borderClass: "border-sky-500/40",
    bgClass: "bg-sky-950/20",
    glowClass: "glow-learn",
    icon: GraduationCap,
    badgeBg: "bg-sky-500/20 text-sky-300 border-sky-500/40"
  },
  MONITOR: {
    label: "MONITOR",
    actionPhrase: "Track ecosystem milestones before committing substantial engineering",
    colorClass: "text-amber-400",
    borderClass: "border-amber-500/40",
    bgClass: "bg-amber-950/20",
    glowClass: "glow-monitor",
    icon: Eye,
    badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/40"
  },
  INVESTIGATE: {
    label: "INVESTIGATE",
    actionPhrase: "Evidence is insufficient, contradictory, or poorly covered",
    colorClass: "text-rose-400",
    borderClass: "border-rose-500/40",
    bgClass: "bg-rose-950/20",
    glowClass: "glow-investigate",
    icon: HelpCircle,
    badgeBg: "bg-rose-500/20 text-rose-300 border-rose-500/40"
  }
};

export function RecommendationCard({
  recommendation,
  technology,
}: RecommendationCardProps) {
  const config = OUTCOME_CONFIG[recommendation.outcome];
  const IconComponent = config.icon;

  return (
    <div
      className={`rounded-2xl border ${config.borderClass} ${config.bgClass} ${config.glowClass} p-6 sm:p-8 backdrop-blur-sm transition-all`}
    >
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${config.badgeBg}`}
          >
            <IconComponent className={`w-7 h-7 ${config.colorClass}`} />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                {technology ? `${technology} — ` : ""}Recommended Action
              </span>
              <span
                className={`text-xs font-mono font-semibold px-2 py-0.5 rounded border ${config.badgeBg}`}
              >
                {recommendation.confidenceLevel} CONFIDENCE
              </span>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${config.colorClass}`}>
              {config.label}
            </h2>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-xs font-mono text-slate-400 block">Applied Rule</span>
          <span className="text-xs font-mono text-indigo-400 font-semibold bg-indigo-950/60 border border-indigo-800/50 px-2 py-0.5 rounded inline-block mt-0.5">
            {recommendation.ruleId}
          </span>
        </div>
      </div>

      {/* Main Summary */}
      <div className="py-5">
        <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
          {recommendation.summary}
        </p>
        <p className="text-xs text-slate-400 mt-2 italic flex items-center gap-1.5">
          <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          Guidance: {config.actionPhrase}
        </p>
      </div>

      {/* Two Column Observations Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/80">
        {/* Supporting Observations */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Supporting Observations</span>
          </div>
          <ul className="space-y-2">
            {recommendation.supportingObservations.map((obs, idx) => (
              <li
                key={idx}
                className="text-xs sm:text-sm text-slate-300 flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60"
              >
                <span className="text-emerald-500 font-mono text-xs mt-0.5">✓</span>
                <span>{obs}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contradictory or Missing Evidence */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <span>Contradictory / Missing Signals</span>
          </div>
          <ul className="space-y-2">
            {recommendation.contradictoryOrMissingEvidence.map((missing, idx) => (
              <li
                key={idx}
                className="text-xs sm:text-sm text-slate-300 flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60"
              >
                <span className="text-amber-500 font-mono text-xs mt-0.5">!</span>
                <span>{missing}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Evidence Needed to Improve Confidence */}
      {recommendation.evidenceToImproveConfidence.length > 0 && (
        <div className="mt-6 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
            <FileCode className="w-4 h-4 text-indigo-400" />
            <span>What Evidence Would Increase Confidence?</span>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400">
            {recommendation.evidenceToImproveConfidence.map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-indigo-400">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Rule & Disclaimer Footnote */}
      <div className="mt-4 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500 border-t border-slate-800/60">
        <div className="font-mono">
          <span className="text-slate-400">Exact Logic:</span> {recommendation.exactRule}
        </div>
        <div className="flex items-center gap-1 text-slate-500">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>{recommendation.limitationDisclaimer}</span>
        </div>
      </div>
    </div>
  );
}
