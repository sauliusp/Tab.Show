# TabShow 2.3.0 release candidate

Prepared on 9 September 2026. Publication is pending the user's review. This release makes the existing Chrome-profile boundary clear and adds a short narrated product walkthrough.

## Changes

- The All windows control explains that its scope is the current Chrome profile. A compact This profile hint appears in the existing helper row; accessible window totals say current profile only.
- Website FAQ, support, comparison guidance, onboarding and both changelogs clarify that Work and Personal profiles remain separate.
- A separate 30.5-second narrated video leads with full-page preview and focus, then demonstrates return, click-to-stay, search, keyboard selection and same-profile windows.
- The website serves the video directly, with captions and a transcript. The extension's update page links to `https://tab.show/#demo`.
- Public developer contact is `sauliusthedev@gmail.com`. The old address was absent from website and extension copy; the release-plan contact entry was updated. Login-account references retain their actual account identities.
- No new Chrome permissions, host access, tracking, account system or preview behavior changes.

## Validation

- `npm test`: 67 tests passed.
- `npm run compile`: passed.
- `npm run zip`: passed; package integrity, 2.3.0 manifest and unchanged permissions verified. See `package.json` for digest.
- Website `npm test`: build and 8 rendered-route tests passed. Website lint passed.
- Video: complete decode, black-frame check, transcript check, dimensions, frame rate and loudness checked. See `marketing/video/tabshow-focus-2026-09/qa/summary.json`.
- Real unpacked Chrome verification is recorded separately when complete. Unit tests and campaign captures do not establish a successful installed extension update.

## Search Console

`https://tab.show/` ownership was auto-verified through the live HTML tag in the developer account. `sitemap.xml` was resubmitted successfully on 9 September; its table shows Success and nine discovered pages. The previous last-read date is 1 September. This is a URL-prefix property, not DNS verification of every subdomain. See `search-console.json`.

## Publication order after approval

1. Finish the Codex PR review loop and verify the merge to main.
2. Obtain the user's review approval for the video, website and Store release.
3. Publish the separate new YouTube video, preserving both existing public TabShow uploads. Confirm processing, embedding, captions and thumbnail.
4. Deploy the tested website through the existing Sites project and verify the live demo anchor and media.
5. Upload `tabshow-2.3.0-chrome.zip`, put the new YouTube URL in the Global promo video field, save and review the listing, then submit the Store update as authorized.
6. Confirm dashboard submission and public Store availability independently. Pending review is not live.

Merging to GitHub main does not deploy the website or submit a Store update.
