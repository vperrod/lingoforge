import { describe, it, expect } from 'vitest'
import { courses, ruAlphabet } from './index'

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

describe('russian alphabet', () => {
  it('covers all 33 letters exactly once', () => {
    const letters = ruAlphabet.groups.flatMap((g) => g.letters.map((l) => l.letter))
    expect(letters.length).toBe(33)
    expect(new Set(letters).size).toBe(33)
  })
})
