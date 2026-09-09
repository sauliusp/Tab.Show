# TabShow 2.0 launch-material and website plan

Status: website launch complete on 2026-07-22. The Drive research archive, extension changes, authentic appshot campaign, Chrome Store copy/assets, nine-route Sites website, release ZIP, and launch handoffs are finished and verified. The Sites deployment is public, `tab.show` and `www.tab.show` are active with valid SSL, and key production routes return HTTPS 200. External work remains paused before any Developer Dashboard edit/upload and Store submission. The correct Dashboard profile remains `Saulius Extensions` (`saulius.developer@gmail.com`).

## Executive verdict

TabShow 2.0 is a real relaunch, not a cosmetic update. The branch implements most of the strongest product recommendations in the research: search, keyboard flow, multi-window access, sorting, tab-state context, duplicate detection, safer previews, better empty/loading states, and first-run education.

The current marketing is weaker than the product. It describes TabShow as a generic free tab manager, repeats unsupported superlatives, and underplays the live-preview interaction that is actually distinctive. The website also contradicts itself: it calls the product new and asks for early adopters while claiming “join thousands,” “featured,” “zero impact,” and “best.” That is not confident positioning; it is credibility debt.

The 2.0 relaunch should own one promise:

> Find the right Chrome tab without losing your place.

The interaction proof is:

> Search or point at a tab, preview the live page, then click to switch or move away to snap back.

## Non-negotiable truth rules

Every public claim must be traceable to the shipped extension, current Store data, or measured analytics.

Remove unless independently verified at production time:

- “Best free Chrome tab manager.”
- “Join thousands.”
- “Featured” as an unqualified or permanent claim. The public Store listing currently shows Chrome’s real `Featured` badge, so the website may accurately say `Featured on the Chrome Web Store` only while that badge remains live.
- “Zero impact on browser speed.”
- “100% free forever.” Use “Free” if that is true now; do not promise an irreversible business model.
- “5★ rated” as major social proof. The current public rating is 5.0, but it comes from only three ratings; hiding the denominator is technically true and strategically cheap.
- Exact package-size claims copied from the old listing. The 2.0 production build is different.
- Medical or treatment-adjacent ADHD claims.

Do not describe current-window hover preview as working across all windows. In 2.0, other-window tabs are click-to-switch; the UI deliberately prevents hover from stealing window focus.

## What 2.0 actually ships

| Capability | Evidence in this branch | Launch use |
|---|---|---|
| Live full-page hover preview and snap-back | Existing core flow plus safer preview cancellation | Hero interaction and screenshot 1 |
| Search by title, URL, and domain | Search field plus `selectTabs` filtering | Primary 2.0 feature |
| Keyboard flow | Arrow select, Enter open, Escape restore/close; hover preview stays separate | Screenshot 3 and power-user proof |
| Current window / all windows | Persisted scope toggle and all-window tab query | Screenshot 2 |
| Five sort modes | Current order, recently used, recently added (approx.), domain, group | Supporting screenshot or description |
| Tab context | Domain, group, pinned, audio/muted, sleeping, duplicates | Detail proof, not the headline |
| Large-list performance | Virtualized tab rendering; test fixture covers 150 tabs | May say “built for large tab collections”; do not publish an absolute performance guarantee without a repeatable benchmark |
| Clear states | Loading, empty scope, and no-results UI | Quality signal; not a promo headline |
| First-run and 2.0 pages | New welcome and what’s-new experiences | Activation and post-update education |
| Privacy posture | No account/backend in this repo; permissions remain browser-local extension permissions | Trust proof after privacy/disclosure verification |

Not shipped and therefore not launch claims:

- Tab Chaos Score.
- Share-card generator.
- Cloud sync, sessions, workspaces, teams, notes, or AI grouping.
- User-created window names.
- Pin/mute actions beyond the currently implemented close action and displayed status.

## Launch message hierarchy

1. Pain: Chrome tabs become impossible to recognize when titles collapse.
2. Promise: find the right tab without losing your place.
3. Demonstration: search/point, live preview, snap back or switch.
4. 2.0 credibility: every window, useful sorting, keyboard control, tab-state context.
5. Trust: no account; local-first behavior; precise permission/privacy disclosure.
6. CTA: Add to Chrome: Free.
7. Community loop: invite ideas and bug reports through `https://narsheek.featurebase.app/`, and ask satisfied users for an honest five-star Store review without rewards or review gating.

