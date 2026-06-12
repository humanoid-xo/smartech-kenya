'use client';
import Image from 'next/image';
import Link  from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { RootState }           from '@/store';
import { removeFromWishlist }  from '@/store/slices/wishlistSlice';
import { addToCart }           from '@/store/slices/cartSlice';
import toast                   from 'react-hot-toast';

export default function WishlistPage() {
  const dispatch = useDispatch();
  const items    = useSelector((s: RootState) => s.wishlist.items);

  const moveToCart = (item: typeof items[0]) => {
    dispatch(addToCart({ productId: item.productId, name: item.name, price: item.price, image: item.image, quantity: 1, stock: 99 }));
    dispatch(removeFromWishlist(item.productId));
    toast.success('Moved to cart 🛒');
  };

  if (!items.length) return (
    <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center px-6">
      <div className="text-center">
        <div className="w-16 h-16 border border-gray-200 bg-white flex items-center justify-center mx-auto mb-6">
          <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </div>
        <p className="eyebrow mb-3">Wishlist</p>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 text-sm mb-8">Save products you love and come back to them anytime.</p>
        <Link href="/products" className="btn-primary px-8 py-3.5">Browse Products</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 py-10 px-6">
        <div className="max-w-[1320px] mx-auto">
          <p className="eyebrow mb-2">Saved</p>
          <h1 className="text-3xl font-semibold text-gray-900">
            Wishlist
            <span className="text-gray-300 font-normal text-xl ml-3">({items.length})</span>
          </h1>
        </div>
      </div>

      <div className="max-w-[1320px] mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items.map(item => (
            <div key={item.productId} className="product-card group">
              <div className="relative aspect-square bg-white overflow-hidden">
                {item.image
                  ? <Image src={item.image} alt={item.name} fill sizes="(max-width:768px)50vw,25vw"
                      className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"/>
                  : <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
                      <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"/>
                      </svg>
                    </div>
                }
                <button
                  onClick={() => { dispatch(removeFromWishlist(item.productId)); toast.success('Removed'); }}
                  className="absolute top-2.5 right-2.5 w-7 h-7 bg-white border border-gray-200 flex items-center justify-center
                             opacity-0 group-hover:opacity-100 transition-opacity hover:border-red-200 hover:bg-red-50">
                  <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <p className="text-gray-900 text-xs font-medium leading-snug line-clamp-2 mb-3">{item.name}</p>
                <p className="font-bold text-gray-900 text-base mb-3">KES {item.price.toLocaleString()}</p>
                <button onClick={() => moveToCart(item)}
                  className="btn-primary w-full py-2.5 text-xs">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
