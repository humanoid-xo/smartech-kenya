import { Suspense }         from 'react';
import { ProductList }       from '@/components/features/products/ProductList';
import { ProductFilters }    from '@/components/features/products/ProductFilters';
import type { Metadata }     from 'next';

export const metadata: Metadata = { title: 'All Products — Smartech Kenya' };

export default function ProductsPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  return (
    <div className="min-h-screen bg-cream">
      {/* Page header */}
      <div className="bg-cream-warm border-b border-cream-warm/80 py-10 px-6">
        <div className="max-w-[1320px] mx-auto">
          <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-ink-muted mb-2">Smartech Kenya</p>
          <h1 className="font-display text-ink" style={{ fontSize: 'clamp(2.2rem,4.5vw,3.5rem)', fontWeight: 400 }}>
            All Products
          </h1>
        </div>
      </div>

      <div className="max-w-[1320px] mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 shrink-0">
          <ProductFilters searchParams={searchParams} />
        </aside>
        <div className="flex-1 min-w-0">
          <Suspense fallback={<GridSkeleton />}>
            <ProductList searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {[...Array(9)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden">
          <div className="aspect-[4/3] skeleton"/>
          <div className="p-4 space-y-2">
            <div className="h-3 skeleton w-1/3"/>
            <div className="h-4 skeleton"/>
            <div className="h-5 skeleton w-1/2"/>
          </div>
        </div>
      ))}
    </div>
  );
}
