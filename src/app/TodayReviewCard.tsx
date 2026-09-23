import { RotateCcw } from 'lucide-react'
import { Link } from 'react-router'
import { courses } from '../content'
import { phrasesForVocabIds } from '../content/phrasebook'
import { courseDueItems } from '../engine/srs'
import { useProgress } from '../state/progress'
import { SpeakerButton } from '../ui/SpeakerButton'

export function TodayReviewCard() {
  const data = useProgress((s) => s.data)
  const course = courses[data.activeCourse]
  if (course.id !== 'ru') return null

  const srsItems = data.courses.ru?.srsItems
  const hasAnySrsItems = Object.keys(srsItems ?? {}).length > 0
  if (!hasAnySrsItems) return null

  const due = courseDueItems(course, srsItems)
  const missedCount = due.filter((i) => i.lapses > 0).length
  const sayToday = phrasesForVocabIds('ru', due.map((i) => i.vocabId)).slice(0, 4)

  if (due.length === 0) {
    return (
      <div className="clay clay-press block border-ru bg-red-50 p-4">
        <p className="font-display text-lg font-bold">Nothing due right now</p>
        <p className="text-fg-muted">Come back later.</p>
      </div>
    )
  }

  return (
    <div className="clay clay-press block border-ru bg-red-50 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="font-display text-lg font-bold">Today's Review</p>
        {missedCount > 0 && (
          <span className="flex items-center gap-1 rounded-full bg-on-primary/20 px-2 py-0.5 text-xs font-bold">
            <RotateCcw aria-hidden className="size-3" />
            {missedCount} coming back
          </span>
        )}
      </div>
      <p className="text-fg-muted">
        {due.length} word{due.length === 1 ? '' : 's'} due for review — fits inside your{' '}
        {data.dailyGoalMinutes}-minute goal for today.
      </p>
      <Link to="/review" className="mt-2 inline-block font-semibold text-primary underline">
        Start review
      </Link>
      {sayToday.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          <p className="font-display text-sm font-bold">Say these today</p>
          {sayToday.map((phrase, i) => (
            <div key={i} className="clay flex items-center gap-3 p-3">
              <SpeakerButton text={phrase.text} lang={course.ttsLang} label="Hear phrase" />
              <div>
                <p className="font-semibold">{phrase.text}</p>
                <p className="text-sm text-fg-muted">{phrase.translation}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
