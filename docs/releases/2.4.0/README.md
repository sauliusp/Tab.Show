# TabShow 2.4.0 release candidate

Updated on 15 November 2026 for source commit `574a63f`. Automated checks, core native checks, and the candidate code review have passed. Final native keyboard, long-list, locale/IME, and asset checks remain pending. The test Mac relocked before those checks could finish. No Chrome Web Store submission or public release is recorded.

This release addresses repeated panel closure, losing the current tab in a long list, and settings that did not stay saved. It also adds German, Simplified Chinese, and Traditional Chinese alongside English, and explains existing features more clearly. See [feedback-plan.md](feedback-plan.md) and [localization-plan.md](localization-plan.md) for the scope and market rationale.

## Release scope

- Add **Keep panel open after choosing a tab**. It is off by default. When enabled, choosing a tab keeps the panel open. A choice in the current window becomes the starting point for subsequent previews; choosing another window preserves the original window's return tab.
- Add **Preview tabs on hover**. It is on by default. Users can turn it off while retaining search, keyboard selection, and click-to-switch.
- Save the selected sort order.
- Reveal the current tab when the panel opens and keep a chosen tab visible when switching within the current window. Background metadata updates do not reset manual scrolling; Recently used intentionally reorders a chosen tab.
- Keep tab membership accurate when tabs move between windows.
- Show the installed version and help/release-note links in Settings.
- Clarify that System appearance follows light/dark preference, while custom Chrome theme colors stay separate.
- Update welcome and release pages with exact setting names and practical instructions. Use a current product capture on the welcome page.
- Open feature-release notes in an inactive tab; do not open them automatically for patch updates. Keep the notes accessible from Settings.
- Follow Chrome's display language for the panel, Settings, accessibility text, share messages, onboarding, and release notes. Keep English fallback and local message catalogs; no translation service is required.

The release is intended to retain the existing permission set and keep tab data in the browser. Verify both against the final ZIP before submission. The existing close-on-selection and hover-preview defaults are preserved.

## Growth baseline and outcome

The authenticated dashboard baseline and country/language exports are retained outside the public repository. Compare the same metric definitions and reporting windows after release. Country and browser-language totals describe different populations and must not be combined into a conversion rate. The localization priorities address existing non-English users as part of the overall market evaluation.

Success means sustained user growth with stable retention. Compare the same report definitions after release and investigate new uninstall or bug-report signals. The report alone cannot establish what caused a change. See the feedback plan for seven-day regression and 30-day outcome checks. No extension telemetry is required for this initial comparison.

## Required validation before submission

- Automated extension tests and TypeScript check pass.
- Production ZIP builds; manifest version, permissions, contents, and digest are recorded.
- Existing settings survive upgrading from 2.3; both new preferences have the stated defaults.
- Pointer preview, return, click/Enter selection, and Escape work with the panel kept open and with the default behavior.
- Turning previews off cancels any pending preview and keeps search/navigation usable.
- Current-tab reveal works in a long list; searching, sorting, scrolling, and collapsed groups do not cause unexpected jumps.
- Tabs moved between windows are reflected in Current window and All windows views.
- Install/update pages, local assets, actions, shortcuts, external links, and responsive layouts are checked in real Chrome. Feature-update notes open inactive; patch updates do not open them automatically.
- German, Simplified Chinese, and Traditional Chinese work in native Chrome, including input-method composition and small panel widths. Enter used to confirm composing text must not choose a tab.
- The Codex review loop is complete and the reviewed release is merged to main before submission.
- Store description and screenshots reflect the packaged behavior. Any retained video is checked against it.
- Website copy and changelog agree with the release status and product behavior.

## Validation record

The native checks below were performed on 15 November in normal Google Chrome using the dedicated TabShow QA profile and sample pages. The Mac subsequently relocked; the remaining native checks have not passed. Component renders remain separate evidence.

