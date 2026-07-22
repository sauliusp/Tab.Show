# `tab.show` website launch handoff

Status: production launch and Namecheap DNS cutover complete on 2026-07-22. The `tab.show` and `www.tab.show` custom domains, routing, ownership validation, and SSL certificates are active.

## Current production deployment

- Sites URL: `https://tabshow.sauliusdev.chatgpt.site/`
- Access: public
- Canonical domain: `https://tab.show/` — active, HTTPS 200
- Alternate domain: `https://www.tab.show/` — active, HTTPS 200
- SSL: active for both custom domains
- Namecheap DNS: two apex `A` records, one `www` CNAME, and four validation TXT records confirmed publicly

The old Lovable routing records were replaced. The two `_lovable` verification TXT records were deliberately preserved because they do not conflict with Sites; they may be removed after the domain is disconnected from the Lovable project.

## DNS cutover record

For the zone apex `tab.show`:

- `A` — name `@` — value `162.159.143.30`
- `A` — name `@` — value `172.66.3.26`
- `TXT` — name `_openai-site-verification` — value `openai-site-verification=dZSgU5-vonUa3gq3yubMQt8XDIPVwqtyTHzHsNII9RY`
- `TXT` — name `_cf-custom-hostname` — value `dc704e31-703e-4bd2-a66a-c69538462fc8`

For `www.tab.show`:

- `CNAME` — name `www` — value `custom-domains.chatgpt.site.`
- `TXT` — name `_openai-site-verification.www` — value `openai-site-verification=2HUvz4qbcGA81O6OJaz6KmGuJd31dRJC7rhe90idc6U`
- `TXT` — name `_cf-custom-hostname.www` — value `2f9a8429-29f5-438b-9e70-af7c700a4408`

The conflicting Lovable `A` records for `@` and `www` were replaced with the records above. Namecheap email forwarding and its SPF record were preserved unchanged. Public DNS, Sites ownership checks, both SSL certificates, and the key HTTPS routes were verified after propagation.

## What is ready

The Sites/vinext project lives in `website/` and contains nine public routes:

- `/`
- `/chrome-tab-preview-extension`
- `/find-lost-chrome-tab`
- `/onetab-alternative`
- `/workona-alternative`
- `/tab-manager-plus-alternative`
- `/privacy`
- `/changelog`
- `/support`

Each page has a unique search intent, title, description, canonical, and Store CTA campaign. The comparison pages make honest two-sided recommendations rather than pretending TabShow replaces session managers or workspaces. The site includes visible FAQ/schema parity, SoftwareApplication schema without fabricated ratings, sitemap, robots, a 404 page, reduced-motion handling, and a bespoke social card.

The campaign images use authentic TabShow appshots. ImageGen supplied only the tactile editorial problem scenes; the extension UI was composited unchanged.

## Community and review behavior

- Feature feedback: `https://narsheek.featurebase.app/`
- Store reviews: `https://chromewebstore.google.com/detail/tabshow-hover-preview-foc/njdjagodlomkhingeecipnlnnhnipkho/reviews`

The actions are subtle, voluntary, equally available, and never used as a sentiment gate. The site asks for a five-star review only if TabShow has earned it.

## Local commands

From `website/`:

```bash
npm run lint
npm test
```

`npm test` builds the production site and checks rendered metadata, canonicals, truthful copy, campaign links, sitemap, and robots output.

## Remaining launch sequence

1. Disconnect `tab.show` and `www.tab.show` from the old Lovable project; routing has already moved to Sites.
2. Optionally remove the two `_lovable` verification TXT records after Lovable confirms the disconnection.
3. Connect privacy-respecting analytics. Track page views and outbound Store CTA campaign parameters only; never collect tab or browsing content.
4. Verify Search Console ownership and submit `https://tab.show/sitemap.xml`.
5. Populate the Store Homepage, Support, and Privacy URLs and save the Store draft only after the separate Dashboard approval.

## Go/no-go rules

Do not launch if any canonical points at staging, a comparison page lacks its honest recommendation, a Store link loses its UTM campaign, a public route returns an error, or the old site cannot be recovered. Do not claim “join thousands,” “zero impact,” “best,” or “100% free forever.”
