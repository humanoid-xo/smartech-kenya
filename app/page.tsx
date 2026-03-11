import Image   from 'next/image';
import Link    from 'next/link';
import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/features/products/ProductCard';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Smartech Kenya — Premium Tech & Home Appliances',
  description: "Kenya's definitive destination for electronics and home appliances. Fast Nairobi delivery.",
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

const CAT_ICONS = [
  { label: 'Fridges',          emoji: '🧊', href: '/products?category=KITCHEN&subcategory=fridges'          },
  { label: 'Washing Machines', emoji: '🫧', href: '/products?category=KITCHEN&subcategory=washing-machines' },
  { label: 'Water Dispensers', emoji: '💧', href: '/products?category=KITCHEN&subcategory=water-dispensers' },
  { label: 'Built-in Hobs',    emoji: '🔥', href: '/products?category=KITCHEN&subcategory=built-in'         },
  { label: 'Hoods',            emoji: '💨', href: '/products?category=KITCHEN&subcategory=built-in'         },
  { label: 'Smart TVs',        emoji: '📺', href: '/products?category=AUDIO_TV'                             },
  { label: 'Smartphones',      emoji: '📱', href: '/products?category=SMARTPHONES'                          },
  { label: 'Laptops',          emoji: '💻', href: '/products?category=LAPTOPS'                              },
  { label: 'Smart Home',       emoji: '🏠', href: '/products?category=SMART_HOME'                           },
  { label: 'Audio',            emoji: '🎵', href: '/products?category=AUDIO_TV&subcategory=audio'           },
];

const BRANDS = ['Mika','Hisense','Samsung','LG','Ramtons','HP','Bruhm','Nexus','Sony','Bosch'];

const PROMOS = [
  {
    label: 'Home Appliances',
    headline: 'Upgrade Your Kitchen Today',
    sub: 'Fridges, hobs, hoods and more',
    href: '/products?category=KITCHEN',
    bg: 'bg-ink',
    img: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&q=80',
    accent: '#4DC87A',
  },
  {
    label: 'Tech Deals',
    headline: 'Latest Phones and Laptops',
    sub: 'Samsung, HP and more brands',
    href: '/products?category=SMARTPHONES',
    bg: 'bg-forest-gradient',
    img: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&q=80',
    accent: '#F5F0E8',
  },
];

