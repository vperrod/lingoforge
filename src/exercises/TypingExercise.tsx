import { useState } from 'react'
import { ClayButton } from '../ui/ClayButton'
import { matchesAny } from '../engine/answer-check'

interface Props {
  prompt: string
  accept: string[]
  answer: string
  onAnswer: (correct: boolean, correctAnswer: string) => void
}

export function TypingExercise({ prompt, accept, answer, onAnswer }: Props) {
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const submit = () => {
    if (submitted || !text.trim()) return
    setSubmitted(true)
    onAnswer(matchesAny(accept, text), answer)
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-bold text-fg-muted">Type the translation</h2>
      <p className="font-display text-3xl font-bold">{prompt}</p>
      <label className="flex flex-col gap-2">
        <span className="sr-only">Your translation</span>
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
