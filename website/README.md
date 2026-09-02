# TabShow website

The local, launch-ready SEO website for TabShow 2.1. It is a public vinext/Sites project with nine routes, factual product copy, campaign-tagged Chrome Web Store links, and the five current Chrome Web Store product images.

## Local verification

Requires Node.js 22.13 or newer.

```bash
npm install
npm run lint
npm test
```

`npm test` creates a production build and verifies the rendered route metadata, canonicals, structured data, campaign links, sitemap, and robots output.

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
