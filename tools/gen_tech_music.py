import numpy as np
import soundfile as sf
import pedalboard as pb
from pedalboard import Pedalboard, Chorus, Reverb, LowpassFilter, HighpassFilter, Gain, Delay, Compressor
import os

SAMPLE_RATE = 44100
BPM = 88
BEAT_LEN = 60.0 / BPM
BAR_LEN = BEAT_LEN * 4
NUM_BARS = 16  # ~43.6 seconds (perfect for a Short / Reel)
TOTAL_SAMPLES = int(BAR_LEN * NUM_BARS * SAMPLE_RATE)
DURATION = TOTAL_SAMPLES / SAMPLE_RATE

print(f"Generating chill-tech background track: BPM={BPM}, Bars={NUM_BARS}, Duration={DURATION:.2f}s")

# 1. Timeline & Frequencies
t = np.linspace(0, DURATION, TOTAL_SAMPLES, endpoint=False)
mix_left = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
mix_right = np.zeros(TOTAL_SAMPLES, dtype=np.float32)

# Musical scale: D minor / Dorian (D, E, F, G, A, B, C)
FREQ_MAP = {
    'D2': 73.42, 'F2': 87.31, 'G2': 98.00, 'A2': 110.00, 'C3': 130.81,
    'D3': 146.83, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'C4': 261.63,
    'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00,
    'B4': 493.88, 'C5': 523.25, 'D5': 587.33
}

# 2. Drums: Tight Electronic Kick, Soft Snare/Clap, Shaker/HiHat
kick = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
snare = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
hats = np.zeros(TOTAL_SAMPLES, dtype=np.float32)

