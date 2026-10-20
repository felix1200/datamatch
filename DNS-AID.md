# DNS-AID (DNS for AI Discovery) Configuration

> Status: **NOT ACTIVE** — DataMatch is a web-based spreadsheet matching tool, not an AI agent service. These records are documented here for future use only. Do not publish them until a real A2A/agent endpoint exists.

## What is DNS-AID?

DNS-AID lets AI agents discover agent endpoints through DNS. It requires `SVCB`/`HTTPS` records under the `_agents` namespace, signed with DNSSEC.

Specs:
- Draft: https://datatracker.ietf.org/doc/draft-mozleywilliams-dnsop-dnsaid/
- SVCB RFC: https://www.rfc-editor.org/rfc/rfc9460
- Scanner: https://isitagentready.com

## When to enable

Enable only when DataMatch exposes a real machine-callable agent endpoint (e.g. A2A protocol at `https://dtpair.com/a2a` or similar).

## Records to add at the DNS provider

Domain: `dtpair.com`

### A2A discovery (SVCB, type 64)

```
_a2a._agents.dtpair.com. 3600 IN SVCB 1 dtpair.com. alpn="h2,h3" port=443 mandatory=alpn,port
```

### Agent index discovery (SVCB, type 64)

```
_index._agents.dtpair.com. 3600 IN SVCB 1 dtpair.com. alpn="h2,h3" port=443 mandatory=alpn,port
```

### Equivalent HTTPS record (type 65)

Use this if the DNS provider only supports HTTPS records:

```
_a2a._agents.dtpair.com. 3600 IN HTTPS 1 dtpair.com. alpn="h2,h3" port=443
```

## DNSSEC

1. Enable DNSSEC in the DNS provider dashboard.
2. Copy the generated DS record (key tag, algorithm, digest type, digest).
3. Paste the DS record at the domain registrar.
4. Verify with: https://dnssec-analyzer.verisignlabs.com/dtpair.com

## Provider notes

| Provider | SVCB/HTTPS records | DNSSEC |
|----------|--------------------|--------|
| Cloudflare | Supported | One-click enable |
| Vercel DNS | Limited custom SVCB support | Limited; consider delegating NS to Cloudflare |
| Namecheap | Advanced DNS required | Supported via registrar panel |

## Validate

```bash
curl -X POST https://isitagentready.com/api/scan \
  -H 'Content-Type: application/json' \
  -d '{"url": "https://dtpair.com"}'
```

Check that `checks.discoverability.dnsAid.status` is `"pass"`.
