import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0a0a]">
      {/* Ambient gradient orbs */}
      <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[700px] h-[700px] rounded-full bg-kenya-green/[0.15] blur-[140px]" />
        <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] rounded-full bg-kenya-red/[0.08]  blur-[120px]" />
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] rounded-full bg-white/[0.02] blur-[80px]" />
      </div>

      {/* Subtle grid */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      <div className="relative w-full max-w-7xl mx-auto px-6 py-32 pt-40">
        {/* Eyebrow pill */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/[0.12] bg-white/[0.05] backdrop-blur-sm mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-kenya-green animate-pulse" />
          <span className="text-white/50 text-xs font-medium tracking-wide">Kenya&apos;s Premium Electronics Marketplace</span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-[clamp(3rem,8vw,6.5rem)] text-white leading-[1.03] tracking-tight mb-7 max-w-4xl">
          Live Smarter.
          <br />
          <span
            className="text-transparent"
            style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}
          >
            Live{' '}
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-kenya-green via-emerald-400 to-teal-300">
            Better.
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-white/45 text-lg sm:text-xl leading-relaxed max-w-2xl mb-10">
          From the latest smartphones to premium home appliances — curated for the modern Kenyan home.
          Quality guaranteed, delivered fast, paid with M-Pesa.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-gray-900 text-sm font-bold rounded-full hover:bg-gray-100 transition-all duration-200 active:scale-[0.97]"
          >
            Shop Now
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            href="/products?category=SMARTPHONES"
            className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/[0.15] text-white text-sm font-medium rounded-full hover:bg-white/[0.07] transition-all duration-200"
          >
            Browse Phones
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-20 pt-8 border-t border-white/[0.08] grid grid-cols-3 gap-8 max-w-md">
          {[
            { num: '10K+', label: 'Customers'      },
            { num: '500+', label: 'Products'        },
            { num: '47',   label: 'Counties Served' },
          ].map(({ num, label }) => (
            <div key={label}>
              <div className="font-display text-2xl text-white font-light tracking-tight">{num}</div>
              <div className="text-white/30 text-xs mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/25">
        <span className="text-[9px] uppercase tracking-[0.2em]">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent" />
      </div>
    </section>
  );
}
