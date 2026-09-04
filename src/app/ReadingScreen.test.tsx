// @vitest-environment jsdom
// ReadingScreen's checkAnswers() awards 5 XP per comprehension question whose picked
// option index matches `correctIndex`. Options are displayed in a seeded permutation
// (optionOrder), so these tests click by option *text* and pin that the XP follows
// the content's correctIndex, not the on-screen position.
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../audio/tts', () => ({ speak: vi.fn(), stopSpeaking: vi.fn() }))

import { ReadingScreen } from './ReadingScreen'
import { useProgress, emptyProgress } from '../state/progress'

// ru-dlg-cafe has two questions; the correct options are 'Coffee and bread' and 'До свидания'.
function renderCafe() {
  render(
    <MemoryRouter initialEntries={['/read/ru/ru-dlg-cafe']}>
      <Routes>
        <Route path="/read/:courseId/:textId" element={<ReadingScreen />} />
      </Routes>
    </MemoryRouter>,
  )
}

function checkButton() {
  return screen.getByText('Check answers')
}

beforeEach(() => {
  useProgress.setState({ profileId: 'test-profile', data: emptyProgress('ru'), storageError: false })
})

afterEach(() => {
  cleanup()
  useProgress.setState({ profileId: null, data: emptyProgress(), storageError: false })
})

describe('ReadingScreen comprehension scoring', () => {
  it('disables Check answers until every question is answered', () => {
    renderCafe()
    fireEvent.click(screen.getByText('Coffee and bread'))
    expect((checkButton() as HTMLButtonElement).disabled).toBe(true)
  })

  it('awards 5 xp per correct answer when both are right', () => {
    renderCafe()
    fireEvent.click(screen.getByText('Coffee and bread'))
    fireEvent.click(screen.getByText('До свидания'))
    fireEvent.click(checkButton())
    expect(useProgress.getState().data.xp).toBe(10)
  })

  it('awards xp only for the correct answer when one is wrong', () => {
    renderCafe()
    fireEvent.click(screen.getByText('Tea and cheese'))
    fireEvent.click(screen.getByText('До свидания'))
    fireEvent.click(checkButton())
    expect(useProgress.getState().data.xp).toBe(5)
  })

  it('awards no xp when every answer is wrong', () => {
    renderCafe()
    fireEvent.click(screen.getByText('Water'))
    fireEvent.click(screen.getByText('Привет'))
    fireEvent.click(checkButton())
    expect(useProgress.getState().data.xp).toBe(0)
  })

  it('shows the score and xp summary after checking', () => {
    renderCafe()
    fireEvent.click(screen.getByText('Coffee and bread'))
    fireEvent.click(screen.getByText('Привет'))
    fireEvent.click(checkButton())
    expect(screen.getByText('1 / 2 correct · +5 XP')).toBeTruthy()
  })

  it('locks the options after checking so xp cannot be re-earned', () => {
    renderCafe()
    fireEvent.click(screen.getByText('Coffee and bread'))
    fireEvent.click(screen.getByText('До свидания'))
    fireEvent.click(checkButton())
    expect((screen.getByText('Water') as HTMLButtonElement).disabled).toBe(true)
  })
})
