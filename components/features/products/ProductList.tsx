import { prisma }      from '@/lib/db/prisma';
import { ProductCard } from './ProductCard';
import Link            from 'next/link';

interface SearchParams { [key: string]: string | undefined }

async function getProducts(searchParams: SearchParams) {
  const category  = searchParams.category as string | undefined;
  const minPrice  = searchParams.minPrice  ? parseFloat(searchParams.minPrice)  : undefined;
  const maxPrice  = searchParams.maxPrice  ? parseFloat(searchParams.maxPrice)  : undefined;
  const brand     = searchParams.brand;
  const search    = searchParams.search;
  const page      = parseInt(searchParams.page ?? '1');
  const limit     = 12;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { isActive: true };
  if (category) where.category = category;
  if (brand)    where.brand    = brand;
  if (search)   where.OR = [
    { name: { contains: search } },
    { brand: { contains: search } },
  ];
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

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
    products: products.map((p) => ({
      ...p,
      avgRating:   p.reviews.length > 0 ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length : 0,
      reviewCount: p.reviews.length,
    })),
    total,
    pages: Math.ceil(total / limit),
    page,
  };
}

export async function ProductList({ searchParams }: { searchParams: SearchParams }) {
  const { products, total, pages, page } = await getProducts(searchParams);

  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
        <div className="text-4xl mb-4">🔍</div>
        <h3 className="font-semibold text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-500 text-sm mb-6">Try adjusting your filters</p>
        <Link href="/products" className="btn-primary inline-flex">Clear filters</Link>
      </div>
    );
  }

  const buildPageUrl = (p: number) => {
    const params = new URLSearchParams(searchParams as Record<string, string>);
    params.set('page', String(p));
    return `/products?${params.toString()}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-900">{total}</span> products
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={buildPageUrl(p)}
              className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all ${
                p === page
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-100 text-gray-600 hover:border-gray-300'
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
