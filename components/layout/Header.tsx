'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { SearchBar } from '@/components/features/search/SearchBar';

export function Header() {
  const { data: session } = useSession();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-kenya-black text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span>🇰🇪 Kenya's #1 Tech Marketplace</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span>Free Delivery on Orders Over KES 10,000</span>
            <span>•</span>
            <span>Track Your Order</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-kenya-green rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">SK</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-display font-bold text-xl">Smartech Kenya</div>
              <div className="text-xs text-gray-500">Premium Quality</div>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <SearchBar />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link 
                  href="/cart" 
                  className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-kenya-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <div className="w-8 h-8 bg-kenya-green text-white rounded-full flex items-center justify-center">
                      {session.user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="p-2">
                      <Link href="/orders" className="block px-4 py-2 hover:bg-gray-100 rounded">
                        My Orders
                      </Link>
                      {(session.user as any)?.isSeller && (
                        <Link href="/seller" className="block px-4 py-2 hover:bg-gray-100 rounded">
                          Seller Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => signOut()}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded text-kenya-red"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-secondary">
                  Sign In
                </Link>
                <Link href="/register" className="btn btn-primary hidden sm:block">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        <div className="mt-4 md:hidden">
          <SearchBar />
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-8 py-3">
            <Link href="/products?category=TECH" className="text-gray-700 hover:text-kenya-green font-medium">
              Technology
            </Link>
            <Link href="/products?category=KITCHEN" className="text-gray-700 hover:text-kenya-green font-medium">
              Kitchen
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-kenya-green font-medium">
              All Products
            </Link>
            <Link href="/deals" className="text-kenya-red hover:text-red-700 font-medium">
              Deals 🔥
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
