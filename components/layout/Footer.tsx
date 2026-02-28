import Link from 'next/link';

const COLUMNS = {
  'Shop': [
    { label: 'Smartphones & Tablets', href: '/products?category=SMARTPHONES'    },
    { label: 'Laptops & Computers',   href: '/products?category=LAPTOPS'        },
    { label: 'Home Appliances',       href: '/products?category=HOME_APPLIANCES'},
    { label: 'Kitchen Appliances',    href: '/products?category=KITCHEN'        },
    { label: 'Audio & Television',    href: '/products?category=AUDIO_TV'       },
    { label: 'Smart Home',            href: '/products?category=SMART_HOME'     },
  ],
  'Company': [
    { label: 'About Us',  href: '/about'   },
    { label: 'Blog',      href: '/blog'    },
    { label: 'Careers',   href: '/careers' },
  ],
  'Support': [
    { label: 'Help Center',  href: '/help'    },
    { label: 'Track Order',  href: '/orders'  },
    { label: 'Returns',      href: '/returns' },
    { label: 'Contact Us',   href: '/contact' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-gray-900 font-bold text-sm">S</span>
              </div>
              <span className="font-display text-lg text-white">Smartech</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
              Kenya&apos;s premium marketplace for electronics and home appliances.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-kenya-green animate-pulse" />
              <span className="text-[11px] text-white/40">M-Pesa accepted</span>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(COLUMNS).map(([col, links]) => (
            <div key={col}>
              <div className="text-white/60 text-[11px] font-bold uppercase tracking-widest mb-5">{col}</div>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-white/35 text-sm hover:text-white/70 transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-white/20 text-xs">
            &copy; {new Date().getFullYear()} Smartech Kenya Ltd. All rights reserved.
          </span>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Cookies'].map((item) => (
              <Link key={item} href={`/${item.toLowerCase()}`} className="text-white/20 text-xs hover:text-white/50 transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
