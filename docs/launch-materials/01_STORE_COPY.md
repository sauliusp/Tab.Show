# TabShow 2.1 Chrome Web Store copy

Status: release-ready draft. This text is grounded in the 2.1 branch and keeps the Store listing focused on the shipped product rather than embedding a long changelog.

## Package title

`TabShow: Live Tab Preview`

Why: brand-first, memorable, and explicit about the distinctive behavior. It removes the current keyword-shaped sentence masquerading as a product name.

## Package summary

`Preview live Chrome tabs before you switch. Search every window and find the right page without losing your place.`

Why: it leads with the distinctive live-preview benefit, includes cross-window search, and ends on the outcome. It is below Chrome's 132-character limit.

## Detailed description

Stop clicking through Chrome tabs just to find the right one.

TabShow is a lightweight tab manager built around one fast idea: see the page before you switch. It puts your open tabs in Chrome's side panel, where you can search, preview, and open the tab you need without losing your place.

SEE THE PAGE BEFORE YOU SWITCH

Point at a tab in your current window and its live page appears in the main browser area. Found the right one? Click to keep it. Not the one? Move away and TabShow returns you to the page you were using.

FIND A TAB FAST

Start typing as soon as the panel opens. Search by page title, URL, or domain. Use Arrow Up and Arrow Down to select a result, Enter to open it, or Escape to return to your original tab and close the panel. Keyboard selection stays switch-free until you press Enter. Live preview remains available on hover.

WORK ACROSS EVERY CHROME WINDOW

Stay focused on the current window or search all open windows from one compact list. Tabs from another window switch only when you click, so a casual hover never pulls you away unexpectedly.

BUILT FOR REAL TAB CHAOS

• Sort by Chrome order, recent use, recent addition, domain, or tab group.
• See tab groups, pinned tabs, audio, muted, sleeping, and duplicate indicators.
• Close tabs directly from the side panel.
• Keep the real open-tab and window totals visible while search filters the list.
• Choose light, dark, or system appearance with readable selected and preview colors.

KNOW YOUR TAB CHAOS SCORE

See a local score based on tab volume, window sprawl, duplicates, long-neglected tabs, and tabs outside groups. Check the trend over time and get one practical suggestion for calming the current session. The score and its history stay in your browser.

PRIVATE BY DESIGN

• No account or sign-in.
• No TabShow backend.
• No advertising or extension analytics.
• No host permissions.
• No access to webpage contents.
• Tab information and settings stay in your browser.

TabShow uses Chrome permissions only to show the side panel, list the tab details Chrome provides, display existing tab groups, and switch or close tabs when you ask it to.

Find the right tab without switching away. TabShow is free to use.

## Version 2.1 update summary

TabShow 2.1 adds:

- A compact, color-coded Tab Chaos Score with local-only tab statistics and trend history.
- Dark, light, and system appearance modes.
- Improved selected and preview colors across light and dark themes.
- Suggest a feature and Tell a friend actions directly in the tab panel.
- A paste-ready Chrome Web Store link with clear copied confirmation.

TabShow 2.1 fixes and refines:

- Open-tab and window totals now remain stable while search filters the visible results.
- The Chaos Score is visually distinct from the actual open-tab count.
- Search, scope, Settings, and Chaos controls now share a compact aligned layout.
- The unnecessary current-window preview banner has been removed while other-window switching remains clear.
- The Chaos button now uses its full severity color for faster recognition.
- Keyboard search behavior and configurable preview timing feel more predictable with large tab collections.

## Permission and privacy language

Use these explanations in the Dashboard Privacy section and on the future `/privacy` page. They describe the permission's actual use, not merely its API definition.

| Permission | Plain-language justification |
|---|---|
| `sidePanel` | Displays TabShow beside the page you are viewing. |
| `tabs` | Reads open-tab titles, URLs, favicons, window membership, and status so TabShow can list, search, sort, preview, switch, and close tabs. It does not grant access to webpage contents. |
| `tabGroups` | Reads tab-group names, colors, membership, and collapsed state so existing Chrome groups can be represented and expanded or collapsed from TabShow. |

The previously declared `activeTab` permission had no implementation use and remains absent from the 2.1 manifest rather than being given a cosmetic justification.

Tab Chaos trend data stays in local extension storage. It retains up to 90 daily check-ins containing a timestamp, local calendar day, derived score, and open-tab count, plus the all-time best score. Repeated panel openings update the current day's record. It does not store titles, URLs, domains, favicons, or page contents. Users can delete it by clearing TabShow's extension data in Chrome or uninstalling the extension.

## Copy deliberately removed

- Historical release notes, old names (`Narsheek`, `TabGlance`), contributor asides, and emojis.
- The ADHD reference.
- `Best`, `join thousands`, `zero impact`, `100% free forever`, and rating claims without their denominator.
- Competitor names and repetitive keyword strings.
- Claims that hover preview works across other windows.

Release history belongs at `https://tab.show/changelog`; support belongs at `https://tab.show/support`.

## Community calls to action

These are approved cross-surface messages for the extension and website. They are not inserted into the Store description itself, where they would distract from installation.

- Feedback: `Help shape TabShow. Suggest a feature, report a problem, or upvote what we should build next.`
- Feedback button: `Share feedback`
- Review: `Love TabShow? A 5-star review helps more people find it.`
- Review button: `Rate TabShow`

Feedback points to `https://narsheek.featurebase.app/`. Reviews point to the official Chrome Web Store reviews page. Both actions must remain voluntary, unincentivized, and equally available; neither is used to unlock functionality or filter users by sentiment.
