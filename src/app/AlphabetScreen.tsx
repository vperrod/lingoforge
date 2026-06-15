import { useState } from 'react'
import { Volume2, Play, Check } from 'lucide-react'
import { ruAlphabet } from '../content'
import { courses } from '../content'
import type { AlphabetGroup } from '../content/types'
import type { ExerciseInstance } from '../engine/exercise-gen'
import { LessonPlayer, type LessonResult } from '../exercises/LessonPlayer'
import { renderExercise } from '../exercises/render'
import { speak } from '../audio/tts'
import { useProgress } from '../state/progress'
import { ClayButton } from '../ui/ClayButton'
import { playFanfare } from '../audio/sfx'

const TTS_LANG = 'ru-RU'

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function groupDrill(group: AlphabetGroup): ExerciseInstance[] {
  const exercises: ExerciseInstance[] = []
  for (const letter of group.letters) {
    const others = shuffle(group.letters.filter((l) => l.letter !== letter.letter)).slice(0, 3)
    // letter → sound
    const soundOptions = shuffle([letter.sound, ...others.map((o) => o.sound)])
    exercises.push({
      kind: 'choice',
      prompt: `${letter.letter} ${letter.lower}`,
      ttsText: letter.lower,
      options: soundOptions,
      correctIndex: soundOptions.indexOf(letter.sound),
      vocabIds: [`alpha:${letter.letter}`],
    })
    // hear → letter
    const letterOptions = shuffle([letter.letter, ...others.map((o) => o.letter)])
    exercises.push({
      kind: 'listening',
      ttsText: letter.example.word,
      options: shuffle([letter.example.word, ...others.map((o) => o.example.word)]),
      correctIndex: 0,
      vocabIds: [`alpha:${letter.letter}`],
    })
    void letterOptions
  }
  // listening options need recompute of correctIndex (shuffled above) — fix below
  return shuffle(
    exercises.map((ex) =>
      ex.kind === 'listening'
        ? { ...ex, correctIndex: ex.options.indexOf(ex.ttsText) }
        : ex,
    ),
  ).slice(0, 12)
}

export function AlphabetScreen() {
  const data = useProgress((s) => s.data)
  const { addXp, addStudyMinutes, completeLesson, earnBadge } = useProgress()
  const [drillGroup, setDrillGroup] = useState<AlphabetGroup | null>(null)
  const [done, setDone] = useState(false)

  const completions = data.courses.ru?.lessonCompletions ?? {}

  if (drillGroup) {
    const handleComplete = (r: LessonResult) => {
      completeLesson('ru', `alpha-${drillGroup.id}`, [])
      addXp(r.xp)
      addStudyMinutes(r.minutes)
      const fresh = useProgress.getState().data
      const allGroupsDone = ruAlphabet.groups.every(
        (g) => fresh.courses.ru?.lessonCompletions[`alpha-${g.id}`],
      )
      if (allGroupsDone) earnBadge('alphabet-master')
      playFanfare()
      setDone(true)
    }

    if (done) {
      return (
        <div className="flex flex-col items-center gap-6 py-12">
          <h2 className="font-display text-3xl font-bold text-primary">Отлично! Great job!</h2>
          <ClayButton variant="primary" onClick={() => { setDrillGroup(null); setDone(false) }}>
            Back to alphabet
          </ClayButton>
        </div>
      )
    }

    return (
      <LessonPlayer
        exercises={groupDrill(drillGroup)}
        ttsLang={TTS_LANG}
        renderExercise={(ex, onAnswer) => renderExercise(ex, TTS_LANG, onAnswer)}
        onComplete={handleComplete}
        onExit={() => setDrillGroup(null)}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-3xl font-bold">{courses.ru.flag} Cyrillic alphabet</h1>
        <p className="text-fg-muted">
          33 letters in 4 smart groups. Tap any letter to hear it. Russian is phonetic — master these and you can read everything.
        </p>
      </header>

      {ruAlphabet.groups.map((group) => {
        const groupDone = Boolean(completions[`alpha-${group.id}`])
        return (
          <section key={group.id} className="clay flex flex-col gap-4 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="flex items-center gap-2 font-display text-xl font-bold">
                  {group.title}
                  {groupDone && <Check className="size-5 text-accent" aria-label="Completed" />}
                </h2>
                <p className="text-sm text-fg-muted">{group.description}</p>
              </div>
              <ClayButton variant={groupDone ? 'neutral' : 'primary'} onClick={() => setDrillGroup(group)} className="shrink-0">
                <span className="flex items-center gap-1.5">
                  <Play className="size-4" aria-hidden /> Drill
                </span>
              </ClayButton>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {group.letters.map((letter) => (
                <button
                  key={letter.letter}
                  type="button"
                  onClick={async () => { await speak(letter.lower, TTS_LANG); await speak(letter.example.word, TTS_LANG) }}
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
                  {letter.mnemonic && (
                    <span className="text-center text-[11px] italic text-fg-muted">{letter.mnemonic}</span>
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
