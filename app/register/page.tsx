'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', address: '', isSeller: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Registration failed'); return; }
      toast.success('Account created! Please sign in.');
      router.push('/login');
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="bg-neutral-50 min-h-screen py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-primary-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">SK</span>
              </div>
              <h1 className="text-2xl font-display font-bold text-neutral-900">Create Account</h1>
              <p className="text-neutral-500 mt-1">Join Smartech Kenya today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Full Name *</label>
                <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="John Doe"
                  className="w-full border border-neutral-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Email Address *</label>
                <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="you@example.com"
                  className="w-full border border-neutral-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Password *</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} name="password" required value={form.password} onChange={handleChange} placeholder="Min. 6 characters"
                    className="w-full border border-neutral-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Phone Number</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="0712345678"
                  className="w-full border border-neutral-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Address</label>
                <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="Nairobi, Kenya"
                  className="w-full border border-neutral-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>

              <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <input type="checkbox" name="isSeller" id="isSeller" checked={form.isSeller} onChange={handleChange}
                  className="w-5 h-5 text-primary-500 rounded border-neutral-300 focus:ring-primary-500" />
                <div>
                  <label htmlFor="isSeller" className="font-semibold text-neutral-700 cursor-pointer">Register as a Seller</label>
                  <p className="text-xs text-neutral-500">List your products on Smartech Kenya marketplace</p>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full btn-primary py-3 text-lg font-semibold rounded-xl disabled:opacity-60">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating account...
                  </span>
                ) : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-neutral-500">
                Already have an account?{' '}
                <Link href="/login" className="text-primary-500 hover:text-primary-600 font-semibold">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