num_beats = int(NUM_BARS * 4)
for b in range(num_beats):
    beat_sample = int(b * BEAT_LEN * SAMPLE_RATE)
    
    # Kick on beat 0 and beat 2.5 (chill syncopated)
    if b % 4 == 0 or (b % 4 == 2 and (b // 4) % 2 == 1):
        k_len = int(0.25 * SAMPLE_RATE)
        kt = np.linspace(0, 0.25, k_len, endpoint=False)
        pitch_env = 140.0 * np.exp(-kt * 32.0) + 48.0
        phase = 2.0 * np.pi * np.cumsum(pitch_env) / SAMPLE_RATE
        k_wave = np.sin(phase) * np.exp(-kt * 14.0)
        end_idx = min(beat_sample + k_len, TOTAL_SAMPLES)
        kick[beat_sample:end_idx] += k_wave[:end_idx - beat_sample] * 0.45

    # Snare / rimshot on beat 2 (beats 1 and 3 in 0-indexed: 1, 3)
    if b % 2 == 1:
        s_len = int(0.18 * SAMPLE_RATE)
        st = np.linspace(0, 0.18, s_len, endpoint=False)
        s_noise = np.random.uniform(-1, 1, s_len) * np.exp(-st * 28.0)
        s_tone = np.sin(2.0 * np.pi * 190.0 * st) * np.exp(-st * 20.0)
        s_wave = s_noise * 0.6 + s_tone * 0.4
        end_idx = min(beat_sample + s_len, TOTAL_SAMPLES)
        snare[beat_sample:end_idx] += s_wave[:end_idx - beat_sample] * 0.28

    # Hihat 8th notes
    for eighth in [0, 0.5]:
        h_idx = int((b + eighth) * BEAT_LEN * SAMPLE_RATE)
        h_len = int(0.06 * SAMPLE_RATE)
        ht = np.linspace(0, 0.06, h_len, endpoint=False)
        h_noise = np.random.uniform(-1, 1, h_len) * np.exp(-ht * 65.0)
        end_idx = min(h_idx + h_len, TOTAL_SAMPLES)
        hats[h_idx:end_idx] += h_noise[:end_idx - h_idx] * (0.12 if eighth == 0 else 0.08)

# 3. Sub & Mid Bass (Analog warm sine-saw)
bass = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
bass_progression = ['D2', 'D2', 'F2', 'G2', 'D2', 'D2', 'C3', 'A2']
for bar in range(NUM_BARS):
    note = bass_progression[bar % len(bass_progression)]
    f0 = FREQ_MAP[note]
    for b in range(4):
        # Bass pattern: root notes on beats 0 and 2.5
        if b in [0, 2]:
            idx = int((bar * 4 + b) * BEAT_LEN * SAMPLE_RATE)
            b_dur = BEAT_LEN * 1.6
            b_len = int(b_dur * SAMPLE_RATE)
            bt = np.linspace(0, b_dur, b_len, endpoint=False)
            b_wave = (np.sin(2 * np.pi * f0 * bt) + 0.3 * np.sin(2 * np.pi * f0 * 2 * bt) + 0.1 * np.sin(2 * np.pi * f0 * 3 * bt)) * np.exp(-bt * 1.8)
            end_idx = min(idx + b_len, TOTAL_SAMPLES)
            bass[idx:end_idx] += b_wave[:end_idx - idx] * 0.38

# 4. Tech Arpeggio (Futuristic synth pluck)
arp = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
arp_notes = ['D4', 'F4', 'A4', 'C5', 'D5', 'A4', 'F4', 'G4', 'E4', 'C4', 'D4', 'A4', 'F4', 'D4', 'C4', 'A3']
for i, note in enumerate(arp_notes * (NUM_BARS * 2)):
    arp_time = i * (BEAT_LEN / 2.0)
    idx = int(arp_time * SAMPLE_RATE)
    if idx >= TOTAL_SAMPLES:
        break
    f0 = FREQ_MAP.get(note, 440.0)
    a_len = int(0.22 * SAMPLE_RATE)
    at = np.linspace(0, 0.22, a_len, endpoint=False)
    # Pluck with soft harmonics
    a_wave = (np.sin(2 * np.pi * f0 * at) + 0.4 * np.sin(2 * np.pi * f0 * 2 * at) + 0.15 * np.sin(2 * np.pi * f0 * 3 * at)) * np.exp(-at * 16.0)
    end_idx = min(idx + a_len, TOTAL_SAMPLES)
    arp[idx:end_idx] += a_wave[:end_idx - idx] * 0.18

# 5. Ambient Tech Pad / Atmosphere
pad = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
chords = [
    [FREQ_MAP['D3'], FREQ_MAP['F3'], FREQ_MAP['A3'], FREQ_MAP['C4']],
    [FREQ_MAP['D3'], FREQ_MAP['G3'], FREQ_MAP['A3'], FREQ_MAP['D4']],
    [FREQ_MAP['C3'], FREQ_MAP['E4'], FREQ_MAP['G3'], FREQ_MAP['B4']],
    [FREQ_MAP['D3'], FREQ_MAP['F3'], FREQ_MAP['A3'], FREQ_MAP['D4']]
]
for bar in range(NUM_BARS):
    chord = chords[bar % len(chords)]
    bar_start = int(bar * BAR_LEN * SAMPLE_RATE)
    bar_samples = int(BAR_LEN * SAMPLE_RATE)
    pt = np.linspace(0, BAR_LEN, bar_samples, endpoint=False)
    # Slow attack, smooth sustain
    env = np.sin(np.pi * np.clip(pt / BAR_LEN, 0, 1)) ** 0.8
    chord_wave = np.zeros(bar_samples, dtype=np.float32)
    for freq in chord:
        # Subtle chorus detune
        chord_wave += (np.sin(2 * np.pi * freq * pt) + np.sin(2 * np.pi * (freq * 1.002) * pt)) * 0.25
    end_idx = min(bar_start + bar_samples, TOTAL_SAMPLES)
    pad[bar_start:end_idx] += (chord_wave * env)[:end_idx - bar_start] * 0.14

# Combine channels with stereo panning
mix_left = kick * 0.9 + snare * 0.85 + hats * 0.7 + bass * 0.95 + arp * 0.75 + pad * 0.9
mix_right = kick * 0.9 + snare * 0.85 + hats * 0.9 + bass * 0.95 + arp * 0.95 + pad * 0.8

raw_audio = np.stack([mix_left, mix_right], axis=0)

# 6. Mastering Chain via Spotify Pedalboard: Lowpass, Reverb, Chorus, Compressor, Limiter
board = Pedalboard([
    HighpassFilter(cutoff_frequency_hz=35.0),
    LowpassFilter(cutoff_frequency_hz=14000.0),
    Chorus(rate_hz=0.8, depth=0.25, mix=0.15),
    Delay(delay_seconds=BEAT_LEN * 0.75, feedback=0.2, mix=0.12),
    Reverb(room_size=0.35, damping=0.5, wet_level=0.15, dry_level=0.85),
    Compressor(threshold_db=-18.0, ratio=2.5, attack_ms=20.0, release_ms=100.0),
    Gain(gain_db=-3.5)
])

processed = board(raw_audio, SAMPLE_RATE)

# Normalize cleanly so peak is at -1.0 dB
max_val = np.max(np.abs(processed))
if max_val > 0:
    processed = (processed / max_val) * 0.89

out_path = r"C:\Users\Jack\Documents\Github\DrakesCraft-Labs\Slimefun-Knowledge-Drake\video\public\audio\bg_tech_chill.wav"
sf.write(out_path, processed.T, SAMPLE_RATE, subtype='PCM_16')
print(f"✅ Generated background track successfully at: {out_path} ({DURATION:.2f}s)")
