// Web Audio API Sound Synthesizer (Zero external dependencies, works offline)

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioCtxClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Atomic Clock Beep (e.g. RRI time signal beep: 1000Hz short beep, or 2000Hz on 00s)
export function playAtomicTick(isTop: boolean = false) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Top of minute/hour gets a higher frequency, standard seconds get a crisp tick
    osc.frequency.setValueAtTime(isTop ? 1760 : 1000, ctx.currentTime);

    const duration = isTop ? 0.4 : 0.08;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (err) {
    console.debug('Audio playback throttled or not allowed yet:', err);
  }
}

// Melodic Adzan Notification Chime (Harmonic soft chord)
export function playAdzanChime() {
  try {
    const ctx = getAudioContext();
    const notes = [440, 554.37, 659.25, 880]; // A Major gentle chime sequence
    const startTime = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime + idx * 0.25);

      gain.gain.setValueAtTime(0, startTime + idx * 0.25);
      gain.gain.linearRampToValueAtTime(0.2, startTime + idx * 0.25 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + idx * 0.25 + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime + idx * 0.25);
      osc.stop(startTime + idx * 0.25 + 1.3);
    });
  } catch (err) {
    console.debug('Audio notification error:', err);
  }
}
