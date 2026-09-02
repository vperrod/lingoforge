import { ruAlphabet, readingPractice, confusablePairs } from '../content'
import type { AlphabetGroup, AlphabetLetter } from '../content/types'
import type { ExerciseInstance } from '../engine/exercise-gen'
import { blanksFor, spellFromWord } from '../engine/exercise-gen'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function allLetters(): AlphabetLetter[] {
  return ruAlphabet.groups.flatMap((g) => g.letters)
}

/** Distractor-tile source for spelling drills: every lowercase Cyrillic letter. */
const alphaPool = allLetters().map((l) => l.lower)

/** Pick-one over the group's letters/words: choice/listening/spell only, never a text field. */
export function letterChoice(letter: AlphabetLetter, all: AlphabetLetter[]): ExerciseInstance[] {
  const others = shuffle(all.filter((l) => l.letter !== letter.letter)).slice(0, 3)
  const soundOptions = shuffle([letter.sound, ...others.map((o) => o.sound)])
  const letterOptions = shuffle([letter, ...others].map((l) => `${l.letter} ${l.lower}`))
  const wordOptions = shuffle([letter.example.word, ...others.map((o) => o.example.word)])
  const hintOptions = shuffle([letter.example.hint, ...others.map((o) => o.example.hint)])
  return [
    // Letter → sound
    {
      kind: 'choice',
      title: 'Letters',
      prompt: `What sound does ${letter.letter} ${letter.lower} make?`,
      ttsText: letter.lower,
      options: soundOptions,
      correctIndex: soundOptions.indexOf(letter.sound),
      vocabIds: [`alpha:${letter.letter}`],
    },
    // Sound → letter (writing practice without a keyboard)
    {
      kind: 'choice',
      title: 'Letters',
      prompt: `Which letter sounds like "${letter.sound}"?`,
      options: letterOptions,
      correctIndex: letterOptions.indexOf(`${letter.letter} ${letter.lower}`),
      vocabIds: [`alpha:${letter.letter}`],
    },
    // Hear the example word, pick its spelling
    {
      kind: 'listening',
      ttsText: letter.example.word,
      options: wordOptions,
      correctIndex: wordOptions.indexOf(letter.example.word),
      vocabIds: [`alpha:${letter.letter}`],
    },
    // Read the word, pick how it sounds
    {
      kind: 'choice',
      title: 'Read it',
      prompt: `How do you read ${letter.example.word} (${letter.example.translation})?`,
      ttsText: letter.example.word,
      options: hintOptions,
      correctIndex: hintOptions.indexOf(letter.example.hint),
      vocabIds: [`alpha:${letter.letter}`],
    },
    // Complete the example word: the new letter is one of the blanks
    spellFromWord(letter.example.word, letter.example.translation, alphaPool, {
      blanks: blanksFor(letter.example.word),
      vocabIds: [`alpha:${letter.letter}`],
    }),
  ]
}

/** One drill per group: meet each letter, hear it, read it, complete a word with it. */
export function groupDrill(group: AlphabetGroup): ExerciseInstance[] {
  const all = allLetters()
  // Every letter gets its letter→sound question plus one other angle, so a big
  // group still covers all its letters inside one sitting.
  const exercises = group.letters.flatMap((letter) => {
    const [core, ...rest] = letterChoice(letter, all)
    return [core, shuffle(rest)[0]]
  })
  const words = readingPractice[group.id] ?? []
  for (const w of shuffle(words).slice(0, 3)) {
    const otherHints = shuffle(words.filter((x) => x.word !== w.word).map((x) => x.hint)).slice(0, 3)
    const options = shuffle([w.hint, ...otherHints])
    exercises.push({
      kind: 'choice',
      title: 'Read it',
      prompt: `Read: ${w.word} (${w.translation})`,
      ttsText: w.word,
      options,
      correctIndex: options.indexOf(w.hint),
      vocabIds: [],
    })
  }
  return shuffle(exercises).slice(0, 20)
}

/** Dedicated confusable pairs drill — mixes all tricky pairs */
export function confusablesDrill(): ExerciseInstance[] {
  const exercises: ExerciseInstance[] = []
  const all = allLetters()

  for (const pair of shuffle(confusablePairs)) {
    const letterA = all.find((l) => l.letter === pair.a)
    const letterB = all.find((l) => l.letter === pair.b)
    if (!letterA || !letterB) continue

    const labelA = `${letterA.letter} ${letterA.lower}`
    const labelB = `${letterB.letter} ${letterB.lower}`

    // Pick the right letter for the sound
    const optionsA = shuffle([labelA, labelB])
    exercises.push({
      kind: 'choice',
      title: 'Letters',
      prompt: `Which letter sounds like "${letterA.sound.split('as in')[0].trim()}"?`,
      options: optionsA,
      correctIndex: optionsA.indexOf(labelA),
      vocabIds: [`alpha:${letterA.letter}`],
    })

    // Reverse direction
    const optionsB = shuffle([labelA, labelB])
    exercises.push({
      kind: 'choice',
      title: 'Letters',
      prompt: `Which letter sounds like "${letterB.sound.split('as in')[0].trim()}"?`,
      options: optionsB,
      correctIndex: optionsB.indexOf(labelB),
      vocabIds: [`alpha:${letterB.letter}`],
    })

    // Word with confusable: complete the word you hear (forces hearing the difference)
    exercises.push(
      spellFromWord(letterA.example.word, letterA.example.translation, alphaPool, {
        audio: true,
        blanks: blanksFor(letterA.example.word),
        vocabIds: [`alpha:${letterA.letter}`],
      }),
    )
  }

  return shuffle(exercises).slice(0, 16)
}

/** Full reading challenge — decode words from all groups */
export function readingChallenge(): ExerciseInstance[] {
  const exercises: ExerciseInstance[] = []
  const allWords = Object.values(readingPractice).flat()

  for (const w of shuffle(allWords).slice(0, 8)) {
    // Read it: pick how it sounds
    const otherHints = shuffle(allWords.filter((x) => x.word !== w.word).map((x) => x.hint)).slice(0, 3)
    const hintOptions = shuffle([w.hint, ...otherHints])
    exercises.push({
      kind: 'choice',
      title: 'Read it',
      prompt: `Read: ${w.word}`,
      options: hintOptions,
      correctIndex: hintOptions.indexOf(w.hint),
      vocabIds: [],
    })

    // Meaning
    const otherTranslations = shuffle(allWords.filter((x) => x.word !== w.word).map((x) => x.translation)).slice(0, 3)
    const meaningOptions = shuffle([w.translation, ...otherTranslations])
    exercises.push({
      kind: 'choice',
      prompt: `What does "${w.word}" mean?`,
      ttsText: w.word,
      options: meaningOptions,
      correctIndex: meaningOptions.indexOf(w.translation),
      vocabIds: [],
    })
  }

  // Hear a word, build it from tiles
  for (const w of shuffle(allWords).slice(0, 4)) {
    exercises.push(spellFromWord(w.word, w.translation, alphaPool, { audio: true }))
  }

  return shuffle(exercises).slice(0, 16)
}
