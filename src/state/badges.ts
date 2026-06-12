import type { ProgressData } from './progress'
import { computeStreak } from './progress'

export interface BadgeDef {
  id: string
  title: string
  description: string
  icon: string // lucide icon name
  earned: (d: ProgressData) => boolean
}

function totalLessons(d: ProgressData): number {
  return Object.values(d.courses).reduce(
    (sum, c) => sum + Object.keys(c?.lessonCompletions ?? {}).length,
    0,
  )
}

function totalWords(d: ProgressData): number {
  return Object.values(d.courses).reduce((sum, c) => sum + Object.keys(c?.srsItems ?? {}).length, 0)
}

export const BADGES: BadgeDef[] = [
  {
    id: 'first-lesson',
    title: 'First step',
    description: 'Complete your first lesson',
    icon: 'footprints',
    earned: (d) => totalLessons(d) >= 1,
  },
  {
    id: 'streak-3',
    title: 'Warming up',
    description: '3-day streak',
    icon: 'flame',
    earned: (d) => computeStreak(d.dailyLog, d.dailyGoalMinutes) >= 3,
  },
  {
    id: 'streak-7',
    title: 'On fire',
    description: '7-day streak',
    icon: 'flame',
    earned: (d) => computeStreak(d.dailyLog, d.dailyGoalMinutes) >= 7,
  },
  {
    id: 'words-50',
    title: 'Word collector',
    description: 'Learn 50 words',
    icon: 'book-open',
    earned: (d) => totalWords(d) >= 50,
  },
  {
    id: 'words-100',
    title: 'Lexicon builder',
    description: 'Learn 100 words',
    icon: 'library',
    earned: (d) => totalWords(d) >= 100,
  },
  {
    id: 'alphabet-master',
    title: 'Alphabet master',
    description: 'Complete all 4 Cyrillic groups',
    icon: 'type',
    // awarded directly by the alphabet screen
    earned: (d) => Boolean(d.badges['alphabet-master']),
  },
  {
    id: 'xp-500',
    title: 'Half a thousand',
    description: 'Earn 500 XP',
    icon: 'zap',
    earned: (d) => d.xp >= 500,
  },
  {
    id: 'xp-1000',
    title: 'XP machine',
    description: 'Earn 1000 XP',
    icon: 'trophy',
    earned: (d) => d.xp >= 1000,
  },
]
