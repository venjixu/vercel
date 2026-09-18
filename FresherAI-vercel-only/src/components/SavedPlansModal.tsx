import React from 'react';
import {
  X,
  Bookmark,
  Trash2,
  ArrowRight,
  IndianRupee,
  Calendar,
  FileCheck2,
} from 'lucide-react';
import { CareerPlan } from '../types';

interface SavedPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedPlans: CareerPlan[];
  onSelectPlan: (plan: CareerPlan) => void;
  onDeletePlan: (id: string) => void;
}

export const SavedPlansModal: React.FC<SavedPlansModalProps> = ({
  isOpen,
  onClose,
  savedPlans,
  onSelectPlan,
  onDeletePlan,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 sm:p-6">
      <div className="flex flex-col h-[520px] max-h-[85vh] w-full max-w-xl rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
          <div className="flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-orange-600" />
            <h3 className="font-display text-base font-bold text-slate-900">
              Saved Career Plans ({savedPlans.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {savedPlans.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center text-center">
              <Bookmark className="h-10 w-10 text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-700">No saved career plans yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Generate a plan and click “Save Plan” to bookmark your roadmap and ATS review here.
              </p>
            </div>
          ) : (
            savedPlans.map((plan) => (
              <div
                key={plan.id || plan.roleTitle}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-orange-300 hover:bg-orange-50/20"
              >
                <div
                  onClick={() => {
                    onSelectPlan(plan);
                    onClose();
                  }}
                  className="flex-1 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <h4 className="font-display text-sm sm:text-base font-bold text-slate-900 group-hover:text-orange-950">
                      {plan.roleTitle}
                    </h4>
                    <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                      {plan.salaryInsights.entryLPA}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{plan.summary}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {plan.createdAt || 'Recent'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <FileCheck2 className="h-3 w-3" />
                      ATS Score: {plan.atsResumeReview.score}/100
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      onSelectPlan(plan);
                      onClose();
                    }}
                    className="rounded-xl bg-orange-50 p-2 text-orange-600 hover:bg-orange-100 transition"
                    title="Load this plan"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => plan.id && onDeletePlan(plan.id)}
                    className="rounded-xl p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                    title="Delete plan"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
