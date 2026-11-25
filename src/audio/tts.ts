/**
 * TTS: tries pre-generated neural-voice MP3 first, falls back to Web Speech API.
 *
 * Files live at /audio/{lang}/{safeText}.mp3 — same transform used in gen-audio.py.
 * Browser auto-encodes Unicode chars in the URL; server decodes → matches filename.
 * No manual percent-encoding: that caused double-encoding (file %D0%BF.mp3 ≠ path привет).
 */

/**
 * Must match safe_filename() in scripts/gen-audio.py. '?', '#' and '%' are
 * dropped rather than kept: they are legal in a filename but start the
 * query/fragment (or a percent-escape) in a URL, so '/audio/ru/Где метро?.mp3' fetches '/audio/ru/Где метро' and
 * gets the SPA shell back instead of the MP3.
 */
function safeText(text: string): string {
  return text.replace(/[/\\]/g, '-').replace(/[?#%]/g, '')
}

export function audioUrl(text: string, lang: string): string {
  const prefix = lang.split('-')[0]
  // import.meta.env.BASE_URL = '/lingoforge/' on GitHub Pages, './' locally
  return `${import.meta.env.BASE_URL}audio/${prefix}/${safeText(text)}.mp3`
}

let currentAudio: HTMLAudioElement | null = null
let settleCurrent: (() => void) | null = null
// Bumped by stopSpeaking so an in-flight speak() knows not to fall back to Web Speech.
let stopCount = 0

// Loaded elements by URL, so a replay doesn't request the MP3 again. Kept small:
// browsers cap how many media players can be alive at once.
const AUDIO_CACHE_SIZE = 20
const audioCache = new Map<string, HTMLAudioElement>()

function getAudio(url: string): HTMLAudioElement {
  let el = audioCache.get(url)
  // A still-playing element can't be shared: its pending promise would never settle.
  if (el && !el.paused) return new Audio(url)
  if (el) el.currentTime = 0
  else el = new Audio(url)
  audioCache.delete(url) // re-insert so the least recently used stays first
  audioCache.set(url, el)
  if (audioCache.size > AUDIO_CACHE_SIZE) audioCache.delete(audioCache.keys().next().value!)
  return el
}

async function playAudioFile(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const el = getAudio(url)
    // A failed element stays broken, so drop it and let the next call reload.
    const fail = () => {
      audioCache.delete(url)
      resolve(false)
    }
    currentAudio = el
    settleCurrent = () => resolve(false)
    el.onended = () => resolve(true)
    el.onerror = fail
    el.play().catch(fail)
  })
}

/** Cut playback short — the mic must not record the app talking to itself. */
export function stopSpeaking(): void {
  stopCount++
  currentAudio?.pause() // fires neither ended nor error, so settle the promise by hand
  settleCurrent?.()
  currentAudio = null
  settleCurrent = null
  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
}

// ── Web Speech API fallback ────────────────────────────────────────────────

let voicesLoaded = false

function ensureVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const synth = window.speechSynthesis
    const voices = synth.getVoices()
    if (voices.length > 0 || voicesLoaded) {
      voicesLoaded = true
      resolve(voices)
      return
    }
    synth.addEventListener('voiceschanged', () => {
      voicesLoaded = true
      resolve(synth.getVoices())
    }, { once: true })
    setTimeout(() => resolve(synth.getVoices()), 1500)
  })
}

export async function findVoice(lang: string): Promise<SpeechSynthesisVoice | null> {
  const voices = await ensureVoices()
  const prefix = lang.split('-')[0]
  return (
    voices.find((v) => v.lang === lang) ??
    voices.find((v) => v.lang.startsWith(prefix)) ??
    null
  )
}

export async function hasVoice(lang: string): Promise<boolean> {
  return ['ru', 'es'].includes(lang.split('-')[0]) || (await findVoice(lang)) !== null
}

async function speakWebSpeech(text: string, lang: string, rate: number): Promise<boolean> {
  if (!('speechSynthesis' in window)) return false
  const synth = window.speechSynthesis
  synth.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang
  utterance.rate = rate
  // No voice for the language means the device would read Cyrillic with an
  // English voice, or stay silent — report that as "nothing was heard".
  const voice = await findVoice(lang)
  if (!voice) return false
  utterance.voice = voice
  return new Promise((resolve) => {
    let started = false
    utterance.onstart = () => { started = true }
    utterance.onend = () => resolve(started)
    utterance.onerror = () => resolve(false)
    synth.speak(utterance)
  })
}

/** Resolves false when the device produced no sound — the caller must say so. */
export async function speak(text: string, lang: string, rate = 0.9): Promise<boolean> {
  const url = audioUrl(text, lang)
  const stopsBefore = stopCount
  const played = await playAudioFile(url)
  if (stopCount !== stopsBefore) return false
  if (import.meta.env.DEV) console.log('[tts]', url, played ? 'mp3 ✓' : 'fallback → Web Speech')
  return played || (await speakWebSpeech(text, lang, rate))
}
