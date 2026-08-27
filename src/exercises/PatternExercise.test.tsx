// @vitest-environment jsdom
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'

import { PatternExercise } from './PatternExercise'

afterEach(cleanup)

const renderExercise = (onAnswer = vi.fn()) => {
  render(
    <PatternExercise
      frame="Я ___ кофе"
      frameTranslation="I ___ coffee"
      slotTranslation="love"
      options={['хочу', 'люблю']}
      correctIndex={1}
      onAnswer={onAnswer}
    />,
  )
  return onAnswer
}

test('picking the right option is correct', () => {
  const onAnswer = renderExercise()
  fireEvent.click(screen.getByRole('button', { name: 'люблю' }))
  expect(onAnswer).toHaveBeenCalledWith(true, 'люблю')
})

test('picking a wrong option is incorrect', () => {
  const onAnswer = renderExercise()
  fireEvent.click(screen.getByRole('button', { name: 'хочу' }))
  expect(onAnswer).toHaveBeenCalledWith(false, 'люблю')
})

test('the picked word fills the slot in the frame', () => {
  renderExercise()
  fireEvent.click(screen.getByRole('button', { name: 'хочу' }))
  expect(screen.getByText('Я хочу кофе')).toBeTruthy()
})

test('only the first pick is scored', () => {
  const onAnswer = renderExercise()
  fireEvent.click(screen.getByRole('button', { name: 'хочу' }))
  fireEvent.click(screen.getByRole('button', { name: 'люблю' }))
  expect(onAnswer).toHaveBeenCalledTimes(1)
})
