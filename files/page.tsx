import Image   from 'next/image';
import Link    from 'next/link';
import { prisma }          from '@/lib/prisma';
import { ProductCard }     from '@/components/features/products/ProductCard';
import { HERO_IMAGES }     from '@/constants/heroImages';
import { STATIC_PRODUCTS } from '@/constants/staticProducts';
import type { Metadata }   from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title:       'Smartech Kenya — Premium Tech & Home Appliances Nairobi',
  description: "Kenya's curated destination for electronics and home appliances. MIKA, Hisense, Samsung, HP. Fast Nairobi delivery.",
};

async function getSection(
  where: any,
  take:  number,
  fallback: typeof STATIC_PRODUCTS,
) {
  try {
    const rows = await prisma.product.findMany({
      where: { isActive: true, ...where },
      include: { reviews: { select: { rating: true } } },
      take,
      orderBy: { createdAt: 'desc' },
    });
    const mapped = rows.map(p => ({
      ...p,
      avgRating:   p.reviews.length > 0 ? p.reviews.reduce((s,r) => s+r.rating, 0)/p.reviews.length : 0,
      reviewCount: p.reviews.length,
    }));
    return mapped.length > 0 ? mapped : (fallback as any[]);
  } catch {
    return fallback as any[];
  }
}

const BRANDS = ['Mika','Hisense','Samsung','LG','Ramtons','HP','Von Hotpoint','Beko','Haier','TCL'];

