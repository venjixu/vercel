import React, { useState } from 'react';
import {
  Calendar,
  FileCheck2,
  Compass,
  Send,
  MessageSquare,
  Wrench,
  ArrowLeft,
  Share2,
  Check,
} from 'lucide-react';
import { CareerPlan } from '../types';
import { PlanExecutiveHeader } from './PlanExecutiveHeader';
import { PlanRoadmap } from './PlanRoadmap';
import { PlanAtsReview } from './PlanAtsReview';
import { PlanIndianStrategy } from './PlanIndianStrategy';
import { PlanReferrals } from './PlanReferrals';
import { PlanInterviewPrep } from './PlanInterviewPrep';
import { PlanZeroToolkit } from './PlanZeroToolkit';

interface CareerPlanViewProps {
  plan: CareerPlan;
  onReset: () => void;
  isSaved: boolean;
  onSavePlan: () => void;
  onOpenAskCoach: () => void;
  completedCheckpoints: Record<string, boolean>;
  onToggleCheckpoint: (key: string) => void;
}

type TabType = 'roadmap' | 'ats' | 'strategy' | 'referrals' | 'interview' | 'toolkit';

export const CareerPlanView: React.FC<CareerPlanViewProps> = ({
  plan,
  onReset,
  isSaved,
  onSavePlan,
  onOpenAskCoach,
  completedCheckpoints,
  onToggleCheckpoint,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('roadmap');
  const [copiedShare, setCopiedShare] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const text = `Check out my ₹0 Indian Career Roadmap for ${plan.roleTitle} with ${plan.salaryInsights.entryLPA} CTC benchmarks!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${text}\n${window.location.href}`);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const tabs: { id: TabType; label: string; icon: any; badge?: string }[] = [
    { id: 'roadmap', label: 'Roadmap & Projects', icon: Calendar },
    { id: 'ats', label: 'ATS Resume Audit', icon: FileCheck2, badge: `${plan.atsResumeReview.score}/100` },
    { id: 'strategy', label: 'Naukri & Notice Hacks', icon: Compass },
    { id: 'referrals', label: 'LinkedIn Referrals', icon: Send },
    { id: 'interview', label: 'Interview Simulator', icon: MessageSquare },
    { id: 'toolkit', label: '₹0 Free Toolkit', icon: Wrench },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top back navigation bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onReset}
          className="group flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Change Target Job or Upload Another CV</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
        >
          {copiedShare ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-emerald-700">Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="h-3.5 w-3.5 text-slate-400" />
              <span>Share Plan</span>
            </>
          )}
        </button>
      </div>

      {/* Executive Header Banner */}
      <PlanExecutiveHeader
        plan={plan}
        isSaved={isSaved}
        onSavePlan={onSavePlan}
        onOpenAskCoach={onOpenAskCoach}
        onPrint={handlePrint}
      />

      {/* Sticky Tab Navigation Bar */}
      <div className="sticky top-16 z-30 -mx-4 px-4 sm:mx-0 sm:px-0 bg-slate-50/95 py-2 backdrop-blur-md">
        <div className="flex items-center gap-1.5 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`rounded px-1.5 py-0.2 text-[10px] font-bold ${
                      isActive ? 'bg-slate-800 text-amber-300' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="min-h-[500px]">
        {activeTab === 'roadmap' && (
          <PlanRoadmap
            roadmap={plan.roadmap}
            completedCheckpoints={completedCheckpoints}
            onToggleCheckpoint={onToggleCheckpoint}
            roleTitle={plan.roleTitle}
          />
        )}

        {activeTab === 'ats' && (
          <PlanAtsReview review={plan.atsResumeReview} roleTitle={plan.roleTitle} />
        )}

        {activeTab === 'strategy' && (
          <PlanIndianStrategy strategy={plan.indianHiringStrategy} roleTitle={plan.roleTitle} />
        )}

        {activeTab === 'referrals' && (
          <PlanReferrals templates={plan.referralTemplates} roleTitle={plan.roleTitle} />
        )}

        {activeTab === 'interview' && (
          <PlanInterviewPrep mastery={plan.interviewMastery} roleTitle={plan.roleTitle} />
        )}

        {activeTab === 'toolkit' && <PlanZeroToolkit tools={plan.zeroCostToolkit} />}
      </div>
    </div>
  );
};
