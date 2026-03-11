import Image     from 'next/image';
import Link      from 'next/link';
import { prisma }   from '@/lib/prisma';
import { ProductCard } from '@/components/features/products/ProductCard';
import { CATEGORIES, POPULAR_BRANDS } from '@/constants/categories';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Smartech Kenya — Premium Tech & Home Appliances',
  description: "Kenya's definitive destination for electronics and home appliances. M-Pesa payments. Fast Nairobi delivery.",
};

async function getFeatured() {
  try {
    const rows = await prisma.product.findMany({
      where:   { isActive: true, isFeatured: true },
      include: { reviews: { select: { rating: true } } },
      take:    8, orderBy: { createdAt: 'desc' },
    });
    return rows.map(p => ({
      ...p,
      avgRating:   p.reviews.length > 0 ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length : 0,
      reviewCount: p.reviews.length,
    }));
  } catch { return []; }
}

async function getLatest() {
  try {
    const rows = await prisma.product.findMany({
      where:   { isActive: true },
      include: { reviews: { select: { rating: true } } },
      take:    4, orderBy: { createdAt: 'desc' },
    });
    return rows.map(p => ({
      ...p,
      avgRating:   p.reviews.length > 0 ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length : 0,
      reviewCount: p.reviews.length,
    }));
  } catch { return []; }
}

