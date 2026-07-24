'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

const navItems = [
  { href: '/terms', label: 'Terms of Service' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/cookies', label: 'Cookie Policy' },
  { href: '/refund-policy', label: 'Refund Policy' },
  { href: '/contact', label: 'Contact Us' },
];

export default function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/[0.04]">
        <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-[#1d1d1f] tracking-tight">
            DataMatch
          </Link>
          <Link href="/" className="text-sm text-[#86868b] hover:text-[#1d1d1f] transition-colors">
            Back to Home
          </Link>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="flex gap-12">
          {/* Sidebar Navigation */}
          <aside className="hidden md:block w-56 shrink-0">
            <nav className="sticky top-24 space-y-1">
              <p className="text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-4 px-3">
                Legal
              </p>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'block px-3 py-2 text-sm rounded-xl transition-all duration-200',
                    pathname === item.href
                      ? 'bg-[#1d1d1f] text-white font-medium'
                      : 'text-[#86868b] hover:text-[#1d1d1f] hover:bg-black/[0.04]'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-[20px] shadow-card p-8 md:p-12">
              <h1 className="text-[32px] md:text-[40px] font-bold text-[#1d1d1f] tracking-tight leading-tight mb-2">
                {title}
              </h1>
              <p className="text-sm text-[#86868b] mb-10">Last updated: {lastUpdated}</p>
              <div className="prose-apple">
                {children}
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="md:hidden mt-8 flex flex-wrap gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-4 py-2 text-sm rounded-full transition-all duration-200',
                    pathname === item.href
                      ? 'bg-[#1d1d1f] text-white font-medium'
                      : 'text-[#86868b] bg-white hover:text-[#1d1d1f]'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-black/[0.04] bg-white/50">
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#86868b]">
              &copy; {new Date().getFullYear()} DataMatch. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-xs text-[#86868b] hover:text-[#1d1d1f] transition-colors">Privacy</Link>
              <Link href="/terms" className="text-xs text-[#86868b] hover:text-[#1d1d1f] transition-colors">Terms</Link>
              <Link href="/contact" className="text-xs text-[#86868b] hover:text-[#1d1d1f] transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
