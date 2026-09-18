import React, { useState } from 'react';
import {
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Search,
} from 'lucide-react';
import { ATSResumeReview } from '../types';

interface PlanAtsReviewProps {
  review: ATSResumeReview;
  roleTitle: string;
}

export const PlanAtsReview: React.FC<PlanAtsReviewProps> = ({ review, roleTitle }) => {
  const [copiedKeywords, setCopiedKeywords] = useState(false);
  const [copiedBulletIdx, setCopiedBulletIdx] = useState<number | null>(null);

  const handleCopyKeywords = () => {
    navigator.clipboard.writeText(review.missingKeywords.join(', '));
    setCopiedKeywords(true);
    setTimeout(() => setCopiedKeywords(false), 2000);
  };

  const handleCopyBullet = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedBulletIdx(idx);
    setTimeout(() => setCopiedBulletIdx(null), 2000);
  };

  const scoreColor =
    review.score >= 80
      ? 'text-emerald-600 border-emerald-500 bg-emerald-50'
      : review.score >= 60
      ? 'text-amber-600 border-amber-500 bg-amber-50'
      : 'text-rose-600 border-rose-500 bg-rose-50';

  return (
    <div className="space-y-6">
      {/* Overview Score Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileCheck2 className="h-5 w-5 text-orange-600" />
              <h3 className="font-display text-lg font-bold text-slate-900">
                ATS Resume & Keyword Match Score
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Evaluated against real candidate profiles currently getting shortlisted for{' '}
              <span className="font-semibold text-slate-800">{roleTitle}</span> on Naukri and
              Instahyre.
            </p>
          </div>

          {/* Score Badge */}
          <div className="flex items-center gap-4">
            <div
              className={`flex h-20 w-20 flex-col items-center justify-center rounded-2xl border-2 font-display ${scoreColor}`}
            >
              <span className="text-2xl font-extrabold leading-none">{review.score}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">/ 100 ATS</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">
                {review.score >= 80
                  ? 'Strong Shortlist Potential'
                  : review.score >= 60
                  ? 'Moderate Shortlist Match'
                  : 'High Risk of ATS Rejection'}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Target 85+ score by adding missing keywords and Google XYZ bullets.
              </p>
            </div>
          </div>
        </div>

        {/* Strengths & Gaps Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
            <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Key Resume Strengths
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {review.strengths.map((s, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Critical Gaps */}
          <div className="rounded-xl border border-rose-100 bg-rose-50/40 p-4">
            <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-800 mb-2">
              <AlertTriangle className="h-4 w-4 text-rose-600" />
              Critical ATS & Recruiter Gaps
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {review.criticalGaps.map((g, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-rose-600 font-bold">•</span>
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Missing High-Value Keywords */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-orange-600" />
              <h4 className="font-display text-base font-bold text-slate-900">
                High-Value Keywords Indian Recruiters Query
              </h4>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Indian recruiters filter by these exact keywords in Naukri Resdex and LinkedIn Recruiter.
            </p>
          </div>

          <button
            onClick={handleCopyKeywords}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            {copiedKeywords ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-500" />
                <span>Copy All Keywords</span>
              </>
            )}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {review.missingKeywords.map((kw, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-lg border border-orange-200 bg-orange-50/70 px-3 py-1 text-xs font-semibold text-orange-950"
            >
              <span className="text-orange-500">+</span>
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Google XYZ Formula Bullet Rewrites */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-600" />
            <h4 className="font-display text-base font-bold text-slate-900">
              Google XYZ Formula Resume Bullet Rewrites
            </h4>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Formula: “Accomplished [X], as measured by [Y], by doing [Z]”. Replace weak passive bullets
            with these impact statements.
          </p>
        </div>

        <div className="space-y-4">
          {review.bulletRewrites.map((rw, idx) => (
            <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              {/* Original Weak Bullet */}
              <div className="mb-2.5">
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  Weak / Original
                </span>
                <p className="mt-1 text-xs text-slate-600 line-through decoration-rose-400">
                  {rw.original}
                </p>
              </div>

              {/* Improved Impact Bullet */}
              <div className="rounded-lg border border-emerald-200 bg-white p-3 shadow-2xs">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    High-Impact XYZ Rewrite
                  </span>
                  <button
                    onClick={() => handleCopyBullet(rw.improved, idx)}
                    className="flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:bg-slate-100 transition"
                  >
                    {copiedBulletIdx === idx ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600" />
                        <span className="text-emerald-700">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 text-slate-400" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed">
                  {rw.improved}
                </p>
              </div>

              {/* Recruiter explanation */}
              <p className="mt-2 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">Why recruiters love this:</span>{' '}
                {rw.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
