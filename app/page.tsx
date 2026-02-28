import { Suspense } from 'react';
import Link from 'next/link';
import { FeaturedProducts } from '@/components/features/products/FeaturedProducts';
import { Categories }       from '@/components/features/home/Categories';
import { HeroSection }      from '@/components/features/home/HeroSection';
import { Newsletter }        from '@/components/features/home/Newsletter';

export default function HomePage() {
  return (
    <div>
      <HeroSection />

      {/* Shop by Category */}
      <section className="py-24 px-6 bg-[#f5f5f7]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="section-label mb-3">Browse by category</p>
            <h2 className="section-title">
              Everything you need,
              <br />
              <span className="text-gray-400">all in one place.</span>
            </h2>
          </div>
          <Categories />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="section-label mb-3">Hand-picked for you</p>
              <h2 className="section-title">
                Featured <span className="text-gray-400">Products</span>
              </h2>
            </div>
            <Link
              href="/products"
              className="hidden sm:inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium"
            >
              View all
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <Suspense fallback={<ProductsLoading />}>
            <FeaturedProducts />
          </Suspense>
        </div>
      </section>

      {/* Why Smartech — bento grid */}
      <section className="py-24 px-6 bg-[#f5f5f7]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="section-label mb-3">Why Smartech</p>
            <h2 className="section-title">
              The smarter way
              <br />
              <span className="text-gray-400">to shop in Kenya.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                symbol: '✓',
                title:  'Quality Guaranteed',
                desc:   'Every product is verified for authenticity. No counterfeits. No compromise.',
                bg:     'bg-[#0a0a0a]',
                fg:     'text-white',
                sub:    'text-white/50',
              },
              {
                symbol: 'M',
                title:  'M-Pesa Payments',
                desc:   "Pay securely with Kenya's most trusted mobile money platform — no card needed.",
                bg:     'bg-kenya-green',
                fg:     'text-white',
                sub:    'text-white/60',
              },
              {
                symbol: '⚡',
                title:  'Fast Delivery',
                desc:   'Same-day delivery in Nairobi. Next-day across Kenya. Track every step.',
                bg:     'bg-white',
                fg:     'text-gray-900',
                sub:    'text-gray-500',
              },
            ].map(({ symbol, title, desc, bg, fg, sub }) => (
              <div key={title} className={`${bg} rounded-2xl p-8 border border-transparent`}>
                <div className={`font-display text-4xl font-light ${fg} mb-6 leading-none`}>{symbol}</div>
                <h3 className={`text-xl font-semibold ${fg} mb-2`}>{title}</h3>
                <p className={`text-sm leading-relaxed ${sub}`}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </div>
  );
}

function ProductsLoading() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="aspect-square animate-shimmer-bg" />
          <div className="p-4 space-y-2.5">
            <div className="h-3 animate-shimmer-bg rounded-full w-1/3" />
            <div className="h-4 animate-shimmer-bg rounded-full" />
            <div className="h-4 animate-shimmer-bg rounded-full w-3/4" />
            <div className="h-5 animate-shimmer-bg rounded-full w-1/2 mt-1" />
          </div>
        </div>
      ))}
    </div>
  );
}
