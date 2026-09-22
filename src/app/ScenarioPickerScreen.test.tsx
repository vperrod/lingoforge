// @vitest-environment jsdom
// ScenarioPickerScreen drives the idle/checking/generating/offline/error state
// machine gating the AI scenario lesson entry point. A regression here would
// silently let a user through to a broken generation call, or wrongly block
// one that would have succeeded.
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../services/ollama', () => ({ isOllamaOnline: vi.fn() }))
vi.mock('../services/scenario-gen', () => ({ generateScenario: vi.fn() }))

import { isOllamaOnline } from '../services/ollama'
import { generateScenario } from '../services/scenario-gen'
import { ScenarioPickerScreen } from './ScenarioPickerScreen'
import { useSettings } from '../state/settings'

const mockIsOllamaOnline = vi.mocked(isOllamaOnline)
const mockGenerateScenario = vi.mocked(generateScenario)

const scenarioData = {
  title: 'At the restaurant',
  culturalTip: 'Tip.',
  vocab: [{ word: 'mesa', translation: 'table', pronunciation: 'MEH-sah' }],
  phrases: [],
  dialogue: [{ speaker: 'other' as const, line: '¿Qué desea?', translation: 'What would you like?' }],
}

function renderScreen() {
  render(
    <MemoryRouter initialEntries={['/scenario-lesson']}>
      <Routes>
        <Route path="/scenario-lesson" element={<ScenarioPickerScreen />} />
        <Route path="/scenario-lesson/play" element={<div>lesson playing</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  useSettings.setState({ aiEnabled: true })
  mockIsOllamaOnline.mockReset().mockResolvedValue(true)
  mockGenerateScenario.mockReset().mockResolvedValue(scenarioData)
})

afterEach(() => {
  cleanup()
  useSettings.setState({ aiEnabled: false })
  sessionStorage.removeItem('scenarioLesson')
})

const pickRestaurant = () => fireEvent.click(screen.getByText('Restaurant'))

describe('ScenarioPickerScreen', () => {
  it('shows the offline banner when Ollama is unreachable', async () => {
    mockIsOllamaOnline.mockResolvedValue(false)
    renderScreen()
    pickRestaurant()
    expect(await screen.findByText('Ollama is not running')).toBeTruthy()
    expect(mockGenerateScenario).not.toHaveBeenCalled()
  })

  it('shows the error banner when generation fails', async () => {
    mockGenerateScenario.mockRejectedValue(new Error('model timed out'))
    renderScreen()
    pickRestaurant()
    expect(await screen.findByText('model timed out')).toBeTruthy()
  })

  it('navigates to the lesson player on successful generation', async () => {
    renderScreen()
    pickRestaurant()
    expect(await screen.findByText('lesson playing')).toBeTruthy()
    expect(JSON.parse(sessionStorage.getItem('scenarioLesson') ?? '{}').scenario).toBe(
      'ordering food at a restaurant',
    )
  })

  it('aborts the in-flight generation on unmount so it cannot navigate after teardown', async () => {
    let rejectGenerate!: (e: unknown) => void
    mockGenerateScenario.mockReturnValue(
      new Promise((_resolve, reject) => {
        rejectGenerate = reject
      }),
    )
    const { unmount } = render(
      <MemoryRouter initialEntries={['/scenario-lesson']}>
        <Routes>
          <Route path="/scenario-lesson" element={<ScenarioPickerScreen />} />
          <Route path="/scenario-lesson/play" element={<div>lesson playing</div>} />
        </Routes>
      </MemoryRouter>,
    )
    pickRestaurant()
    await waitFor(() => expect(mockGenerateScenario).toHaveBeenCalled())
    unmount()
    const abortError = Object.assign(new Error('aborted'), { name: 'AbortError' })
    expect(() => rejectGenerate(abortError)).not.toThrow()
  })
})
