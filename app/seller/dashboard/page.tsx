'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  createdAt: string;
}

export default function SellerDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login?redirect=/seller/dashboard'); return; }
    if (status === 'authenticated') {
      if (!(session?.user as any)?.isSeller) { router.push('/'); toast.error('Seller access required'); return; }
      fetchMyProducts();
    }
  }, [status]);

  const fetchMyProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      const myProducts = (data.products || []).filter(
        (p: any) => p.seller?.id === (session?.user as any)?.id
      );
      setProducts(myProducts);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        toast.success(`${name} deleted`);
      } else {
        toast.error('Failed to delete product');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock < 5).length;

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-neutral-50">
          <div className="container-custom py-8">
            <div className="skeleton h-8 w-64 mb-8 rounded" />
            <div className="grid grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-28 rounded-xl" />)}
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50">
        <div className="container-custom py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-neutral-900">Seller Dashboard</h1>
              <p className="text-neutral-500 mt-1">Welcome back, {session?.user?.name}</p>
            </div>
            <Link href="/seller/products/new" className="btn-primary px-6 py-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Products', value: products.length, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Inventory Value', value: `KES ${totalValue.toLocaleString()}`, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Out of Stock', value: outOfStock, color: 'text-red-600', bg: 'bg-red-50' },
              { label: 'Low Stock', value: lowStock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
            ].map((stat) => (
              <div key={stat.label} className={`${stat.bg} rounded-xl p-6`}>
                <p className="text-sm text-neutral-500 mb-1">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-100">
              <h2 className="text-xl font-bold text-neutral-900">My Products</h2>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-neutral-500 mb-4">You haven't listed any products yet.</p>
                <Link href="/seller/products/new" className="btn-primary px-6 py-2">List Your First Product</Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 text-left">
                    <tr>
                      {['Product', 'Category', 'Price', 'Stock', 'Listed', 'Actions'].map((h) => (
                        <th key={h} className="px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-neutral-800 line-clamp-1 max-w-xs">{product.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-semibold bg-primary-50 text-primary-600 px-2 py-1 rounded capitalize">{product.category}</span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-neutral-700">KES {product.price.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`text-sm font-semibold ${product.stock === 0 ? 'text-red-500' : product.stock < 5 ? 'text-yellow-500' : 'text-green-600'}`}>
                            {product.stock} units
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-500">
                          {new Date(product.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Link href={`/products/${product.id}`} className="text-sm text-blue-500 hover:text-blue-600 font-medium">View</Link>
                            <button
                              onClick={() => handleDelete(product.id, product.name)}
                              className="text-sm text-red-500 hover:text-red-600 font-medium"
                            >Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
