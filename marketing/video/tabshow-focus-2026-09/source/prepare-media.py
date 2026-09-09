"""Place complete natural scene reads on a 30-second timeline; make captions and a quiet music mix."""
from pathlib import Path
import json, wave, subprocess, re, os, shutil
import numpy as np

R = Path(__file__).resolve().parents[1]
ffmpeg = os.environ.get('FFMPEG_PATH', 'ffmpeg')
if not shutil.which(ffmpeg):
    raise SystemExit('FFmpeg is unavailable. Install it on PATH or set FFMPEG_PATH to its executable.')
data = json.loads((R / 'source/film-narration.json').read_text())
# Hold the opening product frame for 1.2 seconds before the first voice line.
cursor = 1.2
gaps = [.65, .6, .55, .55, .75, .65, 0]
for scene, gap in zip(data['scenes'], gaps):
    scene['raw_start'], scene['raw_end'] = scene['start'], scene['end']
    scene['start'] = round(cursor, 3)
    scene['end'] = round(cursor + scene['duration'], 3)
    cursor = scene['end'] + gap
duration = max(30, round((cursor + 3) * 60) / 60)
data.update(duration=duration, fps=60, opening_hold=1.2, end_hold=duration-cursor,
    processing='Complete generated scene reads with an opening pause, pauses between scenes and a closing hold. No time stretching, pitch changes or internal speech edits.')
(R / 'source/timeline.json').write_text(json.dumps(data, indent=2) + '\n')
(R / 'source/narration.json').write_text(json.dumps([{'text': data['text']}], indent=2) + '\n')
sr = 24000
out = np.zeros(round(duration * sr))
for scene in data['scenes']:
    with wave.open(str(R / f"audio/scene-{scene['scene']}.wav")) as w:
        assert w.getframerate() == sr
        samples = np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(float) / 32767
    start = round(scene['start'] * sr)
    out[start:start+len(samples)] = samples
with wave.open(str(R / 'audio/voiceover.wav'), 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
    w.writeframes((np.clip(out, -1, 1) * 32767).astype('<i2').tobytes())

# Use independent word timestamps to locate the three search sentences.
asr = json.loads((R / 'source/scenes-transcript-check.json').read_text())
words = [w for s in asr['segments'] for w in s.get('words', [])]
search = data['scenes'][4]
def at_word(needle):
    matches = [w for w in words if re.sub(r'\W', '', w['word']).lower() == needle
        and search['raw_start']-.2 <= w['start'] < search['raw_end']]
    if not matches: raise ValueError(f'Missing aligned word: {needle}')
    return search['start'] + matches[0]['start'] - search['raw_start']
cuts = [search['start'], at_word('use'), at_word('find'), search['end']]
captions = []
for scene in data['scenes']:
    if scene['scene'] == 4:
        parts = ['Search by title or website.', 'Use the arrow keys.', 'Find tabs across windows in the same Chrome profile.']
        captions.extend({'start': cuts[i], 'end': cuts[i+1], 'text': text} for i, text in enumerate(parts))
    else:
        captions.append({k: scene[k] for k in ['start', 'end', 'text']})
(R / 'source/captions.json').write_text(json.dumps(captions, indent=2)+'\n')
def stamp(t, sep=','):
    ms=round(t*1000); h,ms=divmod(ms,3600000); m,ms=divmod(ms,60000); sec,ms=divmod(ms,1000)
    return f'{h:02}:{m:02}:{sec:02}{sep}{ms:03}'
for ext in ['srt','vtt']:
    sep=',' if ext=='srt' else '.'
    content='' if ext=='srt' else 'WEBVTT\n\n'
    content+='\n\n'.join(f"{i+1}\n{stamp(c['start'],sep)} --> {stamp(c['end'],sep)}\n{c['text']}" for i,c in enumerate(captions))+'\n'
    (R / f'output/TabShow-English.{ext}').write_text(content)
(R / 'output/TabShow-Transcript.txt').write_text(data['text']+'\n')
music=R.parent/'tabshow-install-2026-09/audio/upbeat-ambient-v3/tabshow-upbeat-ambient-v3-48s.wav'
# Voice stays natural; original sample-free score sits well below narration.
subprocess.run([ffmpeg,'-y','-v','error','-i',str(R/'audio/voiceover.wav'),'-i',str(music),
    '-filter_complex',f'[0:a]aresample=48000,volume=1.5[v];[1:a]atrim=0:{duration},volume=0.10,afade=t=in:d=0.5,afade=t=out:st={duration-3}:d=3[m];[v][m]amix=inputs=2:duration=longest:normalize=0,volume=1.413,alimiter=limit=0.891:level=0:latency=1[a]',
    '-map','[a]','-t',str(duration),'-ar','48000','-ac','2',str(R/'audio/final-mix.wav')],check=True)
print(json.dumps({'duration':duration,'voice_duration':data['scenes'][-1]['raw_end'],'closing_hold':data['end_hold']}))
