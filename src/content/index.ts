import type { Course, CourseId, Lesson } from './types'
import { ruCourse } from './courses/ru'
import { esCourse } from './courses/es'
import { ruAlphabet } from './courses/ru-alphabet'

export const courses: Record<CourseId, Course> = {
  ru: ruCourse,
  es: esCourse,
}

export { ruAlphabet }

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
