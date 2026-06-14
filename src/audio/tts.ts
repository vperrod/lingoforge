/**
 * TTS layer: tries pre-generated neural-voice MP3 first, falls back to Web Speech API.
 * Pre-generated files live at /audio/{lang}/{encodeURIComponent(text)}.mp3
 * Generate with: python scripts/gen-audio.py
 */

const audioCache = new Map<string, HTMLAudioElement>()

function audioUrl(text: string, lang: string): string {
  const prefix = lang.split('-')[0]
  return `/audio/${prefix}/${encodeURIComponent(text)}.mp3`
}

async function playAudioFile(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const cached = audioCache.get(url)
    const el = cached ?? new Audio()

    el.onerror = () => resolve(false)
    el.onended = () => resolve(true)

    if (!cached) {
      el.src = url
      // Probe whether the file exists before we cache it
      el.onerror = () => resolve(false)
      el.oncanplaythrough = () => {
        audioCache.set(url, el)
        el.play().catch(() => resolve(false))
      }
      el.load()
    } else {
      el.currentTime = 0
      el.play().catch(() => resolve(false))
    }
  })
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
  // With pre-generated files we always have audio for supported languages
  return ['ru', 'es'].includes(lang.split('-')[0]) || (await findVoice(lang)) !== null
}

async function speakWebSpeech(text: string, lang: string, rate: number): Promise<void> {
  if (!('speechSynthesis' in window)) return
  const synth = window.speechSynthesis
  synth.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang
  utterance.rate = rate
  const voice = await findVoice(lang)
  if (voice) utterance.voice = voice
  return new Promise((resolve) => {
    utterance.onend = () => resolve()
    utterance.onerror = () => resolve()
    synth.speak(utterance)
  })
}

export async function speak(text: string, lang: string, rate = 0.9): Promise<void> {
  const url = audioUrl(text, lang)
  const played = await playAudioFile(url)
  if (!played) {
    // Pre-generated file missing or blocked — fall back to Web Speech API
    await speakWebSpeech(text, lang, rate)
  }
}
