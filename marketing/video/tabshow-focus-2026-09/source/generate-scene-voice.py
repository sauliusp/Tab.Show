from pathlib import Path
import json,hashlib,wave,time
import numpy as np
import mlx.core as mx
from mlx_audio.tts.utils import load_model
R=Path(__file__).resolve().parents[1];REF=Path.home()/'.cache/historyout-media-source/chatterbox-reference.wav'
lines=['Preview the full page without losing your focus.', 'With TabShow, hover a tab to see it live.', 'Move away. Your original page comes back.', 'Found the right page? Click to stay.', 'Search by title or website. Use the arrow keys. Find tabs across windows in the same Chrome profile.', "It's free. No account. No tracking.", 'Find the right tab. Keep your flow.']
model=load_model('mlx-community/chatterbox-multilingual-v3');parts=[];meta=[];offset=0
for i,text in enumerate(lines):
 p=R/f'audio/scene-{i}.wav'
 if p.exists():
  with wave.open(str(p)) as w:sr=w.getframerate();arr=np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').astype(float)/32767
 else:
  mx.random.seed(73+i)
  result=list(model.generate(text=text,ref_audio=str(REF),lang_code='en',exaggeration=.35,cfg_weight=.5,temperature=.8,repetition_penalty=1.2,min_p=.05,top_p=1.,max_new_tokens=2200,verbose=False));sr=result[0].sample_rate;arr=np.concatenate([np.asarray(x.audio).reshape(-1) for x in result]);np.save(p.with_suffix('.npy'),arr)
  with wave.open(str(p),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(sr);w.writeframes((np.clip(arr,-1,1)*32767).astype('<i2').tobytes())
 duration=len(arr)/sr;parts.append(arr);meta.append({'scene':i,'text':text,'start':offset,'end':offset+duration,'duration':duration});offset+=duration;print(meta[-1],flush=True)
arr=np.concatenate(parts)
with wave.open(str(R/'audio/film-voice.wav'),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(sr);w.writeframes((np.clip(arr,-1,1)*32767).astype('<i2').tobytes())
(R/'source/film-narration.json').write_text(json.dumps({'text':' '.join(lines),'scenes':meta,'duration':offset,'reference_sha256':hashlib.sha256(REF.read_bytes()).hexdigest(),'model':'mlx-community/chatterbox-multilingual-v3','exaggeration':.35,'cfg_weight':.5,'processing':'Seven new natural scene performances joined in order. No tempo, pitch, waveform trimming or inserted pauses.'},indent=2))
