'use client';

import { useState } from 'react';
import Image from 'next/image';

export function ContactWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-3">

      {/* ── Popup card ── */}
      {open && (
        <div
          className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.18)] w-[280px] overflow-hidden"
          style={{ animation: 'scale-in 0.2s cubic-bezier(0.22,1,0.36,1) forwards', transformOrigin: 'bottom right' }}>

          {/* Header strip */}
          <div className="bg-[#6D28D9] px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">Customer Care</p>
                <p className="text-white/70 text-[11px]">Smartech Kenya</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)}
              className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Logo + message */}
          <div className="px-5 pt-5 pb-2 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-3 border border-purple-100">
              <Image src="/logo.png" alt="Smartech Kenya" width={52} height={52} className="object-contain"/>
            </div>
            <p className="text-ink text-sm font-semibold mb-1">Smartech Kenya</p>
            <p className="text-ink-faint text-xs leading-relaxed">
              Want to make an enquiry? Reach out, and our team will guide you to the ideal choice.
            </p>
          </div>

          {/* Action buttons */}
          <div className="px-5 pb-5 pt-4 space-y-2.5">
            <a href="tel:+254746722417"
              className="flex items-center justify-center gap-2.5 w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: '#1D6AED' }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              +254 746 722 417
            </a>
            <a href="https://wa.me/254746722417?text=Hi%20Smartech%20Kenya%2C%20I%20need%20help"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 w-full py-3 rounded-xl text-sm font-semibold text-white bg-[#25D366] hover:bg-[#20BD5A] transition-all active:scale-[0.98]">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* ── Floating trigger button ── */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Customer Care"
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(29,106,237,0.45)] text-white transition-all hover:scale-105 active:scale-95"
        style={{ background: open ? '#6D28D9' : '#1D6AED' }}>
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
          </svg>
        )}
      </button>
    </div>
  );
}
