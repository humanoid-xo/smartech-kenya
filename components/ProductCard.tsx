'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import toast from 'react-hot-toast'

export interface ProductCardData {
  id:            string
  name:          string
  slug:          string
  price:         number
  comparePrice?: number | null
  images:        string[]
  brand:         string
  category:      string
  subcategory?:  string | null
  stock:         number
  reviews?:      { rating: number }[]
}

export default function ProductCard({ product }: { product: ProductCardData }) {
  const dispatch  = useDispatch()
  const [wished,  setWished]  = useState(false)
  const [adding,  setAdding]  = useState(false)
  const [imgErr,  setImgErr]  = useState(false)

  const discount = product.comparePrice && product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.price) * 100)
    : null

  const avgRating = product.reviews?.length
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : 0

  const imgSrc = !imgErr && product.images?.[0]
    ? product.images[0]
    : `https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=70&auto=format&fit=crop`

  const handleCart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (product.stock === 0) return
    setAdding(true)
    dispatch({ type: 'cart/addItem', payload: { ...product, quantity: 1 } })
    toast.success(`${product.name.slice(0, 30)}… added to cart`, {
      duration: 2000,
      style: { borderRadius: '14px', fontFamily: 'DM Sans, sans-serif', fontSize: '13px' },
    })
    setTimeout(() => setAdding(false), 700)
  }

  const handleWish = (e: React.MouseEvent) => {
    e.preventDefault()
    const next = !wished
    setWished(next)
    dispatch({ type: next ? 'wishlist/addItem' : 'wishlist/removeItem', payload: product })
    toast.success(next ? 'Added to wishlist' : 'Removed from wishlist', {
      duration: 1500,
      style: { borderRadius: '14px', fontFamily: 'DM Sans, sans-serif', fontSize: '13px' },
    })
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      className="product-card group block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-2xl"
    >
      <div className="bg-white rounded-2xl overflow-hidden border border-navy-100 hover:border-navy-200 hover:shadow-xl transition-all duration-300 flex flex-col h-full">

        {/* Image */}
        <div className="relative bg-navy-50 overflow-hidden flex-shrink-0" style={{ paddingTop: '100%' }}>
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            className="product-card-img object-contain p-4"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={() => setImgErr(true)}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount && discount > 0 && (
              <span className="bg-red-500 text-white text-[11px] font-black px-2 py-0.5 rounded-lg shadow-sm">
                -{discount}%
              </span>
            )}
            {product.stock === 0 && (
              <span className="bg-navy-800 text-white text-[11px] px-2 py-0.5 rounded-lg">
                Out of Stock
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWish}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 duration-200 ${
              wished ? 'bg-red-500 text-white' : 'bg-white text-navy-500 hover:text-red-500'
            }`}
            aria-label="Wishlist"
          >
            <Heart size={14} fill={wished ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-1">
          <p className="text-[11px] font-black text-primary-600 uppercase tracking-wider mb-1">{product.brand}</p>

          <h3 className="font-heading font-semibold text-navy-900 text-sm leading-snug line-clamp-2 flex-1 mb-2">
            {product.name}
          </h3>

          {avgRating > 0 && (
            <div className="flex items-center gap-1 mb-2.5">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((s) => (
                  <Star
                    key={s}
                    size={10}
                    className={s <= Math.round(avgRating) ? 'text-gold-500 fill-gold-500' : 'text-navy-200 fill-navy-200'}
                  />
                ))}
              </div>
              <span className="text-[11px] text-navy-400">({product.reviews?.length})</span>
            </div>
          )}

          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-heading font-black text-navy-900 text-base">
              KES {product.price.toLocaleString()}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-navy-400 text-xs line-through">
                KES {product.comparePrice.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={handleCart}
            disabled={product.stock === 0 || adding}
            className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              product.stock === 0
                ? 'bg-navy-100 text-navy-400 cursor-not-allowed'
                : adding
                ? 'bg-primary-500 text-white scale-95'
                : 'bg-navy-900 text-white hover:bg-navy-800 active:scale-95'
            }`}
          >
            <ShoppingCart size={13} />
            {adding ? 'Adding…' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  )
}
