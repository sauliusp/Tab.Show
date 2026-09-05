# TabShow original soundtrack

**Final master:** `tabshow-soundtrack-48s.wav`

“Room to Focus” is an original instrumental composition and sound design created for this TabShow film. All sounds are synthesized by the included source. No external recordings, third-party samples, or music-service tracks are used.

- 48.000 seconds; 48,000 Hz; stereo; 24-bit PCM WAV.
- 100 BPM, 4/4, 20 bars, D major.
- Verified integrated loudness: **−17.0 LUFS**.
- Verified maximum true peak: **−3.0 dBFS**, with headroom for AAC encoding.
- Verified loudness range: **2.4 LU**.
- No clipped samples; final sample resolves to silence.

The arrangement uses warm electric-piano plucks, a restrained analog pad, rounded bass, soft brushed backbeats, and light shakers. It starts with a sparse two-bar phrase, introduces the groove at 4.8 seconds, supports the scene boundaries in 4.8-second increments, and resolves to a held D6/9 chord at 43.2 seconds. The final fade runs from 46.3 to 48.0 seconds.

Quiet UI accents are placed at 8.3, 12.3, and 16.3 seconds; a brief typing texture at 21.98–22.66 seconds; and soft confirmation notes at 29.0 and 41.0 seconds. They are part of the master.

## Files

- `tabshow-soundtrack-48s.wav` — use this lossless master for the final video.
- `tabshow-soundtrack-preview.mp3` — convenient listening copy only.
- `compose_soundtrack.py` — deterministic composition and synthesis, NumPy only.
- `render_audio.py` — builds, masters, encodes preview, and verifies using FFmpeg.
- `composition.json` — arrangement and timing information.
- `verification.json` — machine-readable file inspection.
- `loudness-verification.txt` — measured EBU R128 loudness and true-peak report.

## Reproduce

With Python, NumPy, and FFmpeg available:

```sh
python3 render_audio.py
```

The script performs measured two-pass linear loudness normalization, writes the lossless master and MP3 preview, verifies both duration/format and loudness, and removes the temporary raw mix. No audio API credentials are required.
