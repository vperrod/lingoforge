import { describe, it, expect } from 'vitest'
import { createTimer, recordActivity, pause, elapsedMs } from './session-timer'

describe('createTimer', () => {
  it('starts active with zero accumulated time', () => {
    const t = createTimer(1000)
    expect(t).toEqual({ accumulatedMs: 0, activeSince: 1000, lastActivityAt: 1000 })
  })
})

describe('elapsedMs', () => {
  it('counts time since activeSince while active', () => {
    const t = createTimer(0)
    expect(elapsedMs(t, 5000)).toBe(5000)
  })

  it('clamps to lastActivityAt + idle limit once idle past the limit', () => {
    const t = createTimer(0)
    expect(elapsedMs(t, 120_000)).toBe(60_000)
  })

  it('returns accumulatedMs unchanged when paused', () => {
    const t = { accumulatedMs: 4242, activeSince: null, lastActivityAt: 1000 }
    expect(elapsedMs(t, 999_999)).toBe(4242)
  })
})

describe('recordActivity', () => {
  it('resumes from paused at the given time', () => {
    const paused = { accumulatedMs: 500, activeSince: null, lastActivityAt: 1000 }
    expect(recordActivity(paused, 2000)).toEqual({
      accumulatedMs: 500,
      activeSince: 2000,
      lastActivityAt: 2000,
    })
  })

  it('extends lastActivityAt without settling when within the idle limit', () => {
    const t = createTimer(0)
    expect(recordActivity(t, 30_000)).toEqual({
      accumulatedMs: 0,
      activeSince: 0,
      lastActivityAt: 30_000,
    })
  })

  it('settles accumulated time up to the idle cutoff when activity resumes after a gap', () => {
    const t = createTimer(0)
    const resumed = recordActivity(t, 200_000)
    expect(resumed).toEqual({
      accumulatedMs: 60_000,
      activeSince: 200_000,
      lastActivityAt: 200_000,
    })
  })

  it('does not count idle time exactly at the limit boundary', () => {
    const t = createTimer(0)
    expect(recordActivity(t, 60_000)).toEqual({
      accumulatedMs: 0,
      activeSince: 0,
      lastActivityAt: 60_000,
    })
  })
})

describe('pause', () => {
  it('is a no-op when already paused', () => {
    const paused = { accumulatedMs: 100, activeSince: null, lastActivityAt: 1000 }
    expect(pause(paused, 5000)).toBe(paused)
  })

  it('accumulates time up to now when within the idle limit', () => {
    const t = createTimer(0)
    expect(pause(t, 10_000)).toEqual({
      accumulatedMs: 10_000,
      activeSince: null,
      lastActivityAt: 0,
    })
  })

  it('clamps accumulated time to the idle cutoff when paused after going idle', () => {
    const t = createTimer(0)
    expect(pause(t, 200_000)).toEqual({
      accumulatedMs: 60_000,
      activeSince: null,
      lastActivityAt: 0,
    })
  })
})
