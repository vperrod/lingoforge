// @vitest-environment jsdom
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'

vi.mock('../audio/tts', () => ({ speak: vi.fn(), stopSpeaking: vi.fn() }))

import { DialogueExercise } from './DialogueExercise'

afterEach(cleanup)

const lines = [
  { speaker: 'other' as const, line: 'Привет!', translation: 'Hi!' },
  { speaker: 'you' as const, line: 'Привет', translation: 'Hi' },
  { speaker: 'other' as const, line: 'Как дела?', translation: 'How are you?' },
  { speaker: 'you' as const, line: 'Хорошо', translation: 'Good' },
]

const renderExercise = (onAnswer = vi.fn()) => {
  render(<DialogueExercise lines={lines} ttsLang="ru-RU" onAnswer={onAnswer} />)
  return onAnswer
}

const inputs = () => screen.getAllByPlaceholderText('Type your response...') as HTMLInputElement[]

const fill = (values: string[]) => {
  inputs().forEach((input, i) => fireEvent.change(input, { target: { value: values[i] } }))
}

test('every user line right is correct', () => {
  const onAnswer = renderExercise()
  fill([' привет ', 'хорошо'])
  fireEvent.click(screen.getByText('Check'))
  expect(onAnswer).toHaveBeenCalledWith(true, 'Привет / Хорошо')
})

test('one wrong user line makes the whole dialogue incorrect', () => {
  const onAnswer = renderExercise()
  fill(['привет', 'плохо'])
  fireEvent.click(screen.getByText('Check'))
  expect(onAnswer).toHaveBeenCalledWith(false, 'Привет / Хорошо')
})

test('enter on the last line submits', () => {
  const onAnswer = renderExercise()
  fill(['привет', 'хорошо'])
  fireEvent.keyDown(inputs()[1], { key: 'Enter' })
  expect(onAnswer).toHaveBeenCalledWith(true, 'Привет / Хорошо')
})

test('check is disabled until every user line is filled', () => {
  renderExercise()
  fill(['привет', ''])
  expect((screen.getByText('Check') as HTMLButtonElement).disabled).toBe(true)
})
