import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Circle,
  FolderGit2,
  ExternalLink,
  BookOpen,
  Video,
  Code2,
  Award,
  Sparkles,
} from 'lucide-react';
import { RoadmapWeek } from '../types';

interface PlanRoadmapProps {
  roadmap: RoadmapWeek[];
  completedCheckpoints: Record<string, boolean>;
  onToggleCheckpoint: (key: string) => void;
  roleTitle: string;
}

export const PlanRoadmap: React.FC<PlanRoadmapProps> = ({
  roadmap,
  completedCheckpoints,
  onToggleCheckpoint,
  roleTitle,
}) => {
  const totalWeeks = roadmap.length;
  const completedCount = roadmap.filter((w) => completedCheckpoints[`week_${w.week}`]).length;
  const progressPercent = Math.round((completedCount / (totalWeeks || 1)) * 100);

  return (
    <div className="space-y-6">
      {/* Header with Progress Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              <h3 className="font-display text-lg font-bold text-slate-900">
                Week-by-Week ₹0 Action Roadmap
              </h3>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Curated zero-rupee curriculum tailored for {roleTitle}. Complete each week's checkpoint
              to unlock the next level.
            </p>
          </div>

          {/* Progress Tracker */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs font-bold text-slate-800">
                {completedCount} of {totalWeeks} Weeks Done
              </span>
              <p className="text-[11px] text-slate-500">{progressPercent}% Progress</p>
            </div>
            <div className="h-10 w-10 rounded-full border-4 border-orange-100 flex items-center justify-center font-display text-xs font-bold text-orange-600 bg-orange-50">
              {progressPercent}%
            </div>
          </div>
        </div>

        {/* Progress Bar Line */}
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Week Timeline Cards */}
      <div className="space-y-4">
        {roadmap.map((week) => {
          const isDone = !!completedCheckpoints[`week_${week.week}`];
          return (
            <div
              key={week.week}
              className={`rounded-2xl border transition ${
                isDone
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              } p-6 shadow-xs`}
            >
              {/* Top Week Meta */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-600 text-xs font-bold text-white shadow-2xs">
                    W{week.week}
                  </span>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-orange-600">
                      {week.phase}
                    </span>
                    <h4 className="text-base font-bold text-slate-900">{week.title}</h4>
                  </div>
                </div>

                {/* Mark as Done Toggle */}
                <button
                  type="button"
                  onClick={() => onToggleCheckpoint(`week_${week.week}`)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {isDone ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Checkpoint Verified</span>
                    </>
                  ) : (
                    <>
                      <Circle className="h-3.5 w-3.5 text-slate-400" />
                      <span>Mark Complete</span>
                    </>
                  )}
                </button>
              </div>

              {/* Goal Description */}
              <p className="mt-3 text-xs sm:text-sm font-medium text-slate-700">
                🎯 <span className="font-semibold">Goal:</span> {week.goal}
              </p>

              {/* Key Topics List */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {week.topics.map((topic, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                  >
                    {topic}
                  </span>
                ))}
              </div>

              {/* Hands-on Project Box */}
              {week.handsOnProject && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900">
                    <FolderGit2 className="h-4 w-4 text-amber-600" />
                    <span>Weekly Proof-of-Work Project: {week.handsOnProject.title}</span>
                  </div>
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-700">
                    {week.handsOnProject.description}
                  </p>
                  <div className="mt-2 text-xs font-medium text-amber-900 bg-white/70 p-2 rounded-lg border border-amber-100">
                    <span className="font-bold">Recruiter Deliverable: </span>
                    {week.handsOnProject.deliverable}
                  </div>
                  {week.handsOnProject.freeTools && week.handsOnProject.freeTools.length > 0 && (
                    <div className="mt-2 flex flex-wrap items-center gap-1 text-[11px] text-slate-500">
                      <span className="font-semibold">₹0 Tools:</span>
                      {week.handsOnProject.freeTools.map((tool, idx) => (
                        <span key={idx} className="rounded bg-white px-1.5 py-0.5 border border-slate-200 text-slate-700">
                          {tool}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Free Resources Grid */}
              <div className="mt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  ₹0 Curated Learning Resources:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {week.freeResources.map((res, idx) => (
                    <a
                      key={idx}
                      href={`https://www.google.com/search?q=${encodeURIComponent(
                        `${res.title} ${res.creatorOrPlatform}`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 transition hover:border-orange-300 hover:bg-orange-50/40"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {res.type === 'video' ? (
                          <Video className="h-4 w-4 text-rose-500 shrink-0" />
                        ) : res.type === 'practice' ? (
                          <Code2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        ) : (
                          <BookOpen className="h-4 w-4 text-blue-500 shrink-0" />
                        )}
                        <div className="truncate">
                          <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-orange-950">
                            {res.title}
                          </p>
                          <p className="text-[10px] text-slate-500">{res.creatorOrPlatform}</p>
                        </div>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-orange-600 shrink-0 ml-2" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Weekly Checkpoint Banner */}
              <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-100 px-3 py-2 text-xs">
                <span className="font-semibold text-slate-700">
                  🏁 <span className="text-slate-500">Milestone Checkpoint:</span> {week.checkpoint}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
