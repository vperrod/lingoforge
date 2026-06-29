import type { CourseId, ReadingText } from './types'

/**
 * Readlang/LingQ-style reading content + RussianPod101/Ruspeach-style graded dialogues.
 * All texts use frequency-first vocab already in the course; words outside it get an
 * inline `glossary`. Original/own content only — never copied from those sites.
 */
export const readings: Record<CourseId, ReadingText[]> = {
  ru: [
    {
      id: 'ru-read-morning',
      title: 'Моё утро',
      level: 'A1',
      kind: 'story',
      body: 'Привет! Я хочу чай. У меня есть хлеб и сыр. Это очень хорошо!\n\nКот хочет молоко. Собака хочет воду. Спасибо!',
      translation:
        'Hi! I want tea. I have bread and cheese. This is very good! The cat wants milk. The dog wants water. Thank you!',
      glossary: { 'моё': 'my', 'утро': 'morning', 'и': 'and', 'хочет': 'wants' },
    },
    {
      id: 'ru-dlg-cafe',
      title: 'В кафе',
      level: 'A1',
      kind: 'dialogue',
      turns: [
        { speaker: 'Анна', text: 'Здравствуйте!', translation: 'Hello!' },
        { speaker: 'Официант', text: 'Здравствуйте! Что вы хотите?', translation: 'Hello! What do you want?' },
        { speaker: 'Анна', text: 'Я хочу кофе и хлеб, пожалуйста.', translation: 'I want coffee and bread, please.' },
        { speaker: 'Официант', text: 'Хорошо.', translation: 'Good.' },
        { speaker: 'Анна', text: 'Спасибо! До свидания.', translation: 'Thank you! Goodbye.' },
      ],
      glossary: { 'официант': 'waiter', 'хотите': '(you) want', 'и': 'and' },
      questions: [
        {
          q: 'What does Anna want?',
          options: ['Coffee and bread', 'Tea and cheese', 'Water', 'Soup'],
          correctIndex: 0,
        },
        {
          q: 'How does Anna say goodbye?',
          options: ['До свидания', 'Привет', 'Спасибо', 'Да'],
          correctIndex: 0,
        },
      ],
    },
  ],
  es: [
    {
      id: 'es-read-morning',
      title: 'Mi mañana',
      level: 'A1',
      kind: 'story',
      body: '¡Hola! Quiero café. Tengo pan y queso. ¡Esto es muy bien!\n\nEl gato quiere leche. El perro quiere agua. ¡Gracias!',
      translation:
        'Hi! I want coffee. I have bread and cheese. This is very good! The cat wants milk. The dog wants water. Thank you!',
      glossary: { 'mi': 'my', 'mañana': 'morning', 'y': 'and', 'quiere': 'wants' },
    },
    {
      id: 'es-dlg-cafe',
      title: 'En el café',
      level: 'A1',
      kind: 'dialogue',
      turns: [
        { speaker: 'Ana', text: '¡Hola!', translation: 'Hi!' },
        { speaker: 'Camarero', text: '¡Hola! ¿Qué quiere?', translation: 'Hi! What do you want?' },
        { speaker: 'Ana', text: 'Quiero café y pan, por favor.', translation: 'I want coffee and bread, please.' },
        { speaker: 'Camarero', text: 'Bien.', translation: 'Good.' },
        { speaker: 'Ana', text: '¡Gracias! Adiós.', translation: 'Thank you! Goodbye.' },
      ],
      glossary: { 'camarero': 'waiter', 'quiere': 'do you want', 'y': 'and' },
      questions: [
        {
          q: 'What does Ana want?',
          options: ['Coffee and bread', 'Tea and cheese', 'Water', 'Soup'],
          correctIndex: 0,
        },
        {
          q: 'How does Ana say goodbye?',
          options: ['Adiós', 'Hola', 'Gracias', 'Sí'],
          correctIndex: 0,
        },
      ],
    },
  ],
}
