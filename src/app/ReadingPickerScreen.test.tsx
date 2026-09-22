// @vitest-environment jsdom
// ReadingPickerScreen and Layout have no test coverage — a broken reading
// list or nav active-state would silently affect the whole app.
import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { ReadingPickerScreen } from './ReadingPickerScreen'
import { useProgress, emptyProgress } from '../state/progress'
import { useProfiles } from '../state/profiles'
import { readings } from '../content'

const PROFILE_ID = 'test-profile'

function renderPicker() {
  render(
    <MemoryRouter>
      <ReadingPickerScreen />
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

describe('ReadingPickerScreen', () => {
  it('lists every reading text for the active course', () => {
    renderPicker()
    for (const text of readings.ru ?? []) {
      expect(screen.getByText(text.title)).toBeTruthy()
    }
  })

  it('links each reading to its reader route', () => {
    renderPicker()
    const [first] = readings.ru ?? []
    if (!first) return
    const link = screen.getByText(first.title).closest('a')
    expect(link?.getAttribute('href')).toBe(`/read/ru/${first.id}`)
  })

  it('shows an empty-state message when the course has no readings', () => {
    const original = readings.ru
    readings.ru = []
    try {
      renderPicker()
      expect(screen.getByText('No reading yet for this course.')).toBeTruthy()
    } finally {
      readings.ru = original
    }
  })
})
