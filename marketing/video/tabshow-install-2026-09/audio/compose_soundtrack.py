"""Original TabShow music and sound design; deterministic, sample-free synthesis.

100 BPM, 4/4, 20 bars, exactly 48 seconds. Python + NumPy only.
Composition/sound design created for this film. No third-party recordings.
Run this script, then master the emitted float32 stereo stream with FFmpeg.
"""
from pathlib import Path
import json
import numpy as np

OUT = Path(__file__).resolve().parent
SR = 48000
DURATION = 48.0
BEAT = .6
BAR = 2.4
N = int(SR * DURATION)
rng = np.random.default_rng(9052026)
music = np.zeros((N, 2), np.float64)
room = np.zeros_like(music)
drums = np.zeros_like(music)
ui = np.zeros_like(music)


def hz(midi):
    return 440 * 2 ** ((midi - 69) / 12)


def envelope(t, hold, attack=.007, release=.18):
    return np.minimum(t / attack, 1) * np.minimum(np.maximum(hold + release - t, 0) / release, 1)


def put(bus, mono, when, volume=1., pan=0):
    start = round(when * SR)
    if start < 0:
        mono = mono[-start:]
        start = 0
    length = min(len(mono), N - start)
    if length <= 0:
        return
    angle = (pan + 1) * np.pi / 4
    bus[start:start+length, 0] += volume * np.cos(angle) * mono[:length]
    bus[start:start+length, 1] += volume * np.sin(angle) * mono[:length]


def filter_noise(noise, low, high):
    # Smooth, fourth-order spectral shaping avoids a hard-edged digital hiss.
    f = np.fft.rfftfreq(len(noise), 1/SR)
    response = 1 / np.sqrt(1 + (np.maximum(f, 1) / high) ** 8)
    if low:
        response *= 1 / np.sqrt(1 + (low / np.maximum(f, 1)) ** 8)
    result = np.fft.irfft(np.fft.rfft(noise) * response, n=len(noise))
    return result / max(np.std(result), 1e-8)


def key(note, when, length=.85, velocity=.8, pan=0):
    t = np.arange(round((length + .7) * SR)) / SR
    f = hz(note)
    p = 2 * np.pi * f * t
    # Mellow electromechanical piano: dynamic tine, rounded fundamental,
    # gently detuned partials, and a damped hammer rather than a bright ping.
    tone = np.sin(p + .34 * velocity * np.exp(-t/1.1) * np.sin(2*p))
    tone += .105 * np.sin(2*p + .10) * np.exp(-t/.7)
    tone += .055 * np.sin(3.003*p + .4) * np.exp(-t/.42)
    tone += .023 * np.sin(7.01*p) * np.exp(-t/.13)
    tone += .055 * np.sin(p * 1.0009 + .6)
    tone *= (.7 * np.exp(-t/1.1) + .3*np.exp(-t/.26))
    tone *= envelope(t, length, .005, .7) * velocity
    tone = np.tanh(tone * 1.08) / 1.08
    put(music, tone, when, .145, pan)
    put(room, tone, when, .145, pan)


def pad(notes, when, length, volume=.08):
    t = np.arange(round((length + 1.8) * SR)) / SR
    attack = np.minimum(t/.55, 1)
    release = np.clip((length+1.8-t)/1.8, 0, 1)
    env = np.sin(attack*np.pi/2)**2 * np.sin(release*np.pi/2)**2
    for j, note in enumerate(notes):
        f = hz(note)
        sig = np.zeros_like(t)
        for detune, weight in [(-.0024,.37), (.0017,.36), (0,.27)]:
            phase = 2*np.pi*f*(1+detune)*t + j*.37
            # Very restrained harmonics make the bed warm, not a saw lead.
            for k in range(1, 6):
                sig += weight * np.sin(phase*k) / k**2.25
        sig *= env * (.96+.04*np.sin(2*np.pi*.17*t+j))
        put(music, sig, when, volume / len(notes), (j-(len(notes)-1)/2)*.38)
        put(room, sig, when, volume*.34 / len(notes), (j-(len(notes)-1)/2)*.38)


def bass(note, when, length=.38, velocity=1):
    t = np.arange(round((length+.12)*SR)) / SR
    p = 2*np.pi*hz(note)*t
    sig = np.sin(p) + .16*np.sin(2*p)*np.exp(-t/.2) + .045*np.sin(3*p)
    sig *= envelope(t, length, .013, .12)*np.exp(-t/.9)
    put(music, sig, when, .22*velocity, 0)


def kick(when, velocity=1):
    t = np.arange(round(.34*SR)) / SR
    phase = 2*np.pi*(46*t + 34*.024*(1-np.exp(-t/.024)))
    sig = np.sin(phase)*np.exp(-t/.09)*np.minimum(t/.003, 1)
    sig += .075 * filter_noise(rng.normal(size=len(t)), 500, 2000) * np.exp(-t/.008)
    put(drums, sig, when, .28*velocity)


