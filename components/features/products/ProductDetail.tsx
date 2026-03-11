'use client';

import { useState }   from 'react';
import Image           from 'next/image';
import { useDispatch } from 'react-redux';
import { addToCart }   from '@/store/slices/cartSlice';
import toast           from 'react-hot-toast';

interface Review {
  id:       string;
  rating:   number;
  comment?: string | null;
  createdAt:string | Date;
  user?: { name: string; image?: string | null };
}

interface Product {
  id:           string;
  name:         string;
  brand:        string;
  description:  string;
  price:        number;
  comparePrice?: number | null;
  images:       string[];
  stock:        number;
  category:     string;
  features?:    Record<string, unknown> | null;
  specifications?: Record<string, unknown> | null;
  avgRating:    number;
  reviewCount:  number;
  reviews:      Review[];
  seller:       { id: string; name: string };
}

export function ProductDetail({ product }: { product: Product }) {
  const dispatch          = useDispatch();
  const [activeImg, setActiveImg] = useState(0);
  const [qty,        setQty]       = useState(1);

  const discount = product.comparePrice
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : null;

  const handleAddToCart = () => {
    dispatch(addToCart({
      productId: product.id,
      name:      product.name,
      price:     product.price,
      image:     product.images[0] ?? '',
      quantity:  qty,
      stock:     product.stock,
    }));
    toast.success(`${qty > 1 ? qty + '× ' : ''}Added to cart`);
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
      <div className="grid md:grid-cols-2 gap-0">

        {/* Images */}
        <div className="p-8 bg-gray-50 border-r border-gray-100">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-white mb-4">
            {product.images[activeImg] ? (
              <Image
                src={product.images[activeImg]}
                alt={product.name}
                fill
                className="object-contain p-8"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-24 h-24 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            {discount !== null && discount > 0 && (
              <div className="absolute top-4 left-4 px-2.5 py-1 bg-kenya-red text-white text-xs font-bold rounded-full">
                -{discount}%
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImg === i ? 'border-gray-900' : 'border-transparent opacity-50 hover:opacity-80'
                  }`}
                >
                  <Image src={img} alt="" width={56} height={56} className="object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-8 lg:p-10 flex flex-col">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{product.brand}</div>
          <h1 className="font-display text-2xl lg:text-3xl text-gray-900 leading-tight mb-4">{product.name}</h1>

          {/* Rating */}
          {product.avgRating > 0 && (
            <div className="flex items-center gap-2 mb-5">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg key={s} className={`w-4 h-4 ${s <= Math.round(product.avgRating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-500">{product.avgRating.toFixed(1)} ({product.reviewCount} reviews)</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-gray-900">KES {product.price.toLocaleString()}</span>
            {product.comparePrice && (
              <span className="text-gray-400 line-through text-lg">KES {product.comparePrice.toLocaleString()}</span>
            )}
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-8">{product.description}</p>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-kenya-green' : 'bg-red-400'}`} />
            <span className={`text-sm font-medium ${product.stock > 0 ? 'text-kenya-green' : 'text-red-500'}`}>
              {product.stock > 0 ? `In stock (${product.stock} available)` : 'Out of stock'}
            </span>
          </div>

          {/* Qty + add to cart */}
          {product.stock > 0 && (
            <div className="flex gap-3 mb-6">
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white transition-all text-gray-700 text-lg font-light"
                >−</button>
                <span className="w-8 text-center font-semibold text-sm">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white transition-all text-gray-700 text-lg font-light"
                >+</button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 transition-all active:scale-[0.98]"
              >
                Add to Cart
              </button>
            </div>
          )}

          {/* Seller */}
          <div className="pt-5 mt-auto border-t border-gray-100 flex items-center gap-2">
            <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 text-xs font-bold">
              {product.seller.name[0]}
            </div>
            <span className="text-xs text-gray-400">Sold by <span className="font-medium text-gray-600">{product.seller.name}</span></span>
          </div>
        </div>
      </div>

      {/* Specifications */}
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <div className="border-t border-gray-100 p-8 lg:p-10">
          <h2 className="font-semibold text-gray-900 mb-5">Specifications</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {Object.entries(product.specifications as Record<string, string>).map(([k, v]) => (
              <div key={k} className="flex gap-3 py-2.5 border-b border-gray-50">
                <span className="text-gray-500 text-sm w-32 shrink-0">{k}</span>
                <span className="text-gray-900 text-sm font-medium">{String(v)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      {product.reviews.length > 0 && (
        <div className="border-t border-gray-100 p-8 lg:p-10">
          <h2 className="font-semibold text-gray-900 mb-6">
            Customer Reviews
            <span className="ml-2 text-gray-400 font-normal">({product.reviewCount})</span>
          </h2>
          <div className="space-y-5">
            {product.reviews.slice(0, 5).map((review) => (
              <div key={review.id} className="border-b border-gray-50 pb-5 last:border-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">
                    {review.user?.name?.[0] ?? 'U'}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{review.user?.name ?? 'Customer'}</span>
                  <div className="flex gap-0.5 ml-1">
                    {[1,2,3,4,5].map((s) => (
                      <svg key={s} className={`w-3 h-3 ${s <= review.rating ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                {review.comment && <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
