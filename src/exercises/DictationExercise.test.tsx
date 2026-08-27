// @vitest-environment jsdom
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'

vi.mock('../audio/tts', () => ({ speak: vi.fn(), stopSpeaking: vi.fn() }))

import { DictationExercise } from './DictationExercise'

afterEach(cleanup)

const renderExercise = (onAnswer = vi.fn()) => {
  render(
    <DictationExercise
      ttsText="привет"
      ttsLang="ru-RU"
      accept={['привет']}
      answer="привет"
      onAnswer={onAnswer}
    />,
  )
  return onAnswer
}

const input = () => screen.getByLabelText('What you heard') as HTMLInputElement

test('a typed answer is checked tolerantly', () => {
  const onAnswer = renderExercise()
  fireEvent.change(input(), { target: { value: ' Привет ' } })
  fireEvent.click(screen.getByText('Check'))
  expect(onAnswer).toHaveBeenCalledWith(true, 'привет')
})

test('a wrong answer is incorrect', () => {
  const onAnswer = renderExercise()
  fireEvent.change(input(), { target: { value: 'пока' } })
  fireEvent.click(screen.getByText('Check'))
  expect(onAnswer).toHaveBeenCalledWith(false, 'привет')
})

test('enter submits the answer', () => {
  const onAnswer = renderExercise()
  fireEvent.change(input(), { target: { value: 'привет' } })
  fireEvent.keyDown(input(), { key: 'Enter' })
  expect(onAnswer).toHaveBeenCalledWith(true, 'привет')
})

test('an empty answer is not submitted', () => {
  const onAnswer = renderExercise()
  fireEvent.keyDown(input(), { key: 'Enter' })
  expect(onAnswer).not.toHaveBeenCalled()
})

test('a hint reveals the next letter of the answer', () => {
  renderExercise()
  fireEvent.click(screen.getByText('Hint'))
  fireEvent.click(screen.getByText('Hint'))
  expect(input().value).toBe('пр')
})
