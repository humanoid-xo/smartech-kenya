import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/layout/Providers';
import { Header }    from '@/components/layout/Header';
import { Footer }    from '@/components/layout/Footer';
import { Toaster }   from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title:       'Smartech Kenya — Premium Tech & Home Appliances',
  description: "Kenya's curated destination for electronics and home appliances. MIKA, Hisense, Samsung, HP. Fast Nairobi delivery.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: '#0C0C0C',
                color: '#F5F0E8',
                borderRadius: '14px',
                fontSize: '13px',
                padding: '12px 16px',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
