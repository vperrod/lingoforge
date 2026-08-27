// @vitest-environment jsdom
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'

vi.mock('../audio/tts', () => ({ speak: vi.fn(), stopSpeaking: vi.fn() }))

import { ListeningExercise } from './ListeningExercise'

afterEach(cleanup)

const renderExercise = (onAnswer = vi.fn()) => {
  render(
    <ListeningExercise
      ttsText="кот"
      ttsLang="ru-RU"
      options={['cat', 'dog']}
      correctIndex={0}
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

test('picking a wrong option is incorrect and reports the right answer', () => {
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
