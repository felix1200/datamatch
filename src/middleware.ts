import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Markdown content for key pages, used when requests have Accept: text/markdown
 * This enables AI agents to consume the site content in Markdown format
 * Reference: https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/
 */
const PAGE_MARKDOWN: Record<string, string> = {
  '/': `# DataMatch — Match Data Between Spreadsheets

Free online VLOOKUP alternative. Match data between Excel files without formulas.

## What is DataMatch?

DataMatch is a browser-based tool for matching and looking up data between
Excel spreadsheets. Upload your files, pick the columns to match, and get
results instantly — no formulas required.

## Features

- **Upload Excel files**: Supports xlsx, xls, and csv files
- **Single or dual file mode**: Match data within one file (different sheets)
  or between two separate files
- **Live preview**: See your data in a table before matching
- **Multiple output formats**: Download as Excel, preview results, or copy formulas
- **100% private**: All processing happens in your browser — files never leave
  your device
- **No sign-up required**: Start using immediately

## How it works

1. **Upload** — Drop your Excel files in the upload area
2. **Configure** — Select which columns to match and which data to return
3. **Download** — Get your matched results as a new Excel file

## API & Developer Resources

- API Catalog: /api
- Agent Skills: /.well-known/agent-skills
- Sitemap: /sitemap.xml

## Pricing

Free tier available. Visit /pricing for details.

## Legal

- Privacy Policy: /privacy
- Terms of Service: /terms
- Cookie Policy: /cookies
- Refund Policy: /refund-policy

---

*This page is available in Markdown format for agent consumption.
For the full interactive experience, visit https://dtpair.com/*
`,
  '/pricing': `# DataMatch Pricing

## Free Plan
- Price: $0
- Up to 5 files per day
- Unlimited rows per file
- All VLOOKUP features

## Pro Plan
Visit the pricing page for current pricing details.

## Enterprise
Contact us for custom solutions.

---

*This page is available in Markdown format for agent consumption.*
`,
  '/privacy': `# DataMatch Privacy Policy

DataMatch is a browser-based data matching tool. All file processing happens
locally in your browser. We do not store your data on our servers.

## Data We Process

- **Uploaded files**: Processed entirely in your browser. Never sent to our servers.
- **Account data**: If you create an account, we store your email and usage history.
- **Analytics**: Anonymous usage statistics to improve the service.

## Your Rights

You can request deletion of your account data at any time.

## Contact

privacy@dtpair.com

---

*This page is available in Markdown format for agent consumption.*
`,
};

const getGenericMarkdown = (pathname: string) => `# DataMatch — Page: ${pathname}

This is the Markdown representation of page ${pathname}.

For the full interactive version of this page, visit https://dtpair.com${pathname}.

## Related

- Homepage: /
- API Catalog: /api
- Agent Skills: /.well-known/agent-skills
- Sitemap: /sitemap.xml
- Pricing: /pricing
- Privacy Policy: /privacy

---

*Generated for agent consumption (text/markdown content negotiation).*
`;

export function middleware(request: NextRequest) {
  const accept = request.headers.get('accept') || '';

  // Check if the request accepts text/markdown
  if (!accept.includes('text/markdown')) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // Skip API routes, static assets, and file requests
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Get markdown content for the page
  const content = PAGE_MARKDOWN[pathname] || getGenericMarkdown(pathname);

  // Estimate token count for x-markdown-tokens header
  const tokenEstimate = Math.ceil(content.length / 4);

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'x-markdown-tokens': String(tokenEstimate),
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

export const config = {
  matcher: [
    // Match all paths except static assets and API routes
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
