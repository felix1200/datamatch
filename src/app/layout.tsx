import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import './globals.css';

export const metadata: Metadata = {
  title: 'DataMatch — Match & Look Up Data Between Excel Spreadsheets | Free VLOOKUP Alternative',
  description: 'Easily match data between two Excel files or sheets. Find values, fill columns, and merge spreadsheets without formulas. Free online VLOOKUP alternative — match columns, look up values, and fill data automatically.',
  keywords: [
    'match data between spreadsheets',
    'look up values in Excel',
    'merge Excel files',
    'find and fill data',
    'Excel data lookup tool',
    'match columns between sheets',
    'VLOOKUP alternative',
    'spreadsheet data matching',
    'how to match data in Excel',
    'Excel lookup without formulas',
    'compare two Excel sheets',
    'find matching data in Excel',
    'Excel data merge tool',
    'spreadsheet comparison tool',
    'Excel column matching',
  ],
  authors: [{ name: 'DataMatch' }],
  openGraph: {
    title: 'DataMatch — Match Data Between Spreadsheets Without Formulas',
    description: 'Look up and match data across Excel sheets instantly. Free online tool — no formulas needed. Upload your files and get results in seconds.',
    locale: 'en_US',
    type: 'website',
    siteName: 'DataMatch',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DataMatch — Match Data Between Excel Spreadsheets',
    description: 'Free online tool to match and lookup data between Excel files. No formulas needed.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.COZE_PROJECT_ENV === 'DEV';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'DataMatch',
    description: 'Free online tool to match and look up data between Excel spreadsheets. Find values, fill columns, and merge files without formulas.',
    url: '/',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Match data between Excel spreadsheets',
      'Look up values across sheets',
      'Merge data from multiple files',
      'No formulas required',
      'Free online tool',
    ],
  };

  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {isDev && <Inspector />}
        {children}
      </body>
    </html>
  );
}
