// @vitest-environment jsdom
// PathScreen renders the whole lesson path — crown levels, the lock/unlock frontier,
// and per-lesson new-letter callouts — and had zero coverage despite being the app's
// main-navigation screen. These tests exercise the unlock-frontier logic in `pathNode`
// directly against the real ru course content.
import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// jsdom has no IntersectionObserver; framer-motion's `whileInView` on each path
// node needs one to mount at all.
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)

import { PathScreen } from './PathScreen'
import { useProfiles } from '../state/profiles'
import { useProgress, emptyProgress } from '../state/progress'

const PROFILE_ID = 'test-profile'

function renderPath() {
  render(
    <MemoryRouter>
      <PathScreen />
    </MemoryRouter>,
  )
}

beforeEach(() => {
  useProfiles.setState({
    profiles: [{ id: PROFILE_ID, name: 'Test', avatar: '🦊', courses: ['ru'], createdAt: 0 }],
    activeProfileId: PROFILE_ID,
  })
  useProgress.setState({ profileId: PROFILE_ID, data: emptyProgress('ru'), storageError: false })
})

afterEach(() => {
  cleanup()
  useProfiles.setState({ profiles: [], activeProfileId: null })
  useProgress.setState({ profileId: null, data: emptyProgress(), storageError: false })
})

describe('PathScreen', () => {
  it('links the first lesson node to the lesson route when nothing is completed', () => {
    renderPath()
    const link = screen.getByText('First words').closest('a')
    expect(link?.getAttribute('href')).toBe('/lesson/ru/u1s1l1')
  })

  it('locks a lesson beyond the unlock frontier', () => {
    renderPath()
    const secondLesson = screen.getByText('Being polite')
    expect(secondLesson.closest('a')).toBeNull()
    expect(secondLesson.closest('[aria-disabled]')).not.toBeNull()
  })

  it('shows the crown level for a completed lesson', () => {
    const data = emptyProgress('ru')
    data.courses.ru = { lessonCompletions: { u1s1l1: 3 }, srsItems: {} }
    useProgress.setState({ profileId: PROFILE_ID, data, storageError: false })

    renderPath()
    expect(screen.getByLabelText('Level 3 of 5')).toBeTruthy()
  })
})
