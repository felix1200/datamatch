# DNS-AID Configuration Guide

This document describes how to configure DNS-based Agent Discovery (DNS-AID)
for the DataMatch service at dtpair.com.

## Overview

DNS for AI Discovery (DNS-AID) enables AI agents to discover services and
agent endpoints through DNS queries. It uses HTTPS/SVCB records under the
`_agents` subdomain, allowing agents to find available services without
prior knowledge of specific URLs.

- Draft: https://datatracker.ietf.org/doc/draft-mozleywilliams-dnsop-dnsaid/
- SVCB/HTTPS RFC: https://www.rfc-editor.org/rfc/rfc9460

## DNS Records

Add the following DNS records to your domain's DNS configuration.

### Primary Agent Discovery Record

```
_index._agents.dtpair.com.  3600  IN  HTTPS  1 . alpn="h2" ipv4hint="1.2.3.4"
```

This tells agents that agent services are available at the apex domain
using HTTP/2.

### A2A (Agent-to-Agent) Service Record

```
_a2a._agents.dtpair.com.  3600  IN  HTTPS  1 . alpn="h2" target="dtpair.com"
```

For agent-to-agent protocol endpoints, if applicable.

### Service Specific Records (optional)

```
_api._agents.dtpair.com.  3600  IN  HTTPS  1 api.dtpair.com alpn="h2"
_search._agents.dtpair.com.  3600  IN  HTTPS  1 . alpn="h2" path="/api/search"
```

## Configuration by DNS Provider

### Cloudflare

1. Go to your domain's DNS settings
2. Add a new record of type **HTTPS** (not available in all plans — use SVCB or manual)
3. If HTTPS record type is not available, use **TXT** records as fallback:

```
_agents.dtpair.com.  IN  TXT  "v=DnsAid1; alpn=h2; target=dtpair.com"
```

### AWS Route 53

Route 53 supports HTTPS/SVCB records. Create an SVCB record under
`_index._agents.dtpair.com`.

### Vercel DNS

Vercel does not natively support SVCB/HTTPS records. Use a TXT fallback or
a custom DNS provider.

## DNSSEC

For production use, it is recommended to enable DNSSEC on your domain so that
agents can verify the authenticity of DNS-AID responses.

## Verification

After adding the records, verify with:

```bash
# Check HTTPS record
dig HTTPS _index._agents.dtpair.com

# Check with SVCB
dig SVCB _index._agents.dtpair.com

# Verify DNSSEC
dig _index._agents.dtpair.com +dnssec
```

## Notes

- Replace `1.2.3.4` with your actual server IP addresses
- Replace `dtpair.com` with your actual domain
- Set appropriate TTL values (3600 seconds = 1 hour is reasonable)
- DNS-AID is currently an IETF draft; implementations may vary
- TXT record fallback format may differ across agent implementations
