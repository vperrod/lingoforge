/**
 * Master Russian-style grammar notes — a short "why" shown before a lesson.
 * Keyed by `${courseId}:${lessonId}`. Only a subset of lessons carry a note;
 * lessons without one render straight into exercises as before.
 */
export const grammarNotes: Record<string, string> = {
  'ru:u1s1l1':
    'Russian has no words for "a" or "the" — "хлеб" means both "bread" and "the bread". Context does the work.',
  'ru:u1s2l1':
    'There is no verb "to be" in the present tense. "Это дом" is literally "This house" — it means "This is a house".',
  'ru:u2s1l1':
    'Verbs change their endings by person: хотеть (to want) → я хочу (I want), ты хочешь (you want). The object also shifts: вода → "Я хочу воду" (the accusative case).',
  'ru:u2s2l1':
    '"У меня есть …" literally means "by me there is …" — Russian expresses "I have" with location, not a verb like English.',
  'es:u1s2l1':
    'Spanish has the verb "ser" (to be): "esto es" = "this is". Unlike Russian, the verb is always there.',
  'es:u2s1l1':
    'Nouns have gender: el café, la leche. The word for "the" (el / la) must match. Verbs conjugate too: querer → quiero (I want).',
}
