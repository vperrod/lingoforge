import { describe, it, expect, vi } from 'vitest'

// hoisted: the store registers its window listeners at import time
const listeners = vi.hoisted(() => {
  const l: Record<string, (e: unknown) => void> = {}
  vi.stubGlobal('window', { addEventListener: (t: string, fn: (e: unknown) => void) => void (l[t] = fn) })
  return l
})
vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => {}, removeItem: () => {} })

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
})
