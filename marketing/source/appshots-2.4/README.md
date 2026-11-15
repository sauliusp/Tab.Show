# TabShow 2.4 product captures

Updated 15 November 2026. This directory contains two kinds of evidence: production-component renders with sample metadata, and a native extension capture from normal Google Chrome. Neither is generated or redrawn UI. Final release capture review is still pending.

## Production-component captures

Captured in Chrome through CUA on 14 November. These images render the production React components with deterministic sample tab metadata using the repository's appshot harness. Sample pages and labels are demonstration data.

- 01-preview.jpg: current and hovered tab, 420 by 700 CSS pixels.
- 02-search.jpg: title/URL search, 150 open tabs across four sample windows. Search retains the full open-tab count.
- 03-keyboard.jpg: dark appearance and keyboard-selected result without activation.
- 04-windows.jpg: search results in two windows in one profile; other-window result is explicitly click-to-switch.
- 05-settings.jpg: keep-open enabled explicitly; hover remains enabled with 250ms delay.

The welcome PNG was produced by converting 01-preview.jpg. These captures verify rendering and layout; they do not replace native extension API tests. The English captures predate the final localization pass. Check their visible controls against the final package and replace any capture whose interface has changed.

## Native browser capture

`live-browser.jpg` was captured on 15 November in normal Google Chrome, using the dedicated TabShow QA profile and uncluttered local sample pages. It is 3456 × 1998 pixels and shows the actual extension panel beside the page. It is native English evidence, not a localized interface capture.

Gallery slide 1 uses this file. Its CSS displays the source at 1152 pixels wide inside a 516-pixel-high frame, clipping the lower part of the real capture. The underlying source is retained here. Review that crop at the final 1280 × 800 gallery size so the demonstrated interaction remains clear.

The native file now exists, but it still needs a final consistency review or recapture after the latest keyboard and localization changes. Native German, Simplified Chinese, and Traditional Chinese validation and final localized asset review remain pending. A captured screen alone does not prove preview/return, update, or persistence behavior; see the separate [native validation record](../../../docs/releases/2.4.0/NATIVE-QA.md).
