'use client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { removeFromCart, updateQuantity, clearCart } from '@/store/slices/cartSlice';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session } = useSession();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleRemove = (id: string, name: string) => {
    dispatch(removeFromCart(id));
    toast.success(`${name} removed from cart`);
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleCheckout = () => {
    if (!session) {
      toast.error('Please sign in to checkout');
      router.push('/login?redirect=/cart');
      return;
    }
    router.push('/orders');
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50">
        <div className="container-custom py-8">
          <h1 className="text-3xl font-display font-bold text-neutral-900 mb-8">Shopping Cart</h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
              <svg className="w-20 h-20 text-neutral-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h2 className="text-2xl font-bold text-neutral-600 mb-3">Your cart is empty</h2>
              <p className="text-neutral-400 mb-8">Looks like you haven't added any items yet.</p>
              <Link href="/products" className="btn-primary px-8 py-3">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-neutral-600">{itemCount} item(s)</p>
                  <button
                    onClick={() => { dispatch(clearCart()); toast.success('Cart cleared'); }}
                    className="text-sm text-red-500 hover:text-red-600 font-medium"
                  >
                    Clear All
                  </button>
                </div>

                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-sm p-6 flex gap-6">
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-100">
                      <Image src={item.image || '/placeholder.png'} alt={item.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1">
                      <Link href={`/products/${item.id}`} className="font-semibold text-neutral-900 hover:text-primary-500 transition-colors line-clamp-2">
                        {item.name}
                      </Link>
                      <p className="text-primary-500 font-bold text-lg mt-1">KES {item.price.toLocaleString()}</p>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-neutral-200 rounded-lg">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="px-3 py-1.5 hover:bg-neutral-100 disabled:opacity-40 transition-colors"
                          >-</button>
                          <span className="px-3 py-1.5 font-semibold min-w-[2.5rem] text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className="px-3 py-1.5 hover:bg-neutral-100 disabled:opacity-40 transition-colors"
                          >+</button>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="font-bold text-neutral-900">KES {(item.price * item.quantity).toLocaleString()}</span>
                          <button
                            onClick={() => handleRemove(item.id, item.name)}
                            className="text-neutral-400 hover:text-red-500 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                  <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-neutral-600">
                      <span>Subtotal ({itemCount} items)</span>
                      <span>KES {total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-neutral-600">
                      <span>Delivery</span>
                      <span className="text-green-600 font-medium">Calculated at checkout</span>
                    </div>
                    <div className="border-t border-neutral-100 pt-3 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary-500">KES {total.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full btn-primary py-3 text-lg font-semibold rounded-xl"
                  >
                    Proceed to Checkout
                  </button>

                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-neutral-500">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span>Secure M-Pesa Payment</span>
                  </div>

                  <Link href="/products" className="mt-4 block text-center text-sm text-primary-500 hover:text-primary-600 font-medium">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
