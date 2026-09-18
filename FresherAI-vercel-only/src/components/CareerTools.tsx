import React, { useEffect, useMemo, useState } from 'react';
import { BriefcaseBusiness, FileText, Lock, MessageSquareText, Plus, Sparkles, Target, Trash2 } from 'lucide-react';
import { CareerPlan } from '../types';
import { PlanId } from './PricingModal';

const hasPremium = (minimum: PlanId) => {
  try {
    const token = localStorage.getItem('fresherai_entitlement');
    if (!token) return false;
    const [, payload] = token.split('.');
    if (!payload) return false;
    const data = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    const order = { 'resume-pro': 1, 'job-hunter': 2, 'career-pack': 3 } as Record<PlanId, number>;
    if (data.expiresAt && Date.now() >= data.expiresAt) return false;
    return order[data.plan as PlanId] >= order[minimum];
  } catch { return false; }
};

export const CareerTools: React.FC<{ plan: CareerPlan; onUpgrade: (minimum?: PlanId) => void; premiumVersion: number; }> = ({ plan, onUpgrade, premiumVersion }) => {
  const [resume, setResume] = useState(''); const [jd, setJd] = useState(''); const [cover, setCover] = useState(''); const [tracker, setTracker] = useState<{company:string; role:string; status:string}[]>([]); const [company, setCompany] = useState(''); const [role, setRole] = useState(''); const [status, setStatus] = useState('Applied');
  const pro = useMemo(() => hasPremium('resume-pro'), [premiumVersion]); const hunter = useMemo(() => hasPremium('job-hunter'), [premiumVersion]);
  useEffect(() => { try { setTracker(JSON.parse(localStorage.getItem('fresherai_tracker') || '[]')); } catch {} }, []);
  const saveTracker = (next: typeof tracker) => { setTracker(next); localStorage.setItem('fresherai_tracker', JSON.stringify(next)); };
  const generateResume = () => { if (!pro) return onUpgrade('resume-pro'); const keywords = plan.atsResumeReview.missingKeywords.join(', '); setResume(`${plan.roleTitle}\n\nPROFESSIONAL SUMMARY\n${plan.summary}\n\nKEY SKILLS\n${keywords || 'Add skills from the target job description'}\n\nEXPERIENCE / PROJECTS\n${plan.atsResumeReview.bulletRewrites.map(b => '• ' + b.improved).join('\n')}\n\nEDUCATION\nAdd your degree, institution and graduation year.`); };
  const tailor = () => { if (!pro) return onUpgrade('resume-pro'); const kws = jd.match(/[A-Za-z][A-Za-z+#.-]{2,}/g)?.slice(0, 12) || []; setResume(`${plan.roleTitle} — Tailored Resume\n\nATS KEYWORDS\n${kws.join(' · ')}\n\nSUMMARY\n${plan.summary}\n\nIMPACT BULLETS\n${plan.atsResumeReview.bulletRewrites.map(b => '• ' + b.improved).join('\n')}`); };
  const makeCover = () => { if (!hunter) return onUpgrade('job-hunter'); setCover(`Dear Hiring Manager,\n\nI am excited to apply for the ${plan.roleTitle} position. ${plan.summary}\n\nMy experience demonstrates the ability to turn skills into measurable outcomes. I would welcome the opportunity to discuss how I can contribute to your team.\n\nRegards,\nYour Name`); };
  const exportPdf = () => { if (!pro) return onUpgrade('resume-pro'); window.print(); };
  return <section className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8 pb-10" id="career-tools">
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-orange-600">Career tools</p><h2 className="text-2xl font-extrabold">Turn your plan into applications.</h2><p className="text-sm text-slate-500">Free ATS feedback first. Premium unlocks the repeatable job-search workflow.</p></div><button onClick={() => onUpgrade()} className="rounded-xl bg-orange-600 px-4 py-2.5 text-xs font-bold text-white">View plans</button></div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <ToolCard icon={<FileText />} title="AI Resume Generator" locked={!pro} onClick={generateResume} button="Generate resume"><textarea value={resume} onChange={e => setResume(e.target.value)} placeholder="Your generated resume will appear here…" className="h-48 w-full rounded-xl border border-slate-200 p-3 text-xs outline-none focus:border-orange-400" /></ToolCard>
        <ToolCard icon={<Target />} title="Job Description → Tailored Resume" locked={!pro} onClick={tailor} button="Tailor resume"><textarea value={jd} onChange={e => setJd(e.target.value)} placeholder="Paste a job description, then tailor your resume to its keywords." className="h-24 w-full rounded-xl border border-slate-200 p-3 text-xs outline-none focus:border-orange-400" /><textarea value={resume} readOnly className="mt-2 h-20 w-full rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs" /></ToolCard>
        <ToolCard icon={<MessageSquareText />} title="Cover Letter Generator" locked={!hunter} onClick={makeCover} button="Generate cover letter"><textarea value={cover} onChange={e => setCover(e.target.value)} placeholder="A tailored cover letter will appear here…" className="h-48 w-full rounded-xl border border-slate-200 p-3 text-xs outline-none focus:border-orange-400" /></ToolCard>
        <ToolCard icon={<BriefcaseBusiness />} title="Clean PDF Export" locked={!pro} onClick={exportPdf} button="Export / Print PDF"><div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center text-xs text-slate-500">Uses your browser's clean print-to-PDF flow.<br/>Choose “Save as PDF” in the print dialog.</div></ToolCard>
      </div>
      <div className="mt-6 rounded-2xl border border-slate-200 p-4"><div className="flex items-center justify-between"><div><h3 className="font-bold">Application Tracker</h3><p className="text-xs text-slate-500">Save applications locally in this browser.</p></div><Plus className="h-5 w-5 text-slate-400" /></div><div className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_150px_auto]"><input value={company} onChange={e=>setCompany(e.target.value)} placeholder="Company" className="rounded-lg border p-2 text-xs"/><input value={role} onChange={e=>setRole(e.target.value)} placeholder="Role" className="rounded-lg border p-2 text-xs"/><select value={status} onChange={e=>setStatus(e.target.value)} className="rounded-lg border p-2 text-xs"><option>Applied</option><option>Interview</option><option>Offer</option><option>Rejected</option></select><button onClick={()=>{if(company&&role){saveTracker([...tracker,{company,role,status}]);setCompany('');setRole('')}}} className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white">Add</button></div><div className="mt-3 space-y-2">{tracker.map((x,i)=><div key={i} className="flex items-center justify-between rounded-lg bg-slate-50 p-2.5 text-xs"><span><b>{x.company}</b> · {x.role}</span><span className="flex items-center gap-2"><span className="rounded-full bg-white px-2 py-1">{x.status}</span><button onClick={()=>saveTracker(tracker.filter((_,j)=>j!==i))}><Trash2 className="h-3.5 w-3.5 text-slate-400"/></button></span></div>)}</div></div>
    </div>
  </section>;
};

const ToolCard: React.FC<{icon:React.ReactNode;title:string;locked:boolean;onClick:()=>void;button:string;children:React.ReactNode}> = ({icon,title,locked,onClick,button,children}) => <div className="rounded-2xl border border-slate-200 p-4"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="rounded-lg bg-orange-50 p-2 text-orange-600">{React.cloneElement(icon as React.ReactElement,{className:'h-4 w-4'})}</span><h3 className="font-bold text-sm">{title}</h3></div>{locked&&<span className="flex items-center gap-1 text-[10px] font-bold uppercase text-slate-400"><Lock className="h-3 w-3"/> Premium</span>}</div><div className={locked?'mt-3 opacity-60':''}>{children}</div><button onClick={onClick} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white">{locked?<Lock className="h-3 w-3"/>:<Sparkles className="h-3 w-3"/>}{button}</button></div>;
