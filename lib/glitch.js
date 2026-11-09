const DURATION = 1;

let audio;
let live = [];

function context() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!audio) audio = new Ctx();
  if (audio.state === "suspended") audio.resume();
  return audio;
}

function stopLive() {
  const now = audio ? audio.currentTime : 0;
  for (const node of live) {
    try {
      node.stop(now);
    } catch {
      /* already stopped */
    }
  }
  live = [];
}

export function playGlitch() {
  const ctx = context();
  if (!ctx) return;
  stopLive();

  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.2, now);
  master.gain.setValueAtTime(0.2, now + 0.9);
  master.gain.linearRampToValueAtTime(0, now + DURATION);
  master.connect(ctx.destination);

  const length = Math.floor(ctx.sampleRate * DURATION);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) {
    const t = i / ctx.sampleRate;
    const gate = Math.sin(t * 53) > 0.15 || Math.sin(t * 17) > 0.72 ? 1 : 0.04;
    data[i] = (Math.random() * 2 - 1) * gate * (1 - t * 0.25);
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(2200, now);
  filter.frequency.exponentialRampToValueAtTime(320, now + DURATION);
  filter.Q.value = 0.6;
  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.42;
  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(master);
  noise.start(now);
  noise.stop(now + DURATION);

  const tone = ctx.createOscillator();
  tone.type = "square";
  const jumps = [740, 180, 980, 240, 620, 140, 860, 200];
  jumps.forEach((freq, index) => {
    tone.frequency.setValueAtTime(freq, now + index * 0.12);
  });
  const toneGain = ctx.createGain();
  toneGain.gain.setValueAtTime(0, now);
  for (let i = 0; i < 7; i += 1) {
    const at = now + 0.04 + i * 0.13;
    toneGain.gain.setValueAtTime(0.07, at);
    toneGain.gain.setValueAtTime(0, at + 0.045);
  }
  tone.connect(toneGain);
  toneGain.connect(master);
  tone.start(now);
  tone.stop(now + DURATION);

  const zap = ctx.createOscillator();
  zap.type = "sawtooth";
  zap.frequency.setValueAtTime(1400, now + 0.72);
  zap.frequency.exponentialRampToValueAtTime(90, now + DURATION);
  const zapGain = ctx.createGain();
  zapGain.gain.setValueAtTime(0, now);
  zapGain.gain.setValueAtTime(0.05, now + 0.72);
  zapGain.gain.linearRampToValueAtTime(0, now + DURATION);
  zap.connect(zapGain);
  zapGain.connect(master);
  zap.start(now + 0.72);
  zap.stop(now + DURATION);

  live = [noise, tone, zap];
}