Avoid leading with “vertical tabs.” It is accurate but commoditized. Avoid leading with “tab manager.” It puts TabShow into a feature-checklist fight against products built for session recovery, workspaces, or memory reduction.

## Chrome Web Store production plan

### Verified public listing baseline: 2026-07-22

The public Chrome Web Store listing currently shows:

- Title: `TabShow | Point at Tabs in a Side Panel to See Full Pages Without Switching`.
- Summary: `Vertical tabs with site icons and titles. Move your mouse over tabs to see a full page preview without switching. Click to switch.`
- Version: `1.0.0`, last updated January 20, 2026.
- Size: `167 KiB` for the currently published 1.0.0 package.
- Users: `239` at the time of this audit.
- Rating: `5.0` from `3 ratings`.
- Store status: real `Featured` badge and “Follows recommended practices” marker.
- Language: English (United States).
- Website: `https://tab.show/`.
- Developer contact: `sauliusthedev@gmail.com`.
- Privacy summary: the developer declares that the extension does not collect or use data.
- Public media: four screenshots and a promo video are present. The private dashboard confirms one unused fifth screenshot slot, a small promo tile, and a marquee tile.

Public-listing verdict:

- The title is far too long and reads like keyword inventory rather than a brand.
- The summary explains mechanics but misses the sharper benefit: preserving context while finding the right tab.
- The detailed description is an unedited wall of numbered instructions, separators, emojis, acknowledgements, old product names, and release history. It forces buyers to excavate the product value.
- The phrase “whether you have ADHD or just too many tabs” is an unnecessary medical-adjacent targeting risk. Replace it with non-medical language about context switching and large tab collections.
- Release history dating back to TabGlance and Narsheek does not belong in the conversion copy. Put it on the website changelog.
- The privacy section is directionally strong, but `minimal permissions` should be replaced by a plain-language explanation of each requested permission.
- The live metrics prove the website’s `join thousands` claim false. Remove it immediately.
- The Featured badge is real. Use it accurately and contextually, not as a vague self-awarded statistic.
- A perfect rating from three ratings is too fragile to lead the page. Show the rating with its count or keep it secondary.

### Phase 0: completed private dashboard audit

The private Store Listing page confirms the item is `Published - public`, under publisher `Saulius`, with the expected item ID `njdjagodlomkhingeecipnlnnhnipkho`.

| Surface | Current private-dashboard evidence | Verdict and required action |
|---|---|---|
| Package title | `TabShow | Point at Tabs in a Side Panel to See Full Pages Without Switching` | Accurate but exhausting and keyword-shaped. Replace with a short brand-first title after checking the package limit. |
| Package summary | `Vertical tabs with site icons and titles. Move your mouse over tabs to see a full page preview without switching. Click to switch.` | Mechanically accurate but generic and 1.x-focused. Lead with finding the right tab without losing context. |
| Description | 5,649/16,000 characters; long hover instructions followed by privacy copy and a release log from 1.0.0 back to 0.5.0 | This is a changelog dump, not conversion copy. Remove old names, version archaeology, contributor asides, emojis, separators, and the ADHD line. Move release history to `/changelog`. |
| Privacy note in description | Says local-only, no backend/data collection, no host permissions, and minimal permissions | Directionally strong. Keep the substance but replace `minimal permissions` with a plain-language permission-by-permission explanation verified against the 2.0 manifest. |
| Store icon | 128×128 dark-violet tab/list mark with amber accents | Recognizable and consistent enough to retain for launch unless the later brand system produces a demonstrably stronger mark. The icon is not the current conversion problem. |
| Promo video | A YouTube URL is populated; its full ID was truncated in the supplied capture | Audit the actual video against 2.0. Replace or remove it if it demonstrates the old interface or contradicts the new screenshot story. |
| Screenshots | Four installed, fifth slot empty; all use the old dark-violet 1.x slide treatment | Replace all four and add a fifth. They omit every important 2.0 addition: search, keyboard flow, all windows, sorting, indicators, and current onboarding. |
| Small promo tile | White 440×280 tile with icon and `Tabs Made Clear` | Generic, visually timid, and unrelated to the distinctive preview interaction. Replace completely. |
| Marquee tile | Mostly empty white 1400×560 tile with small `Tab.Show`, `Full-page tab previews on hover. Decide faster.` | Severely under-scaled, generic, and brand-inconsistent. Replace completely; do not preserve the old punctuation or layout. |
| Official URL | `https://tab.show/` | Keep. |
| Homepage URL | Empty | Populate with the canonical product homepage if the Dashboard accepts the same verified site. |
| Support URL | Empty | Add `https://tab.show/support` when that route is live. |

