import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0a0a]">

      {/* Background appliance photo */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1920&q=80')",
        }}
      />
      {/* Dark overlay so text is readable */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/70 to-black/50" />
      {/* Green tint overlay */}
      <div aria-hidden className="absolute inset-0 bg-kenya-green/10" />

      {/* Grid texture */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      <div className="relative w-full max-w-7xl mx-auto px-6 py-32 pt-40">
        {/* Eyebrow pill */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/[0.15] bg-white/[0.07] backdrop-blur-sm mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-kenya-green animate-pulse" />
          <span className="text-white/60 text-xs font-medium tracking-wide">
            Kenya&apos;s Premium Electronics &amp; Appliances Marketplace
          </span>
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

        <p className="text-white/50 text-lg sm:text-xl leading-relaxed max-w-2xl mb-10">
          From the latest smartphones to premium home appliances — curated for
          the modern Kenyan home. Quality guaranteed, delivered fast, paid with
          M-Pesa.
        </p>

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
            className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/[0.2] text-white text-sm font-medium rounded-full hover:bg-white/[0.08] transition-all duration-200"
          >
            Browse Phones
          </Link>
        </div>
      </div>
    </section>
  );
}