| Check | Observed result |
|---|---|
| Upgrade from 2.3 using the same extension ID and path | Dark appearance, Ink color pairing, 350 ms hover delay, and All windows preference survived |
| New preference defaults after upgrade | Keep-open off; hover preview on |
| Feature-update notes | Opened in an inactive tab |
| Default pointer preview and return | Passed |
| Default click and keyboard Enter selection | Selected the requested tab and closed the panel |
| Keep-open selection | Selected the tab and retained the panel |
| Escape while Search is focused | Restored the committed tab and closed the panel |
| Escape while the document/body is focused | Gap found and fixed; native retest of the new fallback is pending |
| Hover previews disabled | Hover did not activate tabs; clicking still selected a tab |
| Persistent cross-window selection | Original window returned to its committed tab; target window switched correctly |
| Tab moved between windows | Window grouping and current-window count updated correctly |
| Saved sorting | Preserved after closing and reopening the panel |
| Welcome/update Open TabShow buttons | Opened the actual extension panel |
| Long-list behavior, input-method composition, and all three new native locales | Pending |

- Automated checks: the complete 165-test extension suite, TypeScript, and production build passed for `574a63f`.
- Localization: all four catalogs contain 341 messages. Tests cover key and placeholder parity, English fallback, number and plural formatting, inline keyboard cues, safe page text, and localized-image fallback. Native Chrome locale selection and Chinese IME checks remain pending.
- Packaging: see [package-audit.md](package-audit.md) for the candidate ZIP identity, contents, permissions, and rebuild verification. Any later extension source or asset change requires a new package and audit. An audited package is not release approval.
- Layout: English component renders were checked at 320 and 360 pixels, and welcome/update pages at desktop and mobile sizes. German overflow at 280 pixels was fixed and visually verified. The three new languages still need native Chrome checks, including zoom and narrow panels.
- Website: the earlier candidate passed all 10 tests and lint, but its first gallery image later failed visual inspection and was removed. The current React 19.2.9 candidate builds and passes 9 of 10 tests; the remaining test correctly fails because the replacement image is missing. Source and installed dependencies match the authoritative Sites checkout, whose build output still contains the older React runtime. The prepared archive at source commit `267aaf674aaeefa9939ecdbbf196517f234699c6` is unsuitable for publication. Recapture the image and rebuild with the patched dependencies before running the full suite and Sites helper again. No Sites version was saved or deployed. See [website-dependency-audit.md](website-dependency-audit.md).
- Media: the native English capture is valid, but the first 1280 × 800 gallery capture was incomplete and has been removed from the Store and website source trees. The prepared Sites archive includes that removed image, is unsuitable for publication, and must be rebuilt after recapture. The gallery clips the bottom of the real capture through CSS; it does not replace or generate the interface. Final capture/asset review against the updated package is pending. The other four slides and two promotional tiles were inspected earlier and also need the final consistency pass. See [asset provenance](../../../marketing/source/appshots-2.4/README.md) and [Store asset status](../../../marketing/output/chrome-web-store-2.4/README.md).
- Existing video: the 31.53-second local demo decodes, and its verified public URL showed the matching default preview/search/keyboard workflow. It does not demonstrate the new optional controls or localized interface. Retain it only with that scope; do not label it a complete 2.4 walkthrough.
- Codex review: [PR 16](https://github.com/sauliusp/Tab.Show/pull/16), branch `codex/2.4.0-panel-workflow`. The latest review covered `574a63f` and reported no major issues (receipt `6890914428`). This covers the candidate code, not the unfinished native UI and asset checks. Later production-code changes require another review before merge.

Complete the remaining native checks in [NATIVE-QA.md](NATIVE-QA.md) and final assets before merging and submitting. Rebuild and re-audit the package after any extension source or asset change.

## Publication record

| Surface | Status at preparation |
|---|---|
| Extension code | Core behavior verified in normal Chrome; Codex review of `574a63f` found no major issues; final native locale/keyboard/long-list checks pending |
| Chrome ZIP | Candidate package audited separately; final native and release gates pending; not submitted |
| Install/update pages | Native Open TabShow and upgrade-note behavior passed; localized native review pending |
| Store images/video | Native English source valid; first composed gallery file is incomplete and must be recaptured; localized native captures and gallery review pending |
| Website | Source pushed at `267aaf6`; prepared archive fails visual asset review and must be rebuilt; not saved or deployed |
| Chrome Web Store submission | Not submitted |
| Public availability | Store still offers 2.3.0 |
| Featurebase replies/status changes | Five replies posted and verified; keep-open and scroll requests In Progress; search/colors Completed; thumbnails In Review |

A saved Store draft, uploaded ZIP, submitted review, approved review, and publicly available release are different states. Record the observed state without treating one as the next.
