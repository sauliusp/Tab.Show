# Featurebase responses and status record

Current state, 16 November 2026: public Store availability of 2.4.0 was verified before posting the two publication replies below and changing keep-open and scrolling to **Completed**. Their rendered replies and status controls were checked. The older entries preserve the state and wording at the time they were posted.

## Publication follow-ups posted 16 November 2026

### Keep panel open: Completed

> TabShow 2.4.0 is now available in the Chrome Web Store. Enable Settings → Keep panel open after choosing a tab to use this option. It is off by default, so existing behavior stays the same until you enable it.

> Settings now shows your installed version. If it still shows an older version, let Chrome finish updating before looking for the new control. This request is now completed.

### Scroll current tab into view: Completed

> The scrolling fix is now available in TabShow 2.4.0 on the Chrome Web Store. Opening the panel brings the current tab into view, manual scrolling stays put during pointer and tab-title updates, and your sort choice is saved.

> Use Chrome order for stable tab positions. Recently used still moves the newly chosen tab to the top by design. You can check your installed version in Settings. This request is now completed.

No duplicate replies were added to search, colors, thumbnails, or popup. No unsupported feature was marked shipped. Proof captures `featurebase-keep-open-completed.jpg` and `featurebase-scroll-completed.jpg` are retained privately with the 16 November release evidence.

## Preparation replies posted 14 November 2026

On 14 November 2026, five responses were posted and their rendered discussion entries verified in the authenticated Featurebase dashboard. The two implemented requests were changed from In Review to In Progress. None was marked newly Completed. The replies explicitly identify 2.4 as a release candidate still in testing and review, not available in the Store.

Posted request locations:

- [Keep panel open](https://narsheek.featurebase.app/dashboard/requests/6af1a7295d52c7a40415b504): public request comment; In Progress.
- [Scroll current tab into view](https://narsheek.featurebase.app/dashboard/requests/68de6edfdc74aa6f373ae7cc): public request comment covering the original request and mattrazzo's additional report; In Progress.
- [Tab Search](https://narsheek.featurebase.app/dashboard/requests/68dc9fb97c9997cb6b9f72d6): direct reply to mattrazzo; existing Completed state retained.
- [Color customization](https://narsheek.featurebase.app/dashboard/requests/68de7017ec52ffe5f4d25bbd): direct reply to mattrazzo; existing Completed state retained for color pairings, with exact Chrome-theme matching explicitly distinguished.
- [Thumbnails and fisheye menu](https://narsheek.featurebase.app/dashboard/requests/6af1a4a7d1ecc85c0f9a24a7): public request comment declining inclusion in 2.4 and explaining capture/interaction costs; In Review retained without a roadmap promise.

Private dashboard screenshots are retained outside the public repository. The response text below preserves the preparation drafts; posted text uses the same decisions and clarifies that Recently used intentionally moves the chosen tab to the top. After Store submission, report only the observed availability state. Mark the two implemented requests Completed only once 2.4 is publicly available.

## Submission follow-ups posted 15 November 2026

Two further comments were posted after the verified Chrome Web Store submission and their rendered entries checked. Both requests remain **In Progress** until the update is publicly available. The keep-open follow-up includes the keyboard-focus correction; the earlier preparation drafts below remain unchanged. Proof captures `featurebase/keep-open-submitted.png` and `featurebase/scroll-submitted.png` are retained outside this public repository.

### Keep panel open

> Version 2.4.0 has passed testing and is now submitted to the Chrome Web Store for review. It will publish automatically if approved. This request stays In Progress until the update is available.

> Once 2.4 arrives, enable Settings → Keep panel open after choosing a tab. One correction to my earlier reply: Escape returns and closes the panel while the panel has keyboard focus. After a hover preview, move the pointer out of the panel to return, or click Search before using keyboard commands.

### Scroll current tab into view

> The scrolling fix and saved sort order are included in 2.4.0, now submitted to the Chrome Web Store for review after testing in Chrome. Publication is automatic if Google approves it.

> This request stays In Progress until the update is available. Chrome order keeps the tab positions stable; Recently used intentionally moves the newly chosen tab to the top.

The canonical review and publication status is in the [release README](README.md#publication-record).

## Option to keep panel open

Chrome's pin icon pins TabShow to the toolbar; it does not keep the panel open after a selection. That distinction was unclear.

The 2.4 release candidate adds Settings → Keep panel open after choosing a tab. It is off by default, so the current behavior stays the same unless you turn it on. With it enabled, a click or Enter keeps the panel open. A selection in the current window becomes the page subsequent previews return to. Escape still returns and closes the panel.

The release is not available in the Store yet. I will update this request when it is.

Status: use the board's available implementation/release-pending state; keep availability explicit. Completed only after public rollout.

## Always scroll into view the original tab

The list was falling back to the first tab on opening and also scrolling during pointer and tab updates. That explains the jump you described.

The 2.4 release candidate opens with the current tab in view and preserves manual scrolling. Keyboard navigation still brings the selected result into view. It also remembers your sort choice. Together with the optional keep-open setting, this should remove the repeated reopening and repositioning.

The release is not available in the Store yet. I will update this request when it is.

Status: implementation/release-pending until public rollout.

## Tab Search

Yes, this is implemented. Search shipped in 2.0, and this request is marked Completed. The search field is at the top of the panel. It matches open-tab titles, URLs, and domains, including tabs inside collapsed groups. All windows extends the search to windows in the same Chrome profile.

No separate search feature is waiting on this request. The 2.4 release candidate also adds the installed version and help links in Settings, so it is easier to check what is available.

Status: leave Completed. Do not infer that the commenter uses an old version.

## Ability to customise colors

System already follows the system's light or dark appearance. Matching the colors of an installed Chrome theme is a separate capability: Chrome does not expose that theme palette to an extension through its public API.

The existing light/dark/system modes and color pairings remain available. The 2.4 release candidate explains this distinction in Settings. I am not marking exact Chrome-theme matching as implemented.

Status: leave the original color-pairing request Completed; the reply distinguishes this additional request from the shipped feature.

## Visual thumbnails, possibly in a fisheye menu.

Visual recognition is a useful goal. I am keeping the full-page live preview as TabShow's main interaction and not adding thumbnails or a fisheye menu in 2.4.

Chrome's capture API provides the currently visible tab, not a ready-made image of every background or sleeping tab. A thumbnail feature would need extra capture access, rules for sensitive pages, and a clear way to handle missing or stale images. The expanding dock would also reduce how many tabs fit and move targets while you are aiming at them.

I will leave this under review rather than promise it on the roadmap. A stable thumbnail prototype that handles those limits and keyboard navigation would be useful evidence before committing to the feature. The offer to collaborate is appreciated.

Status: remain In Review. Do not mark thumbnails or fisheye as planned or shipped.

## Votes on Hover Delay and Popup view

A vote is not a separate comment requiring a reply. Hover Delay is already Completed; 2.4 adds a separate Preview tabs on hover switch. Popup view remains under review. Avoid posting duplicate replies merely because one person voted on these requests.
