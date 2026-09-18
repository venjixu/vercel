import React from 'react';
import {
  Compass,
  Clock,
  Building,
  Target,
  Zap,
  CheckCircle2,
  AlertCircle,
  Briefcase,
} from 'lucide-react';
import { IndianHiringStrategy } from '../types';

interface PlanIndianStrategyProps {
  strategy: IndianHiringStrategy;
  roleTitle: string;
}

export const PlanIndianStrategy: React.FC<PlanIndianStrategyProps> = ({
  strategy,
  roleTitle,
}) => {
  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <Compass className="h-5 w-5 text-orange-600" />
          <h3 className="font-display text-lg font-bold text-slate-900">
            Indian Tech Hiring Playbook & Algorithms
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-600">
          How to beat the recruiter filters on Naukri, Instahyre, and bypass standard 90-day notice
          period blockers.
        </p>
      </div>

      {/* 3 Core Tactic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Naukri 9AM Algorithm Hack */}
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-b from-blue-50/50 to-white p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-800 mb-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span>Naukri 9:00 AM Algorithm Hack</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            {strategy.naukriStrategy}
          </p>
          <div className="mt-4 rounded-lg bg-blue-100/60 p-2.5 text-[11px] font-medium text-blue-900">
            💡 <span className="font-bold">Pro Tip:</span> Never leave your Naukri profile untouched
            for more than 48 hours while actively hunting.
          </div>
        </div>

        {/* 90-Day Notice Period Hack */}
        <div className="rounded-2xl border border-amber-200 bg-gradient-to-b from-amber-50/50 to-white p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 mb-2">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <span>90-Day Notice Period Defense</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            {strategy.noticePeriodHack}
          </p>
          <div className="mt-4 rounded-lg bg-amber-100/60 p-2.5 text-[11px] font-medium text-amber-900">
            🛡️ <span className="font-bold">Notice Strategy:</span> If on 90 days, ask HR about buyout
            or leaf encashment before saying "not negotiable".
          </div>
        </div>

        {/* Instahyre & Wellfound Proactive Channels */}
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50/50 to-white p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
            <Zap className="h-4 w-4 text-emerald-600" />
            <span>Instahyre & Wellfound Edge</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            {strategy.instahyreWellfoundTip}
          </p>
          <div className="mt-4 rounded-lg bg-emerald-100/60 p-2.5 text-[11px] font-medium text-emerald-900">
            🚀 <span className="font-bold">Direct Channels:</span> Wellfound connects you directly with
            founders & engineering leads with no recruiter middleman.
          </div>
        </div>
      </div>

      {/* Target Companies by Tier */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <Building className="h-5 w-5 text-orange-600" />
          <h4 className="font-display text-base font-bold text-slate-900">
            Target Company Tiers & Hiring Bars in India
          </h4>
        </div>

        <div className="space-y-3">
          {strategy.targetCompanies.map((tc, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4"
            >
              <div className="space-y-1 max-w-md">
                <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
                  {tc.category}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {tc.examples.map((ex, i) => (
                    <span
                      key={i}
                      className="rounded bg-white px-2 py-0.5 text-xs font-semibold text-slate-800 border border-slate-200"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </div>

              <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Hiring Focus & Bar:
                </span>
                <p className="text-xs font-bold text-slate-800">{tc.hiringBar}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
