import type { Course, Lesson, VocabItem } from '../content/types'

export type ExerciseInstance =
  | {
      kind: 'choice'
      /** What the user sees as the question */
      prompt: string
      /** Spoken text (target language) if prompt is in target language */
      ttsText?: string
      options: string[]
      correctIndex: number
      /** Vocab credited on success */
      vocabIds: string[]
    }
  | {
      kind: 'wordBank'
      sentence: string
      translation: string
      /** Chips in correct order; UI shuffles */
      answerChips: string[]
      distractorChips: string[]
      vocabIds: string[]
    }
  | {
      kind: 'listening'
      ttsText: string
      options: string[]
      correctIndex: number
      vocabIds: string[]
    }
  | {
      kind: 'typing'
      prompt: string
      /** Any of these normalized forms accepted */
      accept: string[]
      /** Shown after answer */
      answer: string
      vocabIds: string[]
    }
  | {
      kind: 'matching'
      pairs: { left: string; right: string; vocabId: string }[]
    }
  | {
      kind: 'pattern'
      frame: string
      frameTranslation: string
      slotTranslation: string
      options: string[]
      correctIndex: number
      vocabIds: string[]
    }

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function sample<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n)
}

function distractorTranslations(course: Course, exclude: VocabItem, n: number): string[] {
  const pool = course.vocab.filter((v) => v.id !== exclude.id && v.translation !== exclude.translation)
  return sample([...new Set(pool.map((v) => v.translation))], n)
}

function distractorLemmas(course: Course, exclude: VocabItem, n: number): string[] {
  const pool = course.vocab.filter((v) => v.id !== exclude.id && v.lemma !== exclude.lemma)
  return sample([...new Set(pool.map((v) => v.lemma))], n)
}

function choiceToEnglish(course: Course, vocab: VocabItem): ExerciseInstance {
  const options = shuffle([vocab.translation, ...distractorTranslations(course, vocab, 3)])
  return {
    kind: 'choice',
    prompt: vocab.lemma,
    ttsText: vocab.lemma,
    options,
    correctIndex: options.indexOf(vocab.translation),
    vocabIds: [vocab.id],
  }
}

function choiceToTarget(course: Course, vocab: VocabItem): ExerciseInstance {
  const options = shuffle([vocab.lemma, ...distractorLemmas(course, vocab, 3)])
  return {
    kind: 'choice',
    prompt: vocab.translation,
    options,
    correctIndex: options.indexOf(vocab.lemma),
    vocabIds: [vocab.id],
  }
}

function listeningExercise(course: Course, vocab: VocabItem): ExerciseInstance {
  const options = shuffle([vocab.lemma, ...distractorLemmas(course, vocab, 3)])
  return {
    kind: 'listening',
    ttsText: vocab.lemma,
    options,
    correctIndex: options.indexOf(vocab.lemma),
    vocabIds: [vocab.id],
  }
}

function typingExercise(vocab: VocabItem): ExerciseInstance {
  return {
    kind: 'typing',
    prompt: vocab.translation,
    accept: [vocab.lemma, ...(vocab.forms ?? [])],
    answer: vocab.lemma,
    vocabIds: [vocab.id],
  }
}

function wordBankExercise(course: Course, sentence: { text: string; translation: string; vocabIds: string[] }): ExerciseInstance {
  const chips = sentence.text.replace(/[?!.,—]/g, '').split(/\s+/).filter(Boolean)
  const chipsLower = chips.map((c) => c.toLowerCase())
  const distractors = sample(
    course.vocab.filter((v) => !chipsLower.includes(v.lemma.toLowerCase()) && !v.lemma.includes(' ')),
    Math.min(2, Math.max(0, 8 - chips.length)),
  ).map((v) => v.lemma)
  return {
    kind: 'wordBank',
    sentence: sentence.text,
    translation: sentence.translation,
    answerChips: chips,
    distractorChips: distractors,
    vocabIds: sentence.vocabIds,
  }
}

export function generateLessonExercises(course: Course, lesson: Lesson, crownLevel: number): ExerciseInstance[] {
  const vocab = lesson.vocabIds
    .map((id) => course.vocab.find((v) => v.id === id))
    .filter((v): v is VocabItem => Boolean(v))

  const exercises: ExerciseInstance[] = []

  // New vocab intro: recognition both directions
  for (const v of vocab) {
    exercises.push(choiceToEnglish(course, v))
  }
  // Production direction for a subset (all at higher crowns)
  const productionSet = crownLevel >= 2 ? vocab : sample(vocab, Math.ceil(vocab.length / 2))
  for (const v of productionSet) {
    exercises.push(crownLevel >= 3 ? typingExercise(v) : choiceToTarget(course, v))
  }
  // Listening for a couple of words
  for (const v of sample(vocab, Math.min(2, vocab.length))) {
    exercises.push(listeningExercise(course, v))
  }
  // Sentences as word banks
  for (const s of sample(lesson.sentences, Math.min(3, lesson.sentences.length))) {
    exercises.push(wordBankExercise(course, s))
  }
  // Pattern drills
  for (const pid of lesson.patternIds ?? []) {
    const pattern = course.patterns.find((p) => p.id === pid)
    if (!pattern || pattern.slots.length < 2) continue
    for (const slot of sample(pattern.slots, 2)) {
      const otherForms = sample(
        pattern.slots.filter((s) => s.vocabId !== slot.vocabId),
        3,
      ).map((s) => s.form)
      const options = shuffle([slot.form, ...otherForms])
      exercises.push({
        kind: 'pattern',
        frame: pattern.frame,
        frameTranslation: pattern.frameTranslation,
        slotTranslation: slot.translation,
        options,
        correctIndex: options.indexOf(slot.form),
        vocabIds: [slot.vocabId],
      })
    }
  }
  // One matching game if enough vocab
  if (vocab.length >= 4) {
    exercises.push({
      kind: 'matching',
      pairs: sample(vocab, Math.min(5, vocab.length)).map((v) => ({
        left: v.lemma,
        right: v.translation,
        vocabId: v.id,
      })),
    })
  }

  // Cap and shuffle, but keep first exposure (choice→EN of first word) early
  const capped = shuffle(exercises).slice(0, 14)
  return capped
}
