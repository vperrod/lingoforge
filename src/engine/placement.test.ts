import { describe, expect, it } from 'vitest'
import { scorePlacement } from './placement'

describe('scorePlacement', () => {
  it('returns the unit count when every unit passes', () => {
    const unitBoundaries = [3, 3, 3]
    const answers = [true, true, true, true, true, true, true, true, true]
    expect(scorePlacement(answers, unitBoundaries)).toBe(3)
  })

  it('returns 0 when the first unit fails', () => {
    const unitBoundaries = [3, 3, 3]
    const answers = [false, false, false, true, true, true, true, true, true]
    expect(scorePlacement(answers, unitBoundaries)).toBe(0)
  })

  it('returns the index of the first failed unit when results are mixed', () => {
    const unitBoundaries = [3, 3, 3]
    const answers = [true, true, true, false, false, true, true, true, true]
    expect(scorePlacement(answers, unitBoundaries)).toBe(1)
  })

  it('treats exactly 70% correct as a pass', () => {
    const unitBoundaries = [10]
    const answers = [...Array(7).fill(true), ...Array(3).fill(false)]
    expect(scorePlacement(answers, unitBoundaries)).toBe(1)
  })
})
