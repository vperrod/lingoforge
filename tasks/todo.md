# Incorporate learnings from 7 Russian-learning sources

Goal: add the *valuable mechanics* from RussianPod101, Readlang, Master Russian, Ruspeach,
Loecsen, Forvo, LingQ — staying local-first (no backend, no external APIs, no cost).

## Features
- [ ] **A. Reading mode** (Readlang + LingQ) — tap-to-gloss reader with LingQ-style
      word-status colours (new / learning / known) + add-to-Practice (reuses FSRS).
- [ ] **B. Grammar notes** (Master Russian) — short "why" card shown before a lesson.
- [ ] **C. Phrasebook** (Loecsen) — curated situational survival-phrase packs, TTS + add.
- [ ] **D. Graded dialogues** (RussianPod101 / Ruspeach) — leveled dialogues with
      listen + reveal + comprehension question (folded into Reading mode as kind:'dialogue').
- [ ] **Forvo** — NOT a live API (would break local-first). Audio uses existing TTS pipeline;
      pre-generate with `npm run gen-audio`.

## Implementation
- [ ] types: `ReadingText`, `PhrasePack` interfaces
- [ ] `engine/word-status.ts` — classify SRS state → new/learning/known
- [ ] content: `readings.ts`, `phrasebook.ts`, `grammar.ts` (keyed by id, seeded ru+es)
- [ ] `ui/GlossText.tsx` — shared tap-to-translate text (used by reading + dialogue + phrasebook)
- [ ] screens: `ReadingPickerScreen`, `ReadingScreen`, `PhrasebookScreen`
- [ ] wire routes (App.tsx), feature cards (PathScreen), grammar card (LessonScreen)
- [ ] extend content.test.ts integrity checks; add word-status test
- [ ] `npm test` + `npm run build` green

## Review (done 2026-06-29)

All four features shipped, local-first (no new deps, no backend, no external API).

**New files**
- `engine/word-status.ts` (+test) — SRS → new/learning/known
- `content/readings.ts`, `content/phrasebook.ts`, `content/grammar.ts` — seeded ru + es
- `ui/GlossText.tsx` — shared tap-to-translate (used by reading, dialogue, phrasebook)
- `app/ReadingPickerScreen.tsx`, `app/ReadingScreen.tsx`, `app/PhrasebookScreen.tsx`

**Wiring**: routes in `App.tsx`; "Read" + "Phrasebook" cards on `PathScreen`; grammar
note card before lessons in `LessonScreen`; content exports in `content/index.ts`.

**Tap-to-gloss / word-status** (Readlang + LingQ): tap any word → hear it, see meaning
(course vocab or inline glossary), add to FSRS Practice. Words coloured by SRS status.

**Grammar notes** (Master Russian): `grammarNotes` keyed by `course:lesson`; 6 seeded.
**Phrasebook** (Loecsen): 3 situational packs per course, TTS + add-to-Practice.
**Graded dialogues** (RussianPod101/Ruspeach): `kind:'dialogue'` readings with listen +
reveal + comprehension MCQ awarding XP.
**Forvo**: deliberately NOT an API — audio stays on the TTS pipeline (`npm run gen-audio`).

**Verification**: `npm test` 41→48 pass · `npm run build` green · Playwright smoke across
all new routes + tap-to-gloss interaction = pass, no page/console errors.

**Incidental**: removed 3 pre-existing unused symbols in `AlphabetScreen.tsx` that were
breaking `tsc` on a clean checkout (blocked build verification). 18 pre-existing eslint
`react-hooks/purity` errors in untouched files left as-is.

**Next** (optional): author more readings; pre-generate MP3s for new phrases/glossary;
consider an in-reader "words added today" count.

---

# Round 2 — activity variety, less multiple-choice (done 2026-06-29)

Feedback: lessons had "too much select words" (repetitive multiple-choice); wanted more
activity types, esp. for alphabet + basic words, and more listening.

**New activity: `spell`** — assemble a word from scrambled letter tiles; optional audio
makes it "build what you hear". Serves alphabet, basic words, spelling, and listening.
- `engine/exercise-gen.ts`: `spell` kind + `spellFromWord`/`letterPool` (exported, reused
  by the alphabet screen) + `spellExercise`/`isSpellable` helpers.
- `exercises/SpellExercise.tsx` (new) + wired into `render.tsx`.

**Rebalanced `generateLessonExercises`**:
- dropped the redundant "pick the target word" (`choiceToTarget`) from lessons — production
  is now `spell` (short words) / `typing`.
- more listening, mostly non-select: 1 "what do you hear" + spell-from-audio + 2 dictation.
- new `capByKind` cap: choice ≤ 4, listening ≤ 2 — multiple-choice can never dominate again.

**Alphabet drills** (`AlphabetScreen.tsx`):
- Recognition: removed the duplicate sound→letter choice; added build-what-you-hear spell.
- Reading: extra-example word is now spelled, not picked.
- Production: example word is spelled (from translation), not typed.
- Confusables: the listening-select is now spell-what-you-hear.

**Verification**: `npm test` 48→48 (+ new `exercise-gen.test.ts`: balance ≤4 choice, spell
present, ≥6 distinct kinds) · `npm run build` green · Playwright smoke drove the alphabet
Recognition drill — spell + choice both appear, SpellExercise Check→Continue works, no errors.

**Note**: `choiceToTarget` kept (still used by the placement test, not the lesson loop).
**Not done this round**: no new vocab/reading *content* added — this was an activity-type
pass. Authoring more basic-word content + readings is the obvious next step.
