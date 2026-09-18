/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CareerPlan } from './types';
import { Navbar } from './components/Navbar';
import { HeroInput } from './components/HeroInput';
import { CareerPlanView } from './components/CareerPlanView';
import { AskCoachModal } from './components/AskCoachModal';
import { SavedPlansModal } from './components/SavedPlansModal';
import {
  savePlanToStorage,
  getSavedPlans,
  deletePlanFromStorage,
  getCompletedCheckpoints,
  toggleCheckpoint,
} from './utils/storage';
import { AlertCircle, IndianRupee, Sparkles } from 'lucide-react';
import { PricingModal, PlanId } from './components/PricingModal';
import { PaymentModal } from './components/PaymentModal';
import { CareerTools } from './components/CareerTools';

export default function App() {
  const [currentPlan, setCurrentPlan] = useState<CareerPlan | null>(null);
  const [savedPlans, setSavedPlans] = useState<CareerPlan[]>([]);
  const [completedCheckpoints, setCompletedCheckpoints] = useState<Record<string, boolean>>({});
  const [isSavedPlansOpen, setIsSavedPlansOpen] = useState(false);
  const [isAskCoachOpen, setIsAskCoachOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [languagePreference, setLanguagePreference] = useState<'english' | 'hinglish'>('english');
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<PlanId | null>(null);
  const [premiumVersion, setPremiumVersion] = useState(0);

  // Load saved plans and checkpoints on mount
  useEffect(() => {
    setSavedPlans(getSavedPlans());
    setCompletedCheckpoints(getCompletedCheckpoints());
  }, []);

  const handleGeneratePlan = async (params: {
    targetJob: string;
    experienceLevel: string;
    currentSkills: string;
    targetCity: string;
    targetCompanyType: string;
    cvText?: string;
    cvFileBase64?: string;
    cvFileName?: string;
    cvMimeType?: string;
    languagePreference: 'english' | 'hinglish';
  }) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/coach/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      if (data.plan) {
        const planWithMeta: CareerPlan = {
          ...data.plan,
          id: `plan_${Date.now()}`,
          createdAt: new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
        };
        setCurrentPlan(planWithMeta);
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error('No plan data received');
      }
    } catch (err: any) {
      console.error('Plan generation failed:', err);
      setErrorMessage(
        err.message || 'Failed to generate career plan. Please check your inputs and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePlan = () => {
    if (!currentPlan) return;
    savePlanToStorage(currentPlan);
    setSavedPlans(getSavedPlans());
  };

  const handleDeletePlan = (id: string) => {
    const updated = deletePlanFromStorage(id);
    setSavedPlans(updated);
    if (currentPlan?.id === id) {
      // keep active in view, or do nothing
    }
  };

  const handleToggleCheckpoint = (key: string) => {
    const updated = toggleCheckpoint(key);
    setCompletedCheckpoints(updated);
  };

  const handleToggleLanguage = () => {
    setLanguagePreference((prev) => (prev === 'english' ? 'hinglish' : 'english'));
  };

  const isCurrentPlanSaved =
    !!currentPlan && savedPlans.some((p) => p.id === currentPlan.id || p.roleTitle === currentPlan.roleTitle);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Navigation Header */}
      <Navbar
        savedPlansCount={savedPlans.length}
        onOpenSavedPlans={() => setIsSavedPlansOpen(true)}
        onOpenAskCoach={() => setIsAskCoachOpen(true)}
        onReset={() => {
          setCurrentPlan(null);
          setErrorMessage(null);
        }}
        hasActivePlan={!!currentPlan}
        languagePreference={languagePreference}
        onToggleLanguage={handleToggleLanguage}
      />

      {/* Error alert toast */}
      {errorMessage && (
        <div className="mx-auto mt-4 max-w-2xl px-4">
          <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs sm:text-sm text-rose-900 shadow-sm">
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
            <div className="flex-1">
              <p className="font-bold">Error generating plan</p>
              <p className="text-rose-800">{errorMessage}</p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs font-semibold text-rose-700 underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPlan ? (
          <>
          <CareerPlanView
            plan={currentPlan}
            onReset={() => {
              setCurrentPlan(null);
              setErrorMessage(null);
            }}
            isSaved={isCurrentPlanSaved}
            onSavePlan={handleSavePlan}
            onOpenAskCoach={() => setIsAskCoachOpen(true)}
            completedCheckpoints={completedCheckpoints}
            onToggleCheckpoint={handleToggleCheckpoint}
          />
          <CareerTools plan={currentPlan} onUpgrade={() => setIsPricingOpen(true)} premiumVersion={premiumVersion} />
          </>
        ) : (
          <HeroInput
            onGenerate={handleGeneratePlan}
            isLoading={isLoading}
            languagePreference={languagePreference}
          />
        )}
      </main>

      {/* Floating Ask Coach button on mobile */}
      {!isAskCoachOpen && (
        <button
          onClick={() => setIsAskCoachOpen(true)}
          className="sm:hidden fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-orange-600 text-white shadow-xl shadow-orange-600/40 hover:bg-orange-700 transition"
          aria-label="Ask Career Coach"
        >
          <Sparkles className="h-6 w-6 text-amber-300" />
        </button>
      )}

      {/* Saved Plans Modal */}
      <SavedPlansModal
        isOpen={isSavedPlansOpen}
        onClose={() => setIsSavedPlansOpen(false)}
        savedPlans={savedPlans}
        onSelectPlan={(plan) => {
          setCurrentPlan(plan);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onDeletePlan={handleDeletePlan}
      />

      {/* Pricing + checkout */}
      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} onSelect={(id) => { setIsPricingOpen(false); setCheckoutPlan(id); }} />
      <PaymentModal plan={checkoutPlan} onClose={() => setCheckoutPlan(null)} onPaid={() => { setCheckoutPlan(null); setPremiumVersion(v => v + 1); }} />

      {/* Ask Coach Modal */}
      <AskCoachModal
        isOpen={isAskCoachOpen}
        onClose={() => setIsAskCoachOpen(false)}
        activePlan={currentPlan}
        languagePreference={languagePreference}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">FresherAI</span>
            <span>•</span>
            <button onClick={() => setIsPricingOpen(true)} className="text-orange-700 font-semibold hover:underline">Premium from ₹49</button>
            <span>•</span>
            <span>Upgrade only when you need premium tools</span>
          </div>

          <p className="text-slate-400 text-center sm:text-right">
            Curated for Tier 1/2/3 college freshers, service-to-product switchers & career changers.
          </p>
        </div>
      </footer>
    </div>
  );
}
