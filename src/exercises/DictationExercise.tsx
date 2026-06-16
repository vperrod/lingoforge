import { useEffect, useState } from 'react'
import { Volume2 } from 'lucide-react'
import { speak } from '../audio/tts'
import { ClayButton } from '../ui/ClayButton'
import { matchesAny } from '../engine/answer-check'

interface Props {
  ttsText: string
  ttsLang: string
  accept: string[]
  answer: string
  onAnswer: (correct: boolean, correctAnswer: string) => void
}

export function DictationExercise({ ttsText, ttsLang, accept, answer, onAnswer }: Props) {
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    speak(ttsText, ttsLang)
  }, [ttsText, ttsLang])

  const submit = () => {
    if (submitted || !text.trim()) return
    setSubmitted(true)
    onAnswer(matchesAny(accept, text), answer)
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-bold text-fg-muted">Type what you hear</h2>
      <button
        type="button"
        aria-label="Replay audio"
        className="clay clay-press mx-auto flex size-24 items-center justify-center bg-primary text-on-primary"
        onClick={() => speak(ttsText, ttsLang)}
      >
        <Volume2 className="size-10" aria-hidden />
      </button>
      <label className="flex flex-col gap-2">
        <span className="sr-only">What you heard</span>
        <input
          autoFocus
          value={text}
          disabled={submitted}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          className="clay min-h-14 px-4 text-xl font-semibold focus:outline-none focus-visible:outline-3 focus-visible:outline-primary"
          placeholder="Type here…"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </label>
      <ClayButton variant="primary" disabled={!text.trim() || submitted} onClick={submit}>
        Check
      </ClayButton>
    </div>
  )
}
