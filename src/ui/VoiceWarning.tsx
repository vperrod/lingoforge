import { useEffect, useState } from 'react'
import { VolumeX } from 'lucide-react'
import { hasVoice } from '../audio/tts'

/** Shows once per course when the browser has no TTS voice for it. */
export function VoiceWarning({ lang, courseName }: { lang: string; courseName: string }) {
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    let cancelled = false
    hasVoice(lang).then((ok) => {
      if (!cancelled) setMissing(!ok)
    })
    return () => {
      cancelled = true
    }
  }, [lang])

  if (!missing) return null

  return (
    <div className="clay flex items-start gap-3 border-gold bg-amber-50 p-3" role="status">
      <VolumeX className="size-5 shrink-0 text-gold" aria-hidden />
      <p className="text-sm">
        No {courseName} voice found in this browser — listening exercises will be silent. Edge and
        Chrome on desktop usually include one; on Windows you can add voices under Settings →
        Time &amp; Language → Speech.
      </p>
    </div>
  )
}
