// Writes the background music and the click sound to public/, made from plain waves so there's nothing to license.
// A driving 128 bpm track in F minor: a punchy kick on every beat, claps, rolling bass and synth stabs,
// with a rise before each scene change and a hit as it lands. The scene times come from the video.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

// Where each scene starts, in seconds, from the same timeline the video uses
const lengths = Object.values(JSON.parse(readFileSync(new URL('../src/timeline.json', import.meta.url), 'utf8')));
const starts = lengths.map((_, i) => lengths.slice(0, i).reduce((a, b) => a + b, 0) / 30);
const CUTS = starts.slice(1);
const END = lengths.reduce((a, b) => a + b, 0) / 30;

const RATE = 44100;
const SECONDS = Math.ceil(END) + 1;
const BEAT = 60 / 128;
const BAR = BEAT * 4;

const midi = (n) => 440 * 2 ** ((n - 69) / 12);
// Fm, Db, Ab, Eb: one bar each
const chords = [
  [53, 56, 60],
  [49, 53, 56],
  [56, 60, 63],
  [51, 55, 58],
];
const roots = [41, 37, 44, 39];

const total = RATE * SECONDS;
const L = new Float32Array(total);
const R = new Float32Array(total);
const duck = new Float32Array(total).fill(1);
const add = (i, v, pan = 0) => {
  if (i < 0 || i >= total) return;
  L[i] += v * (1 - pan);
  R[i] += v * (1 + pan);
};
const noise = () => Math.random() * 2 - 1;
const saw = (phase) => 2 * (phase - Math.floor(phase + 0.5));

// Kick: every beat from the first cut to the outro, plus a final hit. Each kick ducks the bass and stabs.
const kick = (at, gain = 0.9) => {
  const s = Math.floor(at * RATE);
  let ph = 0;
  for (let j = 0; j < 0.35 * RATE; j++) {
    const t = j / RATE;
    ph += (2 * Math.PI * (48 + 160 * Math.exp(-t * 35))) / RATE;
    const v = Math.sin(ph) * Math.exp(-t * 9) + noise() * Math.exp(-t * 300) * 0.3;
    add(s + j, v * gain);
    if (s + j < total) duck[s + j] = Math.min(duck[s + j], 0.25 + 0.75 * Math.min(1, t / 0.18));
  }
};
const clap = (at, gain = 0.35) => {
  const s = Math.floor(at * RATE);
  let lp = 0;
  for (let j = 0; j < 0.25 * RATE; j++) {
    const t = j / RATE;
    const n = noise();
    lp += 0.45 * (n - lp);
    const env = (t < 0.03 ? 0.6 + 0.4 * Math.sin(t * 600) : 1) * Math.exp(-t * 16);
    add(s + j, (n - lp) * env * gain + Math.sin(2 * Math.PI * 190 * t) * Math.exp(-t * 30) * gain * 0.4, 0.1);
  }
};
const hat = (at, open, gain) => {
  const s = Math.floor(at * RATE);
  let prev = 0;
  const decay = open ? 14 : 60;
  for (let j = 0; j < (open ? 0.2 : 0.05) * RATE; j++) {
    const n = noise();
    add(s + j, (n - prev) * Math.exp((-j / RATE) * decay) * gain, 0.35);
    prev = n;
  }
};
// Rising noise and pitch over the two beats before a cut
const riser = (cut) => {
  const len = BEAT * 4;
  const s = Math.floor((cut - len) * RATE);
  let lp = 0;
  for (let j = 0; j < len * RATE; j++) {
    const t = j / RATE;
    const p = t / len;
    lp += (0.02 + p * 0.5) * (noise() - lp);
    add(s + j, lp * p * p * 0.5, Math.sin(t * 6) * 0.4);
    add(s + j, Math.sin(2 * Math.PI * (200 + 1200 * p * p) * t) * p * p * 0.05);
  }
};
// A low boom and a burst of noise when a scene lands
const impact = (at) => {
  const s = Math.floor(at * RATE);
  let ph = 0;
  for (let j = 0; j < 1.6 * RATE; j++) {
    const t = j / RATE;
    ph += (2 * Math.PI * (38 + 60 * Math.exp(-t * 8))) / RATE;
    add(s + j, Math.sin(ph) * Math.exp(-t * 2.5) * 0.7 + noise() * Math.exp(-t * 3.5) * 0.12);
  }
};

const drumsFrom = CUTS[0];
const drumsTo = CUTS[CUTS.length - 1];
for (let b = 0; b * BEAT < drumsTo + 0.01; b++) {
  const at = drumsFrom + b * BEAT;
  if (at >= drumsTo) break;
  kick(at);
  if (b % 2 === 1) clap(at);
  for (let k = 0; k < 4; k++) hat(at + (k * BEAT) / 4, k === 2, k === 2 ? 0.07 : 0.035);
}
// The intro builds: a heartbeat kick and a rise into the first cut
for (let b = 0; b < 8; b++) kick(b * BEAT * 0.97, 0.3 + b * 0.06);

