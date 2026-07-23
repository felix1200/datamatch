import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import './globals.css';

export const metadata: Metadata = {
  title: 'DataMatch — Match & Look Up Data Between Excel Spreadsheets',
  description: 'Easily match data between two Excel files or sheets. Find values, fill columns, and merge spreadsheets — no formulas needed. Free online tool.',
  keywords: ['match data between spreadsheets', 'look up values in Excel', 'merge Excel files', 'find and fill data', 'Excel data lookup tool', 'match columns between sheets', 'VLOOKUP alternative', 'spreadsheet data matching'],
  openGraph: {
    title: 'DataMatch — Match Data Between Spreadsheets',
    description: 'Look up and match data across Excel sheets instantly. No formulas needed.',
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
