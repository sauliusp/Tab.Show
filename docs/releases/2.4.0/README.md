# TabShow 2.4.0 release candidate

Prepared on 14 November 2026. Status: implementation and validation in progress. This file does not confirm a Chrome Web Store submission or public release.

This release addresses repeated panel closure, losing the current tab in a long list, and settings that did not stay saved. It also explains existing features more clearly. The feedback assessment and scope decisions are in [feedback-plan.md](feedback-plan.md).

## Release scope

- Add **Keep panel open after choosing a tab**. It is off by default. When enabled, choosing a tab keeps the panel open. A choice in the current window becomes the starting point for subsequent previews; choosing another window preserves the original window's return tab.
- Add **Preview tabs on hover**. It is on by default. Users can turn it off while retaining search, keyboard selection, and click-to-switch.
- Save the selected sort order.
- Reveal the current tab when the panel opens and keep list position stable during normal use.
- Keep tab membership accurate when tabs move between windows.
- Show the installed version and help/release-note links in Settings.
- Clarify that System appearance follows light/dark preference, while custom Chrome theme colors stay separate.
- Update welcome and release pages with exact setting names and practical instructions. Use a current product capture on the welcome page.
- Open feature-release notes in an inactive tab; do not open them automatically for patch updates. Keep the notes accessible from Settings.

The release is intended to retain the existing permission set and keep tab data in the browser. Verify both against the final ZIP before submission. The existing close-on-selection and hover-preview defaults are preserved.

## Growth baseline and outcome

The live Chrome developer dashboard showed **356 users** on 14 November 2026. This is the baseline observed during the release work, not an estimate or a promised result. The public Store's cached user count can differ.

The authenticated dashboard baseline is retained locally. Compare its same metric definitions and reporting windows after release; the public repository does not include non-public dashboard analytics.

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
- The Codex review loop is complete and the reviewed release is merged to main before submission.
- Store description and screenshots reflect the packaged behavior. Any retained video is checked against it.
- Website copy and changelog agree with the release status and product behavior.

Record actual results, browser versions, asset paths, and remaining limitations here after the final review. Passing component tests is not a substitute for real Chrome validation.

## Publication record

| Surface | Status at preparation |
|---|---|
| Extension code | Implementation in progress |
| Chrome ZIP | Final package and digest pending |
| Install/update pages | Updated for 2.4; final browser and asset verification pending |
| Store images/video | Audit and final verification pending |
| Website | Update and deployment verification pending |
| Chrome Web Store submission | Not verified |
| Public availability | Not verified |
| Featurebase replies/status changes | Not recorded in this document |

A saved Store draft, uploaded ZIP, submitted review, approved review, and publicly available release are different states. Record the observed state without treating one as the next.
