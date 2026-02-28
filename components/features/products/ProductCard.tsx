'use client';

import { useState }    from 'react';
import Link             from 'next/link';
import Image            from 'next/image';
import { useDispatch }  from 'react-redux';
import { addToCart }    from '@/store/slices/cartSlice';
import toast            from 'react-hot-toast';

interface Product {
  id:           string;
  name:         string;
  slug:         string;
  price:        number;
  comparePrice?: number | null;
  images:       string[];
  brand:        string;
  category:     string;
  stock:        number;
  avgRating?:   number;
  reviewCount?: number;
}

export function ProductCard({ product }: { product: Product }) {
  const dispatch   = useDispatch();
  const [imgError, setImgError] = useState(false);

  const discount = product.comparePrice
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      addToCart({
        productId: product.id,
        name:      product.name,
        price:     product.price,
        image:     product.images[0] ?? '',
        quantity:  1,
        stock:     product.stock,
      })
    );
    toast.success('Added to cart');
  };

  return (
    <Link href={`/products/${product.slug}-${product.id}`} className="group block">
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:border-gray-200">
        {/* Image */}
        <div className="relative aspect-square bg-[#f9f9f9] overflow-hidden">
          {product.images[0] && !imgError ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-contain p-5 transition-transform duration-500 group-hover:scale-[1.04]"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-14 h-14 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Discount badge */}
          {discount !== null && discount > 0 && (
            <div className="absolute top-3 left-3 px-2 py-0.5 bg-kenya-red text-white text-[11px] font-bold rounded-full">
              -{discount}%
            </div>
          )}

          {/* Quick-add button */}
          <button
            onClick={handleAddToCart}
            aria-label="Add to cart"
            className="absolute bottom-3 right-3 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 hover:bg-gray-900 hover:text-white text-gray-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mb-1">{product.brand}</div>
          <div className="font-medium text-gray-900 text-sm leading-snug line-clamp-2 mb-2.5">{product.name}</div>

          {/* Stars */}
          {(product.avgRating ?? 0) > 0 && (
            <div className="flex items-center gap-1.5 mb-2.5">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg
                    key={s}
                    className={`w-3 h-3 ${s <= Math.round(product.avgRating!) ? 'text-amber-400' : 'text-gray-200'}`}
                    fill="currentColor" viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-[11px] text-gray-400">({product.reviewCount})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-gray-900">
              KES {product.price.toLocaleString()}
            </span>
            {product.comparePrice && (
              <span className="text-xs text-gray-400 line-through">
                KES {product.comparePrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
