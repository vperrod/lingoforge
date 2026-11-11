import { spawnSync } from 'node:child_process'
import { describe, it, expect } from 'vitest'
import { courses } from './index'

// check-audio.py scans source files with regexes, so a course file it doesn't list
// (ru-topics.ts, merged into the ru course) ships its audio silent. Run the real
// speakable() and diff it against the compiled course objects. edge_tts is stubbed
// because the scan never synthesizes anything.
const PY_RUNNER = `
import importlib.util, json, sys, types
sys.modules["edge_tts"] = types.ModuleType("edge_tts")
spec = importlib.util.spec_from_file_location("check_audio", "scripts/check-audio.py")
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
print(json.dumps({lang: sorted(texts) for lang, texts in mod.speakable().items()}))
`

function guardedTexts(): Record<string, Set<string>> {
  const run = spawnSync('python3', ['-c', PY_RUNNER], { encoding: 'utf-8' })
  if (run.status !== 0) throw new Error(run.stderr)
  const parsed: Record<string, string[]> = JSON.parse(run.stdout)
  return Object.fromEntries(Object.entries(parsed).map(([lang, texts]) => [lang, new Set(texts)]))
}

describe.each(Object.values(courses))('check-audio.py coverage of course $id', (course) => {
  it('guards every lemma, inflected form and lesson sentence the course can speak', () => {
    const guarded = guardedTexts()[course.id]
    const spoken = new Set<string>()
    for (const v of course.vocab) {
      spoken.add(v.lemma)
      v.forms?.forEach((f) => spoken.add(f))
    }
    for (const unit of course.units)
      for (const skill of unit.skills)
        for (const lesson of skill.lessons) lesson.sentences.forEach((s) => spoken.add(s.text))

    expect([...spoken].filter((t) => !guarded.has(t))).toEqual([])
  })
})
