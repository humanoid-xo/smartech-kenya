'use client';
import Image   from 'next/image';
import Link    from 'next/link';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState }    from '@/store';
import { removeFromCart, updateQuantity, clearCart } from '@/store/slices/cartSlice';

const WA = '254746722417';

function buildMsg(items: any[], total: number) {
  const lines = items.map(i => `• ${i.name} ×${i.quantity} — KES ${(i.price * i.quantity).toLocaleString()}`).join('\n');
  return encodeURIComponent(`Hello Smartech Kenya!\n\nI'd like to order:\n\n${lines}\n\nTotal: KES ${total.toLocaleString()}\n\nPlease confirm availability and delivery. Thank you!`);
}

function CheckoutModal({ items, total, onClose }: { items: any[]; total: number; onClose: () => void }) {
  const msg = buildMsg(items, total);
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-white w-full max-w-md shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="px-6 pt-6 pb-5 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Place Your Order</h2>
              <p className="text-gray-400 text-sm mt-0.5">Choose how to reach us</p>
            </div>
            <button onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div className="mt-4 bg-gray-50 border border-gray-200 px-5 py-3.5 flex justify-between items-center">
            <span className="text-gray-400 text-sm">{items.length} item{items.length > 1 ? 's' : ''}</span>
            <span className="font-bold text-gray-900 text-lg">KES {total.toLocaleString()}</span>
          </div>
        </div>

        {/* Channels */}
        <div className="px-6 py-5 space-y-3">
          {[
            { label: 'WhatsApp', sub: 'Chat directly — fastest response', href: `https://wa.me/${WA}?text=${msg}`, color: '#25D366', icon: 'wa' },
            { label: 'Instagram', sub: 'DM us your order', href: 'https://instagram.com/smartechkenya', color: '#E1306C', icon: 'ig' },
            { label: 'TikTok', sub: 'Find us and send a DM', href: 'https://tiktok.com/@smartechkenya', color: '#010101', icon: 'tt' },
          ].map(c => (
            <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 border border-gray-200 hover:border-gray-300
                         hover:shadow-sm transition-all group">
              <div className="w-10 h-10 flex items-center justify-center shrink-0"
                style={{ background: c.color }}>
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  {c.icon === 'wa' && <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>}
                  {c.icon === 'ig' && <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>}
                  {c.icon === 'tt' && <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.24 8.24 0 004.84 1.56V6.78a4.85 4.85 0 01-1.07-.09z"/>}
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">{c.label}</p>
                <p className="text-gray-400 text-xs mt-0.5">{c.sub}</p>
              </div>
              <svg className="w-4 h-4 text-gray-300 group-hover:translate-x-0.5 group-hover:text-gray-500 transition-all"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </a>
          ))}
        </div>

        <div className="px-6 pb-6">
          <p className="text-center text-gray-400 text-xs">
            We'll confirm your order, arrange delivery and share payment details via your chosen channel.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const dispatch = useDispatch();
  const { items, total } = useSelector((s: RootState) => s.cart);
  const [checkout, setCheckout] = useState(false);
  const delivery   = total >= 5000 ? 0 : 350;
  const grandTotal = total + delivery;

  if (!items.length) return (
    <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center px-6">
      <div className="text-center">
        <div className="w-16 h-16 border border-gray-200 bg-white flex items-center justify-center mx-auto mb-6">
          <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
        </div>
        <p className="eyebrow mb-3">Cart</p>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 text-sm mb-8">Add products to get started.</p>
        <Link href="/products" className="btn-primary px-8 py-3.5">Shop Now</Link>
      </div>
    </div>
  );

  return (
    <>
      {checkout && <CheckoutModal items={items} total={grandTotal} onClose={() => setCheckout(false)}/>}

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 py-10 px-6">
          <div className="max-w-[1320px] mx-auto flex items-baseline justify-between">
            <div>
              <p className="eyebrow mb-2">Shopping</p>
              <h1 className="text-3xl font-semibold text-gray-900">Your Cart
                <span className="text-gray-300 font-normal text-xl ml-3">({items.length})</span>
              </h1>
            </div>
            <button onClick={() => dispatch(clearCart())}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium">
              Clear all
            </button>
          </div>
        </div>

        <div className="max-w-[1320px] mx-auto px-6 py-10">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Items */}
            <div className="flex-1 space-y-3">
              {items.map(item => (
                <div key={item.productId}
                  className="bg-white border border-gray-200 p-5 flex gap-4 hover:border-gray-300 transition-colors">
                  <div className="w-24 h-24 bg-gray-50 overflow-hidden relative shrink-0 border border-gray-100">
                    {item.image
                      ? <Image src={item.image} alt={item.name} fill sizes="96px" className="object-contain p-2"/>
                      : <div className="absolute inset-0 bg-gray-100"/>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 line-clamp-2 leading-snug mb-2.5">{item.name}</p>
                    <p className="font-bold text-gray-900">KES {item.price.toLocaleString()}</p>
                    {/* Qty stepper */}
                    <div className="flex items-center gap-0 mt-3 border border-gray-200 w-fit">
                      <button
                        onClick={() => item.quantity > 1
                          ? dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity - 1 }))
                          : dispatch(removeFromCart(item.productId))}
                        className="w-9 h-9 flex items-center justify-center text-gray-400 hover:bg-gray-50
                                   text-lg font-light transition-colors border-r border-gray-200">−</button>
                      <span className="w-9 text-center text-sm font-semibold text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => item.quantity < item.stock && dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity + 1 }))}
                        disabled={item.quantity >= item.stock}
                        className="w-9 h-9 flex items-center justify-center text-gray-400 hover:bg-gray-50
                                   text-lg font-light transition-colors border-l border-gray-200 disabled:opacity-30">+</button>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between items-end shrink-0">
                    <button onClick={() => dispatch(removeFromCart(item.productId))}
                      className="text-gray-300 hover:text-red-400 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                    <span className="font-bold text-gray-900 text-sm">
                      KES {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="w-full lg:w-80 shrink-0">
              <div className="bg-white border border-gray-200 p-7 sticky top-[88px]">
                <h2 className="font-semibold text-gray-900 mb-6">Order Summary</h2>
                <div className="space-y-3 text-sm mb-5">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal ({items.length} item{items.length > 1 ? 's' : ''})</span>
                    <span className="text-gray-900 font-medium">KES {total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Delivery</span>
                    {delivery === 0
                      ? <span className="text-green-600 font-semibold">Free</span>
                      : <span className="text-gray-900 font-medium">KES {delivery.toLocaleString()}</span>}
                  </div>
                  {delivery > 0 && (
                    <p className="text-xs text-blue-700 bg-blue-50 px-3 py-2">
                      Add KES {(5000 - total).toLocaleString()} more for free delivery
                    </p>
                  )}
                </div>
                <div className="border-t border-gray-200 pt-4 mb-6 flex justify-between items-baseline">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-xl text-gray-900">KES {grandTotal.toLocaleString()}</span>
                </div>
                <button onClick={() => setCheckout(true)}
                  className="btn-primary w-full py-4 mb-3 text-sm gap-2.5">
                  Proceed to Order
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </button>
                <Link href="/products"
                  className="block text-center text-xs text-gray-400 hover:text-gray-700 transition-colors">
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
