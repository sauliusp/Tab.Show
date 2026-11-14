# TabShow website

The public vinext/Sites website for TabShow, with nine routes, product guidance, campaign-tagged Chrome Web Store links, and five 2.4 product images. Version 2.4 is a release candidate; the website distinguishes its new settings from the published 2.3 extension. Update release-status copy only after verifying submission or publication in the Chrome Web Store dashboard.

## Local verification

Requires Node.js 22.13 or newer.

```bash
npm ci
npm test
```

`npm test` creates a production build and verifies rendered route metadata, canonicals, structured data, release availability, settings guidance, product image references, sitemap, and robots output.

For hosted publication, use the Sites source workflow and build helper from the opened authoritative checkout. Preserve the existing `.openai/hosting.json` project identity and public access.

## Routes

- `/`
- `/chrome-tab-preview-extension`
- `/find-lost-chrome-tab`
- `/onetab-alternative`
- `/workona-alternative`
- `/tab-manager-plus-alternative`
- `/privacy`
- `/changelog`
- `/support`

## Deployment

The public Sites deployment is available at `https://tabshow.sauliusdev.chatgpt.site/`. The production custom domains `https://tab.show/` and `https://www.tab.show/` are active with valid SSL. Connect analytics without collecting tab content and keep the production routes covered by the rendered-output checks.

The Sites configuration is in `.openai/hosting.json`; no D1 or R2 bindings are required.
