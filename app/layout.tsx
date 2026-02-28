import type { Metadata } from 'next';
import { DM_Serif_Display, DM_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/layout/Providers';
import { Header }    from '@/components/layout/Header';
import { Footer }    from '@/components/layout/Footer';
import { Toaster }   from 'react-hot-toast';

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight:  ['400'],
  variable: '--font-display',
  display:  'swap',
});

const dmSans = DM_Sans({
  subsets:  ['latin'],
  variable: '--font-sans',
  display:  'swap',
});

export const metadata: Metadata = {
  title:       'Smartech Kenya — Premium Electronics & Home Appliances',
  description: "Kenya's premier marketplace for smartphones, laptops, home appliances, kitchen gear, and more. Quality guaranteed. Pay with M-Pesa.",
  keywords:    ['kenya', 'electronics', 'smartphones', 'laptops', 'home appliances', 'kitchen', 'm-pesa'],
  authors:     [{ name: 'Smartech Kenya' }],
  openGraph: {
    title:       'Smartech Kenya',
    description: 'Premium Electronics & Home Appliances',
    type:        'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${dmSans.variable}`}>
      <body className="font-sans antialiased bg-white text-gray-900">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
          </div>
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1d1d1f',
                color: '#fff',
                borderRadius: '12px',
                fontSize: '14px',
                padding: '12px 16px',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
