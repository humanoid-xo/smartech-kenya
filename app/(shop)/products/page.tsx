import { Suspense }        from 'react';
import { ProductList }     from '@/components/features/products/ProductList';
import { ProductFilters }  from '@/components/features/products/ProductFilters';
import { SearchBar }       from '@/components/features/search/SearchBar';

export const metadata = {
  title:       'All Products — Smartech Kenya',
  description: 'Browse our full range of electronics and home appliances.',
};

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  return (
    <div className="min-h-screen bg-[#f5f5f7]">

      {/* Page header */}
      <div className="bg-white border-b border-gray-100 py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="section-label mb-2">Smartech Kenya</p>
          <h1 className="section-title mb-6">All Products</h1>
          <div className="max-w-xl">
            <SearchBar />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar filters */}
          <aside className="w-full lg:w-64 shrink-0">
            <ProductFilters searchParams={searchParams} />
          </aside>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            <Suspense fallback={<ProductListLoading />}>
              <ProductList searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductListLoading() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {[...Array(9)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="aspect-square animate-shimmer-bg" />
          <div className="p-4 space-y-2.5">
            <div className="h-3 animate-shimmer-bg rounded-full w-1/3" />
            <div className="h-4 animate-shimmer-bg rounded-full" />
            <div className="h-5 animate-shimmer-bg rounded-full w-1/2 mt-1" />
          </div>
        </div>
      ))}
    </div>
  );
}
