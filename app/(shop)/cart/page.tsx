'use client';

import Image      from 'next/image';
import Link       from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { RootState }      from '@/store';
import { removeFromCart, updateQuantity, clearCart } from '@/store/slices/cartSlice';

export default function CartPage() {
  const dispatch = useDispatch();
  const { items, total } = useSelector((s: RootState) => s.cart);
  const delivery   = total >= 5000 ? 0 : 350;
  const grandTotal = total + delivery;

  if (!items.length) return (
    <div className="min-h-screen bg-cream-warm pt-[68px] flex items-center justify-center px-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-white rounded-2xl border border-cream-warm flex items-center justify-center mx-auto mb-6">
          <svg className="w-9 h-9 text-cream-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
        </div>
        <h2 className="font-display text-ink text-4xl font-light mb-2">Your cart is empty</h2>
        <p className="text-ink-faint text-sm mb-8">Add something great to get started.</p>
        <Link href="/products" className="btn-dark px-8 py-4">Shop Now</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream-warm pt-[68px] pb-16">
      <div className="max-w-[1320px] mx-auto px-6 py-12">

        <div className="flex justify-between items-baseline mb-10">
          <h1 className="font-display text-ink" style={{ fontSize: 'clamp(2.5rem,5vw,4rem)', fontWeight: 400 }}>
            Your Cart
          </h1>
          <button onClick={() => dispatch(clearCart())} className="text-sm text-ink-faint hover:text-ink transition-colors">
            Clear all
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Items */}
          <div className="flex-1 space-y-3">
            {items.map(item => (
              <div key={item.productId} className="bg-white rounded-2xl border border-cream-warm p-5 flex gap-4">
                <div className="w-24 h-24 bg-cream rounded-xl overflow-hidden relative shrink-0">
                  {item.image
                    ? <Image src={item.image} alt={item.name} fill sizes="96px" className="object-contain p-3"/>
                    : <div className="absolute inset-0 bg-cream-warm"/>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-ink line-clamp-2 leading-snug mb-3">{item.name}</p>
                  <p className="font-display text-ink text-lg font-medium">KES {item.price.toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-3 bg-cream rounded-xl w-fit px-2 py-1.5 border border-cream-warm">
                    <button
                      onClick={() => item.quantity > 1
                        ? dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity - 1 }))
                        : dispatch(removeFromCart(item.productId))
                      }
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white transition-all text-ink-muted text-lg font-light"
                    >−</button>
                    <span className="w-7 text-center text-sm font-semibold text-ink">{item.quantity}</span>
                    <button
                      onClick={() => item.quantity < item.stock && dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity + 1 }))}
                      disabled={item.quantity >= item.stock}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white transition-all text-ink-muted text-lg font-light disabled:opacity-30"
                    >+</button>
                  </div>
                </div>
                <div className="flex flex-col justify-between items-end shrink-0">
                  <button onClick={() => dispatch(removeFromCart(item.productId))}
                    className="text-cream-muted hover:text-red-400 transition-colors p-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                  <span className="font-display text-ink font-medium">KES {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-2xl border border-cream-warm p-7 sticky top-[88px]">
              <h2 className="font-semibold text-ink mb-6">Order Summary</h2>
              <div className="space-y-3.5 text-sm mb-6 text-ink-faint">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-ink font-medium">KES {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  {delivery === 0
                    ? <span className="text-forest-600 font-semibold">Free</span>
                    : <span className="text-ink font-medium">KES {delivery.toLocaleString()}</span>
                  }
                </div>
                {delivery > 0 && (
                  <p className="text-xs text-cream-muted">
                    Add KES {(5000 - total).toLocaleString()} more for free delivery
                  </p>
                )}
              </div>
              <div className="border-t border-cream-warm pt-5 mb-6 flex justify-between">
                <span className="font-bold text-ink">Total</span>
                <span className="font-display text-xl font-medium text-ink">KES {grandTotal.toLocaleString()}</span>
              </div>
              <button className="w-full py-4 bg-forest-600 text-cream text-sm font-semibold rounded-xl hover:bg-forest-500 transition-all active:scale-[0.98] mb-3">
                Checkout with M-Pesa
              </button>
              <Link href="/products"
                className="block text-center text-sm text-ink-faint hover:text-ink mt-4 transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
