// @vitest-environment jsdom
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'

import { WordBankExercise } from './WordBankExercise'

afterEach(cleanup)

const renderExercise = (onAnswer = vi.fn()) => {
  render(
    <WordBankExercise
      sentence="я люблю кофе"
      translation="I love coffee"
      answerChips={['я', 'люблю', 'кофе']}
      distractorChips={['чай']}
      ttsLang="ru-RU"
      onAnswer={onAnswer}
    />,
  )
  return onAnswer
}

const bankChip = (word: string) =>
  screen.getAllByText(word).find((el) => !(el as HTMLButtonElement).disabled) as HTMLElement

test('placing chips in the right order is correct', () => {
  const onAnswer = renderExercise()
  fireEvent.click(bankChip('я'))
  fireEvent.click(bankChip('люблю'))
  fireEvent.click(bankChip('кофе'))
  fireEvent.click(screen.getByText('Check'))
  expect(onAnswer).toHaveBeenCalledWith(true, 'я люблю кофе')
})

test('placing chips in the wrong order is incorrect', () => {
  const onAnswer = renderExercise()
  fireEvent.click(bankChip('кофе'))
  fireEvent.click(bankChip('люблю'))
  fireEvent.click(bankChip('я'))
  fireEvent.click(screen.getByText('Check'))
  expect(onAnswer).toHaveBeenCalledWith(false, 'я люблю кофе')
})

test('tapping a placed chip returns it to the bank', () => {
  const onAnswer = renderExercise()
  fireEvent.click(bankChip('чай'))
  fireEvent.click(screen.getAllByText('чай')[0])
  fireEvent.click(bankChip('я'))
  fireEvent.click(bankChip('люблю'))
  fireEvent.click(bankChip('кофе'))
  fireEvent.click(screen.getByText('Check'))
  expect(onAnswer).toHaveBeenCalledWith(true, 'я люблю кофе')
})

test('check is disabled until a chip is placed', () => {
  renderExercise()
  expect((screen.getByText('Check').closest('button') as HTMLButtonElement).disabled).toBe(true)
})
