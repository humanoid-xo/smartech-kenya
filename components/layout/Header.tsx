'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export function Header() {
  const { data: session } = useSession();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Smartphones', href: '/products?category=SMARTPHONES' },
    { label: 'Laptops',     href: '/products?category=LAPTOPS'     },
    { label: 'Appliances',  href: '/products?category=HOME_APPLIANCES' },
    { label: 'All Products',href: '/products'                      },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-xl border-b border-gray-100/80 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-colors ${scrolled ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
              S
            </div>
            <span className={`font-display text-lg hidden sm:block transition-colors ${scrolled ? 'text-gray-900' : 'text-white'}`}>
              Smartech
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className={`text-sm transition-colors ${scrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/70 hover:text-white'}`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Cart */}
            <Link
              href="/cart"
              className={`relative p-2.5 rounded-full transition-colors ${scrolled ? 'hover:bg-gray-100 text-gray-700' : 'hover:bg-white/10 text-white'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-kenya-green text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            {session ? (
              <button
                onClick={() => signOut()}
                className={`hidden sm:flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full text-sm transition-colors ${scrolled ? 'hover:bg-gray-100 text-gray-700' : 'hover:bg-white/10 text-white/80'}`}
              >
                <div className="w-6 h-6 rounded-full bg-kenya-green flex items-center justify-center text-white text-xs font-bold">
                  {session.user?.name?.[0]?.toUpperCase() ?? 'U'}
                </div>
                <span className="text-sm">Sign out</span>
              </button>
            ) : (
              <Link
                href="/login"
                className={`hidden sm:inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  scrolled
                    ? 'bg-gray-900 text-white hover:bg-gray-700'
                    : 'bg-white text-gray-900 hover:bg-gray-100'
                }`}
              >
                Sign in
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-2.5 rounded-full transition-colors ${scrolled ? 'hover:bg-gray-100 text-gray-700' : 'hover:bg-white/10 text-white'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <nav
            className="absolute top-16 left-0 right-0 bg-white border-b border-gray-100 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-1">
              {navLinks.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm font-medium"
                >
                  {label}
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-100">
                {session ? (
                  <button
                    onClick={() => { signOut(); setMobileOpen(false); }}
                    className="w-full px-4 py-3 rounded-xl text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Sign out
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full px-4 py-3 bg-gray-900 text-white text-sm font-medium rounded-xl text-center"
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
