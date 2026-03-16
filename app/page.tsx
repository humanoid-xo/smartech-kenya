import Image   from 'next/image';
import Link    from 'next/link';
import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/features/products/ProductCard';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title:       'Smartech Kenya — Premium Tech & Home Appliances Nairobi',
  description: "Kenya's curated destination for electronics and home appliances. MIKA, Hisense, Samsung, HP. Fast Nairobi delivery.",
};

async function getFeatured() {
  try {
    const rows = await prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: { reviews: { select: { rating: true } } },
      take: 8, orderBy: { createdAt: 'desc' },
    });
    return rows.map(p => ({
      ...p,
      avgRating:   p.reviews.length > 0 ? p.reviews.reduce((s,r)=>s+r.rating,0)/p.reviews.length : 0,
      reviewCount: p.reviews.length,
    }));
  } catch { return []; }
}

async function getLatest() {
  try {
    const rows = await prisma.product.findMany({
      where: { isActive: true },
      include: { reviews: { select: { rating: true } } },
      take: 4, orderBy: { createdAt: 'desc' },
    });
    return rows.map(p => ({
      ...p,
      avgRating:   p.reviews.length > 0 ? p.reviews.reduce((s,r)=>s+r.rating,0)/p.reviews.length : 0,
      reviewCount: p.reviews.length,
    }));
  } catch { return []; }
}

async function getKitchen() {
  try {
    const rows = await prisma.product.findMany({
      where: { isActive: true, category: 'KITCHEN' as any },
      include: { reviews: { select: { rating: true } } },
      take: 4, orderBy: { createdAt: 'desc' },
    });
    return rows.map(p => ({
      ...p,
      avgRating:   p.reviews.length > 0 ? p.reviews.reduce((s,r)=>s+r.rating,0)/p.reviews.length : 0,
      reviewCount: p.reviews.length,
    }));
  } catch { return []; }
}

const QUICK_CATS = [
  { label: 'Fridges',          href: '/products?category=KITCHEN&subcategory=fridges'          },
  { label: 'Washing Machines', href: '/products?category=KITCHEN&subcategory=washing-machines' },
  { label: 'Water Dispensers', href: '/products?category=KITCHEN&subcategory=water-dispensers' },
  { label: 'Hobs',             href: '/products?category=KITCHEN&subcategory=built-in'         },
  { label: 'Hoods',            href: '/products?category=KITCHEN&subcategory=built-in'         },
  { label: 'Cookers',          href: '/products?category=KITCHEN&subcategory=cookers'          },
  { label: 'Microwaves',       href: '/products?category=KITCHEN&subcategory=microwaves'       },
  { label: 'Smart TVs',        href: '/products?category=AUDIO_TV'                             },
  { label: 'Smartphones',      href: '/products?category=SMARTPHONES'                          },
  { label: 'Laptops',          href: '/products?category=LAPTOPS'                              },
  { label: 'Audio',            href: '/products?category=AUDIO_TV&subcategory=audio'           },
  { label: 'Smart Home',       href: '/products?category=SMART_HOME'                           },
];

const BRANDS = ['Mika','Hisense','Samsung','LG','Ramtons','HP','Von Hotpoint','Beko','Haier','TCL'];

const SHOP_CATS = [
  { name:'Fridges & Freezers',    href:'/products?category=KITCHEN&subcategory=fridges',
    img:'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&q=80' },
  { name:'Washing Machines',      href:'/products?category=KITCHEN&subcategory=washing-machines',
    img:'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&q=80' },
  { name:'Water Dispensers',      href:'/products?category=KITCHEN&subcategory=water-dispensers',
    img:'https://images.unsplash.com/photo-1548277539-ee5c7d9f4b3c?w=600&q=80' },
  { name:'Built-in Hobs & Hoods', href:'/products?category=KITCHEN&subcategory=built-in',
    img:'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80' },
  { name:'Smart TVs',             href:'/products?category=AUDIO_TV',
    img:'https://images.unsplash.com/photo-1593359677879-a4bb92f4834c?w=600&q=80' },
  { name:'Smartphones',           href:'/products?category=SMARTPHONES',
    img:'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&q=80' },
  { name:'Laptops',               href:'/products?category=LAPTOPS',
    img:'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80' },
  { name:'Small Appliances',      href:'/products?category=KITCHEN&subcategory=small-appliances',
    img:'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&q=80' },
];

