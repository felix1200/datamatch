import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export default function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-8">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to DataMatch
        </Link>

        <article className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: {lastUpdated}</p>
          <div className="prose prose-gray max-w-none">
            {children}
          </div>
        </article>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>If you have any questions about this document, please contact us at{' '}
            <a href="mailto:legal@datamatch.app" className="text-emerald-600 hover:underline">legal@datamatch.app</a>
          </p>
        </div>
      </div>
    </div>
  );
}
