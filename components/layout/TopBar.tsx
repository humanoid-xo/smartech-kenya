import Link from 'next/link';

export function TopBar() {
  return (
    <div className="bg-[#111111] border-b border-white/[0.06]">
      <div className="max-w-[1320px] mx-auto px-6 h-9 flex items-center justify-between">

        {/* LEFT — location */}
        <div className="flex items-center gap-1.5">
          <svg className="w-3 h-3 shrink-0 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span className="text-[11px] text-white/50 tracking-wide">
            Gaberone Plaza, 4th Floor, Shop A13 — Nairobi
          </span>
        </div>

        {/* RIGHT — hours + phone */}
        <div className="hidden sm:flex items-center gap-5">
          <span className="text-[11px] text-white/40">Mon–Sat 8am–7pm</span>
          <a
            href="tel:+254746722417"
            className="flex items-center gap-1.5 text-[11px] text-white/50 hover:text-white transition-colors">
            <svg className="w-3 h-3 text-[#F97316] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            +254 746 722 417
          </a>
        </div>

      </div>
    </div>
  );
}
