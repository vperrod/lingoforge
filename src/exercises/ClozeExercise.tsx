import { useState } from 'react'
import { ClayButton } from '../ui/ClayButton'
import { isCorrectAnswer } from '../engine/answer-check'

interface Props {
  tokens: string[]
  blankIndex: number
  translation: string
  answer: string
  onAnswer: (correct: boolean, correctAnswer: string) => void
}

export function ClozeExercise({ tokens, blankIndex, translation, answer, onAnswer }: Props) {
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const submit = () => {
    if (submitted || !text.trim()) return
    setSubmitted(true)
    onAnswer(isCorrectAnswer(answer, text), answer)
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-bold text-fg-muted">Fill in the blank</h2>
      <p className="text-fg-muted">{translation}</p>
      <p className="font-display text-2xl font-bold leading-relaxed">
        {tokens.map((token, i) =>
          i === blankIndex ? (
            <input
              key={i}
              autoFocus
              value={text}
              disabled={submitted}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              aria-label="Missing word"
              className="clay mx-1 inline-block w-32 px-2 py-1 text-center text-xl font-semibold focus:outline-none focus-visible:outline-3 focus-visible:outline-primary"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
            />
          ) : (
            <span key={i}>{token} </span>
          ),
        )}
      </p>
      <ClayButton variant="primary" disabled={!text.trim() || submitted} onClick={submit}>
        Check
      </ClayButton>
    </div>
  )
}
