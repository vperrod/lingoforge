// @vitest-environment jsdom
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'

import { ChoiceExercise } from './ChoiceExercise'

afterEach(cleanup)

const renderExercise = (onAnswer = vi.fn()) => {
  render(
    <ChoiceExercise
      prompt="кот"
      ttsLang="ru-RU"
      options={['dog', 'cat']}
      correctIndex={1}
      title="Pick the translation"
      onAnswer={onAnswer}
    />,
  )
  return onAnswer
}

test('picking the right option is correct', () => {
  const onAnswer = renderExercise()
  fireEvent.click(screen.getByRole('button', { name: 'cat' }))
  expect(onAnswer).toHaveBeenCalledWith(true, 'cat')
})

test('picking a wrong option is incorrect', () => {
  const onAnswer = renderExercise()
  fireEvent.click(screen.getByRole('button', { name: 'dog' }))
  expect(onAnswer).toHaveBeenCalledWith(false, 'cat')
})

test('only the first pick is scored', () => {
  const onAnswer = renderExercise()
  fireEvent.click(screen.getByRole('button', { name: 'dog' }))
  fireEvent.click(screen.getByRole('button', { name: 'cat' }))
  expect(onAnswer).toHaveBeenCalledTimes(1)
})
