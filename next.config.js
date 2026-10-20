/** @type {import('next').NextConfig} */
const nextConfig = {
  // outputFileTracingRoot: path.resolve(__dirname, '../../'),  // Uncomment and add 'import path from "path"' if needed
  /* config options here */
  allowedDevOrigins: ['*.dev.coze.site'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/',
        headers: [
          // RFC 8288 Link headers for agent discovery
          {
            key: 'Link',
            value: '</api>; rel="api-catalog", </.well-known/agent-skills>; rel="service-doc", </sitemap.xml>; rel="sitemap"',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'Link',
            value: '</.well-known/agent-skills>; rel="service-doc", </api>; rel="api-catalog"',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
