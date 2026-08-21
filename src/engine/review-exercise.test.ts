import { describe, it, expect, afterEach, vi } from 'vitest'
import { courses } from '../content'
import { reviewExercise } from './review-exercise'

const ru = courses.ru
const vocab = ru.vocab.find((v) => v.id === 'do-svidaniya')! // 'до свидания', has a space

afterEach(() => {
  vi.restoreAllMocks()
})

describe('reviewExercise', () => {
  it('never returns typing unless stage is typing and the word is known', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99) // past the choice/listening cutoffs
    for (const [stage, known] of [
      ['letters', true],
      ['tiles', true],
      ['typing', false],
    ] as const) {
      const ex = reviewExercise(ru, vocab, stage, known)
      expect(ex.kind).not.toBe('typing')
    }
  })

  it('returns typing when stage is typing and the word is known', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99)
    const ex = reviewExercise(ru, vocab, 'typing', true)
    expect(ex.kind).toBe('typing')
    if (ex.kind !== 'typing') return
    expect(ex.answer).toBe(vocab.lemma)
    expect(ex.accept).toContain(vocab.lemma)
  })

  it('returns a choice exercise with the correct translation on a low roll', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1)
    const ex = reviewExercise(ru, vocab, 'typing', true)
    expect(ex.kind).toBe('choice')
    if (ex.kind !== 'choice') return
    expect(ex.options[ex.correctIndex]).toBe(vocab.translation)
  })

  it('returns a listening exercise with the correct lemma on a mid roll', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    const ex = reviewExercise(ru, vocab, 'typing', true)
    expect(ex.kind).toBe('listening')
    if (ex.kind !== 'listening') return
    expect(ex.options[ex.correctIndex]).toBe(vocab.lemma)
  })
})
