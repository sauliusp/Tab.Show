# TabShow 2.4 Store assets

Updated 15 November 2026. These are release-candidate assets. No Store upload or final listing approval is recorded here.

Slides 02 through 05 are 1280 × 800 JPEGs rendered in Chrome from `marketing/cws-2.4-gallery/index.html?slide=N`. They use current production components with deterministic sample tabs. Source capture provenance is recorded in `marketing/source/appshots-2.4/README.md`.

`01-live-preview.jpg` now exists at 1280 × 800. It uses the actual English extension beside uncluttered sample pages, captured in normal Google Chrome on 15 November. The renderer clips the lower part of the native capture through CSS; it does not synthesize product UI. Review or replace that source against the final updated package before approving the slide.

The matching website image `tabshow-2.4-01-live-preview.png` now exists at 1280 × 800 in the repository website. It was still missing from the authoritative Sites checkout when this record was updated. Synchronize the approved final image and verify both website copies before deployment.

Promotional tiles are in `marketing/output/promo-2.4`: 440 × 280 and 1400 × 560 JPEGs. They replace the outdated 2.0 interface tiles. Both use the current product capture.

Slides 02 through 05 and both promotional tiles were visually inspected at their upload dimensions during the earlier English pass. Final review must compare all five slides and both tiles with the exact package, then inspect the complete Store preview after upload.

German, Simplified Chinese, and Traditional Chinese listing copy is prepared under `docs/launch-materials/locales/`. Localized screenshot preparation and final native locale validation are separate gates. Do not imply that an English screenshot demonstrates a localized interface. The existing video demonstrates the default preview/search/keyboard workflow; it does not show the new optional controls or localized UI.

## Capture defect found on 15 November

The current `01-live-preview.jpg` is an incomplete browser render, despite having the expected dimensions. Do not upload it or the matching website PNG. Recapture after the gallery reports `data-capture-ready="true"`, `data-preview-source="primary"`, and the image is visibly loaded, then inspect the saved file. The original `marketing/source/appshots-2.4/live-browser.jpg` remains a valid native Chrome capture.
