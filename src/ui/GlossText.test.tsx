// @vitest-environment jsdom
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'

import type { Course } from '../content/types'
import { speak } from '../audio/tts'
import { GlossText } from './GlossText'

vi.mock('../audio/tts', () => ({ speak: vi.fn(), stopSpeaking: vi.fn() }))

afterEach(cleanup)

const course = {
  id: 'ru',
  name: 'Russian',
  flag: '🇷🇺',
  ttsLang: 'ru-RU',
  vocab: [
    { id: 'tea', lemma: 'чай', translation: 'tea' },
    { id: 'hedgehog', lemma: 'ёж', translation: 'hedgehog' },
    { id: 'want', lemma: 'хотеть', translation: 'to want', forms: ['хочу'] },
  ],
  patterns: [],
  units: [],
} as unknown as Course

const renderText = (text: string, opts: { glossary?: Record<string, string>; added?: string[] } = {}) => {
  const onAdd = vi.fn()
  render(
    <GlossText
      text={text}
      course={course}
      glossary={opts.glossary}
      srsItems={{}}
      addedIds={new Set(opts.added ?? [])}
      onAdd={onAdd}
    />,
  )
  return onAdd
}

test('tapping a word shows its vocab translation despite trailing punctuation', () => {
  renderText('Чай.')
  fireEvent.click(screen.getByText('Чай.'))
  expect(screen.getByText('tea')).toBeTruthy()
})

test('speaks the tapped word without punctuation', () => {
  renderText('Чай.')
  fireEvent.click(screen.getByText('Чай.'))
  expect(speak).toHaveBeenCalledWith('Чай', 'ru-RU')
})

test('ё in the text matches a lemma spelt with е', () => {
  renderText('еж')
  fireEvent.click(screen.getByText('еж'))
  expect(screen.getByText('hedgehog')).toBeTruthy()
})

test('inflected forms resolve to their lemma translation', () => {
  renderText('хочу')
  fireEvent.click(screen.getByText('хочу'))
  expect(screen.getByText('to want')).toBeTruthy()
})

test('falls back to the glossary when the word is not course vocab', () => {
  renderText('Привет!', { glossary: { привет: 'hi' } })
  fireEvent.click(screen.getByText('Привет!'))
  expect(screen.getByText('hi')).toBeTruthy()
})

test('unknown words show a no-translation notice', () => {
  renderText('абракадабра')
  fireEvent.click(screen.getByText('абракадабра'))
  expect(screen.getByText(/No translation/)).toBeTruthy()
})

test('Practice button adds the vocab id', () => {
  const onAdd = renderText('чай')
  fireEvent.click(screen.getByText('чай'))
  fireEvent.click(screen.getByText('Practice'))
  expect(onAdd).toHaveBeenCalledWith('tea')
})

test('already-added words show Added instead of Practice', () => {
  renderText('чай', { added: ['tea'] })
  fireEvent.click(screen.getByText('чай'))
  expect(screen.queryByText('Practice')).toBeNull()
})

test('glossary-only words offer no Practice button', () => {
  renderText('привет', { glossary: { привет: 'hi' } })
  fireEvent.click(screen.getByText('привет'))
  expect(screen.queryByText('Practice')).toBeNull()
})
