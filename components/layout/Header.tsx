'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const NAV = [
  { label: 'Fridges',          href: '/products?category=KITCHEN&subcategory=fridges'          },
  { label: 'Washing Machines', href: '/products?category=KITCHEN&subcategory=washing-machines' },
  { label: 'Water Dispensers', href: '/products?category=KITCHEN&subcategory=water-dispensers' },
  { label: 'Hobs & Hoods',     href: '/products?category=KITCHEN&subcategory=built-in'         },
  { label: 'Smart TVs',        href: '/products?category=AUDIO_TV'                             },
  { label: 'Smartphones',      href: '/products?category=SMARTPHONES'                          },
  { label: 'Laptops',          href: '/products?category=LAPTOPS'                              },
  { label: 'All Products',     href: '/products'                                               },
];

export function Header() {
  const pathname      = usePathname();
  const router        = useRouter();
  const { data: session } = useSession();
  const cartItems     = useSelector((s: RootState) => s.cart?.items ?? []);
  const cartCount     = cartItems.reduce((n: number, i: any) => n + (i.quantity ?? 1), 0);
  const wishlistCount = useSelector((s: RootState) => s.wishlist?.items?.length ?? 0);

  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [searchVal,   setSearchVal]   = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const isHome = pathname === '/';

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50);
  }, [searchOpen]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') setSearchOpen(false); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  const onDark = isHome && !scrolled;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchVal.trim();
    if (!q) return;
    setSearchOpen(false);
    setSearchVal('');
    router.push(`/products?search=${encodeURIComponent(q)}`);
  };

  return (
    <>
      {/* ── ANNOUNCEMENT BAR ─────────────────────────────────────────────── */}
      <div className="bg-ink text-cream/55 text-[11px] text-center py-2.5 px-4 font-medium flex items-center justify-center gap-3 flex-wrap">
        <span className="hidden sm:inline">Free delivery within Nairobi</span>
        <span className="text-cream/20 hidden sm:inline">·</span>
        <a href="https://wa.me/254746722417"
          className="font-semibold transition-opacity hover:opacity-80"
          style={{ color: '#D9A050' }}>
          +254 746 722 417
        </a>
        <span className="text-cream/20">·</span>
        <span className="text-cream/38">Mon–Sat 8am–7pm</span>
      </div>

      {/* ── MAIN HEADER ──────────────────────────────────────────────────── */}
      <header className={[
        'sticky top-0 z-50 transition-all duration-300',
        scrolled || !isHome
          ? 'bg-white border-b border-cream-warm shadow-[0_1px_16px_rgba(0,0,0,0.06)]'
          : 'bg-transparent',
      ].join(' ')}>

        {/* Top row: logo + actions */}
        <div className="max-w-[1320px] mx-auto px-5 flex items-center gap-4 h-[60px]">

          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center">
            <Image
              src="/logo.png"
              alt="Smartech Kenya"
              width={140}
              height={40}
              priority
              className={[
                'object-contain h-9 w-auto transition-all duration-200',
                onDark ? 'brightness-0 invert' : '',
              ].join(' ')}
            />
          </Link>

          {/* Search bar — desktop centre */}
          <div className="hidden md:flex flex-1 max-w-lg mx-auto">
            <form onSubmit={handleSearch} className="relative w-full">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint pointer-events-none"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                type="text"
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Search products, brands…"
                className={[
                  'w-full pl-10 pr-4 py-2.5 rounded-full text-sm transition-all duration-200 outline-none',
                  onDark
                    ? 'bg-white/[0.12] border border-white/[0.20] text-cream placeholder-cream/40 focus:bg-white/[0.18]'
                    : 'bg-cream-warm/70 border border-cream-warm text-ink placeholder-cream-muted focus:bg-white focus:border-ink/20',
                ].join(' ')}
              />
            </form>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-0.5 ml-auto md:ml-0">

            {/* Mobile search */}
            <button onClick={() => setSearchOpen(!searchOpen)}
              className={[
                'md:hidden p-2.5 rounded-xl transition-colors',
                onDark ? 'text-cream/65 hover:bg-cream/[0.08]' : 'text-ink-muted hover:bg-ink/[0.05]',
              ].join(' ')}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>

            {/* WhatsApp */}
            <a href="https://wa.me/254746722417?text=Hi%20Smartech%20Kenya%2C%20I%20want%20to%20order"
              target="_blank" rel="noopener noreferrer"
              className={[
                'hidden xl:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all',
                onDark ? 'text-cream/65 hover:bg-cream/[0.08]' : 'text-ink-muted hover:bg-ink/[0.05]',
              ].join(' ')}>
              Order via WhatsApp
            </a>

            {/* Wishlist */}
            <Link href="/wishlist"
              className={[
                'relative p-2.5 rounded-xl transition-colors hidden sm:flex',
                onDark ? 'text-cream/65 hover:bg-cream/[0.08]' : 'text-ink-muted hover:bg-ink/[0.05]',
              ].join(' ')}>
              <svg className="w-[19px] h-[19px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-[16px] h-[16px] bg-ink text-cream text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart"
              className={[
                'relative p-2.5 rounded-xl transition-colors',
                onDark ? 'text-cream/65 hover:bg-cream/[0.08]' : 'text-ink-muted hover:bg-ink/[0.05]',
              ].join(' ')}>
              <svg className="w-[19px] h-[19px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-[16px] h-[16px] bg-ink text-cream text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {session ? (
              <button onClick={() => signOut()}
                className={[
                  'hidden sm:flex items-center gap-1.5 pl-1.5 pr-3 py-1.5 rounded-full text-xs font-medium transition-all ml-1',
                  onDark ? 'text-cream/65 hover:bg-cream/[0.08]' : 'text-ink-muted hover:bg-ink/[0.05]',
                ].join(' ')}>
                <div className="w-6 h-6 rounded-full bg-ink-soft flex items-center justify-center text-cream text-[10px] font-bold">
                  {session.user?.name?.[0]?.toUpperCase() ?? 'U'}
                </div>
                Sign out
              </button>
            ) : (
              <Link href="/login"
                className={[
                  'hidden sm:inline-flex px-4 py-2 rounded-full text-xs font-semibold transition-all ml-1',
                  onDark
                    ? 'bg-white/[0.12] text-cream border border-white/[0.20] hover:bg-white/[0.20]'
                    : 'bg-ink text-cream hover:bg-ink-soft',
                ].join(' ')}>
                Sign in
              </Link>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
              className={[
                'lg:hidden p-2.5 rounded-xl transition-colors ml-1',
                onDark ? 'text-cream hover:bg-cream/[0.08]' : 'text-ink hover:bg-ink/[0.05]',
              ].join(' ')}>
              {mobileOpen
                ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16"/>
                  </svg>
              }
            </button>
          </div>
        </div>

        {/* ── CATEGORY NAV STRIP — desktop only ─────────────────────────── */}
        <div className={[
          'hidden lg:block border-t transition-colors',
          onDark ? 'border-white/[0.08]' : 'border-cream-warm',
        ].join(' ')}>
          <div className="max-w-[1320px] mx-auto px-5 flex items-center overflow-x-auto hide-scrollbar">
            {NAV.map(n => (
              <Link key={n.href} href={n.href}
                className={[
                  'flex-shrink-0 px-4 py-2.5 text-[11.5px] font-semibold tracking-wide whitespace-nowrap transition-all',
                  'border-b-2',
                  pathname === '/products' && n.href === '/products'
                    ? onDark ? 'border-white text-white' : 'border-ink text-ink'
                    : onDark
                      ? 'border-transparent text-cream/55 hover:text-cream hover:border-white/40'
                      : 'border-transparent text-ink/50 hover:text-ink hover:border-ink/25',
                ].join(' ')}>
                {n.label}
              </Link>
            ))}
            <div className="flex-1"/>
            <Link href="/products?isFeatured=true"
              className={[
                'flex-shrink-0 px-4 py-2.5 text-[11.5px] font-bold tracking-wide transition-all border-b-2 border-transparent',
                onDark ? 'text-amber-light hover:text-amber-light/80' : 'text-amber-luxe hover:text-amber-luxe/70',
              ].join(' ')}>
              Deals
            </Link>
          </div>
        </div>
      </header>

      {/* ── MOBILE SEARCH OVERLAY ────────────────────────────────────────── */}
      {searchOpen && (
        <div className="fixed inset-0 z-[55] flex items-start justify-center pt-[110px] px-4 md:hidden"
          onClick={() => setSearchOpen(false)}>
          <div className="absolute inset-0 bg-ink/65 backdrop-blur-md"/>
          <div className="relative w-full max-w-md" onClick={e => e.stopPropagation()}
            style={{ animation: 'scale-in 0.18s cubic-bezier(0.22,1,0.36,1) forwards' }}>
            <form onSubmit={handleSearch}
              className="flex items-center gap-3 bg-white rounded-2xl shadow-2xl px-5 py-4">
              <svg className="w-5 h-5 text-ink-faint shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input ref={searchRef} type="text" value={searchVal}
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
            <p className="text-cream/30 text-xs text-center mt-3">Press Enter to search</p>
          </div>
        </div>
      )}

      {/* ── MOBILE DRAWER ────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm"/>
          <nav className="absolute top-[calc(100px)] inset-x-0 bg-cream border-b border-cream-warm shadow-2xl overflow-y-auto max-h-[calc(100vh-100px)]"
            onClick={e => e.stopPropagation()}
            style={{ animation: 'fade-up 0.22s cubic-bezier(0.22,1,0.36,1) forwards' }}>

            {/* Mobile search */}
            <div className="px-5 py-3 border-b border-cream-warm/60">
              <form onSubmit={handleSearch} className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint pointer-events-none"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input type="text" value={searchVal} onChange={e => setSearchVal(e.target.value)}
                  placeholder="Search products…"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-cream-warm text-sm text-ink placeholder-ink-faint outline-none"/>
              </form>
            </div>

            {/* Nav links */}
            <div className="py-2">
              {NAV.map(n => (
                <Link key={n.href} href={n.href} onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-5 py-3.5 text-sm font-semibold text-ink hover:bg-cream-warm/50 transition-colors border-b border-cream-warm/30 last:border-0">
                  {n.label}
                  <svg className="w-4 h-4 text-ink-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7"/>
                  </svg>
                </Link>
              ))}
              <Link href="/products?isFeatured=true" onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-5 py-3.5 text-sm font-bold border-b border-cream-warm/30 transition-colors hover:bg-cream-warm/50"
                style={{ color: '#8B5A1A' }}>
                Deals
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>

            {/* Footer links */}
            <div className="px-5 py-3 border-t border-cream-warm flex items-center gap-4 flex-wrap">
              <Link href="/wishlist" onClick={() => setMobileOpen(false)}
                className="text-sm text-ink-muted hover:text-ink transition-colors">
                Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
              </Link>
              <Link href="/track-order" onClick={() => setMobileOpen(false)}
                className="text-sm text-ink-muted hover:text-ink transition-colors">
                Track Order
              </Link>
              <Link href="/contact" onClick={() => setMobileOpen(false)}
                className="text-sm text-ink-muted hover:text-ink transition-colors">
                Contact
              </Link>
            </div>

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
                <Link href="/login" onClick={() => setMobileOpen(false)}
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
