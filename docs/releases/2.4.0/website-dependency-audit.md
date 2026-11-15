# Website dependency audit and React patch

Reviewed on 15 November 2026. This record covers the TabShow website, not the browser extension. It is a focused dependency and runtime-path review, not a penetration test or a claim that all dependencies are vulnerability-free.

## Finding and fix

The existing website dependency set produced 33 npm audit findings: 2 critical, 17 high, 12 moderate, and 2 low. Omitting development dependencies reported only 6 findings, but that view excluded a dependency used by the production Worker.

`react-server-dom-webpack@19.2.6` is declared as a development dependency and is bundled into `dist/server/index.js`. The Worker uses Vinext's App Router, including its multipart POST handler. That handler passes form data to React's action decoder before checking whether the decoded result is a usable server action. The package classification therefore does not make it a build-only dependency.

React's maintainers identify two relevant advisories:

- [GHSA-wx67-qw84-cm4g](https://github.com/react/react/security/advisories/GHSA-wx67-qw84-cm4g): crafted server-function requests can cause excessive CPU or memory use. The 19.2 branch is patched in 19.2.8.
- [GHSA-xqc2-xf4c-x3h3](https://github.com/react/react/security/advisories/GHSA-xqc2-xf4c-x3h3): remote code execution in specific RSC responses carrying multiple typed arrays and an attacker-controlled value. The 19.2 branch is patched in 19.2.9. No corresponding application response or application server action was found in this site; exploitation was not demonstrated.

The bounded fix pins `react`, `react-dom`, and `react-server-dom-webpack` to **19.2.9** together. npm's published peer requirements for the patched server package require matching React and React DOM versions. The original dependency classes are preserved, including the server package's development classification. The lockfile refresh changes only these three package versions, their integrity data, and matching peer requirements. It does not upgrade Next, Vinext, Vite, or the Cloudflare tools.

No `npm audit fix` or forced dependency update was run.

## Remaining findings and production reachability

After the patch, npm audit reports **32 findings: 1 critical, 17 high, 12 moderate, and 2 low**. Removing one package-level critical finding does not imply that every advisory in the dependency graph has been fixed.

| Finding group | Observed deployment path | Release assessment |
|---|---|---|
| Next.js critical advisories | The site deploys Vinext's Worker, not the Next server. The application has no `next/og` image routes or `use cache` functions. | No matching reachable path identified in the inspected source and emitted Worker. |
| Sharp image-processing advisories | `worker/index.ts` delegates image transformation to Cloudflare's `env.IMAGES`; the emitted Worker has no Sharp package code. | The installed Sharp package is not the image transformer in this deployment. |
| Vinext's flagged `image-size` and `@vercel/og` dependencies | Vinext is bundled, but these package implementations are absent from the emitted server code. The site uses local product images and has no application image-generation endpoint. | No runtime input path to these dependencies identified. A Vinext major upgrade is outside this patch. |
| Vite, Wrangler, Miniflare, Cloudflare Vite plugin and their flagged dependencies | Used for local installation, development, builds and deployment; not present as runtime package implementations in the emitted Worker. | Track as tooling maintenance. This assessment does not make an exposed development server safe. |
| Other flagged parsing/build utilities | No implementation from these packages was found in the emitted server code, and `vinext-externals.json` is empty. | No deployed runtime path identified in this build. |

The Next advisory conditions were checked against the maintainers' descriptions: [Windows server filesystem](https://github.com/vercel/next.js/security/advisories/GHSA-p293-qw3h-jr36), [Sharp-based SVG optimization](https://github.com/vercel/next.js/security/advisories/GHSA-2464-fhr4-w9xw), [Node `next/og` image generation](https://github.com/advisories/GHSA-vcvr-r3jv-pc5j), and [`use cache` returning typed arrays](https://github.com/advisories/GHSA-673q-mjm6-r5xr).

These conclusions are specific to this site's current source, build and Cloudflare Worker deployment. Adding image uploads, dynamic image generation, server actions, a Next server, or new server dependencies requires reviewing reachability again. A source-marker inspection supports this bounded assessment; it is not a general proof that arbitrary future builds are unaffected.

## Validation and deployment status

- Refreshed `website/package-lock.json` using `npm install --package-lock-only --ignore-scripts`.
- Installed the changed inputs using the Sites dependency helper in the repository's website mirror. The installer completed successfully.
- Verified that the dependency diff contains only the three intended package updates and preserves their dependency classes.
- After restoring the approved first-gallery PNG and qualifying the Escape guidance, `npm test` completed the production build and all 10 rendered-site tests passed. This includes all nine routes, local asset existence, metadata, release history, language guidance, search totals, and the focused-panel Escape instructions. `npm run lint` also passed.
- The host used Node 23.7.0. Installation reported an existing ESLint dependency's engine-range warning; this patch does not change that tooling dependency.

The authoritative Sites helper mirrored the five Escape-guidance and test files, ran lint, rebuilt, passed all 10 tests, and pushed source `2224a812c23bf682174ef9a0ae68c0b99d718056`. The resulting `tabshow-2.4-candidate.tar.gz` is 19,653,414 bytes with SHA-256 `36ba5fb84595e03d7e1b0ff98a526a54ea8112e931b3390e0e204140d20c27f8`. Its emitted Worker contains React 19.2.9 and the revised Escape copy; its first gallery PNG matches the approved source. This replaces the earlier prepared archives. At the packaging checkpoint, no Sites version had been saved or deployed. On 15 November 2026, this artifact was saved as Sites version 14 and deployment `appgdep_6af9750e01188191a6dd2ce5e25351ca` succeeded at 09:02:23 UTC. See the [release README](README.md#publication-record) for the separate Store submission and public-availability record.
