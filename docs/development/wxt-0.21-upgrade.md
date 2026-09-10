# WXT 0.21 upgrade verification

Verified on 2026-09-10 with Node 22.20.0, WXT 0.21.4, TypeScript 5.9.3, and Vite 7.3.6.

## Migration

- Upgraded WXT from locked version 0.20.27 to 0.21.4.
- Added the explicit Vite peer and optional `web-ext` browser launcher. Kept Vite 7.3.6.
- Retained WXT's stricter generated TypeScript settings, including `verbatimModuleSyntax` and `noUncheckedIndexedAccess`. Updated type imports, guarded array accesses, and expressed nonempty fixtures and color pairings as tuples.
- Limited source archives to extension sources, assets, and build inputs.
- Kept the extension version at 2.3.0. The Chrome manifest matches the existing release ZIP, including permissions.

## Local checks

- `npm run compile`: passed.
- `npm test`: 68 tests across 16 files passed, including the new year-boundary and missed-day streak regression.
- `npm run build`: Chrome production build passed. The existing bundle-size warning remains.
- WXT development server started with browser auto-opening disabled for this check. All four HTTP module URLs referenced by the generated sidepanel HTML returned 200, including the React entrypoint and Vite client. The development output is `.output/chrome-mv3-dev/`.
- Chrome and Firefox packaging passed through WXT's `zip` API with `outDir: '.output/wxt-0.21-validation'`, preserving the existing release archives.
- All ZIP entries passed CRC checks. The source ZIP excludes the website, marketing, release archives, Git metadata, and dependencies. A fresh extraction passed `npm ci`, `npm run compile`, and `npm run build`.
- `npm audit --omit=dev` reported zero findings. The full tooling tree reported 13 findings (5 moderate, 8 high), compared with 20 on the original lockfile. This migration does not resolve all tooling advisories.

## Unpacked Chrome check

Chrome for Testing 151.0.7922.34, existing isolated TabShow profile, unpacked extension ID `ofjkbgengmnclhgjekcfblgbghjfiedm`:

1. Reloaded `.output/chrome-mv3` through `chrome://extensions`; no extension error appeared.
2. Opened the side panel with the keyboard shortcut. The profile scope hint, saved All windows setting, six-tab total, and three-window total rendered.
3. On local fixtures at `127.0.0.1:4189`, moved the pointer onto the preview row using the native automation drag gesture from an empty panel area. The preview tab became active and its row became amber; the original row stayed violet.
4. Moved to an empty panel area with a click. The original tab was restored.
5. Clicked the preview row. Selection committed and the panel closed; reopening showed that tab as current.
6. Entered an unmatched search. The empty state appeared while the full tab/window totals remained. Replaced it with the original fixture title and used Down/Enter to switch successfully.

These observations cover the production build. Development browser auto-opening and hot reload were not exercised in the browser.

## Browser and publication boundaries

Firefox packaging is not Firefox runtime support. The generated sidebar manifest still needs browser-specific permission handling, runtime `sidePanel` adaptations, and Firefox store declarations before a Firefox launch. Edge, Brave, and Safari runtime testing remain separate work.

This is a development-tool migration. No website deployment, Store submission, or new extension release is part of it.
