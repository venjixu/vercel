export interface SalaryInsights {
  entryLPA: string;
  midLPA: string;
  tier1LPA: string;
  takeHomeTip: string;
}

export interface BulletRewrite {
  original: string;
  improved: string;
  explanation: string;
}

export interface ATSResumeReview {
  score: number;
  strengths: string[];
  criticalGaps: string[];
  missingKeywords: string[];
  bulletRewrites: BulletRewrite[];
}

export interface FreeResource {
  title: string;
  creatorOrPlatform: string;
  urlSuggestion?: string;
  type: 'video' | 'docs' | 'course' | 'practice' | string;
}

export interface HandsOnProject {
  title: string;
  description: string;
  deliverable: string;
  freeTools?: string[];
}

export interface RoadmapWeek {
  week: number;
  phase: string;
  title: string;
  goal: string;
  topics: string[];
  handsOnProject: HandsOnProject;
  freeResources: FreeResource[];
  checkpoint: string;
}

export interface TargetCompanyGroup {
  category: string;
  examples: string[];
  hiringBar: string;
}

export interface IndianHiringStrategy {
  naukriStrategy: string;
  instahyreWellfoundTip: string;
  noticePeriodHack: string;
  targetCompanies: TargetCompanyGroup[];
}

export interface ReferralTemplate {
  target: string;
  subject?: string;
  body: string;
  proTip: string;
}

export interface InterviewRound {
  round: string;
  focus: string;
  keyAdvice: string;
}

export interface InterviewQuestion {
  question: string;
  category: string;
  winningAnswerFramework: string;
  trapToAvoid: string;
}

export interface InterviewMastery {
  rounds: InterviewRound[];
  topQuestions: InterviewQuestion[];
}

export interface ZeroCostTool {
  name: string;
  purpose: string;
  cost: string;
  linkText?: string;
}

export interface CareerPlan {
  id?: string;
  createdAt?: string;
  summary: string;
  roleTitle: string;
  marketVerdict: string;
  salaryInsights: SalaryInsights;
  topHiringHubs: string[];
  atsResumeReview: ATSResumeReview;
  roadmap: RoadmapWeek[];
  indianHiringStrategy: IndianHiringStrategy;
  referralTemplates: ReferralTemplate[];
  interviewMastery: InterviewMastery;
  zeroCostToolkit: ZeroCostTool[];
}

export interface CareerArchetype {
  id: string;
  title: string;
  targetRole: string;
  currentBackground: string;
  experienceLevel: string;
  targetCity: string;
  targetCompanyType: string;
  skills: string;
  badge: string;
  highlight: string;
}
