# TabShow 2.4 product captures

Updated 15 November 2026. This directory contains production-component renders with sample metadata and native extension captures from normal Google Chrome. Neither is generated or redrawn UI. All 20 resulting gallery images and both shared promotional tiles passed independent visual review at their upload dimensions on 15 November.

## Production-component captures

English images were captured in Chrome through CUA on 14 November; German, Simplified Chinese, and Traditional Chinese variants were captured on 15 November in `de/`, `zh_CN/`, and `zh_TW/`. These images render the production React components with deterministic sample tab metadata using the repository's appshot harness. Sample pages and labels are demonstration data.

- 01-preview.jpg: current and hovered tab, 420 by 700 CSS pixels.
- 02-search.jpg: title/URL search. The English image uses 150 open tabs across four sample windows; localized images use 43 tabs in the current sample window. Search retains the full count for the selected scope.
- 03-keyboard.jpg: dark appearance and keyboard-selected result without activation.
- 04-windows.jpg: search results in two windows in one profile; other-window result is explicitly click-to-switch.
- 05-settings.jpg: keep-open enabled explicitly; hover remains enabled with 250ms delay.

Welcome PNGs were produced by converting the corresponding 01-preview.jpg files. These captures verify rendering and layout; they do not replace native extension API tests. The English images were checked against the current visible controls during the final visual pass. Exact final-package verification remains a separate release gate.

## Native browser captures

`live-browser.jpg` and the matching files in `de/`, `zh_CN/`, and `zh_TW/` were captured on 15 November in normal Google Chrome, using the dedicated TabShow QA profile and uncluttered local sample pages. Each is 3456 × 1998 pixels and shows the actual extension panel beside the page, with Reading list previewed and Project notes retained as the committed tab.

Localized native captures use QA-only package variants that change `manifest.default_locale` and the available catalogs to select the target fallback catalog. Runtime code is unchanged. The operating system and Chrome display language were not changed. These images confirm localized native rendering; they do not prove automatic selection from Chrome's display language. The release package must retain English as its default locale and all four catalogs.

Each locale's gallery slide 1 uses its native file. CSS displays the source at 1152 pixels wide inside a 516-pixel-high frame, clipping the lower part of the real capture. The underlying sources are retained here. All four saved slide-1 images were inspected at 1280 × 800; the demonstrated interaction remains visible.

All four native sources show complete rendering, localized controls where applicable, and no automation infobar. German, Simplified Chinese, and Traditional Chinese release-note captures also passed review of their visible layouts. A captured screen alone does not prove preview/return, update, persistence, focus restoration, or IME behavior. Focus restoration, IME checks, and final-package verification remain pending; see the separate [native validation record](../../../docs/releases/2.4.0/NATIVE-QA.md).