The four current screenshots are closer to instruction slides than Store merchandising: dense copy, tiny annotations, obsolete UI, and weak product proof. The privacy frame wastes a scarce screenshot on a paragraph users cannot comfortably read at thumbnail size. The small tile could advertise any tab manager. The marquee wastes most of its canvas and gives the product neither scale nor motion.

Not visible in the supplied Store Listing captures: category, locale controls, Privacy-page declarations and permission justifications, Distribution settings, full video URL, asset review status, and any validation warnings outside the captured area. Check these during production QA before saving a new draft; do not infer them from the absence of visible warnings.

### Phase 1: copy system

Draft three coherent layers from the same promise:

- Manifest name: short, brand-first, no keyword stuffing. Preferred direction: `TabShow: Live Tab Preview` if the actual title limit and uniqueness permit it.
- Manifest/store summary: one plain sentence under the current limit. Preferred direction: `Search or point at tabs to preview the live page, then switch or snap back without losing your place.`
- Detailed description: one opening paragraph, a concise feature list, privacy/trust note, and accurate cross-window behavior.

The exact final text is a later deliverable and must be checked against the live dashboard field limits. Competitor names do not belong in the Store summary. Keywords belong naturally in useful prose, not in a repeated list.

### Phase 2: five-screenshot narrative

Use the maximum five screenshots at 1280×800, full bleed, square corners, consistent product state, and minimal annotation. This is a complete replacement set, not a refresh of the current slide deck.

1. **Find the tab without losing your place.** A believable 40–80-tab browser scene, TabShow open, and a live hover preview. This is the differentiator and must be first.
2. **Search every open tab.** Search narrows a realistic mixed set; show current/all-window scope and result count without visual clutter.
3. **Work at keyboard speed.** Highlight one result and show a compact `↑ ↓ / Enter / Esc` flow. Do not turn the screenshot into a keyboard manual.
4. **See every window, clearly.** Current window first; another window visible as click-to-switch. Copy must not imply cross-window hover preview.
5. **Useful context, still lightweight.** Domain, group, pinned, audio/muted, sleeping, duplicate markers, sorting, and the local/private trust message. If this becomes too dense, prioritize context and move privacy to the description/website.

Production rules:

- Capture actual 2.0 UI, not a fictional redesign.
- Use realistic but non-sensitive tabs and redact personal data.
- Keep each frame to one message and one proof.
- Never show a capability that requires a click as if it were hover behavior.
- Test readability at half size.
- Use the same color pairing, type treatment, and icon across screenshots, tiles, site, and social preview.

### Phase 3: small promo tile

Required format: 440×280 PNG or JPEG.

Current verdict: reject the white `Tabs Made Clear` tile. Its claim is interchangeable with every tab organizer, and the layout becomes even weaker at merchandising size.

Creative direction: a saturated TabShow brand field, the icon, and one instantly legible visual metaphor for point → preview. Avoid a literal shrunken screenshot. Prefer no copy; if copy is needed, use only `Preview before you switch` or the shorter `Hover. Preview. Focus.` after verifying it remains legible at half size.

Reject any tile that relies on a “Featured,” rating, user-count, speed, or “#1” badge.

### Phase 4: marquee promo tile

Optional format: 1400×560 PNG or JPEG.

Current verdict: reject the mostly empty white tile. `Tab.Show` conflicts with the current `TabShow` brand, the artwork has no product proof, and `Decide faster` is a vague benefit that could describe any productivity tool.

Creative direction: one wide browser-workflow composition with the TabShow panel on the left, a live page preview in the center/right, generous negative space, and consistent saturated brand color. One short line at most. It must communicate the interaction even if editorial merchandising crops or scales it.

The marquee is not a banner ad and should not be a collage of five features.

### Phase 5: release package and Store QA

Before any upload or submission:

