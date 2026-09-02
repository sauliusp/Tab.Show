# Chrome Web Store Dashboard handoff

Status: TabShow 2.1 release candidate built locally; external action intentionally paused. Use the `Saulius Extensions` Chrome profile signed in as `saulius.developer@gmail.com`. Item ID: `njdjagodlomkhingeecipnlnnhnipkho`.

Do not upload, save a draft, or submit for review until explicitly approved. When approved, publish the website first so every URL below resolves, then update the Store as a draft and request a final review before submission.

## Package

- Upload: `.output/tabshow-2.1.0-chrome.zip`
- Version: `2.1.0`
- SHA-256: `4b3b1e55cc5b491c915c4b8363311e642153ea9535a322ab549293b90a186f88`
- Manifest name: `TabShow: Live Tab Preview`
- Manifest summary: `Search or point at open tabs to preview the live page, then switch or snap back without losing your place.`
- Permissions: `sidePanel`, `tabs`, `tabGroups`
- Host permissions: none

## Store listing fields

- Title: `TabShow: Live Tab Preview`
- Summary: `Search or point at open tabs to preview the live page, then switch or snap back without losing your place.`
- Detailed description: paste the exact text under **Detailed description** in `docs/launch-materials/01_STORE_COPY.md`.
- Official URL: `https://tab.show/`
- Homepage URL: `https://tab.show/`
- Support URL: `https://tab.show/support`
- Privacy-policy URL: `https://tab.show/privacy`
- Language: retain English (United States) unless a separately reviewed localization is added.
- Category: retain the current category unless the live Dashboard audit reveals it is materially wrong.

The current promo video was not fully visible in the supplied Dashboard capture. Do not carry it forward blindly. Open and watch it during the approved Dashboard session; remove it if it shows the 1.x or 2.0 interface or makes claims contradicted by 2.1.

## Graphic assets

Upload in this order:

1. `marketing/output/screenshots/01-preview.png`: 1280×800
2. `marketing/output/screenshots/02-search.png`: 1280×800
3. `marketing/output/screenshots/03-keyboard.png`: 1280×800
4. `marketing/output/screenshots/04-windows.png`: 1280×800
5. `marketing/output/screenshots/05-context.png`: 1280×800
6. `marketing/output/promo/tabshow-small-promo-440x280.png`: 440×280
7. `marketing/output/promo/tabshow-marquee-1400x560.png`: 1400×560

All files are RGB PNGs without alpha. Replace this earlier 2.0 campaign only after the new 2.1 raw side-panel captures in `marketing/source/appshots-2.1/` have been approved and composited into Store-ready assets.

The new raw 2.1 source set contains seven 420×800 RGB PNGs without alpha: preview, 150-tab search, keyboard search in dark mode, cross-window scope, sorting and tab states, settings, and the 150-tab Chaos Score. Each PNG has a matching Markdown brief in `marketing/source/appshots-2.1/`. The raw captures are source material, not direct 1280×800 Store uploads.

## Privacy declarations

Use the permission-by-permission text from `docs/launch-materials/01_STORE_COPY.md`. Verify the Dashboard declarations against the uploaded package, not memory:

- no account or backend;
- no advertising or tracking;
- no host permissions;
- no webpage-content access;
- tab information and settings stay in the browser.

Do not describe the permissions as merely “minimal.” Explain what each one does. The unused `activeTab` permission remains absent in 2.1, and 2.1 adds no permissions.

## Approved-session checklist

1. Confirm publisher `Saulius`, item ID, and `saulius.developer@gmail.com` profile.
2. Upload the ZIP and wait for validation.
3. Recheck the rendered manifest title, summary, version, and permission diff.
4. Replace all listing copy and images; verify the five-image order.
5. Audit the video, category, locales, Distribution, Privacy, warnings, and asset-review state.
6. Verify `/`, `/support`, and `/privacy` resolve publicly before entering their URLs.
7. Save as draft only.
8. Capture the complete draft for final approval.
9. Submit for review only after a second explicit approval.
