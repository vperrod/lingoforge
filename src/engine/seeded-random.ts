export function mulberry32(seed: number) {
  let s = seed | 0
  return () => {
    s |= 0
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Fisher-Yates. `sort(() => Math.random() - 0.5)` is not a fair shuffle — it
 * biases items toward their original position. */
export function shuffle<T>(arr: T[], rng = Math.random): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Partial Fisher-Yates: stops after `n` swaps instead of shuffling the
 * whole array, since callers only ever want a handful of items back. */
export function sample<T>(arr: T[], n: number, rng: (() => number) | undefined = undefined): T[] {
  const random = rng ?? Math.random
  const count = Math.min(n, arr.length)
  const a = [...arr]
  for (let i = 0; i < count; i++) {
    const j = i + Math.floor(random() * (a.length - i))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a.slice(0, count)
}
