# TabShow 2.4 Chrome Web Store copy

Status: draft for the 2.4 release candidate. Verify the final package and assets before saving or publishing. This document does not confirm submission or public availability.

## Package title

`TabShow: Live Tab Preview`

## Package summary

`Preview live Chrome tabs before you switch. Search your tabs and find the right page without losing your place.`

## Detailed description

Find the right tab without clicking through every page.

TabShow puts your open Chrome tabs in a searchable side panel. Hover a tab to see the live page in your current window. Move away to return to where you started, or click to choose that page.

SEARCH YOUR OPEN TABS

Search by page title, URL, or domain. Start typing when the panel opens, use the arrow keys to select a result, and press Enter to choose it. Escape returns to your starting tab and closes the panel. Keyboard selection does not change the page until you press Enter.

KEEP THE PANEL OPEN IF YOU WANT

By default, choosing a tab closes TabShow. Turn on “Keep panel open after choosing a tab” in Settings to leave it open. Choosing a tab in the current window makes it the starting point for your next preview.

Opening TabShow brings your current tab into view. Your preferred sort order stays saved.

CONTROL HOVER PREVIEWS

Live previews are on by default. Adjust “Hover preview delay” to avoid accidental switches, or turn off “Preview tabs on hover” to browse the list without changing the page. Search and click-to-switch work either way.

FIND TABS ACROSS WINDOWS

Choose Current window or All windows to find tabs in the same Chrome profile. Separate Work and Personal profiles stay separate. Tabs in another window switch only when you choose them; hovering never changes the focused window.

MORE CONTEXT IN THE LIST

• Sort by Chrome order, recent use, recent addition (approximate), domain, or tab group.
• See existing groups and pinned, audio, muted, sleeping, and duplicate indicators.
• Close individual tabs from the side panel.
• Keep open-tab and window totals visible while searching.
• Choose light, dark, or system appearance and a color pairing. System follows your light/dark preference, not custom Chrome theme colors.
• See a local Tab Chaos Score and a practical suggestion based on your open tabs.

YOUR TAB DATA STAYS IN YOUR BROWSER

No account, ads, extension analytics, or TabShow backend. No host permissions or access to webpage contents. TabShow uses the tab details Chrome provides to list, search, sort, preview, switch, and close tabs. Settings and the local score history stay in your browser.

Every feature is free. Supporting development through Buy Me a Coffee is optional.

WHAT'S NEW IN 2.4

Optional keep-open mode, a switch for hover previews, saved sorting, and your current tab in view when opening the panel. Tab lists also update correctly when tabs move between windows. Settings now includes the installed version, help, and release notes. Existing defaults stay the same.

Changelog: https://tab.show/changelog
Privacy: https://tab.show/privacy
Help: https://tab.show/support
Feedback: https://narsheek.featurebase.app/

## Store assets

Use current captures of the packaged extension. Recommended gallery order:

1. Live page preview beside the side panel, with the original/preview relationship visible.
2. Search by title or website.
3. Keyboard selection and the current tab in view.
4. Tabs across windows in the same Chrome profile.
5. The keep-open setting and hover controls.

Each image should explain one task with short text. Do not use generated UI, unsupported claims, an obsolete version label, or a screenshot that hides the page being previewed. Existing branding can be retained.

The existing voiced walkthrough is `https://www.youtube.com/watch?v=ZznCNcOynjw`. Verify the live video's visibility, captions, and shown behavior before retaining it. Its default preview-and-close workflow remains relevant, but it does not demonstrate the new optional settings. Do not call it a 2.4 feature walkthrough unless it is updated accordingly.

## Permission and privacy checks

Compare the final manifest and behavior with these explanations before submission.

| Permission | Plain-language justification |
|---|---|
| `sidePanel` | Displays TabShow beside the page being viewed. |
| `tabs` | Reads open-tab titles, URLs, favicons, window membership, and status so TabShow can list, search, sort, preview, switch, and close tabs. It does not grant access to webpage contents. |
| `tabGroups` | Reads group names, colors, membership, and collapsed state so existing groups can be displayed and expanded or collapsed. |

No thumbnail capture, history access, accounts, or new host access is planned for 2.4. Do not add justifications for permissions that the final package does not use.

The local Tab Chaos history retains up to 90 daily check-ins containing a timestamp, calendar day, derived score, and open-tab count, plus the all-time best score. It does not retain titles, URLs, domains, favicons, or page contents. New panel preferences stay local with the existing settings.

## Community copy

Use voluntary, neutral requests:

- Feedback: “Report a problem or suggest an improvement.”
- Review: “Leave an honest review to help others decide whether TabShow fits their workflow.”
- Share: “Find the right Chrome tab without losing your place.”

Do not ask specifically for five stars, filter review invitations by sentiment, or offer features or benefits in exchange for reviews.
