# TabShow upbeat ambient edition

This is a separate 48-second YouTube edition with a new upbeat ambient soundtrack. The picture, product demonstration, captions, chapter timings, description, tags, poster and thumbnail are shared with the original film.

The original Chrome Web Store video remains [gfOky71v2wI](https://www.youtube.com/watch?v=gfOky71v2wI). Its master, upload package and publication record remain unchanged. This edition is published as a separate video; its own live URL and verified publication status are recorded in `publication-upbeat-ambient.json`.

Published and verified on 6 September 2026: [watch the upbeat edition](https://www.youtube.com/watch?v=nVGewf2igpo). Playback at 1080p60, English captions, transcript and all three chapters were checked on the public video.

## Upload material

- **Video:** `TabShow-Chrome-Web-Store-1080p60-Upbeat-Ambient.mp4`
- **Title:** TabShow for Chrome — Live Tab Preview in 48 Seconds
- **Title file:** `YouTube-Title-Upbeat-Ambient.txt`
- **Metadata:** `YouTube-Metadata-Upbeat-Ambient.json`
- **Description and tags:** `YouTube-Description.txt` and `YouTube-Tags.txt`
- **English captions:** `TabShow-English.srt`; the matching `.vtt` is also included.
- **Transcript:** `TabShow-Transcript-Upbeat-Ambient.txt`, with the new public title.
- **Thumbnail:** `TabShow-YouTube-Thumbnail-1280x720.jpg`
- **Poster:** `TabShow-YouTube-Poster-1920x1080.png`
- **Publication record:** `publication-upbeat-ambient.json`

Use the existing description's three chapters at 00:00, 00:20 and 00:34. The music remains instrumental with no spoken narration, so the existing timed on-screen text and music caption remain accurate. Preserve the original matching TabShow branding on the thumbnail.

The metadata includes reusable upload settings from the original production package. Publication results come only from this edition's separate publication record. Check the new upload's processing, playback, captions, chapters, thumbnail and embedding before recording them as verified. The original video's checks do not establish the new upload's status.

## Reproduce the soundtrack and film

Run from the campaign directory with Python, NumPy and FFmpeg installed:

```sh
python3 audio/upbeat-ambient-v3/render_upbeat_score.py
python3 finish-upbeat-ambient.py
```

The finisher copies the original picture stream without re-encoding and checks its hash, duration, frame count, loudness, decode integrity and black frames. Results are in `qa/upbeat-ambient/`.

## Build this edition's upload package

After the final upbeat ambient MP4 and its separate publication record exist, run from the campaign directory:

```sh
python3 package-upbeat-ambient.py
```

This creates separate title, metadata and transcript files in `output/`, then assembles `TabShow-YouTube-Upload-Package-Upbeat-Ambient.zip`. It checks the ZIP's integrity and reports the final video's SHA-256. Re-run after updating the new publication record so the archive contains the current verified result. The original production and upload files are not overwritten.

The score source and audio verification are in `audio/upbeat-ambient-v3/`. The broader product claims, caption conventions and publishing rationale remain documented in `youtube-draft.md`; its opening publication details describe the original edition.
