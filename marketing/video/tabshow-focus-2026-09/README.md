# TabShow: full-page preview, keep your focus

A separate 30.483-second, 1920×1080, 60fps narrated film. Existing TabShow videos and campaign files remain unchanged. Public release awaits the user's review.

## Review files

- `output/TabShow-Focus-30s-1080p60.mp4`: YouTube and Chrome Web Store master.
- `output/TabShow-Thumbnail-1280x720.jpg`: matching thumbnail.
- `output/TabShow-English.srt` and `.vtt`: timed English captions.
- `output/TabShow-Transcript.txt`: complete narration.
- `output/YouTube-Title.txt`, `YouTube-Description.txt`, `YouTube-Tags.txt`: upload metadata.
- `qa/contact-sheet.jpg`: ten rendered frames, including opening and final frame.
- `qa/summary.json`: measured duration, digest, provenance and review boundary.

The website uses a 30fps, approximately 2.2MB derivative with a native player, captions and transcript. It does not load a third-party player or autoplay.

## Story and pacing

The benefit is the first sentence: “Preview the full page without losing your focus.” The first frame already shows the product. Hover, return, and deliberate click each get their own scene. Search, arrow keys and windows follow; the narration and image explicitly say that windows must share one Chrome profile. The ending remains visible for approximately three seconds after the voice finishes.

## Voice and music

The narration uses the same local Chatterbox Multilingual V3 model, private reference digest and expression settings as Tabosmart. Seven new natural scene performances retain their complete timing. Pauses are inserted between scenes only. No speech is accelerated, pitch-shifted or cut internally. The private reference stays outside this repository. Details are in `source/voice-provenance.json` and `source/film-narration.json`.

The original TabShow upbeat ambient composition sits under the narration. The final mix measures approximately -19.2 LUFS integrated and -1.0dB true peak. It uses no borrowed music samples.

Independent local transcription matches every intended narration word after punctuation, casing and the recognizer's “Tap Show” spelling are normalized. The earlier encoded-file ASR also emitted a low-confidence “you” in the music-only closing hold (30.0s, no-speech probability 0.878); there is no voice stem at that point. Human assessment of voice likeness remains for the user's review.

## Visual provenance

Panel images are the actual production React captures from `../tabshow-install-2026-09/assets/panels`, using that campaign's deterministic, non-sensitive fixture tabs. They show the existing preview, restore, click-to-commit, all-window search and keyboard-selection behavior. They are campaign captures, not a new recording of Chrome 2.3. Example page surfaces and browser framing are illustrative motion graphics. The original Clear Signal backgrounds, icon and licensed Inter font are preserved.

## Reproduce locally

The installed local media environment is `~/.cache/historyout-media-venv/bin/python`. Rendering uses Node, the bundled Canvas package and FFmpeg. The voice reference and original campaign assets are required.

1. Run `source/generate-scene-voice.py` to generate missing scene WAVs. Existing WAVs are preserved.
2. Run `source/transcribe.py audio/film-voice.wav source/scenes-transcript-check.json`.
3. Run `source/prepare-media.py` to produce the timeline, timed voice, captions and mix.
4. Run `node render.mjs stills`, then `node render.mjs video` from this directory.
5. Mux the silent picture master with `audio/final-mix.wav` using H.264 stream copy and 256kbps AAC stereo at 48kHz. Keep the complete 30.483-second picture.
6. Generate the website derivative at 30fps, H.264 CRF22 and 128kbps AAC; preserve fast-start metadata.

These scripts do not upload or publish. `publication.json` records the separate YouTube draft when available.
