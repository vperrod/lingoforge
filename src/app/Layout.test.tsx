// @vitest-environment jsdom
// Layout wires the main nav used by every route — a broken active-state or a
// tab that fails to hide/show per course would silently affect the whole app.
import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { Layout } from './Layout'
import { useProgress, emptyProgress, todayKey } from '../state/progress'
import { useProfiles } from '../state/profiles'

const PROFILE_ID = 'test-profile'

function renderLayout() {
  render(
    <MemoryRouter initialEntries={['/review']}>
      <Layout />
    </MemoryRouter>,
  )
}

beforeEach(() => {
  useProfiles.setState({
    profiles: [{ id: PROFILE_ID, name: 'Fox', avatar: '🦊', courses: ['ru'], createdAt: 0 }],
    activeProfileId: PROFILE_ID,
  })
  useProgress.setState({ profileId: PROFILE_ID, data: emptyProgress('ru'), storageError: false })
})

afterEach(() => {
  cleanup()
  useProfiles.setState({ profiles: [], activeProfileId: null })
  useProgress.setState({ profileId: null, data: emptyProgress(), storageError: false })
})

describe('Layout', () => {
  it('shows the active profile name', () => {
    renderLayout()
    expect(screen.getByText('Fox')).toBeTruthy()
  })

  it('shows the Alphabet tab only for the ru course', () => {
    renderLayout()
    expect(screen.getByText('Alphabet')).toBeTruthy()
  })

  it('hides the Alphabet tab for a non-ru course', () => {
    const data = emptyProgress('es')
    useProgress.setState({ profileId: PROFILE_ID, data, storageError: false })

    renderLayout()
    expect(screen.queryByText('Alphabet')).toBeNull()
  })

  it('marks the nav link matching the current route as active', () => {
    renderLayout()
    const practiceLink = screen.getByText('Practice').closest('a')
    expect(practiceLink?.className).toContain('text-primary')
  })

  it("shows today's logged minutes in the goal ring", () => {
    const data = emptyProgress('ru')
    data.dailyLog[todayKey()] = { minutes: 7, xp: 0, lessons: 0 }
    useProgress.setState({ profileId: PROFILE_ID, data, storageError: false })

    renderLayout()
    expect(screen.getByText('7m')).toBeTruthy()
  })
})
