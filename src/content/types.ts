export type CourseId = 'ru' | 'es'

export interface VocabItem {
  id: string
  lemma: string
  translation: string
  /** Inflected forms as they appear in pattern sentences (recognition tolerance) */
  forms?: string[]
  /** Pronunciation hint, e.g. transliteration for Russian */
  hint?: string
}

export interface PatternFrame {
  id: string
  /** Frame with ___ slot, e.g. "Я хочу ___" */
  frame: string
  frameTranslation: string
  /** Vocab ids valid in the slot, with the inflected form to use */
  slots: { vocabId: string; form: string; translation: string }[]
}

export interface Sentence {
  text: string
  translation: string
  /** Vocab ids this sentence teaches/reinforces */
  vocabIds: string[]
}

export type ExerciseType =
  | 'choice'          // multiple choice translation
  | 'wordBank'        // assemble translation from chips
  | 'listening'       // TTS plays, pick or type
  | 'typing'          // free-text translation
  | 'matching'        // match pairs game
  | 'pattern'         // slot substitution in a frame

export interface Lesson {
  id: string
  title: string
  /** New vocab introduced */
  vocabIds: string[]
  patternIds?: string[]
  sentences: Sentence[]
}

export interface Skill {
  id: string
  title: string
  icon: string // lucide icon name
  lessons: Lesson[]
}

export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2'

export interface Unit {
  id: string
  title: string
  description: string
  level: CefrLevel
  /** true = roadmap shell, no content yet — shown as "coming soon", not clickable */
  locked?: boolean
  skills: Skill[]
}

export interface Course {
  id: CourseId
  name: string
  flag: string
  ttsLang: string // BCP-47 for Web Speech, e.g. 'ru-RU'
  vocab: VocabItem[]
  patterns: PatternFrame[]
  units: Unit[]
}

// ---- Alphabet (Russian) ----

export interface AlphabetLetter {
  letter: string // uppercase
  lower: string
  sound: string // approximate English sound
  /** Word example using the letter, with translation */
  example: { word: string; translation: string; hint: string }
  mnemonic?: string
}

export interface AlphabetGroup {
  id: string
  title: string
  description: string
  letters: AlphabetLetter[]
}

export interface Alphabet {
  groups: AlphabetGroup[]
}
