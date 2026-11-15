# Native Chrome validation

Updated 15 November 2026. Use normal Google Chrome with the dedicated TabShow QA profile, sample pages, and the same unpacked extension ID/path. The earlier locked-Mac blocker has ended. Do not treat a component harness or an extension reload as proof of a native interaction or upgrade event.

## Recorded passes

- The 2.3 to 2.4 upgrade preserved Dark appearance, Ink color pairing, 350 ms hover delay, and All windows. Keep-open defaulted off and hover preview on. The feature-update notes opened in an inactive tab.
- Default hover preview and pointer-leave return worked. Clicking or pressing Enter selected the requested tab and closed the panel.
- Keep-open selection retained the panel. Escape with Search focused restored the committed tab and closed the panel.
- With hover previews off, hovering did not activate tabs and clicking still worked.
- Cross-window selection restored the original window's committed tab and selected the target in the other window.
- Moving a tab between windows updated its section and the current-window count.
- The selected sort order survived closing and reopening the panel.
- Open TabShow worked from the actual welcome and update pages.

Supporting captures are in `qa/native-2.3-preferences.jpg`, `qa/native-2.4-migrated-preferences.jpg`, `qa/native-upgrade-inactive-notes.jpg`, `qa/native-default-preview.jpg`, and `qa/native-default-selected.jpg`. Other passes above are observed interactions, not claims that those five images prove every step.

## Remaining checks on the final build

1. **Body-focused Escape:** choose B with keep-open enabled, move from a blank panel area onto C so the panel document/body retains focus, then press Escape. It must restore B and close once. Retest the new fallback with Search focused and with Settings, sort, and score overlays open so it does not bypass their keyboard behavior.
2. **Long list:** start with the current tab near the bottom. Verify current-tab reveal, stable manual scrolling, keyboard reveal, search inside collapsed groups, and no unsolicited jumps after metadata updates. Confirm saved sorting again in this scenario. Recently used intentionally reorders a committed choice.
3. **Chinese input methods:** in Simplified and Traditional Chinese, use a real IME to compose search text. Enter used to confirm composition must not select a tab. After composition ends, arrows and Enter must navigate and select normally; Escape must retain the expected preview/return behavior.
4. **Three native locales:** run German, Simplified Chinese, and Traditional Chinese in actual Chrome. Check panel labels, counts, settings, help, welcome/update text, clipboard/share feedback, accessibility names, and language fallback. Inspect narrow panels and zoom, especially long German Settings labels and footer buttons. Repeat the default and keep-open flows.
5. **Hover-setting transitions:** disable previews during an active or pending preview and verify return without closing the panel. Re-enable and verify the configured delay. Automated coverage exists; the remaining transition cases still need native confirmation.
6. **Remaining onboarding/update cases:** verify localized shortcut instructions and external help links. Confirm that a patch update does not open notes automatically; an unpacked reload by itself is insufficient evidence. Feature-update inactivity and both Open TabShow actions already passed.
7. **Final capture and assets:** review or replace `marketing/source/appshots-2.4/live-browser.jpg` against the updated package. A normal-Chrome English capture and gallery slide 1 now exist. The slide's CSS crops the lower part of that real capture. Inspect the final 1280 × 800 output, all other images, and localized assets. Synchronize the first website image to both website checkouts; the repository copy exists, while the authoritative Sites checkout copy remains pending at this update.
8. **Exact release artifact:** run the complete current tests and build, generate a new ZIP, and record version, locale files, permissions, integrity, byte size, and digest. The previous ZIP/hash are obsolete. Include the locale-sync script in the sources archive. Complete Codex review of the new head before merging; the clean review of `315c1b0` does not cover later localization or keyboard changes.

After those checks pass, upload the verified package and current Store assets, inspect the listing preview, submit, and record the returned review state. Publish the matching Sites version only after its own final checks. Submission, approval, and public availability are different states; update Featurebase to match the state actually observed.
