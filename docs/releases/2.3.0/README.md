# TabShow 2.3.0 release candidate

Prepared on 9 September 2026. The user authorized publication after clean Codex review and merge to main. This release makes the existing Chrome-profile boundary clear and adds a short narrated product walkthrough.

## Changes

- The All windows control explains that its scope is the current Chrome profile. A compact This profile hint appears in the existing helper row; accessible window totals say current profile only.
- Website FAQ, support, comparison guidance, onboarding and both changelogs clarify that Work and Personal profiles remain separate.
- A separate 31.5-second narrated video with an opening pause leads with full-page preview and focus, then demonstrates return, click-to-stay, search, keyboard selection and same-profile windows.
- The website serves the video directly, with captions and a transcript. The extension's update page links to `https://tab.show/#demo`.
- Public developer contact is `sauliusthedev@gmail.com`. The old address was absent from website and extension copy; the release-plan contact entry was updated. Login-account references retain their actual account identities.
- No new Chrome permissions, host access, tracking, account system or preview behavior changes.

## Validation

- `npm test`: 67 tests passed.
- `npm run compile`: passed.
- `npm run zip`: passed; package integrity, 2.3.0 manifest and unchanged permissions verified. See `package.json` for digest.
- Website `npm test`: build and 8 rendered-route tests passed. Website lint passed.
- Media reproduction: dependency installation, audio preparation, stills and full video rendering passed from a relocated copy with an FFmpeg override containing spaces. Stills, mixed audio and captions match the reviewed assets byte-for-byte.
- Video: complete decode, black-frame check, transcript check, dimensions, frame rate and loudness checked. See `marketing/video/tabshow-focus-2026-09/qa/summary.json`.
- Real Chrome for Testing 151.0.7922.34: unpacked 2.3 loaded, onboarding opened, same-profile hint and accessible scope copy appeared, two windows and five tabs were counted, empty search kept full totals, and keyboard selection switched both within and across windows. The packaged update page rendered correctly. See `chrome-smoke.json`.
- Pointer hover/leave and the automatic update popup from an installed Store version were not independently re-tested in this smoke pass.

## Search Console

`https://tab.show/` ownership was auto-verified through the live HTML tag in the developer account. `sitemap.xml` was resubmitted successfully on 9 September; its table shows Success and nine discovered pages. The previous last-read date is 1 September. This is a URL-prefix property, not DNS verification of every subdomain. See `search-console.json`.

## Draft surfaces

The new YouTube video `ZznCNcOynjw` is saved as Private with HD processing complete, English captions and a custom thumbnail. The first review cut remains private and is labelled superseded. Existing public videos remain intact. The revised upload's copyright check was still running when it was saved; verify its result before public release. The user opened the developer dashboard after signing in. Store upload and promo changes follow the reviewed merge.

## Publication order

1. Finish the Codex PR review loop and verify the merge to main.
2. User release approval was received on 9 September 2026 after reviewing the video and requesting its opening pause.
3. Publish the separate new YouTube video, preserving both existing public TabShow uploads. Confirm processing, embedding, captions and thumbnail.
4. Deploy the tested website through the existing Sites project and verify the live demo anchor and media.
5. Upload `tabshow-2.3.0-chrome.zip`, put the new YouTube URL in the Global promo video field, save and review the listing, then submit the Store update as authorized.
6. Confirm dashboard submission and public Store availability independently. Pending review is not live.

Merging to GitHub main does not deploy the website or submit a Store update.
