# Public Store gallery audit, 17 November 2026

The public extension is version 2.4.0. This audit distinguishes saved dashboard assets from images visible to prospective users.

| Listing | Saved localized screenshots | Public result |
|---|---|---|
| English (`hl=en`) | Five, added during the 16 November correction | All five load in the correct order, plus the existing video |
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

The listing correction was submitted on 16 November with automatic publication selected. A fresh dashboard Status readback showed **Pending review** and **This draft is pending review**. The English public page continued to show only its video at that day's final check.

On **17 November**, all five corrected English screenshots rendered on the public listing alongside the existing video. The public visibility defect is resolved. No additional upload or submission was needed.

## 16 November verification

- All 20 upload copies match the approved repository JPEGs byte for byte.
- All four saved localized dashboard galleries were visually checked for count, order, and language.
- The public German and both Chinese galleries were stepped through. Each has five distinct full-size images loaded at 1280 × 800, with the matching translated interface and promotional text.
- The public pages in all four languages show version 2.4.0, updated 16 November 2026.
- Native Chrome was used for dashboard inspection, upload, save, submission, and status verification. Public localized galleries were additionally inspected in the in-app browser while the user's Chrome was in use.
- Evidence is retained privately in `Documents/Codex Backups/tabshow-2.4-2026-11-16/`, including the four dashboard galleries, public gallery captures, and `english-gallery-pending-review.jpg`.

## 17 November public verification

- Normal Google Chrome was used to open fresh public listings for `en`, `en-GB`, `en-US`, `lt`, `de`, `zh-CN`, and `zh-TW`. Language variants were selected with the Store URL's `hl` parameter; no browser or account language settings were changed.
- Every screenshot in the English, German, Simplified Chinese, and Traditional Chinese galleries was stepped through at gallery size. All 20 images loaded, in order: live preview, search, keyboard, all windows, and panel settings. Translated headings and extension controls match each locale. Sample page content and tab titles remain English demo content.
- English has six gallery entries: its existing promotional video and five screenshots. Both regional English pages showed the same six entries and matching first two screenshots; their remaining images were checked as thumbnails rather than individually reopened.
- Lithuanian (`hl=lt`), which has no TabShow localization, displayed the English fallback. All five fallback screenshots were opened and visually checked, with the existing video also present.
- German and both Chinese galleries still contain five localized images each, with no missing images or wrong-language gallery replacements observed.
- Full native-browser captures are retained privately in `Documents/Codex Backups/tabshow-2.4-2026-11-17/`: `en-live-1-2.jpg`, `en-live-3-4.jpg`, `en-live-5.jpg`, `en-GB-live.jpg`, `en-US-live.jpg`, and the `lt-live-*`, `de-live-*`, `zh-CN-live-*`, and `zh-TW-live-*` sequences.

Public gallery verification is complete. The daily release follow-up can now be retired. Featurebase publication replies and statuses, website deployment, and the extension release were already completed on 16 November and did not need repeating.
