// The four alphabet drill builders shuffle options, slice, and derive correctIndex
// from the shuffled array. A wrong index scores a right answer as wrong, so every
// drill is run many times against the real ru alphabet content and each exercise
// must point at the answer it claims to teach.
import { describe, expect, it } from 'vitest'
import { readingPractice, ruAlphabet } from '../content'
import type { ExerciseInstance } from '../engine/exercise-gen'
import { confusablesDrill, groupDrill, letterChoice, readingChallenge } from './alphabet-drills'

const RUNS = 30
const letters = ruAlphabet.groups.flatMap((g) => g.letters)

function repeat(build: () => ExerciseInstance[]): ExerciseInstance[] {
  return Array.from({ length: RUNS }, build).flat()
}

function correctOption(ex: ExerciseInstance): string | undefined {
  return ex.kind === 'choice' || ex.kind === 'listening' ? ex.options[ex.correctIndex] : undefined
}

function expectScorable(exercises: ExerciseInstance[]) {
  for (const ex of exercises) {
    if (ex.kind === 'spell') {
      // Missing-letter mode only tiles the blanks; whole-word mode tiles every letter.
      const needed = ex.shown ? [...ex.answer].filter((_, i) => ex.shown![i] === null) : [...ex.answer]
      for (const ch of needed) expect(ex.tiles).toContain(ch)
      continue
    }
    if (ex.kind !== 'choice' && ex.kind !== 'listening') throw new Error(`unexpected kind ${ex.kind}`)
    expect(ex.correctIndex).toBeGreaterThanOrEqual(0)
    expect(ex.correctIndex).toBeLessThan(ex.options.length)
    expect(new Set(ex.options).size).toBe(ex.options.length)
  }
}

describe('letterChoice', () => {
  it('builds five exercises whose correctIndex points at the target letter', () => {
    for (const letter of letters) {
      const exercises = letterChoice(letter, letters)
      expect(exercises).toHaveLength(5)
      expect(correctOption(exercises[0])).toBe(letter.sound)
      expect(correctOption(exercises[1])).toBe(`${letter.letter} ${letter.lower}`)
      expect(correctOption(exercises[2])).toBe(letter.example.word)
      expect(correctOption(exercises[3])).toBe(letter.example.hint)
      expect(exercises[4].kind === 'spell' && exercises[4].answer).toBe(letter.example.word.toLowerCase())
    }
  })

  it('offers four distinct options for every choice question', () => {
    const exercises = repeat(() => letters.flatMap((l) => letterChoice(l, letters)))
    expectScorable(exercises)
    for (const ex of exercises) {
      if (ex.kind === 'choice' || ex.kind === 'listening') expect(ex.options).toHaveLength(4)
    }
  })
})

describe('groupDrill', () => {
  it('caps at 20 scorable exercises and covers every letter of the group', () => {
    for (const group of ruAlphabet.groups) {
      const exercises = repeat(() => groupDrill(group))
      expectScorable(exercises)
      const single = groupDrill(group)
      expect(single.length).toBeLessThanOrEqual(20)
      expect(single.length).toBe(Math.min(20, group.letters.length * 2 + Math.min(3, (readingPractice[group.id] ?? []).length)))
    }
  })

  it('answers each "Read it" question with the hint of the word in the prompt', () => {
    const readIts = repeat(() => groupDrill(ruAlphabet.groups[0])).filter(
      (ex) => ex.kind === 'choice' && ex.prompt.startsWith('Read: '),
    )
    const words = readingPractice[ruAlphabet.groups[0].id]
    for (const ex of readIts) {
      const word = words.find((w) => ex.kind === 'choice' && ex.prompt.startsWith(`Read: ${w.word} `))!
      expect(correctOption(ex)).toBe(word.hint)
    }
  })
})

describe('confusablesDrill', () => {
  it('yields at most 16 scorable exercises', () => {
    const single = confusablesDrill()
    expect(single.length).toBe(16)
    expectScorable(repeat(confusablesDrill))
  })

  it('marks the letter named in vocabIds as the correct option even after shuffling', () => {
    const choices = repeat(confusablesDrill).filter((ex) => ex.kind === 'choice')
    expect(choices.length).toBeGreaterThan(0)
    for (const ex of choices) {
      const target = ex.vocabIds[0].replace('alpha:', '')
      expect(correctOption(ex)?.startsWith(`${target} `)).toBe(true)
    }
  })

  it('places the correct letter in both positions across runs, so index 0 is not assumed', () => {
    const positions = repeat(confusablesDrill)
      .filter((ex) => ex.kind === 'choice')
      .map((ex) => (ex.kind === 'choice' ? ex.correctIndex : -1))
    expect(new Set(positions)).toEqual(new Set([0, 1]))
  })
})

describe('readingChallenge', () => {
  it('yields exactly 16 scorable exercises', () => {
    expect(readingChallenge()).toHaveLength(16)
    expectScorable(repeat(readingChallenge))
  })

  it('answers every question with the hint or translation of the word in the prompt', () => {
    const allWords = Object.values(readingPractice).flat()
    const choices = repeat(readingChallenge).filter((ex) => ex.kind === 'choice')
    for (const ex of choices) {
      if (ex.kind !== 'choice') continue
      const isRead = ex.prompt.startsWith('Read: ')
      const wordText = isRead ? ex.prompt.slice('Read: '.length) : ex.prompt.slice('What does "'.length, -'" mean?'.length)
      const word = allWords.find((w) => w.word === wordText)!
      expect(correctOption(ex)).toBe(isRead ? word.hint : word.translation)
    }
  })
})
