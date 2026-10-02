import { describe, it, expect } from 'vitest'
import { audioUrl } from './tts'

describe('audioUrl', () => {
  it('keeps a question mark out of the path so the MP3 is reachable', () => {
    expect(audioUrl('Где метро?', 'ru-RU')).toContain('audio/ru/Где метро.mp3')
  })

  it('keeps a hash out of the path', () => {
    expect(audioUrl('N#1', 'es-ES')).toContain('audio/es/N1.mp3')
  })

  it('drops a percent sign, which the server would read as an escape', () => {
    expect(audioUrl('100%20', 'es-ES')).toContain('audio/es/10020.mp3')
  })

  it('replaces a slash, which would read as a directory', () => {
    expect(audioUrl('да/нет', 'ru-RU')).toContain('audio/ru/да-нет.mp3')
  })
})
