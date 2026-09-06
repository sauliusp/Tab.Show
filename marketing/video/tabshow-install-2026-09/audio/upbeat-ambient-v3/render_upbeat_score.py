"""Render 'A Brighter Flow', an original 48-second TabShow upbeat ambient score.

Deterministic sample-free synthesis. Requires Python, NumPy, and FFmpeg.
All generated files stay beside this script. The first soundtrack is read only
for an objective comparison and is never changed. Run with --skip-comparison
to build this folder independently.
"""
from pathlib import Path
import argparse
import json
import re
import subprocess
import numpy as np

HERE = Path(__file__).resolve().parent
SR = 48000
DURATION = 48.0
N = int(SR * DURATION)
SEED = 60920263
WAV = HERE / "tabshow-upbeat-ambient-v3-48s.wav"
MP3 = HERE / "tabshow-upbeat-ambient-v3-preview.mp3"
RAW = HERE / "upbeat_mix_f32le.raw"
OLD = HERE.parent / "tabshow-soundtrack-48s.wav"


def run(args, binary=False):
    return subprocess.run(args, check=True, capture_output=True, text=not binary)


def hz(note):
    return 440.0 * 2 ** ((note - 69) / 12)


def smoothstep(x):
    x = np.clip(x, 0, 1)
    return x * x * (3 - 2 * x)


def spectral_filter(x, highpass=65, lowpass=2800):
    n = len(x)
    f = np.fft.rfftfreq(n, 1 / SR)
    response = 1 / np.sqrt(1 + (f / lowpass) ** 8)
    if highpass:
        response *= 1 / np.sqrt(1 + (highpass / np.maximum(f, .01)) ** 6)
    if x.ndim == 1:
        return np.fft.irfft(np.fft.rfft(x) * response, n=n)
    return np.column_stack([
        np.fft.irfft(np.fft.rfft(x[:, ch]) * response, n=n)
        for ch in range(x.shape[1])
    ])


def put(bus, x, when, level, pan):
    start = round(when * SR)
    if start < 0:
        x = x[-start:]
        start = 0
    length = min(len(x), N - start)
    if length <= 0:
        return
    angle = (pan + 1) * np.pi / 4
    bus[start:start + length, 0] += x[:length] * level * np.cos(angle)
    bus[start:start + length, 1] += x[:length] * level * np.sin(angle)


# Slow, consonant changes give the light 120 BPM groove room to breathe.
CHORDS = [
    (0.0, "Fmaj9", [53, 57, 60, 64, 67]),
    (8.0, "Cadd9/E", [52, 55, 60, 62, 67]),
    (16.0, "Bbmaj9", [46, 53, 57, 62, 65]),
    (24.0, "Fadd9/A", [45, 53, 60, 65, 67]),
    (32.0, "Cadd9", [48, 55, 60, 62, 67]),
    (40.0, "F6/9", [53, 57, 60, 62, 67]),
]

# A simple optimistic melodic thread, with space between phrases.
KEYS = [
    (3.00, 69, .50, -.12),
    (7.50, 67, .34, .15),
    (12.25, 64, .37, -.07),
    (17.75, 65, .35, -.18),
    (21.50, 69, .42, .13),
    (25.50, 67, .33, -.10),
    (29.75, 65, .28, .10),
    (34.50, 67, .31, -.13),
    (39.50, 69, .34, .08),
    (42.00, 72, .32, .12),
    (44.50, 69, .26, -.04),
]


