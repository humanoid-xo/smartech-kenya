'use client';

import { useState }  from 'react';
import { useForm }    from 'react-hook-form';
import { signIn }     from 'next-auth/react';
import { useRouter }  from 'next/navigation';
import Link           from 'next/link';

type Form = { email: string; password: string };

export default function LoginPage() {
  const router = useRouter();
  const [err,  setErr]  = useState('');
  const [busy, setBusy] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<Form>();

  const onSubmit = async (data: Form) => {
    setBusy(true); setErr('');
    const res = await signIn('credentials', { ...data, redirect: false });
    setBusy(false);
    if (res?.error) setErr('Invalid email or password.');
    else { router.push('/'); router.refresh(); }
  };

  return (
    <div className="min-h-screen bg-cream-warm flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-[400px]">

        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-ink flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 9C3 5.686 5.686 3 9 3s6 2.686 6 6-2.686 6-6 6-6-2.686-6-6z" stroke="#F5F0E8" strokeWidth="1.5"/>
              <path d="M6.5 9h5M9 6.5v5" stroke="#F5F0E8" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div className="font-display text-xl text-ink font-medium tracking-wide">SMARTECH</div>
            <div className="overline text-ink-faint -mt-0.5">KENYA</div>
          </div>
        </Link>

        <div className="bg-white rounded-3xl border border-cream-warm shadow-sm p-8">
          <h1 className="font-display text-ink text-3xl font-light mb-1">Welcome back</h1>
          <p className="text-ink-faint text-sm mb-7">Sign in to your account</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {err && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">{err}</div>
            )}

            <div>
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-2">Email</label>
              <input type="email" placeholder="you@example.com"
                {...register('email', { required: 'Required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
                className="w-full px-4 py-3.5 rounded-xl border border-cream-warm bg-cream text-sm text-ink placeholder-cream-muted focus:outline-none focus:border-amber-luxe focus:ring-2 focus:ring-amber-luxe/10 transition-all"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-semibold text-ink-muted uppercase tracking-wide">Password</label>
                <Link href="/forgot-password" className="text-xs text-amber-luxe hover:underline">Forgot?</Link>
              </div>
              <input type="password" placeholder="••••••••"
                {...register('password', { required: 'Required' })}
                className="w-full px-4 py-3.5 rounded-xl border border-cream-warm bg-cream text-sm text-ink placeholder-cream-muted focus:outline-none focus:border-amber-luxe focus:ring-2 focus:ring-amber-luxe/10 transition-all"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={busy}
              className="w-full py-3.5 bg-ink text-cream text-sm font-semibold rounded-xl hover:bg-ink-soft transition-all disabled:opacity-50 active:scale-[0.98] mt-2">
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-ink-faint mt-6">
          No account?{' '}
          <Link href="/register" className="text-ink font-semibold hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}
