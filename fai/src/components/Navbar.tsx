import React from 'react';
import { Sparkles, Bookmark, MessageSquareCode, Compass } from 'lucide-react';
import { CareerPlan } from '../types';

interface NavbarProps {
  savedPlansCount: number;
  onOpenSavedPlans: () => void;
  onOpenAskCoach: () => void;
  onReset: () => void;
  hasActivePlan: boolean;
  languagePreference: 'english' | 'hinglish';
  onToggleLanguage: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  savedPlansCount,
  onOpenSavedPlans,
  onOpenAskCoach,
  onReset,
  hasActivePlan,
  languagePreference,
  onToggleLanguage,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <button
          onClick={onReset}
          className="group flex items-center gap-2.5 text-left transition hover:opacity-90"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-emerald-600 text-white shadow-sm shadow-orange-500/20">
            <Compass className="h-5 w-5 transition-transform group-hover:rotate-12" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-lg font-bold tracking-tight text-slate-900">
                FresherAI
              </span>
              <span className="inline-flex items-center rounded-md bg-emerald-50 px-1.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20 ring-inset">
                🇮🇳 India
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              100% Free · ₹0 Investment · Real Job Results
            </p>
          </div>
        </button>

        {/* Right action controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language toggle: English / Hinglish */}
          <button
            onClick={onToggleLanguage}
            title="Toggle between English and Hinglish coaching notes"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <span className="text-slate-400">Language:</span>
            <span className="font-semibold text-orange-600">
              {languagePreference === 'hinglish' ? 'Hinglish' : 'English'}
            </span>
          </button>

          {/* Ask AI Coach Quick button */}
          <button
            onClick={onOpenAskCoach}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs transition hover:border-slate-300 hover:bg-slate-50"
          >
            <MessageSquareCode className="h-4 w-4 text-orange-500" />
            <span className="hidden md:inline">Ask Coach</span>
          </button>

          {/* Saved plans */}
          <button
            onClick={onOpenSavedPlans}
            className="relative flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs transition hover:border-slate-300 hover:bg-slate-50"
          >
            <Bookmark className="h-4 w-4 text-slate-500" />
            <span className="hidden sm:inline">Saved Plans</span>
            {savedPlansCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-[10px] font-bold text-white">
                {savedPlansCount}
              </span>
            )}
          </button>

          {/* New Plan button if currently viewing a plan */}
          {hasActivePlan && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>New Target</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
