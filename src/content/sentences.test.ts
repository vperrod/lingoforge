import { spawnSync } from 'node:child_process'
import { describe, it, expect } from 'vitest'
import { splitSentences, splitWords } from './sentences'

describe('splitSentences', () => {
  it('splits a passage where its MP3s were generated — on sentence ends', () => {
    expect(splitSentences('Привет! Я хочу чай.')).toEqual(['Привет!', 'Я хочу чай.'])
  })

  it('treats a paragraph break as a sentence break', () => {
    expect(splitSentences('Кот хочет молоко\n\nСпасибо')).toEqual(['Кот хочет молоко', 'Спасибо'])
  })
})

describe('splitWords', () => {
  it('drops the punctuation glued to a tapped word', () => {
    expect(splitWords('Привет! Я хочу чай.')).toEqual(['Привет', 'Я', 'хочу', 'чай'])
  })
})

// gen-audio.py can't be imported (it needs edge_tts), so run just its split
// functions, lifted by name from the source, over the same inputs.
const PY_RUNNER = `
import ast, json, re, sys, unicodedata
tree = ast.parse(open("scripts/gen-audio.py", encoding="utf-8").read())
keep = {"split_sentences", "split_words", "_is_letter_or_mark"}
ns = {"re": re, "unicodedata": unicodedata}
exec(compile(ast.Module([n for n in tree.body if getattr(n, "name", None) in keep], []), "gen-audio", "exec"), ns)
text = json.loads(sys.stdin.read())
print(json.dumps({"sentences": ns["split_sentences"](text), "words": ns["split_words"](text)}))
`

function pythonSplit(text: string): { sentences: string[]; words: string[] } {
  const run = spawnSync('python3', ['-c', PY_RUNNER], { input: JSON.stringify(text), encoding: 'utf-8' })
  if (run.status !== 0) throw new Error(run.stderr)
  return JSON.parse(run.stdout)
}

describe('split parity with scripts/gen-audio.py', () => {
  const inputs = [
    'Привет! Я хочу чай.',
    'Кот хочет молоко\n\nСпасибо',
    '¿Dónde está el baño? Muy bien… gracias.',
    '«Привет», — сказал он. (Да!) 3 кота; №5',
    '  \n  ',
  ]

  it.each(inputs)('splitSentences matches split_sentences for %j', (text) => {
    expect(splitSentences(text)).toEqual(pythonSplit(text).sentences)
  })

  it.each(inputs)('splitWords matches split_words for %j', (text) => {
    expect(splitWords(text)).toEqual(pythonSplit(text).words)
  })
})
