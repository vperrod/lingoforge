import { describe, it, expect } from 'vitest'
import { newSrsItem, review, dueItems } from './srs'
import { isCorrectAnswer, matchesAny } from './answer-check'
import { xpForAnswer } from './scoring'
import { createTimer, recordActivity, pause, elapsedMs } from './session-timer'

const DAY = 24 * 60 * 60 * 1000
const T0 = 1_700_000_000_000

describe('srs', () => {
  it('schedules first review one day out', () => {
    const item = newSrsItem('kot', T0)
    expect(item.dueAt).toBe(T0 + DAY)
  })

  it('grows interval on correct review', () => {
    const item = newSrsItem('kot', T0)
    const after = review(item, true, T0 + DAY)
    expect(after.stability).toBeGreaterThan(item.stability)
    expect(after.dueAt).toBeGreaterThan(T0 + 2 * DAY)
  })

  it('shrinks interval and counts lapse on wrong review', () => {
    const item = review(review(newSrsItem('kot', T0), true, T0), true, T0)
    const failed = review(item, false, T0)
    expect(failed.stability).toBeLessThan(item.stability)
    expect(failed.lapses).toBe(1)
  })

  it('dueItems returns only due, oldest first', () => {
    const a = { ...newSrsItem('a', T0), dueAt: T0 - DAY }
    const b = { ...newSrsItem('b', T0), dueAt: T0 - 2 * DAY }
    const c = { ...newSrsItem('c', T0), dueAt: T0 + DAY }
    expect(dueItems([a, b, c], T0).map((i) => i.vocabId)).toEqual(['b', 'a'])
  })
})

describe('answer-check', () => {
  it('ignores case and punctuation', () => {
    expect(isCorrectAnswer('Привет!', 'привет')).toBe(true)
  })

  it('treats ё and е as equal', () => {
    expect(isCorrectAnswer('живёт', 'живет')).toBe(true)
  })

  it('tolerates missing Spanish accents', () => {
    expect(isCorrectAnswer('¿Dónde está el baño?', 'donde esta el bano')).toBe(true)
  })

  it('rejects wrong words', () => {
    expect(isCorrectAnswer('кот', 'кит')).toBe(false)
  })

  it('matchesAny accepts inflected forms', () => {
    expect(matchesAny(['хотеть', 'хочу'], 'хочу')).toBe(true)
  })
})

describe('scoring', () => {
  it('applies combo multipliers at 3 and 5', () => {
    expect(xpForAnswer(1)).toBe(10)
    expect(xpForAnswer(3)).toBe(15)
    expect(xpForAnswer(5)).toBe(20)
  })
})

describe('session-timer', () => {
  it('counts continuous active time', () => {
    let t = createTimer(T0)
    t = recordActivity(t, T0 + 30_000)
    expect(elapsedMs(t, T0 + 30_000)).toBe(30_000)
  })

  it('caps idle gaps at the idle limit', () => {
    let t = createTimer(T0)
    // user goes idle for 5 minutes, then comes back
    t = recordActivity(t, T0 + 5 * 60_000)
    // only 60s of the gap counted
    expect(elapsedMs(t, T0 + 5 * 60_000)).toBe(60_000)
  })

  it('pause settles time and stops the clock', () => {
    let t = createTimer(T0)
    t = recordActivity(t, T0 + 10_000)
    t = pause(t, T0 + 20_000)
    expect(elapsedMs(t, T0 + 99_000)).toBe(20_000)
  })
})
