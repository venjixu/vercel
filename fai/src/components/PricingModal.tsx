import React from 'react';
import { Check, X, Sparkles } from 'lucide-react';

export type PlanId = 'resume-pro' | 'job-hunter' | 'career-pack';

const plans = [
  { id: 'resume-pro' as PlanId, name: 'Resume Pro', price: 49, access: 'One-time', items: ['ATS optimization', 'Clean PDF export', '5 resume templates', '5 job-specific resumes'] },
  { id: 'job-hunter' as PlanId, name: 'Job Hunter', price: 99, access: '30-day access', items: ['Everything in Resume Pro', 'AI cover letters', 'Interview practice', 'Job description analysis'] },
  { id: 'career-pack' as PlanId, name: 'Career Pack', price: 199, access: '90-day access', items: ['Everything in Job Hunter', 'Unlimited resumes', 'Unlimited cover letters', 'Unlimited interview practice'] },
];

export const PricingModal: React.FC<{ isOpen: boolean; onClose: () => void; onSelect: (id: PlanId) => void; }> = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" onMouseDown={onClose}>
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-8" onMouseDown={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-widest text-orange-600">Simple India pricing</p><h2 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">Pay only when the result is useful.</h2><p className="mt-2 text-sm text-slate-500">Try the free ATS score first. Upgrade when you want the full job-search workflow.</p></div>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {plans.map((plan, i) => (
            <div key={plan.id} className={`relative rounded-2xl border p-5 ${i === 1 ? 'border-orange-300 ring-2 ring-orange-100' : 'border-slate-200'}`}>
              {i === 1 && <span className="absolute -top-3 left-5 rounded-full bg-orange-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">Most popular</span>}
              <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
              <div className="mt-2 flex items-end gap-1"><span className="text-3xl font-black text-slate-900">₹{plan.price}</span><span className="pb-1 text-xs text-slate-500">{plan.access}</span></div>
              <ul className="my-5 space-y-2.5 text-sm text-slate-700">{plan.items.map(item => <li key={item} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />{item}</li>)}</ul>
              <button onClick={() => onSelect(plan.id)} className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800">Unlock for ₹{plan.price}</button>
            </div>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-500"><Sparkles className="h-4 w-4 text-orange-500" /> Prices are starting points; you can test different prices later.</div>
      </div>
    </div>
  );
};
