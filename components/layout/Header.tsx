'use client';

import { useState, useEffect, useRef } from 'react';
import Link            from 'next/link';
import Image           from 'next/image';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { CATEGORIES }  from '@/constants/categories';
import type { RootState } from '@/store';

export function Header() {
  const pathname  = usePathname();
  const cartItems = useSelector((s: RootState) => s.cart?.items ?? []);
  const cartCount = cartItems.reduce((n: number, i: any) => n + (i.quantity ?? 1), 0);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);

  useEffect(() => { setMobileOpen(false); }, [pathname]);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
      {/* ── TOP BAR ─────────────────────────────────────── */}
      <div className="hidden sm:block text-white text-[11px] py-1.5 px-4" style={{ background: '#003A7A' }}>
        <div className="max-w-[1320px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 opacity-75">
            <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span>Gaberone Plaza, 4th Floor, Shop A13 — Nairobi</span>
          </div>
          <div className="flex items-center gap-5 opacity-75">
            <span>Mon–Sat 8am–7pm</span>
            <a href="tel:+254746722417" className="font-semibold hover:opacity-100 transition-opacity">
              +254 746 722 417
            </a>
            <a href="mailto:smartechkenya01@gmail.com" className="hover:opacity-100 transition-opacity">
              smartechkenya01@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* ── MAIN HEADER ─────────────────────────────────── */}
      <header
        className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${
          scrolled ? 'shadow-[0_2px_20px_rgba(0,0,0,0.09)]' : 'border-b border-gray-100'
        }`}
      >
        <div className="max-w-[1320px] mx-auto px-5 flex items-center gap-4 h-[64px]">

          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image src="/logo.png" alt="Smartech Kenya" width={148} height={42}
              priority className="object-contain h-10 w-auto"/>
          </Link>

          {/* Desktop search */}
          <form action="/products" method="GET"
            className="hidden md:flex flex-1 max-w-[500px] mx-4 relative"
            onSubmit={e => {
              const i = (e.currentTarget.querySelector('input[name="search"]') as HTMLInputElement);
              if (!i?.value.trim()) e.preventDefault();
            }}>
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input type="text" name="search" autoComplete="off"
              placeholder="Search products, brands, categories…"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 text-gray-800
                         placeholder-gray-400 focus:bg-white focus:border-blue-500
                         focus:ring-2 focus:ring-blue-100 outline-none transition-all"/>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-1 ml-auto md:ml-0">

            {/* WhatsApp CTA — desktop */}
            <a href="https://wa.me/254746722417?text=Hi%20Smartech%20Kenya%2C%20I%27d%20like%20to%20order"
              target="_blank" rel="noopener noreferrer"
              className="hidden xl:inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white
                         transition-opacity hover:opacity-90"
              style={{ background: '#25D366' }}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Order via WhatsApp
            </a>

            {/* Cart */}
            <Link href="/cart"
              className="relative p-2.5 text-gray-600 hover:text-blue-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[17px] h-[17px] px-0.5 text-[9px] font-bold
                                 flex items-center justify-center text-white"
                  style={{ background: '#003A7A' }}>
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Wishlist */}
            <Link href="/wishlist"
              className="hidden sm:flex p-2.5 text-gray-600 hover:text-blue-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </Link>

            {/* Mobile menu toggle */}
            <button onClick={() => setMobileOpen(o => !o)}
              className="lg:hidden p-2.5 text-gray-600 hover:text-blue-700 transition-colors ml-0.5"
              aria-label="Menu">
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

        {/* ── Desktop nav strip ─────────────────────────── */}
        <nav className="hidden lg:block border-t border-gray-100">
          <div className="max-w-[1320px] mx-auto px-5 flex items-center overflow-x-auto hide-scrollbar">

            {/* All Products */}
            <Link href="/products"
              className={`nav-link flex-shrink-0 px-4 py-3 font-semibold ${!pathname.includes('?') && pathname === '/products' ? 'active' : ''}`}>
              All Products
            </Link>

            {/* Divider */}
            <span className="w-px h-4 bg-gray-200 mx-1"/>

            {/* Category links from constants */}
            {CATEGORIES.map(cat => (
              <Link
                key={cat.value}
                href={`/products?category=${cat.value}`}
                className="nav-link flex-shrink-0 px-4 py-3"
              >
                {cat.label}
              </Link>
            ))}

            <div className="flex-1"/>

            {/* Deals badge */}
            <Link href="/products?isFeatured=true"
              className="flex-shrink-0 px-4 py-3 text-[13px] font-bold tracking-wide transition-all"
              style={{ color: '#E8A020' }}>
              🔥 Deals
            </Link>
          </div>
        </nav>
      </header>

      {/* ── WhatsApp floating button ──────────────────── */}
      <a
        href="https://wa.me/254746722417?text=Hi%20Smartech%20Kenya%2C%20I%27d%20like%20to%20order"
        target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
        className="fixed bottom-6 right-6 z-[60] w-14 h-14 flex items-center justify-center
                   shadow-xl transition-transform hover:scale-105 active:scale-95"
        style={{ background: '#25D366' }}
      >
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* ── Mobile drawer ─────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"/>
          <nav
            className="absolute top-[64px] inset-x-0 bg-white shadow-2xl border-b border-gray-200 overflow-y-auto"
            style={{ maxHeight: 'calc(100vh - 64px)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Mobile search */}
            <div className="px-4 py-3 border-b border-gray-100">
              <form action="/products" method="GET" className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input type="text" name="search" placeholder="Search products…"
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-100 text-sm text-gray-800 placeholder-gray-400 outline-none"/>
              </form>
            </div>

            {/* All Products */}
            <Link href="/products" onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-5 py-4 text-sm font-bold text-gray-900
                         hover:bg-gray-50 border-b border-gray-100">
              All Products
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7"/>
              </svg>
            </Link>

            {/* Category links */}
            {CATEGORIES.map(cat => (
              <Link
                key={cat.value}
                href={`/products?category=${cat.value}`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-5 py-4 text-sm font-medium text-gray-700
                           hover:bg-gray-50 border-b border-gray-100 transition-colors"
              >
                {cat.label}
                <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7"/>
                </svg>
              </Link>
            ))}

            {/* Deals */}
            <Link href="/products?isFeatured=true" onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-5 py-4 text-sm font-bold border-b border-gray-100"
              style={{ color: '#E8A020' }}>
              🔥 Featured Deals
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7"/>
              </svg>
            </Link>

            {/* CTAs */}
            <div className="p-4 space-y-3">
              <a
                href="https://wa.me/254746722417?text=Hi%20Smartech%20Kenya%2C%20I%27d%20like%20to%20order"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 text-white text-sm font-bold"
                style={{ background: '#25D366' }}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Order via WhatsApp
              </a>
              <Link href="/cart" onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold
                           text-gray-700 border border-gray-200 hover:bg-gray-50 transition-all">
                🛒 View Cart {cartCount > 0 && `(${cartCount})`}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
