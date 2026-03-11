import Image     from 'next/image';
import Link      from 'next/link';
import { prisma }   from '@/lib/prisma';
import { ProductCard } from '@/components/features/products/ProductCard';
import { CATEGORIES, POPULAR_BRANDS } from '@/constants/categories';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Smartech Kenya — Premium Tech & Home Appliances',
  description: "Kenya's definitive destination for electronics and home appliances. Fast Nairobi delivery.",
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

      {/* HERO */}
      <section className="relative min-h-screen bg-forest-gradient flex items-end overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #F5F0E8 1px, transparent 0)', backgroundSize: '28px 28px' }}/>
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-forest-600/15 rounded-full blur-[140px] pointer-events-none"/>
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-amber-luxe/8 rounded-full blur-[120px] pointer-events-none"/>

        <div className="relative w-full max-w-[1320px] mx-auto px-6 pb-24 pt-40">
          <div className="grid lg:grid-cols-2 gap-16 items-end">
            <div>
              <h1 className="font-display text-cream leading-[1.0] tracking-tight mb-8"
                  style={{ fontSize: 'clamp(3.8rem, 8.5vw, 7rem)', fontWeight: 400 }}>
                Live<br/>
                <span className="text-transparent"
                  style={{ WebkitTextStroke: '1px rgba(245,240,232,0.25)' }}>
                  Smarter.
                </span><br/>
                Live<br/>
                <span className="italic" style={{ color: '#4DC87A' }}>Better.</span>
              </h1>
              <p className="text-cream/40 text-lg leading-relaxed mb-10 max-w-sm">
                Premium electronics and home appliances,
                curated for the modern Kenyan home.
              </p>
              <div className="flex flex-wrap gap-3">
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
            </div>

            <div className="hidden lg:grid grid-cols-2 gap-3">
              {[
                { href: '/products?category=TECH&subcategory=smart-tvs',  img: 'https://images.unsplash.com/photo-1593359677879-a4bb92f4834c?w=400&q=80', label: 'Smart TVs'    },
                { href: '/products?category=TECH&subcategory=phones',     img: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&q=80', label: 'Smartphones' },
                { href: '/products?category=KITCHEN&subcategory=fridges', img: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&q=80', label: 'Fridges'      },
                { href: '/products?category=TECH&subcategory=laptops',    img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80', label: 'Laptops'      },
              ].map(({ href, img, label }, i) => (
                <Link key={label} href={href}
                  className={`group relative rounded-2xl overflow-hidden border border-cream/[0.08] hover:border-cream/20 transition-all duration-300 ${i === 0 ? 'row-span-2' : ''}`}
                  style={{ height: i === 0 ? '380px' : '180px' }}>
                  <Image src={img} alt={label} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"/>
                  <div className="absolute bottom-4 left-4">
                    <p className="text-white font-medium text-sm tracking-wide">{label}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BRAND STRIP */}
      <section className="bg-cream-warm border-y border-cream-warm/60 py-5 overflow-hidden">
        <div className="flex items-center gap-12 px-6 max-w-[1320px] mx-auto overflow-x-auto">
          {POPULAR_BRANDS.map(b => (
            <Link key={b} href={`/products?brand=${b}`}
              className="overline text-ink-faint hover:text-ink transition-colors whitespace-nowrap shrink-0 text-[11px]">
              {b}
            </Link>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-24 px-6">
        <div className="max-w-[1320px] mx-auto">
          <div className="flex items-end justify-between mb-14">
            <h2 className="font-display text-ink" style={{ fontSize: 'clamp(2.2rem,4vw,3.5rem)', fontWeight: 400 }}>
              What are you<br/>looking for?
            </h2>
            <Link href="/products" className="hidden sm:flex items-center gap-1.5 text-sm text-ink-faint hover:text-ink transition-colors font-medium">
              All products
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {CATEGORIES.map((cat, ci) => (
              <div key={cat.slug}
                className={`group relative rounded-2xl overflow-hidden ${ci === 0 ? 'bg-forest-gradient' : 'bg-ink'}`}
                style={{ minHeight: '400px' }}>
                <div className="absolute inset-0 opacity-[0.03]"
                  style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}/>
                <div className="relative p-10 flex flex-col" style={{ minHeight: '400px' }}>
                  <div className="mb-auto">
                    <p className="text-cream/30 text-[11px] font-semibold tracking-widest uppercase mb-3">{cat.description}</p>
                    <h3 className="font-display text-cream font-light leading-tight mb-6"
                      style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
                      {cat.name}
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-8">
                    {cat.subcategories.slice(0, 4).map(sub => (
                      <Link key={sub.slug} href={`/products?category=${cat.enum}&subcategory=${sub.slug}`}
                        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] transition-all border border-white/[0.07] group/sub">
                        <span className="text-base">{sub.emoji}</span>
                        <span className="text-cream/65 text-xs font-medium group-hover/sub:text-cream transition-colors">{sub.name}</span>
                      </Link>
                    ))}
                  </div>
                  <Link href={`/products?category=${cat.enum}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-cream/50 hover:text-cream transition-colors">
                    View all {cat.name}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      {featured.length > 0 && (
        <section className="py-24 px-6 bg-cream-warm">
          <div className="max-w-[1320px] mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-forest-600 text-[11px] font-semibold tracking-widest uppercase mb-3">Hand-picked</p>
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

      {/* LATEST ARRIVALS */}
      {latest.length > 0 && (
        <section className="py-24 px-6">
          <div className="max-w-[1320px] mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-forest-600 text-[11px] font-semibold tracking-widest uppercase mb-3">Just In</p>
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

      {/* NEWSLETTER */}
      <NewsletterSection />
    </div>
  );
}

function NewsletterSection() {
  return (
    <section className="py-24 px-6 bg-ink">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-forest-400 text-[11px] font-semibold tracking-widest uppercase mb-4">Stay ahead</p>
        <h2 className="font-display text-cream mb-4" style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 400 }}>
          Get the best deals first
        </h2>
        <p className="text-cream/35 text-sm mb-8 leading-relaxed max-w-md mx-auto">
          New arrivals, exclusive offers and tech news — delivered weekly to your inbox.
        </p>
        <form className="flex gap-2 max-w-md mx-auto">
          <input
            type="email" placeholder="your@email.com" required
            className="flex-1 min-w-0 px-5 py-3.5 rounded-full border border-cream/10 bg-cream/5 text-sm text-cream placeholder-cream/25 focus:outline-none focus:border-forest-600 transition-all"
          />
          <button type="submit" className="btn-forest px-6 py-3.5 rounded-full whitespace-nowrap text-sm">
            Subscribe
          </button>
        </form>
        <p className="text-cream/20 text-xs mt-4">No spam. Unsubscribe any time.</p>
      </div>
    </section>
  );
}
