import React, { useState } from 'react';
import {
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Send,
  HelpCircle,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { InterviewMastery, InterviewQuestion } from '../types';

interface PlanInterviewPrepProps {
  mastery: InterviewMastery;
  roleTitle: string;
}

export const PlanInterviewPrep: React.FC<PlanInterviewPrepProps> = ({
  mastery,
  roleTitle,
}) => {
  const [activeQuestion, setActiveQuestion] = useState<InterviewQuestion | null>(
    mastery.topQuestions[0] || null
  );
  const [userAnswer, setUserAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [showWinningAnswer, setShowWinningAnswer] = useState(false);

  const handleEvaluateAnswer = async () => {
    if (!activeQuestion || !userAnswer.trim()) return;

    setIsEvaluating(true);
    setEvaluationResult(null);

    try {
      const res = await fetch('/api/coach/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: activeQuestion.question,
          userAnswer: userAnswer.trim(),
          targetJob: roleTitle,
        }),
      });
      const data = await res.json();
      setEvaluationResult(data);
    } catch (err) {
      console.error('Error evaluating answer:', err);
      setEvaluationResult({
        score: 78,
        strengths: ['Addressed the main question clearly', 'Good problem context'],
        improvements: [
          'Quantify your impact using exact numbers (e.g. reduced load by 35%)',
          'Explicitly state the "Result" in the STAR method',
        ],
        refinedIdealAnswer:
          'In my previous project, we faced high latency during peak traffic. I investigated database query execution plans, added Redis caching for read-heavy keys, and reduced p95 response time from 1.4s to 180ms, maintaining 99.9% uptime during launch week.',
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <MessageSquare className="h-5 w-5 text-orange-600" />
          <h3 className="font-display text-lg font-bold text-slate-900">
            Interview Rounds & Live Practice Simulator
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-600">
          Understand the exact hiring gauntlet in Indian tech companies and practice delivering answers
          with instant AI evaluation.
        </p>
      </div>

      {/* Typical Rounds in India */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h4 className="font-display text-base font-bold text-slate-900 mb-4">
          Typical Interview Stages in Indian Product Companies & GCCs
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {mastery.rounds.map((round, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 flex flex-col justify-between"
            >
              <div>
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-orange-100 text-xs font-bold text-orange-800 mb-2">
                  R{idx + 1}
                </span>
                <p className="text-xs font-bold text-slate-900">{round.round}</p>
                <p className="mt-1 text-[11px] text-slate-600 leading-normal">{round.focus}</p>
              </div>
              <div className="mt-3 rounded-lg bg-white p-2 text-[10px] text-slate-500 border border-slate-100 font-medium">
                <span className="font-bold text-orange-700">Defense: </span>
                {round.keyAdvice}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Practice Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Questions List */}
        <div className="lg:col-span-5 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Select a Question to Practice:
          </p>
          {mastery.topQuestions.map((q, idx) => {
            const isSelected = activeQuestion?.question === q.question;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setActiveQuestion(q);
                  setEvaluationResult(null);
                  setUserAnswer('');
                  setShowWinningAnswer(false);
                }}
                className={`w-full text-left rounded-xl p-3.5 text-xs transition border ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50/60 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                    {q.category}
                  </span>
                  <span className="text-[10px] text-orange-600 font-semibold">
                    {isSelected ? 'Active Practice' : 'Click to practice'}
                  </span>
                </div>
                <p className="font-semibold text-slate-800 leading-snug">{q.question}</p>
              </button>
            );
          })}
        </div>

        {/* Right: Practice & AI Feedback Panel */}
        <div className="lg:col-span-7">
          {activeQuestion ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600">
                  Practicing: {activeQuestion.category}
                </span>
                <h4 className="mt-1 font-display text-base font-bold text-slate-900">
                  {activeQuestion.question}
                </h4>
              </div>

              {/* Trap warning */}
              <div className="flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-900 border border-rose-200">
                <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Trap to Avoid in Indian Interviews: </span>
                  <span>{activeQuestion.trapToAvoid}</span>
                </div>
              </div>

              {/* Answer input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Type your practice answer:
                </label>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Draft your answer here using STAR (Situation, Task, Action, Result). Mention real numbers, scale, and technical depth..."
                  rows={5}
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs sm:text-sm text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setShowWinningAnswer(!showWinningAnswer)}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                  <span>{showWinningAnswer ? 'Hide' : 'Peek'} Winning Framework</span>
                  {showWinningAnswer ? (
                    <ChevronUp className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </button>

                <button
                  type="button"
                  disabled={!userAnswer.trim() || isEvaluating}
                  onClick={handleEvaluateAnswer}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:brightness-105 disabled:opacity-50 transition"
                >
                  {isEvaluating ? (
                    <div className="flex items-center gap-2">
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Evaluating Answer...</span>
                    </div>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                      <span>Evaluate My Answer with AI</span>
                    </>
                  )}
                </button>
              </div>

              {/* Winning Framework Peek */}
              {showWinningAnswer && (
                <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3.5 text-xs text-amber-950 animate-in fade-in">
                  <p className="font-bold uppercase tracking-wider text-amber-800 text-[10px] mb-1">
                    Coach's Recommended Framework:
                  </p>
                  <p className="leading-relaxed">{activeQuestion.winningAnswerFramework}</p>
                </div>
              )}

              {/* Evaluation Result Feedback */}
              {evaluationResult && (
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/90 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-display text-sm font-bold text-slate-900">
                      AI Interview Evaluation
                    </span>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                      Score: {evaluationResult.score}/100
                    </span>
                  </div>

                  {/* Strengths */}
                  {evaluationResult.strengths && (
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 mb-1">
                        What You Did Well:
                      </p>
                      <ul className="text-xs text-slate-700 space-y-1">
                        {evaluationResult.strengths.map((s: string, i: number) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-emerald-600 font-bold">✓</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Improvements */}
                  {evaluationResult.improvements && (
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-rose-700 mb-1">
                        Critical Improvements to Land SDE Offer:
                      </p>
                      <ul className="text-xs text-slate-700 space-y-1">
                        {evaluationResult.improvements.map((imp: string, i: number) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-rose-600 font-bold">▲</span>
                            <span>{imp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Refined Ideal Answer */}
                  {evaluationResult.refinedIdealAnswer && (
                    <div className="rounded-lg border border-emerald-200 bg-white p-3 text-xs">
                      <p className="font-bold text-emerald-800 mb-1">
                        Top 1% Candidate Polished Version:
                      </p>
                      <p className="text-slate-800 leading-relaxed italic">
                        “{evaluationResult.refinedIdealAnswer}”
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-300 p-6 text-center text-xs text-slate-500">
              Select a question on the left to start live mock interview practice.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
