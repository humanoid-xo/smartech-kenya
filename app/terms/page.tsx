import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Terms of Use — Smartech Kenya' };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="page-hero">
        <div className="max-w-3xl mx-auto">
          <p className="eyebrow mb-4 text-blue-300">Legal</p>
          <h1 className="text-4xl font-semibold text-white">Terms of Use</h1>
          <p className="text-blue-200 text-sm mt-2">Last updated: January 2025</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="space-y-10">
          {[
            { t: 'Acceptance of Terms', b: 'By browsing or purchasing from Smartech Kenya, you agree to these Terms of Use. If you do not agree, please do not use our services.' },
            { t: 'Products & Pricing',  b: 'All products are genuine and sourced from authorised distributors. Prices are listed in Kenya Shillings (KES) and are subject to change without notice. We reserve the right to refuse any order.' },
            { t: 'Orders & Payment',    b: 'Orders are placed and confirmed via WhatsApp, Instagram or TikTok. Payment details are shared upon order confirmation. We accept M-Pesa, bank transfer and cash on delivery within Nairobi (subject to availability).' },
            { t: 'Delivery',            b: 'We offer same-day and next-day delivery within Nairobi. Nationwide delivery takes 1–3 business days. Delivery fees apply for orders under KES 5,000. Delivery times are estimates and not guaranteed.' },
            { t: 'Returns & Exchanges', b: 'We accept returns and exchanges within 7 days of delivery for products in original condition with original packaging. Contact us via WhatsApp to initiate a return. Damaged or defective products are replaced at no cost.' },
            { t: 'Warranties',          b: 'All products carry the manufacturer\'s warranty. Warranty terms vary by product and brand. Contact us for warranty claims and we will assist you with the manufacturer\'s process.' },
            { t: 'Limitation of Liability', b: 'Smartech Kenya is not liable for any indirect, incidental or consequential damages arising from the use of our products or services beyond the value of the product purchased.' },
            { t: 'Governing Law',       b: 'These terms are governed by the laws of Kenya. Any disputes shall be resolved in the courts of Nairobi, Kenya.' },
          ].map(s => (
            <div key={s.t}>
              <h2 className="text-base font-bold text-gray-900 mb-3 pb-3 border-b border-gray-100">{s.t}</h2>
              <p className="text-gray-500 text-sm leading-relaxed">{s.b}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
