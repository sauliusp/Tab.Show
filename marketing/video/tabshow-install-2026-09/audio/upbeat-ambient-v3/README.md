# TabShow upbeat ambient soundtrack

**Production master: `tabshow-upbeat-ambient-v3-48s.wav`.**

“A Brighter Flow” is an original 48-second score that combines a light, welcoming 120 BPM groove with warm ambient harmony. It uses soft syncopated chords, a rounded kick, a quiet brushed backbeat, smooth bass and eleven spaced melodic notes. Six slow major/add9 chord changes give the track a positive arc. The rhythm settles at 44 seconds and the final chord fades from 46 to 48 seconds.

This revision follows the requested **upbeat** direction while avoiding the original score's busy shaker pattern, frequent upper-register plucks, typing cues and notification sounds. Its air and gentle rhythmic detail are retained deliberately; it is not a pure drone or percussion-free ambient track.

## Verified delivery

| Property | Result |
| --- | --- |
| Duration | Exactly 48.000 seconds |
| Lossless format | Stereo, 48 kHz, 24-bit PCM WAV |
| Integrated loudness | −19.0 LUFS (`loudnorm`); −18.9 LUFS (`ebur128`) |
| Maximum true peak | −5.95 dBFS; below the −3 dBFS ceiling |
| Loudness range | 2.0 LU |
| Clipped samples | 0 |
| Final sample | Digital silence in both channels |
| Tempo / length | 120 BPM, 4/4, 24 bars |
| Key | F major |

The music is 2 LU quieter than the original. Normalized positive spectral flux is about 58% lower, and the high-frequency content is gentler while still present. These are objective texture measurements, not measures of musical taste or predicted conversion performance. Full results and methodology are in `audio-comparison.json`.

## Included files

- `tabshow-upbeat-ambient-v3-48s.wav` — use this for the video.
- `tabshow-upbeat-ambient-v3-preview.mp3` — 192 kbps listening copy.
- `render_upbeat_score.py` — reproducible synthesis, mastering and verification.
- `composition.json` — chord voicings, 34 rhythmic chord gestures, melody events and timings.
- `verification.json`, `loudness-verification.txt`, `audio-comparison.json` — technical checks.

## Rebuild

With Python, NumPy and FFmpeg installed:

```sh
python3 render_upbeat_score.py
```

All instruments and the room response are synthesized locally with a fixed seed. No downloaded recordings, samples or music-service tracks are used. The script writes only in this folder and reads the preserved original soundtrack for comparison. Use `--skip-comparison` if this folder is copied elsewhere. The finished video can replace its audio while copying the picture stream without re-encoding.
