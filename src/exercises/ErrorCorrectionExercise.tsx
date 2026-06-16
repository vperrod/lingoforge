import { useState } from 'react'

interface Props {
  tokens: string[]
  errorIndex: number
  correctToken: string
  translation: string
  onAnswer: (correct: boolean, correctAnswer: string) => void
}

export function ErrorCorrectionExercise({ tokens, errorIndex, correctToken, translation, onAnswer }: Props) {
  const [picked, setPicked] = useState<number | null>(null)

  const pick = (i: number) => {
    if (picked !== null) return
    setPicked(i)
    onAnswer(i === errorIndex, correctToken)
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-bold text-fg-muted">Tap the wrong word</h2>
      <p className="text-fg-muted">{translation}</p>
      <div className="flex flex-wrap gap-2 font-display text-2xl font-bold">
        {tokens.map((token, i) => {
          let state = ''
          if (picked !== null && i === errorIndex) state = 'border-accent bg-accent-soft'
          else if (picked === i) state = 'border-danger bg-danger-soft'
          return (
            <button
              key={i}
              type="button"
              disabled={picked !== null}
              onClick={() => pick(i)}
              className={`clay clay-press px-2 py-1 ${state}`}
            >
              {token}
            </button>
          )
        })}
      </div>
    </div>
  )
}
