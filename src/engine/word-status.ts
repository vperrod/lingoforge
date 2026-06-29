import type { SrsItem } from './srs'

export type WordStatus = 'new' | 'learning' | 'known'

/** Days of stability at which a word is considered well-known (mature). */
const KNOWN_STABILITY = 21

/**
 * LingQ-style word status from SRS state.
 * Not in the deck → new; in the deck but not yet mature → learning; mature → known.
 */
export function wordStatus(item: SrsItem | undefined): WordStatus {
  if (!item) return 'new'
  return item.stability >= KNOWN_STABILITY ? 'known' : 'learning'
}
