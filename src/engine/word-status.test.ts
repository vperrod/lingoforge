import { describe, it, expect } from 'vitest'
import { wordStatus } from './word-status'
import { newSrsItem } from './srs'

describe('wordStatus', () => {
  it('is new when the word is not in the deck', () => {
    expect(wordStatus(undefined)).toBe('new')
  })

  it('is learning for a freshly added word', () => {
    expect(wordStatus(newSrsItem('w'))).toBe('learning')
  })

  it('is known once stability matures past three weeks', () => {
    expect(wordStatus({ ...newSrsItem('w'), stability: 30 })).toBe('known')
  })
})