- Build the production ZIP and inspect `manifest.json`, version, icons, permissions, and package contents.
- Confirm privacy disclosures match actual permissions and behavior.
- Confirm every screenshot matches 2.0.
- Confirm website and privacy-policy URLs resolve.
- Populate and verify Homepage and Support URLs; verify the privacy-policy field separately on the Dashboard Privacy page.
- Confirm title/summary/description do not conflict with the package manifest.
- Check image dimensions, format, file size, readability, and promo-review status.
- Save the dashboard changes as draft first.
- Require explicit approval before submission for review.

## Website plan for `tab.show` using Sites

The website is the SEO and education layer; the Chrome Web Store is the conversion endpoint. Rebuild the current site as a multi-route product website with Sites rather than stretching the existing one-page page into a keyword dump.

### Harsh current-site audit

The current site has a usable explanation of hover preview, tab groups, and the snap-back interaction. Everything around that core is inflated or generic:

- The H1 `TabShow: Point at Tabs Like Magic` is vague and juvenile compared with the product’s actual value.
- “The best free Chrome tab manager” forces an unwinnable category comparison and is repeated heavily enough to feel like keyword stuffing.
- `Join thousands`, `Zero impact`, and `100% free forever` create proof obligations the page does not satisfy. `Featured` is currently supported by the Store badge, but the website should identify the source. `5★ Rated` is technically true yet based on only three ratings, so the current presentation overstates the depth of proof.
- `Why Power Users Love TabShow` appears without substantive user proof.
- “Early adopter” and “join thousands” cannot both carry the same page credibly.
- The page markets 1.x-era capabilities and omits the strongest 2.0 additions.
- The FAQ and feature sections repeat claims instead of answering high-intent comparison and privacy questions deeply.

### Information architecture

Initial launch routes:

- `/`: product homepage and 2.0 conversion page.
- `/chrome-tab-preview-extension`: exact category/behavior page.
- `/find-lost-chrome-tab`: pain-led educational page.
- `/onetab-alternative`: honest job-to-be-done comparison.
- `/workona-alternative`: lightweight/no-account contrast.
- `/tab-manager-plus-alternative`: recognition loop versus management dashboard.
- `/privacy`: plain-language permissions, local processing, and data handling.
- `/changelog`: 2.0 release and future update proof.
- `/support`: shortcut, side-panel, preview behavior, known limitations, feedback route.

Do not ship the comparison routes as template-swapped thin pages. Each must say who should choose the competitor, show the different job, contain a real TabShow demo, answer relevant questions, and lead to the Store CTA.

### Homepage structure

1. Hero: `Find the right Chrome tab without losing your place.`
2. One interaction demo: search/point → live preview → snap back or switch.
3. 2.0 proof strip: search, all windows, sort, keyboard.
4. “What TabShow is / is not” comparison: live recognition tool, not a workspace/session saver.
5. Privacy and permissions in plain language.
6. Real product screenshots and onboarding.
7. Honest FAQ, including cross-window limitations and shortcut conflicts.
8. Community proof and participation: a prominent `Share feedback` route to Featurebase, explaining that users can submit ideas, report problems, comment, and upvote priorities.
9. Final Store CTA plus a separate review request: `Love TabShow? A 5-star review helps more people find it.`

### Feedback and review loop

- Keep `https://narsheek.featurebase.app/` as the canonical public feedback board until a branded feedback subdomain is configured.
- Place `Share feedback` in the extension settings, onboarding, What's New page, website navigation/footer, and support page.
- Explain the value of participating: users can suggest features, report bugs, upvote existing ideas, and see what gets shipped.
- Use one direct review line: `Love TabShow? A 5-star review helps more people find it.` Link it to the official Chrome Web Store reviews page.
- Never reward reviews, block functionality behind a review, pre-fill a review, suppress negative feedback, or show the Store link only after a positive-sentiment gate. Featurebase and Store review actions remain equally available.
- Ask at natural success moments, not on first launch: after repeat use, on the What's New page, in settings, and on the website. Do not interrupt tab work with review popups.

### SEO and technical requirements

- One search intent and one canonical URL per page.
- Unique title, meta description, H1, supporting copy, and social preview per route.
- Internal links from educational/comparison pages to the behavior page and homepage.
- Product/software application structured data only where its fields are factual.
- FAQ structured data only for visible, genuine FAQs.
- XML sitemap, robots directives, canonical tags, 404 page, and redirects from any retired URLs.
- Fast, accessible rendering; descriptive alt text; keyboard access; reduced-motion handling.
- A bespoke Open Graph image derived from the final visual system, not a generic starter graphic.
- Measure Store CTA clicks by page and campaign. Do not collect browsing/tab content.

