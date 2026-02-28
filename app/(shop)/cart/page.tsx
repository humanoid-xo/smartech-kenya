'use client';

import Image            from 'next/image';
import Link             from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { RootState }    from '@/store';
import { removeFromCart, updateQuantity, clearCart } from '@/store/slices/cartSlice';

export default function CartPage() {
  const dispatch = useDispatch();
  const { items, total } = useSelector((state: RootState) => state.cart);

  const shippingFee  = total >= 10_000 ? 0 : 350;
  const orderTotal   = total + shippingFee;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-white rounded-full border border-gray-100 flex items-center justify-center mx-auto mb-6 shadow-sm">
            <svg className="w-9 h-9 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="font-display text-2xl text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 text-sm mb-8">Looks like you haven&apos;t added anything yet.</p>
          <Link href="/products" className="btn-primary">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl text-gray-900">Your Cart</h1>
          <button
            onClick={() => dispatch(clearCart())}
            className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            Clear all
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Items */}
          <div className="flex-1 space-y-3">
            {items.map((item) => (
              <div key={item.productId} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4">
                {/* Image */}
                <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden shrink-0 relative">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-contain p-2" sizes="80px" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm leading-snug line-clamp-2">{item.name}</p>
                  <p className="text-gray-500 text-sm mt-0.5">KES {item.price.toLocaleString()}</p>

                  {/* Qty control */}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-2 py-1">
                      <button
                        onClick={() =>
                          item.quantity > 1
                            ? dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity - 1 }))
                            : dispatch(removeFromCart(item.productId))
                        }
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-600 hover:bg-white hover:text-gray-900 transition-all text-lg font-light"
                      >
                        −
                      </button>
                      <span className="text-sm font-semibold text-gray-900 min-w-[1.25rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          item.quantity < item.stock &&
                          dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity + 1 }))
                        }
                        disabled={item.quantity >= item.stock}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-600 hover:bg-white hover:text-gray-900 transition-all disabled:opacity-30 text-lg font-light"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subtotal + remove */}
                <div className="flex flex-col items-end justify-between shrink-0">
                  <button
                    onClick={() => dispatch(removeFromCart(item.productId))}
                    className="text-gray-300 hover:text-red-400 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <span className="font-semibold text-gray-900 text-sm">
                    KES {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <h2 className="font-semibold text-gray-900 mb-5">Order Summary</h2>

              <div className="space-y-3 text-sm mb-5">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                  <span>KES {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  {shippingFee === 0 ? (
                    <span className="text-kenya-green font-medium">Free</span>
                  ) : (
                    <span>KES {shippingFee.toLocaleString()}</span>
                  )}
                </div>
                {shippingFee > 0 && (
                  <p className="text-xs text-gray-400">
                    Add KES {(10_000 - total).toLocaleString()} more for free delivery
                  </p>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between font-bold text-gray-900">
                  <span>Total</span>
                  <span>KES {orderTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                className="w-full py-3.5 bg-kenya-green text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all active:scale-[0.98]"
                onClick={() => alert('Checkout coming soon — M-Pesa integration in progress')}
              >
                Checkout with M-Pesa
              </button>

              <Link
                href="/products"
                className="block text-center text-sm text-gray-500 hover:text-gray-700 mt-4 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
