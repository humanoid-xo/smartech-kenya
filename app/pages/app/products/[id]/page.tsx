'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';
import { toast } from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { name: string };
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  brand: string;
  stock: number;
  features?: Record<string, string>;
  avgRating: number;
  reviewCount: number;
  reviews: Review[];
  seller: { id: string; name: string; email: string };
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) { router.push('/products'); return; }
      const data = await res.json();
      setProduct(data);
    } catch (err) {
      console.error('Failed to fetch product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product || product.stock === 0) return;
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        stock: product.stock,
      }));
    }
    toast.success(`${quantity} item(s) added to cart`);
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-neutral-50">
          <div className="container-custom py-12">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="skeleton h-96 rounded-2xl" />
              <div className="space-y-4">
                <div className="skeleton h-8 rounded" />
                <div className="skeleton h-6 w-1/2 rounded" />
                <div className="skeleton h-20 rounded" />
                <div className="skeleton h-12 rounded" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) return null;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50">
        <div className="container-custom py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
            <Link href="/" className="hover:text-primary-500">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-primary-500">Products</Link>
            <span>/</span>
            <Link href={`/products?category=${product.category}`} className="hover:text-primary-500 capitalize">{product.category}</Link>
            <span>/</span>
            <span className="text-neutral-900 font-medium">{product.name}</span>
          </nav>

          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Images */}
              <div>
                <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100 mb-4">
                  <Image
                    src={product.images[selectedImage] || '/placeholder.png'}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                {product.images.length > 1 && (
                  <div className="flex gap-3">
                    {product.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(i)}
                        className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === i ? 'border-primary-500' : 'border-transparent'}`}
                      >
                        <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-primary-500 uppercase tracking-wide bg-primary-50 px-2 py-1 rounded">{product.category}</span>
                  <span className="text-xs text-neutral-500">{product.brand}</span>
                </div>

                <h1 className="text-3xl font-bold text-neutral-900 mb-4">{product.name}</h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-5 h-5 ${i < Math.round(product.avgRating) ? 'text-yellow-400 fill-current' : 'text-neutral-300'}`} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-neutral-600">{product.avgRating.toFixed(1)} ({product.reviewCount} reviews)</span>
                </div>

                <div className="text-4xl font-bold text-primary-500 mb-4">
                  KES {product.price.toLocaleString()}
                </div>

                <p className="text-neutral-600 mb-6 leading-relaxed">{product.description}</p>

                {/* Stock Status */}
                <div className="mb-6">
                  {product.stock === 0 ? (
                    <span className="text-red-500 font-semibold">Out of Stock</span>
                  ) : product.stock < 5 ? (
                    <span className="text-accent-500 font-semibold">Only {product.stock} left in stock!</span>
                  ) : (
                    <span className="text-green-600 font-semibold">In Stock ({product.stock} available)</span>
                  )}
                </div>

                {/* Quantity Selector */}
                {product.stock > 0 && (
                  <div className="flex items-center gap-4 mb-6">
                    <label className="font-semibold text-neutral-700">Quantity:</label>
                    <div className="flex items-center border border-neutral-300 rounded-lg">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-neutral-100 transition-colors">-</button>
                      <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">{quantity}</span>
                      <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="px-4 py-2 hover:bg-neutral-100 transition-colors">+</button>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-all ${product.stock === 0 ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed' : 'btn-primary'}`}
                  >
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                  <Link href="/cart" className="btn-outline py-3 px-6 rounded-xl font-semibold">
                    View Cart
                  </Link>
                </div>

                {/* Seller Info */}
                <div className="mt-6 pt-6 border-t border-neutral-100">
                  <p className="text-sm text-neutral-500">Sold by <span className="font-semibold text-neutral-700">{product.seller?.name}</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          {product.features && Object.keys(product.features).length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">Product Features</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {Object.entries(product.features).map(([key, value]) => (
                  <div key={key} className="flex gap-3">
                    <svg className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <span className="font-semibold text-neutral-700 capitalize">{key}: </span>
                      <span className="text-neutral-600">{String(value)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews ({product.reviewCount})</h2>
            {product.reviews.length === 0 ? (
              <p className="text-neutral-500">No reviews yet. Be the first to review this product!</p>
            ) : (
              <div className="space-y-6">
                {product.reviews.map((review) => (
                  <div key={review.id} className="border-b border-neutral-100 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-neutral-800">{review.user.name}</span>
                      <span className="text-sm text-neutral-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-neutral-300'}`} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-neutral-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
