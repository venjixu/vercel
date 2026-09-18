import React, { useState } from 'react';
import {
  Send,
  Copy,
  Check,
  Users,
  Linkedin,
  Clock,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import { ReferralTemplate } from '../types';

interface PlanReferralsProps {
  templates: ReferralTemplate[];
  roleTitle: string;
}

export const PlanReferrals: React.FC<PlanReferralsProps> = ({ templates, roleTitle }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <Linkedin className="h-5 w-5 text-[#0A66C2]" />
          <h3 className="font-display text-lg font-bold text-slate-900">
            High-Conversion Referral & Cold Outreach Templates
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-600">
          In India, 65%+ of product company hires come via internal employee referrals. Stop sending
          generic “Dear Sir please give referral” messages. Use these proven, polite scripts with
          proof-of-work links.
        </p>
      </div>

      {/* Templates List */}
      <div className="space-y-4">
        {templates.map((tpl, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-[#0A66C2]">
                  {idx + 1}
                </span>
                <h4 className="font-display text-sm sm:text-base font-bold text-slate-900">
                  {tpl.target}
                </h4>
              </div>

              <button
                onClick={() =>
                  handleCopy(`${tpl.subject ? `Subject: ${tpl.subject}\n\n` : ''}${tpl.body}`, idx)
                }
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                {copiedIndex === idx ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Message Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-slate-500" />
                    <span>Copy Message</span>
                  </>
                )}
              </button>
            </div>

            {/* Subject if applicable */}
            {tpl.subject && (
              <div className="rounded-lg bg-slate-50 p-2.5 text-xs border border-slate-200">
                <span className="font-bold text-slate-500">Suggested Subject / InMail Title: </span>
                <span className="font-semibold text-slate-900">{tpl.subject}</span>
              </div>
            )}

            {/* Message Body Box */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
              {tpl.body}
            </div>

            {/* Pro Tip */}
            <div className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-900 border border-amber-200">
              <Sparkles className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Indian Outreach Best Practice: </span>
                <span>{tpl.proTip}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
