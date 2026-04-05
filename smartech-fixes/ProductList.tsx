import { prisma }         from '@/lib/db/prisma';
import { ProductCard }    from './ProductCard';
import { STATIC_PRODUCTS } from '@/constants/staticProducts';
import Link               from 'next/link';

interface SearchParams { [key: string]: string | undefined }

const TECH_ENUMS = ['SMARTPHONES','LAPTOPS','AUDIO_TV','SMART_HOME','ELECTRICAL','BEDROOM'];

async function getProducts(sp: SearchParams) {
  const category    = sp.category;
  const subcategory = sp.subcategory;
  const minPrice    = sp.minPrice  ? parseFloat(sp.minPrice)  : undefined;
  const maxPrice    = sp.maxPrice  ? parseFloat(sp.maxPrice)  : undefined;
  const brand       = sp.brand;
  const search      = sp.search;
  const page        = parseInt(sp.page ?? '1');
  const limit       = 12;

  const where: any = { isActive: true };

  if (category === 'TECH') {
    where.category = { in: TECH_ENUMS };
  } else if (category) {
    where.category = category;
  }

  if (subcategory) where.subcategory = subcategory;
  if (brand)       where.brand       = brand;

  if (search) {
    where.OR = [
      { name:        { contains: search, mode: 'insensitive' } },
      { brand:       { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  try {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          reviews: { select: { rating: true } },
          seller:  { select: { id: true, name: true } },
        },
        skip:    (page - 1) * limit,
        take:    limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    const mapped = products.map(p => ({
      ...p,
      avgRating:   p.reviews.length > 0 ? p.reviews.reduce((s,r) => s + r.rating, 0) / p.reviews.length : 0,
      reviewCount: p.reviews.length,
    }));

    if (mapped.length > 0) {
      return { products: mapped, total, pages: Math.ceil(total / limit), page, isStatic: false };
    }

    // DB returned nothing — fall through to static
    throw new Error('empty');
  } catch {
    // ── Static fallback ──
    let filtered = [...STATIC_PRODUCTS];

    if (category === 'TECH') {
      filtered = filtered.filter(p => TECH_ENUMS.includes(p.category));
    } else if (category) {
      filtered = filtered.filter(p => p.category === category);
    }
    if (subcategory) filtered = filtered.filter(p => p.subcategory === subcategory);
    if (brand)       filtered = filtered.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      );
    }
    if (minPrice !== undefined) filtered = filtered.filter(p => p.price >= minPrice);
    if (maxPrice !== undefined) filtered = filtered.filter(p => p.price <= (maxPrice!));

    const start   = (page - 1) * limit;
    const sliced  = filtered.slice(start, start + limit);
    const total   = filtered.length;

    return {
      products:  sliced as any[],
      total,
      pages:     Math.ceil(total / limit),
      page,
      isStatic:  true,
    };
  }
}

export async function ProductList({ searchParams }: { searchParams: SearchParams }) {
  const { products, total, pages, page } = await getProducts(searchParams);

  /* ── Empty state ── */
  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-cream-warm">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-50 flex items-center justify-center">
          <svg className="w-7 h-7 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <h3 className="font-semibold text-ink mb-1.5">No products found</h3>
        <p className="text-ink-faint text-sm mb-6">Try adjusting your filters or browse all products</p>
        <Link href="/products" className="btn-dark px-6 py-3 inline-flex">Clear filters</Link>
      </div>
    );
  }

  const buildPageUrl = (p: number) => {
    const params = new URLSearchParams(searchParams as Record<string,string>);
    params.set('page', String(p));
    return `/products?${params.toString()}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-ink-faint">
          <span className="font-semibold text-ink">{total}</span> product{total !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {products.map(p => <ProductCard key={p.id} product={p as any}/>)}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          {page > 1 && (
            <Link href={buildPageUrl(page - 1)}
              className="px-3 h-9 flex items-center justify-center rounded-xl text-sm border border-cream-warm text-ink-muted hover:border-ink/20 hover:text-ink transition-all">
              &#8592;
            </Link>
          )}
          {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
            <Link key={p} href={buildPageUrl(p)}
              className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all ${
                p === page
                  ? 'bg-[#6D28D9] text-white'
                  : 'bg-white border border-cream-warm text-ink-muted hover:border-ink/20 hover:text-ink'
              }`}>
              {p}
            </Link>
          ))}
          {page < pages && (
            <Link href={buildPageUrl(page + 1)}
              className="px-3 h-9 flex items-center justify-center rounded-xl text-sm border border-cream-warm text-ink-muted hover:border-ink/20 hover:text-ink transition-all">
              &#8594;
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
