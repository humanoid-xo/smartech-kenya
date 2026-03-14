import Image   from 'next/image';
import Link    from 'next/link';
import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/features/products/ProductCard';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Smartech Kenya — Premium Tech & Home Appliances Nairobi',
  description: "Kenya's curated destination for electronics and home appliances. MIKA, Hisense, Samsung, HP & more. Fast Nairobi delivery.",
};

/* ── Data fetchers ───────────────────────────────────────────────────────── */
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

async function getByCategory(category: string, take = 4) {
  try {
    const rows = await prisma.product.findMany({
      where: { isActive: true, category: category as any },
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
const CAT_ICONS = [
  { label: 'Fridges',          emoji: '🧊', href: '/products?category=KITCHEN&subcategory=fridges'          },
  { label: 'Washing Machines', emoji: '🫧', href: '/products?category=KITCHEN&subcategory=washing-machines' },
  { label: 'Water Dispensers', emoji: '💧', href: '/products?category=KITCHEN&subcategory=water-dispensers' },
  { label: 'Hobs',             emoji: '🔥', href: '/products?category=KITCHEN&subcategory=built-in'         },
  { label: 'Hoods',            emoji: '💨', href: '/products?category=KITCHEN&subcategory=built-in'         },
  { label: 'Cookers',          emoji: '🍳', href: '/products?category=KITCHEN&subcategory=cookers'          },
  { label: 'Microwaves',       emoji: '⚡', href: '/products?category=KITCHEN&subcategory=microwaves'       },
  { label: 'Smart TVs',        emoji: '📺', href: '/products?category=TECH&subcategory=smart-tvs'           },
  { label: 'Smartphones',      emoji: '📱', href: '/products?category=TECH&subcategory=phones'              },
  { label: 'Laptops',          emoji: '💻', href: '/products?category=TECH&subcategory=laptops'             },
  { label: 'Audio',            emoji: '🎵', href: '/products?category=TECH&subcategory=audio'               },
  { label: 'Smart Home',       emoji: '🏠', href: '/products?category=TECH&subcategory=smart-home'          },
];

const BRANDS = ['Mika','Hisense','Samsung','LG','Ramtons','HP','Von Hotpoint','Beko','Haier','TCL'];

const SHOP_CATS = [
  { name: 'Fridges & Freezers',   href: '/products?category=KITCHEN&subcategory=fridges',
    img: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=500&q=80',  dark: true  },
  { name: 'Washing Machines',     href: '/products?category=KITCHEN&subcategory=washing-machines',
    img: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500&q=80',  dark: false },
  { name: 'Water Dispensers',     href: '/products?category=KITCHEN&subcategory=water-dispensers',
    img: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=500&q=80',  dark: true  },
  { name: 'Built-in Hobs & Hoods',href: '/products?category=KITCHEN&subcategory=built-in',
    img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&q=80',    dark: false },
  { name: 'Smart TVs',            href: '/products?category=TECH&subcategory=smart-tvs',
    img: 'https://images.unsplash.com/photo-1593359677879-a4bb92f4834c?w=500&q=80', dark: true  },
  { name: 'Smartphones',          href: '/products?category=TECH&subcategory=phones',
    img: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&q=80', dark: false },
  { name: 'Laptops',              href: '/products?category=TECH&subcategory=laptops',
    img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80', dark: true  },
  { name: 'Small Appliances',     href: '/products?category=KITCHEN&subcategory=small-appliances',
    img: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&q=80', dark: false },
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

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-forest-gradient overflow-hidden" style={{ minHeight: '88vh' }}>
        <div className="absolute inset-0 dot-grid"/>
        <div className="absolute -top-40 right-0 w-[700px] h-[700px] bg-forest-600/[0.08] rounded-full blur-[180px] pointer-events-none"/>
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-forest-400/[0.05] rounded-full blur-[120px] pointer-events-none"/>

        <div className="relative max-w-[1320px] mx-auto px-6 pt-20 pb-0 grid lg:grid-cols-2 gap-8 items-end h-full">
          {/* ── Copy ── */}
          <div className="pb-20 lg:pb-28">

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-forest-500/25 bg-forest-600/[0.12] mb-9">
              <span className="w-1.5 h-1.5 rounded-full bg-forest-400 animate-pulse"/>
              <span className="text-forest-300 text-[10px] font-semibold tracking-[0.14em] uppercase">New Arrivals Weekly</span>
            </div>

            <h1
              className="font-display text-cream tracking-tight mb-7"
              style={{ fontSize: 'clamp(3rem, 6.5vw, 5.5rem)', fontWeight: 400, lineHeight: 1.02 }}
            >
              Elevating Every<br/>
              <em style={{ color: '#4DC87A', fontStyle: 'italic' }}>Home</em>,<br/>
              One Appliance<br/>
              at a Time.
            </h1>

            <p className="text-cream/38 text-base leading-relaxed mb-10 max-w-[340px]">
              Kenya&apos;s curated selection of premium appliances and
              electronics — delivered fast to your door.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              <Link href="/products" className="btn-cream text-sm px-7 py-3.5">
                Shop All Products
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </Link>
              <a
                href="https://wa.me/254746722417?text=Hi%20Smartech%20Kenya%2C%20I%27d%20like%20to%20order"
                className="btn-outline-cream text-sm px-7 py-3.5"
              >
                Order via WhatsApp
              </a>
            </div>

            {/* Trust strip */}
            <div className="flex flex-wrap gap-x-7 gap-y-2.5 pt-8 border-t border-cream/[0.08]">
              {[
                'Genuine Products Only',
                'Fast Nairobi Delivery',
                'WhatsApp Support 7 Days',
              ].map(t => (
                <div key={t} className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-forest-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                  </svg>
                  <span className="text-cream/30 text-[11px] font-medium tracking-wide">{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Product showcase ── */}
          <div className="hidden lg:grid grid-cols-2 gap-3 self-end">
            {[
              { href: '/products?category=KITCHEN&subcategory=fridges',
                img: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&q=80',
                label: 'Fridges',           sub: 'No-Frost & Inverter', h: 'h-[430px]', span: 'row-span-2' },
              { href: '/products?category=KITCHEN&subcategory=washing-machines',
                img: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&q=80',
                label: 'Washing Machines',  sub: 'Front & Top Load',    h: 'h-[205px]', span: '' },
              { href: '/products?category=KITCHEN&subcategory=water-dispensers',
                img: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=600&q=80',
                label: 'Water Dispensers',  sub: 'Hot, Normal & Cold',  h: 'h-[205px]', span: '' },
            ].map(c => (
              <Link key={c.label} href={c.href}
                className={`group relative rounded-t-2xl overflow-hidden border border-cream/[0.07] hover:border-cream/[0.18] transition-all duration-300 ${c.span} ${c.h}`}>
                <Image src={c.img} alt={c.label} fill
                  sizes="(max-width: 1024px) 0vw, 20vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent"/>
                <div className="absolute bottom-4 left-4">
                  <p className="text-white font-semibold text-sm leading-tight">{c.label}</p>
                  <p className="text-white/45 text-[11px] mt-0.5">{c.sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORY QUICK-NAV ───────────────────────────────────────────── */}
      <section className="bg-white border-b border-cream-warm sticky top-[64px] z-30 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="max-w-[1320px] mx-auto px-4">
          <div className="flex items-center gap-0.5 overflow-x-auto hide-scrollbar py-1">
            {CAT_ICONS.map(c => (
              <Link key={c.label} href={c.href}
                className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl hover:bg-cream-warm/70 transition-colors shrink-0 group">
                <span className="text-[22px] leading-none group-hover:scale-110 transition-transform duration-200 select-none">
                  {c.emoji}
                </span>
                <span className="text-[9.5px] font-semibold text-ink/40 group-hover:text-ink/70 transition-colors uppercase tracking-[0.1em] whitespace-nowrap">
                  {c.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-[1320px] mx-auto">
            <SectionHeader
              label="Hand-picked"
              title="Featured Products"
              href="/products"
              hrefLabel="View all"
            />
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
      <section className="py-6 px-6 bg-cream-warm/50">
        <div className="max-w-[1320px] mx-auto grid md:grid-cols-2 gap-4">
          {[
            {
              label: 'Home Appliances', href: '/products?category=KITCHEN',
              headline: 'Upgrade Your Kitchen Today',
              sub: 'MIKA, Hisense, Ramtons & more',
              img: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&q=80',
              bg: '#0C0C0C', accent: '#4DC87A',
            },
            {
              label: 'Tech Deals', href: '/products?category=TECH',
              headline: 'Latest Phones & Laptops',
              sub: 'Samsung, HP, and top brands',
              img: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&q=80',
              bg: '#102A17', accent: '#F5F0E8',
            },
          ].map(p => (
            <Link key={p.label} href={p.href}
              className="group relative rounded-2xl overflow-hidden flex items-center justify-between"
              style={{ backgroundColor: p.bg, minHeight: '196px' }}>
              <div className="absolute inset-0 dot-grid opacity-60"/>
              <div className="relative p-7 z-10 flex-1">
                <p className="text-[9.5px] font-bold tracking-[0.15em] uppercase mb-2.5"
                  style={{ color: p.accent + 'aa' }}>{p.label}</p>
                <h3 className="font-display text-cream leading-tight mb-2.5"
                  style={{ fontSize: 'clamp(1.5rem,2.8vw,2rem)', fontWeight: 400 }}>
                  {p.headline}
                </h3>
                <p className="text-cream/35 text-xs mb-5 font-medium">{p.sub}</p>
                <span className="inline-flex items-center gap-2 text-xs font-bold tracking-wide"
                  style={{ color: p.accent }}>
                  Shop Now
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </span>
              </div>
              <div className="relative w-[170px] h-[196px] shrink-0 hidden sm:block overflow-hidden">
                <Image src={p.img} alt={p.label} fill
                  sizes="170px"
                  className="object-cover opacity-35 group-hover:opacity-50 transition-opacity duration-500 group-hover:scale-[1.04] transition-transform"/>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── SHOP BY CATEGORY ─────────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-[1320px] mx-auto">
          <SectionHeader
            label="Browse"
            title="Shop by Category"
            href="/products"
            hrefLabel="All products"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {SHOP_CATS.map(c => (
              <Link key={c.name} href={c.href}
                className="group relative rounded-2xl overflow-hidden hover:-translate-y-0.5 transition-all duration-300 hover:shadow-xl"
                style={{ height: '162px', backgroundColor: c.dark ? '#0C0C0C' : '#102A17' }}>
                <Image src={c.img} alt={c.name} fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover opacity-28 group-hover:opacity-40 transition-opacity duration-500"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent"/>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-semibold text-sm leading-snug">{c.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOME APPLIANCES SPOTLIGHT ────────────────────────────────────── */}
      {kitchen.length > 0 && (
        <section className="py-16 px-6 bg-ink">
          <div className="max-w-[1320px] mx-auto">
            <SectionHeader
              label="Mika · Hisense · Ramtons"
              title="Home Appliances"
              href="/products?category=KITCHEN"
              hrefLabel="View all"
              dark
            />
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
            <SectionHeader
              label="Just In"
              title="New Arrivals"
              href="/products?sort=newest"
              hrefLabel="View all new"
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {latest.map(p => <ProductCard key={p.id} product={p as any}/>)}
            </div>
          </div>
        </section>
      )}

      {/* ── WHY SMARTECH ─────────────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-cream">
        <div className="max-w-[1320px] mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
                  </svg>
                ),
                title: 'Fast Nairobi Delivery',
                desc: 'Same-day or next-day delivery within Nairobi CBD and suburbs.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                  </svg>
                ),
                title: '100% Genuine Products',
                desc: 'Every item sourced directly from authorised Kenyan distributors.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.557 4.126 1.526 5.855L.055 23.266l5.533-1.448A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.928 0-3.736-.518-5.29-1.42l-.378-.224-3.93 1.028 1.046-3.818-.246-.393A9.965 9.965 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                  </svg>
                ),
                title: 'WhatsApp Orders',
                desc: 'Order instantly via WhatsApp — no account needed, no fuss.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/>
                  </svg>
                ),
                title: 'After-sales Support',
                desc: 'We stand behind every product. Reach us any time post-purchase.',
              },
            ].map(f => (
              <div key={f.title}
                className="flex flex-col gap-4 p-6 rounded-2xl border border-cream-warm bg-white/60 hover:bg-white hover:border-cream-warm/80 hover:shadow-sm transition-all duration-200">
                <div className="w-11 h-11 rounded-xl bg-forest-600/10 flex items-center justify-center text-forest-600">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-ink text-sm mb-1.5">{f.title}</h3>
                  <p className="text-ink-faint text-xs leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BRANDS ───────────────────────────────────────────────────────── */}
      <section className="py-12 px-6 border-t border-cream-warm/70">
        <div className="max-w-[1320px] mx-auto">
          <p className="text-center text-[9.5px] font-bold tracking-[0.18em] uppercase text-ink/20 mb-8">
            Brands we carry
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-9 gap-y-3">
            {BRANDS.map(b => (
              <Link key={b} href={`/products?brand=${b}`}
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
            <p className="section-label text-forest-400 mb-4">Stay ahead</p>
            <h2 className="font-display text-cream mb-4"
              style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 400 }}>
              Get the best deals first
            </h2>
            <p className="text-cream/30 text-sm leading-relaxed max-w-[320px]">
              New arrivals, exclusive offers and appliance news delivered
              weekly. No spam — unsubscribe any time.
            </p>
            <div className="flex gap-4 mt-8">
              {[
                { href: 'https://wa.me/254746722417',        label: 'WhatsApp'  },
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
              <input
                type="email"
                placeholder="your@email.com"
                required
                className="input-dark flex-1"
              />
              <button type="submit" className="btn-forest px-6 py-3.5 rounded-full whitespace-nowrap text-sm shrink-0">
                Subscribe
              </button>
            </form>
            <p className="text-cream/18 text-xs mt-3">
              Join 2,000+ Kenyans getting the best deals first.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}

/* ── Reusable section header ─────────────────────────────────────────────── */
function SectionHeader({
  label, title, href, hrefLabel, dark = false,
}: {
  label: string; title: string; href: string; hrefLabel: string; dark?: boolean;
}) {
  return (
    <div className="flex items-end justify-between mb-10">
      <div>
        <p className={`text-[10px] font-bold tracking-[0.14em] uppercase mb-2 ${dark ? 'text-forest-400' : 'text-forest-600'}`}>
          {label}
        </p>
        <h2
          className={`font-display ${dark ? 'text-cream' : 'text-ink'}`}
          style={{ fontSize: 'clamp(1.7rem, 3.2vw, 2.6rem)', fontWeight: 400 }}
        >
          {title}
        </h2>
      </div>
      <Link
        href={href}
        className={[
          'hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold transition-colors tracking-wide',
          dark ? 'text-cream/35 hover:text-cream' : 'text-ink-faint hover:text-ink',
        ].join(' ')}
      >
        {hrefLabel}
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
        </svg>
      </Link>
    </div>
  );
}
