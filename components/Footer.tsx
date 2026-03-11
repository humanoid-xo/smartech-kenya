import Link from 'next/link'
import { CATEGORIES, POPULAR_BRANDS } from '@/constants/categories'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-navy-900 text-white">

      {/* Newsletter */}
      <div className="bg-primary-700 border-b border-primary-600">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <h3 className="font-heading text-xl font-bold">Get the best deals first 🔥</h3>
            <p className="text-primary-200 text-sm mt-0.5">Exclusive offers, new arrivals & tech tips — weekly</p>
          </div>
          <form className="flex gap-2 w-full sm:w-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 sm:w-72 px-4 py-2.5 rounded-xl bg-white/15 text-white placeholder-primary-200 border border-primary-400 focus:outline-none focus:border-white text-sm transition-colors"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 transition-colors text-sm whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-heading font-black text-xl leading-none">S</span>
              </div>
              <span className="font-heading font-bold text-xl">Smartech Kenya</span>
            </Link>
            <p className="text-navy-400 text-sm leading-relaxed mb-5">
              Kenya's premier marketplace for tech gadgets and home appliances. Quality products, M-Pesa payments, fast Nairobi delivery.
            </p>
            <div className="flex gap-2">
              {[
                { label: 'FB', href: '#' },
                { label: 'IG', href: '#' },
                { label: 'TW', href: '#' },
                { label: 'WA', href: '#' },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="w-8 h-8 bg-navy-700 rounded-lg flex items-center justify-center text-xs text-navy-400 font-bold hover:bg-primary-600 hover:text-white transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-navy-400 mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {CATEGORIES.flatMap((c) =>
                c.subcategories.slice(0, 4).map((sub) => ({
                  label: sub.name,
                  href: `/products?category=${c.enum}&subcategory=${sub.slug}`,
                }))
              )
                .slice(0, 8)
                .map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-navy-400 hover:text-white text-sm transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-navy-400 mb-4">Help</h4>
            <ul className="space-y-2.5">
              {[
                ['How to Order',     '/help/ordering'],
                ['Delivery Info',    '/help/delivery'],
                ['Returns Policy',   '/help/returns'],
                ['M-Pesa Payments',  '/help/mpesa'],
                ['Track My Order',   '/orders'],
                ['Seller Guide',     '/seller'],
                ['Contact Us',       '/contact'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-navy-400 hover:text-white text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-navy-400 mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-navy-400">
              <li className="flex gap-2 items-start"><span>📍</span><span>Nairobi, Kenya</span></li>
              <li className="flex gap-2 items-start"><span>📞</span><span>+254 XXX XXX XXX</span></li>
              <li className="flex gap-2 items-start">
                <span>✉️</span>
                <a href="mailto:support@smartechkenya.com" className="hover:text-white transition-colors break-all">
                  support@smartechkenya.com
                </a>
              </li>
              <li className="flex gap-2 items-start"><span>🕐</span><span>Mon–Sat: 8am – 6pm</span></li>
            </ul>

            {/* M-Pesa badge */}
            <div className="mt-5 inline-flex items-center gap-2 bg-navy-800 px-3 py-2 rounded-xl border border-navy-700">
              <span className="text-green-400 font-heading font-black text-sm tracking-wide">M-PESA</span>
              <span className="text-navy-400 text-xs">Accepted</span>
            </div>
          </div>
        </div>

        {/* Brands */}
        <div className="mt-10 pt-8 border-t border-navy-800">
          <p className="text-navy-500 text-[11px] font-bold uppercase tracking-widest mb-3">
            Trusted Brands Available
          </p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_BRANDS.map((brand) => (
              <Link
                key={brand}
                href={`/products?brand=${brand}`}
                className="px-3 py-1.5 bg-navy-800 text-navy-400 text-xs rounded-lg hover:bg-navy-700 hover:text-white transition-colors border border-navy-700 font-medium"
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-navy-800 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-navy-500">
          <p>© {year} Smartech Kenya. All rights reserved. Built with ❤️ in Kenya.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-navy-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms"   className="hover:text-navy-300 transition-colors">Terms of Use</Link>
            <Link href="/seller"  className="hover:text-navy-300 transition-colors">Become a Seller</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
