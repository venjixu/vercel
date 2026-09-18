import React, { useState } from 'react';
import {
  X,
  MessageSquareCode,
  Send,
  Sparkles,
  Bot,
  User,
  IndianRupee,
} from 'lucide-react';
import { CareerPlan } from '../types';

interface AskCoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePlan: CareerPlan | null;
  languagePreference: 'english' | 'hinglish';
}

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

export const AskCoachModal: React.FC<AskCoachModalProps> = ({
  isOpen,
  onClose,
  activePlan,
  languagePreference,
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: activePlan
        ? `Namaste! I'm your FresherAI Career Coach. Ask me anything about preparing for ${activePlan.roleTitle}, tackling the Indian job market, handling notice periods, or negotiating your CTC offer!`
        : `Namaste! I'm your FresherAI Career Coach. Ask me anything about Indian tech hiring, switching from service to product, resume gaps, or salary benchmarks.`,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const quickIndianQuestions = [
    'How do I handle a 90-day notice period with startups?',
    'How do I explain a 1-year UPSC/GATE career gap?',
    'How to negotiate 30%+ hike on my current CTC?',
    'Java Spring Boot vs Node.js for Bengaluru GCCs in 2026?',
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', text: textToSend.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/coach/ask-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend.trim(),
          context: {
            targetJob: activePlan?.roleTitle || 'Tech & Product roles',
            targetCity: activePlan?.topHiringHubs?.[0] || 'India',
            languagePreference,
          },
          conversationHistory: messages,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: data.answer || 'Keep building proof-of-work and reaching out on LinkedIn!',
        },
      ]);
    } catch (err) {
      console.error('Error asking coach:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Notice period strategy in India: 1) Talk to your manager about project release early; 2) Look for companies willing to buy out your notice; 3) Highlight immediate joiner availability if already serving notice.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 sm:p-6">
      <div className="flex flex-col h-[640px] max-h-[90vh] w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-600 text-white shadow-xs">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base font-bold text-slate-900">
                  Ask FresherAI Coach
                </h3>
                <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-800">
                  Online
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Specialized in Indian Tech Hiring, Notice Periods & Salary Hacks
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Questions row */}
        <div className="border-b border-slate-100 bg-white px-4 py-2 flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-[11px] font-bold text-slate-400 shrink-0">Popular:</span>
          {quickIndianQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-950 transition"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Message feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/40">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-600 text-white text-xs font-bold">
                  AI
                </div>
              )}
              <div
                className={`rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed max-w-[85%] ${
                  msg.role === 'user'
                    ? 'bg-orange-600 text-white font-medium'
                    : 'bg-white text-slate-800 border border-slate-200 shadow-2xs whitespace-pre-wrap'
                }`}
              >
                {msg.text}
              </div>
              {msg.role === 'user' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-white text-xs font-bold">
                  You
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-600 text-white text-xs font-bold animate-pulse">
                AI
              </div>
              <div className="rounded-2xl bg-white px-4 py-3 text-xs text-slate-500 border border-slate-200 flex items-center gap-2 shadow-2xs">
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-orange-600 border-t-transparent" />
                <span>Coach is formulating tactical advice...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input box */}
        <div className="border-t border-slate-200 bg-white p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything about notice period, Naukri hacks, salary negotiation, resume gaps..."
              className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50 transition shadow-xs"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
