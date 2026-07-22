# TabShow Progress Tracker and Metrics

## Purpose

This is the source of truth for tracking TabShow GTM, product handoff, distribution, and growth progress.

## Operating Rhythm

### Weekly Cycle

Monday:

- Sophie scans competitors, Reddit, Product Hunt, HN, Chrome Web Store reviews, and SEO/search signals.
- Sophie recommends the week's GTM priority and product-feedback priority.

Tuesday:

- Sophie prepares specs, copy, SEO briefs, and post drafts.
- Saulius/local Codex picks technical implementation work.

Wednesday/Thursday:

- Saulius/local Codex ships or tests product/website/listing changes.
- Sophie prepares distribution assets for shipped work.
- If a release ZIP is ready, Saulius sends it to Sophie with the release handoff template.

Friday:

- Sophie posts weekly progress summary.
- Track metrics.
- Decide next week's priority.

## Current Strategy

Core positioning:

> Find the tab without switching.

Core product wedge:

> Hover any tab in a side panel to preview the live page, then click to switch or move away to snap back.

Core distribution loop:

Pain signal -> small product improvement -> demo clip -> Reddit/X post -> SEO/changelog page -> review ask -> repeat.

## Progress Board

| Area | Status | Owner | Next Action | Notes |
|---|---|---|---|---|
| Product improvements | Planned | Saulius + local Codex | Pick v1.1 scope | Recommended: search, keyboard navigation, Tab Chaos Score |
| Chrome Web Store ASO | Planned | Sophie drafts, Saulius approves/publishes | Rewrite title/short/long description | Needs dashboard access/stats |
| tab.show SEO pages | Planned | Sophie drafts, Codex/site deploys | Start with `/chrome-tab-preview-extension` | Then competitor pages |
| Reddit distribution | Planned | Sophie drafts, Saulius approves | Prepare first builder-feedback post | Need browser session/rules check |
| X/LinkedIn distribution | Planned | Sophie drafts, Saulius approves | Prepare first demo post | Need demo clip |
| Featurebase feedback loop | Active surface | Sophie monitors, Saulius/product implements | Review and organize requests | https://narsheek.featurebase.app/ |
| Release handoff/shipping | Planned | Saulius builds, Sophie ships | Use ZIP handoff process | See `11_RELEASE_HANDOFF_AND_SHIPPING_PROCESS.md` |
| Product Hunt | Later | Sophie prepares | Wait until v1.1 assets ready | Not first move |
| Review capture | Planned | Product + Sophie copy | Add usage-based review prompt | Trigger after real usage |

## Product Handoff Format

For each technical task, Sophie should create:

- User problem.
- Exact behavior.
- Acceptance criteria.
- UI/copy text.
- Analytics events.
- GTM angle.
- Screenshot/demo needed.

Saulius/local Codex returns:

- What shipped.
- Version/build number.
- Screenshots or demo clip.
- Known limitations.
- Whether it is live, pending review, or local only.
- Extension ZIP when Sophie should handle release operations.
- Permission/privacy change confirmation.

Minimum release handoff:

```
Version:
ZIP:
Summary:
Changes:
Screenshots/demo:
Permissions changed? yes/no
Privacy behavior changed? yes/no
Featurebase links:
Known issues:
Desired action: draft only / submit for review / urgent fix
```

## Weekly Metrics

Track every Friday:

| Metric | This Week | Previous Week | Notes |
|---|---:|---:|---|
| Chrome Web Store users | TBD | TBD | Need dashboard access |
| New installs | TBD | TBD | Need dashboard access |
| Review count | TBD | TBD | Chrome Web Store |
| Average rating | TBD | TBD | Chrome Web Store |
| tab.show visits | TBD | TBD | Need Analytics |
| Website -> Chrome Web Store clicks | TBD | TBD | Need Analytics/event tracking |
| Search Console impressions | TBD | TBD | Need Search Console |
| Search Console clicks | TBD | TBD | Need Search Console |
| Reddit posts/comments | TBD | TBD | Track manually |
| X/LinkedIn posts | TBD | TBD | Track manually |
| Featurebase requests | TBD | TBD | Count new requests/votes |
| Featurebase shipped items | TBD | TBD | Convert shipped items into changelogs |
| Best-performing asset | TBD | TBD | Demo/post/page |
| Top user objection | TBD | TBD | From comments/reviews |
| Top feature request | TBD | TBD | From comments/reviews |

## Decision Log

| Date | Decision | Reason |
|---|---|---|
| 2026-07-11 | TabShow should not position as generic tab manager | Competitors own bigger tab-manager categories |
| 2026-07-11 | Distribution moat is repeated narrative + proof, not feature uniqueness | Hover preview can be copied |
| 2026-07-11 | Tab Chaos Score should become central distribution asset | Makes tab pain measurable, relatable, and shareable |
| 2026-07-11 | Website SEO pages live on tab.show; Chrome Web Store is conversion point | Need both search surfaces |

## Open Access Needs

- Chrome Web Store Developer Dashboard.
- tab.show repo/hosting access or workflow through local Codex.
- Google Search Console.
- Google Analytics.
- Reddit browser session.
- X browser session.
- Product Hunt session later.
- Featurebase admin access for https://narsheek.featurebase.app/.

## Featurebase Workflow

Featurebase should be the public product-feedback hub.

Weekly:

1. Review new requests and votes.
2. Group requests into themes:
   - Find/recognize tabs faster.
   - Return/snap back safely.
   - Manage tab noise.
   - Privacy/trust.
   - Sharing/Tab Chaos Score.
3. Promote the top product-relevant requests into the product backlog.
4. When a request ships, mark it shipped and create:
   - Chrome Web Store changelog text.
   - X/LinkedIn post.
   - Reddit update if relevant.
   - Website/changelog note.

Featurebase is not only support. It is distribution proof that users are shaping the product.

## Approval Rules

Internal docs, research, specs, drafts:

- Sophie can create and update freely.

Website/SEO copy:

- Sophie can draft freely.
- Publishing depends on selected autonomy mode.

Public posts/comments/replies:

- Default: Sophie drafts, Saulius approves before publishing.

Campaign-level autonomy:

- Possible later after Saulius approves weekly scope, tone, and channels.

