import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import './globals.css';

export const metadata: Metadata = {
  title: 'VLOOKUP Formula Builder',
  description: 'Build Excel VLOOKUP formulas visually — upload files, configure parameters with dropdowns, and generate formulas in bulk.',
  keywords: ['VLOOKUP', 'Excel', 'formula builder', 'lookup', 'data matching', 'spreadsheet'],
  // icons: {
  //   icon: '',
  // },
  openGraph: {
    title: 'VLOOKUP Formula Builder',
    description: 'Build Excel VLOOKUP formulas visually — no spreadsheet expertise required.',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.COZE_PROJECT_ENV === 'DEV';

  return (
    <html lang="en">
      <body className={`antialiased`}>
        {isDev && <Inspector />}
        {children}
      </body>
    </html>
  );
}
