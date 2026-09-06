# TabShow

TabShow is a free Chrome extension for searching and previewing live tabs from the side panel.

Current release candidate: **2.2.0**. See [release notes](docs/launch-materials/09_2_2_RELEASE_NOTES.md) and the [Chrome Web Store handoff](docs/releases/2.2.0/README.md).

## Development

Use Node.js 22.13 or later and install dependencies with `npm ci`.

- `npm run dev`: develop the extension.
- `npm test`: run extension checks.
- `npm run compile`: check TypeScript.
- `npm run zip`: build and package the Chrome MV3 extension in `.output/`.

The WXT manifest lives in `wxt.config.ts`. The welcome and update pages live in `public/pages/`; the background worker opens the update page when Chrome installs a different extension version.

The website is in `website/`. Its build and deployment are separate from a Chrome Web Store release.
