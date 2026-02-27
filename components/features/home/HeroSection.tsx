import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-kenya-black to-gray-900 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      
      <div className="relative max-w-7xl mx-auto px-4 py-24 lg:py-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-kenya-green/20 border border-kenya-green/50 rounded-full px-4 py-2 mb-6">
            <span className="text-kenya-green">●</span>
            <span className="text-sm font-medium">Now with Free Delivery</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-display font-bold mb-6 leading-tight">
            Premium Tech & Kitchen{' '}
            <span className="text-kenya-green">Appliances</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Kenya's most trusted marketplace for quality electronics and home appliances. 
            Secure payments with M-Pesa, fast delivery nationwide.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link href="/products" className="btn btn-primary text-lg px-8 py-4">
              Shop Now
            </Link>
            <Link href="/products?category=TECH" className="btn bg-white text-kenya-black hover:bg-gray-100 text-lg px-8 py-4">
              Browse Tech
            </Link>
          </div>
          
          <div className="mt-12 grid grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-kenya-green mb-1">1000+</div>
              <div className="text-sm text-gray-400">Products</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-kenya-green mb-1">50+</div>
              <div className="text-sm text-gray-400">Brands</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-kenya-green mb-1">10k+</div>
              <div className="text-sm text-gray-400">Happy Customers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
