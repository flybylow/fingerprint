// WebAudio for the portrait. Sound is wanted on arrival. Browsers may keep the
// context suspended until a gesture; the button follows whether it is actually
// running. The opening page is a low beating pad. A human identification lifts
// that into a warmer chord. Bot swaps the bed for a TV-test tone plus noise.
// Buttons get a dry tick.

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let ambient: { stop: () => void } | null = null;
let enabled = true;
let bed: Bed = "home";

export type PortraitTone = "human" | "bot";
export type Bed = "home" | "welcome" | "bot";

function ensure(): boolean {
  if (typeof window === "undefined") return false;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return true;
}

/** Start audio if it's enabled. Safe to call from a click or key gesture. */
function arm(): boolean {
  if (!enabled || !ensure()) return false;
  if (!ambient) startAmbient();
  return true;
}

export function setEnabled(on: boolean) {
  enabled = on;
  if (on) {
    ensure();
    if (ctx?.state === "running") startAmbient();
  } else {
    stopAmbient();
  }
}

/** Resume if the browser allows it, then start the bed. False while suspended. */
export async function resumeIfAllowed(): Promise<boolean> {
  if (!enabled || !ensure() || !ctx) return false;
  if (ctx.state === "suspended") {
    try { await ctx.resume(); } catch { return false; }
  }
  if (!enabled || ctx.state !== "running") return false;
  if (!ambient) startAmbient();
  return true;
}

/** Swap the bed. Remembered while muted, so turning sound on later matches the screen. */
export function setBed(next: Bed) {
  if (next === bed) return;
  bed = next;
  if (!enabled) return;
  stopAmbient();
  startAmbient();
}

export function isEnabled() {
  return enabled;
}

function voice(
  freq: number,
  peak: number,
  attack: number,
  dur: number,
  type: OscillatorType = "sine",
) {
  if (!ctx || !master) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(peak, now + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  osc.connect(g).connect(master);
  osc.start(now);
  osc.stop(now + dur + 0.05);
}

/** Soft open fifth — the human "you're welcome" when the portrait resolves. */
function playWelcome() {
  voice(392, 0.055, 0.14, 1.35); // G4
  voice(587.33, 0.04, 0.22, 1.45); // D5
  voice(783.99, 0.018, 0.34, 1.2); // G5, quiet shimmer
}

/** Short SMPTE-style alignment tone: harsh, dry, gone quickly. */
function playTestScreen() {
  voice(1000, 0.07, 0.012, 0.48, "square");
  voice(997, 0.035, 0.012, 0.48, "square"); // slow beat, slightly sour
  voice(400, 0.028, 0.012, 0.36, "square");
  if (!ctx || !master) return;
  const dur = 0.28;
  const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 2400;
  const ng = ctx.createGain();
  ng.gain.value = 0.045;
  src.connect(hp).connect(ng).connect(master);
  src.start(ctx.currentTime);
}

/** Character sting when the portrait resolves or the simulate toggle flips. */
export function playResolve(tone: PortraitTone = "human") {
  if (!arm()) return;
  if (tone === "bot") playTestScreen();
  else playWelcome();
}

/** Dry, short tick for buttons and chips — no sub thud. */
export function playTick() {
  if (!arm()) return;
  const now = ctx!.currentTime;
  const osc = ctx!.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(1760, now);
  osc.frequency.exponentialRampToValueAtTime(1174, now + 0.05);
  const g = ctx!.createGain();
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.07, now + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
  osc.connect(g).connect(master!);
  osc.start(now);
  osc.stop(now + 0.08);

  const body = ctx!.createOscillator();
  body.type = "sine";
  body.frequency.value = 880;
  const bg = ctx!.createGain();
  bg.gain.setValueAtTime(0.0001, now);
  bg.gain.exponentialRampToValueAtTime(0.03, now + 0.003);
  bg.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
  body.connect(bg).connect(master!);
  body.start(now);
  body.stop(now + 0.06);
}

function startAmbient() {
  if (!ensure() || !ctx || !master || ambient) return;
  ambient = bed === "bot" ? startTestBed() : bed === "welcome" ? startWelcomeBed() : startPad();
}

function startPad() {
  const audio = ctx!;
  const now = audio.currentTime;
  const o1 = audio.createOscillator();
  const o2 = audio.createOscillator();
  o1.type = "sine";
  o2.type = "sine";
  o1.frequency.value = 55;
  o2.frequency.value = 55.4;
  const lp = audio.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 400;
  const g = audio.createGain();
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.045, now + 2.0);
  const lfo = audio.createOscillator();
  lfo.frequency.value = 0.07;
  const lfoG = audio.createGain();
  lfoG.gain.value = 0.018;
  lfo.connect(lfoG).connect(g.gain);
  o1.connect(lp);
  o2.connect(lp);
  lp.connect(g).connect(master!);
  o1.start(now);
  o2.start(now);
  lfo.start(now);
  return {
    stop: () => {
      const t = ctx!.currentTime;
      g.gain.cancelScheduledValues(t);
      lfoG.disconnect();
      const current = Math.max(g.gain.value, 0.0001);
      g.gain.setValueAtTime(current, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
      [o1, o2, lfo].forEach((o) => o.stop(t + 0.7));
    },
  };
}

/**
 * Human arrival. An A-major chord above the home drone, lowpassed so it
 * opens from a muffled root into the third and fifth. Slower breath than
 * the homepage, no 0.4 Hz throb.
 */
function startWelcomeBed() {
  const audio = ctx!;
  const now = audio.currentTime;
  const notes = [
    { freq: 110, gain: 0.016 }, // A2
    { freq: 138.59, gain: 0.012 }, // C#3
    { freq: 164.81, gain: 0.01 }, // E3
    { freq: 220, gain: 0.004 }, // A3, quiet halo
    { freq: 110.12, gain: 0.008 }, // slow chorus, about an 8s bloom
  ];
  const lp = audio.createBiquadFilter();
  lp.type = "lowpass";
  lp.Q.value = 0.45;
  lp.frequency.setValueAtTime(180, now);
  lp.frequency.exponentialRampToValueAtTime(1400, now + 4);
  const bus = audio.createGain();
  bus.gain.setValueAtTime(0.25, now);
  bus.gain.exponentialRampToValueAtTime(1, now + 2.6);
  const oscs = notes.map(({ freq, gain }) => {
    const osc = audio.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const voiceGain = audio.createGain();
    voiceGain.gain.value = gain;
    osc.connect(voiceGain).connect(lp);
    return osc;
  });
  const lfo = audio.createOscillator();
  lfo.frequency.value = 0.045;
  const lfoG = audio.createGain();
  lfoG.gain.value = 0.07;
  lfo.connect(lfoG).connect(bus.gain);
  lp.connect(bus).connect(master!);
  oscs.forEach((osc) => osc.start(now));
  lfo.start(now);
  return {
    stop: () => {
      const t = ctx!.currentTime;
      lfoG.disconnect();
      bus.gain.cancelScheduledValues(t);
      bus.gain.setValueAtTime(Math.max(bus.gain.value, 0.0001), t);
      bus.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);
      [...oscs, lfo].forEach((osc) => osc.stop(t + 0.9));
    },
  };
}

