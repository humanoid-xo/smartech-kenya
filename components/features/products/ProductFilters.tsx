'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { CATEGORIES } from '@/constants/categories';

const PRICES = [
  { label: 'Under KES 5,000',    min: '0',     max: '5000'  },
  { label: 'KES 5,000 – 10,000', min: '5000',  max: '10000' },
  { label: 'KES 10,000 – 25,000',min: '10000', max: '25000' },
  { label: 'KES 25,000 – 50,000',min: '25000', max: '50000' },
  { label: 'Over KES 50,000',    min: '50000', max: ''      },
];

export function ProductFilters({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const router   = useRouter();
  const pathname = usePathname();

  const update = (key: string, val: string | null) => {
    const p = new URLSearchParams(searchParams as Record<string, string>);
    if (val) p.set(key, val); else p.delete(key);
    p.delete('page');
    router.push(`${pathname}?${p.toString()}`);
  };

  const clearAll = () => router.push(pathname);

  const activeCategory   = searchParams.category   ?? null;
  const activeSubcategory = searchParams.subcategory ?? null;
  const activeMin        = searchParams.minPrice    ?? null;
  const activeMax        = searchParams.maxPrice    ?? '';
  const activeBrand      = searchParams.brand       ?? null;
  const hasFilters       = !!(activeCategory || activeMin || activeBrand || activeSubcategory);

  const activeCatDef = CATEGORIES.find(c => c.value === activeCategory);

  return (
    <div
      className="bg-white border border-gray-200 p-5 space-y-7 sticky"
      style={{ top: '88px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-gray-900 tracking-wide">Filters</span>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs font-medium text-blue-700 hover:text-blue-900 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* ── All Products shortcut ── */}
      <div>
        <button
          onClick={clearAll}
          className={[
            'w-full text-left px-3 py-2.5 text-sm font-semibold transition-all',
            !activeCategory
              ? 'text-white'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900',
          ].join(' ')}
          style={!activeCategory ? { background: '#003A7A' } : {}}
        >
          All Products
        </button>
      </div>

      {/* ── Categories ── */}
      <div>
        <p className="text-[9px] font-bold tracking-[0.18em] uppercase text-gray-400 mb-3">
          Category
        </p>
        <div className="space-y-0.5">
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.value;
            return (
              <div key={cat.value}>
                {/* Category button */}
                <button
                  onClick={() =>
                    update('category', isActive ? null : cat.value)
                  }
                  className={[
                    'w-full text-left px-3 py-2.5 text-sm font-medium transition-all flex items-center justify-between',
                    isActive
                      ? 'text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  ].join(' ')}
                  style={isActive ? { background: '#003A7A' } : {}}
                >
                  <span>{cat.label}</span>
                  {cat.subcategories.length > 0 && (
                    <svg
                      className={`w-3.5 h-3.5 transition-transform ${isActive ? 'rotate-90' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                    </svg>
                  )}
                </button>

                {/* Subcategories — only shown when this category is active */}
                {isActive && cat.subcategories.length > 0 && (
                  <div className="pl-3 mt-0.5 mb-1 space-y-0.5">
                    {cat.subcategories.map(sub => {
                      const subActive = activeSubcategory === sub.slug;
                      return (
                        <button
                          key={sub.slug}
                          onClick={() =>
                            update('subcategory', subActive ? null : sub.slug)
                          }
                          className={[
                            'w-full text-left px-3 py-2 text-xs transition-all flex items-center gap-2',
                            subActive
                              ? 'font-semibold text-white'
                              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800',
                          ].join(' ')}
                          style={subActive ? { background: '#0057B8' } : {}}
                        >
                          <span
                            className="w-1 h-1 rounded-full flex-shrink-0"
                            style={{ background: subActive ? '#fff' : '#D1D5DB' }}
                          />
                          {sub.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Price Range ── */}
      <div>
        <p className="text-[9px] font-bold tracking-[0.18em] uppercase text-gray-400 mb-3">
          Price Range
        </p>
        <div className="space-y-0.5">
          {PRICES.map(({ label, min, max }) => {
            const active =
              activeMin === min && activeMax === max;
            return (
              <button
                key={label}
                onClick={() => {
                  if (active) {
                    update('minPrice', null);
                    update('maxPrice', null);
                  } else {
                    update('minPrice', min);
                    update('maxPrice', max || null);
                  }
                }}
                className={[
                  'w-full text-left px-3 py-2.5 text-sm transition-all',
                  active
                    ? 'font-medium text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                ].join(' ')}
                style={active ? { background: '#003A7A' } : {}}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Quick links to categories ── */}
      <div className="pt-2 border-t border-gray-100">
        <p className="text-[9px] font-bold tracking-[0.18em] uppercase text-gray-400 mb-3">
          Quick Browse
        </p>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => update('category', activeCategory === cat.value ? null : cat.value)}
              className={[
                'px-2.5 py-1 text-[10px] font-semibold transition-all border',
                activeCategory === cat.value
                  ? 'text-white border-blue-700'
                  : 'text-gray-500 border-gray-200 hover:border-blue-400 hover:text-blue-700',
              ].join(' ')}
              style={activeCategory === cat.value ? { background: '#003A7A' } : {}}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
