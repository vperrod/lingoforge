/**
 * Speech-to-text wrapper around the Web Speech API (SpeechRecognition).
 * Browser support is inconsistent (notably absent in Firefox) — always
 * feature-detect with isSpeechSupported() before relying on this, and
 * before generating any exercise that requires it.
 */

export function isSpeechSupported(): boolean {
  if (typeof window === 'undefined') return false
  return Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
}

/** Returns a configured recognizer, or null if unsupported. */
export function createRecognizer(lang: string): any | null {
  if (!isSpeechSupported()) return null
  const SpeechRecognitionCtor = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition
  const recognizer = new SpeechRecognitionCtor()
  recognizer.lang = lang
  recognizer.interimResults = false
  recognizer.maxAlternatives = 3
  return recognizer
}
