// @vitest-environment jsdom
// Without this keypad a phone learner cannot type a single Russian answer.
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'

import { ScriptKeypad } from './ScriptKeypad'

afterEach(cleanup)

test('tapping a Cyrillic key inserts that letter', () => {
  const onInsert = vi.fn()
  render(<ScriptKeypad lang="ru-RU" onInsert={onInsert} onBackspace={vi.fn()} />)
  fireEvent.click(screen.getByText('п'))
  expect(onInsert).toHaveBeenCalledWith('п')
})

test('Spanish gets the accented letters it needs', () => {
  const onInsert = vi.fn()
  render(<ScriptKeypad lang="es-ES" onInsert={onInsert} onBackspace={vi.fn()} />)
  fireEvent.click(screen.getByText('ñ'))
  expect(onInsert).toHaveBeenCalledWith('ñ')
})

test('backspace deletes', () => {
  const onBackspace = vi.fn()
  render(<ScriptKeypad lang="ru-RU" onInsert={vi.fn()} onBackspace={onBackspace} />)
  fireEvent.click(screen.getByLabelText('Delete last letter'))
  expect(onBackspace).toHaveBeenCalled()
})

test('a language typed on any keyboard gets no keypad', () => {
  const { container } = render(
    <ScriptKeypad lang="en-US" onInsert={vi.fn()} onBackspace={vi.fn()} />,
  )
  expect(container.innerHTML).toBe('')
})

test('the keypad can be hidden by learners who have the real keyboard', () => {
  render(<ScriptKeypad lang="ru-RU" onInsert={vi.fn()} onBackspace={vi.fn()} />)
  fireEvent.click(screen.getByText('Hide keyboard'))
  expect(screen.queryByText('п')).toBeNull()
})

test('the show/hide toggle reports its state to screen readers', () => {
  render(<ScriptKeypad lang="ru-RU" onInsert={vi.fn()} onBackspace={vi.fn()} />)
  const toggle = screen.getByRole('button', { name: 'Hide keyboard' })
  expect(toggle.getAttribute('aria-expanded')).toBe('true')
  fireEvent.click(toggle)
  expect(screen.getByRole('button', { name: 'Show keyboard' }).getAttribute('aria-expanded')).toBe('false')
})

test('letter keys are focusable buttons tagged with the course language', () => {
  render(<ScriptKeypad lang="ru-RU" onInsert={vi.fn()} onBackspace={vi.fn()} />)
  const key = screen.getByRole('button', { name: 'п' })
  expect(key.getAttribute('lang')).toBe('ru-RU')
})

test('every key is type=button so it never submits the surrounding form', () => {
  render(<ScriptKeypad lang="es-ES" onInsert={vi.fn()} onBackspace={vi.fn()} />)
  const types = screen.getAllByRole('button').map((b) => b.getAttribute('type'))
  expect(types.every((t) => t === 'button')).toBe(true)
})

test('the space key has an accessible name and inserts a space', () => {
  const onInsert = vi.fn()
  render(<ScriptKeypad lang="ru-RU" onInsert={onInsert} onBackspace={vi.fn()} />)
  fireEvent.click(screen.getByRole('button', { name: 'Space' }))
  expect(onInsert).toHaveBeenCalledWith(' ')
})

test('pressing a key does not steal focus from the answer input', () => {
  render(<ScriptKeypad lang="ru-RU" onInsert={vi.fn()} onBackspace={vi.fn()} />)
  const notCancelled = fireEvent.pointerDown(screen.getByRole('button', { name: 'п' }))
  expect(notCancelled).toBe(false)
})

test('disabled keypad blocks every key but leaves the toggle usable', () => {
  const onInsert = vi.fn()
  render(<ScriptKeypad lang="ru-RU" onInsert={onInsert} onBackspace={vi.fn()} disabled />)
  fireEvent.click(screen.getByRole('button', { name: 'п' }))
  expect(onInsert).not.toHaveBeenCalled()
})

test('the toggle stays enabled while the keys are disabled', () => {
  render(<ScriptKeypad lang="ru-RU" onInsert={vi.fn()} onBackspace={vi.fn()} disabled />)
  expect((screen.getByRole('button', { name: 'Hide keyboard' }) as HTMLButtonElement).disabled).toBe(false)
})
