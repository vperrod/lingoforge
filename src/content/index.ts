import type { Course, CourseId, Lesson, ReadingText } from './types'
import { ruCourse } from './courses/ru'
import { esCourse } from './courses/es'
import { ruAlphabet, readingPractice, confusablePairs } from './courses/ru-alphabet'
import { readings } from './readings'
import { phrasebook } from './phrasebook'
import { grammarNotes } from './grammar'

export const courses: Record<CourseId, Course> = {
  ru: ruCourse,
  es: esCourse,
}

export { ruAlphabet, readingPractice, confusablePairs }
export { readings, phrasebook, grammarNotes }

export function getReading(courseId: CourseId, textId: string): ReadingText | undefined {
  return readings[courseId]?.find((r) => r.id === textId)
}

export function grammarNote(courseId: CourseId, lessonId: string): string | undefined {
  return grammarNotes[`${courseId}:${lessonId}`]
}

export function getCourse(id: CourseId): Course {
  return courses[id]
}

export function getLesson(course: Course, lessonId: string): Lesson | undefined {
  for (const unit of course.units) {
    for (const skill of unit.skills) {
      const lesson = skill.lessons.find((l) => l.id === lessonId)
      if (lesson) return lesson
    }
  }
  return undefined
}

export function getVocab(course: Course, vocabId: string) {
  return course.vocab.find((v) => v.id === vocabId)
}

export function allLessonIds(course: Course): string[] {
  return course.units.flatMap((u) => u.skills.flatMap((s) => s.lessons.map((l) => l.id)))
}