export default async function HomePage() {
  const [featured, latest, kitchen] = await Promise.all([
    getFeatured(),
    getLatest(),
    getByCategory('KITCHEN', 4),
  ]);

  return (
    <div className="bg-cream">

      {/* ANNOUNCEMENT BAR */}
      <div className="bg-ink text-cream/70 text-[11px] tracking-wide text-center py-2.5 px-4 font-medium">
        Free delivery within Nairobi &nbsp;·&nbsp;
        <a href="https://wa.me/254746722417" className="text-forest-400 hover:text-forest-300 transition-colors">
          WhatsApp +254 746 722 417
        </a>
        &nbsp;·&nbsp; Mon-Sat 8am-7pm
      </div>

      {/* HERO */}
      <section className="relative bg-forest-gradient overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px,#F5F0E8 1px,transparent 0)', backgroundSize: '28px 28px' }}/>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-forest-600/10 rounded-full blur-[160px] pointer-events-none"/>

        <div className="relative max-w-[1320px] mx-auto px-6 pt-16 pb-0 grid lg:grid-cols-2 gap-8 items-end">
          <div className="pb-16 lg:pb-24">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-forest-600/30 bg-forest-600/10 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-forest-400 animate-pulse"/>
              <span className="text-forest-400 text-[11px] font-semibold tracking-widest uppercase">New Arrivals Weekly</span>
            </div>

            <h1 className="font-display text-cream leading-[1.0] tracking-tight mb-6"
              style={{ fontSize: 'clamp(3.2rem,7vw,5.8rem)', fontWeight: 400 }}>
              Elevating Every<br/>
              <span className="italic" style={{ color: '#4DC87A' }}>Home</span>,<br/>
              One Appliance<br/>
              at a Time.
            </h1>

            <p className="text-cream/40 text-base leading-relaxed mb-10 max-w-sm">
              Kenya&apos;s curated selection of premium appliances and electronics,
              delivered fast to your door.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/products" className="btn-cream text-sm px-7 py-3.5">
                Shop All Products
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </Link>
              <a href="https://wa.me/254746722417?text=Hi%2C+I%27d+like+to+order+from+Smartech+Kenya"
                className="btn-outline-cream text-sm px-7 py-3.5 inline-flex items-center gap-2">
                Order via WhatsApp
              </a>
            </div>

            <div className="flex flex-wrap gap-6 mt-10 pt-10 border-t border-cream/[0.07]">
              {[
                { icon: 'checkmark', text: 'Genuine Products'     },
                { icon: 'truck',     text: 'Fast Nairobi Delivery' },
                { icon: 'chat',      text: 'WhatsApp Support'      },
              ].map(t => (
                <div key={t.text} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-forest-400"/>
                  <span className="text-cream/35 text-[11px] tracking-wide font-medium">{t.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero product showcase */}
          <div className="hidden lg:grid grid-cols-2 gap-3 pb-0 self-end">
            {[
              { href: '/products?category=KITCHEN&subcategory=fridges',
                img: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=500&q=80',
                label: 'Fridges', sub: 'No-Frost & Inverter', tall: true },
              { href: '/products?category=KITCHEN&subcategory=washing-machines',
                img: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500&q=80',
                label: 'Washing Machines', sub: 'Front & Top Load', tall: false },
              { href: '/products?category=KITCHEN&subcategory=water-dispensers',
                img: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=500&q=80',
                label: 'Water Dispensers', sub: 'Hot & Cold', tall: false },
            ].map(({ href, img, label, sub, tall }) => (
              <Link key={label} href={href}
                className={`group relative rounded-t-2xl overflow-hidden border border-cream/[0.08] hover:border-cream/20 transition-all duration-300 ${tall ? 'row-span-2' : ''}`}
                style={{ height: tall ? '420px' : '200px' }}>
                <Image src={img} alt={label} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"/>
                <div className="absolute bottom-4 left-4">
                  <p className="text-white font-semibold text-sm">{label}</p>
                  <p className="text-white/50 text-[11px]">{sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORY ICON STRIP */}
      <section className="bg-cream-warm border-b border-cream-warm/80 py-5">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {CAT_ICONS.map(c => (
              <Link key={c.label} href={c.href}
                className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl hover:bg-cream/60 transition-colors shrink-0 group">
                <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{c.emoji}</span>
                <span className="text-[10px] font-semibold text-ink/50 group-hover:text-ink transition-colors uppercase tracking-wide whitespace-nowrap">{c.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      {featured.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-[1320px] mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-forest-600 text-[11px] font-semibold tracking-widest uppercase mb-2">Hand-picked</p>
                <h2 className="font-display text-ink" style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 400 }}>
                  Featured Products
                </h2>
              </div>
              <Link href="/products" className="hidden sm:inline-flex items-center gap-1.5 text-sm text-ink-faint hover:text-ink transition-colors font-medium">
                View all
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.map(p => <ProductCard key={p.id} product={p as any}/>)}
            </div>
            <div className="flex justify-center mt-8 sm:hidden">
              <Link href="/products" className="btn-dark px-7 py-3">View All Products</Link>
            </div>
          </div>
        </section>
      )}

      {/* PROMO BANNERS */}
      <section className="py-10 px-6 bg-cream-warm">
        <div className="max-w-[1320px] mx-auto grid md:grid-cols-2 gap-5">
          {PROMOS.map(p => (
            <Link key={p.label} href={p.href}
              className={`group relative rounded-2xl overflow-hidden ${p.bg} flex items-center justify-between`}
              style={{ minHeight: '200px' }}>
              <div className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: 'radial-gradient(circle at 1px 1px,white 1px,transparent 0)', backgroundSize: '22px 22px' }}/>
              <div className="relative p-8 z-10 flex-1">
                <p className="text-[10px] font-semibold tracking-widest uppercase mb-2"
                  style={{ color: p.accent + '99' }}>{p.label}</p>
                <h3 className="font-display text-cream leading-tight mb-3"
                  style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 400 }}>
                  {p.headline}
                </h3>
                <p className="text-cream/40 text-sm mb-5">{p.sub}</p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold"
                  style={{ color: p.accent }}>
                  Shop Now
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </span>
              </div>
              <div className="relative w-[180px] h-[200px] shrink-0 hidden sm:block">
                <Image src={p.img} alt={p.label} fill className="object-cover opacity-40 group-hover:opacity-55 transition-opacity duration-500"/>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section className="py-16 px-6">
        <div className="max-w-[1320px] mx-auto">
          <div className="flex items-end justify-between mb-10">
            <h2 className="font-display text-ink" style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 400 }}>
              Shop by Category
            </h2>
            <Link href="/products" className="hidden sm:inline-flex items-center gap-1.5 text-sm text-ink-faint hover:text-ink transition-colors font-medium">
              All products
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { name: 'Fridges & Freezers',    href: '/products?category=KITCHEN&subcategory=fridges',
                img: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&q=80',  bg: 'bg-ink' },
              { name: 'Washing Machines',       href: '/products?category=KITCHEN&subcategory=washing-machines',
                img: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&q=80',  bg: 'bg-forest-gradient' },
              { name: 'Water Dispensers',       href: '/products?category=KITCHEN&subcategory=water-dispensers',
                img: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400&q=80',  bg: 'bg-ink' },
              { name: 'Built-in Hobs & Hoods',  href: '/products?category=KITCHEN&subcategory=built-in',
                img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80',     bg: 'bg-forest-gradient' },
              { name: 'Smart TVs',              href: '/products?category=AUDIO_TV',
                img: 'https://images.unsplash.com/photo-1593359677879-a4bb92f4834c?w=400&q=80',  bg: 'bg-ink' },
              { name: 'Smartphones',            href: '/products?category=SMARTPHONES',
                img: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&q=80',  bg: 'bg-forest-gradient' },
              { name: 'Laptops',                href: '/products?category=LAPTOPS',
                img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80',  bg: 'bg-ink' },
              { name: 'Smart Home',             href: '/products?category=SMART_HOME',
                img: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&q=80',     bg: 'bg-forest-gradient' },
            ].map(c => (
              <Link key={c.name} href={c.href}
                className={`group relative rounded-2xl overflow-hidden ${c.bg} hover:shadow-xl transition-all duration-300`}
                style={{ height: '160px' }}>
                <Image src={c.img} alt={c.name} fill className="object-cover opacity-30 group-hover:opacity-45 transition-opacity duration-500"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-semibold text-sm leading-tight">{c.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOME APPLIANCES */}
      {kitchen.length > 0 && (
        <section className="py-16 px-6 bg-ink">
          <div className="max-w-[1320px] mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-forest-400 text-[11px] font-semibold tracking-widest uppercase mb-2">Mika · Hisense · Ramtons</p>
                <h2 className="font-display text-cream" style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 400 }}>
                  Home Appliances
                </h2>
              </div>
              <Link href="/products?category=KITCHEN"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm text-cream/40 hover:text-cream transition-colors font-medium">
                View all
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {kitchen.map(p => <ProductCard key={p.id} product={p as any}/>)}
            </div>
          </div>
        </section>
      )}

      {/* NEW ARRIVALS */}
      {latest.length > 0 && (
        <section className="py-16 px-6 bg-cream-warm">
          <div className="max-w-[1320px] mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-forest-600 text-[11px] font-semibold tracking-widest uppercase mb-2">Just In</p>
                <h2 className="font-display text-ink" style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 400 }}>
                  New Arrivals
                </h2>
              </div>
              <Link href="/products?sort=newest"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm text-ink-faint hover:text-ink transition-colors font-medium">
                View all new
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {latest.map(p => <ProductCard key={p.id} product={p as any}/>)}
            </div>
          </div>
        </section>
      )}

      {/* WHY SMARTECH */}
      <section className="py-16 px-6 bg-cream">
        <div className="max-w-[1320px] mx-auto">
          <div className="grid md:grid-cols-4 gap-5">
            {[
              { icon: '🚚', title: 'Fast Nairobi Delivery',  desc: 'Same-day or next-day delivery within Nairobi CBD and suburbs.' },
              { icon: '✅', title: '100% Genuine Products',  desc: 'Every item sourced from authorised Kenyan distributors.' },
              { icon: '💬', title: 'WhatsApp Orders',        desc: 'Order instantly via WhatsApp — no account needed.' },
              { icon: '🔧', title: 'After-sales Support',    desc: 'We stand behind every product. Contact us post-purchase.' },
            ].map(f => (
              <div key={f.title} className="flex flex-col gap-3 p-6 rounded-2xl border border-cream-warm/80 bg-cream-warm/40 hover:border-cream-warm transition-colors">
                <span className="text-3xl">{f.icon}</span>
                <h3 className="font-semibold text-ink text-sm">{f.title}</h3>
                <p className="text-ink-faint text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BRANDS */}
      <section className="py-12 px-6 border-t border-cream-warm/60">
        <div className="max-w-[1320px] mx-auto">
          <p className="text-center text-[11px] font-semibold tracking-widest uppercase text-ink/30 mb-8">Brands we carry</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {BRANDS.map(b => (
              <Link key={b} href={`/products?brand=${b}`}
                className="font-display text-ink/25 hover:text-ink/60 transition-colors text-xl font-light tracking-wide">
                {b}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-20 px-6 bg-ink">
        <div className="max-w-[1320px] mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-forest-400 text-[11px] font-semibold tracking-widest uppercase mb-4">Stay ahead</p>
            <h2 className="font-display text-cream mb-4" style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 400 }}>
              Get the best deals first
            </h2>
            <p className="text-cream/35 text-sm leading-relaxed max-w-sm">
              New arrivals, exclusive offers and appliance news delivered weekly.
              No spam. Unsubscribe any time.
            </p>
          </div>
          <div>
            <form className="flex gap-2 mb-6">
              <input
                type="email" placeholder="your@email.com" required
                className="flex-1 min-w-0 px-5 py-3.5 rounded-full border border-cream/10 bg-cream/5 text-sm text-cream placeholder-cream/25 focus:outline-none focus:border-forest-600 transition-all"
              />
              <button type="submit" className="btn-forest px-6 py-3.5 rounded-full whitespace-nowrap text-sm">
                Subscribe
              </button>
            </form>
            <div className="flex flex-wrap gap-5">
              {[
                { href: 'https://wa.me/254746722417', label: 'WhatsApp' },
                { href: 'https://instagram.com/smartechkenya', label: 'Instagram' },
                { href: 'https://tiktok.com/@smartechkenya', label: 'TikTok' },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="text-cream/30 hover:text-cream/70 transition-colors text-sm font-medium">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
