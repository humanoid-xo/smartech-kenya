import { prisma }      from '@/lib/db/prisma';
import { ProductCard } from './ProductCard';
import Link            from 'next/link';

interface SearchParams { [key: string]: string | undefined }

// Map the legacy 'TECH' nav value to real Prisma enum values
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

    return {
      products: products.map(p => ({
        ...p,
        avgRating:   p.reviews.length > 0 ? p.reviews.reduce((s,r) => s + r.rating, 0) / p.reviews.length : 0,
        reviewCount: p.reviews.length,
      })),
      total,
      pages: Math.ceil(total / limit),
      page,
      error: null,
    };
  } catch (err: any) {
    console.error('ProductList DB error:', err?.message ?? err);
    return { products: [], total: 0, pages: 1, page: 1, error: err?.message ?? 'Database error' };
  }
}

export async function ProductList({ searchParams }: { searchParams: SearchParams }) {
  const { products, total, pages, page, error } = await getProducts(searchParams);

  /* ── DB / connection error ── */
  if (error) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-cream-warm">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
          <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          </svg>
        </div>
        <h3 className="font-semibold text-ink mb-1.5">Could not load products</h3>
        <p className="text-ink-faint text-sm mb-6 max-w-xs mx-auto leading-relaxed">
          We&apos;re having trouble connecting to our database. Please try again in a moment.
        </p>
        <Link href="/products" className="btn-dark px-6 py-3 inline-flex">Retry</Link>
      </div>
    );
  }

  /* ── Empty state ── */
  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-cream-warm">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cream-warm flex items-center justify-center">
          <svg className="w-7 h-7 text-cream-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  ? 'bg-ink text-cream'
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
