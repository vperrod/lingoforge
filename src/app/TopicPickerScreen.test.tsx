// @vitest-environment jsdom
// Only fetch is mocked, so these cover the real Ollama service through to the
// fallback the learner sees when the server is down or erroring.
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { resetStatus } from '../services/ollama'
import { useSettings } from '../state/settings'
import { TopicPickerScreen } from './TopicPickerScreen'

// /api/tags is the online probe; every other call is a generation request.
function stubOllama(generate: () => Promise<unknown>) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string) => (url.endsWith('/api/tags') ? { ok: true } : generate())),
  )
}

function pickTravel() {
  render(
    <MemoryRouter>
      <TopicPickerScreen />
    </MemoryRouter>,
  )
  fireEvent.click(screen.getByText('Travel'))
}

beforeEach(() => {
  useSettings.setState({ aiEnabled: true })
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  resetStatus()
  useSettings.setState({ aiEnabled: false })
})

describe('TopicPickerScreen Ollama failures', () => {
  it('shows the offline banner when the server is unreachable', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new TypeError('Failed to fetch') }))
    pickTravel()
    expect(await screen.findByText('Ollama is not running')).toBeTruthy()
  })

  it('shows the offline banner when the server answers the probe with an error', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, status: 503 })))
    pickTravel()
    expect(await screen.findByText('Ollama is not running')).toBeTruthy()
  })

  it('shows the status and body when generation returns an error', async () => {
    stubOllama(async () => ({ ok: false, status: 500, text: async () => 'boom' }))
    pickTravel()
    expect(await screen.findByText('Ollama 500: boom')).toBeTruthy()
  })

  it('shows the error banner when the connection drops during generation', async () => {
    stubOllama(async () => { throw new TypeError('Failed to fetch') })
    pickTravel()
    expect(await screen.findByText('Something went wrong')).toBeTruthy()
  })
})
