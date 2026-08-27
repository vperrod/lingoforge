import { describe, it, expect, vi, afterEach } from 'vitest'
import { safeLocalStorage } from './safe-storage'

const throwingStorage = {
  getItem: () => { throw new DOMException('quota', 'SecurityError') },
  setItem: () => { throw new DOMException('quota', 'QuotaExceededError') },
  removeItem: () => { throw new DOMException('quota', 'SecurityError') },
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('safeLocalStorage', () => {
  it('getItem returns null instead of throwing when localStorage.getItem throws', () => {
    vi.stubGlobal('localStorage', throwingStorage)
    expect(() => safeLocalStorage.getItem('k')).not.toThrow()
    expect(safeLocalStorage.getItem('k')).toBeNull()
  })

  it('setItem swallows the error when localStorage.setItem throws', () => {
    vi.stubGlobal('localStorage', throwingStorage)
    expect(() => safeLocalStorage.setItem('k', 'v')).not.toThrow()
  })

  it('removeItem swallows the error when localStorage.removeItem throws', () => {
    vi.stubGlobal('localStorage', throwingStorage)
    expect(() => safeLocalStorage.removeItem('k')).not.toThrow()
  })
})
