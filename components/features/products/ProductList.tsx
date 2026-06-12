import { listProducts }  from '@/lib/cloudinary';
import { ProductCard }   from './ProductCard';
import Link              from 'next/link';

interface SearchParams { [key: string]: string | undefined }

export async function ProductList({ searchParams }: { searchParams: SearchParams }) {
  const category    = searchParams.category;
  const subcategory = searchParams.subcategory;
  const brand       = searchParams.brand;
  const search      = searchParams.search ?? searchParams.q ?? searchParams.query;
  const featured    = searchParams.isFeatured === 'true' ? true : undefined;
  const minPrice    = searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined;
  const maxPrice    = searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined;
  const page        = Math.max(1, parseInt(searchParams.page ?? '1'));
  const limit       = 24;

  // Fetch all from Cloudinary (with brand/search pre-filters where possible)
  let products = await listProducts({ brand, search, featured });

  // Category filter — exact match against stored category value
  if (category) {
    products = products.filter((p: any) =>
      (p.category ?? '').toUpperCase() === category.toUpperCase()
    );
  }

  // Subcategory filter
  if (subcategory) {
    products = products.filter((p: any) =>
      (p.subcategory ?? '') === subcategory
    );
  }

  // Price filters
  if (minPrice !== undefined) products = products.filter((p: any) => p.price >= minPrice);
  if (maxPrice !== undefined && maxPrice > 0) products = products.filter((p: any) => p.price <= maxPrice);

  const total    = products.length;
  const pages    = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, pages);
  const slice    = products.slice((safePage - 1) * limit, safePage * limit);

  if (slice.length === 0) {
    return (
      <div className="text-center py-20 bg-white border border-gray-200">
        <div className="w-14 h-14 mx-auto mb-5 bg-gray-50 border border-gray-200 flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <h3 className="font-semibold text-gray-900 mb-2 text-base">No products found</h3>
        <p className="text-gray-500 text-sm mb-7">
          {search
            ? `No results for "${search}" — try different keywords`
            : 'Try adjusting your filters or browse all products'}
        </p>
        <Link href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: '#003A7A' }}>
          Browse all products
        </Link>
      </div>
    );
  }

  const buildUrl = (p: number) => {
    const params = new URLSearchParams(searchParams as Record<string, string>);
    params.set('page', String(p));
    return `/products?${params.toString()}`;
  };

  return (
    <div>
      {/* Result count */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-900">{total.toLocaleString()}</span>
          {' '}product{total !== 1 ? 's' : ''}
          {category && (
            <span className="ml-1 text-gray-400">
              in{' '}
              <span className="font-medium text-gray-700">
                {category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </span>
          )}
        </p>
        {pages > 1 && (
          <p className="text-xs text-gray-400">
            Page {safePage} of {pages}
          </p>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {slice.map((p: any) => <ProductCard key={p.id} product={p}/>)}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-1.5 flex-wrap pt-4 border-t border-gray-100">
          {safePage > 1 && (
            <Link href={buildUrl(safePage - 1)}
              className="px-4 h-9 flex items-center text-sm border border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-700 transition-all">
              ← Prev
            </Link>
          )}
          {Array.from({ length: Math.min(pages, 9) }, (_, i) => {
            // Show first, last, and window around current page
            const n = i + 1;
            const show = n === 1 || n === pages || Math.abs(n - safePage) <= 2;
            if (!show) return null;
            return (
              <Link key={n} href={buildUrl(n)}
                className={`w-9 h-9 flex items-center justify-center text-sm font-medium transition-all ${
                  n === safePage
                    ? 'text-white'
                    : 'bg-white border border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-700'
                }`}
                style={n === safePage ? { background: '#003A7A' } : {}}>
                {n}
              </Link>
            );
          })}
          {safePage < pages && (
            <Link href={buildUrl(safePage + 1)}
              className="px-4 h-9 flex items-center text-sm border border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-700 transition-all">
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
