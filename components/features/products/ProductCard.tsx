'use client';

import { useState }   from 'react';
import Link            from 'next/link';
import Image           from 'next/image';
import { useDispatch } from 'react-redux';
import { addToCart }   from '@/store/slices/cartSlice';
import toast           from 'react-hot-toast';
import { descriptionToBullets } from './descriptionToBullets';

interface Product {
  id:            string;
  name:          string;
  slug:          string;
  sku:           string;
  price:         number;
  comparePrice?: number | null;
  imageUrl?:     string;
  images?:       string[];
  brand:         string;
  description?:  string;
  category:      string;
  stock:         number;
  avgRating?:    number;
  reviewCount?:  number;
}

export function ProductCard({ product: p }: { product: Product }) {
  const dispatch = useDispatch();
  const [imgErr, setImgErr] = useState(false);

  const mainImage: string = p.imageUrl ?? p.images?.[0] ?? '';

  const disc = p.comparePrice && p.comparePrice > p.price
    ? Math.round((1 - p.price / p.comparePrice) * 100)
    : null;

  const addCart = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (p.stock === 0) return;
    dispatch(addToCart({
      productId: p.id,
      name:      p.name,
      price:     p.price,
      image:     mainImage,
      quantity:  1,
      stock:     p.stock,
    }));
    toast.success(`Added to cart`, {
      icon: '🛒',
      style: { background: '#003A7A', color: '#fff', borderRadius: '0', fontSize: '13px' },
    });
  };

  const productUrl = `/products/${encodeURIComponent(p.sku)}`;

  /* Get top 4 bullet points */
  const bullets = descriptionToBullets(p.description, 4, 65);

  return (
    <Link href={productUrl} className="group block">
      <article className="product-card h-full flex flex-col">

        {/* ── Image ── */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
          {mainImage && !imgErr ? (
            <Image
              src={mainImage} alt={p.name} fill
              sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,25vw"
              className="object-contain p-5 transition-transform duration-500 group-hover:scale-[1.04]"
              onError={() => setImgErr(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
          )}

          {disc !== null && disc > 0 && (
            <div className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold tracking-wide text-white"
              style={{ background: '#C0392B' }}>
              -{disc}%
            </div>
          )}

          {p.stock > 0 && p.stock <= 3 && (
            <div className="absolute bottom-3 left-3 px-2 py-0.5 text-[9px] font-bold tracking-wide text-white"
              style={{ background: '#003A7A' }}>
              Only {p.stock} left
            </div>
          )}

          {p.stock > 0 && (
            <button onClick={addCart} aria-label="Add to cart"
              className="absolute bottom-3 right-3 w-9 h-9 flex items-center justify-center shadow-md z-10
                         opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0
                         transition-all duration-200 bg-blue-700 text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
              </svg>
            </button>
          )}

          {p.stock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
              <span className="text-xs font-semibold px-3 py-1.5 border border-gray-200 bg-white text-gray-500">
                Out of stock
              </span>
            </div>
          )}
        </div>

        {/* ── Info ── */}
        <div className="p-4 pt-3.5 flex flex-col flex-1">
          <p className="text-[9.5px] font-bold tracking-widest uppercase mb-1.5 text-gray-400">
            {p.brand}
          </p>
          <h3 className="text-[13px] font-medium leading-snug line-clamp-2 mb-auto pb-3 text-gray-900">
            {p.name}
          </h3>

          {/* Top 4 feature bullets — plain, no italics */}
          {bullets.length > 0 && (
            <ul className="mb-3 space-y-0.5">
              {bullets.map((b, i) => (
                <li key={i} className="flex gap-1.5 text-[11px] leading-snug text-gray-500" style={{ fontStyle: 'normal' }}>
                  <span style={{ color: '#003A7A' }}>—</span>
                  <span className="line-clamp-1">{b}</span>
                </li>
              ))}
            </ul>
          )}

          {(p.avgRating ?? 0) > 0 && (
            <div className="flex items-center gap-1.5 mb-2.5">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"
                    style={{ color: s <= Math.round(p.avgRating!) ? '#E8A020' : '#E5E7EB' }}>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <span className="text-[10px] text-gray-400">({p.reviewCount})</span>
            </div>
          )}

          {/* Price — no italics */}
          <div className="flex items-baseline gap-2 mt-auto pt-2 border-t border-gray-100">
            <span style={{
              color: '#003A7A',
              fontWeight: 700,
              fontStyle: 'normal',
              fontSize: '1rem',
              letterSpacing: '-0.01em',
            }}>
              KES {p.price.toLocaleString()}
            </span>
            {p.comparePrice && p.comparePrice > p.price && (
              <span style={{
                color: '#9CA3AF',
                fontStyle: 'normal',
                fontSize: '0.75rem',
                textDecoration: 'line-through',
              }}>
                {p.comparePrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