export default async function HomePage() {
  const [featured, latest, kitchen] = await Promise.all([
    getFeatured(), getLatest(), getKitchen(),
  ]);

  return (
    <div className="bg-cream">

      {/* ══ HERO ═════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: '90vh' }}>
        <Image
          src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&q=80"
          alt="Modern kitchen appliances"
          fill priority sizes="100vw"
          className="object-cover object-center"
        />
        {/* Gradient: very dark left third → fades cleanly to transparent */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(105deg, rgba(6,6,6,0.95) 0%, rgba(6,6,6,0.80) 38%, rgba(6,6,6,0.40) 65%, rgba(6,6,6,0.05) 100%)' }}/>

        <div className="relative max-w-[1320px] mx-auto px-6 flex items-end pb-24 lg:pb-32"
          style={{ minHeight: '90vh' }}>
          <div className="max-w-[560px]">

            <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-6"
              style={{ color: 'rgba(255,255,255,0.50)' }}>
              Nairobi&apos;s Appliance Store
            </p>

            <h1 className="font-display text-white tracking-tight mb-6"
              style={{ fontSize: 'clamp(2.8rem,6vw,5.2rem)', fontWeight: 400, lineHeight: 1.04 }}>
              Elevating Every Home,<br/>
              One Appliance<br/>
              at a Time.
            </h1>

            <p className="text-[15px] leading-relaxed mb-10 max-w-[400px]"
              style={{ color: 'rgba(255,255,255,0.70)' }}>
              Premium home appliances and electronics,
              curated for the modern Kenyan home.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/products"
                className="btn px-8 py-3.5 rounded-full bg-white text-ink hover:bg-cream text-sm font-semibold shadow-lg">
                Shop All Products
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </Link>
              <a href="https://wa.me/254746722417?text=Hi%20Smartech%20Kenya%2C%20I%20want%20to%20order"
                className="btn-outline-cream text-sm px-8 py-3.5">
                Order via WhatsApp
              </a>
            </div>

            {/* Delivery badges */}
            <div className="flex flex-wrap gap-5 mt-10 pt-8 border-t border-white/[0.15]">
              {['Genuine Products Only', 'Fast Nairobi Delivery', 'WhatsApp Support 7 Days'].map(t => (
                <div key={t} className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 shrink-0" style={{ color: '#D9A050' }}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                  </svg>
                  <span className="text-[11px] font-medium tracking-wide"
                    style={{ color: 'rgba(255,255,255,0.65)' }}>
                    {t}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ CATEGORY QUICK-NAV ═══════════════════════════════════════════════ */}
      <section className="bg-white border-b border-cream-warm sticky top-[60px] z-30 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
        <div className="max-w-[1320px] mx-auto px-4">
          <div className="flex items-center overflow-x-auto hide-scrollbar">
            {QUICK_CATS.map(c => (
              <Link key={c.label} href={c.href}
                className="flex-shrink-0 px-4 py-[14px] text-[11.5px] font-semibold
                           text-ink/55 hover:text-ink
                           border-b-2 border-transparent hover:border-ink/30
                           transition-all tracking-wide whitespace-nowrap">
                {c.label}
              </Link>
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
              <Link href="/products" className="btn-dark px-7 py-3.5">View All Products</Link>
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
              style={{ minHeight: '200px' }}>
              <div className="absolute inset-0 dot-grid opacity-70"/>
              {/* Right side image — fades into left */}
              <div className="absolute right-0 top-0 bottom-0 w-[52%] hidden sm:block">
                <Image src={b.img} alt={b.label} fill sizes="340px"
                  className="object-cover opacity-35 group-hover:opacity-50 transition-opacity duration-500"/>
                {/* Gradient fades image into the dark left side */}
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(90deg, #0C0C0C 0%, rgba(12,12,12,0.85) 30%, rgba(12,12,12,0.20) 70%, transparent 100%)' }}/>
              </div>

              <div className="relative p-7 lg:p-8 z-10 max-w-[280px]">
                <p className="text-[9px] font-bold tracking-[0.18em] uppercase mb-2.5"
                  style={{ color: 'rgba(255,255,255,0.50)' }}>
                  {b.label}
                </p>
                <h3 className="font-display text-white leading-tight mb-3"
                  style={{ fontSize: 'clamp(1.5rem,2.8vw,2rem)', fontWeight: 400, whiteSpace: 'pre-line' }}>
                  {b.headline}
                </h3>
                <p className="text-xs mb-5 font-medium" style={{ color: 'rgba(255,255,255,0.60)' }}>
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

      {/* ══ SHOP BY CATEGORY ═════════════════════════════════════════════════ */}
      <section className="py-16 px-6 bg-cream">
        <div className="max-w-[1320px] mx-auto">
          <SectionHeader label="Browse" title="Shop by Category" href="/products" cta="All products"/>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {SHOP_CATS.map(c => (
              <Link key={c.name} href={c.href}
                className="group relative rounded-2xl overflow-hidden bg-ink hover:-translate-y-0.5 transition-all duration-300 hover:shadow-xl"
                style={{ height: '158px' }}>
                <Image src={c.img} alt={c.name} fill sizes="(max-width:768px) 50vw,25vw"
                  className="object-cover opacity-40 group-hover:opacity-55 transition-opacity duration-500"/>
                {/* Strong bottom gradient so white text is always legible */}
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.30) 50%, rgba(0,0,0,0.05) 100%)' }}/>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-semibold text-sm leading-snug drop-shadow-sm">{c.name}</p>
                </div>
              </Link>
            ))}
          </div>
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
      <section className="py-14 px-6 bg-cream">
        <div className="max-w-[1320px] mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { n: '01', title: 'Fast Nairobi Delivery',  desc: 'Same-day or next-day within Nairobi CBD and suburbs.' },
              { n: '02', title: '100% Genuine Products',  desc: 'Sourced directly from authorised Kenyan distributors.' },
              { n: '03', title: 'Order via WhatsApp',     desc: 'Place an order instantly — no account needed.' },
              { n: '04', title: 'After-sales Support',    desc: 'We stand behind every product post-purchase.' },
            ].map(f => (
              <div key={f.n} className="p-6 rounded-2xl border border-cream-warm bg-white/70 hover:bg-white hover:shadow-sm transition-all duration-200">
                <p className="font-display text-[2.2rem] font-light mb-4 leading-none"
                  style={{ color: 'rgba(139,90,26,0.20)' }}>{f.n}</p>
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
          <p className="text-center text-[9px] font-bold tracking-[0.22em] uppercase text-ink/30 mb-8">
            Authorised brands
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {BRANDS.map(b => (
              <Link key={b} href={`/products?brand=${encodeURIComponent(b)}`}
                className="font-display text-xl font-light text-ink/30 hover:text-ink/65 transition-colors tracking-wide">
                {b}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ NEWSLETTER ═══════════════════════════════════════════════════════ */}
      <section className="py-20 px-6 bg-ink">
        <div className="max-w-[1320px] mx-auto grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p className="text-[9.5px] font-bold tracking-[0.18em] uppercase mb-5"
              style={{ color: '#D9A050' }}>Stay ahead</p>
            <h2 className="font-display text-cream mb-4"
              style={{ fontSize: 'clamp(1.9rem,3.8vw,2.9rem)', fontWeight: 400 }}>
              Get the best deals first
            </h2>
            <p className="text-sm leading-relaxed max-w-[320px]"
              style={{ color: 'rgba(245,240,232,0.55)' }}>
              New arrivals, exclusive offers and appliance news — no spam.
            </p>
            <div className="flex gap-5 mt-8">
              {[
                { href: 'https://wa.me/254746722417',          l: 'WhatsApp'  },
                { href: 'https://instagram.com/smartechkenya', l: 'Instagram' },
                { href: 'https://tiktok.com/@smartechkenya',   l: 'TikTok'    },
              ].map(s => (
                <a key={s.l} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-semibold tracking-wide transition-colors"
                  style={{ color: 'rgba(245,240,232,0.38)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(245,240,232,0.75)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,240,232,0.38)')}>
                  {s.l}
                </a>
              ))}
            </div>
          </div>
          <div>
            <form className="flex flex-col sm:flex-row gap-2.5 mb-3">
              <input type="email" placeholder="your@email.com" required className="input-dark flex-1"/>
              <button type="submit"
                className="btn px-6 py-3.5 rounded-full bg-white text-ink hover:bg-cream text-sm font-semibold shrink-0 whitespace-nowrap">
                Subscribe
              </button>
            </form>
            <p className="text-xs" style={{ color: 'rgba(245,240,232,0.30)' }}>Unsubscribe any time.</p>
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
          style={{ fontSize: 'clamp(1.65rem,3vw,2.5rem)', fontWeight: 400 }}>
          {title}
        </h2>
      </div>
      <Link href={href}
        className={[
          'hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold transition-colors',
          dark ? 'text-cream/45 hover:text-cream' : 'text-ink/45 hover:text-ink',
        ].join(' ')}>
        {cta}
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
        </svg>
      </Link>
    </div>
  );
}
