import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | Northeast Shipping & Recruitment Agency Pvt Ltd',
    default: 'Northeast Shipping & Recruitment Agency Pvt Ltd | Maritime Careers & Training'
  },
  description: 'Official maritime recruitment and professional training facilitator specializing in Merchant Navy deck & engine personnel, luxury cruise ship hospitality, and offline cadet training admissions.',
  keywords: [
    'Northeast Shipping',
    'Merchant Navy recruitment',
    'Cruise ship jobs',
    'Seafarer careers',
    'Maritime offline training',
    'GP Rating admission',
    'DNS cadetship',
    'STCW certification'
  ],
  authors: [{ name: 'Northeast Shipping & Recruitment Agency Pvt Ltd' }],
  metadataBase: new URL('https://northeastshipping.com')
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-navy-950 text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
