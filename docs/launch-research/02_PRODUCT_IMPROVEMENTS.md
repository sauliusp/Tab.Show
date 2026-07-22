# TabShow Product Improvements

## Product Strategy

Keep TabShow lightweight. Do not turn it into Workona, OneTab, or a full workspace system. The core product promise should stay:

> Find the right tab without switching away.

The improvement strategy is to strengthen the preview loop, not expand into every tab-management category.

## Priority 1: Search and Keyboard Navigation

Why:

Heavy tab users think "I need the Figma tab" or "where is that Stripe doc?" Hover preview is strongest after search narrows the list.

Recommended behavior:

- Search by tab title and URL.
- Typing should focus search immediately when panel opens.
- Arrow keys move through results.
- Hover triggers preview; keyboard focus selects without switching.
- Enter switches to the highlighted tab.
- Esc returns to the original tab and closes search/panel.

Growth impact:

Turns TabShow from a cool demo into a daily tool.

## Priority 2: Multi-Window Awareness

Why:

Competitors repeatedly promise "all windows." Power users often spread tabs across windows by project.

Recommended behavior:

- Show tabs grouped by Chrome window.
- Name windows if Chrome exposes names.
- Preserve current-window-first ordering.
- Add a compact "All windows" toggle.

Growth impact:

Makes TabShow credible for serious tab users.

## Priority 3: Recent, Domain, and Group Sorting

Why:

Users rarely remember exact titles. They remember recency, source, or project.

Recommended modes:

- Current order.
- Recently used.
- Recently opened.
- By domain.
- By tab group.

Growth impact:

Helps different user types get value without creating complex workspaces.

## Priority 4: Tab State Indicators

Why:

Small indicators make the product feel professional and reduce switching friction.

Add:

- Audio playing.
- Muted.
- Pinned.
- Duplicate.
- Discarded/sleeping if available.
- Tab group color/name.

Optional actions:

- Close.
- Pin/unpin.
- Mute/unmute.
- Close duplicate.

Growth impact:

Signals "this is a serious tab tool" without bloating the product.

## Priority 5: Tab Chaos Score

Why:

This creates a repeatable reason to open the panel and a shareable hook for growth.

Local-only stats:

- Total open tabs.
- Windows count.
- Duplicate count.
- Top domains.
- Oldest tab.
- Number of tab groups.
- Current tab position.

Privacy wording:

"Calculated locally. TabShow does not send your tab data anywhere."

Growth impact:

Gives users a story they can share.

## Priority 6: Share Card Generator

Why:

"Tell a Friend" copies a link. That is weak. A share card creates a reason to talk about TabShow.

Recommended defaults:

- Redact tab titles by default.
- Show stats only.
- Let user choose "show domains" or "hide domains."
- Add tab.show watermark and QR/link.

Example copy:

"I had 147 Chrome tabs open. TabShow still let me find the right one without switching."

Growth impact:

Turns personal tab chaos into distribution.

## Priority 7: First-Run Aha Moment

Why:

Users need to experience hover-preview immediately.

Recommended onboarding:

1. Open side panel after install.
2. Show one instruction: "Hover a tab to preview it. Move away to snap back."
3. Ask the user to try it.
4. After first successful preview, show keyboard shortcut.
5. After 3-5 successful sessions, ask for review.

Growth impact:

Higher activation, more reviews, less confusion.

## Do Not Build Yet

Avoid these unless retention data proves the need:

- Full cloud sync.
- Team sharing.
- Notes/tasks.
- Full session manager.
- AI grouping as the main promise.
- Heavy workspace model.

These move TabShow into crowded categories and weaken its lightweight trust advantage.