def compose():
    rng = np.random.default_rng(SEED)
    pads = np.zeros((N, 2), dtype=np.float64)
    keys = np.zeros_like(pads)
    groove = np.zeros_like(pads)
    rhythm_keys = np.zeros_like(pads)
    bass = np.zeros_like(pads)

    for section, (when, name, notes) in enumerate(CHORDS):
        # Three-second overlap, rounded attack, and no note-on impulse.
        t = np.arange(round(11.8 * SR)) / SR
        env = smoothstep(t / 2.6) * (1 - smoothstep((t - 7.8) / 4.0))
        section_level = [1.00, .96, 1.035, 1.03, .98, 1.055][section]
        for voice, note in enumerate(notes):
            tone = np.zeros_like(t)
            base = hz(note)
            for detune, weight in [(0, .54), (-2.2, .23), (2.7, .23)]:
                p0 = rng.uniform(-np.pi, np.pi)
                p = 2 * np.pi * base * 2 ** (detune / 1200) * t + p0
                # Less than one cent of gradual organic pitch movement.
                p += .022 * np.sin(2 * np.pi * (.071 + voice * .006) * t + p0)
                harmonics = (
                    np.sin(p)
                    + .19 * np.sin(2 * p + .25)
                    + .064 * np.sin(3 * p + .47)
                    + .022 * np.sin(4 * p + .16)
                )
                tone += weight * harmonics
            movement = .975 + .025 * np.sin(2 * np.pi * (.083 + .011 * voice) * t + voice)
            # Upper voices stay in the pad rather than becoming lead tones.
            weight = [.24, .205, .20, .165, .145][voice]
            put(pads, tone * env * movement, when, .56 * weight * section_level,
                [-.22, -.48, .03, .46, .24][voice])

    for when, note, velocity, pan in KEYS:
        t = np.arange(round(8.6 * SR)) / SR
        tone = np.zeros_like(t)
        base = hz(note)
        # A soft, slightly inharmonic string model. No tine, bell partial,
        # hammer click, noise burst, or upper register sparkle is present.
        for string_detune, string_weight in [(-.65, .5), (.85, .5)]:
            for harmonic, amplitude, decay in [
                (1, 1.0, 2.4), (2, .32, 1.25), (3, .11, .96),
                (4, .042, .64), (5, .012, .42),
            ]:
                frequency = base * harmonic * np.sqrt(1 + .000035 * harmonic ** 2)
                frequency *= 2 ** (string_detune / 1200)
                # Rounded 24-ms attack keeps a clear, gentle musical note.
                partial_env = smoothstep(t / .024) * np.exp(-t / decay)
                tone += string_weight * amplitude * np.sin(2 * np.pi * frequency * t) * partial_env
        tone *= 1 - smoothstep((t - 6.8) / 1.8)
        put(keys, tone, when, .19 * velocity, pan)

    # The groove is made from local synthesis too. A soft low kick and a
    # brushed snare establish motion without a busy high-hat/shaker pattern.
    def kick(when, level):
        t = np.arange(round(.28 * SR)) / SR
        phase = 2 * np.pi * (49 * t + 22 * .016 * (1 - np.exp(-t / .016)))
        sig = np.sin(phase) * np.exp(-t / .075) * smoothstep(t / .007)
        sig += .095 * np.sin(2 * phase) * np.exp(-t / .045) * smoothstep(t / .006)
        sig *= 1 - smoothstep((t - .21) / .07)
        put(groove, sig, when, .20 * level, 0)

    def brush(when, level, pan=.14):
        t = np.arange(round(.21 * SR)) / SR
        noise = spectral_filter(rng.normal(size=len(t)), 430, 4700)
        noise /= max(np.std(noise), 1e-12)
        env = smoothstep(t / .013) * np.exp(-t / .041)
        env *= 1 - smoothstep((t - .16) / .05)
        body = .28 * np.sin(2 * np.pi * 174 * t) * np.exp(-t / .026)
        body += .10 * np.sin(2 * np.pi * 237 * t) * np.exp(-t / .021)
        sig = (.43 * noise + body) * env
        put(groove, sig, when, .077 * level, pan)

    def chord(notes, when, velocity, pan):
        t = np.arange(round(2.2 * SR)) / SR
        sig = np.zeros_like(t)
        for j, note in enumerate(notes):
            p = 2 * np.pi * hz(note) * t + j * .17
            env = smoothstep(t / .032) * (.73 * np.exp(-t / .47) + .27 * np.exp(-t / 1.3))
            tone = np.sin(p) + .23 * np.sin(2 * p) * np.exp(-t / .45)
            tone += .083 * np.sin(3.001 * p + .12) * np.exp(-t / .28)
            tone += .028 * np.sin(4.004 * p) * np.exp(-t / .17)
            sig += tone * env / len(notes)
        sig *= 1 - smoothstep((t - 1.7) / .5)
        put(rhythm_keys, sig, when, .31 * velocity, pan)

    def bass_note(note, when, length, velocity):
        t = np.arange(round((length + .22) * SR)) / SR
        p = 2 * np.pi * hz(note) * t
        sig = np.sin(p) + .15 * np.sin(2 * p) + .022 * np.sin(3 * p)
        env = smoothstep(t / .022) * np.exp(-t / 1.1)
        env *= 1 - smoothstep((t - length) / .22)
        put(bass, sig * env, when, .15 * velocity, 0)

    # Pattern is a soft chord gesture, not a busy one-note arpeggio. Thirty-
    # four chord gestures and eleven melody notes over the entire film.
    patterns = [
        [(0, .74), (1.25, .47)],
        [(.50, .54)],
        [(0, .68), (1.50, .43)],
        [(.75, .58)],
    ]
    rhythm_events = []
    for bar in range(24):
        when = bar * 2.0
        section = min(bar // 4, 5)
        notes = CHORDS[section][2]
        root = notes[0] - 12 if notes[0] >= 50 else notes[0]
        intro = .63 if bar < 2 else 1.0
        # The closing two bars resolve into the logo without a drum fill.
        if bar < 22:
            kick(when, .77 * intro)
            kick(when + 1.0, .56 * intro)
            if bar >= 1:
                brush(when + .508, .69 * intro, .12)
                brush(when + 1.515, .61 * intro, -.10)
            bass_note(root, when + .015, .60, .66 * intro)
            if bar >= 2:
                bass_note(root, when + 1.25, .36, .38)
        elif bar == 22:
            kick(when, .43)
            bass_note(root, when, 1.4, .56)
        if bar == 23:
            continue
        voicing = [notes[1], notes[2], notes[4]]
        pattern = patterns[bar % len(patterns)]
        if bar == 22:
            pattern = [(0, .65)]
        for offset, velocity in pattern:
            event_time = when + offset + (.016 if offset else .012)
            chord(voicing, event_time, velocity, -.08 if bar % 2 == 0 else .10)
            rhythm_events.append(round(event_time, 3))

    # Subtle natural-feeling air on a few phrase entrances, never a shaker
    # ostinato or bright UI whoosh. It lives beneath the brushed backbeat.
    for when in [4.0, 12.0, 20.0, 28.0, 36.0, 40.0]:
        t = np.arange(round(.42 * SR)) / SR
        breath = spectral_filter(rng.normal(size=len(t)), 2100, 6500)
        breath /= max(np.std(breath), 1e-12)
        env = np.sin(np.pi * np.minimum(t / .42, 1)) ** 2
        put(groove, breath * env, when, .0028, -.30)

    # A dense stereo diffusion tail, synthesized from seeded random values.
    # This is a room response, not an external sample or a separate audible
    # noise layer. Its dark spectrum avoids hiss or shimmering high tones.
    ir_length = round(5.2 * SR)
    rt = np.arange(ir_length) / SR
    wet = np.zeros_like(pads)
    send = .70 * pads + .68 * keys + .60 * rhythm_keys
    fft_size = 1 << (N + ir_length - 1).bit_length()
    for channel in range(2):
        impulse = rng.normal(size=ir_length)
        impulse = spectral_filter(impulse, 230, 3400)
        impulse *= np.exp(-rt / .68) * smoothstep(rt / .07)
        impulse *= 1 - smoothstep((rt - 4.6) / .6)
        impulse[:round(.029 * SR)] = 0
        impulse /= max(np.sqrt(np.sum(impulse ** 2)), 1e-12)
        # Normalize the response's frequency-domain peak so a chance modal
        # resonance can never turn the reverb into a conspicuous held tone.
        peak_response = np.max(np.abs(np.fft.rfft(impulse, n=fft_size)))
        impulse /= max(peak_response / 2.7, 1.0)
        spatial_source = .8 * send[:, channel] + .2 * send[:, 1 - channel]
        wet[:, channel] = np.fft.irfft(
            np.fft.rfft(spatial_source, n=fft_size)
            * np.fft.rfft(impulse, n=fft_size), n=fft_size
        )[:N]

    mix = pads + keys + rhythm_keys + bass + groove + .25 * wet
    mix = spectral_filter(mix, 38, 7100)
    timeline = np.arange(N) / SR
    # Nearly imperceptible broad lifts beneath the middle and closing CTA.
    lift = 1 + .055 * np.exp(-.5 * ((timeline - 21.7) / 2.5) ** 2)
    lift += .065 * np.exp(-.5 * ((timeline - 41.6) / 2.0) ** 2)
    mix *= lift[:, None]
    mix -= mix.mean(axis=0)
    mix *= smoothstep(timeline / .065)[:, None]
    fade = np.ones(N)
    start = 46 * SR
    fade[start:] = np.cos(np.linspace(0, np.pi / 2, N - start)) ** 2
    mix *= fade[:, None]
    mix[-1] = 0
    mix *= .6 / np.max(np.abs(mix))
    mix.astype("<f4").tofile(RAW)
    (HERE / "composition.json").write_text(json.dumps({
        "title": "A Brighter Flow", "artist": "TabShow",
        "version": "upbeat-ambient-v3", "duration_seconds": DURATION,
        "sample_rate": SR, "channels": 2, "seed": SEED,
        "key": "F major", "tempo_bpm": 120, "meter": "4/4", "bars": 24,
        "original_composition": True, "third_party_samples": False,
        "arrangement": "Warm ambient pads, soft syncopated chords, eleven rounded melody notes, gentle kick and brushed backbeat, smooth bass, restrained stereo room",
        "chords": [{"seconds": s, "name": n, "midi_notes": notes} for s, n, notes in CHORDS],
        "soft_key_events": [{"seconds": s, "midi_note": n, "velocity": v} for s, n, v, p in KEYS],
        "rhythmic_chord_event_seconds": rhythm_events,
        "broad_lift_centers_seconds": [21.7, 41.6],
        "fade_out_seconds": [46, 48],
        "target_integrated_lufs": -19, "true_peak_ceiling_dbfs": -3,
    }, indent=2) + "\n")


def loudness(path):
    report = run(["ffmpeg", "-hide_banner", "-i", str(path), "-af",
                  "loudnorm=I=-19:TP=-3:LRA=9:print_format=json", "-f", "null", "-"])
    values = json.loads(re.findall(r"\{[^{}]*\}", report.stderr)[-1])
    return {k: float(v) if re.fullmatch(r"-?\d+(\.\d+)?", str(v)) else v for k, v in values.items()}


def read_audio(path):
    result = run(["ffmpeg", "-v", "error", "-i", str(path), "-f", "f32le",
                  "-ar", str(SR), "-ac", "2", "-"], binary=True)
    return np.frombuffer(result.stdout, dtype="<f4").reshape(-1, 2).astype(np.float64)


def analysis(path):
    sound = read_audio(path)
    mono = np.mean(sound, axis=1)
    # Stereo Welch-style averaged power avoids cancellation from stereo
    # pads and allows a relative high-frequency comparison independent of
    # the changed delivery loudness.
    size, hop = 4096, 2048
    window = np.hanning(size)
    powers = []
    fluxes = []
    previous = None
    for start in range(0, len(sound) - size + 1, hop):
        spectrum = np.fft.rfft(sound[start:start + size] * window[:, None], axis=0)
        power = np.mean(np.abs(spectrum) ** 2, axis=1)
        powers.append(power)
        magnitude = np.sqrt(power)
        if previous is not None:
            fluxes.append(float(np.maximum(magnitude - previous, 0).sum()))
        previous = magnitude
    mean_power = np.mean(powers, axis=0)
    f = np.fft.rfftfreq(size, 1 / SR)
    total_power = mean_power.sum()
    # Fixed amplitude-independent transient proxy: percentage of 20-ms
    # adjacent RMS frames with a rise > 2 dB. Exclude opening/final fades.
    rms_size = round(.020 * SR)
    frames = sound[:len(sound) // rms_size * rms_size].reshape(-1, rms_size, 2)
    rms = np.sqrt(np.mean(frames ** 2, axis=(1, 2)))
    rms_db = 20 * np.log10(np.maximum(rms, 1e-12))
    rises = np.diff(rms_db)[100:2250]  # seconds 2 to 45
    events = int(np.count_nonzero(rises > 2.0))
    # A 100-ms power window suppresses phase/beating fluctuations inside
    # low sustained chords. Fast rises in this envelope are a second,
    # better indicator of conspicuous percussive/plucked note attacks.
    smooth_rms = np.sqrt(np.convolve(rms ** 2, np.ones(5) / 5, mode="valid"))
    smooth_db = 20 * np.log10(np.maximum(smooth_rms, 1e-12))
    smooth_attacks = int(np.count_nonzero(np.diff(smooth_db)[100:2250] > 1.0))
    sample_peak = float(np.max(np.abs(sound)))
    loud = loudness(path)
    return {
        "file": str(path.relative_to(HERE.parent)),
        "duration_seconds": len(sound) / SR,
        "sample_rate": SR, "channels": 2,
        "integrated_lufs": loud["input_i"],
        "true_peak_dbfs": loud["input_tp"],
        "loudness_range_lu": loud["input_lra"],
        "sample_peak_dbfs": 20 * np.log10(sample_peak),
        "rms_dbfs": float(20 * np.log10(np.sqrt(np.mean(sound ** 2)))),
        "spectral_centroid_hz": float((f * mean_power).sum() / total_power),
        "energy_above_2000hz_percent": float(mean_power[f >= 2000].sum() / total_power * 100),
        "energy_above_4000hz_percent": float(mean_power[f >= 4000].sum() / total_power * 100),
        "adjacent_20ms_rms_rises_over_2db_seconds_2_to_45": events,
        "rms_attack_proxy_per_second": events / 43,
        "smoothed_100ms_envelope_rises_over_1db_per_20ms_seconds_2_to_45": smooth_attacks,
        "normalized_mean_positive_spectral_flux": float(np.mean(fluxes) / np.sqrt(total_power)),
        "stereo_correlation": float(np.corrcoef(sound.T)[0, 1]),
        "dc_offset": sound.mean(axis=0).tolist(),
        "clipped_samples": int(np.count_nonzero(np.abs(sound) >= 1)),
        "final_sample": sound[-1].tolist(),
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--skip-comparison", action="store_true")
    args = parser.parse_args()
    compose()
    source = ["ffmpeg", "-hide_banner", "-y", "-f", "f32le", "-ar", str(SR),
              "-ac", "2", "-i", str(RAW)]
    measured_output = run(source + ["-af", "loudnorm=I=-19:TP=-3:LRA=9:print_format=json", "-f", "null", "-"])
    measured = json.loads(re.findall(r"\{[^{}]*\}", measured_output.stderr)[-1])
    norm = (
        "loudnorm=I=-19:TP=-3:LRA=9:linear=true:offset=0:print_format=json"
        f":measured_I={measured['input_i']}:measured_TP={measured['input_tp']}"
        f":measured_LRA={measured['input_lra']}:measured_thresh={measured['input_thresh']}"
    )
    mastered = run(source + ["-af", norm, "-ar", str(SR), "-c:a", "pcm_s24le",
                            "-metadata", "title=A Brighter Flow — TabShow",
                            "-metadata", "artist=TabShow",
                            "-metadata", "comment=Original sample-free upbeat ambient score; gentle groove, no UI sounds.", str(WAV)])
    run(["ffmpeg", "-hide_banner", "-y", "-i", str(WAV), "-c:a", "libmp3lame",
         "-b:a", "192k", str(MP3)])
    probe = run(["ffprobe", "-v", "error", "-show_entries",
                 "format=duration,size:stream=codec_name,sample_rate,channels,bits_per_raw_sample",
                 "-of", "json", str(WAV)])
    r128 = run(["ffmpeg", "-hide_banner", "-i", str(WAV), "-af",
                "ebur128=peak=true:framelog=verbose", "-f", "null", "-"])
    (HERE / "verification.json").write_text(probe.stdout)
    (HERE / "loudness-verification.txt").write_text("\n".join(line.rstrip() for line in r128.stderr.splitlines()) + "\n")
    new = analysis(WAV)
    assert new["duration_seconds"] == 48
    assert -19.2 <= new["integrated_lufs"] <= -18.8, new
    assert new["true_peak_dbfs"] <= -3, new
    assert new["clipped_samples"] == 0, new
    report = {"upbeat_ambient_v3": new}
    if OLD.exists() and not args.skip_comparison:
        old = analysis(OLD)
        report["original"] = old
        report["comparison"] = {
            "integrated_loudness_change_lu": new["integrated_lufs"] - old["integrated_lufs"],
            "relative_energy_above_2khz_reduction_percent": 100 * (1 - new["energy_above_2000hz_percent"] / old["energy_above_2000hz_percent"]),
            "relative_energy_above_4khz_reduction_percent": 100 * (1 - new["energy_above_4000hz_percent"] / old["energy_above_4000hz_percent"]),
            "attack_proxy_reduction_percent": 100 * (1 - new["rms_attack_proxy_per_second"] / old["rms_attack_proxy_per_second"]),
            "positive_spectral_flux_reduction_percent": 100 * (1 - new["normalized_mean_positive_spectral_flux"] / old["normalized_mean_positive_spectral_flux"]),
            "method_note": "Spectral shares are relative to each track's total power. The raw attack proxy counts adjacent 20-ms RMS rises over 2 dB from seconds 2–45. The additional 100-ms-smoothed envelope count uses a 1 dB rise per 20 ms and suppresses low-note phase beating. These are objective texture indicators, not perceptual-quality scores.",
        }
    (HERE / "audio-comparison.json").write_text(json.dumps(report, indent=2) + "\n")
    RAW.unlink()
    print(json.dumps(report, indent=2))
    print(r128.stderr[r128.stderr.index("Summary:"):])


if __name__ == "__main__":
    main()
