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

/* ── Fetchers ─────────────────────────────────────────────────────────────── */
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

async function getByCategory(cat: string, take = 4) {
  try {
    const rows = await prisma.product.findMany({
      where: { isActive: true, category: cat as any },
      include: { reviews: { select: { rating: true } } },
      take, orderBy: { createdAt: 'desc' },
    });
    return rows.map(p => ({
      ...p,
      avgRating:   p.reviews.length > 0 ? p.reviews.reduce((s,r)=>s+r.rating,0)/p.reviews.length : 0,
      reviewCount: p.reviews.length,
    }));
  } catch { return []; }
}

/* ── Static data ─────────────────────────────────────────────────────────── */
const CATS = [
  { label: 'Fridges',          href: '/products?category=KITCHEN&subcategory=fridges'          },
  { label: 'Washing Machines', href: '/products?category=KITCHEN&subcategory=washing-machines' },
  { label: 'Water Dispensers', href: '/products?category=KITCHEN&subcategory=water-dispensers' },
  { label: 'Built-in Hobs',    href: '/products?category=KITCHEN&subcategory=built-in'         },
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
  { name: 'Fridges & Freezers',   href: '/products?category=KITCHEN&subcategory=fridges',
    img: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&q=80'  },
  { name: 'Washing Machines',     href: '/products?category=KITCHEN&subcategory=washing-machines',
    img: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&q=80'  },
  { name: 'Water Dispensers',     href: '/products?category=KITCHEN&subcategory=water-dispensers',
    img: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=600&q=80'  },
  { name: 'Built-in Hobs & Hoods',href: '/products?category=KITCHEN&subcategory=built-in',
    img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80'     },
  { name: 'Smart TVs',            href: '/products?category=AUDIO_TV',
    img: 'https://images.unsplash.com/photo-1593359677879-a4bb92f4834c?w=600&q=80'  },
  { name: 'Smartphones',          href: '/products?category=SMARTPHONES',
    img: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&q=80'  },
  { name: 'Laptops',              href: '/products?category=LAPTOPS',
    img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80'  },
  { name: 'Small Appliances',     href: '/products?category=KITCHEN&subcategory=small-appliances',
    img: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80'  },
];

/* ═══════════════════════════════════════════════════════════════════════════ */
export default async function HomePage() {
  const [featured, latest, kitchen] = await Promise.all([
    getFeatured(),
    getLatest(),
    getByCategory('KITCHEN', 4),
  ]);

  return (
    <div className="bg-cream">

      {/* ── HERO — full bleed background image ────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: '88vh' }}>

        {/* Background image */}
        <Image
          src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&q=80"
          alt="Modern kitchen appliances"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Gradient overlay — left side darker for text legibility */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(105deg, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.65) 55%, rgba(10,10,10,0.15) 100%)' }}/>

        <div className="relative max-w-[1320px] mx-auto px-6 flex items-end pb-20 lg:pb-28" style={{ minHeight: '88vh' }}>
          <div className="max-w-[580px]">

            <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/45 mb-6">
              Nairobi&apos;s Appliance Store
            </p>

            <h1 className="font-display text-white tracking-tight mb-6"
              style={{ fontSize: 'clamp(3rem,6.5vw,5.5rem)', fontWeight: 400, lineHeight: 1.02 }}>
              Elevating Every Home,<br/>
              One Appliance<br/>
              at a Time.
            </h1>

            <p className="text-white/50 text-base leading-relaxed mb-10 max-w-[400px]">
              Kenya&apos;s curated selection of premium home appliances and
              electronics — delivered fast to your door.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              <Link href="/products" className="btn-dark bg-white text-ink hover:bg-cream text-sm px-8 py-3.5">
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

            {/* Trust strip */}
            <div className="flex flex-wrap gap-x-7 gap-y-2 pt-8 border-t border-white/[0.12]">
              {['Genuine Products Only', 'Fast Nairobi Delivery', 'WhatsApp Support 7 Days'].map(t => (
                <div key={t} className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 shrink-0" style={{ color: '#C4872C' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                  </svg>
                  <span className="text-white/35 text-[11px] font-medium tracking-wide">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORY QUICK-NAV (text only, no emoji) ─────────────────────── */}
      <section className="bg-white border-b border-cream-warm sticky top-[64px] z-30 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="max-w-[1320px] mx-auto px-4">
          <div className="flex items-center overflow-x-auto hide-scrollbar">
            {CATS.map(c => (
              <Link key={c.label} href={c.href}
                className="flex items-center px-4 py-4 shrink-0 text-[11.5px] font-semibold text-ink/45
                           hover:text-ink transition-colors whitespace-nowrap border-b-2 border-transparent
                           hover:border-ink/20 tracking-wide">
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-[1320px] mx-auto">
            <SectionHeader label="Hand-picked" title="Featured Products" href="/products" hrefLabel="View all"/>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.map(p => <ProductCard key={p.id} product={p as any}/>)}
            </div>
            <div className="flex justify-center mt-8 sm:hidden">
              <Link href="/products" className="btn-dark px-7 py-3.5">View All Products</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── PROMO BANNERS ────────────────────────────────────────────────── */}
      <section className="py-6 px-6 bg-cream-warm/40">
        <div className="max-w-[1320px] mx-auto grid md:grid-cols-2 gap-4">
          {[
            {
              label:    'Home Appliances',
              headline: 'Upgrade Your Kitchen Today',
              sub:      'MIKA, Hisense, Ramtons & more',
              href:     '/products?category=KITCHEN',
              img:      'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=700&q=80',
            },
            {
              label:    'Tech Deals',
              headline: 'Latest Phones & Laptops',
              sub:      'Samsung, HP and top brands',
              href:     '/products?category=SMARTPHONES',
              img:      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=700&q=80',
            },
          ].map(p => (
            <Link key={p.label} href={p.href}
              className="group relative rounded-2xl overflow-hidden bg-ink flex items-center justify-between"
              style={{ minHeight: '200px' }}>
              <div className="absolute inset-0 dot-grid"/>
              {/* Right bg image */}
              <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden sm:block">
                <Image src={p.img} alt={p.label} fill sizes="350px"
                  className="object-cover opacity-30 group-hover:opacity-42 transition-opacity duration-500"/>
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #0C0C0C 0%, transparent 100%)' }}/>
              </div>
              <div className="relative p-7 z-10 max-w-[280px]">
                <p className="text-[9.5px] font-bold tracking-[0.16em] uppercase text-white/35 mb-2.5">{p.label}</p>
                <h3 className="font-display text-white leading-tight mb-2.5"
                  style={{ fontSize: 'clamp(1.5rem,2.8vw,2rem)', fontWeight: 400 }}>
                  {p.headline}
                </h3>
                <p className="text-white/35 text-xs mb-5 font-medium">{p.sub}</p>
                <span className="inline-flex items-center gap-2 text-xs font-bold tracking-wide"
                  style={{ color: '#C4872C' }}>
                  Shop Now
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── SHOP BY CATEGORY ─────────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-[1320px] mx-auto">
          <SectionHeader label="Browse" title="Shop by Category" href="/products" hrefLabel="All products"/>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {SHOP_CATS.map(c => (
              <Link key={c.name} href={c.href}
                className="group relative rounded-2xl overflow-hidden bg-ink hover:-translate-y-0.5 transition-all duration-300 hover:shadow-xl"
                style={{ height: '160px' }}>
                <Image src={c.img} alt={c.name} fill sizes="(max-width:768px) 50vw, 25vw"
                  className="object-cover opacity-30 group-hover:opacity-42 transition-opacity duration-500"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent"/>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-semibold text-sm leading-snug">{c.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOME APPLIANCES ──────────────────────────────────────────────── */}
      {kitchen.length > 0 && (
        <section className="py-16 px-6 bg-ink">
          <div className="max-w-[1320px] mx-auto">
            <SectionHeader label="Mika · Hisense · Ramtons" title="Home Appliances"
              href="/products?category=KITCHEN" hrefLabel="View all" dark/>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {kitchen.map(p => <ProductCard key={p.id} product={p as any}/>)}
            </div>
          </div>
        </section>
      )}

      {/* ── NEW ARRIVALS ─────────────────────────────────────────────────── */}
      {latest.length > 0 && (
        <section className="py-16 px-6 bg-cream-warm/40">
          <div className="max-w-[1320px] mx-auto">
            <SectionHeader label="Just In" title="New Arrivals" href="/products" hrefLabel="View all new"/>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {latest.map(p => <ProductCard key={p.id} product={p as any}/>)}
            </div>
          </div>
        </section>
      )}

      {/* ── WHY SMARTECH ─────────────────────────────────────────────────── */}
      <section className="py-14 px-6 bg-cream">
        <div className="max-w-[1320px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Fast Nairobi Delivery',  desc: 'Same-day or next-day delivery within Nairobi.' },
            { title: '100% Genuine Products',  desc: 'Sourced directly from authorised Kenyan distributors.' },
            { title: 'WhatsApp Orders',        desc: 'Order instantly via WhatsApp — no account needed.' },
            { title: 'After-sales Support',    desc: 'We stand behind every product post-purchase.' },
          ].map((f, i) => (
            <div key={f.title}
              className="p-6 rounded-2xl border border-cream-warm bg-white/60 hover:bg-white hover:shadow-sm transition-all duration-200">
              <div className="w-8 h-8 rounded-lg mb-4 flex items-center justify-center"
                style={{ background: 'rgba(139,90,26,0.12)' }}>
                <span className="font-display text-sm font-semibold" style={{ color: '#8B5A1A' }}>0{i+1}</span>
              </div>
              <h3 className="font-semibold text-ink text-sm mb-1.5">{f.title}</h3>
              <p className="text-ink-faint text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BRANDS ───────────────────────────────────────────────────────── */}
      <section className="py-12 px-6 border-t border-cream-warm/60">
        <div className="max-w-[1320px] mx-auto">
          <p className="text-center text-[9.5px] font-bold tracking-[0.18em] uppercase text-ink/20 mb-8">
            Brands we carry
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-9 gap-y-3">
            {BRANDS.map(b => (
              <Link key={b} href={`/products?brand=${encodeURIComponent(b)}`}
                className="font-display text-xl font-light text-ink/20 hover:text-ink/55 transition-colors tracking-wide">
                {b}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ───────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-ink">
        <div className="max-w-[1320px] mx-auto grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p className="text-[10px] font-bold tracking-[0.16em] uppercase mb-4" style={{ color: '#C4872C' }}>
              Stay ahead
            </p>
            <h2 className="font-display text-cream mb-4"
              style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 400 }}>
              Get the best deals first
            </h2>
            <p className="text-cream/30 text-sm leading-relaxed max-w-[320px]">
              New arrivals, exclusive offers and appliance news delivered weekly.
              No spam — unsubscribe any time.
            </p>
            <div className="flex gap-5 mt-8">
              {[
                { href: 'https://wa.me/254746722417',          label: 'WhatsApp'  },
                { href: 'https://instagram.com/smartechkenya', label: 'Instagram' },
                { href: 'https://tiktok.com/@smartechkenya',   label: 'TikTok'    },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="text-cream/25 hover:text-cream/60 transition-colors text-xs font-semibold tracking-wide">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <form className="flex flex-col sm:flex-row gap-2.5">
              <input type="email" placeholder="your@email.com" required className="input-dark flex-1"/>
              <button type="submit" className="btn-dark bg-white text-ink hover:bg-cream px-6 py-3.5 rounded-full whitespace-nowrap text-sm shrink-0">
                Subscribe
              </button>
            </form>
            <p className="text-cream/18 text-xs mt-3">Join Kenyans getting the best deals first.</p>
          </div>
        </div>
      </section>

    </div>
  );
}

function SectionHeader({ label, title, href, hrefLabel, dark = false }: {
  label: string; title: string; href: string; hrefLabel: string; dark?: boolean;
}) {
  return (
    <div className="flex items-end justify-between mb-10">
      <div>
        <p className={`text-[10px] font-bold tracking-[0.15em] uppercase mb-2`}
          style={{ color: dark ? '#C4872C' : '#8B5A1A' }}>
          {label}
        </p>
        <h2 className={`font-display ${dark ? 'text-cream' : 'text-ink'}`}
          style={{ fontSize: 'clamp(1.7rem,3.2vw,2.6rem)', fontWeight: 400 }}>
          {title}
        </h2>
      </div>
      <Link href={href}
        className={[
          'hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold transition-colors tracking-wide',
          dark ? 'text-cream/35 hover:text-cream' : 'text-ink-faint hover:text-ink',
        ].join(' ')}>
        {hrefLabel}
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
        </svg>
      </Link>
    </div>
  );
}