export default async function HomePage() {
  const [featured, latest] = await Promise.all([getFeatured(), getLatest()]);

  return (
    <div className="bg-cream">

      {/* --- HERO --------------------------------------- */}
      <section className="relative min-h-screen bg-forest-gradient flex items-end overflow-hidden">

        {/* Background texture */}
        <div className="absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #F5F0E8 1px, transparent 0)', backgroundSize: '32px 32px' }}/>

        {/* Glow */}
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-forest-600/20 rounded-full blur-[120px] pointer-events-none"/>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-luxe/10 rounded-full blur-[100px] pointer-events-none"/>

        <div className="relative w-full max-w-[1320px] mx-auto px-6 pb-20 pt-36">
          <div className="grid lg:grid-cols-2 gap-12 items-end">

            {/* Left — editorial copy */}
            <div>
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-cream/10 bg-cream/5 mb-10">
                <span className="w-1.5 h-1.5 rounded-full bg-forest-400 animate-pulse"/>
                <span className="text-cream/50 text-xs font-medium tracking-widest uppercase">Nairobi's Premier Tech Store</span>
              </div>

              <h1 className="font-display text-cream leading-[1.0] tracking-tight mb-8"
                  style={{ fontSize: 'clamp(4rem, 9vw, 7.5rem)', fontWeight: 400 }}>
                Live<br/>
                <span className="text-transparent"
                  style={{ WebkitTextStroke: '1px rgba(245,240,232,0.3)' }}>
                  Smarter.
                </span><br/>
                Live<br/>
                <span className="italic" style={{ color: '#4DC87A' }}>Better.</span>
              </h1>

              <p className="text-cream/45 text-lg leading-relaxed mb-10 max-w-md">
                From the latest smartphones to intelligent home appliances —
                curated exclusively for the modern Kenyan home.
              </p>

              <div className="flex flex-wrap gap-3 mb-14">
                <Link href="/products" className="btn-cream text-base px-8 py-4">
                  Shop Now
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </Link>
                <Link href="/products?category=KITCHEN" className="btn-outline-cream text-base px-8 py-4">
                  Home Appliances
                </Link>
              </div>

              {/* Stat bar */}
              <div className="flex items-center gap-8">
                {[
                  { n: '500+', l: 'Products' },
                  { n: 'M-Pesa', l: 'Payments' },
                  { n: 'Same-day', l: 'Nairobi Delivery' },
                ].map(({ n, l }) => (
                  <div key={l}>
                    <div className="font-display text-2xl text-cream font-medium">{n}</div>
                    <div className="text-cream/30 text-xs mt-0.5">{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — product showcase grid */}
            <div className="hidden lg:grid grid-cols-2 gap-3">
              {[
                { href: '/products?category=TECH&subcategory=smart-tvs',  img: 'https://images.unsplash.com/photo-1593359677879-a4bb92f4834c?w=400&q=80', label: 'Smart TVs'     },
                { href: '/products?category=TECH&subcategory=phones',     img: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&q=80', label: 'Smartphones'  },
                { href: '/products?category=KITCHEN&subcategory=fridges', img: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&q=80', label: 'Fridges'       },
                { href: '/products?category=TECH&subcategory=laptops',    img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80', label: 'Laptops'       },
              ].map(({ href, img, label }, i) => (
                <Link key={label} href={href}
                  className={`group relative rounded-2xl overflow-hidden border border-cream/8 hover:border-cream/20 transition-all duration-300 ${i === 0 ? 'row-span-2' : ''}`}
                  style={{ height: i === 0 ? '380px' : '180px' }}>
                  <Image src={img} alt={label} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"/>
                  <div className="absolute bottom-4 left-4">
                    <p className="text-white font-medium text-sm">{label}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <span className="overline text-cream text-[10px]">Scroll</span>
          <div className="w-px h-10 bg-cream/40"/>
        </div>
      </section>

      {/* --- BRAND STRIP -------------------------------- */}
      <section className="bg-cream-warm border-y border-cream-warm/50 py-5 overflow-hidden">
        <div className="flex items-center gap-12 animate-[scroll_30s_linear_infinite] whitespace-nowrap" style={{animationName:'none'}}>
          <div className="flex items-center gap-12 px-6 max-w-[1320px] mx-auto overflow-x-auto">
            {POPULAR_BRANDS.map(b => (
              <Link key={b} href={`/products?brand=${b}`}
                className="overline text-ink-faint hover:text-ink transition-colors whitespace-nowrap shrink-0">
                {b}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- CATEGORIES -------------------------------- */}
      <section className="py-24 px-6">
        <div className="max-w-[1320px] mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="overline text-forest-600 mb-3">Collections</p>
              <h2 className="font-display text-ink" style={{ fontSize: 'clamp(2.2rem,4vw,3.5rem)', fontWeight: 400 }}>
                What are you looking for?
              </h2>
            </div>
            <Link href="/products" className="hidden sm:flex items-center gap-1.5 text-sm text-ink-faint hover:text-ink transition-colors font-medium">
              All products
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {CATEGORIES.map((cat, ci) => (
              <div key={cat.slug}
                className={`group relative rounded-3xl overflow-hidden border border-cream-warm ${ci === 0 ? 'bg-forest-gradient' : 'bg-ink'}`}
                style={{ minHeight: '420px' }}>

                {/* Background texture */}
                <div className="absolute inset-0 opacity-[0.04]"
                  style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }}/>

                <div className="relative p-10 flex flex-col h-full">
                  <div className="mb-auto">
                    <p className="overline text-cream/35 mb-3">{cat.description}</p>
                    <h3 className="font-display text-cream text-5xl font-light leading-tight mb-6">
                      {cat.name}
                    </h3>
                  </div>

                  {/* Sub-categories */}
                  <div className="grid grid-cols-2 gap-2 mb-8">
                    {cat.subcategories.slice(0, 4).map(sub => (
                      <Link key={sub.slug} href={`/products?category=${cat.enum}&subcategory=${sub.slug}`}
                        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-cream/8 hover:bg-cream/15 transition-all border border-cream/8 group/sub">
                        <span className="text-lg">{sub.emoji}</span>
                        <span className="text-cream/70 text-xs font-medium group-hover/sub:text-cream transition-colors">{sub.name}</span>
                      </Link>
                    ))}
                  </div>

                  <Link href={`/products?category=${cat.enum}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-cream/60 hover:text-cream transition-colors">
                    View all {cat.name}
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURED PRODUCTS ------------------------ */}
      {featured.length > 0 && (
        <section className="py-24 px-6 bg-cream-warm">
          <div className="max-w-[1320px] mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="overline text-forest-600 mb-3">Hand-picked</p>
                <h2 className="font-display text-ink" style={{ fontSize: 'clamp(2.2rem,4vw,3.5rem)', fontWeight: 400 }}>
                  Featured Products
                </h2>
              </div>
              <Link href="/products" className="hidden sm:flex items-center gap-1.5 text-sm text-ink-faint hover:text-ink transition-colors font-medium">
                View all
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featured.map(p => <ProductCard key={p.id} product={p as any}/>)}
            </div>
          </div>
        </section>
      )}

      {/* --- LATEST ARRIVALS -------------------------- */}
      {latest.length > 0 && (
        <section className="py-24 px-6">
          <div className="max-w-[1320px] mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="overline text-forest-600 mb-3">Just In</p>
                <h2 className="font-display text-ink" style={{ fontSize: 'clamp(2.2rem,4vw,3.5rem)', fontWeight: 400 }}>
                  New Arrivals
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {latest.map(p => <ProductCard key={p.id} product={p as any}/>)}
            </div>
          </div>
        </section>
      )}

      {/* --- TRUST PILLARS ---------------------------- */}
      <section className="py-20 px-6 bg-ink">
        <div className="max-w-[1320px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-cream/5 rounded-3xl overflow-hidden">
            {[
              {
                n: '01',
                title: 'Quality Guaranteed',
                body:  'Every product authenticated and verified. Genuine brands, zero counterfeits. Period.',
                icon:  'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
              },
              {
                n: '02',
                title: 'M-Pesa Payments',
                body:  "Instant, secure checkout with Kenya's most trusted mobile money platform. Safe every time.",
                icon:  'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
              },
              {
                n: '03',
                title: 'Fast Delivery',
                body:  'Same-day delivery across Nairobi. Next-day guaranteed nationwide. Real-time order tracking.',
                icon:  'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0',
              },
            ].map(({ n, title, body, icon }) => (
              <div key={n} className="bg-ink p-10">
                <div className="font-display text-cream/10 text-5xl font-light mb-6">{n}</div>
                <div className="w-10 h-10 rounded-xl bg-forest-900 border border-forest-700 flex items-center justify-center mb-5">
                  <svg className="w-5 h-5 text-forest-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon}/>
                  </svg>
                </div>
                <h3 className="text-cream font-semibold text-base mb-2">{title}</h3>
                <p className="text-cream/30 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- NEWSLETTER ------------------------------- */}
      <NewsletterSection />

    </div>
  );
}

function NewsletterSection() {
  return (
    <section className="py-24 px-6 bg-cream">
      <div className="max-w-2xl mx-auto text-center">
        <p className="overline text-forest-600 mb-4">Stay ahead</p>
        <h2 className="font-display text-ink mb-4" style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 400 }}>
          Get the best deals first
        </h2>
        <p className="text-ink-faint text-sm mb-8 leading-relaxed max-w-md mx-auto">
          New arrivals, exclusive offers and tech news — delivered weekly to your inbox.
        </p>
        <form className="flex gap-2 max-w-md mx-auto">
          <input
            type="email" placeholder="your@email.com" required
            className="flex-1 min-w-0 px-5 py-3.5 rounded-full border border-cream-warm bg-white text-sm text-ink placeholder-cream-muted focus:outline-none focus:border-forest-600 transition-all"
          />
          <button type="submit" className="btn-dark px-6 py-3.5 rounded-full whitespace-nowrap">
            Subscribe
          </button>
        </form>
        <p className="text-cream-muted text-xs mt-4">No spam. Unsubscribe any time.</p>
      </div>
    </section>
  );
}
