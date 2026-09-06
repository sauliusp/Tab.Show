# TabShow 2.2.0: Chrome Web Store handoff

Prepared for submission. This handoff does not mean the extension has been submitted, approved, or published.

## Upload package

Build with `npm ci && npm run zip` from the repository root. The Chrome Web Store upload is `.output/tabshow-2.2.0-chrome.zip`, with `manifest.json` at the archive root. Use this Chrome ZIP, not the source tree or video upload bundle.

The exact prepared ZIP checksum is tracked in `docs/releases/2.2.0/SHA256SUMS.txt`. Verify the prepared artifact from its directory with `shasum -a 256 -c /absolute/path/to/Tab.Show/docs/releases/2.2.0/SHA256SUMS.txt`. Its build provenance and checks are in the adjacent tracked `package-check.json`. The ZIP itself is a local release artifact, not committed to Git. The final local shipping folder includes the ZIP, checksum, manifest, and release note.

A fresh checkout can build a new ZIP using the command above, then compute its own checksum with `shasum -a 256 .output/tabshow-2.2.0-chrome.zip`. ZIP metadata may change the checksum across builds; revalidate and record a rebuilt artifact before uploading it instead of assuming it is the exact prepared ZIP.

## Listing fields

- Extension ID: `njdjagodlomkhingeecipnlnnhnipkho`
- Name: `TabShow: Live Tab Preview`
- Version: `2.2.0`
- Promotional video: https://www.youtube.com/watch?v=nVGewf2igpo
- Website: https://tab.show/
- Help: https://tab.show/support
- Privacy: https://tab.show/privacy
- Description: `docs/launch-materials/01_STORE_COPY.md`
- Update note: `docs/launch-materials/09_2_2_RELEASE_NOTES.md`

Use the new upbeat video for this release. YouTube's public oEmbed endpoint returned the video and embedding URL on 6 September 2026; the public watch page played the 48-second video by Saulius Petreikis. The earlier video is preserved.

The existing five product screenshots in `marketing/output/chrome-web-store-2.1/` still illustrate the current tab workflow and can be retained. Version-specific asset filenames identify their original capture; they are not package version declarations.

## Verification

- All 67 extension tests pass, including version synchronization and Enter/Escape regression coverage.
- TypeScript compilation passes.
- Production Chrome MV3 ZIP builds successfully.
- All 8 website rendered-route test groups and website lint pass.
- The packaged background worker opens the update page for 2.1.0 to 2.2.0, skips a same-version update, and opens the welcome page on first install.
- ZIP integrity, local asset references, archive/build equality, update-page/source equality, and the support destination are checked.
- Manifest permissions remain `sidePanel`, `tabs`, and `tabGroups`; no host permissions are added.
- The packaged update page was visually inspected in Chrome. The support UI was previously checked at narrow widths in light and dark appearance.

The copy-style guard now checks product source and shipped pages rather than archived video-production files and vendored tools. It remains enabled. The build retains an existing bundle-size advisory; this does not prevent packaging.

## Submission sequence

1. Confirm the store dashboard allows a new package. If a pending submission blocks it, report the blocker without cancelling or withdrawing that submission.
2. Upload the Chrome ZIP and check that the dashboard reads version 2.2.0.
3. Set the promotional video to the new URL above and use the prepared update note. Keep the product free and the permission/privacy disclosures unchanged.
4. At 21:00 Europe/Vilnius on September 6, upload and save as draft only. Do not submit for review or publish; the owner will inspect and submit later.
5. Publish the website with the prepared-release changelog and updated privacy coverage now. After store approval/publication, replace pending-release wording with the actual availability/date.

PR #11 carries this release preparation into `main`. Website publication is a separate operation; merging the source does not deploy the prepared 2.2 changelog. No social or community messages are part of this handoff.
