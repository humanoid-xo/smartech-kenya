'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingAddress: { name: string; phone: string; address: string; city: string; county: string };
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const paymentColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
};

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login?redirect=/orders'); return; }
    if (status === 'authenticated') fetchOrders();
  }, [status]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-neutral-50">
          <div className="container-custom py-8">
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="skeleton h-6 w-1/3 mb-4 rounded" />
                  <div className="skeleton h-4 w-1/2 rounded" />
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50">
        <div className="container-custom py-8">
          <h1 className="text-3xl font-display font-bold text-neutral-900 mb-8">My Orders</h1>

          {orders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
              <svg className="w-20 h-20 text-neutral-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h2 className="text-2xl font-bold text-neutral-600 mb-3">No orders yet</h2>
              <p className="text-neutral-400 mb-8">You haven't placed any orders. Start shopping!</p>
              <Link href="/products" className="btn-primary px-8 py-3">Browse Products</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {/* Order Header */}
                  <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100">
                    <div>
                      <p className="text-xs text-neutral-400 mb-1">ORDER ID</p>
                      <p className="font-mono font-semibold text-neutral-700 text-sm">{order.id}</p>
                      <p className="text-sm text-neutral-500 mt-1">{new Date(order.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusColors[order.status] || 'bg-neutral-100 text-neutral-600'}`}>
                        {order.status}
                      </span>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${paymentColors[order.paymentStatus] || 'bg-neutral-100 text-neutral-600'}`}>
                        Payment: {order.paymentStatus}
                      </span>
                      <span className="font-bold text-primary-500 text-lg">KES {order.total.toLocaleString()}</span>
                    </div>

                    <button
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      className="text-sm text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1"
                    >
                      {expandedOrder === order.id ? 'Hide' : 'View'} Details
                      <svg className={`w-4 h-4 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Order Items Preview */}
                  <div className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <span>{(order.items as OrderItem[]).length} item(s)</span>
                      <span>•</span>
                      <span>{(order.items as OrderItem[]).map((i) => i.name).join(', ').slice(0, 60)}...</span>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedOrder === order.id && (
                    <div className="px-6 pb-6 border-t border-neutral-100 pt-6">
                      <div className="grid md:grid-cols-2 gap-8">
                        {/* Items */}
                        <div>
                          <h3 className="font-bold text-neutral-700 mb-4">Items Ordered</h3>
                          <div className="space-y-3">
                            {(order.items as OrderItem[]).map((item, i) => (
                              <div key={i} className="flex justify-between items-center text-sm">
                                <div>
                                  <p className="font-medium text-neutral-800">{item.name}</p>
                                  <p className="text-neutral-500">Qty: {item.quantity} × KES {item.price.toLocaleString()}</p>
                                </div>
                                <span className="font-semibold">KES {(item.price * item.quantity).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                          <div className="border-t border-neutral-100 mt-4 pt-4 flex justify-between font-bold">
                            <span>Total</span>
                            <span className="text-primary-500">KES {order.total.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Shipping Address */}
                        <div>
                          <h3 className="font-bold text-neutral-700 mb-4">Shipping Address</h3>
                          <div className="text-sm text-neutral-600 space-y-1">
                            <p className="font-semibold text-neutral-800">{order.shippingAddress.name}</p>
                            <p>{order.shippingAddress.phone}</p>
                            <p>{order.shippingAddress.address}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.county}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
