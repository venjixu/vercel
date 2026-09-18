import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const AuthModal: React.FC<{ isOpen: boolean; onClose: () => void; onAuthed: () => void }> = ({ isOpen, onClose, onAuthed }) => {
  const [mode, setMode] = useState<'login'|'signup'>('login');
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false); const [error, setError] = useState(''); const [message, setMessage] = useState('');
  if (!isOpen) return null;
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setError(''); setMessage('');
    try {
      if (!supabase) throw new Error('Authentication is not configured. Add the Supabase environment variables.');
      const result = mode === 'login'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });
      if (result.error) throw result.error;
      if (mode === 'signup' && !result.data.session) setMessage('Account created. Check your email if email confirmation is enabled, then sign in.');
      else { onAuthed(); onClose(); }
    } catch (e: any) { setError(e?.message || 'Authentication failed.'); }
    finally { setBusy(false); }
  };
  return <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 p-4" onMouseDown={onClose}>
    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl" onMouseDown={e=>e.stopPropagation()}>
      <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-orange-600">FresherAI account</p><h2 className="mt-1 text-2xl font-extrabold">{mode === 'login' ? 'Sign in' : 'Create account'}</h2></div><button onClick={onClose}><X className="h-5 w-5 text-slate-400"/></button></div>
      <p className="mt-2 text-sm text-slate-500">Your premium access is tied to your account, so it works across devices.</p>
      <form onSubmit={submit} className="mt-6 space-y-3">
        <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-orange-400"/>
        <input required minLength={6} type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password (6+ characters)" className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-orange-400"/>
        {error && <div className="rounded-xl bg-rose-50 p-3 text-xs text-rose-700">{error}</div>}
        {message && <div className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-700">{message}</div>}
        <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white disabled:opacity-60">{busy && <Loader2 className="h-4 w-4 animate-spin"/>}{mode === 'login' ? 'Sign in' : 'Create account'}</button>
      </form>
      <button className="mt-4 w-full text-xs font-semibold text-orange-700" onClick={()=>{setMode(mode==='login'?'signup':'login');setError('');setMessage('')}}>{mode === 'login' ? 'New here? Create an account' : 'Already have an account? Sign in'}</button>
    </div>
  </div>;
};
