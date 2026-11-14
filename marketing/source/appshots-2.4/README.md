# TabShow 2.4 product captures

Captured in Chrome through CUA on 14 November 2026. The panel captures render the production React components with deterministic sample tab metadata, using the repository's appshot harness. They are genuine interface renders, not generated or redrawn UI. Sample pages and labels are demonstration data.

- 01-preview.jpg: current and hovered tab, 420 by 700 CSS pixels.
- 02-search.jpg: title/URL search, 150 open tabs across four sample windows. Search retains the full open-tab count.
- 03-keyboard.jpg: dark appearance and keyboard-selected result without activation.
- 04-windows.jpg: search results in two windows in one profile; other-window result is explicitly click-to-switch.
- 05-settings.jpg: keep-open enabled explicitly; hover remains enabled with 250ms delay.

The welcome PNG is a format conversion of 01-preview.jpg. It contains the same pixels. These captures verify rendering and layout; they do not replace native extension API tests.

The first Store gallery slide also requires live-browser.jpg, a clean native browser capture of the sample page and actual extension panel. Do not publish the gallery's missing-image fallback as proof of native preview.
