import { describe, expect, it } from 'vitest'
import { courses } from '../content'
import { alphabetDone, courseStage, lessonStage, letterSchedule, lettersUpTo, newLetters } from './production-stage'

const ru = courses.ru
const beginnerLessons = ru.units.slice(0, 2).flatMap((u) => u.skills.flatMap((s) => s.lessons))
const beginnerDone = Object.fromEntries(beginnerLessons.map((l) => [l.id, 1]))
const lesson1 = beginnerLessons[0]

describe('letterSchedule', () => {
  it('teaches at most 6 new letters per lesson, each letter exactly once', () => {
    const seen = new Set<string>()
    for (const letters of letterSchedule(ru).values()) {
      expect(letters.length).toBeLessThanOrEqual(6)
      for (const ch of letters) {
        expect(seen.has(ch)).toBe(false)
        seen.add(ch)
      }
    }
    expect(seen.size).toBeGreaterThanOrEqual(30) // ъ never appears in the vocab
  })

  it('lesson 1 introduces the letters of its own words', () => {
    expect(newLetters(ru, lesson1)).toEqual(['п', 'р', 'и', 'в', 'е', 'т'])
    expect([...lettersUpTo(ru, lesson1)]).toEqual(['п', 'р', 'и', 'в', 'е', 'т'])
  })

  it('spills a letter past the cap into the next lesson', () => {
    const lessons = beginnerLessons.slice(0, 3)
    const schedule = letterSchedule(ru)
    for (const l of lessons.slice(0, 2)) expect(schedule.get(l.id)).toHaveLength(6)
    const byId = new Map(ru.vocab.map((v) => [v.id, v]))
    const ownOfSecond = lessons[1].vocabIds.map((id) => byId.get(id)?.lemma ?? '').join('')
    const spilled = schedule.get(lessons[1].id)!.filter((ch) => !ownOfSecond.includes(ch))
    expect(spilled.length).toBeGreaterThan(0)
  })

  it('places the rare letters ё щ ц in later units, not the beginner ones', () => {
    const beginnerIds = new Set(beginnerLessons.map((l) => l.id))
    const schedule = letterSchedule(ru)
    for (const ch of ['ё', 'щ', 'ц']) {
      const lessonId = [...schedule].find(([, letters]) => letters.includes(ch))?.[0]
      expect(lessonId).toBeDefined()
      expect(beginnerIds.has(lessonId!)).toBe(false)
    }
  })

  it('has no schedule for Spanish', () => {
    expect(letterSchedule(courses.es).size).toBe(0)
  })
})

describe('courseStage', () => {
  it('starts a Russian learner at letters', () => {
    expect(courseStage(ru, {})).toBe('letters')
  })

  it('stays at letters while a beginner lesson with new letters is not done', () => {
    const allButLast = { ...beginnerDone }
    delete allButLast['u1s2l2'] // introduces л э ч ы х ш
    expect(alphabetDone(ru, allButLast)).toBe(false)
    expect(courseStage(ru, allButLast)).toBe('letters')
  })

  it('reaches typing once the beginner units (and so their letters) are done', () => {
    expect(courseStage(ru, beginnerDone)).toBe('typing')
  })

  it('goes to tiles when the alphabet tab taught every letter but the units are not done', () => {
    const tab = { 'alpha-identical': 1, 'alpha-false-friends': 1, 'alpha-new-shapes': 1, 'alpha-unique': 1 }
    expect(courseStage(ru, tab)).toBe('tiles')
  })

  it('starts Spanish (Latin script) at tiles', () => {
    expect(courseStage(courses.es, {})).toBe('tiles')
  })
})

describe('lessonStage', () => {
  it('never lets replays beat the course stage', () => {
    expect(lessonStage(ru, {}, 5)).toBe('letters')
  })

  it('needs a third pass before typing even at the typing stage', () => {
    expect(lessonStage(ru, beginnerDone, 1)).toBe('tiles')
    expect(lessonStage(ru, beginnerDone, 2)).toBe('typing')
  })
})