def rim(when, velocity=1):
    t = np.arange(round(.16*SR)) / SR
    noise = filter_noise(rng.normal(size=len(t)), 700, 5800)
    # A brushed, compact backbeat; no dramatic advertising claps.
    sig = .55*noise*np.exp(-t/.025) + .35*np.sin(2*np.pi*185*t)*np.exp(-t/.017)
    sig *= np.minimum(t/.0012,1)
    put(drums, sig, when, .075*velocity, .09)
    put(room, sig, when, .017*velocity, .2)


def shaker(when, velocity=1, pan=.25):
    t = np.arange(round(.075*SR)) / SR
    noise = filter_noise(rng.normal(size=len(t)), 4800, 11000)
    sig = noise*np.exp(-t/.013)*np.minimum(t/.0015,1)
    put(drums, sig, when, .021*velocity, pan)


# Root, mid-register bed, and an open right-hand voicing, all in D major.
# Each change has voice-leading; repeated phrases vary in articulation.
chords = [
 (38,[50,57,61,64],[66,69,73,76]),  # Dmaj9
 (38,[50,57,61,64],[66,69,73,76]),
 (35,[47,54,57,61],[62,66,69,73]),  # Bm9
 (31,[43,50,54,57],[62,66,69,71]),  # Gmaj9
 (38,[50,57,61,64],[66,69,73,76]),
 (33,[45,52,57,59],[64,69,71,73]),  # Aadd9
 (35,[47,54,57,61],[62,66,69,73]),
 (31,[43,50,54,57],[62,66,69,71]),
 (30,[42,50,57,61],[62,66,69,73]),  # D/F#
 (33,[45,52,57,59],[64,69,71,73]),
 (28,[40,47,54,57],[62,66,67,71]),  # Em9
 (31,[43,50,54,57],[62,66,69,71]),
 (38,[50,57,61,64],[66,69,73,76]),
 (33,[45,52,57,59],[64,69,71,73]),
 (35,[47,54,57,61],[62,66,69,73]),
 (31,[43,50,54,57],[62,66,69,71]),
 (30,[42,50,57,61],[62,66,69,73]),
 (33,[45,52,57,59],[64,69,71,73]),
 (38,[50,57,59,64],[62,66,69,76]),  # D6/9 logo resolve
 (38,[50,57,59,64],[62,66,69,76]),
]

patterns = [
 [(0,0,.75),(.75,2,.55),(1.5,1,.63),(2.5,3,.62),(3.25,2,.48)],
 [(0,1,.68),(.5,2,.5),(1.75,0,.54),(2.5,2,.7),(3.5,1,.46)],
 [(0,0,.74),(1,1,.57),(1.75,2,.52),(2.5,3,.64),(3.5,2,.48)],
 [(0,1,.7),(.75,3,.55),(1.5,2,.61),(2.75,1,.54)],
]

for bar, (root, bed, upper) in enumerate(chords):
    start = bar*BAR
    pad(bed, start, BAR, .10 if bar >= 2 else .075)
    if bar == 19:
        # Let the logo chord decay naturally under the final hold.
        continue
    pattern = patterns[bar % 4]
    if bar == 0:
        pattern = [(0,0,.75), (1.5,2,.52), (2.5,1,.62)]
    elif bar == 1:
        pattern = [(0,2,.6), (1.5,1,.5), (3,0,.57)]
    elif bar == 18:
        pattern = [(0,0,.72),(.06,1,.64),(.12,2,.57),(.18,3,.4)]
    for beat, idx, velocity in pattern:
        key(upper[idx], start+beat*BEAT, 1.65 if bar == 18 else .88,
            velocity, [-.28,.17,-.10,.3][idx])
    # Sparse low chord punctuation ties the higher plucks to the bass.
    if bar in (0,2,4,6,8,10,12,14,16,18):
        for j,note in enumerate(bed[1:]):
            key(note, start+.013*j, 1.5, .32, (j-1)*.18)
    if bar < 2:
        bass(root, start+.02, .95, .6)
    elif bar == 18:
        bass(root, start, 1.7, .75)
        kick(start, .55)
    else:
        bass(root, start, .45, .88)
        bass(root, start+1.5*BEAT, .24, .58)
        bass(root, start+2.5*BEAT, .48, .72)
        if bar % 4 == 3:
            bass(root+12, start+3.5*BEAT, .20, .35)
        kick(start, .84)
        kick(start+2*BEAT, .68)
        if bar % 4 == 3:
            kick(start+3.5*BEAT, .36)
        rim(start+BEAT+.008, .7)
        rim(start+3*BEAT+.01, .8)
        for eighth in range(8):
            when = start+eighth*.5*BEAT + (.007 if eighth%2 else 0)
            shaker(when, (.53 if eighth%2 == 0 else .86)*(1 if bar>=4 else .65),
                .38 if eighth%2 else -.30)

# A short, memorable upper melody appears only at the two emotional lifts.
for offset, melody in [
    (9.6, [(0,78,.56),(1.5,76,.44),(3,73,.48),(5.5,71,.48),(7,73,.4)]),
    (28.8, [(0,78,.52),(1.5,76,.46),(3,73,.47),(5.5,76,.45),(7,73,.43)]),
    (38.4, [(0,73,.43),(1.5,76,.42),(3,78,.42),(5.5,76,.40),(7,73,.39)]),
]:
    for beat,note,velocity in melody:
        key(note, offset+beat*BEAT, 1.3, velocity, .08)


