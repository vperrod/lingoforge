/** Web Speech API wrapper with voice detection per course language. */

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
    synth.addEventListener(
      'voiceschanged',
      () => {
        voicesLoaded = true
        resolve(synth.getVoices())
      },
      { once: true },
    )
    // Safety net: some browsers never fire voiceschanged
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
  return (await findVoice(lang)) !== null
}

export async function speak(text: string, lang: string, rate = 0.9): Promise<void> {
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
