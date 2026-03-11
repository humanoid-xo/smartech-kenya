'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useSelector } from 'react-redux'
import { ShoppingCart, Heart, Search, Menu, X, ChevronDown, User, LogOut, Package, Store } from 'lucide-react'
import { CATEGORIES } from '@/constants/categories'

interface StoreState {
  cart?:     { items?: { quantity: number }[] }
  wishlist?: { items?: unknown[] }
}

export default function Header() {
  const [mobileOpen,    setMobileOpen]    = useState(false)
  const [activeMenu,    setActiveMenu]    = useState<string | null>(null)
  const [searchOpen,    setSearchOpen]    = useState(false)
  const [searchQuery,   setSearchQuery]   = useState('')
  const [scrolled,      setScrolled]      = useState(false)
  const [userOpen,      setUserOpen]      = useState(false)
  const pathname  = usePathname()
  const { data: session } = useSession()
  const userRef   = useRef<HTMLDivElement>(null)

  const cartItems  = useSelector((s: StoreState) => s.cart?.items     ?? [])
  const wishItems  = useSelector((s: StoreState) => s.wishlist?.items ?? [])
  const cartCount  = cartItems.reduce((sum, i) => sum + (i.quantity ?? 1), 0)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setMobileOpen(false); setUserOpen(false); setSearchOpen(false) }, [pathname])

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchQuery.trim()
    if (q) window.location.href = `/products?search=${encodeURIComponent(q)}`
  }

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-navy-900 text-center py-2 px-4 text-xs text-navy-300 hidden sm:block">
        <span>🇰🇪 Free delivery in Nairobi on orders over <strong className="text-white">KES 5,000</strong></span>
        <span className="mx-4 text-navy-600">|</span>
        <Link href="/seller" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">Sell on Smartech →</Link>
      </div>

      <header className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md transition-all duration-300 ${scrolled ? 'shadow-[0_1px_20px_rgba(0,0,0,0.08)]' : 'border-b border-navy-100'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center h-16 gap-6">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 mr-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-heading font-black text-base leading-none">S</span>
              </div>
              <span className="font-heading font-black text-navy-900 text-lg hidden sm:block">
                Smartech<span className="text-primary-600"> Kenya</span>
              </span>
            </Link>

            {/* Nav — desktop */}
            <nav className="hidden lg:flex items-center gap-1 flex-1">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.slug}
                  className="relative"
                  onMouseEnter={() => setActiveMenu(cat.slug)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <Link
                    href={`/products?category=${cat.enum}`}
                    className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      activeMenu === cat.slug
                        ? 'bg-navy-50 text-navy-900'
                        : 'text-navy-600 hover:text-navy-900 hover:bg-navy-50'
                    }`}
                  >
                    {cat.name}
                    <ChevronDown size={13} className={`transition-transform duration-200 ${activeMenu === cat.slug ? 'rotate-180' : ''}`} />
                  </Link>

                  {/* Mega dropdown */}
                  {activeMenu === cat.slug && (
                    <div className="absolute left-0 top-full pt-2 z-50 w-72">
                      <div className="bg-white rounded-2xl shadow-2xl border border-navy-100 p-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-navy-400 px-2 pt-1 pb-2">
                          {cat.description}
                        </p>
                        {cat.subcategories.map((sub) => (
                          <Link
                            key={sub.slug}
                            href={`/products?category=${cat.enum}&subcategory=${sub.slug}`}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary-50 text-navy-700 hover:text-primary-700 transition-colors"
                          >
                            <span className="text-xl w-7 text-center flex-shrink-0">{sub.emoji}</span>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold leading-tight">{sub.name}</p>
                              <p className="text-[11px] text-navy-400 truncate">{sub.description}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <Link href="/products?isFeatured=true" className="px-4 py-2 rounded-xl text-sm font-semibold text-gold-600 hover:bg-gold-50 transition-colors">
                Deals
              </Link>
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1 ml-auto">

              {/* Search toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 rounded-xl text-navy-600 hover:bg-navy-50 hover:text-navy-900 transition-colors"
              >
                <Search size={19} />
              </button>

              {/* Wishlist */}
              <Link href="/wishlist" className="relative p-2.5 rounded-xl text-navy-600 hover:bg-navy-50 hover:text-navy-900 transition-colors">
                <Heart size={19} />
                {wishItems.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                    {wishItems.length > 9 ? '9+' : wishItems.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link href="/cart" className="relative p-2.5 rounded-xl text-navy-600 hover:bg-navy-50 hover:text-navy-900 transition-colors">
                <ShoppingCart size={19} />
                {cartCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-primary-600 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {/* User */}
              {session ? (
                <div ref={userRef} className="relative">
                  <button
                    onClick={() => setUserOpen(!userOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-navy-600 hover:bg-navy-50 transition-colors"
                  >
                    <User size={19} />
                    <span className="hidden md:block text-sm font-semibold max-w-[80px] truncate">
                      {session.user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown size={12} className={`hidden md:block transition-transform ${userOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userOpen && (
                    <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-2xl shadow-2xl border border-navy-100 z-50 overflow-hidden">
                      <div className="px-4 py-3.5 bg-navy-50 border-b border-navy-100">
                        <p className="font-heading font-bold text-navy-900 text-sm truncate">{session.user?.name}</p>
                        <p className="text-navy-400 text-xs truncate">{session.user?.email}</p>
                      </div>
                      <div className="py-1.5">
                        {[
                          { href: '/orders',   icon: <Package size={14} />,  label: 'My Orders' },
                          { href: '/wishlist', icon: <Heart size={14} />,    label: 'Wishlist' },
                        ].map(({ href, icon, label }) => (
                          <Link key={href} href={href} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-navy-700 hover:bg-navy-50 transition-colors">
                            <span className="text-navy-400">{icon}</span> {label}
                          </Link>
                        ))}
                        {(session.user as { isSeller?: boolean })?.isSeller && (
                          <Link href="/seller" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-navy-700 hover:bg-navy-50 transition-colors">
                            <span className="text-navy-400"><Store size={14} /></span> Seller Dashboard
                          </Link>
                        )}
                        <div className="border-t border-navy-100 mt-1 pt-1">
                          <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut size={14} /> Sign Out
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2 ml-1">
                  <Link href="/login" className="px-4 py-2 text-sm font-semibold text-navy-700 hover:text-primary-600 transition-colors rounded-xl hover:bg-navy-50">
                    Sign In
                  </Link>
                  <Link href="/register" className="px-4 py-2 bg-navy-900 text-white text-sm font-bold rounded-xl hover:bg-navy-800 transition-colors">
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2.5 rounded-xl text-navy-600 hover:bg-navy-50 transition-colors ml-1"
              >
                {mobileOpen ? <X size={21} /> : <Menu size={21} />}
              </button>
            </div>
          </div>

          {/* Search bar — expands inline */}
          {searchOpen && (
            <div className="pb-4">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Samsung TVs, LG fridges, Ramtons cookers..."
                    className="w-full h-12 pl-5 pr-14 rounded-2xl bg-navy-50 border-2 border-navy-200 focus:border-primary-500 focus:outline-none text-sm font-body text-navy-900 placeholder:text-navy-400 transition-colors"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 text-white p-2 rounded-xl hover:bg-primary-700 transition-colors"
                  >
                    <Search size={16} />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-navy-100 bg-white max-h-[75vh] overflow-y-auto">
            <div className="px-6 py-5 space-y-6">
              {!session && (
                <div className="flex gap-2 pb-5 border-b border-navy-100">
                  <Link href="/login"    className="flex-1 text-center py-3 border border-navy-200 rounded-2xl text-sm font-bold text-navy-700">Sign In</Link>
                  <Link href="/register" className="flex-1 text-center py-3 bg-navy-900 rounded-2xl text-sm font-bold text-white">Register Free</Link>
                </div>
              )}
              {CATEGORIES.map((cat) => (
                <div key={cat.slug}>
                  <Link href={`/products?category=${cat.enum}`} className="block text-[11px] font-black uppercase tracking-[0.15em] text-navy-400 mb-3">
                    {cat.name}
                  </Link>
                  <div className="grid grid-cols-2 gap-2">
                    {cat.subcategories.map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`/products?category=${cat.enum}&subcategory=${sub.slug}`}
                        className="flex items-center gap-2 px-3 py-2.5 bg-navy-50 rounded-xl text-navy-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                      >
                        <span className="text-lg">{sub.emoji}</span>
                        <span className="text-xs font-semibold leading-tight">{sub.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  )
}
