import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export function GET() {
  const catalog = {
    apiVersion: '1.0',
    name: 'DataMatch API',
    description: 'Excel data matching and VLOOKUP alternative API',
    baseUrl: 'https://dtpair.com/api',
    endpoints: [
      {
        path: '/api/downloads',
        method: 'GET',
        description: 'Track file download counts (server-side analytics)',
        authentication: 'none',
      },
      {
        path: '/api/auth/register',
        method: 'POST',
        description: 'Register a new user account',
        authentication: 'none',
        body: {
          email: 'string',
          password: 'string',
        },
      },
      {
        path: '/api/auth/login',
        method: 'POST',
        description: 'Authenticate user and return token',
        authentication: 'none',
        body: {
          email: 'string',
          password: 'string',
        },
      },
      {
        path: '/api/auth/profile',
        method: 'GET',
        description: 'Get current user profile',
        authentication: 'Bearer token',
      },
      {
        path: '/api/user/history',
        method: 'GET',
        description: 'Get user download/usage history',
        authentication: 'Bearer token',
      },
      {
        path: '/api/admin/stats',
        method: 'GET',
        description: 'Admin: get platform statistics',
        authentication: 'Admin token',
      },
      {
        path: '/api/admin/users',
        method: 'GET',
        description: 'Admin: list users',
        authentication: 'Admin token',
      },
      {
        path: '/api/admin/subscriptions',
        method: 'GET',
        description: 'Admin: list subscriptions',
        authentication: 'Admin token',
      },
    ],
    note: 'Core data matching functionality runs entirely client-side in the browser. Upload Excel files at the homepage to use the matching features without any API calls.',
    discovery: {
      agentSkills: '/.well-known/agent-skills',
      sitemap: '/sitemap.xml',
      robots: '/robots.txt',
    },
  };

  return NextResponse.json(catalog, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
