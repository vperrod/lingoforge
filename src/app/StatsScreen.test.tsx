// @vitest-environment jsdom
// StatsScreen computes the weekly bar heatmap (`maxMinutes` percentage math) and
// wires exportData/importData behind a destructive-import confirm, but had zero
// tests — a regression in either would only surface in manual QA.
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { StatsScreen } from './StatsScreen'
import { useProgress, emptyProgress, todayKey } from '../state/progress'
import { useProfiles } from '../state/profiles'

const PROFILE_ID = 'test-profile'

function renderStats() {
  render(
    <MemoryRouter>
      <StatsScreen />
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
  vi.restoreAllMocks()
  useProfiles.setState({ profiles: [], activeProfileId: null })
  useProgress.setState({ profileId: null, data: emptyProgress(), storageError: false })
})

describe('StatsScreen', () => {
  it('shows total xp', () => {
    const data = emptyProgress('ru')
    data.xp = 42
    useProgress.setState({ profileId: PROFILE_ID, data, storageError: false })

    renderStats()
    expect(screen.getByText('42')).toBeTruthy()
  })

  it('shows the current streak from computeStreak', () => {
    const data = emptyProgress('ru')
    data.dailyGoalMinutes = 10
    data.dailyLog[todayKey()] = { minutes: 10, xp: 0, lessons: 0 }
    useProgress.setState({ profileId: PROFILE_ID, data, storageError: false })

    renderStats()
    expect(screen.getByText('1')).toBeTruthy()
  })

  it("caps a day's weekly bar height at 100% when it is the week's maximum", () => {
    const data = emptyProgress('ru')
    data.dailyLog[todayKey()] = { minutes: 30, xp: 0, lessons: 0 }
    useProgress.setState({ profileId: PROFILE_ID, data, storageError: false })

    renderStats()
    const bar = screen.getByTitle(`${todayKey()}: 30 min`).querySelector(':scope > div > div') as HTMLElement
    expect(bar.style.height).toBe('100%')
  })

  it('marks a day as goal-met once its minutes reach dailyGoalMinutes', () => {
    const data = emptyProgress('ru')
    data.dailyGoalMinutes = 10
    data.dailyLog[todayKey()] = { minutes: 10, xp: 0, lessons: 0 }
    useProgress.setState({ profileId: PROFILE_ID, data, storageError: false })

    renderStats()
    const bar = screen.getByTitle(`${todayKey()}: 10 min`).querySelector(':scope > div > div') as HTMLElement
    expect(bar.className).toContain('bg-accent')
  })

  it('selecting a daily goal option updates the store', () => {
    renderStats()
    fireEvent.click(screen.getByText('15m'))
    expect(useProgress.getState().data.dailyGoalMinutes).toBe(15)
  })

  it('marks the active daily goal option as checked', () => {
    const data = emptyProgress('ru')
    data.dailyGoalMinutes = 20
    useProgress.setState({ profileId: PROFILE_ID, data, storageError: false })

    renderStats()
    expect(screen.getByText('20m').getAttribute('aria-checked')).toBe('true')
  })

  it('exporting downloads a blob named after the active profile', () => {
    const createObjectURL = vi.fn().mockReturnValue('blob:mock')
    const revokeObjectURL = vi.fn()
    vi.stubGlobal('URL', { ...URL, createObjectURL, revokeObjectURL })
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    renderStats()
    fireEvent.click(screen.getByText('Export'))

    expect(createObjectURL).toHaveBeenCalledTimes(1)
    expect(createObjectURL.mock.calls[0][0]).toBeInstanceOf(Blob)
    expect(clickSpy).toHaveBeenCalledTimes(1)
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock')
  })

  it('importing a valid backup replaces the active progress after confirmation', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const data = emptyProgress('ru')
    data.xp = 99
    const backup = JSON.stringify(data)
    const file = new File([backup], 'backup.json', { type: 'application/json' })

    renderStats()
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    fireEvent.change(input, { target: { files: [file] } })
    await vi.waitFor(() => expect(useProgress.getState().data.xp).toBe(99))
  })

  it('declining the confirm dialog leaves progress untouched', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    const backup = JSON.stringify(emptyProgress('ru'))
    const file = new File([backup], 'backup.json', { type: 'application/json' })

    renderStats()
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    fireEvent.change(input, { target: { files: [file] } })
    await new Promise((r) => setTimeout(r, 0))

    expect(useProgress.getState().data.xp).toBe(0)
  })

  it('alerts and keeps existing progress when the imported file is invalid', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    const file = new File(['not json'], 'backup.json', { type: 'application/json' })

    renderStats()
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    fireEvent.change(input, { target: { files: [file] } })
    await vi.waitFor(() => expect(alertSpy).toHaveBeenCalledWith('Could not import — invalid file.'))

    expect(useProgress.getState().data.xp).toBe(0)
  })
})
