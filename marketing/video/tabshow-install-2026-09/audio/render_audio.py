"""Rebuild the complete soundtrack using NumPy and the FFmpeg CLI."""
import json
from pathlib import Path
import re
import subprocess
import sys

HERE = Path(__file__).resolve().parent
RAW = HERE / 'tabshow_music_mix_f32le.raw'
WAV = HERE / 'tabshow-soundtrack-48s.wav'
PREVIEW = HERE / 'tabshow-soundtrack-preview.mp3'


def run(args):
    return subprocess.run(args, check=True, capture_output=True, text=True)


run([sys.executable, str(HERE / 'compose_soundtrack.py')])
source = ['ffmpeg', '-hide_banner', '-y', '-f', 'f32le', '-ar', '48000',
          '-ac', '2', '-i', str(RAW)]
measure = run(source + ['-af', 'loudnorm=I=-17:TP=-1.5:LRA=8:print_format=json',
                        '-f', 'null', '-'])
measured = json.loads(re.findall(r'\{[^{}]*\}', measure.stderr)[-1])
normalizer = (
    'loudnorm=I=-17:TP=-1.5:LRA=8:linear=true:offset=0:print_format=json'
    f":measured_I={measured['input_i']}:measured_TP={measured['input_tp']}"
    f":measured_LRA={measured['input_lra']}:measured_thresh={measured['input_thresh']}"
)
run(source + ['-af', normalizer, '-ar', '48000', '-c:a', 'pcm_s24le',
              '-metadata', 'title=Room to Focus — TabShow',
              '-metadata', 'artist=TabShow',
              '-metadata', 'comment=Original sample-free instrumental and UI sound design for TabShow, 100 BPM, 20 bars.',
              str(WAV)])
run(['ffmpeg', '-hide_banner', '-y', '-i', str(WAV), '-c:a', 'libmp3lame',
     '-b:a', '192k', str(PREVIEW)])
verified = run(['ffprobe', '-v', 'error', '-show_entries',
                'format=duration,size:stream=codec_name,sample_rate,channels,bits_per_raw_sample',
                '-of', 'json', str(WAV)])
loudness = run(['ffmpeg', '-hide_banner', '-i', str(WAV), '-af',
                'ebur128=peak=true:framelog=verbose', '-f', 'null', '-'])
(HERE / 'verification.json').write_text(verified.stdout)
(HERE / 'loudness-verification.txt').write_text(loudness.stderr)
RAW.unlink()
print(verified.stdout)
print(loudness.stderr[loudness.stderr.index('Summary:'):])
