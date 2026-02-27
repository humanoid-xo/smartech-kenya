import { Suspense } from 'react';
import { ProductList } from '@/components/features/products/ProductList';
import { ProductFilters } from '@/components/features/products/ProductFilters';

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold mb-2">All Products</h1>
          <p className="text-gray-600">Discover our complete collection</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="font-bold text-lg mb-4">Filters</h2>
              <ProductFilters />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <Suspense fallback={<ProductsLoading />}>
              <ProductList searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductsLoading() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {[...Array(9)].map((_, i) => (
        <div key={i} className="card p-4">
          <div className="animate-shimmer h-64 rounded-lg mb-4" />
          <div className="animate-shimmer h-4 rounded mb-2" />
          <div className="animate-shimmer h-4 rounded w-2/3" />
        </div>
      ))}
    </div>
  );
}
