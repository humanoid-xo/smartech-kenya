'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';
import { toggleWishlist } from '@/store/slices/wishlistSlice';
import { RootState } from '@/store';
import { toast } from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  brand: string;
  avgRating?: number;
  reviewCount?: number;
  stock: number;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch();
  const wishlist = useSelector((state: RootState) => state.wishlist.productIds);
  const isInWishlist = wishlist.includes(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock === 0) {
      toast.error('Product out of stock');
      return;
    }
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        stock: product.stock,
      })
    );
    toast.success('Added to cart');
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(toggleWishlist(product.id));
    toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <Link href={`/products/${product.id}`} className="card group overflow-hidden animate-fade-in">
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        <Image
          src={product.images[0] || '/placeholder.png'}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-neutral-50 transition-colors z-10"
          aria-label="Add to wishlist"
        >
          <svg
            className={`w-5 h-5 ${isInWishlist ? 'text-accent-500 fill-current' : 'text-neutral-600'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
        {product.stock > 0 && product.stock < 5 && (
          <div className="absolute bottom-3 left-3 bg-accent-500 text-white text-xs font-semibold px-2 py-1 rounded">
            Only {product.stock} left!
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs font-semibold text-primary-500 uppercase tracking-wide">
            {product.category}
          </span>
          {product.brand && (
            <span className="text-xs text-neutral-500 ml-2">• {product.brand}</span>
          )}
        </div>
        
        <h3 className="font-semibold text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary-500 transition-colors">
          {product.name}
        </h3>
        
        {product.avgRating !== undefined && product.reviewCount !== undefined && (
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(product.avgRating!)
                      ? 'text-yellow-400 fill-current'
                      : 'text-neutral-300'
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-neutral-600">
              {product.avgRating.toFixed(1)} ({product.reviewCount})
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-2xl font-bold text-primary-500">
              KES {product.price.toLocaleString()}
            </span>
          </div>
        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`mt-3 w-full py-2 rounded-lg font-semibold transition-all ${
            product.stock === 0
              ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
              : 'btn-primary'
          }`}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  );
}
