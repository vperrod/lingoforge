import { describe, it, expect } from 'vitest'
import { speechErrorMessage } from './stt'

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
