# TabShow 2.0 visual system: Clear Signal

Status: selected for local production after comparing three complete directions: dark editorial `Deep Focus`, warm editorial `Clear Signal`, and technical dark `Precision Grid`.

## Decision

Use `Clear Signal` as the shared system for the Chrome Web Store, `tab.show`, onboarding surfaces, and launch graphics.

It wins because it makes the product UI the evidence, feels calmer and more distinctive than another dark productivity interface, preserves TabShow's violet and amber equity, and scales cleanly from a 440×280 tile to a full website. The light website system is paired with dark promo-tile variants so Store merchandising never dissolves into Chrome's white background.

## Palette

| Role | Value | Use |
|---|---|---|
| Warm canvas | `#F7F3E9` | Website and screenshot background |
| Paper | `#FFFDF7` | Product UI and elevated reading surfaces |
| Ink violet | `#211D42` | Primary text, navigation, dark promo backgrounds |
| Muted ink | `#5F5A72` | Supporting text |
| Signal orange | `#F36B21` | Headline emphasis and primary interaction cue |
| Amber | `#FF9A3D` | Hover-preview state and secondary accents |
| Pale amber | `#FFE2BD` | Soft highlight fields |
| Rule | `#D8D1BF` | Borders and dividers |
| Success | `#20835B` | Privacy/trust confirmation only |

Orange means action or the live preview state. It is not decorative confetti. Violet carries the brand and primary controls. Success green appears only when the message is genuinely about privacy, completion, or safety.

## Typography

- Primary family: `Inter`, falling back to `ui-sans-serif`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, and `sans-serif`.
- Display: 760–800 weight, tight tracking (`-0.045em` to `-0.06em`), compact line height.
- Body: 400–500 weight, 1.5–1.65 line height.
- Interface labels: 650–750 weight.
- Editorial labels: 10–12px uppercase with restrained tracking; never use them for paragraphs.
- Avoid faux-handwritten type, novelty display faces, or monospace as the main brand voice.

## Geometry and spacing

- 8px base rhythm.
- 48px desktop outer margin; responsive reduction to 24px and 16px.
- Website content width: 1180–1240px.
- Store screenshots: 44–56px safe edge.
- Interface radii: 7–14px. Major product crop: up to 22px.
- Use rules, whitespace, and alignment before adding cards.
- Shadows are soft and sparse; the active preview may carry one amber-tinted shadow.

## Product treatment

- Show real 2.0 UI at a legible scale.
- Use one dominant interaction per frame.
- Current tab uses violet; preview tab uses orange/amber.
- Browser content and side panel must remain visually separable without a fake device frame.
- Use believable, non-sensitive tab titles and domains.
- Never imply hover preview works in another window.
- Never shrink an entire browser screenshot until the product becomes unreadable.

## Store asset behavior

- Screenshots: warm canvas, ink headline, orange emphasis, one large product proof.
- Small tile: ink-violet field, icon/mark, one short promise, amber preview cue.
- Marquee: warm or ink split field with a large side-panel crop; one headline at most.
- All assets use the same icon, violet, orange, typography, and preview-state language.

## Website behavior

- Warm editorial foundation with a product-first hero.
- Orange is used for the words that carry the benefit, not entire paragraphs.
- Sections remain open and edge-aligned; avoid repeated rounded-card grids.
- Motion is limited to 160–200ms interaction feedback and one restrained product entrance.
- Disable nonessential motion under `prefers-reduced-motion`.

## Community system

Two equal, voluntary actions appear at natural moments:

- `Share feedback`: `Help shape TabShow. Suggest a feature, report a problem, or upvote what we should build next.`
- `Rate TabShow`: `Love TabShow? A 5-star review helps more people find it. Rate only if TabShow has earned it.`

The feedback action links to `https://narsheek.featurebase.app/`. The review action links to the official Chrome Web Store reviews page. Neither action interrupts first use, unlocks functionality, offers a reward, or filters users by sentiment.

## Accessibility floor

- Maintain WCAG AA contrast for text and controls.
- Preserve visible keyboard focus.
- Do not encode current/preview state by color alone; include labels or distinct structure.
- Keep Store annotations readable at half-size.
- Support reduced motion and responsive single-column reflow.
