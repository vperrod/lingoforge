// @vitest-environment jsdom
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'

import { ClozeExercise } from './ClozeExercise'

afterEach(cleanup)

const renderExercise = (options?: string[]) => {
  const onAnswer = vi.fn()
  render(
    <ClozeExercise
      tokens={['я', 'люблю', 'кофе']}
      blankIndex={1}
      translation="I love coffee"
      answer="люблю"
      options={options}
      ttsLang="ru-RU"
      onAnswer={onAnswer}
    />,
  )
  return onAnswer
}

test('picking the right chip is correct', () => {
  const onAnswer = renderExercise(['люблю', 'хочу'])
  fireEvent.click(screen.getByRole('button', { name: 'люблю' }))
  expect(onAnswer).toHaveBeenCalledWith(true, 'люблю')
})

test('picking a wrong chip is incorrect', () => {
  const onAnswer = renderExercise(['люблю', 'хочу'])
  fireEvent.click(screen.getByRole('button', { name: 'хочу' }))
  expect(onAnswer).toHaveBeenCalledWith(false, 'люблю')
})

test('only one chip pick is scored', () => {
  const onAnswer = renderExercise(['люблю', 'хочу'])
  fireEvent.click(screen.getByRole('button', { name: 'хочу' }))
  fireEvent.click(screen.getByRole('button', { name: 'люблю' }))
  expect(onAnswer).toHaveBeenCalledTimes(1)
})

test('a typed answer is checked tolerantly', () => {
  const onAnswer = renderExercise()
  fireEvent.change(screen.getByLabelText('Missing word'), { target: { value: ' Люблю ' } })
  fireEvent.click(screen.getByText('Check'))
  expect(onAnswer).toHaveBeenCalledWith(true, 'люблю')
})

test('a hint reveals the next letter of the answer', () => {
  renderExercise()
  fireEvent.click(screen.getByText('Hint'))
  fireEvent.click(screen.getByText('Hint'))
  expect((screen.getByLabelText('Missing word') as HTMLInputElement).value).toBe('лю')
})
