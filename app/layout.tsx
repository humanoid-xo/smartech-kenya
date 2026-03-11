import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/layout/Providers';
import { Header }    from '@/components/layout/Header';
import { Footer }    from '@/components/layout/Footer';
import { Toaster }   from 'react-hot-toast';

export const metadata: Metadata = {
  title:       'Smartech Kenya — Premium Electronics & Home Appliances',
  description: "Kenya's definitive destination for tech and home appliances. Pay with M-Pesa. Fast Nairobi delivery.",
  keywords:    ['kenya', 'electronics', 'smartphones', 'laptops', 'home appliances', 'm-pesa', 'nairobi'],
  authors:     [{ name: 'Smartech Kenya' }],
  openGraph: {
    title:       'Smartech Kenya',
    description: 'Premium Electronics & Home Appliances',
    type:        'website',
    locale:      'en_KE',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
      </head>
      <body className="font-sans bg-cream text-ink">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#0C0C0C',
                color: '#F5F0E8',
                borderRadius: '14px',
                fontSize: '14px',
                padding: '12px 18px',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
