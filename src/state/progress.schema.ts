import { z } from 'zod'

// Reusable CourseId alias so the schema matches src/content/types.ts
export const courseIdSchema = z.string()

// ---- Primitive nested objects ----

export const dayLogSchema = z.object({
  minutes: z.number().finite().nonnegative(),
  xp: z.number().finite().nonnegative(),
  lessons: z.number().finite().nonnegative(), // lessons counted for this day
})

export const srsItemSchema = z.object({
  vocabId: z.string().min(1),
  stability: z.number().finite().positive(),
  difficulty: z.number().finite().nonnegative(),
  dueAt: z.number().finite().nonnegative(),
  reps: z.number().int().nonnegative(),
  lapses: z.number().int().nonnegative(),
})

export const courseProgressSchema = z.object({
  /** lessonId → crown level (0..5) */
  lessonCompletions: z.record(z.string(), z.number().int().nonnegative().max(5)),
  /** vocabId → spaced-repetition state */
  srsItems: z.record(z.string().min(1), srsItemSchema),
})

// ---- Top-level Progress shape ----

export const progressDataSchema = z.object({
  xp: z.number().finite().nonnegative(),
  activeCourse: courseIdSchema,
  dailyGoalMinutes: z.number().finite().positive(),
  /** 'YYYY-MM-DD' → log */
  dailyLog: z.record(z.string(), dayLogSchema),
  badges: z.record(z.string(), z.number().finite().nonnegative()),
  courses: z.partialRecord(courseIdSchema, courseProgressSchema),
})

export type ProgressData = z.infer<typeof progressDataSchema>
export type DayLog = z.infer<typeof dayLogSchema>
export type CourseProgress = z.infer<typeof courseProgressSchema>
export type SrsItem = z.infer<typeof srsItemSchema>
