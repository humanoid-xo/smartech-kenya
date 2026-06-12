import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Track Your Order — Smartech Kenya',
  description: 'Track your Smartech Kenya order via WhatsApp or email.',
};

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="page-hero">
        <div className="max-w-2xl mx-auto">
          <p className="eyebrow mb-4 text-blue-300">Orders</p>
          <h1 className="text-4xl md:text-5xl font-semibold text-white tracking-tight mb-3">Track Your Order</h1>
          <p className="text-blue-200 text-base leading-relaxed">
            Get a real-time update on your delivery within minutes.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-16">

        <div className="border border-gray-200 p-8 mb-6 bg-white">
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            Send us your <strong className="text-gray-900 font-semibold">order reference number</strong> via
            WhatsApp or email and we'll reply with a real-time delivery update.
          </p>

          <div className="space-y-3">
            {[
              {
                icon: 'wa', title: 'Track via WhatsApp', sub: 'Fastest — reply in minutes',
                href: 'https://wa.me/254746722417?text=Hi%20Smartech%20Kenya%2C%20I%27d%20like%20to%20track%20my%20order.%20My%20reference%20is%3A%20',
                color: '#25D366',
              },
              {
                icon: 'email', title: 'Track via Email', sub: 'smartechkenya01@gmail.com — within 24hrs',
                href: 'mailto:smartechkenya01@gmail.com?subject=Order%20Tracking&body=Hi%20Smartech%20Kenya%2C%0A%0AI%27d%20like%20to%20track%20my%20order.%20My%20reference%20number%20is%3A%20',
                color: '#003A7A',
              },
            ].map(c => (
              <a key={c.title} href={c.href} target="_blank" rel="noopener noreferrer"
                className="group flex items-center gap-4 p-5 border border-gray-200 hover:border-gray-300
                           hover:shadow-sm transition-all duration-200">
                <div className="w-10 h-10 flex items-center justify-center shrink-0"
                  style={{ background: c.color }}>
                  {c.icon === 'wa'
                    ? <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    : <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  }
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{c.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{c.sub}</p>
                </div>
                <svg className="w-4 h-4 text-gray-300 group-hover:translate-x-1 group-hover:text-gray-600 transition-all"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Info cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {[
            { title: 'Your Order Reference', desc: 'Sent to you via WhatsApp when your order was confirmed.' },
            { title: 'Nairobi Delivery',     desc: 'Same-day or next-day. Rider tracked via WhatsApp.' },
            { title: 'Nationwide Delivery',  desc: '1–3 business days. Tracking shared once dispatched.' },
          ].map(c => (
            <div key={c.title} className="border border-gray-200 p-5">
              <p className="font-semibold text-gray-900 text-xs mb-2">{c.title}</p>
              <p className="text-gray-500 text-xs leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/products" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
            Continue Shopping →
          </Link>
        </div>
      </div>
    </div>
  );
}
