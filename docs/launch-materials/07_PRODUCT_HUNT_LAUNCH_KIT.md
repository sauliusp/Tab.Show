# TabShow Product Hunt launch kit

Status: refreshed for v2.1 on 2026-09-05. External Product Hunt draft creation and scheduling remain approval-gated.

## Launch thesis

TabShow should launch as a narrow, high-craft recognition tool:

> Preview Chrome tabs before you switch.

Do not market it as another all-purpose tab manager. Product Hunt already has many products promising saved sessions, AI organization, RAM reduction, workspaces, and tab cleanup. TabShow’s differentiated job is simpler: recognize the correct live page before committing to a switch.

Unsupported language remains banned:

- “Zero impact”
- “Ultralight”
- “Join thousands”
- “Best tab manager”
- “Featured”
- Any claim that TabShow reads, understands, or summarizes webpage content

## Ready-to-paste submission

Use [`marketing/output/product-hunt/SUBMISSION.md`](../../marketing/output/product-hunt/SUBMISSION.md) as the source of truth during the logged-in Product Hunt session.

The selected tagline is 37 characters and the description is 251 characters, so both fit Product Hunt’s current 60-character tagline limit and the stricter description limit documented in part of its current help material.

### Fields requiring live confirmation

- Maker username: select Saulius’s personal Product Hunt account. Company accounts cannot post.
- Existing product/relaunch state: search Product Hunt again while logged in. Public search on 2026-07-23 did not reveal an existing TabShow product, but the submission flow is authoritative.
- Shoutouts: optional. Select only genuine tools with Product Hunt entries. Candidates from the actual stack are Google Chrome, React, and Vite or WXT if the latter exists in Product Hunt.
- Launch date: create a draft first. TabShow 2.1.0 is public and installable; do not schedule without separate approval.

## Asset package

All visual files are in `marketing/output/product-hunt/`.

| Asset | Size | Purpose |
|---|---:|---|
| `tabshow-producthunt-thumbnail-240x240.png` | 240×240 | Required square thumbnail |
| `gallery/01-cover.png` | 1270×760 | Intro and core value proposition |
| `gallery/02-live-preview.png` | 1270×760 | The main preview-and-snap-back interaction |
| `gallery/03-search.png` | 1270×760 | Search by title, URL, or domain |
| `gallery/04-keyboard.png` | 1270×760 | Arrow, Enter, Escape workflow |
| `gallery/05-all-windows.png` | 1270×760 | Truthful multi-window behavior |
| `gallery/06-context-and-sorting.png` | 1270×760 | Sorting and tab-state context |

The gallery uses authentic TabShow 2.0 appshots. Imagegen provides only editorial scenery; it does not invent the product interface. The generated thumbnail background source is stored at `marketing/source/imagegen/product-hunt/thumbnail-background.png`. Rebuild with:

```bash
/Users/spetreikis/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 marketing/render_product_hunt_assets.py
```

## Video decision

Use the authentic v2.1 master https://www.youtube.com/watch?v=gfOky71v2wI for a Product Hunt draft after review. Its Chrome Web Store publication is pending Google; do not call it live in the Store.

If a new video is produced before scheduling, keep it to 15–25 seconds:

1. `0–3s`: crowded Chrome tab strip; “Which tab was it?”
2. `3–7s`: open TabShow with the toolbar button or shortcut.
3. `7–12s`: search for a tab and hover to preview the real page.
4. `12–16s`: move away to snap back; click another result to switch.
5. `16–20s`: show All windows and keyboard navigation.
6. `20–23s`: “Preview before you switch. Free for Chrome.”

Use the real extension and believable nonsensitive tabs. No simulated pointer behavior, fake window switching, or claims that hover preview works across windows.

## Launch-day publishing copy

Product Hunt prohibits directly asking people to upvote. Ask them to try the product, join the conversation, or leave honest feedback.

### X

I built TabShow for the moment Chrome turns every tab into a tiny favicon.

Open a searchable side panel, point at a tab to preview the live page, then click to switch or move away to snap back.

It is free, private by design, and live on Product Hunt today. I’d value honest feedback:

`[PRODUCT_HUNT_LAUNCH_URL]`

### LinkedIn

Today I’m launching TabShow on Product Hunt.

The problem is intentionally small: when Chrome’s tab strip gets crowded, finding one page often means clicking through several wrong tabs.

TabShow adds a searchable side panel. Point at a current-window tab to preview its live page, click to switch, or move away to return. Version 2.0 also adds all-window search, keyboard navigation, sorting, and useful tab context.

I deliberately kept it out of the workspace/session-management business. It has no account, backend, ads, tracking, or host permissions.

If crowded Chrome tabs are familiar, I’d appreciate an honest try and your feedback on the Product Hunt discussion:

`[PRODUCT_HUNT_LAUNCH_URL]`

