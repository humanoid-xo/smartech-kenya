import { Suspense } from 'react';
import Link from 'next/link';
import { FeaturedProducts } from '@/components/features/products/FeaturedProducts';
import { Categories } from '@/components/features/home/Categories';
import { HeroSection } from '@/components/features/home/HeroSection';
import { Newsletter } from '@/components/features/home/Newsletter';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Categories */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-bold mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-600 text-lg">
            Discover premium products in our curated collections
          </p>
        </div>
        <Categories />
      </section>
      
      {/* Featured Products */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-display font-bold mb-4">
                Featured Products
              </h2>
              <p className="text-gray-600 text-lg">
                Handpicked items you'll love
              </p>
            </div>
            <Link 
              href="/products" 
              className="btn btn-primary"
            >
              View All Products
            </Link>
          </div>
          <Suspense fallback={<ProductsLoading />}>
            <FeaturedProducts />
          </Suspense>
        </div>
      </section>
      
      {/* Why Choose Us */}
      <section className="py-16 px-4 bg-kenya-black text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold mb-4">
              Why Choose Smartech Kenya
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-kenya-green rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Quality Guaranteed</h3>
              <p className="text-gray-300">
                All products verified for authenticity and quality
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-kenya-green rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">M-Pesa Payments</h3>
              <p className="text-gray-300">
                Secure payments with Kenya's trusted mobile money
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-kenya-green rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
              <p className="text-gray-300">
                Quick delivery across Kenya
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <Newsletter />
    </div>
  );
}

function ProductsLoading() {
  return (
    <div className="grid md:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="card p-4">
          <div className="animate-shimmer h-48 rounded-lg mb-4" />
          <div className="animate-shimmer h-4 rounded mb-2" />
          <div className="animate-shimmer h-4 rounded w-2/3" />
        </div>
      ))}
    </div>
  );
}
