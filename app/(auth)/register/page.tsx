'use client';
import { useState } from 'react';
import { useForm }  from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link  from 'next/link';

type Form = { name: string; email: string; password: string; confirm: string };

export default function RegisterPage() {
  const router = useRouter();
  const [err, setErr]   = useState('');
  const [busy, setBusy] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<Form>();

  const onSubmit = async (data: Form) => {
    setBusy(true); setErr('');
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
      });
      const json = await res.json();
      if (!res.ok) { setErr(json.error ?? 'Registration failed'); setBusy(false); return; }
      router.push('/login?registered=1');
    } catch { setErr('Something went wrong. Please try again.'); setBusy(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-[420px]">

        <Link href="/" className="flex justify-center mb-10">
          <Image src="/logo.png" alt="Smartech Kenya" width={160} height={44} className="object-contain"/>
        </Link>

        <div className="bg-white border border-gray-200 p-8 shadow-sm">
          <p className="eyebrow mb-2">Get started</p>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Create account</h1>
          <p className="text-gray-500 text-sm mb-8">Join Smartech Kenya today</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {err && <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3">{err}</div>}

            {[
              { id: 'name',    label: 'Full Name',       type: 'text',     placeholder: 'Jane Mwangi',
                rules: { required: 'Required', minLength: { value: 2, message: 'Too short' } } },
              { id: 'email',   label: 'Email Address',   type: 'email',    placeholder: 'you@example.com',
                rules: { required: 'Required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } } },
              { id: 'password',label: 'Password',        type: 'password', placeholder: '8+ characters',
                rules: { required: 'Required', minLength: { value: 8, message: 'At least 8 characters' } } },
              { id: 'confirm', label: 'Confirm Password',type: 'password', placeholder: 'Repeat password',
                rules: { required: 'Required', validate: (v: string) => v === watch('password') || 'Passwords do not match' } },
            ].map(f => (
              <div key={f.id}>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                  {f.label}
                </label>
                <input type={f.type} placeholder={f.placeholder}
                  {...register(f.id as keyof Form, f.rules)} className="input"/>
                {errors[f.id as keyof Form] && (
                  <p className="text-red-500 text-xs mt-1.5">{errors[f.id as keyof Form]?.message}</p>
                )}
              </div>
            ))}

            <button type="submit" disabled={busy} className="btn-primary w-full py-3.5 mt-2">
              {busy ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-700 font-semibold hover:text-blue-900 transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
