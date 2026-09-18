import React, { useState } from 'react';
import { CheckCircle2, CreditCard, Loader2, X } from 'lucide-react';
import { PlanId } from './PricingModal';

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const details: Record<PlanId, { name: string; price: number; duration: string }> = {
  'resume-pro': { name: 'Resume Pro', price: 49, duration: 'one-time' },
  'job-hunter': { name: 'Job Hunter', price: 99, duration: '30 days' },
  'career-pack': { name: 'Career Pack', price: 199, duration: '90 days' },
};

function loadRazorpayScript() {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export const PaymentModal: React.FC<{
  plan: PlanId | null;
  onClose: () => void;
  onPaid: (plan: PlanId) => void;
}> = ({ plan, onClose, onPaid }) => {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (!plan) return null;
  const p = details[plan];

  const pay = async () => {
    setProcessing(true);
    setError(null);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) throw new Error('Razorpay Checkout could not be loaded. Check your internet connection.');

      const orderResponse = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create-order', planId: plan }),
      });
      const orderData = await orderResponse.json();
      if (!orderResponse.ok) throw new Error(orderData.error || 'Could not create payment order.');

      await new Promise<void>((resolve, reject) => {
        const razorpay = new window.Razorpay({
          key: orderData.keyId,
          amount: orderData.order.amount,
          currency: orderData.order.currency,
          name: 'FresherAI',
          description: `${p.name} — ${p.duration}`,
          order_id: orderData.order.id,
          theme: { color: '#ea580c' },
          handler: async (response: Record<string, string>) => {
            try {
              const verifyResponse = await fetch('/api/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'verify', planId: plan, ...response }),
              });
              const verifyData = await verifyResponse.json();
              if (!verifyResponse.ok || !verifyData.verified) throw new Error(verifyData.error || 'Payment verification failed.');

              localStorage.setItem('fresherai_entitlement', verifyData.token);
              onPaid(plan);
              resolve();
            } catch (e: any) {
              setError(e?.message || 'Payment verification failed.');
              reject(e);
            }
          },
          modal: {
            ondismiss: () => reject(new Error('Payment window closed.')),
          },
        });
        razorpay.open();
      });
    } catch (e: any) {
      if (e?.message !== 'Payment window closed.') setError(e?.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 p-4" onMouseDown={onClose}>
    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl" onMouseDown={e => e.stopPropagation()}>
      <div className="flex justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-orange-600">Secure checkout</p><h2 className="mt-1 text-2xl font-extrabold">{p.name}</h2></div><button onClick={onClose} disabled={processing}><X className="h-5 w-5 text-slate-400" /></button></div>
      <div className="my-6 rounded-2xl bg-slate-50 p-5"><div className="flex items-center justify-between"><span className="font-semibold">Total</span><span className="text-2xl font-black">₹{p.price}</span></div><p className="mt-1 text-xs text-slate-500">Access: {p.duration}</p></div>
      <div className="space-y-3 text-xs text-slate-600"><p className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" />Premium access is unlocked only after server-side payment verification.</p><p className="flex gap-2"><CreditCard className="h-4 w-4 text-slate-500" />Payments are processed through Razorpay Checkout.</p></div>
      {error && <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">{error}</div>}
      <button disabled={processing} onClick={pay} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3.5 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-60">{processing ? <><Loader2 className="h-4 w-4 animate-spin" />Processing…</> : `Pay securely · ₹${p.price}`}</button>
      <p className="mt-3 text-center text-[10px] text-slate-400">Use Razorpay Test Mode until your merchant account is ready for live payments.</p>
    </div>
  </div>;
};