// Bass: off-beat eighths on the chord root, with a simple low-pass
for (let e = 0; (e * BEAT) / 2 < drumsTo - drumsFrom; e++) {
  if (e % 2 === 0) continue;
  const at = drumsFrom + (e * BEAT) / 2;
  const bar = Math.floor((at - drumsFrom) / BAR);
  const f = midi(roots[bar % 4]);
  const s = Math.floor(at * RATE);
  let lp = 0;
  for (let j = 0; j < (BEAT / 2) * 0.9 * RATE; j++) {
    const t = j / RATE;
    lp += 0.12 * (saw(f * t) + 0.5 * saw(f * 2.005 * t) - lp);
    add(s + j, lp * Math.min(1, t / 0.005) * Math.exp(-t * 4) * 0.32);
  }
}

// Stabs: bright detuned saw chords on a syncopated rhythm, from the second scene
const rhythm = [0, 0.75, 1.5, 2.5, 3.25];
for (let bar = 0; drumsFrom + bar * BAR < drumsTo; bar++) {
  const start = drumsFrom + bar * BAR;
  if (start < CUTS[1] - 0.01) continue;
  for (const r of rhythm) {
    const at = start + r * BEAT;
    if (at >= drumsTo) break;
    const s = Math.floor(at * RATE);
    chords[bar % 4].forEach((n, k) => {
      const f = midi(n + 12);
      let lp = 0;
      for (let j = 0; j < 0.22 * RATE; j++) {
        const t = j / RATE;
        const cutoff = 0.08 + 0.3 * Math.exp(-t * 18);
        lp += cutoff * ((saw(f * t) + saw(f * 1.008 * t) + saw(f * 0.992 * t)) / 3 - lp);
        add(s + j, lp * Math.exp(-t * 10) * 0.11, k === 0 ? -0.5 : k === 1 ? 0 : 0.5);
      }
    });
  }
}

// Apply the kick's ducking to everything after the drums were drawn: simple, and it pumps
for (let i = 0; i < total; i++) {
  L[i] *= 0.55 + 0.45 * duck[i];
  R[i] *= 0.55 + 0.45 * duck[i];
}

for (const cut of CUTS) {
  riser(cut);
  impact(cut);
}
// The last chord rings out over the outro
chords[0].forEach((n, k) => {
  const s = Math.floor(drumsTo * RATE);
  const f = midi(n + 12);
  for (let j = 0; j < (END - drumsTo) * RATE; j++) {
    const t = j / RATE;
    add(s + j, ((saw(f * t) + saw(f * 1.006 * t)) / 2) * Math.exp(-t * 0.9) * 0.06, k - 1);
  }
});

// Loudness: soft clip, then fade in briefly and fade out at the very end
let peak = 0;
for (let i = 0; i < total; i++) {
  L[i] = Math.tanh(L[i] * 1.4);
  R[i] = Math.tanh(R[i] * 1.4);
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}
for (let i = 0; i < total; i++) {
  const t = i / RATE;
  const g = (0.9 / peak) * Math.min(1, t / 0.3) * Math.min(1, Math.max(0, (SECONDS - 0.5 - t) / 1.5));
  L[i] *= g;
  R[i] *= g;
}

function wav(left, right) {
  const n = left.length;
  const buf = Buffer.alloc(44 + n * 4);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + n * 4, 4);
  buf.write('WAVEfmt ', 8);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(2, 22);
  buf.writeUInt32LE(RATE, 24);
  buf.writeUInt32LE(RATE * 4, 28);
  buf.writeUInt16LE(4, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(n * 4, 40);
  for (let i = 0; i < n; i++) {
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, left[i])) * 32767), 44 + i * 4);
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, right[i])) * 32767), 46 + i * 4);
  }
  return buf;
}

// A short crisp click for the cursor
const clickLen = Math.floor(0.05 * RATE);
const CL = new Float32Array(clickLen);
for (let j = 0; j < clickLen; j++) {
  const t = j / RATE;
  CL[j] = (Math.sin(2 * Math.PI * 2200 * t) * 0.6 + noise() * 0.4) * Math.exp(-t * 110) * 0.7;
}

mkdirSync(new URL('../public/', import.meta.url), { recursive: true });
writeFileSync(new URL('../public/music.wav', import.meta.url), wav(L, R));
writeFileSync(new URL('../public/click.wav', import.meta.url), wav(CL, CL));
console.log('Wrote public/music.wav and public/click.wav');
