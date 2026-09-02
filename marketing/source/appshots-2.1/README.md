# TabShow 2.1 raw side-panel screenshot plan

Status: complete. Seven authentic TabShow 2.1 side-panel captures were rendered in Chrome at 420 x 800 CSS pixels with deterministic local mock tab data.

This folder is reserved for authentic Chrome captures of the shipped TabShow
2.1 side panel. No placeholder or fabricated images are included. Each PNG
must be captured from the real extension side panel at 420 x 800 CSS pixels,
with the browser chrome and surrounding page excluded.

## Capture set

| File | Chrome setup | Side-panel state | What it proves |
| --- | --- | --- | --- |
| `01-preview.png` | Open realistic public work tabs, then use `?scenario=preview` only if the harness is needed | Hold a Figma-like row in the amber hover-preview state while the violet current tab remains visible | Hover preview, quick recognition, snap-back context |
| `02-search.png` | Keep a mixed set of docs, design, email, analytics, and project tabs | Search field contains `TabShow` and matching results remain visible | Title, URL, and domain search across open tabs |
| `03-keyboard.png` | Use the same mixed tab set | Search result focused after ArrowDown, with keyboard action affordance visible | ArrowDown, Enter, and Escape navigation flow |
| `04-windows.png` | Use two Chrome windows with realistic public work tabs | All-windows scope enabled, showing both window groups | Cross-window inventory and truthful window scope |
| `05-context.png` | Use grouped and ungrouped tabs, including pinned, audible, discarded, and active examples | Sort menu open with the tab list still legible | Sort controls, group context, pinned and tab-state signals |
| `06-settings.png` | Use a normal mixed tab set | Settings overlay open | Appearance, color pairing, preview delay, and all-windows controls |
| `07-chaos.png` | Use a 150-tab mixed set across four mock windows | Tab Chaos Score drawer open in dark mode | Score explanation, local trend, tab and window totals, duplicates, groups, and quick win |

## Capture protocol

1. Connect to Google Chrome through the Chrome control surface and create a
   fresh Chrome window only if needed.
2. Use public, non-private tab content. Do not include account names, email
   addresses, personal URLs, tokens, notifications, or private workspaces.
3. Build a realistic tab set with Google Docs, Figma, Notion, Linear, Gmail,
   Analytics, and Chrome Web Store pages, or equivalent public pages. Keep
   titles descriptive and non-sensitive.
4. Open the TabShow side panel and set the panel viewport to 420 x 800 CSS
   pixels. Capture the panel surface only, with no browser frame or desktop.
5. Wait for the intended state to settle before capture. For preview, confirm
   the preview is visible. For search and keyboard, confirm the query and
   focused result. For windows and context, confirm the scope or menu is
   visible. For settings, confirm the overlay is fully rendered.
6. Save each PNG beside this file using the names in the capture set. Do not
   overwrite the earlier `marketing/source/appshots/` 2.0 set.
7. Add one Markdown companion per PNG using the same basename. Each companion
   must record the communication goal, visible proof, suggested headline, and
   cautions about claims or private data.

## Companion Markdown template

```md
# <Screenshot title>

- File: `<basename>.png`
- Communicates: <one sentence>
- Visible proof/features: <specific UI evidence>
- Suggested headline: <short launch headline>
- Cautions: <what the image does not prove and any privacy checks>
```

The capture harness renders the production side-panel components with
deterministic local Chrome tab data. It does not recreate the UI as an image,
and it must not be used to imply access to page contents or cross-window hover
preview.
