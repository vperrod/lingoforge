import { describe, it, expect } from 'vitest'
import { courses, getLesson } from '../content'
import { generateLessonExercises, spellFromWord, letterPool } from './exercise-gen'

const ru = courses.ru
const lesson = getLesson(ru, 'u2s1l1') // Drinks: 5 short words, sentences, a pattern

describe('spellFromWord', () => {
  it('includes every answer letter as a tile and lowercases the answer', () => {
    const ex = spellFromWord('Чай', 'tea', letterPool(ru))
    expect(ex.kind).toBe('spell')
    if (ex.kind !== 'spell') return
    expect(ex.answer).toBe('чай')
    for (const ch of 'чай') expect(ex.tiles).toContain(ch)
  })

  it('marks audio variants with ttsText', () => {
    const ex = spellFromWord('чай', 'tea', letterPool(ru), { audio: true })
    expect(ex.kind === 'spell' && ex.ttsText).toBe('чай')
  })
})

describe('generateLessonExercises balance', () => {
  it('never lets multiple-choice dominate (≤ 4 of ≤ 14)', () => {
    if (!lesson) throw new Error('fixture lesson missing')
    for (let i = 0; i < 25; i++) {
      const ex = generateLessonExercises(ru, lesson, 0)
      expect(ex.length).toBeLessThanOrEqual(14)
      expect(ex.filter((e) => e.kind === 'choice').length).toBeLessThanOrEqual(4)
      expect(ex.filter((e) => e.kind === 'listening').length).toBeLessThanOrEqual(2)
    }
  })

  it('offers spelling activities for short words', () => {
    if (!lesson) throw new Error('fixture lesson missing')
    const kinds = new Set<string>()
    for (let i = 0; i < 30; i++) {
      for (const e of generateLessonExercises(ru, lesson, 0)) kinds.add(e.kind)
    }
    expect(kinds.has('spell')).toBe(true)
  })

  it('mixes many activity types (not just select)', () => {
    if (!lesson) throw new Error('fixture lesson missing')
    const kinds = new Set<string>()
    for (let i = 0; i < 30; i++) {
      for (const e of generateLessonExercises(ru, lesson, 0)) kinds.add(e.kind)
    }
    // production + listening variety beyond multiple-choice
    expect(kinds.has('spell')).toBe(true)
    expect(kinds.has('dictation')).toBe(true)
    expect(kinds.size).toBeGreaterThanOrEqual(6)
  })
})
