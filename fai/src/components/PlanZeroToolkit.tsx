import React from 'react';
import {
  Wrench,
  ExternalLink,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { ZeroCostTool } from '../types';

interface PlanZeroToolkitProps {
  tools: ZeroCostTool[];
}

export const PlanZeroToolkit: React.FC<PlanZeroToolkitProps> = ({ tools }) => {
  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <Wrench className="h-5 w-5 text-orange-600" />
          <h3 className="font-display text-lg font-bold text-slate-900">
            The ₹0 Job-Hunt Toolkit
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-600">
          You never need to pay ₹1,00,000 for coding bootcamps. Everything you need to crack a 20+ LPA
          job in India is already free on the open web if you use the right tools.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((t, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-orange-300 hover:shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <h4 className="font-display text-sm font-bold text-slate-900">{t.name}</h4>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                  {t.cost}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{t.purpose}</p>
            </div>

            {t.linkText && (
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] text-slate-500">{t.linkText}</span>
                <a
                  href={`https://${t.linkText}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 font-semibold text-orange-600 hover:text-orange-800"
                >
                  <span>Open</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Zero Cost Pledge Banner */}
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50/80 via-white to-orange-50/80 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-display text-sm sm:text-base font-bold text-slate-900">
              The Indian Job Seeker's Zero-Rupee Guarantee
            </h4>
            <p className="text-xs text-slate-600">
              Every video, every database tier, every LeetCode sheet, and every resume template in this
              plan has a 100% free tier.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-emerald-800 border border-emerald-200 shadow-2xs">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>₹0 Total Spend Required</span>
        </div>
      </div>
    </div>
  );
};
