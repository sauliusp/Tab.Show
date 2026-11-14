# Featurebase response drafts

Prepared 14 November 2026. These are unsent drafts. Replace the release-availability sentence with the verified Store state immediately before posting, and record the posted comment links afterward. Do not mark the two implemented requests Completed until the release is publicly available.

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
