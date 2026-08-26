// @vitest-environment jsdom
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'

import { MatchingExercise } from './MatchingExercise'

afterEach(cleanup)

const pairs = [
  { left: 'cat', right: 'кот', vocabId: 'cat' },
  { left: 'dog', right: 'собака', vocabId: 'dog' },
]

const match = (left: string, right: string) => {
  fireEvent.click(screen.getByText(left))
  fireEvent.click(screen.getByText(right))
}

test('matching every pair without a miss reports correct', () => {
  const onAnswer = vi.fn()
  render(<MatchingExercise pairs={pairs} onAnswer={onAnswer} />)
  match('cat', 'кот')
  match('dog', 'собака')
  expect(onAnswer).toHaveBeenCalledWith(true, 'all matched, but with 0 misses')
})

test('a wrong pick counts as a mistake and marks the answer incorrect', () => {
  const onAnswer = vi.fn()
  render(<MatchingExercise pairs={pairs} onAnswer={onAnswer} />)
  match('cat', 'собака')
  match('cat', 'кот')
  match('dog', 'собака')
  expect(onAnswer).toHaveBeenCalledWith(false, 'all matched, but with 1 miss')
})

test('nothing is reported until every pair is matched', () => {
  const onAnswer = vi.fn()
  render(<MatchingExercise pairs={pairs} onAnswer={onAnswer} />)
  match('cat', 'кот')
  expect(onAnswer).not.toHaveBeenCalled()
})
