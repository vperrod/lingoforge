/** Tiny WebAudio synth chimes — no audio assets needed. */

let ctx: AudioContext | null = null

function audioCtx(): AudioContext | null {
  if (typeof AudioContext === 'undefined') return null
  if (!ctx) ctx = new AudioContext()
  return ctx
}

function tone(freq: number, startAt: number, duration: number, type: OscillatorType = 'sine', gain = 0.12) {
  const ac = audioCtx()
  if (!ac) return
  const osc = ac.createOscillator()
  const g = ac.createGain()
  osc.type = type
  osc.frequency.value = freq
  g.gain.setValueAtTime(gain, ac.currentTime + startAt)
  g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + startAt + duration)
  osc.connect(g).connect(ac.destination)
  osc.start(ac.currentTime + startAt)
  osc.stop(ac.currentTime + startAt + duration)
}

export function playCorrect() {
  tone(660, 0, 0.15)
  tone(880, 0.1, 0.2)
}

export function playWrong() {
  tone(220, 0, 0.25, 'triangle')
}

export function playFanfare() {
  tone(523, 0, 0.15)
  tone(659, 0.12, 0.15)
  tone(784, 0.24, 0.15)
  tone(1047, 0.36, 0.35)
}
