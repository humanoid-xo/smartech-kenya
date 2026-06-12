import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Privacy Policy — Smartech Kenya' };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="page-hero">
        <div className="max-w-3xl mx-auto">
          <p className="eyebrow mb-4 text-blue-300">Legal</p>
          <h1 className="text-4xl font-semibold text-white">Privacy Policy</h1>
          <p className="text-blue-200 text-sm mt-2">Last updated: January 2025</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Prose>
          <Section title="Information We Collect">
            When you place an order or contact us, we may collect your name, phone number, email address and delivery address. We only collect information necessary to process your order and provide customer support.
          </Section>
          <Section title="How We Use Your Information">
            We use your information to process orders, arrange delivery, send order confirmations, and provide customer support. We do not sell, rent or share your personal information with third parties for marketing purposes.
          </Section>
          <Section title="WhatsApp & Social Media">
            When you contact us via WhatsApp, Instagram or TikTok, your conversation is subject to those platforms' privacy policies. We use these channels solely for order processing and customer support.
          </Section>
          <Section title="Data Security">
            We take reasonable steps to protect your personal information. Our website uses HTTPS encryption. We do not store payment card details.
          </Section>
          <Section title="Cookies">
            Our website uses essential cookies for functionality (such as your cart). We do not use tracking or advertising cookies.
          </Section>
          <Section title="Your Rights">
            You may request access to, correction of, or deletion of your personal information by contacting us at smartechkenya01@gmail.com or +254 746 722 417.
          </Section>
          <Section title="Contact">
            For any privacy concerns, contact us at:<br/>
            Email: smartechkenya01@gmail.com<br/>
            WhatsApp: +254 746 722 417<br/>
            Address: Gaberone Plaza, 4th Floor, Shop A13, Nairobi
          </Section>
        </Prose>
      </div>
    </div>
  );
}
function Prose({ children }: { children: React.ReactNode }) {
  return <div className="space-y-10">{children}</div>;
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-base font-bold text-gray-900 mb-3 pb-3 border-b border-gray-100">{title}</h2>
      <p className="text-gray-500 text-sm leading-relaxed">{children}</p>
    </div>
  );
}
