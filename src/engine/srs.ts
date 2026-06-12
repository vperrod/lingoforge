/**
 * Simplified FSRS-style spaced repetition.
 * Each item has stability (days until ~90% recall) and difficulty (0-1).
 * Review outcome scales stability up (correct) or resets it down (wrong).
 */

export interface SrsItem {
  vocabId: string
  /** Days the memory is expected to last */
  stability: number
  /** 0 (easy) .. 1 (hard) — dampens stability growth */
  difficulty: number
  /** Epoch ms of next due review */
  dueAt: number
  /** Total reviews */
  reps: number
  lapses: number
}

const INITIAL_STABILITY = 1 // 1 day after first exposure
const MIN_STABILITY = 0.25 // 6 hours floor after a lapse
const GROWTH_BASE = 2.5 // stability multiplier when recalled at full difficulty ease
const DAY_MS = 24 * 60 * 60 * 1000

export function newSrsItem(vocabId: string, now: number = Date.now()): SrsItem {
  return {
    vocabId,
    stability: INITIAL_STABILITY,
    difficulty: 0.3,
    dueAt: now + INITIAL_STABILITY * DAY_MS,
    reps: 1,
    lapses: 0,
  }
}

export function review(item: SrsItem, correct: boolean, now: number = Date.now()): SrsItem {
  if (correct) {
    const growth = 1 + (GROWTH_BASE - 1) * (1 - item.difficulty)
    const stability = item.stability * growth
    return {
      ...item,
      stability,
      difficulty: Math.max(0, item.difficulty - 0.05),
      dueAt: now + stability * DAY_MS,
      reps: item.reps + 1,
    }
  }
  const stability = Math.max(MIN_STABILITY, item.stability * 0.3)
  return {
    ...item,
    stability,
    difficulty: Math.min(1, item.difficulty + 0.15),
    dueAt: now + stability * DAY_MS,
    reps: item.reps + 1,
    lapses: item.lapses + 1,
  }
}

export function dueItems(items: SrsItem[], now: number = Date.now()): SrsItem[] {
  return items
    .filter((i) => i.dueAt <= now)
    .sort((a, b) => a.dueAt - b.dueAt)
}
