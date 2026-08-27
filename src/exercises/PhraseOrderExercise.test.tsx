// @vitest-environment jsdom
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'

import { PhraseOrderExercise } from './PhraseOrderExercise'

afterEach(cleanup)

const phrases = [
  { line: 'Привет', translation: 'Hi' },
  { line: 'Как дела?', translation: 'How are you?' },
  { line: 'Хорошо', translation: 'Good' },
]

const renderExercise = (onAnswer = vi.fn()) => {
  render(<PhraseOrderExercise phrases={phrases} onAnswer={onAnswer} />)
  return onAnswer
}

const placeAll = (order: string[]) => {
  for (const line of order) fireEvent.click(screen.getByText(line))
}

test('placing the phrases in conversation order is correct', () => {
  const onAnswer = renderExercise()
  placeAll(['Привет', 'Как дела?', 'Хорошо'])
  fireEvent.click(screen.getByText('Check'))
  expect(onAnswer).toHaveBeenCalledWith(true, 'Привет → Как дела? → Хорошо')
})

test('a wrong order is incorrect', () => {
  const onAnswer = renderExercise()
  placeAll(['Хорошо', 'Как дела?', 'Привет'])
  fireEvent.click(screen.getByText('Check'))
  expect(onAnswer).toHaveBeenCalledWith(false, 'Привет → Как дела? → Хорошо')
})

test('tapping a placed phrase sends it back so it can be re-placed', () => {
  const onAnswer = renderExercise()
  placeAll(['Хорошо'])
  fireEvent.click(screen.getByText('Хорошо'))
  placeAll(['Привет', 'Как дела?', 'Хорошо'])
  fireEvent.click(screen.getByText('Check'))
  expect(onAnswer).toHaveBeenCalledWith(true, 'Привет → Как дела? → Хорошо')
})

test('check is disabled until every phrase is placed', () => {
  renderExercise()
  placeAll(['Привет'])
  expect((screen.getByText('Check') as HTMLButtonElement).disabled).toBe(true)
})
