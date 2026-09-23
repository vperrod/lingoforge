import { describe, it, expect, vi } from 'vitest'
import { optionOrder } from '../app/option-order'
import { courses, ruAlphabet, readingPractice, readings, phrasebook } from './index'
import { phrasesForVocabIds } from './phrasebook'

// Add a well-formed duplicate pack so the "first pack wins" behaviour of
// phrasesForVocabIds can be exercised (no real vocabId repeats across packs).
vi.mock('./phrasebook', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./phrasebook')>()
  return {
    ...actual,
    phrasebook: {
      ...actual.phrasebook,
      ru: [
        ...actual.phrasebook.ru,
        {
          id: 'ru-test-dup',
          title: 'Test duplicate',
          icon: 'hand',
          phrases: [{ text: 'Приветик', translation: 'Hi (dup)', vocabId: 'privet' }],
        },
      ],
    },
  }
})

const courseList = Object.values(courses)

describe.each(courseList)('course $id integrity', (course) => {
  const vocabIds = new Set(course.vocab.map((v) => v.id))

  it('has unique vocab ids', () => {
    expect(vocabIds.size).toBe(course.vocab.length)
  })

  it('lessons reference existing vocab', () => {
    const missing: string[] = []
    for (const unit of course.units) {
      for (const skill of unit.skills) {
        for (const lesson of skill.lessons) {
          for (const id of lesson.vocabIds) {
            if (!vocabIds.has(id)) missing.push(`${lesson.id}:${id}`)
          }
          for (const sentence of lesson.sentences) {
            for (const id of sentence.vocabIds) {
              if (!vocabIds.has(id)) missing.push(`${lesson.id} sentence:${id}`)
            }
          }
        }
      }
    }
    expect(missing).toEqual([])
  })

  it('lessons reference existing patterns', () => {
    const patternIds = new Set(course.patterns.map((p) => p.id))
    const missing: string[] = []
    for (const unit of course.units) {
      for (const skill of unit.skills) {
        for (const lesson of skill.lessons) {
          for (const id of lesson.patternIds ?? []) {
            if (!patternIds.has(id)) missing.push(`${lesson.id}:${id}`)
          }
        }
      }
    }
    expect(missing).toEqual([])
  })

  it('pattern slots reference existing vocab', () => {
    const missing: string[] = []
    for (const pattern of course.patterns) {
      for (const slot of pattern.slots) {
        if (!vocabIds.has(slot.vocabId)) missing.push(`${pattern.id}:${slot.vocabId}`)
      }
    }
    expect(missing).toEqual([])
  })

  it('has unique lesson ids', () => {
    const ids = course.units.flatMap((u) => u.skills.flatMap((s) => s.lessons.map((l) => l.id)))
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe.each(courseList)('reading content $id', (course) => {
  const texts = readings[course.id] ?? []

  it('has unique reading ids', () => {
    const ids = texts.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('story has body, dialogue has turns', () => {
    for (const t of texts) {
      if (t.kind === 'story') expect(t.body, t.id).toBeTruthy()
      else expect(t.turns?.length, t.id).toBeGreaterThan(0)
    }
  })

  it('glossary keys are non-empty strings', () => {
    for (const t of texts) {
      for (const key of Object.keys(t.glossary ?? {})) {
        expect(key.trim().length, `${t.id}:${key}`).toBeGreaterThan(0)
      }
    }
  })

  it('comprehension questions are well-formed', () => {
    for (const t of texts) {
      const questions = t.questions ?? []
      for (const q of questions) {
        expect(q.options.length, `${t.id}:${q.q}`).toBeGreaterThanOrEqual(2)
        expect(q.correctIndex).toBeGreaterThanOrEqual(0)
        expect(q.correctIndex).toBeLessThan(q.options.length)
      }
    }
  })

  it('comprehension answers do not all land on the same button', () => {
    const uniform: string[] = []
    for (const t of texts) {
      const questions = t.questions ?? []
      if (questions.length < 2) continue
      const positions = questions.map((q, i) =>
        optionOrder(`${t.id}:${i}`, q.options.length).indexOf(q.correctIndex),
      )
      if (new Set(positions).size === 1) uniform.push(t.id)
    }
    expect(uniform).toEqual([])
  })

  it('comprehension answers are in range', () => {
    for (const t of texts) {
      for (const q of t.questions ?? []) {
        expect(q.correctIndex, `${t.id}: ${q.q}`).toBeGreaterThanOrEqual(0)
        expect(q.correctIndex, `${t.id}: ${q.q}`).toBeLessThan(q.options.length)
      }
    }
  })
})

describe.each(courseList)('phrasebook content $id', (course) => {
  const vocabIds = new Set(course.vocab.map((v) => v.id))
  const packs = phrasebook[course.id] ?? []

  it('has unique pack ids', () => {
    const ids = packs.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('pack phrases are non-empty and unique within pack', () => {
    for (const pack of packs) {
      const phrases = pack.phrases.map((p) => p.text.trim())
      expect(phrases.length, `${pack.id} has phrases`).toBeGreaterThan(0)
      expect(new Set(phrases).size, `${pack.id} duplicate phrases`).toBe(phrases.length)
    }
  })

  it('phrase vocabIds reference existing vocab', () => {
    const missing: string[] = []
    for (const pack of packs) {
      for (const phrase of pack.phrases) {
        if (phrase.vocabId && !vocabIds.has(phrase.vocabId)) missing.push(`${pack.id}:${phrase.vocabId}`)
      }
    }
    expect(missing).toEqual([])
  })
})

describe('russian alphabet', () => {
  it('covers all 33 letters exactly once', () => {
    const letters = ruAlphabet.groups.flatMap((g) => g.letters.map((l) => l.letter))
    expect(letters.length).toBe(33)
    expect(new Set(letters).size).toBe(33)
  })

  // AlphabetScreen scores drills with options.indexOf(correctValue): a duplicate
  // sound/word/hint would silently make a right answer score as wrong.
  const letters = ruAlphabet.groups.flatMap((g) => g.letters)
  it.each([
    ['sound', letters.map((l) => l.sound)],
    ['example word', letters.map((l) => l.example.word)],
    ['example hint', letters.map((l) => l.example.hint)],
  ])('letter %s values are unique', (_, values) => {
    expect(new Set(values).size).toBe(values.length)
  })

  const practice = Object.values(readingPractice).flat()
    it.each([
      ['word', practice.map((w) => w.word)],
      ['hint', practice.map((w) => w.hint)],
      ['translation', practice.map((w) => w.translation)],
    ])('reading practice %s values are unique', (_, values) => {
      expect(new Set(values).size).toBe(values.length)
    })
  })

  describe('phrasesForVocabIds', () => {
    it('returns the phrase for a known vocabId', () => {
      const result = phrasesForVocabIds('ru', ['privet'])
      expect(result).toHaveLength(1)
      expect(result[0].text).toBe('Привет')
    })

    it('skips vocabIds with no match instead of padding with undefined', () => {
      const result = phrasesForVocabIds('ru', ['privet', 'no-such-vocab', 'spasibo'])
      expect(result.map((p) => p.vocabId)).toEqual(['privet', 'spasibo'])
    })

    it('returns results in input order, not phrasebook order', () => {
      // spasibo precedes privet in the essentials pack, but input order is reversed.
      const result = phrasesForVocabIds('ru', ['spasibo', 'privet', 'khleb'])
      expect(result.map((p) => p.vocabId)).toEqual(['spasibo', 'privet', 'khleb'])
    })

    it('first pack in iteration order wins for a duplicated vocabId', () => {
      // 'privet' also appears in the mocked ru-test-dup pack (appended last); the
      // ru-essentials occurrence must win.
      const result = phrasesForVocabIds('ru', ['privet'])
      expect(result).toHaveLength(1)
      expect(result[0].text).toBe('Привет')
    })
  })
