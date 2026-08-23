// @vitest-environment jsdom
// PlacementScreen scores a quiz into a starting SRS/stage placement — a wrong first
// impression here silently strands a new user at the wrong difficulty. Exercise-kind
// rendering is covered elsewhere, so renderExercise is mocked to drive the answer
// queue and isolate PlacementScreen's own scoring/navigation wiring.
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../audio/sfx', () => ({ playFanfare: vi.fn(), playCorrect: vi.fn(), playWrong: vi.fn() }))
vi.mock('../exercises/render', () => ({
  renderExercise: (
    _exercise: unknown,
    _ttsLang: string,
    onAnswer: (correct: boolean, correctAnswer: string) => void,
  ) => (
    <button type="button" onClick={() => onAnswer(true, 'right answer')}>
      right
    </button>
  ),
}))

import { PlacementScreen } from './PlacementScreen'
import { useProgress, emptyProgress } from '../state/progress'

function renderPlacement() {
  render(
    <MemoryRouter initialEntries={['/placement/ru']}>
      <Routes>
        <Route path="/placement/:courseId" element={<PlacementScreen />} />
      </Routes>
    </MemoryRouter>,
  )
}

// a wrong answer re-queues the card (LessonPlayer's retry pattern), so only an
// all-correct run is guaranteed to terminate deterministically here
function finishQuizAllCorrect() {
  while (screen.queryByText(/Estimated level|Starting from the basics/) === null) {
    fireEvent.click(screen.getByText('right'))
    fireEvent.click(screen.getByText('Continue'))
  }
}

beforeEach(() => {
  useProgress.setState({ profileId: 'test-profile', data: emptyProgress('ru'), storageError: false })
})

afterEach(() => {
  cleanup()
  useProgress.setState({ profileId: null, data: emptyProgress(), storageError: false })
})

describe('PlacementScreen', () => {
  it('skips a new user ahead and marks earlier units complete when every answer is right', () => {
    renderPlacement()
    finishQuizAllCorrect()
    expect(screen.getByText(/Estimated level:/)).toBeTruthy()
    expect(useProgress.getState().data.courses.ru?.lessonCompletions.u1s1l1).toBe(1)
  })
})
