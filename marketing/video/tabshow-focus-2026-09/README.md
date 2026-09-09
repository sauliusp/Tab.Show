# TabShow: full-page preview, keep your focus

A separate 31.483-second, 1920×1080, 60fps narrated film. Existing TabShow videos and campaign files remain unchanged. The user authorized public release after a clean PR review and merge.

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

The opening product view and quiet music have 1.2 seconds before narration starts, one second more than the first review cut. The benefit is the first sentence: “Preview the full page without losing your focus.” The first frame already shows the product. Hover, return, and deliberate click each get their own scene. Search, arrow keys and windows follow; the narration and image explicitly say that windows must share one Chrome profile. The ending remains visible for approximately three seconds after the voice finishes.

## Voice and music

The narration uses the same local Chatterbox Multilingual V3 model, private reference digest and expression settings as Tabosmart. Seven new natural scene performances retain their complete timing. Pauses are inserted before narration and between scenes. No speech is accelerated, pitch-shifted or cut internally. The private reference stays outside this repository. Details are in `source/voice-provenance.json` and `source/film-narration.json`.

The original TabShow upbeat ambient composition sits under the narration. The final mix measures approximately -19.2 LUFS integrated and -1.1dB true peak. It uses no borrowed music samples.

Independent transcription of the unmixed scene reads matches every intended word after punctuation, casing and the recognizer's “Tap Show” spelling are normalized. Those approved voice files are unchanged. The mixed-file ASR varies “Preview”/“Review” and “Found”/“Find”, and emits a music-tail “you”; no additional speech was introduced. The user approved the voice and requested the opening pause; the user then authorized release after the PR is reviewed and merged.

## Visual provenance

Panel images are the actual production React captures from `../tabshow-install-2026-09/assets/panels`, using that campaign's deterministic, non-sensitive fixture tabs. They show the existing preview, restore, click-to-commit, all-window search and keyboard-selection behavior. They are campaign captures, not a new recording of Chrome 2.3. Example page surfaces and browser framing are illustrative motion graphics. The original Clear Signal backgrounds, icon and licensed Inter font are preserved.

## Reproduce locally

Run the following from this directory. Node.js 18+, Python 3.12+ with NumPy, FFmpeg, and the checked-in original campaign assets are required. Canvas is a separate, locked media dependency; it is not added to the extension runtime. FFmpeg is resolved from `PATH`, or from the executable specified by `FFMPEG_PATH`.

```sh
npm ci
python3.12 -m venv .venv
.venv/bin/python -m pip install -r requirements-media.txt
.venv/bin/python source/prepare-media.py
npm run stills
npm run render
"${FFMPEG_PATH:-ffmpeg}" -y -i output/TabShow-Focus-30s-silent.mp4 -i audio/final-mix.wav -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 256k -ar 48000 -ac 2 -shortest -movflags +faststart output/TabShow-Focus-30s-1080p60.mp4
```

The scene WAVs, narration timing and independently aligned word timestamps are committed, so reproducing the approved cut does not require generating speech or accessing the private reference. For new narration only, `source/generate-scene-voice.py` and `source/transcribe.py` require the optional Apple Silicon MLX media environment, model downloads and the private reference documented above. Those steps are not needed for ordinary rendering.

Generate the website derivative at 30fps, H.264 CRF22 and 128kbps AAC, preserving fast-start metadata. Keep the complete 31.483-second picture.
These scripts do not upload or publish. `publication.json` records the separate YouTube draft when available.
