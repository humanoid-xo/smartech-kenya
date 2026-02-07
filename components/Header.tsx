'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { data: session } = useSession();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.productIds);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container-custom">
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">SK</span>
            </div>
            <span className="text-2xl font-display font-bold text-primary-500 hidden sm:block">
              Smartech Kenya
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/products?category=tech"
              className="text-neutral-700 hover:text-primary-500 font-medium transition-colors"
            >
              Tech
            </Link>
            <Link
              href="/products?category=kitchen"
              className="text-neutral-700 hover:text-primary-500 font-medium transition-colors"
            >
              Kitchen
            </Link>
            {session?.user && (
              <>
                <Link
                  href="/orders"
                  className="text-neutral-700 hover:text-primary-500 font-medium transition-colors"
                >
                  My Orders
                </Link>
                {(session.user as any).isSeller && (
                  <Link
                    href="/seller/dashboard"
                    className="text-neutral-700 hover:text-primary-500 font-medium transition-colors"
                  >
                    Seller Dashboard
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden lg:block">
            <div className="relative">
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </form>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <svg
                className="w-6 h-6 text-neutral-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {wishlistItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-accent-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <svg
                className="w-6 h-6 text-neutral-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-accent-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {session?.user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 hover:bg-neutral-100 rounded-full transition-colors">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {session.user.name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-neutral-700 hover:bg-neutral-100"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 py-2 text-neutral-700 hover:bg-neutral-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="btn-primary text-sm py-2 px-4"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-200 animate-slide-down">
            <form onSubmit={handleSearch} className="mb-4">
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full input-field"
              />
            </form>
            <div className="space-y-2">
              <Link
                href="/products?category=tech"
                className="block py-2 text-neutral-700 hover:text-primary-500"
              >
                Tech
              </Link>
              <Link
                href="/products?category=kitchen"
                className="block py-2 text-neutral-700 hover:text-primary-500"
              >
                Kitchen
              </Link>
              {session?.user && (
                <>
                  <Link
                    href="/orders"
                    className="block py-2 text-neutral-700 hover:text-primary-500"
                  >
                    My Orders
                  </Link>
                  {(session.user as any).isSeller && (
                    <Link
                      href="/seller/dashboard"
                      className="block py-2 text-neutral-700 hover:text-primary-500"
                    >
                      Seller Dashboard
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
