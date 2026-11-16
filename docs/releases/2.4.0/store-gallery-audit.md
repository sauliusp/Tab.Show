# Public Store gallery audit, 16 November 2026

The public extension is version 2.4.0. This audit distinguishes saved dashboard assets from images visible to prospective users.

| Listing | Saved localized screenshots | Public result |
|---|---|---|
| English (`hl=en`) | Five, added during this correction | Still video only; correction Pending review |
| German (`hl=de`) | Five | All five load, German copy and interface, correct order |
| Simplified Chinese (`hl=zh-CN`) | Five | All five load, Simplified Chinese copy and interface, correct order |
| Traditional Chinese (`hl=zh-TW`) | Five | All five load, Traditional Chinese copy and interface, correct order |

The shared small and marquee promotional tiles remain in English. They use current product captures and are global assets, not four separate localized sets.

## English defect and correction

The dashboard contained five approved English screenshots under Global assets. English had a localized promotional video but no localized screenshots. The live English listing displayed only that video. This establishes the observed mismatch; it does not prove a universal Google fallback rule.

The five approved English JPEGs were uploaded directly to English Localised screenshots in this order:

1. `01-live-preview.jpg`
2. `02-search.jpg`
3. `03-keyboard.jpg`
4. `04-all-windows.jpg`
5. `05-panel-settings.jpg`

The saved five-image gallery was visually verified. The English localized video remains `https://www.youtube.com/watch?v=ZznCNcOynjw`; global and other localized video fields are blank. The five global English screenshots remain. No images were deleted, and no extension source, permissions, version, or package changed.

The listing correction was submitted with automatic publication selected. A fresh dashboard Status readback showed **Pending review** and **This draft is pending review**. The English public page continued to show only its video at the final check. Do not call this publicly fixed until all five screenshots render on the public English listing.

## Verification

- All 20 upload copies match the approved repository JPEGs byte for byte.
- All four saved localized dashboard galleries were visually checked for count, order, and language.
- The public German and both Chinese galleries were stepped through. Each has five distinct full-size images loaded at 1280 × 800, with the matching translated interface and promotional text.
- The public pages in all four languages show version 2.4.0, updated 16 November 2026.
- Native Chrome was used for dashboard inspection, upload, save, submission, and status verification. Public localized galleries were additionally inspected in the in-app browser while the user's Chrome was in use.
- Evidence is retained privately in `Documents/Codex Backups/tabshow-2.4-2026-11-16/`, including the four dashboard galleries, public gallery captures, and `english-gallery-pending-review.jpg`.

The existing daily follow-up must verify the corrected English gallery, including English regional variants and an unsupported-language fallback, then retire the completed release check. Do not cancel a pending submission or repeat uploads without evidence of a new problem.
