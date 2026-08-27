// @vitest-environment jsdom
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'

vi.mock('../audio/tts', () => ({ speak: vi.fn(), stopSpeaking: vi.fn() }))

import { SpellExercise } from './SpellExercise'

afterEach(cleanup)

const renderExercise = (props: { shown?: (string | null)[]; tiles?: string[] } = {}) => {
  const onAnswer = vi.fn()
  render(
    <SpellExercise
      prompt="cat"
      answer="кот"
      tiles={props.tiles ?? ['т', 'к', 'о']}
      shown={props.shown}
      ttsLang="ru-RU"
      onAnswer={onAnswer}
    />,
  )
  return onAnswer
}

const bankTile = (letter: string) =>
  screen.getAllByText(letter).find((el) => !(el as HTMLButtonElement).disabled) as HTMLElement

test('spelling the whole word from tiles is correct', () => {
  const onAnswer = renderExercise()
  for (const letter of ['к', 'о', 'т']) fireEvent.click(bankTile(letter))
  fireEvent.click(screen.getByText('Check'))
  expect(onAnswer).toHaveBeenCalledWith(true, 'кот')
})

test('a wrong spelling is incorrect', () => {
  const onAnswer = renderExercise()
  for (const letter of ['т', 'о', 'к']) fireEvent.click(bankTile(letter))
  fireEvent.click(screen.getByText('Check'))
  expect(onAnswer).toHaveBeenCalledWith(false, 'кот')
})

test('backspace removes the last placed letter', () => {
  const onAnswer = renderExercise()
  for (const letter of ['к', 'т']) fireEvent.click(bankTile(letter))
  fireEvent.click(screen.getByLabelText('Delete last letter'))
  for (const letter of ['о', 'т']) fireEvent.click(bankTile(letter))
  fireEvent.click(screen.getByText('Check'))
  expect(onAnswer).toHaveBeenCalledWith(true, 'кот')
})

test('missing-letter mode merges the placed tile with the shown letters', () => {
  const onAnswer = renderExercise({ shown: ['к', null, 'т'], tiles: ['а', 'о'] })
  fireEvent.click(bankTile('о'))
  fireEvent.click(screen.getByText('Check'))
  expect(onAnswer).toHaveBeenCalledWith(true, 'кот')
})

test('missing-letter mode accepts no more tiles than there are blanks', () => {
  const onAnswer = renderExercise({ shown: ['к', null, 'т'], tiles: ['а', 'о'] })
  fireEvent.click(bankTile('о'))
  fireEvent.click(bankTile('а'))
  fireEvent.click(screen.getByText('Check'))
  expect(onAnswer).toHaveBeenCalledWith(true, 'кот')
})
