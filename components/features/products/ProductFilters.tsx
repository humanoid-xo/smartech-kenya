'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useCallback }            from 'react';

const CATEGORIES = [
  { id: 'SMARTPHONES',     label: 'Smartphones & Tablets' },
  { id: 'LAPTOPS',         label: 'Laptops & Computers'   },
  { id: 'HOME_APPLIANCES', label: 'Home Appliances'       },
  { id: 'KITCHEN',         label: 'Kitchen Appliances'    },
  { id: 'BEDROOM',         label: 'Bedroom & Living'      },
  { id: 'AUDIO_TV',        label: 'Audio & Television'    },
  { id: 'ELECTRICAL',      label: 'Electrical & Lighting' },
  { id: 'SMART_HOME',      label: 'Smart Home'            },
];

const PRICE_RANGES = [
  { label: 'Under KES 5,000',    min: '0',     max: '5000'   },
  { label: 'KES 5,000–10,000',   min: '5000',  max: '10000'  },
  { label: 'KES 10,000–25,000',  min: '10000', max: '25000'  },
  { label: 'KES 25,000–50,000',  min: '25000', max: '50000'  },
  { label: 'Over KES 50,000',    min: '50000', max: ''       },
];

export function ProductFilters({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const router   = useRouter();
  const pathname = usePathname();

  const setParam = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams as Record<string, string>);
    if (value) params.set(key, value);
    else        params.delete(key);
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, router, pathname]);

  const clearAll = () => router.push(pathname);

  const hasFilters = !!(searchParams.category || searchParams.minPrice || searchParams.brand);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-6 sticky top-24">

      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 text-sm">Filters</h3>
        {hasFilters && (
          <button onClick={clearAll} className="text-xs text-kenya-green hover:underline">Clear all</button>
        )}
      </div>

      {/* Category */}
      <div>
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Category</div>
        <div className="space-y-1">
          {CATEGORIES.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setParam('category', searchParams.category === id ? null : id)}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${
                searchParams.category === id
                  ? 'bg-gray-900 text-white font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Price Range</div>
        <div className="space-y-1">
          {PRICE_RANGES.map(({ label, min, max }) => {
            const active = searchParams.minPrice === min && (searchParams.maxPrice ?? '') === max;
            return (
              <button
                key={label}
                onClick={() => {
                  if (active) {
                    setParam('minPrice', null);
                    setParam('maxPrice', null);
                  } else {
                    setParam('minPrice', min);
                    setParam('maxPrice', max || null);
                  }
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${
                  active ? 'bg-gray-900 text-white font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