export default async function HomePage() {
  const [featured, latest, kitchen] = await Promise.all([
    getSection({ isFeatured: true }, 8, STATIC_PRODUCTS.filter(p => p.isFeatured).slice(0, 8)),
    getSection({}, 4, STATIC_PRODUCTS.slice(0, 4)),
    getSection({ category: 'KITCHEN' }, 4, STATIC_PRODUCTS.filter(p => p.category === 'KITCHEN').slice(0, 4)),
  ]);

  return (
    <div className="bg-cream">

      {/* ══ HERO ═════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-ink pt-[68px]">
        <div className="max-w-[1320px] mx-auto px-6 grid lg:grid-cols-2 gap-0 items-center min-h-[90vh]">

          {/* LEFT: copy */}
          <div className="pt-12 pb-16 lg:pt-16 lg:pb-20 lg:pr-16 z-10 relative">

            <div className="inline-flex items-center gap-2 mb-7 px-3 py-1.5 rounded-full border border-white/[0.12] bg-white/[0.05]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] animate-pulse"/>
              <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-white/50">
                Nairobi&apos;s #1 Appliance Store
              </p>
            </div>

            <h1 className="font-display text-white tracking-tight mb-6"
              style={{ fontSize: 'clamp(2.6rem,5vw,4.6rem)', fontWeight: 400, lineHeight: 1.04 }}>
              Elevating Every Home,<br/>
              <span style={{ color: '#F97316' }}>One Appliance</span><br/>
              at a Time.
            </h1>

            <p className="text-[15px] leading-relaxed mb-10 max-w-[420px]"
              style={{ color: 'rgba(255,255,255,0.55)' }}>
              Premium home appliances and electronics,
              curated for the modern Kenyan home.
              Delivered fast across Nairobi.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              <Link href="/products"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: '#F97316', color: '#fff', boxShadow: '0 4px 24px rgba(249,115,22,0.35)' }}>
                Shop All Products
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </Link>
              <a href="https://wa.me/254746722417?text=Hi%20Smartech%20Kenya%2C%20I%20want%20to%20order"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition-all">
                Order via WhatsApp
              </a>
            </div>

            <div className="flex flex-wrap gap-8 pt-8 border-t border-white/[0.08]">
              {[
                { icon: '🛡', text: 'Genuine Products'    },
                { icon: '🚚', text: 'Fast Nairobi Delivery'},
                { icon: '💬', text: 'WhatsApp Support'    },
              ].map(t => (
                <div key={t.text} className="flex items-center gap-2.5">
                  <span className="text-base">{t.icon}</span>
                  <span className="text-[11px] font-medium tracking-wide"
                    style={{ color: 'rgba(255,255,255,0.50)' }}>
                    {t.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: 2×2 image grid */}
          <div className="hidden lg:grid grid-cols-2 grid-rows-2 gap-3 py-8 pl-4"
            style={{ height: '90vh' }}>
            {HERO_IMAGES.map((img, i) => (
              <div key={i}
                className="relative rounded-2xl overflow-hidden group"
                style={{ minHeight: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 rounded-2xl"
                  style={{ background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.45) 100%)' }}/>
              </div>
            ))}
          </div>

          {/* Mobile image strip */}
          <div className="lg:hidden -mx-6 pb-10 overflow-x-auto hide-scrollbar flex gap-3 px-6">
            {HERO_IMAGES.map((img, i) => (
              <div key={i} className="relative flex-shrink-0 rounded-2xl overflow-hidden"
                style={{ width: '68vw', height: '190px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover"/>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURED PRODUCTS ════════════════════════════════════════════════ */}
      {featured.length > 0 && (
        <section className="py-16 px-6 bg-cream">
          <div className="max-w-[1320px] mx-auto">
            <SectionHeader label="Hand-picked" title="Featured Products" href="/products" cta="View all"/>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.map(p => <ProductCard key={p.id} product={p as any}/>)}
            </div>
            <div className="flex justify-center mt-8 sm:hidden">
              <Link href="/products" className="btn-dark px-7 py-3.5">View All</Link>
            </div>
          </div>
        </section>
      )}

      {/* ══ PROMO BANNERS ════════════════════════════════════════════════════ */}
      <section className="py-6 px-6 bg-cream-warm/40">
        <div className="max-w-[1320px] mx-auto grid md:grid-cols-2 gap-4">
          {[
            {
              label: 'Home Appliances', href: '/products?category=KITCHEN',
              headline: 'Upgrade Your\nKitchen Today',
              sub: 'MIKA, Hisense, Ramtons & more',
              img: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=700&q=80',
            },
            {
              label: 'Tech Deals', href: '/products?category=SMARTPHONES',
              headline: 'Latest Phones\n& Laptops',
              sub: 'Samsung, HP and top brands',
              img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=700&q=80',
            },
          ].map(b => (
            <Link key={b.label} href={b.href}
              className="group relative rounded-2xl overflow-hidden bg-ink flex items-center"
              style={{ minHeight: '210px' }}>
              <div className="absolute right-0 top-0 bottom-0 w-[52%] hidden sm:block">
                <Image src={b.img} alt={b.label} fill sizes="340px"
                  className="object-cover opacity-30 group-hover:opacity-45 transition-opacity duration-500"/>
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(90deg, #0C0C0C 0%, rgba(12,12,12,0.80) 35%, rgba(12,12,12,0.10) 100%)' }}/>
              </div>
              <div className="relative p-8 z-10 max-w-[290px]">
                <p className="text-[9px] font-bold tracking-[0.18em] uppercase mb-3"
                  style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {b.label}
                </p>
                <h3 className="font-display text-white leading-tight mb-3"
                  style={{ fontSize: 'clamp(1.6rem,2.8vw,2.1rem)', fontWeight: 400, whiteSpace: 'pre-line' }}>
                  {b.headline}
                </h3>
                <p className="text-xs mb-6 font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {b.sub}
                </p>
                <span className="inline-flex items-center gap-2 text-xs font-bold tracking-wide"
                  style={{ color: '#D9A050' }}>
                  Shop Now
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══ HOME APPLIANCES ══════════════════════════════════════════════════ */}
      {kitchen.length > 0 && (
        <section className="py-16 px-6 bg-ink">
          <div className="max-w-[1320px] mx-auto">
            <SectionHeader label="Mika · Hisense · Ramtons" title="Home Appliances"
              href="/products?category=KITCHEN" cta="View all" dark/>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {kitchen.map(p => <ProductCard key={p.id} product={p as any}/>)}
            </div>
          </div>
        </section>
      )}

      {/* ══ NEW ARRIVALS ═════════════════════════════════════════════════════ */}
      {latest.length > 0 && (
        <section className="py-16 px-6 bg-cream-warm/30">
          <div className="max-w-[1320px] mx-auto">
            <SectionHeader label="Just In" title="New Arrivals" href="/products" cta="View all new"/>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {latest.map(p => <ProductCard key={p.id} product={p as any}/>)}
            </div>
          </div>
        </section>
      )}

      {/* ══ WHY SMARTECH ═════════════════════════════════════════════════════ */}
      <section className="py-16 px-6 bg-cream">
        <div className="max-w-[1320px] mx-auto">
          <div className="text-center mb-10">
            <p className="section-label mb-2">Why Choose Us</p>
            <h2 className="font-display text-ink" style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 400 }}>
              Built for Kenya
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { n: '01', title: 'Fast Delivery',         desc: 'Same-day or next-day within Nairobi CBD and suburbs.' },
              { n: '02', title: '100% Genuine',          desc: 'Sourced directly from authorised Kenyan distributors.' },
              { n: '03', title: 'WhatsApp Orders',       desc: 'Place an order instantly — no account needed.' },
              { n: '04', title: 'After-sales Support',   desc: 'We stand behind every product post-purchase.' },
            ].map(f => (
              <div key={f.n} className="p-6 rounded-2xl border border-cream-warm bg-white hover:shadow-md transition-all duration-200 group">
                <p className="font-display text-[2.5rem] font-light mb-4 leading-none group-hover:text-accent-300 transition-colors"
                  style={{ color: 'rgba(139,90,26,0.18)' }}>{f.n}</p>
                <h3 className="font-semibold text-ink text-sm mb-2">{f.title}</h3>
                <p className="text-ink-faint text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BRANDS ═══════════════════════════════════════════════════════════ */}
      <section className="py-12 px-6 border-t border-cream-warm/60 bg-cream">
        <div className="max-w-[1320px] mx-auto">
          <p className="text-center text-[9px] font-bold tracking-[0.22em] uppercase text-ink/25 mb-8">
            Authorised Brands
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {BRANDS.map(b => (
              <Link key={b} href={`/products?brand=${encodeURIComponent(b)}`}
                className="font-display text-xl font-light text-ink/25 hover:text-ink/60 transition-colors tracking-wide">
                {b}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA / NEWSLETTER ═════════════════════════════════════════════════ */}
      <section className="py-20 px-6 bg-ink">
        <div className="max-w-[1320px] mx-auto grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p className="text-[9.5px] font-bold tracking-[0.18em] uppercase mb-5"
              style={{ color: '#D9A050' }}>Stay Ahead</p>
            <h2 className="font-display text-cream mb-4"
              style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 400 }}>
              Get the best deals first
            </h2>
            <p className="text-sm leading-relaxed max-w-[340px]"
              style={{ color: 'rgba(245,240,232,0.50)' }}>
              New arrivals, exclusive offers and appliance news — no spam, unsubscribe any time.
            </p>
            <div className="flex gap-5 mt-8">
              {[
                { href: 'https://wa.me/254746722417', label: 'WhatsApp' },
                { href: 'https://instagram.com/smartechkenya', label: 'Instagram' },
                { href: 'https://tiktok.com/@smartechkenya', label: 'TikTok' },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-semibold tracking-wide text-cream/35 hover:text-cream/70 transition-colors">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <form className="flex flex-col sm:flex-row gap-2.5 mb-3">
              <input type="email" placeholder="your@email.com" required className="input-dark flex-1"/>
              <button type="submit"
                className="px-6 py-3.5 rounded-full bg-white text-ink hover:bg-cream text-sm font-semibold shrink-0 whitespace-nowrap transition-colors">
                Subscribe
              </button>
            </form>
            <p className="text-xs" style={{ color: 'rgba(245,240,232,0.25)' }}>Unsubscribe any time.</p>
          </div>
        </div>
      </section>

    </div>
  );
}

function SectionHeader({ label, title, href, cta, dark = false }: {
  label: string; title: string; href: string; cta: string; dark?: boolean;
}) {
  return (
    <div className="flex items-end justify-between mb-10">
      <div>
        <p className="text-[9.5px] font-bold tracking-[0.16em] uppercase mb-2.5"
          style={{ color: dark ? '#D9A050' : '#8B5A1A' }}>
          {label}
        </p>
        <h2 className={`font-display ${dark ? 'text-cream' : 'text-ink'}`}
          style={{ fontSize: 'clamp(1.8rem,3.2vw,2.6rem)', fontWeight: 400 }}>
          {title}
        </h2>
      </div>
      <Link href={href}
        className={[
          'hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold transition-colors',
          dark ? 'text-cream/40 hover:text-cream' : 'text-ink/40 hover:text-ink',
        ].join(' ')}>
        {cta}
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
        </svg>
      </Link>
    </div>
  );
}
