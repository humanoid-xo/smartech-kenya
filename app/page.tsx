import Link            from 'next/link';
import Image           from 'next/image';
import { listProducts } from '@/lib/cloudinary';
import { ProductCard }  from '@/components/features/products/ProductCard';
import { CATEGORIES, POPULAR_BRANDS } from '@/constants/categories';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title:       'Smartech Kenya — Premium Electronics & Home Appliances Nairobi',
  description: "Kenya's curated destination for genuine electronics and home appliances. MIKA, Hisense, Samsung, HP. Fast Nairobi delivery.",
};

export default async function HomePage() {
  let featured: any[] = [], latest: any[] = [], kitchen: any[] = [];
  try {
    [featured, latest, kitchen] = await Promise.all([
      listProducts({ featured: true, limit: 12 }),
      listProducts({ limit: 10 }),
      listProducts({ category: 'KITCHEN', limit: 10 }),
    ]);
  } catch {
    // Cloudinary not configured yet — show empty homepage
  }

  return (
    <div className="bg-white">

      {/* ══ FEATURED PRODUCTS SLIDER ═══════════════════════════════════════ */}
      {featured.length > 0 && (
        <section className="py-14 px-6 bg-white">
          <div className="max-w-[1320px] mx-auto">
            <SectionHeader label="Hand-picked" title="Featured Products" href="/products?isFeatured=true" cta="View all"/>
            <SliderRow products={featured}/>
          </div>
        </section>
      )}

      {/* ══ TRUST STRIP ════════════════════════════════════════════════════ */}
      <section className="border-y border-gray-100 py-4 px-6 bg-white">
        <div className="max-w-[1320px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {[
              { icon: '✓',  title: 'Genuine Products',      sub: 'Authorised Kenyan distributors'        },
              { icon: '🚀', title: 'Fast Nairobi Delivery',  sub: 'Same-day or next-day'                  },
              { icon: '💬', title: 'WhatsApp Support',       sub: 'Order in minutes, no account needed'   },
              { icon: '🔒', title: 'After-sales Support',    sub: 'We stand behind every product'         },
            ].map(f => (
              <div key={f.title} className="px-6 py-3 flex items-center gap-3 first:pl-0">
                <span className="text-xl shrink-0">{f.icon}</span>
                <div>
                  <p className="text-[12px] font-semibold text-gray-900">{f.title}</p>
                  <p className="text-[11px] text-gray-500 leading-tight">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CATEGORY BUTTONS ═══════════════════════════════════════════════ */}
      <section className="py-10 px-6 bg-gray-50 border-b border-gray-100">
        <div className="max-w-[1320px] mx-auto">
          <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-5">Shop by Category</p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border border-gray-200
                         bg-white text-gray-700 hover:border-blue-400 hover:text-blue-700 transition-all"
            >
              All Products
            </Link>
            {CATEGORIES.map(cat => (
              <Link
                key={cat.value}
                href={`/products?category=${cat.value}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border border-gray-200
                           bg-white text-gray-700 hover:border-blue-400 hover:text-blue-700 transition-all"
              >
                {cat.label}
              </Link>
            ))}
            <Link
              href="/products?isFeatured=true"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold border text-white transition-all"
              style={{ background: '#E8A020', borderColor: '#E8A020' }}
            >
              🔥 Deals
            </Link>
          </div>
        </div>
      </section>

      {/* ══ PROMO BANNERS ══════════════════════════════════════════════════ */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-[1320px] mx-auto grid md:grid-cols-2 gap-4">
          {[
            {
              label: 'Home Appliances',
              href:  '/products?category=KITCHEN',
              headline: 'Upgrade Your Kitchen Today',
              sub: 'MIKA, Hisense, Ramtons & more',
              img: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=700&q=80',
            },
            {
              label: 'Tech Deals',
              href:  '/products?category=SMARTPHONES',
              headline: 'Latest Phones & Laptops',
              sub: 'Samsung, HP and top brands',
              img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=700&q=80',
            },
          ].map(b => (
            <Link key={b.label} href={b.href}
              className="group relative overflow-hidden flex items-center"
              style={{ minHeight: '200px', background: '#003A7A' }}>
              <div className="absolute right-0 top-0 bottom-0 w-[52%] hidden sm:block">
                <Image src={b.img} alt={b.label} fill sizes="340px"
                  className="object-cover opacity-25 group-hover:opacity-35 transition-opacity duration-500"/>
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(90deg, #003A7A 0%, rgba(0,58,122,0.85) 30%, rgba(0,58,122,0.10) 100%)' }}/>
              </div>
              <div className="relative p-8 z-10 max-w-[280px]">
                <p className="text-[9px] font-bold tracking-[0.18em] uppercase mb-2.5 text-blue-300">{b.label}</p>
                <h3 className="text-white text-xl font-semibold leading-tight mb-3">{b.headline}</h3>
                <p className="text-blue-200 text-xs mb-5">{b.sub}</p>
                <span className="inline-flex items-center gap-2 text-xs font-bold tracking-wide text-white border-b border-white/40 pb-0.5">
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

      {/* ══ HOME APPLIANCES SLIDER ═════════════════════════════════════════ */}
      {kitchen.length > 0 && (
        <section className="py-14 px-6 bg-gray-50">
          <div className="max-w-[1320px] mx-auto">
            <SectionHeader label="Mika · Hisense · Ramtons" title="Home Appliances" href="/products?category=KITCHEN" cta="Shop all appliances"/>
            <SliderRow products={kitchen}/>
          </div>
        </section>
      )}

      {/* ══ NEW ARRIVALS SLIDER ════════════════════════════════════════════ */}
      {latest.length > 0 && (
        <section className="py-14 px-6 bg-white">
          <div className="max-w-[1320px] mx-auto">
            <SectionHeader label="Just In" title="New Arrivals" href="/products" cta="View all"/>
            <SliderRow products={latest}/>
          </div>
        </section>
      )}

      {/* ══ BRAND LINKS ════════════════════════════════════════════════════ */}
      <section className="py-10 px-6 border-y border-gray-100 bg-gray-50">
        <div className="max-w-[1320px] mx-auto">
          <p className="text-center text-[9px] font-bold tracking-[0.22em] uppercase text-gray-400 mb-7">
            Authorised brands
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {POPULAR_BRANDS.map(b => (
              <Link key={b} href={`/products?brand=${encodeURIComponent(b)}`}
                className="text-base font-medium text-gray-400 hover:text-blue-700 transition-colors tracking-wide">
                {b}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ NEWSLETTER / CTA ═══════════════════════════════════════════════ */}
      <section className="py-20 px-6" style={{ background: '#003A7A' }}>
        <div className="max-w-[1320px] mx-auto grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-4 text-blue-300">
              Stay ahead
            </p>
            <h2 className="text-white text-3xl font-semibold mb-4 tracking-tight">
              Get the best deals first
            </h2>
            <p className="text-sm leading-relaxed text-blue-200 max-w-[320px]">
              New arrivals, exclusive offers and appliance news — no spam.
            </p>
            <div className="flex gap-6 mt-8">
              {[
                { label: 'WhatsApp',  href: 'https://wa.me/254746722417' },
                { label: 'Instagram', href: 'https://instagram.com/smartechkenya' },
                { label: 'TikTok',    href: 'https://tiktok.com/@smartechkenya' },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-semibold tracking-wide text-blue-300 hover:text-white transition-colors">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <form
              className="flex flex-col sm:flex-row gap-2.5 mb-3"
              onSubmit={e => e.preventDefault()}
            >
              <input type="email" placeholder="your@email.com" required className="input-dark flex-1"/>
              <button type="submit"
                className="flex-shrink-0 px-6 py-3.5 text-sm font-bold bg-white hover:bg-gray-50 transition-colors"
                style={{ color: '#003A7A' }}>
                Subscribe
              </button>
            </form>
            <p className="text-xs text-blue-300 opacity-60">Unsubscribe any time.</p>
          </div>
        </div>
      </section>

    </div>
  );
}

/* ── Shared helpers ──────────────────────────────────────── */
function SectionHeader({
  label, title, href, cta,
}: { label: string; title: string; href: string; cta: string }) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <p className="section-eyebrow mb-2">{label}</p>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">{title}</h2>
      </div>
      <Link href={href}
        className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700
                   hover:text-blue-900 transition-colors">
        {cta}
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
        </svg>
      </Link>
    </div>
  );
}

function SliderRow({ products }: { products: any[] }) {
  return (
    <div className="relative">
      <div className="products-slider">
        {products.map((p: any) => (
          <div key={p.id} className="shrink-0" style={{ width: 'clamp(190px, 21vw, 255px)' }}>
            <ProductCard product={p}/>
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16
                      bg-gradient-to-l from-white to-transparent"/>
    </div>
  );
}
