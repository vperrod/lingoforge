import { describe, it, expect, beforeEach, vi } from 'vitest'

// node test env has no localStorage; stub before settings.ts (zustand persist) loads
vi.hoisted(() => {
  const store = new Map<string, string>()
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
    clear: () => store.clear(),
  })
})

import { useSettings } from './settings'

describe('useSettings store', () => {
  beforeEach(() => {
    localStorage.clear()
    useSettings.setState({ aiEnabled: false })
  })

  it('defaults aiEnabled to false', () => {
    expect(useSettings.getState().aiEnabled).toBe(false)
  })

  it('setAiEnabled(true) flips the flag on', () => {
    useSettings.getState().setAiEnabled(true)
    expect(useSettings.getState().aiEnabled).toBe(true)
  })

  it('setAiEnabled(false) flips the flag back off', () => {
    useSettings.getState().setAiEnabled(true)
    useSettings.getState().setAiEnabled(false)
    expect(useSettings.getState().aiEnabled).toBe(false)
  })

  it('persists across a fresh import, so a stale default cannot silently re-enable the Ollama calls', async () => {
    useSettings.getState().setAiEnabled(true)
    expect(localStorage.getItem('lingoforge:settings')).toContain('"aiEnabled":true')

    vi.resetModules()
    const { useSettings: reloaded } = await import('./settings')
    expect(reloaded.getState().aiEnabled).toBe(true)
  })
})
