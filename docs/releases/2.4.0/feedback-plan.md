# Matrazo Matrazo feedback assessment

Reviewed on 14 November 2026 in the signed-in Featurebase dashboard. The profile showed two requests, three comments, and votes on Hover Delay and Popup view; the activity was labelled “5 days ago.” Dates below use 9 November as that relative date, not an independently exported timestamp. No installed extension version was provided by the user.

The Store item list showed **356 users** on 14 November 2026. A dated baseline of the authenticated dashboard's installs, uninstalls, page views, impressions, and weekly users is retained in the local release workspace. The repository is public, so it does not publish the dashboard's non-public analytics.

Retain each metric's dashboard definition. Do not divide installs by page views and call it conversion, or equate net installs with active-user growth. The goal is to remove repeat-use friction while preserving the preview workflow and privacy model. Increased user count is an outcome to measure, not a guarantee.

## Feedback inventory and decisions

| Activity | What it establishes | Decision for 2.4 |
|---|---|---|
| Request: [Option to keep panel open](https://narsheek.featurebase.app/dashboard/requests/6af1a7295d52c7a40415b504) | Selecting a tab closes the panel; Chrome's pin icon was mistaken for a keep-open control. | Implement an explicit persisted option, off by default. Explain the difference from Chrome's pin. This removes a repeated action for people who use TabShow as a sidebar. |
| Request: [Visual thumbnails, possibly in a fisheye menu.](https://narsheek.featurebase.app/dashboard/requests/6af1a4a7d1ecc85c0f9a24a7) | Wants visual recognition in the list, with optional expanding thumbnails and proposed 120/240/480 px sizes; offers collaboration. | Defer the thumbnail prototype; do not implement the fisheye dock in this release. The recognition need is reasonable. The proposed interaction and capture requirements need separate validation. |
| Comment: [Tab Search](https://narsheek.featurebase.app/dashboard/requests/68dc9fb97c9997cb6b9f72d6) | “This is implemented now?? Or is this request different than the current implementation?” The thread was already Completed. | Existing search is implemented. Explain that it searches open-tab titles and URLs, including domains. Improve version/help access; do not assume the commenter has an old version. |
| Comment: [Always scroll into view the original tab](https://narsheek.featurebase.app/dashboard/requests/68de6edfdc74aa6f373ae7cc) | Selecting a tab leaves the list at the top instead of keeping the relevant tab visible. | Fix initial current-tab reveal and stable list positioning. Treat this as a usability defect, not a new feature category. |
| Comment: [Ability to customise colors](https://narsheek.featurebase.app/dashboard/requests/68de7017ec52ffe5f4d25bbd) | Requests following the current Chrome theme. The broader color-customization thread was already Completed. | Explain the distinction: light/dark/system and color pairings exist; reading a custom Chrome theme's exact palette is not supported by the public theme API. Clarify Settings rather than marking exact theme matching as shipped. |
| Vote: [Hover Delay](https://narsheek.featurebase.app/dashboard/requests/6940ee0819d121e41e182985) | Interest in controlling accidental previews. Delay already exists. | Point to Settings → Hover preview delay. Add a separate, explicit hover-preview on/off choice while preserving the default. A vote alone does not establish that the voter failed to find or update the extension. |
| Vote: [Popup view](https://narsheek.featurebase.app/dashboard/requests/694b656421cd57c54a683a80) | Interest in another presentation. No detailed workflow was supplied in this vote. | Defer. A popup introduces another UI and lifecycle without evidence of a growth benefit. Validate the use case before building it. |

## Product and engineering assessment

**Keep-open behavior:** a strong improvement because it removes repeated reopening for an existing user. Preserve close-on-selection for everyone who prefers the current workflow. When persistent mode is enabled, a committed selection in the panel's own window becomes the new preview return target. Choosing a tab in another window preserves the original window's return tab. Escape must remain predictable. Chrome confirms that its side-panel pin pins the action icon; it does not impose a persistent selection workflow. [Side Panel API](https://developer.chrome.com/docs/extensions/reference/api/sidePanel)

**Current-tab visibility:** a direct reliability improvement. On opening, reveal the current tab. After a user deliberately scrolls or navigates, avoid unsolicited jumps caused by background tab events. Test long lists, filters, groups, and tabs moved between windows.

**Thumbnails:** the proposed benefit is real, but Chrome's standard capture API captures the visible area of the currently active tab. It requires `activeTab` or `<all_urls>` and is rate-limited to two captures per second. Capturing and retaining page images would change TabShow's current data-handling promises. A useful prototype would have to explain stale/missing previews, protect sensitive pages, handle sleeping tabs, and work without activating every tab. The expanding dock also trades list density and stable targets for motion. These costs are not justified by one request alone. [Tabs API](https://developer.chrome.com/docs/extensions/reference/api/tabs/)

**Chrome theme matching:** Chrome supports declarative themes but does not expose the WebExtensions `theme.getCurrent` API. System light/dark support is already present and should be described accurately. [Chrome theme documentation](https://developer.chrome.com/docs/extensions/develop/ui/themes), [MDN compatibility data](https://raw.githubusercontent.com/mdn/browser-compat-data/main/webextensions/api/theme.json)

**Popup:** Chrome action popups close when focus moves outside them and cannot be kept open after that. This is a poor fit for the same user's persistent-panel need. It may serve a separate quick-switching workflow, but that remains a hypothesis. [Popup documentation](https://developer.chrome.com/docs/extensions/develop/ui/add-popup)

## Implementation and release plan

1. Implement optional keep-open behavior, optional hover previews, persisted sorting, current-tab reveal, stable scrolling, and window-movement fixes. Preserve existing defaults and permissions.
2. Add installed version and help/release-note access to Settings. Clarify System appearance. Use the exact setting labels in onboarding, release notes, website, and feedback explanations.
3. Replace the welcome page's simulated panel with a current product capture. Keep the first-use task simple: open, hover, move away, and click to choose. Open feature-release notes in an inactive tab; skip automatic notes for patch updates. Keep notes accessible from Settings.
4. Update the Store gallery around observable behavior. The first image should show the actual page preview beside the panel. Give persistent mode a useful place in the gallery; keep secondary scoring out of the lead message. Retain existing media only where it remains accurate.
5. Run automated checks, real Chrome behavior tests, upgrade/default checks, responsive review, and package/permission verification. Record results in the release README.
6. Complete the Codex review loop and merge the reviewed release to main, as requested. Submit the verified package and aligned Store materials. Record submission separately from public availability. Update website release status only when its wording matches the observed state.
7. Close the feedback loop with the authorized professional Featurebase replies and status changes. Before public availability, state that fixes are in the release candidate or under review, as applicable. Mark implemented requests Completed only after the update is publicly available. Explain existing features without blaming the commenter. Keep thumbnail and popup requests open or deferred as appropriate; do not mark them implemented.

## Growth evaluation

The primary product promise remains finding the right live tab without losing the starting point. These changes support retention and make the promise easier to understand; they do not create acquisition on their own.

Record the actual public release date and retain this baseline report. Review the first seven days for regression signals, then compare a full 30-day post-release period with the same dashboard metrics and interval definitions. No recurring job is created by this plan.

- **Retention signal:** weekly users and the item-list user count should show sustained growth. Investigate any rise in uninstalls together with new bug reports, rollout timing, and traffic mix.
- **Acquisition signal:** compare Store impressions, page views, and installs separately. Use a dashboard-provided conversion metric only if its population and attribution window are documented; do not invent one by dividing these totals.
- **Product signal:** check whether new feedback still reports unexpected closure, list jumps, missing search, or unclear theme behavior. These observations can confirm resolved friction without collecting extension browsing data.
- **Release quality:** compare feedback before and after rollout, and check that users reporting a problem actually have the affected version. Do not assume an old version or user error.

Small samples, changing traffic sources, and rollout delays limit causal conclusions. Do not attribute all changes to 2.4 or claim a specific percentage gain in advance.

No added accounts, AI features, background page capture, history tracking, mandatory onboarding steps, or review incentives are part of this release. Reviews should be voluntary and neutral. Do not describe feedback volume from one active person as broad market demand.