### Existing-user note

TabShow 2.0 is live on Product Hunt today. If you have used it, I’d genuinely value your honest experience in the discussion: what works, what is confusing, and what should improve next.

`[PRODUCT_HUNT_LAUNCH_URL]`

Do not append “please upvote,” offer a reward, or send this as a mass unsolicited DM.

## Response bank

### How is this different from Chrome’s built-in Tab Search?

Chrome Tab Search is good for finding and switching. TabShow keeps the list in the side panel and adds a live preview before you commit, plus sorting and visible context such as groups, pinned tabs, audio, sleeping state, and duplicates.

### Is this another OneTab or Workona?

No. OneTab is primarily about collapsing tabs and memory. Workona is primarily about project workspaces. TabShow leaves live tabs live and helps you identify the correct page quickly.

### Does it read the webpages I visit?

No. TabShow has no host permissions, so it cannot read webpage contents. It uses Chrome’s tab metadata, including titles, URLs, favicons, groups, and status, to build the list and perform actions you request.

### What permissions does it require?

`sidePanel`, `tabs`, and `tabGroups`. There are no host permissions, `activeTab`, or separate favicon-cache permission.

### Does hover preview work across Chrome windows?

Only for tabs in the current window. A tab in another window switches only when clicked, so merely moving the pointer cannot steal focus.

### Is it free?

Yes. TabShow is free. There is no account, subscription, or paid Product Hunt promotion.

### Which browsers are supported?

Google Chrome is the supported target. Do not promise support for other Chromium browsers until they have been tested and documented.

### Does it improve RAM usage?

That is not TabShow’s job. It does not suspend or archive tabs. It helps users recognize and reach the right live tab.

### How does it behave with very large tab counts?

The interface is designed to keep long lists usable, including virtualized rendering. Avoid promising “zero impact.” If a user reports slowdown, ask for their approximate tab count, number of windows, Chrome version, and steps to reproduce.

## Launch operations

### Before creating the draft

- Confirm `https://tab.show/`, `/privacy`, and `/support` return HTTPS 200.
- Confirm the Chrome Web Store redirects to the current TabShow 2.0 listing.
- Confirm version 2.0 is publicly installable, not merely approved or staged.
- Use a personal Product Hunt account that has completed onboarding.
- Check whether Product Hunt recognizes TabShow or `tab.show` as an existing product.

### Draft review

- Paste fields from `SUBMISSION.md`.
- Upload the thumbnail and gallery in the specified order.
- Inspect every gallery image at full size and in the carousel crop.
- Add Saulius as maker.
- Leave the old video and promo blank.
- Save as **Create Draft**, not Schedule Launch.
- Share the draft privately only with real collaborators who need to review it.

### Scheduling

- Schedule only after a separate go-live decision.
- Product Hunt currently allows scheduling within 30 days.
- Product Hunt’s default day begins at approximately 12:01 a.m. Pacific Time. In July that is approximately 10:01 a.m. in Vilnius; confirm the exact local time shown by the scheduler.
- Choose a day Saulius can cover the first six hours and return later for U.S. activity. Product Hunt explicitly says preparation and authentic engagement matter more than a supposedly perfect weekday.

### Launch day

- Be present when the post goes live.
- Publish the prepared maker comment immediately if it was not included during submission.
- Replace `[PRODUCT_HUNT_LAUNCH_URL]` in approved social drafts with the direct Product Hunt post.
- Reply to every substantive comment with a specific answer.
- Log bugs and feature requests on Featurebase; do not argue with criticism.
- Ask for clarification when feedback is vague.
- Never ask directly for upvotes.
- Capture launch-page views, website referrals, Store clicks, installs, comments, and recurring objections after 24 hours and seven days.

## Hard stop conditions

Do not schedule or launch if:

- Chrome Web Store 2.0 is not publicly installable.
- Product Hunt identifies this as a relaunch and the eligibility/change explanation has not been reviewed.
- Any gallery image contains stale 1.x UI.
- The landing page, Store link, privacy page, or support page fails.
- The logged-in account is a company profile rather than Saulius’s personal Product Hunt profile.
- The first comment or outreach copy asks for upvotes.

## Current Product Hunt guidance used

- Submission preparation and field limits: https://www.producthunt.com/launch/preparing-for-launch
- Scheduling and 30-day window: https://help.producthunt.com/en/articles/2724119-how-to-schedule-a-post
- Personal-account requirement: https://help.producthunt.com/en/articles/2305333-getting-started
- Featuring criteria: https://help.producthunt.com/en/articles/9883485-product-hunt-featuring-guidelines
- Relaunch rules: https://help.producthunt.com/en/articles/484934-can-i-relaunch-my-product
- Draft behavior: https://help.producthunt.com/en/articles/9823193-where-did-launch-now-go
