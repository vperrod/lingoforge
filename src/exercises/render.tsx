import type { ExerciseInstance } from '../engine/exercise-gen'
import { ChoiceExercise } from './ChoiceExercise'
import { WordBankExercise } from './WordBankExercise'
import { ListeningExercise } from './ListeningExercise'
import { TypingExercise } from './TypingExercise'
import { MatchingExercise } from './MatchingExercise'
import { PatternExercise } from './PatternExercise'

export function renderExercise(
  exercise: ExerciseInstance,
  ttsLang: string,
  onAnswer: (correct: boolean, correctAnswer: string) => void,
) {
  switch (exercise.kind) {
    case 'choice':
      return (
        <ChoiceExercise
          title={exercise.ttsText ? 'What does this mean?' : 'Pick the translation'}
          prompt={exercise.prompt}
          ttsText={exercise.ttsText}
          ttsLang={ttsLang}
          options={exercise.options}
          correctIndex={exercise.correctIndex}
          onAnswer={onAnswer}
        />
      )
    case 'wordBank':
      return (
        <WordBankExercise
          sentence={exercise.sentence}
          translation={exercise.translation}
          answerChips={exercise.answerChips}
          distractorChips={exercise.distractorChips}
          ttsLang={ttsLang}
          onAnswer={onAnswer}
        />
      )
    case 'listening':
      return (
        <ListeningExercise
          ttsText={exercise.ttsText}
          ttsLang={ttsLang}
          options={exercise.options}
          correctIndex={exercise.correctIndex}
          onAnswer={onAnswer}
        />
      )
    case 'typing':
      return (
        <TypingExercise
          prompt={exercise.prompt}
          accept={exercise.accept}
          answer={exercise.answer}
          onAnswer={onAnswer}
        />
      )
    case 'matching':
      return <MatchingExercise pairs={exercise.pairs} onAnswer={onAnswer} />
    case 'pattern':
      return (
        <PatternExercise
          frame={exercise.frame}
          frameTranslation={exercise.frameTranslation}
          slotTranslation={exercise.slotTranslation}
          options={exercise.options}
          correctIndex={exercise.correctIndex}
          onAnswer={onAnswer}
        />
      )
  }
}
