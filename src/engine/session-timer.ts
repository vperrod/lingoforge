/**
 * Active-study time tracker. Counts elapsed time only while the tab is
 * visible and the user has interacted within IDLE_LIMIT_MS — honest minutes,
 * not wall clock.
 */

const IDLE_LIMIT_MS = 60_000

export interface TimerState {
  accumulatedMs: number
  /** Epoch ms when current active span started; null = paused */
  activeSince: number | null
  lastActivityAt: number
}

export function createTimer(now: number = Date.now()): TimerState {
  return { accumulatedMs: 0, activeSince: now, lastActivityAt: now }
}

/** Call on any user interaction. Resumes if paused, settles idle gaps. */
export function recordActivity(state: TimerState, now: number = Date.now()): TimerState {
  if (state.activeSince === null) {
    return { ...state, activeSince: now, lastActivityAt: now }
  }
  // If the user was idle past the limit, count only up to lastActivity + limit
  if (now - state.lastActivityAt > IDLE_LIMIT_MS) {
    const countedUntil = state.lastActivityAt + IDLE_LIMIT_MS
    return {
      accumulatedMs: state.accumulatedMs + (countedUntil - state.activeSince),
      activeSince: now,
      lastActivityAt: now,
    }
  }
  return { ...state, lastActivityAt: now }
}

/** Call when tab hidden / lesson exited. */
export function pause(state: TimerState, now: number = Date.now()): TimerState {
  if (state.activeSince === null) return state
  const effectiveEnd = Math.min(now, state.lastActivityAt + IDLE_LIMIT_MS)
  return {
    accumulatedMs: state.accumulatedMs + Math.max(0, effectiveEnd - state.activeSince),
    activeSince: null,
    lastActivityAt: state.lastActivityAt,
  }
}

/** Current total active ms, without mutating state. */
export function elapsedMs(state: TimerState, now: number = Date.now()): number {
  if (state.activeSince === null) return state.accumulatedMs
  const effectiveEnd = Math.min(now, state.lastActivityAt + IDLE_LIMIT_MS)
  return state.accumulatedMs + Math.max(0, effectiveEnd - state.activeSince)
}
