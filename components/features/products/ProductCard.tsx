'use client';

import { useState }   from 'react';
import Link            from 'next/link';
import Image           from 'next/image';
import { useDispatch } from 'react-redux';
import { addToCart }   from '@/store/slices/cartSlice';
import toast           from 'react-hot-toast';

interface Product {
  id:            string;
  name:          string;
  slug:          string;
  price:         number;
  comparePrice?: number | null;
  images:        string[];
  brand:         string;
  category:      string;
  stock:         number;
  avgRating?:    number;
  reviewCount?:  number;
}

export function ProductCard({ product: p }: { product: Product }) {
  const dispatch = useDispatch();
  const [imgErr, setImgErr] = useState(false);

  const disc = p.comparePrice && p.comparePrice > p.price
    ? Math.round((1 - p.price / p.comparePrice) * 100)
    : null;

  const addCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({
      productId: p.id,
      name:      p.name,
      price:     p.price,
      image:     p.images[0] ?? '',
      quantity:  1,
      stock:     p.stock,
    }));
    toast.success(`Added to cart`, {
      icon: '🛒',
      style: { background: '#0C0C0C', color: '#F5F0E8', borderRadius: '14px', fontSize: '13px' },
    });
  };

  return (
    <Link href={`/products/${p.slug}-${p.id}`} className="group block">
      <article className="card h-full flex flex-col">

        {/* Image */}
        <div className="relative aspect-[4/3] bg-cream overflow-hidden rounded-t-2xl">
          {p.images[0] && !imgErr ? (
            <Image
              src={p.images[0]}
              alt={p.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain p-5 prod-img"
              onError={() => setImgErr(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-cream-warm/50">
              <svg className="w-12 h-12 text-cream-muted/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
          )}

          {/* Discount badge */}
          {disc !== null && disc > 0 && (
            <div className="badge-sale">-{disc}%</div>
          )}

          {/* Quick-add button */}
          <button
            onClick={addCart}
            aria-label="Add to cart"
            className="absolute bottom-3 right-3 w-9 h-9 rounded-xl bg-ink text-cream flex items-center justify-center
                       opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0
                       transition-all duration-200 hover:bg-ink-soft shadow-lg z-10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
            </svg>
          </button>

          {/* Low stock indicator */}
          {p.stock > 0 && p.stock <= 3 && (
            <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full bg-amber-luxe/90 text-[9px] font-bold text-white tracking-wide">
              Only {p.stock} left
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 pt-3.5 flex flex-col flex-1">
          <div className="overline text-cream-dark mb-1.5 text-[9.5px]">{p.brand}</div>
          <h3 className="text-ink text-[13px] font-medium leading-snug line-clamp-2 mb-auto pb-2.5">
            {p.name}
          </h3>

          {(p.avgRating ?? 0) > 0 && (
            <div className="flex items-center gap-1.5 mb-2.5">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <svg key={s}
                    className={`w-3 h-3 ${s <= Math.round(p.avgRating!) ? 'text-amber-luxe' : 'text-cream-warm'}`}
                    fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <span className="text-[10px] text-cream-dark">({p.reviewCount})</span>
            </div>
          )}

          <div className="flex items-baseline justify-between mt-1">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-display text-[1.05rem] font-medium text-ink">
                KES {p.price.toLocaleString()}
              </span>
              {p.comparePrice && p.comparePrice > p.price && (
                <span className="text-[11px] text-cream-muted line-through">
                  {p.comparePrice.toLocaleString()}
                </span>
              )}
            </div>
            {p.stock === 0 && (
              <span className="text-[10px] text-red-500 font-semibold">Out of stock</span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
