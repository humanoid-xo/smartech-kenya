'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  brand: string;
  avgRating: number;
  reviewCount: number;
  stock: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const page = searchParams.get('page') || '1';

  useEffect(() => {
    fetchProducts();
  }, [category, search, page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (search) params.set('search', search);
      if (page) params.set('page', page);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      params.set('limit', '12');

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);
      setPagination(data.pagination || null);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`/products?${params.toString()}`);
  };

  const handleCategoryChange = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat) params.set('category', cat);
    else params.delete('category');
    params.delete('page');
    router.push(`/products?${params.toString()}`);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50">
        <div className="container-custom py-8">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-display font-bold text-neutral-900">
              {category === 'tech' ? 'Tech Appliances' : category === 'kitchen' ? 'Kitchen Appliances' : search ? `Search: "${search}"` : 'All Products'}
            </h1>
            {pagination && (
              <p className="text-neutral-500 mt-1">{pagination.total} products found</p>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="font-bold text-lg mb-4">Filters</h2>

                {/* Category */}
                <div className="mb-6">
                  <h3 className="font-semibold text-sm text-neutral-700 mb-3 uppercase tracking-wide">Category</h3>
                  <div className="space-y-2">
                    {['', 'tech', 'kitchen'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleCategoryChange(cat)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          category === cat
                            ? 'bg-primary-500 text-white'
                            : 'hover:bg-neutral-100 text-neutral-700'
                        }`}
                      >
                        {cat === '' ? 'All Products' : cat === 'tech' ? 'Tech Appliances' : 'Kitchen Appliances'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-semibold text-sm text-neutral-700 mb-3 uppercase tracking-wide">Price Range (KES)</h3>
                  <form onSubmit={handleFilter} className="space-y-3">
                    <input
                      type="number"
                      placeholder="Min price"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                      type="number"
                      placeholder="Max price"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button type="submit" className="w-full btn-primary text-sm py-2">
                      Apply Filter
                    </button>
                  </form>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="skeleton h-48 mb-4 rounded-lg" />
                      <div className="skeleton h-4 mb-2 rounded" />
                      <div className="skeleton h-4 w-2/3 rounded" />
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20">
                  <svg className="w-16 h-16 text-neutral-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-neutral-600 mb-2">No products found</h3>
                  <p className="text-neutral-400">Try adjusting your filters or search terms</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination && pagination.pages > 1 && (
                    <div className="flex justify-center gap-2 mt-10">
                      {[...Array(pagination.pages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => handlePageChange(i + 1)}
                          className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                            pagination.page === i + 1
                              ? 'bg-primary-500 text-white'
                              : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" /></div>}>
      <ProductsContent />
    </Suspense>
  );
}
