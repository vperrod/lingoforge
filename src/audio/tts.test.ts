import { readFileSync } from 'node:fs'
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

// gen-audio.py can't be imported (it needs edge_tts), so apply the .replace()
// chain written in its safe_filename() source to the same inputs.
function pythonSafeFilename(text: string): string {
  const src = readFileSync('scripts/gen-audio.py', 'utf-8')
  const body = src.split('def safe_filename')[1].split('\n\n\n')[0]
  const unescape = (s: string) => s.replace(/\\\\/g, '\\')
  return [...body.matchAll(/\.replace\("((?:[^"\\]|\\.)*)", "((?:[^"\\]|\\.)*)"\)/g)].reduce(
    (acc, [, from, to]) => acc.split(unescape(from)).join(unescape(to)),
    text,
  )
}

describe('audio filename parity with scripts/gen-audio.py', () => {
  const inputs = ['Где метро?', 'N#1', '100%20', 'да/нет', 'a\\b', '¿Dónde está?', 'plain', '?#%/\\']

  it.each(inputs)('audioUrl matches safe_filename for %j', (text) => {
    const file = audioUrl(text, 'ru-RU').split('audio/ru/')[1]
    expect(file).toBe(`${pythonSafeFilename(text)}.mp3`)
  })
})
