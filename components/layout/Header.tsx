'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { CATEGORIES } from '@/constants/categories';

export function Header() {
  const pathname  = usePathname();
  const { data: session } = useSession();
  const cartItems  = useSelector((s: RootState) => s.cart?.items ?? []);
  const cartCount  = cartItems.reduce((n: number, i: any) => n + (i.quantity ?? 1), 0);

  const [scrolled,   setScrolled]   = useState(false);
  const [mobile,     setMobile]     = useState(false);
  const [megaOpen,   setMegaOpen]   = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal,  setSearchVal]  = useState('');
  const isHome = pathname === '/';

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn, { passive: true });
    fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMobile(false); setMegaOpen(null); }, [pathname]);

  const onDark = isHome && !scrolled;

  return (
    <>
      {/* ── ANNOUNCEMENT BAR ─────────────────────── */}
      <div className="bg-ink text-cream/55 text-[11px] text-center py-2.5 px-4 font-medium flex items-center justify-center gap-3 flex-wrap relative z-[60]">
        <span className="hidden sm:inline">Free delivery within Nairobi</span>
        <span className="text-cream/20 hidden sm:inline">·</span>
        <a href="https://wa.me/254746722417"
          className="font-semibold transition-opacity hover:opacity-80"
          style={{ color: '#C4872C' }}>
          +254 746 722 417
        </a>
        <span className="text-cream/20">·</span>
        <span className="text-cream/35">Mon–Sat 8am–7pm</span>
      </div>

      {/* ── MAIN HEADER ──────────────────────────── */}
      <header className={[
        'sticky top-0 z-50 h-[60px] flex items-center transition-all duration-300',
        scrolled
          ? 'bg-cream/96 backdrop-blur-xl border-b border-cream-warm shadow-[0_1px_20px_rgba(0,0,0,0.07)]'
          : isHome
            ? 'bg-transparent'
            : 'bg-cream border-b border-cream-warm',
      ].join(' ')}>
        <div className="max-w-[1320px] mx-auto w-full px-5 flex items-center gap-5">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className={[
              'w-8 h-8 rounded-xl flex items-center justify-center transition-colors',
              onDark ? 'bg-cream/10 border border-cream/20 text-cream' : 'bg-ink text-cream',
            ].join(' ')}>
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <path d="M3 9C3 5.686 5.686 3 9 3s6 2.686 6 6-2.686 6-6 6-6-2.686-6-6z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M6.5 9h5M9 6.5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <span className={[
                'font-display text-[1.05rem] font-medium tracking-widest leading-none transition-colors',
                onDark ? 'text-cream' : 'text-ink',
              ].join(' ')}>SMARTECH</span>
              <span className={[
                'block text-[7.5px] font-bold tracking-[0.2em] uppercase -mt-0.5 transition-colors',
                onDark ? 'text-cream/30' : 'text-ink/25',
              ].join(' ')}>KENYA</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1">
            {CATEGORIES.map(cat => (
              <div key={cat.slug} className="relative"
                onMouseEnter={() => setMegaOpen(cat.slug)}
                onMouseLeave={() => setMegaOpen(null)}>
                <Link href={`/products?category=${cat.enum}`}
                  className={[
                    'flex items-center gap-1 px-3.5 py-2 rounded-xl text-sm font-medium transition-all',
                    onDark
                      ? 'text-cream/60 hover:text-cream hover:bg-cream/[0.08]'
                      : 'text-ink-muted hover:text-ink hover:bg-ink/[0.05]',
                  ].join(' ')}>
                  {cat.name}
                  <svg className={`w-3 h-3 transition-transform duration-200 ${megaOpen === cat.slug ? 'rotate-180' : ''}`}
                    viewBox="0 0 12 12" fill="none">
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>

                {megaOpen === cat.slug && (
                  <div className="absolute left-0 top-full pt-2 z-50 w-[320px]">
                    <div className="bg-ink rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.4)] overflow-hidden"
                      style={{ animation: 'scale-in 0.16s cubic-bezier(0.22,1,0.36,1) forwards' }}>
                      <div className="px-5 pt-4 pb-2.5 border-b border-white/[0.07]">
                        <p className="text-[10px] font-semibold tracking-widest uppercase text-cream/30">
                          {cat.description}
                        </p>
                      </div>
                      <div className="p-2 grid grid-cols-2 gap-0.5">
                        {cat.subcategories.map(sub => (
                          <Link key={sub.slug}
                            href={`/products?category=${cat.enum}&subcategory=${sub.slug}`}
                            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-white/[0.07] transition-colors group/sub">
                            {/* Dot instead of emoji */}
                            <span className="w-1.5 h-1.5 rounded-full shrink-0 opacity-40 group-hover/sub:opacity-80 transition-opacity"
                              style={{ background: '#C4872C' }}/>
                            <span className="text-cream text-xs font-medium leading-tight group-hover/sub:text-white transition-colors truncate">
                              {sub.name}
                            </span>
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
                'px-3.5 py-2 rounded-xl text-sm font-semibold transition-all',
                onDark ? 'text-amber-light hover:bg-cream/[0.07]' : 'text-amber-luxe hover:bg-amber-pale',
              ].join(' ')}>
              Deals
            </Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1 ml-auto">

            {/* WhatsApp — desktop */}
            <a href="https://wa.me/254746722417?text=Hi%20Smartech%20Kenya%2C%20I%20want%20to%20order"
              target="_blank" rel="noopener noreferrer"
              className={[
                'hidden xl:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all',
                onDark ? 'text-cream/55 hover:text-cream hover:bg-cream/[0.08]' : 'text-ink-muted hover:text-ink hover:bg-ink/[0.05]',
              ].join(' ')}>
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.557 4.126 1.526 5.855L.055 23.266l5.533-1.448A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.928 0-3.736-.518-5.29-1.42l-.378-.224-3.93 1.028 1.046-3.818-.246-.393A9.965 9.965 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              Order via WhatsApp
            </a>

            {/* Search */}
            <button onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
              className={[
                'p-2.5 rounded-xl transition-colors',
                onDark ? 'text-cream/55 hover:text-cream hover:bg-cream/[0.08]' : 'text-ink-muted hover:text-ink hover:bg-ink/[0.05]',
              ].join(' ')}>
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>

            {/* Cart */}
            <Link href="/cart"
              className={[
                'relative p-2.5 rounded-xl transition-colors',
                onDark ? 'text-cream/55 hover:text-cream hover:bg-cream/[0.08]' : 'text-ink-muted hover:text-ink hover:bg-ink/[0.05]',
              ].join(' ')}>
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-[17px] h-[17px] bg-ink-soft text-cream text-[9px] font-bold rounded-full flex items-center justify-center border border-cream/20">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {session ? (
              <button onClick={() => signOut()}
                className={[
                  'hidden sm:flex items-center gap-2 pl-1.5 pr-3.5 py-1.5 rounded-full text-xs transition-all ml-1',
                  onDark ? 'hover:bg-cream/[0.08] text-cream/55' : 'hover:bg-ink/[0.05] text-ink-muted',
                ].join(' ')}>
                <div className="w-6 h-6 rounded-full bg-ink-soft flex items-center justify-center text-cream text-[10px] font-bold">
                  {session.user?.name?.[0]?.toUpperCase() ?? 'U'}
                </div>
                Sign out
              </button>
            ) : (
              <Link href="/login"
                className={[
                  'hidden sm:inline-flex px-4 py-1.5 rounded-full text-xs font-semibold transition-all ml-1',
                  onDark ? 'bg-cream/10 text-cream border border-cream/20 hover:bg-cream/20' : 'bg-ink text-cream hover:bg-ink-soft',
                ].join(' ')}>
                Sign in
              </Link>
            )}

            {/* Mobile toggle */}
            <button onClick={() => setMobile(!mobile)} aria-label="Menu"
              className={[
                'lg:hidden p-2.5 rounded-xl transition-colors ml-1',
                onDark ? 'text-cream hover:bg-cream/[0.08]' : 'text-ink hover:bg-ink/[0.05]',
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

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[55] flex items-start justify-center pt-[110px] px-4"
          onClick={() => setSearchOpen(false)}>
          <div className="absolute inset-0 bg-ink/65 backdrop-blur-md"/>
          <div className="relative w-full max-w-xl" onClick={e => e.stopPropagation()}
            style={{ animation: 'scale-in 0.18s cubic-bezier(0.22,1,0.36,1) forwards' }}>
            <form
              onSubmit={e => {
                e.preventDefault();
                if (searchVal.trim()) {
                  window.location.href = `/products?search=${encodeURIComponent(searchVal.trim())}`;
                }
              }}
              className="flex items-center gap-3 bg-white rounded-2xl shadow-2xl px-5 py-4">
              <svg className="w-5 h-5 text-ink-faint shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input autoFocus type="text" value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Search products, brands…"
                className="flex-1 text-ink text-base outline-none placeholder-cream-muted bg-transparent"/>
              {searchVal && (
                <button type="button" onClick={() => setSearchVal('')} className="text-ink-faint hover:text-ink">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              )}
            </form>
            <p className="text-cream/25 text-xs text-center mt-3">Press Enter to search</p>
          </div>
        </div>
      )}

      {/* Mobile drawer */}
      {mobile && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMobile(false)}>
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm"/>
          <nav className="absolute top-[100px] inset-x-0 bg-cream border-b border-cream-warm shadow-2xl overflow-y-auto max-h-[calc(100vh-100px)]"
            onClick={e => e.stopPropagation()}
            style={{ animation: 'fade-up 0.22s cubic-bezier(0.22,1,0.36,1) forwards' }}>

            {CATEGORIES.map(cat => (
              <div key={cat.slug}>
                <Link href={`/products?category=${cat.enum}`} onClick={() => setMobile(false)}
                  className="flex items-center justify-between px-5 py-4 text-sm font-semibold text-ink border-b border-cream-warm/60 hover:bg-cream-warm/40 transition-colors">
                  {cat.name}
                  <svg className="w-4 h-4 text-ink-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7"/>
                  </svg>
                </Link>
                <div className="px-5 py-2 bg-cream-warm/25 grid grid-cols-2 gap-x-4">
                  {cat.subcategories.map(sub => (
                    <Link key={sub.slug}
                      href={`/products?category=${cat.enum}&subcategory=${sub.slug}`}
                      onClick={() => setMobile(false)}
                      className="flex items-center gap-2.5 py-2.5 text-xs text-ink-muted hover:text-ink transition-colors">
                      <span className="w-1 h-1 rounded-full bg-ink-faint/50 shrink-0"/>
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <div className="p-5 space-y-2.5 border-t border-cream-warm">
              <a href="https://wa.me/254746722417?text=Hi%20Smartech%20Kenya%2C%20I%20want%20to%20order"
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-ink text-cream rounded-xl text-sm font-semibold">
                Order via WhatsApp
              </a>
              {session ? (
                <button onClick={() => signOut()}
                  className="w-full py-3 text-sm font-medium text-ink-muted border border-cream-warm rounded-xl hover:bg-cream-warm transition-colors">
                  Sign out
                </button>
              ) : (
                <Link href="/login" onClick={() => setMobile(false)}
                  className="block w-full py-3 border border-ink text-ink text-sm font-semibold rounded-xl text-center hover:bg-ink hover:text-cream transition-all">
                  Sign in
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
