import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import ToastContainer from '@/components/shared/Toast';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Helpdesk',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="font-sans antialiased"><ToastContainer />{children}</body>
    </html>
  );
}