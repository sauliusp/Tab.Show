"""Mux the upbeat ambient edition and verify that its picture is unchanged."""
from pathlib import Path
import hashlib
import json
import re
import subprocess

ROOT = Path(__file__).resolve().parent
ORIGINAL = ROOT / "output/TabShow-Chrome-Web-Store-1080p60.mp4"
AUDIO = ROOT / "audio/upbeat-ambient-v3/tabshow-upbeat-ambient-v3-48s.wav"
VIDEO = ROOT / "output/TabShow-Chrome-Web-Store-1080p60-Upbeat-Ambient.mp4"
QA = ROOT / "qa/upbeat-ambient"
QA.mkdir(parents=True, exist_ok=True)


def run(*args):
    return subprocess.run(args, check=True, capture_output=True, text=True)


def picture_hash(path):
    return run("ffmpeg", "-v", "error", "-i", str(path), "-map", "0:v:0",
               "-c", "copy", "-f", "hash", "-hash", "sha256", "-").stdout.strip().split("=")[1]


assert ORIGINAL.is_file() and AUDIO.is_file(), "Render the soundtrack before muxing."
run("ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", str(ORIGINAL),
    "-i", str(AUDIO), "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy",
    "-c:a", "aac", "-b:a", "384k", "-ar", "48000", "-ac", "2", "-t", "48",
    "-movflags", "+faststart", "-metadata",
    "title=TabShow for Chrome — Live Tab Preview in 48 Seconds", "-metadata",
    "comment=TabShow product animation with an original upbeat ambient soundtrack.", str(VIDEO))
media = json.loads(run("ffprobe", "-v", "error", "-show_format", "-show_streams",
                      "-of", "json", str(VIDEO)).stdout)
(QA / "final-media.json").write_text(json.dumps(media, indent=2) + "\n")
decoded = run("ffmpeg", "-hide_banner", "-nostats", "-i", str(VIDEO),
              "-vf", "blackdetect=d=0.05:pix_th=0.02:pic_th=0.98",
              "-af", "ebur128=peak=true", "-f", "null", "-")
(QA / "final-decode-and-loudness.txt").write_text("\n".join(line.rstrip() for line in decoded.stderr.splitlines()) + "\n")
video = next(s for s in media["streams"] if s["codec_type"] == "video")
audio = next(s for s in media["streams"] if s["codec_type"] == "audio")
old_picture, new_picture = picture_hash(ORIGINAL), picture_hash(VIDEO)
summary = decoded.stderr.rsplit("Summary:", 1)[1]
integrated = float(re.search(r"I:\s+(-?[\d.]+) LUFS", summary)[1])
peak = float(re.search(r"Peak:\s+(-?[\d.]+) dBFS", summary)[1])
errors = re.findall(r"(?im)^.*(?:error while decoding|invalid data|corrupt decoded frame).*$", decoded.stderr)
black_segments = len(re.findall(r"black_start:", decoded.stderr))
assert old_picture == new_picture, "The picture stream must remain byte-identical."
assert float(media["format"]["duration"]) == 48
assert (video["width"], video["height"], video["r_frame_rate"], int(video["nb_frames"])) == (1920, 1080, "60/1", 2880)
assert audio["codec_name"] == "aac" and audio["channels"] == 2 and audio["sample_rate"] == "48000"
assert abs(integrated - (-19)) <= .3 and peak <= -3
assert not errors and not black_segments
verification = {
    "revision": "upbeat-ambient", "video": str(VIDEO.relative_to(ROOT)),
    "sha256": hashlib.sha256(VIDEO.read_bytes()).hexdigest(),
    "original_video_sha256": hashlib.sha256(ORIGINAL.read_bytes()).hexdigest(),
    "picture_stream_sha256": new_picture, "picture_identical_to_original": True,
    "duration_seconds": 48, "resolution": [1920, 1080], "fps": 60, "frames": 2880,
    "audio_codec": "aac", "audio_sample_rate": 48000, "audio_channels": 2,
    "integrated_loudness_lufs": integrated, "true_peak_dbfs": peak,
    "decode_errors": errors, "detected_black_segments": black_segments,
    "publication_record": "publication-upbeat-ambient.json",
    "source_asset_policy": "Separate edition; original master and publication preserved."
}
(QA / "verification-summary.json").write_text(json.dumps(verification, indent=2) + "\n")
print(json.dumps(verification, indent=2))
