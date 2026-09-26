import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// hoisted: the store registers its window listeners at import time
const listeners = vi.hoisted(() => {
  const l: Record<string, (e: unknown) => void> = {}
  vi.stubGlobal('window', { addEventListener: (t: string, fn: (e: unknown) => void) => void (l[t] = fn) })
  return l
})
const writes = vi.hoisted(() => [] as string[])
vi.stubGlobal('localStorage', { getItem: () => null, setItem: (_k: string, v: string) => void writes.push(v), removeItem: () => {} })
const doc = vi.hoisted(() => {
  const d = { visibilityState: 'visible' }
  vi.stubGlobal('document', d)
  return d
})

import { useProgress, emptyProgress } from './progress'
import { progressStorageKey } from './profiles'

describe('multi-tab sync', () => {
  it('adopts progress saved by another tab for the active profile', () => {
    useProgress.getState().loadForProfile('p1', 'ru')
    const other = { ...emptyProgress('ru'), xp: 99 }
    listeners.storage({ key: progressStorageKey('p1'), newValue: JSON.stringify(other) })
    expect(useProgress.getState().data.xp).toBe(99)
  })

  it('ignores writes for other profiles', () => {
    useProgress.getState().loadForProfile('p1', 'ru')
    listeners.storage({ key: progressStorageKey('p2'), newValue: JSON.stringify({ ...emptyProgress('ru'), xp: 5 }) })
    expect(useProgress.getState().data.xp).toBe(0)
  })

  describe('pending local save', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      writes.length = 0
      doc.visibilityState = 'visible'
      useProgress.getState().loadForProfile('p1', 'ru')
    })
    afterEach(() => {
      useProgress.getState().flushSave()
      vi.useRealTimers()
    })

    it('is not overwritten by a foreign-tab write', () => {
      useProgress.getState().addXp(10)
      listeners.storage({ key: progressStorageKey('p1'), newValue: JSON.stringify({ ...emptyProgress('ru'), xp: 99 }) })
      expect(useProgress.getState().data.xp).toBe(10)
    })

    it('is written on pagehide', () => {
      useProgress.getState().addXp(10)
      listeners.pagehide({})
      expect(JSON.parse(writes[0]).xp).toBe(10)
    })

    it('is written when the page becomes hidden', () => {
      useProgress.getState().addXp(10)
      doc.visibilityState = 'hidden'
      listeners.visibilitychange({})
      expect(JSON.parse(writes[0]).xp).toBe(10)
    })

    it('is kept when the page becomes visible again', () => {
      useProgress.getState().addXp(10)
      listeners.visibilitychange({})
      expect(writes).toHaveLength(0)
    })
  })
})
