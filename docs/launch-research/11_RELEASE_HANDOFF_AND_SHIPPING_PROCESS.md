# TabShow Release Handoff and Shipping Process

## Goal

Make shipping streamlined when Saulius/local Codex handles technical implementation and Sophie handles release operations, notes, GTM, feedback loops, and distribution.

## Ownership

### Saulius + Local Codex Own

- Technical implementation.
- Local testing.
- Version bump.
- Building the Chrome extension ZIP.
- Confirming what changed and what is known-risk.

### Sophie Owns

- Release checklist.
- ZIP/package inspection.
- Chrome Web Store update notes.
- Chrome Web Store listing copy changes when needed.
- Featurebase status updates.
- tab.show changelog/SEO updates.
- X/LinkedIn/Reddit/Product Hunt draft assets.
- Weekly release summary and metrics tracking.

## Handoff From Saulius to Sophie

For every release, Saulius sends:

1. Extension ZIP file.
2. Version number.
3. One-line summary.
4. What changed.
5. Screenshots or demo clip if UI changed.
6. Known limitations/bugs.
7. Whether permissions changed.
8. Whether privacy behavior changed.
9. Which Featurebase request(s), if any, this resolves.
10. Whether this is:
    - draft only,
    - submit for review,
    - urgent fix.

## Sophie Release Checklist

### 1. Package Inspection

Check:

- ZIP opens cleanly.
- `manifest.json` exists.
- Version number changed.
- No obvious source junk, secrets, or local-only files.
- Required assets/icons exist.
- Permissions did not change unexpectedly.
- Extension name/description are consistent with positioning.

If permissions changed:

- Flag to Saulius.
- Update privacy/disclosure notes if required.
- Do not submit without explicit approval.

### 2. Release Notes

Create Chrome Web Store update notes:

- What improved.
- Why it matters.
- Keep it user-facing and concise.

Template:

> New in TabShow [version]: [feature].
> This helps you [user benefit].
> The goal stays the same: find the right Chrome tab without switching away.

### 3. Featurebase

If tied to a Featurebase request:

- Mark as shipped or update status.
- Comment with release note.
- Credit user-requested feedback when appropriate.

Template:

> Shipped in v[version]. Thanks for suggesting this. TabShow now [behavior], so it is easier to [benefit].

### 4. Chrome Web Store

With dashboard access, Sophie can:

- Upload ZIP.
- Add release notes.
- Update listing copy/screenshots if needed.
- Submit for review after approval mode allows it.

Important:

Chrome Web Store review can take time. "Submitted" is not the same as "live."

### 5. tab.show Website

If relevant, prepare:

- Changelog entry.
- Homepage copy tweak.
- SEO page update.
- Comparison page update.

If site deploy is handled by local Codex:

- Sophie prepares exact copy/brief.
- Saulius/local Codex deploys.

If Sophie has site access:

- Sophie can update according to the agreed approval mode.

### 6. Distribution Assets

For each shipped feature, Sophie creates:

- X/LinkedIn post.
- Reddit update or comment draft if relevant.
- Chrome Web Store changelog copy.
- Featurebase shipped note.
- Demo script or screenshot brief.

Rule:

Every feature shipped should create 3-5 distribution assets.

## Approval Modes

### Conservative

Sophie prepares everything. Saulius approves before:

- Chrome Web Store submission.
- Website publication.
- Public social/community posting.

### Semi-Autonomous Recommended

Sophie can:

- Update internal docs.
- Prepare release notes.
- Upload draft assets.
- Publish low-risk changelog/SEO copy if already approved in scope.

Saulius approves:

- Chrome Web Store submission.
- Reddit/X/Product Hunt posts.
- Permission/privacy-changing releases.

### Campaign-Level Autonomy

Saulius approves a weekly release/distribution plan. Sophie executes inside that scope.

## Release Statuses

- `Planned`: spec exists, not implemented.
- `In local Codex`: Saulius/local Codex implementing.
- `Ready for Sophie`: ZIP + handoff received.
- `Package checked`: Sophie inspected ZIP.
- `Submitted`: Chrome Web Store submission done.
- `Live`: Chrome Web Store update live.
- `Distributed`: changelog/social/Featurebase/SEO assets published or drafted.
- `Measured`: metrics reviewed.

## Minimum Release Handoff Template

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

## Risk Rules

Do not submit if:

- Permissions changed and Saulius has not approved.
- Privacy behavior changed and disclosures are not updated.
- ZIP contains local secrets or irrelevant files.
- Version number was not bumped.
- The change breaks the core promise: hover, preview, snap back.

## Practical Flow

1. Sophie creates product spec from GTM/user signal.
2. Saulius runs local Codex and builds the feature.
3. Saulius sends ZIP + handoff template.
4. Sophie inspects package and prepares release notes.
5. Sophie uploads/submits according to approval mode.
6. Sophie updates Featurebase/changelog/posts.
7. Sophie tracks metrics and feeds learning into next spec.

