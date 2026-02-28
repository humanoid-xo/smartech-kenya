'use client';

import { useState } from 'react';

export function Newsletter() {
  const [email,     setEmail]     = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <section className="py-24 px-6 bg-[#0a0a0a]">
      <div className="max-w-lg mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.1] bg-white/[0.04] text-white/40 text-xs mb-7">
          Stay in the loop
        </div>

        <h2 className="font-display text-3xl sm:text-4xl text-white font-light tracking-tight mb-3">
          Get the best deals first
        </h2>
        <p className="text-white/35 text-sm mb-8 leading-relaxed">
          New arrivals, flash sales, and exclusive offers — delivered straight to your inbox.
        </p>

        {submitted ? (
          <div className="inline-flex items-center gap-2.5 text-kenya-green text-sm font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            You&apos;re on the list. Watch your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 min-w-0 px-4 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white placeholder-white/25 text-sm focus:outline-none focus:border-kenya-green/60 focus:bg-white/[0.08] transition-all duration-200"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-3.5 bg-kenya-green text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all duration-200 active:scale-95 disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? '...' : 'Subscribe'}
            </button>
          </form>
        )}

        <p className="mt-4 text-white/20 text-xs">No spam. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}
