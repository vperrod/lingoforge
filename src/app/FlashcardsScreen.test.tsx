// @vitest-environment jsdom
// FlashcardsScreen's rate() owns the deck's XP payout, SRS review and study-minute
// accounting. The last card's result is folded in by hand (`known + (correct ? 1 : 0)`)
// because setKnown has not applied yet when the deck ends — these tests pin that
// arithmetic so a refactor can't silently drop the final card's XP.
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../audio/sfx', () => ({ playFanfare: vi.fn(), playCorrect: vi.fn(), playWrong: vi.fn() }))
vi.mock('../audio/tts', () => ({ speak: vi.fn(), stopSpeaking: vi.fn() }))

import { FlashcardsScreen } from './FlashcardsScreen'
import { useProgress, emptyProgress } from '../state/progress'

// Unit 1 of the Russian course has 18 cards; a constant random keeps the shuffle
// comparator at 0 so the deck stays in vocab order (first card = "privet").
const DECK_SIZE = 18

function startFirstDeck() {
  render(<FlashcardsScreen />)
  fireEvent.click(screen.getByText('Survival patterns'))
}

function rateAll(correct: boolean, lastCorrect = correct) {
  for (let i = 0; i < DECK_SIZE - 1; i++) fireEvent.click(screen.getByText(correct ? 'Know it' : 'Again'))
  fireEvent.click(screen.getByText(lastCorrect ? 'Know it' : 'Again'))
}

beforeEach(() => {
  vi.spyOn(Math, 'random').mockReturnValue(0.5)
  useProgress.setState({ profileId: 'test-profile', data: emptyProgress('ru'), storageError: false })
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  useProgress.setState({ profileId: null, data: emptyProgress(), storageError: false })
})

describe('FlashcardsScreen', () => {
  it('lists each unit with its card count in the deck picker', () => {
    render(<FlashcardsScreen />)
    expect(screen.getAllByText(String(DECK_SIZE)).length).toBeGreaterThan(0)
  })

  it('starting a deck shows the first card of the unit', () => {
    startFirstDeck()
    expect(screen.getByText(`1 / ${DECK_SIZE}`)).toBeTruthy()
  })

  it('rating a card advances to the next one', () => {
    startFirstDeck()
    fireEvent.click(screen.getByText('Know it'))
    expect(screen.getByText(`2 / ${DECK_SIZE}`)).toBeTruthy()
  })

  it('rating a card records an SRS review for that word', () => {
    startFirstDeck()
    fireEvent.click(screen.getByText('Know it'))
    // newSrsItem starts at 1 rep; a review increments it
    expect(useProgress.getState().data.courses.ru!.srsItems.privet.reps).toBe(2)
  })

  it('a missed card still gets an SRS review, just marked incorrect', () => {
    startFirstDeck()
    fireEvent.click(screen.getByText('Again'))
    expect(useProgress.getState().data.courses.ru!.srsItems.privet.lapses).toBe(1)
  })

  it('pays 2 xp per known card, counting the final card rated correct', () => {
    startFirstDeck()
    rateAll(true)
    expect(useProgress.getState().data.xp).toBe(DECK_SIZE * 2)
  })

  it('does not pay xp for the final card when it is missed', () => {
    startFirstDeck()
    rateAll(true, false)
    expect(useProgress.getState().data.xp).toBe((DECK_SIZE - 1) * 2)
  })

  it('pays no xp when every card was missed', () => {
    startFirstDeck()
    rateAll(false)
    expect(useProgress.getState().data.xp).toBe(0)
  })

  it('shows the known tally on the done screen', () => {
    startFirstDeck()
    rateAll(true, false)
    expect(screen.getByText(`Deck done! ${DECK_SIZE - 1}/${DECK_SIZE} known`)).toBeTruthy()
  })

  it("logs about a fifth of a minute per card to today's study time", () => {
    startFirstDeck()
    rateAll(true)
    const today = Object.values(useProgress.getState().data.dailyLog)[0]
    expect(today.minutes).toBe(Math.round(DECK_SIZE * 0.2))
  })
})
