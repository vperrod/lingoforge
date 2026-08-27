import { describe, it, expect } from 'vitest'
import { xpForAnswer, XP_PER_CORRECT } from './scoring'

describe('xpForAnswer', () => {
  it('awards base XP with no combo', () => {
    expect(xpForAnswer(0)).toBe(XP_PER_CORRECT)
  })

  it('awards base XP just under the 3-streak threshold', () => {
    expect(xpForAnswer(2)).toBe(XP_PER_CORRECT)
  })

  it('awards 1.5x, rounded, at a 3-streak combo', () => {
    expect(xpForAnswer(3)).toBe(Math.round(XP_PER_CORRECT * 1.5))
  })

  it('still awards 1.5x just under the 5-streak threshold', () => {
    expect(xpForAnswer(4)).toBe(Math.round(XP_PER_CORRECT * 1.5))
  })

  it('awards 2x at a 5-streak combo', () => {
    expect(xpForAnswer(5)).toBe(XP_PER_CORRECT * 2)
  })

  it('stays at 2x beyond a 5-streak combo', () => {
    expect(xpForAnswer(12)).toBe(XP_PER_CORRECT * 2)
  })
})
