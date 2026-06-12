/**
 * Tolerant answer matching:
 * - case-insensitive, punctuation/extra-space agnostic
 * - Russian: ё ↔ е interchangeable
 * - Spanish: missing accents tolerated (á→a etc.), ñ must be kept distinct? — tolerated too,
 *   beginners type on English keyboards; strictness can rise with crown level later.
 */

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/ё/g, 'е')
    .normalize('NFD')
    // strip combining accents (Spanish á é í ó ú ü; keeps base letter). ñ → n accepted.
    .replace(/[̀-ͯ]/g, '')
    // unify punctuation/whitespace
    .replace(/[¿¡?!.,;:'"«»—–-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function isCorrectAnswer(expected: string, given: string): boolean {
  return normalize(expected) === normalize(given)
}

/** Accept any of several valid surface forms (lemma or inflected forms) */
export function matchesAny(expectedForms: string[], given: string): boolean {
  return expectedForms.some((form) => isCorrectAnswer(form, given))
}
