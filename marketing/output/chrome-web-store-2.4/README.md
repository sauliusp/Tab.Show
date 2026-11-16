# TabShow 2.4 Store assets

Updated 16 November 2026. All 20 gallery images and both shared promotional tiles passed visual review. Version 2.4.0 is publicly available. German and both Chinese public galleries show all five images. English initially showed only its localized video: its five images were in Global assets, while English Localised screenshots was empty. The approved five-image set has now also been saved directly under English and submitted; this correction is **Pending review**. See the [gallery audit](../../../docs/releases/2.4.0/store-gallery-audit.md) and [release record](../../../docs/releases/2.4.0/README.md#publication-record).

The root contains five English gallery images. `de/`, `zh_CN/`, and `zh_TW/` each contain five localized images. All are 1280 × 800 JPEGs rendered in Chrome from `marketing/cws-2.4-gallery/index.html?slide=N`, with `&locale=de`, `&locale=zh_CN`, or `&locale=zh_TW` for localized versions. Slides 02 through 05 use current production components with deterministic sample tabs. Source provenance is recorded in `marketing/source/appshots-2.4/README.md`.

Each `01-live-preview.jpg` uses the actual extension beside local sample pages, captured in normal Google Chrome on 15 November. The renderer clips the lower part of the native capture through CSS; it does not synthesize product UI. Localized sources use QA-only variants that select the target native fallback catalog by changing `manifest.default_locale` and available catalogs. Runtime code is unchanged; OS and Chrome display language were unchanged. This verifies localized rendering, not automatic display-language selection.

The approved English first slide was converted to `tabshow-2.4-01-live-preview.png` without visual edits and restored in both the repository website and authoritative Sites source checkouts. Its decoded pixels match the JPEG, both PNG copies are identical, and the targeted website asset test passes. The corrected image is included in live Sites version 14, deployed on 15 November; its source and artifact identity are recorded in the release record.

Promotional tiles are in `marketing/output/promo-2.4`: 440 × 280 and 1400 × 560 JPEGs. They replace the outdated 2.0 interface tiles. Both use the current product capture.

All five slides in all four languages and both promotional tiles were inspected as saved files at their upload dimensions. Complete paints, readable copy, visible controls, preview/origin state, and intended crops passed. The final package, real IME checks, and Store listing upload were subsequently completed. The ineffective focus-restoration trial was removed; the documented keyboard-focus constraint remains. Native behavior and coverage limits are recorded separately in [NATIVE-QA.md](../../../docs/releases/2.4.0/NATIVE-QA.md).

German, Simplified Chinese, and Traditional Chinese listing copy is prepared under `docs/launch-materials/locales/`. Use each locale's own gallery. The two shared promotional tiles remain in English. The existing video demonstrates the default preview/search/keyboard workflow; it does not show the new optional controls or localized UI.

## Capture defect corrected on 15 November

The earlier English `01-live-preview.jpg` was an incomplete browser render despite having the expected dimensions. It was replaced after the gallery reported `data-capture-ready="true"`, `data-preview-source="primary"`, and a visibly loaded image; the saved replacement passed independent review. Localized first slides passed the same saved-file review. The archive prepared before this correction was superseded. The corrected source was rebuilt, verified, and deployed as Sites version 14; retain the earlier defect as capture history, not a current release blocker.
