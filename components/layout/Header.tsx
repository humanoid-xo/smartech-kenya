'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { CATEGORIES } from '@/constants/categories';

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const cartItems  = useSelector((s: RootState) => s.cart?.items ?? []);
  const cartCount  = cartItems.reduce((n: number, i: any) => n + (i.quantity ?? 1), 0);

  const [scrolled,   setScrolled]   = useState(false);
  const [mobile,     setMobile]     = useState(false);
  const [megaOpen,   setMegaOpen]   = useState<string | null>(null);
  const isHome = pathname === '/';

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMobile(false); }, [pathname]);

  /* hero is dark so header text starts white; else dark */
  const onDark = isHome && !scrolled;

  return (
    <>
      <header
        className={[
          'fixed inset-x-0 top-0 z-50 h-[68px] flex items-center transition-all duration-300',
          scrolled
            ? 'bg-cream/95 backdrop-blur-xl border-b border-cream-warm shadow-[0_1px_24px_rgba(0,0,0,0.06)]'
            : isHome
              ? 'bg-transparent'
              : 'bg-cream border-b border-cream-warm',
        ].join(' ')}
      >
        <div className="max-w-[1320px] mx-auto w-full px-6 flex items-center gap-8">

          {/* ── Logo ────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-3 shrink-0 mr-2">
            <div className={[
              'w-9 h-9 rounded-xl flex items-center justify-center transition-colors',
              onDark ? 'bg-cream text-ink' : 'bg-ink text-cream',
            ].join(' ')}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 9C3 5.686 5.686 3 9 3s6 2.686 6 6-2.686 6-6 6-6-2.686-6-6z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M6.5 9h5M9 6.5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <span className={[
                'font-display text-xl font-medium tracking-wide transition-colors',
                onDark ? 'text-cream' : 'text-ink',
              ].join(' ')}>
                SMARTECH
              </span>
              <span className={[
                'block overline -mt-0.5 transition-colors',
                onDark ? 'text-cream/50' : 'text-ink-faint',
              ].join(' ')}>
                KENYA
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav ─────────────────────────── */}
          <nav className="hidden lg:flex items-center gap-1 flex-1">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.slug}
                className="relative"
                onMouseEnter={() => setMegaOpen(cat.slug)}
                onMouseLeave={() => setMegaOpen(null)}
              >
                <Link
                  href={`/products?category=${cat.enum}`}
                  className={[
                    'flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                    onDark
                      ? 'text-cream/70 hover:text-cream hover:bg-cream/8'
                      : 'text-ink-muted hover:text-ink hover:bg-ink/5',
                  ].join(' ')}
                >
                  {cat.name}
                  <svg className={`w-3 h-3 transition-transform duration-200 ${megaOpen === cat.slug ? 'rotate-180' : ''}`} viewBox="0 0 12 12" fill="none">
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>

                {/* Mega dropdown */}
                {megaOpen === cat.slug && (
                  <div className="absolute left-0 top-full pt-3 z-50 w-80">
                    <div className="bg-ink rounded-2xl shadow-2xl overflow-hidden animate-scale-in origin-top-left">
                      <div className="px-5 pt-4 pb-2 border-b border-white/8">
                        <p className="overline text-cream/40">{cat.description}</p>
                      </div>
                      <div className="p-2">
                        {cat.subcategories.map((sub) => (
                          <Link
                            key={sub.slug}
                            href={`/products?category=${cat.enum}&subcategory=${sub.slug}`}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-forest-800 transition-colors group/sub"
                          >
                            <span className="w-8 h-8 rounded-lg bg-forest-900 flex items-center justify-center text-base shrink-0">{sub.emoji}</span>
                            <div>
                              <p className="text-cream text-sm font-medium leading-tight group-hover/sub:text-forest-300 transition-colors">{sub.name}</p>
                              <p className="text-cream/35 text-xs mt-0.5">{sub.description}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <Link href="/products?isFeatured=true"
              className={[
                'px-4 py-2.5 rounded-xl text-sm font-semibold transition-all',
                onDark ? 'text-amber-light hover:bg-cream/8' : 'text-amber-luxe hover:bg-amber-pale',
              ].join(' ')}>
              Deals
            </Link>
          </nav>

          {/* ── Right Actions ───────────────────────── */}
          <div className="flex items-center gap-1 ml-auto">

            {/* Cart */}
            <Link href="/cart"
              className={[
                'relative p-2.5 rounded-xl transition-colors',
                onDark ? 'text-cream/70 hover:text-cream hover:bg-cream/8' : 'text-ink-muted hover:text-ink hover:bg-ink/5',
              ].join(' ')}>
              <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-forest-600 text-cream text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {session ? (
              <button
                onClick={() => signOut()}
                className={[
                  'hidden sm:flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full text-sm transition-all',
                  onDark ? 'hover:bg-cream/8 text-cream/70' : 'hover:bg-ink/5 text-ink-muted',
                ].join(' ')}>
                <div className="w-7 h-7 rounded-full bg-forest-600 flex items-center justify-center text-cream text-xs font-semibold">
                  {session.user?.name?.[0]?.toUpperCase() ?? 'U'}
                </div>
                Sign out
              </button>
            ) : (
              <Link href="/login"
                className={[
                  'hidden sm:inline-flex px-5 py-2.5 rounded-full text-sm font-medium transition-all',
                  onDark
                    ? 'bg-cream text-ink hover:bg-cream-warm'
                    : 'bg-ink text-cream hover:bg-ink-soft',
                ].join(' ')}>
                Sign in
              </Link>
            )}

            {/* Mobile toggle */}
            <button
              onClick={() => setMobile(!mobile)}
              className={[
                'lg:hidden p-2.5 rounded-xl transition-colors',
                onDark ? 'text-cream hover:bg-cream/8' : 'text-ink hover:bg-ink/5',
              ].join(' ')}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobile
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12"/>
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16"/>
                }
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobile && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMobile(false)}>
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm"/>
          <nav className="absolute top-[68px] inset-x-0 bg-cream border-b border-cream-warm shadow-2xl overflow-y-auto max-h-[80vh]" onClick={e => e.stopPropagation()}>
            {CATEGORIES.map(cat => (
              <div key={cat.slug}>
                <Link href={`/products?category=${cat.enum}`} onClick={() => setMobile(false)}
                  className="flex items-center justify-between px-6 py-4 text-sm font-semibold text-ink border-b border-cream-warm hover:bg-cream-warm transition-colors">
                  {cat.name}
                </Link>
                <div className="bg-cream-warm/50 px-6 py-2">
                  {cat.subcategories.slice(0, 4).map(sub => (
                    <Link key={sub.slug} href={`/products?category=${cat.enum}&subcategory=${sub.slug}`}
                      onClick={() => setMobile(false)}
                      className="flex items-center gap-3 py-2.5 text-sm text-ink-muted hover:text-ink transition-colors">
                      <span>{sub.emoji}</span> {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <div className="p-4 border-t border-cream-warm">
              {session
                ? <button onClick={() => signOut()} className="w-full py-3 text-sm font-medium text-ink-muted hover:text-ink text-center">Sign out</button>
                : <Link href="/login" onClick={() => setMobile(false)} className="block w-full py-3 bg-ink text-cream text-sm font-medium rounded-xl text-center">Sign in</Link>
              }
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
