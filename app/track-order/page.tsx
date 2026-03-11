import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Track Your Order — Smartech Kenya',
  description: 'Enter your Order ID and billing email to track the status of your Smartech Kenya order.',
};

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-cream pt-[68px]">

      {/* Header band */}
      <div className="bg-ink py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-forest-400 text-[11px] font-semibold tracking-widest uppercase mb-3">Order Status</p>
          <h1 className="font-display text-cream font-light" style={{ fontSize: 'clamp(2.5rem,5vw,4rem)' }}>
            Track Your Order
          </h1>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl border border-cream-warm p-8 sm:p-10">

          <p className="text-ink-faint text-sm leading-relaxed mb-8">
            To track your order please enter your <strong className="text-ink font-medium">Order ID</strong> in the
            box below and press the <strong className="text-ink font-medium">&quot;Track&quot;</strong> button.
            This was given to you on your receipt and in the confirmation message you received.
          </p>

          <TrackOrderForm />

          {/* Divider */}
          <div className="mt-10 pt-8 border-t border-cream-warm">
            <p className="text-ink-faint text-sm mb-4">Can&apos;t find your order ID? Contact us directly:</p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://wa.me/254746722417"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-[#25D366] text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Us
              </a>
              <a
                href="mailto:smartechkenya01@gmail.com"
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl border border-cream-warm bg-cream text-ink text-sm font-medium hover:bg-cream-warm transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                Email Us
              </a>
            </div>
          </div>
        </div>

        {/* Info cards */}
        <div className="grid sm:grid-cols-3 gap-4 mt-6">
          {[
            { icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', title: 'Order ID', body: 'Found in your WhatsApp/email confirmation from us.' },
            { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0', title: 'Nairobi Delivery', body: 'Same-day for orders before 2 PM on business days.' },
            { icon: 'M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z', title: 'Nationwide', body: 'Next-day delivery available across Kenya.' },
          ].map(({ icon, title, body }) => (
            <div key={title} className="bg-white rounded-xl border border-cream-warm p-5">
              <div className="w-9 h-9 rounded-lg bg-forest-950 flex items-center justify-center mb-3">
                <svg className="w-4 h-4 text-forest-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon}/>
                </svg>
              </div>
              <h3 className="font-semibold text-ink text-sm mb-1">{title}</h3>
              <p className="text-ink-faint text-xs leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TrackOrderForm() {
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-ink text-sm font-medium mb-2" htmlFor="order-id">
          Order ID <span className="text-red-400">*</span>
        </label>
        <input
          id="order-id"
          type="text"
          placeholder="e.g. SMK-2024-00123"
          className="w-full px-4 py-3.5 rounded-xl border border-cream-warm bg-cream text-sm text-ink placeholder-cream-muted focus:outline-none focus:border-forest-600 focus:ring-2 focus:ring-forest-600/10 transition-all"
        />
      </div>

      <div>
        <label className="block text-ink text-sm font-medium mb-2" htmlFor="billing-email">
          Billing Email <span className="text-red-400">*</span>
        </label>
        <input
          id="billing-email"
          type="email"
          placeholder="your@email.com"
          className="w-full px-4 py-3.5 rounded-xl border border-cream-warm bg-cream text-sm text-ink placeholder-cream-muted focus:outline-none focus:border-forest-600 focus:ring-2 focus:ring-forest-600/10 transition-all"
        />
        <p className="text-cream-muted text-xs mt-1.5">The email address used when placing your order</p>
      </div>

      <button
        type="button"
        className="w-full py-4 bg-ink text-cream text-sm font-semibold rounded-xl hover:bg-ink-soft transition-all active:scale-[0.98] flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"/>
        </svg>
        Track Order
      </button>
    </div>
  );
}
