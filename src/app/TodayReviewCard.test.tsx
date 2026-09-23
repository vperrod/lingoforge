// @vitest-environment jsdom
import type { ReactElement } from 'react'
import { render as rtlRender, screen, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { TodayReviewCard } from './TodayReviewCard'
import { useProgress, emptyProgress } from '../state/progress'
import { newSrsItem } from '../engine/srs'

vi.mock('../ui/SpeakerButton', () => ({ SpeakerButton: () => null }))

const render = (ui: ReactElement) => rtlRender(<MemoryRouter>{ui}</MemoryRouter>)

const dueItem = (vocabId: string, overrides: Partial<ReturnType<typeof newSrsItem>> = {}) => ({
  ...newSrsItem(vocabId),
  dueAt: Date.now() - 1000,
  ...overrides,
})

beforeEach(() => {
  const data = emptyProgress('ru')
  data.courses.ru = { lessonCompletions: {}, srsItems: { privet: dueItem('privet') } }
  useProgress.setState({ profileId: 'test-profile', data, storageError: false })
})

afterEach(() => {
  cleanup()
  useProgress.setState({ profileId: null, data: emptyProgress(), storageError: false })
})

describe('TodayReviewCard', () => {
  it('renders nothing when activeCourse is not ru', () => {
    const data = emptyProgress('es')
    data.courses.ru = { lessonCompletions: {}, srsItems: { privet: dueItem('privet') } }
    useProgress.setState({ profileId: 'test-profile', data, storageError: false })

    const { container } = render(<TodayReviewCard />)
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing when ru course has no srsItems', () => {
    const data = emptyProgress('ru')
    data.courses.ru = { lessonCompletions: {}, srsItems: {} }
    useProgress.setState({ profileId: 'test-profile', data, storageError: false })

    const { container } = render(<TodayReviewCard />)
    expect(container.firstChild).toBeNull()
  })

  it('shows "Nothing due right now" when items are not yet due', () => {
    const data = emptyProgress('ru')
    data.courses.ru = {
      lessonCompletions: {},
      srsItems: { privet: { ...newSrsItem('privet'), dueAt: Date.now() + 60000 } },
    }
    useProgress.setState({ profileId: 'test-profile', data, storageError: false })

    render(<TodayReviewCard />)
    expect(screen.getByText('Nothing due right now')).toBeTruthy()
  })

  it('pluralizes due count correctly for one item', () => {
    const data = emptyProgress('ru')
    data.courses.ru = { lessonCompletions: {}, srsItems: { privet: dueItem('privet') } }
    useProgress.setState({ profileId: 'test-profile', data, storageError: false })

    render(<TodayReviewCard />)
    expect(screen.getByText(/1 word due/)).toBeTruthy()
  })

  it('pluralizes due count correctly for multiple items', () => {
    const data = emptyProgress('ru')
    data.courses.ru = {
      lessonCompletions: {},
      srsItems: {
        privet: dueItem('privet'),
        ya: dueItem('ya'),
      },
    }
    useProgress.setState({ profileId: 'test-profile', data, storageError: false })

    render(<TodayReviewCard />)
    expect(screen.getByText(/2 words due/)).toBeTruthy()
  })

  it('shows "coming back" badge when due items have lapses > 0', () => {
    const data = emptyProgress('ru')
    data.courses.ru = {
      lessonCompletions: {},
      srsItems: {
        privet: dueItem('privet', { lapses: 1 }),
        ya: dueItem('ya'),
      },
    }
    useProgress.setState({ profileId: 'test-profile', data, storageError: false })

    render(<TodayReviewCard />)
    expect(screen.getByText('1 coming back')).toBeTruthy()
  })

  it('hides "coming back" badge when all due items have lapses 0', () => {
    const data = emptyProgress('ru')
    data.courses.ru = {
      lessonCompletions: {},
      srsItems: {
        privet: dueItem('privet'),
        ya: dueItem('ya'),
      },
    }
    useProgress.setState({ profileId: 'test-profile', data, storageError: false })

    render(<TodayReviewCard />)
    expect(screen.queryByText('coming back')).toBeNull()
  })

  it('shows "Say these today" with phrase text when vocabId is privet', () => {
    const data = emptyProgress('ru')
    data.courses.ru = { lessonCompletions: {}, srsItems: { privet: dueItem('privet') } }
    useProgress.setState({ profileId: 'test-profile', data, storageError: false })

    render(<TodayReviewCard />)
    expect(screen.getByText('Say these today')).toBeTruthy()
    expect(screen.getByText('Привет')).toBeTruthy()
  })

  it('omits "Say these today" when only vocabId is ya (no phrasebook match)', () => {
    const data = emptyProgress('ru')
    data.courses.ru = { lessonCompletions: {}, srsItems: { ya: dueItem('ya') } }
    useProgress.setState({ profileId: 'test-profile', data, storageError: false })

    render(<TodayReviewCard />)
    expect(screen.queryByText('Say these today')).toBeNull()
  })

  it('renders non-default dailyGoalMinutes value in copy', () => {
    const data = emptyProgress('ru')
    data.courses.ru = { lessonCompletions: {}, srsItems: { privet: dueItem('privet') } }
    data.dailyGoalMinutes = 25
    useProgress.setState({ profileId: 'test-profile', data, storageError: false })

    render(<TodayReviewCard />)
    expect(screen.getByText(/25-minute goal/)).toBeTruthy()
  })
})
