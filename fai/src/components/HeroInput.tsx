import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Upload,
  FileText,
  Briefcase,
  MapPin,
  Building2,
  Code2,
  ArrowRight,
  CheckCircle2,
  X,
  Zap,
  IndianRupee,
  GraduationCap,
  Layers,
} from 'lucide-react';
import {
  POPULAR_ARCHETYPES,
  INDIAN_CITIES,
  EXPERIENCE_LEVELS,
  COMPANY_TIERS,
} from '../data/popularRoles';
import { CareerArchetype } from '../types';

interface HeroInputProps {
  onGenerate: (params: {
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
  }) => Promise<void>;
  isLoading: boolean;
  languagePreference: 'english' | 'hinglish';
}

export const HeroInput: React.FC<HeroInputProps> = ({
  onGenerate,
  isLoading,
  languagePreference,
}) => {
  const [activeTab, setActiveTab] = useState<'job' | 'cv'>('job');
  const [targetJob, setTargetJob] = useState('');
  const [experienceLevel, setExperienceLevel] = useState(EXPERIENCE_LEVELS[0]);
  const [targetCity, setTargetCity] = useState(INDIAN_CITIES[0]);
  const [targetCompanyType, setTargetCompanyType] = useState(COMPANY_TIERS[0]);
  const [currentSkills, setCurrentSkills] = useState('');

  // CV Upload state
  const [cvFileName, setCvFileName] = useState<string | null>(null);
  const [cvFileBase64, setCvFileBase64] = useState<string | null>(null);
  const [cvMimeType, setCvMimeType] = useState<string>('application/pdf');
  const [cvText, setCvText] = useState('');
  const [cvUploadMode, setCvUploadMode] = useState<'file' | 'paste'>('file');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Loading steps animation
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingMessages = [
    'Analyzing Indian hiring market trends in 2026...',
    'Benchmarking realistic CTC bands across Bengaluru, Hyderabad & NCR...',
    'Extracting high-velocity ATS keywords for Naukri & Instahyre...',
    'Curating ₹0 week-by-week roadmap with Striver, NeetCode & open-source specs...',
    'Drafting LinkedIn referral outreach templates & interview defense...',
  ];

  React.useEffect(() => {
    let interval: any;
    if (isLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 2400);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCvFileName(file.name);
    setCvMimeType(file.type || 'application/pdf');

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setCvFileBase64(result);
    };
    reader.readAsDataURL(file);
  };

  const handleArchetypeClick = (archetype: CareerArchetype) => {
    setTargetJob(archetype.targetRole);
    setExperienceLevel(archetype.experienceLevel);
    setTargetCity(archetype.targetCity);
    setTargetCompanyType(archetype.targetCompanyType);
    setCurrentSkills(archetype.skills);
    setActiveTab('job');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetJob && !cvFileBase64 && !cvText.trim()) {
      return;
    }

    await onGenerate({
      targetJob: targetJob.trim() || 'Software Engineer / Derived from CV',
      experienceLevel,
      currentSkills: currentSkills.trim(),
      targetCity,
      targetCompanyType,
      cvText: cvText.trim(),
      cvFileBase64: cvFileBase64 || undefined,
      cvFileName: cvFileName || undefined,
      cvMimeType,
      languagePreference,
    });
  };

  return (
    <div className="relative overflow-hidden py-10 sm:py-16">
      {/* Background soft gradients */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-orange-200/40 blur-3xl" />
      <div className="pointer-events-none absolute top-40 right-10 -z-10 h-80 w-80 rounded-full bg-emerald-100/40 blur-3xl" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header Title Section */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50/80 px-3 py-1 text-xs font-semibold text-orange-800 shadow-xs mb-4">
            <IndianRupee className="h-3.5 w-3.5 text-orange-600" />
            <span>Built for India · ₹0 Spend Promise · Zero Cost Bootcamps</span>
          </div>

          <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            “Tell me what job you want. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-600 bg-clip-text text-transparent">
              I’ll help you get it.
            </span>”
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed">
            Enter your dream job or upload your CV. Receive a step-by-step roadmap,
            ATS keyword scan, CTC salary benchmarks in LPA, and referral strategies
            tailored for the Indian market.
          </p>
        </div>

        {/* 1-Click Indian Archetype Chips */}
        <div className="mt-8">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 text-center mb-3">
            Quick 1-Click Test Drives for Common Indian Transitions
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {POPULAR_ARCHETYPES.map((arch) => (
              <button
                key={arch.id}
                type="button"
                onClick={() => handleArchetypeClick(arch)}
                className="group flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-2xs transition hover:border-orange-300 hover:bg-orange-50/60 hover:text-orange-950"
              >
                <span className="font-semibold text-orange-600 group-hover:scale-105 transition-transform">
                  ★
                </span>
                <span>{arch.title}</span>
                <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500 group-hover:bg-orange-100 group-hover:text-orange-800">
                  {arch.badge}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Input Card */}
        <div className="mt-8 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-8">
          {/* Tabs: Target Job vs Upload CV */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab('job')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs sm:text-sm font-semibold transition ${
                activeTab === 'job'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="h-4 w-4 text-orange-600" />
              <span>Enter Target Job</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('cv')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs sm:text-sm font-semibold transition ${
                activeTab === 'cv'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="h-4 w-4 text-emerald-600" />
              <span>Upload or Paste CV</span>
              {(cvFileName || cvText.trim()) && (
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              )}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {activeTab === 'job' ? (
              <>
                {/* Target Job Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    What job do you want? *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={targetJob}
                      onChange={(e) => setTargetJob(e.target.value)}
                      placeholder="e.g. SDE-1 Frontend Engineer, Data Analyst, Java Backend Developer, AI Engineer..."
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-3 focus:ring-orange-500/15"
                      required
                    />
                    <Sparkles className="pointer-events-none absolute right-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5 text-xs text-slate-500">
                    <span className="text-slate-400">Suggestions:</span>
                    {[
                      'Full Stack React + Node',
                      'Java Spring Boot (GCCs)',
                      'Data Analyst (SQL/PowerBI)',
                      'DevOps & Cloud Engineer',
                      'Product Manager (Fintech)',
                    ].map((sugg) => (
                      <button
                        type="button"
                        key={sugg}
                        onClick={() => setTargetJob(sugg)}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-700 hover:bg-orange-100 hover:text-orange-900 transition"
                      >
                        {sugg}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid for Experience and City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Experience Level */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <GraduationCap className="h-3.5 w-3.5 text-slate-500" />
                      Current Experience / Stage
                    </label>
                    <select
                      value={experienceLevel}
                      onChange={(e) => setExperienceLevel(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-3 focus:ring-orange-500/15"
                    >
                      {EXPERIENCE_LEVELS.map((exp) => (
                        <option key={exp} value={exp}>
                          {exp}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Target City */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-500" />
                      Target Location in India
                    </label>
                    <select
                      value={targetCity}
                      onChange={(e) => setTargetCity(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-3 focus:ring-orange-500/15"
                    >
                      {INDIAN_CITIES.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Grid for Company Tier and Current Skills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Company Tier */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-slate-500" />
                      Target Company Type
                    </label>
                    <select
                      value={targetCompanyType}
                      onChange={(e) => setTargetCompanyType(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-3 focus:ring-orange-500/15"
                    >
                      {COMPANY_TIERS.map((tier) => (
                        <option key={tier} value={tier}>
                          {tier}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Current Skills */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Code2 className="h-3.5 w-3.5 text-slate-500" />
                      Current Skills (Optional)
                    </label>
                    <input
                      type="text"
                      value={currentSkills}
                      onChange={(e) => setCurrentSkills(e.target.value)}
                      placeholder="e.g. JavaScript, C++, SQL, Manual QA, Excel..."
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-3 focus:ring-orange-500/15"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* CV Tab Mode */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Attach Your Resume for Deep ATS Audit
                    </label>
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setCvUploadMode('file')}
                        className={`font-semibold ${
                          cvUploadMode === 'file'
                            ? 'text-emerald-700 underline underline-offset-4'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Upload PDF
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        type="button"
                        onClick={() => setCvUploadMode('paste')}
                        className={`font-semibold ${
                          cvUploadMode === 'paste'
                            ? 'text-emerald-700 underline underline-offset-4'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Paste Text
                      </button>
                    </div>
                  </div>

                  {cvUploadMode === 'file' ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition cursor-pointer ${
                        cvFileName
                          ? 'border-emerald-500 bg-emerald-50/40'
                          : 'border-slate-300 bg-slate-50/60 hover:border-emerald-400 hover:bg-emerald-50/20'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.txt"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      {cvFileName ? (
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
                            <FileText className="h-6 w-6" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-semibold text-slate-900">
                              {cvFileName}
                            </p>
                            <p className="text-xs text-emerald-600 font-medium">
                              ✓ Ready for Multimodal ATS Analysis
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCvFileName(null);
                              setCvFileBase64(null);
                            }}
                            className="ml-2 rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                            <Upload className="h-5 w-5" />
                          </div>
                          <p className="text-sm font-semibold text-slate-800">
                            Click to upload your resume (PDF or TXT)
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            Our AI will scan ATS keyword match, bullet impact, and Indian recruiter gaps
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <textarea
                        value={cvText}
                        onChange={(e) => setCvText(e.target.value)}
                        placeholder="Paste your resume content here (Work experience, education, projects, skills)..."
                        rows={6}
                        className="w-full rounded-xl border border-slate-300 bg-white p-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-3 focus:ring-emerald-500/15"
                      />
                    </div>
                  )}

                  {/* Target job input for CV mode as well */}
                  <div className="mt-4">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Target Job Title (Optional if in CV)
                    </label>
                    <input
                      type="text"
                      value={targetJob}
                      onChange={(e) => setTargetJob(e.target.value)}
                      placeholder="e.g. SDE-1 Backend, Data Scientist, Product Analyst (Leave empty to let AI deduce)"
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 px-6 py-3.5 text-sm sm:text-base font-bold text-white shadow-md shadow-orange-600/25 transition hover:brightness-105 active:scale-[0.99] disabled:opacity-60"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Creating Your ₹0 Career Plan...</span>
                  </div>
                ) : (
                  <>
                    <span>Generate My Personalized ₹0 Career Plan</span>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Animated Loading Status */}
          {isLoading && (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-amber-900 mb-1">
                <Zap className="h-4 w-4 text-amber-600 animate-pulse" />
                <span>Coach Thinking & Synthesizing</span>
              </div>
              <p className="text-xs sm:text-sm text-amber-800 font-medium">
                {loadingMessages[loadingStep]}
              </p>
            </div>
          )}

          {/* Value guarantee row */}
          <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-orange-50 p-3 text-xs text-orange-900"><span className="font-bold">Try free first:</span> get your ATS score, then unlock fixes from ₹49.</div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-100 pt-5 text-center text-xs text-slate-600">
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>₹0 Curated Free Resources</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Realistic LPA Salary Bands</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Naukri & LinkedIn Referrals</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