/** Alignment tone, a slow beat, a warbling sweep, and TV snow. */
function startTestBed() {
  const audio = ctx!;
  const now = audio.currentTime;

  const tone = audio.createGain();
  tone.gain.setValueAtTime(0.0001, now);
  tone.gain.exponentialRampToValueAtTime(0.02, now + 0.2);
  const a = audio.createOscillator();
  const b = audio.createOscillator();
  a.type = "square";
  b.type = "square";
  a.frequency.value = 1000;
  b.frequency.value = 997;
  a.connect(tone);
  b.connect(tone);
  tone.connect(master!);

  const saw = audio.createOscillator();
  saw.type = "sawtooth";
  saw.frequency.value = 440;
  const sawLfo = audio.createOscillator();
  sawLfo.frequency.value = 0.45;
  const sawDepth = audio.createGain();
  sawDepth.gain.value = 260;
  sawLfo.connect(sawDepth).connect(saw.frequency);
  const sawG = audio.createGain();
  sawG.gain.setValueAtTime(0.0001, now);
  sawG.gain.exponentialRampToValueAtTime(0.012, now + 0.25);
  saw.connect(sawG).connect(master!);

  const seconds = 2;
  const buf = audio.createBuffer(1, Math.floor(audio.sampleRate * seconds), audio.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const fade = Math.floor(audio.sampleRate * 0.03);
  for (let i = 0; i < fade; i++) {
    const w = i / fade;
    data[i] *= w;
    data[data.length - 1 - i] *= w;
  }
  const noise = audio.createBufferSource();
  noise.buffer = buf;
  noise.loop = true;
  const bp = audio.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 2400;
  bp.Q.value = 0.6;
  const sweep = audio.createOscillator();
  sweep.frequency.value = 0.22;
  const sweepDepth = audio.createGain();
  sweepDepth.gain.value = 1800;
  sweep.connect(sweepDepth).connect(bp.frequency);
  const snow = audio.createBiquadFilter();
  snow.type = "highpass";
  snow.frequency.value = 5000;
  const ng = audio.createGain();
  ng.gain.setValueAtTime(0.0001, now);
  ng.gain.exponentialRampToValueAtTime(0.055, now + 0.3);
  noise.connect(bp);
  noise.connect(snow);
  bp.connect(ng);
  snow.connect(ng);
  ng.connect(master!);

  const nodes = [a, b, saw, sawLfo, noise, sweep];
  nodes.forEach((n) => n.start(now));

  return {
    stop: () => {
      const t = audio.currentTime;
      sawDepth.disconnect();
      sweepDepth.disconnect();
      for (const g of [tone, sawG, ng]) {
        g.gain.cancelScheduledValues(t);
        g.gain.setValueAtTime(Math.max(g.gain.value, 0.0001), t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
      }
      nodes.forEach((n) => n.stop(t + 0.3));
    },
  };
}

function stopAmbient() {
  if (ambient) {
    ambient.stop();
    ambient = null;
  }
}
