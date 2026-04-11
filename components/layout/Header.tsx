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

function CustomerCareButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(v => !v)} aria-label="Customer Care"
        className="fixed bottom-6 left-6 z-[60] w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-105 active:scale-95"
        style={{ background: '#F97316', boxShadow: '0 4px 24px rgba(249,115,22,0.45)' }}>
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-[59]" onClick={() => setOpen(false)}/>
          <div className="fixed bottom-24 left-6 z-[60] w-72 bg-white rounded-2xl shadow-2xl overflow-hidden"
            style={{ animation: 'scale-in 0.18s cubic-bezier(0.22,1,0.36,1) forwards' }}>
            <div className="px-5 py-4 flex items-center justify-between" style={{ background: '#F97316' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Customer Care</p>
                  <p className="text-white/75 text-[11px]">Smartech Kenya</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="px-5 py-5 text-center">
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                Want to make an enquiry? Reach out and our team will guide you to the ideal choice.
              </p>
              <a href="tel:+254746722417"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-bold text-sm hover:opacity-90 transition-opacity"
                style={{ background: '#F97316' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                +254 746 722 417
              </a>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export function Header() {
  const pathname = usePathname();
  const router   = useRouter();
  const { data: session } = useSession();
  const cartItems     = useSelector((s: RootState) => s.cart?.items ?? []);
  const cartCount     = cartItems.reduce((n: number, i: any) => n + (i.quantity ?? 1), 0);
  const wishlistCount = useSelector((s: RootState) => s.wishlist?.items?.length ?? 0);

  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal,  setSearchVal]  = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const isHome  = pathname === '/';
  const isAdmin = !!(session?.user as any)?.isAdmin;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn, { passive: true }); fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);
  useEffect(() => { setMobileOpen(false); }, [pathname]);
  useEffect(() => { if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50); }, [searchOpen]);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') { setSearchOpen(false); setMobileOpen(false); } };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  const onDark = isHome && !scrolled;
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchVal.trim(); if (!q) return;
    setSearchOpen(false); setSearchVal('');
    router.push(`/products?search=${encodeURIComponent(q)}`);
  };

  return (
    <>
      {/* ── TOP INFO BAR ─────────────────────────────────────────────────── */}
      <div className="bg-gray-50 border-b border-gray-200 text-[11px] text-gray-500 py-1.5 px-4">
        <div className="max-w-[1320px] mx-auto flex items-center justify-between flex-wrap gap-x-4 gap-y-0.5">
          <div className="flex items-center gap-1.5">
            <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color:'#F97316'}}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span>Gaberone Plaza, 4th Floor, Shop A13 — Nairobi</span>
          </div>
          <div className="flex items-center gap-5">
            <span>Mon–Sat 8am–7pm</span>
            <a href="tel:+254746722417" className="flex items-center gap-1.5 font-semibold hover:opacity-75 transition-opacity" style={{color:'#F97316'}}>
              <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              +254 746 722 417
            </a>
          </div>
        </div>
      </div>

      <CustomerCareButton />

      {/* ── MAIN HEADER ──────────────────────────────────────────────────── */}
      <header className={[
        'sticky top-0 z-50 transition-all duration-300',
        scrolled || !isHome
          ? 'bg-white border-b border-gray-100 shadow-[0_1px_16px_rgba(0,0,0,0.06)]'
          : 'bg-gradient-to-b from-black/40 via-black/10 to-transparent',
      ].join(' ')}>

        <div className="max-w-[1320px] mx-auto px-5 flex items-center gap-4 h-[62px]">

          {/* LOGO — unchanged from repo */}
          <Link href="/" className="shrink-0 flex items-center">
            <Image src="/logo.png" alt="Smartech Kenya" width={140} height={40} priority className="object-contain h-9 w-auto"/>
          </Link>

          {/* Search — desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-auto">
            <form onSubmit={handleSearch} className="relative w-full">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input type="text" value={searchVal} onChange={e => setSearchVal(e.target.value)}
                placeholder="Search products, brands…"
                className={['w-full pl-10 pr-4 py-2.5 rounded-full text-sm transition-all duration-200 outline-none',
                  onDark
                    ? 'bg-white/[0.12] border border-white/20 text-white placeholder-white/40 focus:bg-white/20'
                    : 'bg-gray-100 border border-gray-200 text-gray-800 placeholder-gray-400 focus:bg-white focus:border-gray-300 focus:shadow-sm',
                ].join(' ')}/>
            </form>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-0.5 ml-auto md:ml-0">
            <button onClick={() => setSearchOpen(!searchOpen)}
              className={['md:hidden p-2.5 rounded-xl transition-colors', onDark ? 'text-white/85 hover:bg-white/10' : 'text-gray-500 hover:bg-gray-100'].join(' ')}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>

            <a href="https://wa.me/254746722417?text=Hi%20Smartech%20Kenya%2C%20I%20want%20to%20order" target="_blank" rel="noopener noreferrer"
              className={['hidden xl:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all', onDark ? 'text-white/85 hover:bg-white/10' : 'text-gray-500 hover:bg-gray-100'].join(' ')}>
              Order via WhatsApp
            </a>

            {isAdmin && (
              <Link href="/admin" className={['hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide transition-all ml-1',
                pathname.startsWith('/admin') ? 'bg-amber-400 text-gray-900'
                  : onDark ? 'bg-amber-400/20 text-amber-300 hover:bg-amber-400/30'
                  : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'].join(' ')}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
                </svg>
                Admin
              </Link>
            )}

            <Link href="/wishlist" className={['relative p-2.5 rounded-xl transition-colors hidden sm:flex', onDark ? 'text-white/85 hover:bg-white/10' : 'text-gray-500 hover:bg-gray-100'].join(' ')}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
              {wishlistCount > 0 && <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white" style={{background:'#F97316'}}>{wishlistCount}</span>}
            </Link>

            <Link href="/cart" className={['relative p-2.5 rounded-xl transition-colors', onDark ? 'text-white/85 hover:bg-white/10' : 'text-gray-500 hover:bg-gray-100'].join(' ')}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              {cartCount > 0 && <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white" style={{background:'#F97316'}}>{cartCount > 9 ? '9+' : cartCount}</span>}
            </Link>

            {session ? (
              <button onClick={() => signOut()} className={['hidden sm:flex p-2.5 rounded-xl transition-colors', onDark ? 'text-white/85 hover:bg-white/10' : 'text-gray-500 hover:bg-gray-100'].join(' ')}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </button>
            ) : (
              <Link href="/login" className={['hidden sm:inline-flex items-center gap-1.5 ml-1 px-4 py-2 rounded-xl text-xs font-semibold transition-all',
                onDark ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20' : 'bg-gray-900 text-white hover:bg-gray-700'].join(' ')}>
                Sign in
              </Link>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)}
              className={['lg:hidden p-2.5 rounded-xl transition-colors ml-0.5', onDark ? 'text-white/85 hover:bg-white/10' : 'text-gray-500 hover:bg-gray-100'].join(' ')}>
              {mobileOpen
                ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12"/></svg>
                : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16"/></svg>
              }
            </button>
          </div>
        </div>

        {/* Category nav strip */}
        <div className={['hidden lg:block border-t transition-colors', onDark ? 'border-white/[0.12]' : 'border-gray-100'].join(' ')}>
          <div className="max-w-[1320px] mx-auto px-5 flex items-center overflow-x-auto hide-scrollbar">
            {NAV.map(n => (
              <Link key={n.href} href={n.href}
                className={['flex-shrink-0 px-4 py-2.5 text-[11.5px] font-semibold tracking-wide whitespace-nowrap transition-all border-b-2',
                  onDark ? 'border-transparent text-white/80 hover:text-white hover:border-white/50'
                         : 'border-transparent text-gray-400 hover:text-gray-800 hover:border-gray-300'].join(' ')}>
                {n.label}
              </Link>
            ))}
            <div className="flex-1"/>
            <Link href="/products?isFeatured=true"
              className={['flex-shrink-0 px-4 py-2.5 text-[11.5px] font-bold tracking-wide transition-all border-b-2 border-transparent',
                onDark ? 'text-orange-300 hover:text-orange-200 font-bold' : 'text-orange-500 hover:text-orange-600 font-bold'].join(' ')}>
              Deals
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[55] flex items-start justify-center pt-[100px] px-4 md:hidden" onClick={() => setSearchOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md"/>
          <div className="relative w-full max-w-md" onClick={e => e.stopPropagation()} style={{animation:'scale-in 0.18s cubic-bezier(0.22,1,0.36,1) forwards'}}>
            <form onSubmit={handleSearch} className="flex items-center gap-3 bg-white rounded-2xl shadow-2xl px-5 py-4">
              <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input ref={searchRef} type="text" value={searchVal} onChange={e => setSearchVal(e.target.value)}
                placeholder="Search products, brands…" className="flex-1 text-gray-800 text-base outline-none placeholder-gray-400 bg-transparent"/>
              {searchVal && (
                <button type="button" onClick={() => setSearchVal('')} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"/>
          <nav className="absolute top-[calc(62px+30px)] inset-x-0 bg-white border-b border-gray-100 shadow-2xl overflow-y-auto max-h-[calc(100vh-92px)]"
            onClick={e => e.stopPropagation()} style={{animation:'fade-up 0.22s cubic-bezier(0.22,1,0.36,1) forwards'}}>
            <div className="px-5 py-3 border-b border-gray-100">
              <form onSubmit={handleSearch} className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input type="text" value={searchVal} onChange={e => setSearchVal(e.target.value)} placeholder="Search products…"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-100 text-sm text-gray-800 placeholder-gray-400 outline-none"/>
              </form>
            </div>
            <div className="py-2">
              {NAV.map(n => (
                <Link key={n.href} href={n.href} onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-5 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                  {n.label}
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7"/></svg>
                </Link>
              ))}
              <Link href="/products?isFeatured=true" onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-5 py-3.5 text-sm font-bold border-b border-gray-100 hover:bg-gray-50" style={{color:'#F97316'}}>
                Deals
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7"/></svg>
              </Link>
            </div>
            <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-4 flex-wrap">
              <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="text-sm text-gray-500 hover:text-gray-800 transition-colors">Wishlist {wishlistCount > 0 && `(${wishlistCount})`}</Link>
              <Link href="/track-order" onClick={() => setMobileOpen(false)} className="text-sm text-gray-500 hover:text-gray-800 transition-colors">Track Order</Link>
              <Link href="/contact" onClick={() => setMobileOpen(false)} className="text-sm text-gray-500 hover:text-gray-800 transition-colors">Contact</Link>
              {isAdmin && <Link href="/admin" onClick={() => setMobileOpen(false)} className="text-sm font-bold" style={{color:'#F97316'}}>⚙ Admin</Link>}
            </div>
            <div className="p-5 space-y-2.5 border-t border-gray-100">
              <a href="https://wa.me/254746722417?text=Hi%20Smartech%20Kenya%2C%20I%20want%20to%20order" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-gray-900 text-white rounded-xl text-sm font-semibold">Order via WhatsApp</a>
              {session ? (
                <button onClick={() => signOut()} className="w-full py-3 text-sm font-medium text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">Sign out</button>
              ) : (
                <Link href="/login" onClick={() => setMobileOpen(false)}
                  className="block w-full py-3 border border-gray-900 text-gray-900 text-sm font-semibold rounded-xl text-center hover:bg-gray-900 hover:text-white transition-all">Sign in</Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
