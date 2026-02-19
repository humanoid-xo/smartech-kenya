'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login?redirect=/profile');
  }, [status]);

  if (status === 'loading') {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-neutral-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
        </main>
        <Footer />
      </>
    );
  }

  if (!session) return null;

  const user = session.user as any;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50">
        <div className="container-custom py-8 max-w-2xl">
          <h1 className="text-3xl font-display font-bold text-neutral-900 mb-8">My Profile</h1>

          <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
            {/* Avatar */}
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-neutral-100">
              <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-3xl">{user.name?.[0]?.toUpperCase() || 'U'}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">{user.name}</h2>
                <p className="text-neutral-500">{user.email}</p>
                {user.isSeller && (
                  <span className="inline-block mt-2 text-xs font-semibold bg-primary-100 text-primary-600 px-3 py-1 rounded-full">Verified Seller</span>
                )}
              </div>
            </div>

            {/* Account Info */}
            <div className="space-y-4">
              <h3 className="font-bold text-neutral-700">Account Information</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-50 rounded-xl">
                  <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1">Name</p>
                  <p className="font-semibold text-neutral-800">{user.name || '—'}</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-xl">
                  <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1">Email</p>
                  <p className="font-semibold text-neutral-800">{user.email || '—'}</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-xl">
                  <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1">Account Type</p>
                  <p className="font-semibold text-neutral-800">{user.isSeller ? 'Seller Account' : 'Buyer Account'}</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-xl">
                  <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1">User ID</p>
                  <p className="font-mono text-xs text-neutral-600 truncate">{user.id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
            <h3 className="font-bold text-neutral-700 mb-4">Quick Links</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <Link href="/orders" className="flex items-center gap-3 p-4 rounded-xl border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-colors">
                <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="font-semibold text-neutral-700">My Orders</span>
              </Link>
              <Link href="/wishlist" className="flex items-center gap-3 p-4 rounded-xl border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-colors">
                <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="font-semibold text-neutral-700">Wishlist</span>
              </Link>
              <Link href="/cart" className="flex items-center gap-3 p-4 rounded-xl border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-colors">
                <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="font-semibold text-neutral-700">Cart</span>
              </Link>
              {user.isSeller && (
                <Link href="/seller/dashboard" className="flex items-center gap-3 p-4 rounded-xl border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-colors">
                  <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="font-semibold text-neutral-700">Seller Dashboard</span>
                </Link>
              )}
            </div>
          </div>

          {/* Sign Out */}
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full py-3 border-2 border-red-200 text-red-500 rounded-xl font-semibold hover:bg-red-50 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
