import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Us — Smartech Kenya',
  description: 'Get in touch with Smartech Kenya. Order via WhatsApp, email or visit us at Gaberone Plaza, Nairobi.',
};

const CHANNELS = [
  {
    icon: 'wa', title: 'WhatsApp', subtitle: 'Fastest response',
    detail: '+254 746 722 417', note: 'Mon–Sat, 8am–7pm',
    href: 'https://wa.me/254746722417?text=Hi%20Smartech%20Kenya%2C%20I%27d%20like%20to%20get%20in%20touch',
    color: '#25D366', cta: 'Chat now',
  },
  {
    icon: 'email', title: 'Email', subtitle: 'Reply within 24 hours',
    detail: 'smartechkenya01@gmail.com', note: 'For detailed enquiries',
    href: 'mailto:smartechkenya01@gmail.com',
    color: '#003A7A', cta: 'Send email',
  },
  {
    icon: 'ig', title: 'Instagram', subtitle: 'DM us to order',
    detail: '@smartechkenya', note: 'See our latest products',
    href: 'https://instagram.com/smartechkenya',
    color: '#E1306C', cta: 'Open Instagram',
  },
  {
    icon: 'pin', title: 'Visit Us', subtitle: 'Walk-in welcome',
    detail: 'Gaberone Plaza, 4th Floor, Shop A13', note: 'Mon–Sat, 8am–7pm',
    href: 'https://maps.google.com/?q=Gaberone+Plaza+Nairobi',
    color: '#6B7280', cta: 'Get directions',
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <div className="page-hero">
        <div className="max-w-3xl mx-auto">
          <p className="eyebrow mb-4 text-blue-300">Get in touch</p>
          <h1 className="text-4xl md:text-5xl font-semibold text-white tracking-tight mb-3">Contact Us</h1>
          <p className="text-blue-200 text-base max-w-md leading-relaxed">
            We're here to help with orders, product questions, delivery and after-sales support.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">

        {/* Contact cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-16">
          {CHANNELS.map(c => (
            <a key={c.title} href={c.href} target="_blank" rel="noopener noreferrer"
              className="group card p-7 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 flex items-center justify-center"
                  style={{ background: c.color + '18', border: `1px solid ${c.color}30` }}>
                  <ChannelIcon icon={c.icon} color={c.color}/>
                </div>
                <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-600 group-hover:translate-x-0.5
                               transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-0.5">{c.title}</p>
                <p className="text-xs text-gray-400 mb-3">{c.subtitle}</p>
                <p className="text-sm font-medium text-gray-700 mb-0.5">{c.detail}</p>
                <p className="text-xs text-gray-400">{c.note}</p>
              </div>
              <span className="text-xs font-bold tracking-wide mt-auto"
                style={{ color: c.color }}>{c.cta} →</span>
            </a>
          ))}
        </div>

        {/* Hours */}
        <div className="border border-gray-200 p-8 mb-10">
          <h2 className="font-semibold text-gray-900 mb-5">Business Hours</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { day: 'Monday – Friday', hours: '8:00 AM – 7:00 PM', active: true },
              { day: 'Saturday',        hours: '8:00 AM – 7:00 PM', active: true },
              { day: 'Sunday',          hours: 'Closed',             active: false },
              { day: 'Public Holidays', hours: 'Closed',             active: false },
            ].map(h => (
              <div key={h.day} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-600">{h.day}</span>
                <span className={`text-sm font-semibold ${h.active ? 'text-gray-900' : 'text-gray-400'}`}>
                  {h.hours}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link href="/products" className="btn-primary px-8 py-3.5">Browse Products</Link>
        </div>
      </div>
    </div>
  );
}

function ChannelIcon({ icon, color }: { icon: string; color: string }) {
  const cls = "w-5 h-5";
  if (icon === 'wa') return (
    <svg className={cls} fill={color} viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
  if (icon === 'email') return (
    <svg className={cls} fill="none" stroke={color} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
    </svg>
  );
  if (icon === 'ig') return (
    <svg className={cls} fill={color} viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
  return (
    <svg className={cls} fill="none" stroke={color} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
    </svg>
  );
}
