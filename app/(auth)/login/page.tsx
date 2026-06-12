'use client';
import { useState } from 'react';
import { useForm }  from 'react-hook-form';
import { signIn }   from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link  from 'next/link';

type Form = { email: string; password: string };

export default function LoginPage() {
  const router = useRouter();
  const [err, setErr]   = useState('');
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-[400px]">

        <Link href="/" className="flex justify-center mb-10">
          <Image src="/logo.png" alt="Smartech Kenya" width={160} height={44} className="object-contain"/>
        </Link>

        <div className="bg-white border border-gray-200 p-8 shadow-sm">
          <p className="eyebrow mb-2">Welcome back</p>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Sign in</h1>
          <p className="text-gray-500 text-sm mb-8">Enter your credentials to continue</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {err && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3">{err}</div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                Email address
              </label>
              <input type="email" placeholder="you@example.com"
                {...register('email', { required: 'Required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
                className="input"/>
              {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Password</label>
                <Link href="/forgot-password" className="text-xs text-blue-700 hover:text-blue-900 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <input type="password" placeholder="••••••••"
                {...register('password', { required: 'Required' })}
                className="input"/>
              {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={busy} className="btn-primary w-full py-3.5 mt-2">
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          No account?{' '}
          <Link href="/register" className="text-blue-700 font-semibold hover:text-blue-900 transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
