import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export function GET() {
  const body = `# DataMatch Agent Skills

This file describes the agent-facing capabilities of DataMatch.

## Service Information

- **Name**: DataMatch
- **Description**: Browser-based Excel data matching and VLOOKUP tool
- **Base URL**: https://dtpair.com
- **API Catalog**: /api

## Capabilities

### Data Matching
- Match data between two Excel spreadsheets
- Look up values across sheets or files
- Merge columns from different data sources
- Support for exact and approximate matching

### File Support
- Input formats: .xlsx, .xls, .csv
- Output formats: .xlsx (download), formula text, preview table
- Processing: Client-side (in-browser, no server upload)

### Integration
- REST API: See /api for available endpoints
- Markdown negotiation: Accept: text/markdown returns markdown content
- Link headers: RFC 8288 link headers for agent discovery

## Content Signals

DataMatch content signals are declared in /robots.txt:
- ai-train=no
- search=yes
- ai-input=no

## DNS Discovery

DNS-AID records are published under _agents.dtpair.com.
See docs/DNS-AID.md for configuration details.

## Related Resources

- Sitemap: /sitemap.xml
- Privacy: /privacy
- Terms: /terms
- Pricing: /pricing
`;

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
