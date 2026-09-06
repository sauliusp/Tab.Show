# TabShow install film — September 2026

A 48-second product animation for YouTube and the Chrome Web Store. The film leads with TabShow's live-preview behavior, demonstrates deliberate selection, and ends with one install action. It is designed to remain understandable without sound. The original instrumental supplies rhythm and quiet interaction cues; there is no spoken narration.

## Delivery

Use `output/TabShow-Chrome-Web-Store-1080p60.mp4` for upload. The `output` directory also contains a matching 1280×720 JPEG thumbnail, a 1920×1080 PNG poster, English timed text (`.srt`/`.vtt`), an accessible transcript, plain-text title/description/tags, and structured upload metadata.

Published and verified: https://www.youtube.com/watch?v=gfOky71v2wI on Saulius Petreikis. `publication.json` records the live result, and `youtube-draft.md` contains the publishing guide and official source guidance. Use this public URL in the Chrome Web Store video field. The Chrome Web Store listing itself was not edited in this task.

## Separate upbeat ambient edition — 6 September

The [new YouTube edition](https://www.youtube.com/watch?v=nVGewf2igpo) uses a warm, light 120 BPM soundtrack with soft syncopated chords and a brushed backbeat. Its picture stream is identical to the original. The original film and Chrome Web Store URL above remain intact.

Use `output/TabShow-Chrome-Web-Store-1080p60-Upbeat-Ambient.mp4` for the new edition. [UPBEAT-AMBIENT.md](UPBEAT-AMBIENT.md) describes its separate upload package, source and verification; `publication-upbeat-ambient.json` records its own public result.

## Creative sequence

| Time | Purpose | Visual proof |
| --- | --- | --- |
| 00:00–00:04.80 | Recognizable problem | Crowded tab strip; one right page |
| 00:04.80–00:08 | Introduce TabShow | Side panel beside the current page |
| 00:08–00:12 | Show the distinct benefit | Hover highlights the tab and previews the page |
| 00:12–00:16 | Show that the original context is retained | Cursor leaves the panel and original page returns |
| 00:16–00:20 | Demonstrate a decision | Click opens the chosen tab and closes the panel |
| 00:20–00:27.50 | Find a tab across windows | All windows, a website query, exact results |
| 00:27.50–00:34 | Show keyboard control | Down selects, Enter opens the other-window result |
| 00:34–00:40 | Reduce installation friction | Free, no account, no tracking, local tab information |
| 00:40–00:48 | Clear conversion action | Add to Chrome; tab.show |

The broader public YouTube chapters begin at 00:00, 00:20 and 00:34. Their durations satisfy the documented minimum of ten seconds per chapter.

## Product and brand sources

The film and poster use the existing Clear Signal palette, Inter, the actual TabShow icon, and the exact light/dark backgrounds from `marketing/source/cws-2.1-backgrounds`. The poster deliberately follows the current Chrome Web Store gallery's layout and headline, “See the page. Keep your place.”

Side panels are authentic captures of the production React components with the repository's deterministic, non-sensitive example tabs. The capture manifest documents pixel sizes, DOM bounds and behavior assertions. The surrounding document/design page surfaces and Chrome tab-strip framing are illustrative motion graphics. They are not recordings of private Google Docs/Figma accounts. Current-window preview, leaving-panel restore, click-close, cross-window filtering and keyboard selection are verified against the production component behavior.

Existing assets and production files were not replaced. All new work is additive in this directory.

## Reproduce

1. `node capture-panels.mjs` regenerates the actual panel captures using the existing appshot harness.
2. `python3 audio/render_audio.py` regenerates the original sample-free soundtrack; NumPy and FFmpeg are required.
3. `node render.mjs stills` produces keyframes and both poster formats.
4. `node render.mjs video` renders the 48-second, 60 fps silent picture master.
5. `node package.mjs` produces the YouTube text and timed-text files.
6. Run the command in `finish.sh` to mux the soundtrack and verify the finished file.

The rendering scripts use the bundled Codex Canvas/Playwright runtimes and `/usr/local/bin/ffmpeg`. Inter is included under the SIL Open Font License in `assets/fonts/OFL.txt`; static font instances are derived from the licensed variable source. No third-party recorded music or music samples are used.

## Validation

Final codec, duration, audio loudness, decode integrity, black-frame checks and keyframe contact sheet are recorded in `qa/`. Claims were checked against the 2.1 Store copy, production source, visual system and live Store listing. Independent review checked readability, thumbnail consistency, panel crops and keyboard timing. No claim is made that a particular number of installs or search placements is guaranteed.
