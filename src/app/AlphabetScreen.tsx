import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Volume2, Check, Eye, Zap, BookOpen } from 'lucide-react'
import { courses, ruAlphabet } from '../content'
import type { AlphabetGroup } from '../content/types'
import type { ExerciseInstance } from '../engine/exercise-gen'
import { alphabetDone, alphabetDrillDone } from '../engine/production-stage'
import { LessonPlayer, type LessonResult } from '../exercises/LessonPlayer'
import { renderExercise } from '../exercises/render'
import { speak } from '../audio/tts'
import { useProgress } from '../state/progress'
import { ClayButton } from '../ui/ClayButton'
import { playFanfare } from '../audio/sfx'
import { confusablesDrill, groupDrill, readingChallenge } from './alphabet-drills'

const TTS_LANG = 'ru-RU'

type DrillMode = { type: 'group'; group: AlphabetGroup } | { type: 'confusables' } | { type: 'reading' }

function drillId(mode: DrillMode): string {
  if (mode.type === 'confusables') return 'alpha-confusables'
  if (mode.type === 'reading') return 'alpha-reading'
  return `alpha-${mode.group.id}`
}

function drillFromId(id: string | undefined): DrillMode | null {
  if (!id) return null
  if (id === 'alpha-confusables') return { type: 'confusables' }
  if (id === 'alpha-reading') return { type: 'reading' }
  const group = ruAlphabet.groups.find((g) => `alpha-${g.id}` === id)
  return group ? { type: 'group', group } : null
}

export function AlphabetScreen() {
  const { drillId: routeDrillId } = useParams<{ drillId?: string }>()
  const navigate = useNavigate()
  const data = useProgress((s) => s.data)
  const { addXp, addStudyMinutes, completeLesson, earnBadge } = useProgress()
  const [drill, setDrill] = useState<DrillMode | null>(() => drillFromId(routeDrillId))
  const [done, setDone] = useState(false)

  const completions = data.courses.ru?.lessonCompletions ?? {}
  const isDone = (id: string) => alphabetDrillDone(id, completions)

  const getDrillExercises = (mode: DrillMode): ExerciseInstance[] => {
    if (mode.type === 'confusables') return confusablesDrill()
    if (mode.type === 'reading') return readingChallenge()
    return groupDrill(mode.group)
  }

  const closeDrill = () => {
    setDrill(null)
    setDone(false)
    // A drill opened from the path returns to the path
    if (routeDrillId) navigate('/')
  }

  if (drill) {
    const handleComplete = (r: LessonResult) => {
      completeLesson('ru', drillId(drill), [])
      addXp(r.xp)
      addStudyMinutes(r.minutes)
      const fresh = useProgress.getState().data.courses.ru?.lessonCompletions ?? {}
      if (alphabetDone(courses.ru, fresh)) earnBadge('alphabet-master')
      playFanfare()
      setDone(true)
    }

    if (done) {
      return (
        <div className="flex flex-col items-center gap-6 py-12">
          <h2 className="font-display text-3xl font-bold text-primary">Отлично! Great job!</h2>
          <p className="text-fg-muted">
            {drill.type === 'group' && 'One group closer to reading Russian.'}
            {drill.type === 'confusables' && 'Those tricky pairs are getting easier!'}
            {drill.type === 'reading' && 'You can read Cyrillic! Keep practicing to build speed.'}
          </p>
          <ClayButton variant="primary" onClick={closeDrill}>
            {routeDrillId ? 'Back to the path' : 'Back to alphabet'}
          </ClayButton>
        </div>
      )
    }

    return (
      <LessonPlayer
        exercises={getDrillExercises(drill)}
        ttsLang={TTS_LANG}
        renderExercise={(ex, onAnswer) => renderExercise(ex, TTS_LANG, onAnswer)}
        onComplete={handleComplete}
        onExit={closeDrill}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-3xl font-bold">{courses.ru.flag} Cyrillic alphabet</h1>
        <p className="text-fg-muted">
          33 letters in 4 smart groups. Your lessons teach them a few at a time — this tab is
          for extra practice. Tap any letter to hear it.
        </p>
      </header>

      {/* Special drills */}
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setDrill({ type: 'confusables' })}
          className="clay clay-press flex items-center gap-3 border-red-300 bg-red-50 p-4 text-left"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-100">
            <Zap className="size-5 text-red-600" aria-hidden />
          </span>
          <span>
            <span className="block font-display font-bold">Confusable Pairs</span>
            <span className="text-xs text-fg-muted">В/Б, Р/П, Ш/Щ, Е/Э — the tricky ones</span>
          </span>
          {isDone('alpha-confusables') && <Check className="ml-auto size-5 text-accent" />}
        </button>

        <button
          type="button"
          onClick={() => setDrill({ type: 'reading' })}
          className="clay clay-press flex items-center gap-3 border-purple-300 bg-purple-50 p-4 text-left"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-purple-100">
            <BookOpen className="size-5 text-purple-600" aria-hidden />
          </span>
          <span>
            <span className="block font-display font-bold">Reading Challenge</span>
            <span className="text-xs text-fg-muted">Decode real Russian words from all groups</span>
          </span>
          {isDone('alpha-reading') && <Check className="ml-auto size-5 text-accent" />}
        </button>
      </div>

      {/* Letter groups, one drill each */}
      {ruAlphabet.groups.map((group) => {
        const groupDone = isDone(`alpha-${group.id}`)
        return (
          <section key={group.id} className="clay flex flex-col gap-4 p-5">
            <div>
              <h2 className="font-display text-xl font-bold">{group.title}</h2>
              <p className="text-sm text-fg-muted">{group.description}</p>
            </div>

            <ClayButton
              variant={groupDone ? 'neutral' : 'primary'}
              className="flex items-center justify-center gap-2"
              onClick={() => setDrill({ type: 'group', group })}
            >
              {groupDone ? <><Check className="size-4" aria-hidden /> Practice again</> : <><Eye className="size-4" aria-hidden /> Learn these letters</>}
            </ClayButton>

            {/* Letter cards */}
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {group.letters.map((letter) => (
                <button
                  key={letter.letter}
                  type="button"
                  onClick={async () => {
                    await speak(letter.lower, TTS_LANG)
                    await speak(letter.example.word, TTS_LANG)
                  }}
                  className="clay clay-press flex flex-col items-center gap-1 p-3"
                  aria-label={`Letter ${letter.letter}, sounds like ${letter.sound}. Play audio`}
                >
                  <span className="font-display text-3xl font-extrabold">
                    {letter.letter} {letter.lower}
                  </span>
                  <span className="text-center text-xs text-fg-muted">{letter.sound}</span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-primary">
                    <Volume2 className="size-3" aria-hidden />
                    {letter.example.word}
                  </span>
                  {letter.extraExamples && letter.extraExamples.length > 0 && (
                    <span className="text-center text-[10px] text-fg-muted">
                      +{letter.extraExamples.map((e) => e.word).join(', ')}
                    </span>
                  )}
                  {letter.mnemonic && (
                    <span className="text-center text-[10px] italic text-fg-muted">{letter.mnemonic}</span>
                  )}
                  {letter.confusables && (
                    <span className="text-[10px] font-bold text-red-500">
                      ⚠ vs {letter.confusables.join(', ')}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
