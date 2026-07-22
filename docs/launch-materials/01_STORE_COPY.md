# TabShow 2.0 Chrome Web Store copy

Status: implementation draft for approval. This text is grounded in the 2.0 branch and replaces the current 5,649-character description and embedded legacy changelog.

## Package title

`TabShow — Live Tab Preview`

Why: brand-first, memorable, and explicit about the distinctive behavior. It removes the current keyword-shaped sentence masquerading as a product name.

## Package summary

`Search or point at open tabs to preview the live page, then switch or snap back without losing your place.`

Why: it states the two primary discovery modes, shows the interaction, and ends on the user benefit. It is 106 characters, below Chrome's 132-character limit.

## Detailed description

Find the right Chrome tab without losing your place.

TabShow puts your open tabs in Chrome's side panel. Search by title, URL, or domain, or point at a tab to preview its live page. Click to switch, or move away to return to the page you were using.

What you can do:

- Preview a live tab before switching to it.
- Search open tabs by page title, URL, or domain.
- Use the current window or find tabs across every Chrome window.
- Sort tabs by browser order, recent use, recent addition, domain, or group.
- Navigate with the keyboard: Arrow keys select, Enter opens, and Escape returns. Hover a current-window tab to preview it.
- See useful context including tab groups, pinned tabs, audio, muted and sleeping states, and duplicates.
- Close tabs directly from the side panel.

Cross-window behavior is deliberately safe: tabs in another window switch only when clicked, so moving the pointer cannot unexpectedly steal focus.

Privacy by design:

- No account or sign-in.
- No backend service.
- No advertising or tracking.
- No host permissions.
- No access to the contents of webpages.
- Tab information and settings stay in your browser.

TabShow uses Chrome permissions only to show its side panel; list tab titles, URLs, and favicons; display tab groups; and switch or close tabs when you ask it to.

Free to use.

## Permission and privacy language

Use these explanations in the Dashboard Privacy section and on the future `/privacy` page. They describe the permission's actual use, not merely its API definition.

| Permission | Plain-language justification |
|---|---|
| `sidePanel` | Displays TabShow beside the page you are viewing. |
| `tabs` | Reads open-tab titles, URLs, favicons, window membership, and status so TabShow can list, search, sort, preview, switch, and close tabs. It does not grant access to webpage contents. |
| `tabGroups` | Reads tab-group names, colors, membership, and collapsed state so existing Chrome groups can be represented and expanded or collapsed from TabShow. |

The previously declared `activeTab` permission had no implementation use and has been removed from the 2.0 manifest rather than given a cosmetic justification.

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
