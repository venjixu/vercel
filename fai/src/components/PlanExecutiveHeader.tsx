import React from 'react';
import {
  IndianRupee,
  MapPin,
  TrendingUp,
  Bookmark,
  Share2,
  Printer,
  Sparkles,
  MessageSquareQuote,
  CheckCircle,
} from 'lucide-react';
import { CareerPlan } from '../types';

interface PlanExecutiveHeaderProps {
  plan: CareerPlan;
  isSaved: boolean;
  onSavePlan: () => void;
  onOpenAskCoach: () => void;
  onPrint: () => void;
}

export const PlanExecutiveHeader: React.FC<PlanExecutiveHeaderProps> = ({
  plan,
  isSaved,
  onSavePlan,
  onOpenAskCoach,
  onPrint,
}) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-md shadow-slate-100">
      {/* Top Banner Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center rounded-md bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-800">
              TARGET ROLE
            </span>
            <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
              ₹0 Cost Strategy
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
            {plan.roleTitle}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-2xl">
            {plan.summary}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onSavePlan}
            className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold shadow-2xs transition ${
              isSaved
                ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            {isSaved ? (
              <>
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>Saved to Browser</span>
              </>
            ) : (
              <>
                <Bookmark className="h-4 w-4 text-slate-500" />
                <span>Save Plan</span>
              </>
            )}
          </button>

          <button
            onClick={onPrint}
            title="Print or Export PDF"
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <Printer className="h-4 w-4 text-slate-500" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            onClick={onOpenAskCoach}
            className="flex items-center gap-1.5 rounded-xl bg-orange-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-orange-700 transition"
          >
            <MessageSquareQuote className="h-4 w-4" />
            <span>Ask Coach</span>
          </button>
        </div>
      </div>

      {/* Salary & CTC Benchmarks in INR */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Entry Level */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Entry Level CTC (0-2 YOE)
          </p>
          <p className="mt-1 font-display text-xl sm:text-2xl font-bold text-slate-900 flex items-center">
            <IndianRupee className="h-5 w-5 text-orange-600" />
            <span>{plan.salaryInsights.entryLPA}</span>
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Typical Service IT to Mid-tier Product
          </p>
        </div>

        {/* Mid Level */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4">
          <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
            Mid-Level (2-5 YOE)
          </p>
          <p className="mt-1 font-display text-xl sm:text-2xl font-bold text-amber-950 flex items-center">
            <IndianRupee className="h-5 w-5 text-amber-600" />
            <span>{plan.salaryInsights.midLPA}</span>
          </p>
          <p className="text-[11px] text-amber-800/80 mt-0.5">
            Funded Startups & Mid GCCs
          </p>
        </div>

        {/* Tier-1 Tech / GCC */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4">
          <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            Top Tier / GCCs / Unicorns
          </p>
          <p className="mt-1 font-display text-xl sm:text-2xl font-bold text-emerald-950 flex items-center">
            <IndianRupee className="h-5 w-5 text-emerald-600" />
            <span>{plan.salaryInsights.tier1LPA}</span>
          </p>
          <p className="text-[11px] text-emerald-800/80 mt-0.5">
            Top 10% talent benchmark
          </p>
        </div>
      </div>

      {/* In-Hand Take Home CTC Tip & Top Hiring Hubs */}
      <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl bg-slate-900 p-4 text-white text-xs">
        <div className="flex items-start gap-2.5">
          <TrendingUp className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300">Indian Take-Home Reality: </span>
            <span className="text-slate-300">{plan.salaryInsights.takeHomeTip}</span>
          </div>
        </div>
      </div>

      {/* Top Hiring Hubs */}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold text-slate-500 flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5 text-slate-400" />
          Primary Hiring Hubs:
        </span>
        {plan.topHiringHubs.map((hub) => (
          <span
            key={hub}
            className="rounded-lg bg-slate-100 px-2.5 py-1 font-medium text-slate-700"
          >
            {hub}
          </span>
        ))}
      </div>
    </div>
  );
};
