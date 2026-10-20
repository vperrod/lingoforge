import { describe, expect, it } from 'vitest'
import { toCspOllamaOrigin } from './ollama-url'

describe('toCspOllamaOrigin', () => {
  it.each([
    ['http://localhost:11434', 'http://localhost:11434'],
    ['http://127.0.0.1:11434/', 'http://127.0.0.1:11434'],
    ['http://192.168.1.20:11434', 'http://192.168.1.20:11434'],
    ['http://10.0.0.5:11434', 'http://10.0.0.5:11434'],
    ['https://172.20.1.1', 'https://172.20.1.1'],
    ['https://box.local:11434', 'https://box.local:11434'],
  ])('accepts %s', (input, expected) => {
    expect(toCspOllamaOrigin(input)).toBe(expected)
  })

  it.each([
    'https://evil.example.com',
    'http://172.32.0.1',
    'http://8.8.8.8',
    'http://localhost.evil.com',
    "http://localhost:11434; script-src *",
    'ftp://localhost',
    'not a url',
  ])('rejects %s', (input) => {
    expect(() => toCspOllamaOrigin(input)).toThrow()
  })
})
