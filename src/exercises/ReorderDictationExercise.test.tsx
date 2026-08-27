// @vitest-environment jsdom
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'

vi.mock('../audio/tts', () => ({ speak: vi.fn(), stopSpeaking: vi.fn() }))

import { ReorderDictationExercise } from './ReorderDictationExercise'

afterEach(cleanup)

const renderExercise = (onAnswer = vi.fn()) => {
  render(
    <ReorderDictationExercise
      sentence="я люблю кофе"
      ttsLang="ru-RU"
      answerChips={['я', 'люблю', 'кофе']}
      distractorChips={['чай']}
      onAnswer={onAnswer}
    />,
  )
  return onAnswer
}

const bankChip = (word: string) =>
  screen.getAllByText(word).find((el) => !(el as HTMLButtonElement).disabled) as HTMLElement

test('placing the chips in order is correct', () => {
  const onAnswer = renderExercise()
  for (const word of ['я', 'люблю', 'кофе']) fireEvent.click(bankChip(word))
  fireEvent.click(screen.getByText('Check'))
  expect(onAnswer).toHaveBeenCalledWith(true, 'я люблю кофе')
})

test('a wrong order is incorrect', () => {
  const onAnswer = renderExercise()
  for (const word of ['кофе', 'люблю', 'я']) fireEvent.click(bankChip(word))
  fireEvent.click(screen.getByText('Check'))
  expect(onAnswer).toHaveBeenCalledWith(false, 'я люблю кофе')
})

test('tapping a placed chip returns it to the bank', () => {
  const onAnswer = renderExercise()
  fireEvent.click(bankChip('чай'))
  fireEvent.click(screen.getAllByText('чай')[0])
  for (const word of ['я', 'люблю', 'кофе']) fireEvent.click(bankChip(word))
  fireEvent.click(screen.getByText('Check'))
  expect(onAnswer).toHaveBeenCalledWith(true, 'я люблю кофе')
})

test('check is disabled until a chip is placed', () => {
  renderExercise()
  expect((screen.getByText('Check') as HTMLButtonElement).disabled).toBe(true)
})