### Sites execution later

When website production begins:

1. Preserve the current site as a reference and inventory existing URLs/analytics before replacement.
2. Use the Sites capability path because this is a multi-route replacement, not a one-page blank project.
3. Choose the visual direction with the prescribed three-option design selection before product implementation.
4. Build the approved system with real 2.0 copy and screenshots.
5. Validate the complete build, metadata, responsive behavior, accessibility, and conversion links.
6. Deploy to a staging URL first; move `tab.show` only after content, analytics, redirects, and Store links are approved.

## Coordinated launch sequence

1. Freeze truthful Store copy and the five-frame screenshot story from this completed audit.
2. Freeze one visual system shared by Store, website, and social assets.
3. Produce and review screenshots.
4. Produce small and marquee promo tiles.
5. Build the multi-route `tab.show` site with Sites and the SEO plan above.
6. Package and inspect extension 2.0.
7. Recheck the private Dashboard fields not visible in the supplied captures: Privacy, Distribution, category/locales, validation warnings, and asset status.
8. Update Store listing as a draft and QA all fields/assets.
9. Deploy the approved website and verify analytics/redirects.
10. Submit Store update only after explicit approval.
11. Publish release notes and distribution assets when the update is live, not merely submitted.
12. Review impressions → listing views → installs → retained use → reviews after 7 and 30 days.

## Success metrics and kill criteria

Track:

- Store impressions and listing visits.
- Listing-view-to-install conversion.
- Website organic visits by landing page and query class.
- Website-to-Store CTA conversion by page.
- Install/uninstall trend after 2.0.
- Activation signals available without collecting tab content: panel opens, first preview, first search, all-window use, keyboard use.
- Review volume and rating, without incentivization.

Kill or rewrite a claim/asset when it earns attention but depresses install conversion, creates confusion in reviews, cannot be proven, or attracts users seeking session saving/workspace management that TabShow does not provide.

## Implementation outcome

The complete local plan is now represented by these release artifacts:

- Store copy and privacy language: `docs/launch-materials/01_STORE_COPY.md`
- Selected visual system: `docs/launch-materials/02_VISUAL_SYSTEM.md`
- Dashboard field and asset map: `docs/launch-materials/03_DASHBOARD_HANDOFF.md`
- Sites launch and domain handoff: `docs/launch-materials/04_WEBSITE_LAUNCH_HANDOFF.md`
- Reproducible QA evidence: `docs/launch-materials/05_RELEASE_QA.md`
- Explicit approval gates: `docs/launch-materials/06_LAUNCH_CHECKLIST.md`
- Authentic appshots, ImageGen editorial sources, compositor, final assets, and prompts: `marketing/`
- Multi-route SEO implementation: `website/`
- Product Hunt submission, launch operations, reply bank, thumbnail, and six-frame gallery: `docs/launch-materials/07_PRODUCT_HUNT_LAUNCH_KIT.md` and `marketing/output/product-hunt/`
- Chrome upload package: `.output/tabshow-2.0.0-chrome.zip`

Phases 1–6 are complete locally, and the website publishing/domain-cutover portion of phase 9 is complete in production. Analytics and Search Console remain follow-up work. Phases 7–8 and 10 still require explicit external authorization and live-environment verification. No Developer Dashboard state has been changed.

## Current verification

On 2026-07-22, the extension passed all 36 tests across seven test files, TypeScript compilation, and a production Chrome MV3 build/ZIP inspection. The website passed lint, a production Sites/vinext build, and six rendered-output test groups covering the complete route set and release archive. The final ZIP is `.output/tabshow-2.0.0-chrome.zip`; its recorded SHA-256 is in the release QA and Dashboard handoff.

The build emits a 530.90 kB side-panel JavaScript chunk warning; this is not a launch blocker by itself, but it weakens any unsupported “ultralight” or “zero impact” claim and should be benchmarked before performance marketing.

Official Chrome Web Store guidance used for the asset plan:

- https://developer.chrome.com/docs/webstore/best-listing
- https://developer.chrome.com/docs/webstore/cws-dashboard-listing
- https://developer.chrome.com/docs/webstore/program-policies/listing-requirements
