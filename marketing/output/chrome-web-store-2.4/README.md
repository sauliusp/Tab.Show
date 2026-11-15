# TabShow 2.4 Store assets

Updated 15 November 2026. These are release-candidate assets. All 20 gallery images and both shared promotional tiles passed independent visual review at their upload dimensions. No Store upload or final listing approval is recorded here.

The root contains five English gallery images. `de/`, `zh_CN/`, and `zh_TW/` each contain five localized images. All are 1280 × 800 JPEGs rendered in Chrome from `marketing/cws-2.4-gallery/index.html?slide=N`, with `&locale=de`, `&locale=zh_CN`, or `&locale=zh_TW` for localized versions. Slides 02 through 05 use current production components with deterministic sample tabs. Source provenance is recorded in `marketing/source/appshots-2.4/README.md`.

Each `01-live-preview.jpg` uses the actual extension beside local sample pages, captured in normal Google Chrome on 15 November. The renderer clips the lower part of the native capture through CSS; it does not synthesize product UI. Localized sources use QA-only variants that select the target native fallback catalog by changing `manifest.default_locale` and available catalogs. Runtime code is unchanged; OS and Chrome display language were unchanged. This verifies localized rendering, not automatic display-language selection.

The approved English first slide was converted to `tabshow-2.4-01-live-preview.png` without visual edits and restored in both the repository website and authoritative Sites source checkouts. Its decoded pixels match the JPEG, both PNG copies are identical, and the targeted website asset test passes. This does not record a new Sites deployment.

Promotional tiles are in `marketing/output/promo-2.4`: 440 × 280 and 1400 × 560 JPEGs. They replace the outdated 2.0 interface tiles. Both use the current product capture.

All five slides in all four languages and both promotional tiles were inspected as saved files at their upload dimensions. Complete paints, readable copy, visible controls, preview/origin state, and intended crops passed. Focus restoration, IME checks, final-package verification, and the complete Store preview after upload remain separate release gates.

German, Simplified Chinese, and Traditional Chinese listing copy is prepared under `docs/launch-materials/locales/`. Use each locale's own gallery. The two shared promotional tiles remain in English. The existing video demonstrates the default preview/search/keyboard workflow; it does not show the new optional controls or localized UI.

## Capture defect corrected on 15 November

The earlier English `01-live-preview.jpg` was an incomplete browser render despite having the expected dimensions. It was replaced after the gallery reported `data-capture-ready="true"`, `data-preview-source="primary"`, and a visibly loaded image; the saved replacement passed independent review. Localized first slides passed the same saved-file review. The Sites archive prepared before this correction must not be published; package the corrected source and verify the final artifact before deployment.
