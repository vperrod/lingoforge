// @vitest-environment jsdom
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'

import { ErrorCorrectionExercise } from './ErrorCorrectionExercise'

afterEach(cleanup)

const renderExercise = (onAnswer = vi.fn()) => {
  render(
    <ErrorCorrectionExercise
      tokens={['я', 'любить', 'кофе']}
      errorIndex={1}
      correctToken="люблю"
      translation="I love coffee"
      onAnswer={onAnswer}
    />,
  )
  return onAnswer
}

test('tapping the wrong word is correct and reports the fix', () => {
  const onAnswer = renderExercise()
  fireEvent.click(screen.getByRole('button', { name: 'любить' }))
  expect(onAnswer).toHaveBeenCalledWith(true, 'люблю')
})

test('tapping a right word is incorrect', () => {
  const onAnswer = renderExercise()
  fireEvent.click(screen.getByRole('button', { name: 'кофе' }))
  expect(onAnswer).toHaveBeenCalledWith(false, 'люблю')
})

test('only the first tap is scored', () => {
  const onAnswer = renderExercise()
  fireEvent.click(screen.getByRole('button', { name: 'кофе' }))
  fireEvent.click(screen.getByRole('button', { name: 'любить' }))
  expect(onAnswer).toHaveBeenCalledTimes(1)
})
