import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import { PrimeReactProvider } from 'primereact/api';
import Providers from '@/components/providers';
import Nprogressprovider from '@/components/nprogress-provider';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'FishDirect Farmer Portal',
  description: 'Manage your fish farm harvests and customers',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="font-sans antialiased bg-[#F4F7F6] text-zinc-900" suppressHydrationWarning>
        <Providers>
          <PrimeReactProvider>
            <Nprogressprovider>
              {children}
            </Nprogressprovider>
          </PrimeReactProvider>
        </Providers>
      </body>
    </html>
  );
}
