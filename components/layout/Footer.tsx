import Link  from 'next/link';
import Image from 'next/image';

const PHONE   = '+254746722417';
const DISPLAY = '+254 746 722 417';
const WA_MSG  = encodeURIComponent('Hi Smartech Kenya, I want to make an enquiry.');

export function Footer() {
  return (
    <footer className="bg-[#111111] text-white/60 text-sm">

      {/* ── CTA bar ── */}
      <div className="border-b border-white/[0.08] py-8 px-6">
        <div className="max-w-[1320px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-semibold text-base">Ready to upgrade your home?</p>
            <p className="text-white/50 text-xs mt-0.5">Talk to us on WhatsApp — orders placed in minutes.</p>
          </div>
          <a
            href={`https://wa.me/${PHONE.replace('+','')}?text=${WA_MSG}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white text-sm font-bold hover:bg-[#20c05c] transition-colors shrink-0">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp Us Now
          </a>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="max-w-[1320px] mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="lg:col-span-1">
          <div className="mb-5">
            <span className="text-white font-bold text-xl tracking-tight">Smartech Kenya</span>
          </div>
          <p className="text-white/45 text-xs leading-relaxed mb-6 max-w-[220px]">
            Premium electronics and home appliances for the modern Kenyan home.
            Genuine products, fast delivery across Nairobi.
          </p>
          {/* Contact */}
          <div className="space-y-2.5">
            <a href={`tel:${PHONE}`}
              className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors">
              <svg className="w-3.5 h-3.5 text-[#F97316] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              {DISPLAY}
            </a>
            <a href="mailto:smartechkenya01@gmail.com"
              className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors">
              <svg className="w-3.5 h-3.5 text-[#F97316] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              smartechkenya01@gmail.com
            </a>
            <div className="flex items-start gap-2 text-xs text-white/50">
              <svg className="w-3.5 h-3.5 text-[#F97316] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              Gaberone Plaza, 4th Floor,<br/>Shop A13, Nairobi
            </div>
          </div>
          {/* Social */}
          <div className="flex gap-3 mt-6">
            {[
              { href: `https://wa.me/${PHONE.replace('+','')}`, label: 'WhatsApp',
                icon: <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>, fill: true },
              { href: 'https://instagram.com/smartechkenya', label: 'Instagram',
                icon: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></>, fill: false },
              { href: 'https://tiktok.com/@smartechkenya', label: 'TikTok',
                icon: <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.77a4.85 4.85 0 01-1.01-.08z"/>, fill: true },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                aria-label={s.label}
                className="w-8 h-8 rounded-full bg-white/[0.07] hover:bg-white/[0.14] flex items-center justify-center transition-colors">
                <svg className="w-3.5 h-3.5 text-white/60" viewBox="0 0 24 24"
                  fill={s.fill ? 'currentColor' : 'none'}
                  stroke={s.fill ? 'none' : 'currentColor'}
                  strokeWidth={s.fill ? undefined : 1.5}>
                  {s.icon}
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Shop — 4 items */}
        <div>
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/30 mb-5">Shop</p>
          <ul className="space-y-3">
            {[
              { label: 'Smartphones',    href: '/products?category=SMARTPHONES'  },
              { label: 'Laptops',        href: '/products?category=LAPTOPS'       },
              { label: 'Smart TVs',      href: '/products?category=AUDIO_TV'      },
              { label: 'All Products',   href: '/products'                        },
            ].map(l => (
              <li key={l.label}>
                <Link href={l.href}
                  className="text-white/50 hover:text-white transition-colors text-xs">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Appliances — 4 items */}
        <div>
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/30 mb-5">Appliances</p>
          <ul className="space-y-3">
            {[
              { label: 'Washing Machines', href: '/products?subcategory=washing-machines' },
              { label: 'Fridges',          href: '/products?subcategory=fridges'           },
              { label: 'Cookers & Ovens',  href: '/products?subcategory=cookers'           },
              { label: 'Air Conditioners', href: '/products?subcategory=air-conditioners'  },
            ].map(l => (
              <li key={l.label}>
                <Link href={l.href}
                  className="text-white/50 hover:text-white transition-colors text-xs">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support — 4 items + trust */}
        <div>
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/30 mb-5">Support</p>
          <ul className="space-y-3 mb-6">
            {[
              { label: 'Track Order',       href: '/track-order'  },
              { label: 'Contact Us',        href: '/contact'      },
              { label: 'WhatsApp Support',  href: `https://wa.me/${PHONE.replace('+','')}` },
              { label: 'Privacy Policy',    href: '/privacy'      },
            ].map(l => (
              <li key={l.label}>
                <Link href={l.href}
                  className="text-white/50 hover:text-white transition-colors text-xs">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="space-y-1.5">
            {['Genuine products guaranteed','Same-day Nairobi delivery','Next-day nationwide'].map(t => (
              <div key={t} className="flex items-center gap-1.5">
                <svg className="w-3 h-3 text-[#F97316] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                </svg>
                <span className="text-white/35 text-[10px]">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/[0.06] py-5 px-6">
        <div className="max-w-[1320px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-white/25">
          <p>© {new Date().getFullYear()} Smartech Kenya. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy</Link>
            <Link href="/terms"   className="hover:text-white/60 transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-white/60 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
