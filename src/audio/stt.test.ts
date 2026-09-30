import { afterEach, describe, it, expect, vi } from 'vitest'
import { createRecognizer, isSpeechSupported, speechErrorMessage } from './stt'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('browser support', () => {
  it('is unsupported without a window (SSR)', () => {
    vi.stubGlobal('window', undefined)
    expect(isSpeechSupported()).toBe(false)
  })

  it('is unsupported when the browser has no recognizer (Firefox)', () => {
    vi.stubGlobal('window', {})
    expect(isSpeechSupported()).toBe(false)
  })

  it('createRecognizer returns null when unsupported', () => {
    vi.stubGlobal('window', {})
    expect(createRecognizer('ru-RU')).toBeNull()
  })

  it('accepts the webkit-prefixed recognizer (Safari)', () => {
    vi.stubGlobal('window', { webkitSpeechRecognition: function () {} })
    expect(isSpeechSupported()).toBe(true)
  })

  it('createRecognizer sets single-utterance mode so the mic is released', () => {
    vi.stubGlobal('window', { SpeechRecognition: function () {} })
    expect(createRecognizer('es-ES')).toMatchObject({ lang: 'es-ES', continuous: false })
  })
})

describe('speechErrorMessage', () => {
  it('explains a blocked microphone for not-allowed', () => {
    expect(speechErrorMessage('not-allowed')).toBe(
      'Microphone blocked. Allow mic access for this site in your browser settings, then tap the mic again.'
    )
  })

  it('explains a blocked microphone for service-not-allowed', () => {
    expect(speechErrorMessage('service-not-allowed')).toBe(
      'Microphone blocked. Allow mic access for this site in your browser settings, then tap the mic again.'
    )
  })

  it('reports when no microphone is found', () => {
    expect(speechErrorMessage('audio-capture')).toBe(
      'No microphone found on this device.'
    )
  })

  it('reports a network failure reaching the service', () => {
    expect(speechErrorMessage('network')).toBe(
      'Speech recognition needs a connection and could not reach the service.'
    )
  })

  it('reports when nothing was heard', () => {
    expect(speechErrorMessage('no-speech')).toBe(
      "Didn't hear anything. Tap the mic, then speak straight away."
    )
  })

  it('reports when recording was stopped', () => {
    expect(speechErrorMessage('aborted')).toBe(
      'Recording stopped. Tap the mic to try again.'
    )
  })

  it('falls back to a generic message for an unknown code', () => {
    expect(speechErrorMessage('unknown-code')).toBe(
      'Speech recognition failed on this device. You can skip this one.'
    )
  })
})
