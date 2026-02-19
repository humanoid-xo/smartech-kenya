'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { toggleWishlist } from '@/store/slices/wishlistSlice';
import { addToCart } from '@/store/slices/cartSlice';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  brand: string;
  stock: number;
  avgRating: number;
}

export default function WishlistPage() {
  const dispatch = useDispatch();
  const wishlistIds = useSelector((state: RootState) => state.wishlist.productIds);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wishlistIds.length === 0) { setLoading(false); return; }
    fetchWishlistProducts();
  }, [wishlistIds]);

  const fetchWishlistProducts = async () => {
    setLoading(true);
    try {
      const results = await Promise.all(
        wishlistIds.map((id) => fetch(`/api/products/${id}`).then((r) => r.json()))
      );
      setProducts(results.filter((p) => !p.error));
    } catch (err) {
      console.error('Failed to fetch wishlist products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = (id: string, name: string) => {
    dispatch(toggleWishlist(id));
    toast.success(`${name} removed from wishlist`);
  };

  const handleAddToCart = (product: Product) => {
    if (product.stock === 0) { toast.error('Product is out of stock'); return; }
    dispatch(addToCart({ id: product.id, name: product.name, price: product.price, image: product.images[0], stock: product.stock }));
    toast.success('Added to cart');
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50">
        <div className="container-custom py-8">
          <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">My Wishlist</h1>
          <p className="text-neutral-500 mb-8">{wishlistIds.length} saved item(s)</p>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="skeleton h-48 mb-4 rounded-lg" />
                  <div className="skeleton h-4 mb-2 rounded" />
                  <div className="skeleton h-4 w-2/3 rounded" />
                </div>
              ))}
            </div>
          ) : wishlistIds.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
              <svg className="w-20 h-20 text-neutral-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h2 className="text-2xl font-bold text-neutral-600 mb-3">Your wishlist is empty</h2>
              <p className="text-neutral-400 mb-8">Save items you love and come back to them later.</p>
              <Link href="/products" className="btn-primary px-8 py-3">Browse Products</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden group">
                  <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-neutral-100">
                    <Image
                      src={product.images[0] || '/placeholder.png'}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-bold">Out of Stock</span>
                      </div>
                    )}
                    <button
                      onClick={(e) => { e.preventDefault(); handleRemoveFromWishlist(product.id, product.name); }}
                      className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors z-10"
                      aria-label="Remove from wishlist"
                    >
                      <svg className="w-5 h-5 text-red-500 fill-current" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </Link>

                  <div className="p-4">
                    <p className="text-xs font-semibold text-primary-500 uppercase mb-1">{product.category}</p>
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-semibold text-neutral-900 mb-2 line-clamp-2 hover:text-primary-500 transition-colors">{product.name}</h3>
                    </Link>
                    <p className="text-xl font-bold text-primary-500 mb-3">KES {product.price.toLocaleString()}</p>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className={`w-full py-2 rounded-lg font-semibold text-sm transition-all ${product.stock === 0 ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed' : 'btn-primary'}`}
                    >
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
