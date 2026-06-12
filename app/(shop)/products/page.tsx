import { Suspense }         from 'react';
import { ProductList }      from '@/components/features/products/ProductList';
import { ProductFilters }   from '@/components/features/products/ProductFilters';
import { CATEGORIES }       from '@/constants/categories';
import Link                 from 'next/link';
import type { Metadata }    from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}): Promise<Metadata> {
  const catDef = CATEGORIES.find(c => c.value === searchParams.category);
  const title  = catDef
    ? `${catDef.label} — Smartech Kenya`
    : searchParams.search
      ? `Search: "${searchParams.search}" — Smartech Kenya`
      : 'All Products — Smartech Kenya';
  return { title };
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const catDef   = CATEGORIES.find(c => c.value === searchParams.category);
  const subDef   = catDef?.subcategories.find(s => s.slug === searchParams.subcategory);
  const isFeatured = searchParams.isFeatured === 'true';

  const heading = subDef?.name
    ?? catDef?.label
    ?? (searchParams.search ? `"${searchParams.search}"` : null)
    ?? (isFeatured ? 'Featured Deals' : 'All Products');

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Page header */}
      <div className="bg-white border-b border-gray-200 py-8 px-6">
        <div className="max-w-[1320px] mx-auto">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
            <Link href="/" className="hover:text-gray-700 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-gray-700 transition-colors">Products</Link>
            {catDef && (
              <>
                <span>/</span>
                <Link href={`/products?category=${catDef.value}`}
                  className="hover:text-gray-700 transition-colors">
                  {catDef.label}
                </Link>
              </>
            )}
            {subDef && (
              <>
                <span>/</span>
                <span className="text-gray-700">{subDef.name}</span>
              </>
            )}
          </nav>

          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">
            {heading}
          </h1>

          {/* Subcategory pills when a category is selected */}
          {catDef && catDef.subcategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              <Link href={`/products?category=${catDef.value}`}
                className={[
                  'px-3.5 py-1.5 text-xs font-semibold border transition-all',
                  !searchParams.subcategory
                    ? 'text-white border-blue-700'
                    : 'text-gray-500 border-gray-200 hover:border-blue-400 hover:text-blue-700 bg-white',
                ].join(' ')}
                style={!searchParams.subcategory ? { background: '#003A7A' } : {}}>
                All {catDef.label}
              </Link>
              {catDef.subcategories.map(sub => (
                <Link
                  key={sub.slug}
                  href={`/products?category=${catDef.value}&subcategory=${sub.slug}`}
                  className={[
                    'px-3.5 py-1.5 text-xs font-semibold border transition-all',
                    searchParams.subcategory === sub.slug
                      ? 'text-white border-blue-700'
                      : 'text-gray-500 border-gray-200 hover:border-blue-400 hover:text-blue-700 bg-white',
                  ].join(' ')}
                  style={searchParams.subcategory === sub.slug ? { background: '#003A7A' } : {}}>
                  {sub.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1320px] mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-60 shrink-0">
          <ProductFilters searchParams={searchParams}/>
        </aside>
        <div className="flex-1 min-w-0">
          <Suspense fallback={<GridSkeleton/>}>
            <ProductList searchParams={searchParams}/>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="bg-white border border-gray-100 overflow-hidden">
          <div className="aspect-[4/3] skeleton"/>
          <div className="p-4 space-y-2.5">
            <div className="h-2.5 skeleton w-1/3"/>
            <div className="h-4 skeleton"/>
            <div className="h-3.5 skeleton w-3/4"/>
            <div className="h-5 skeleton w-1/2 mt-3"/>
          </div>
        </div>
      ))}
    </div>
  );
}