def soft_tick(when, strength=.7, pitch=1150, pan=.12):
    t = np.arange(round(.105*SR))/SR
    sig = filter_noise(rng.normal(size=len(t)), 1400, 4900)*np.exp(-t/.008)*.2
    sig += np.sin(2*np.pi*pitch*t)*np.exp(-t/.014)*.18
    sig *= np.minimum(t/.001,1)
    put(ui, sig, when, .10*strength, pan)


def gentle_confirmation(when, notes=(81,85), volume=.5):
    # Tiny wooden-glass acknowledgement. Quiet enough to stay beneath music.
    for j,note in enumerate(notes):
        t = np.arange(round(.34*SR))/SR
        p = 2*np.pi*hz(note)*t
        sig = (np.sin(p)+.16*np.sin(2.02*p))*np.exp(-t/.085)
        sig *= np.minimum(t/.003,1)
        put(ui, sig, when+j*.07, .027*volume, -.1+j*.2)
        put(room, sig, when+j*.07, .012*volume, -.1+j*.2)


def transition(when, strength=.5):
    length=.48
    t=np.arange(round(length*SR))/SR
    n=filter_noise(rng.normal(size=len(t)),600,3800)
    env=np.sin(np.pi*t/length)**2
    # Breath-like swish, with no exaggerated cinematic riser.
    put(ui,n*env,when-.38,.014*strength,-.2)


for boundary in np.arange(4.8,43.21,4.8):
    transition(float(boundary), .65 if boundary in (4.8,24,38.4) else .38)
soft_tick(8.3,.6)
gentle_confirmation(12.3,(78,81),.45)
soft_tick(16.3,.75,980)
for i,when in enumerate([21.98,22.10,22.21,22.35,22.48,22.66]):
    soft_tick(when,.27+(i%3)*.045,850+i*63,(-1)**i*.12)
gentle_confirmation(29.0,(78,81),.5)
gentle_confirmation(41.0,(81,86),.6)

# A warm, short stereo chamber made from independent taps. No feedback
# accumulation, no external impulse response, and intentionally dry bass.
f=np.fft.rfftfreq(N,1/SR)
response=(1/np.sqrt(1+(180/np.maximum(f,1))**6)) / np.sqrt(1+(f/4700)**8)
filtered=np.column_stack([np.fft.irfft(np.fft.rfft(room[:,ch])*response,n=N) for ch in range(2)])
wet=np.zeros_like(room)
for delay,amount,swap in [(.043,.16,False),(.067,.13,True),(.109,.12,False),(.151,.09,True),(.211,.075,False),(.293,.06,True),(.389,.045,False),(.503,.028,True),(.647,.017,False)]:
    d=round(delay*SR)
    wet[d:] += filtered[:-d,::-1] * amount if swap else filtered[:-d]*amount

# Gentle drum-triggered space in the sustained bed, only ~0.6 dB.
duck=np.ones(N)
for bar in range(2,18):
    for beat in (0,2):
        s=round((bar*BAR+beat*BEAT)*SR)
        l=round(.25*SR)
        duck[s:s+l] -= .065*np.exp(-np.arange(l)/SR/.075)

mix=music*duck[:,None]+drums+ui+wet
# Remove any residual DC; smooth final release completes before file end.
mix-=mix.mean(axis=0)
fade_in=np.clip(np.arange(N)/(SR*.015),0,1)
fade_out=np.ones(N)
fade_start=46.3
fidx=round(fade_start*SR)
fade_out[fidx:]=np.cos(np.linspace(0,np.pi/2,N-fidx))**2
mix*=fade_in[:,None]*fade_out[:,None]
# Reserve mastering headroom. FFmpeg performs measured two-pass loudness.
mix*=.73/max(np.abs(mix).max(),1e-9)
mix.astype('<f4').tofile(OUT/'tabshow_music_mix_f32le.raw')
(OUT/'composition.json').write_text(json.dumps({
    'title':'Room to Focus','artist':'TabShow','original_composition':True,
    'sample_rate':SR,'channels':2,'duration_seconds':DURATION,'tempo_bpm':100,
    'meter':'4/4','bars':20,'key':'D major','seed':9052026,
    'music':'Original instrumental, sample-free procedural composition and synthesis.',
    'ui_accents_seconds':[8.3,12.3,16.3,21.98,22.1,22.21,22.35,22.48,22.66,29.0,41.0],
    'transition_seconds':[round(float(x),1) for x in np.arange(4.8,43.21,4.8)],
    'fade_out_seconds':[46.3,48.0],
},indent=2)+'\n')
print(json.dumps({'duration':len(mix)/SR,'peak_raw':float(np.max(np.abs(mix))),
                  'rms_raw':float(np.sqrt(np.mean(mix**2))),
                  'file':str(OUT/'tabshow_music_mix_f32le.raw')}))
