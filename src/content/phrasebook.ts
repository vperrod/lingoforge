import type { CourseId, PhrasePack } from './types'

/**
 * Loecsen-style situational survival phrases — organised by real-life situation.
 * Single-word phrases that map to course vocab carry a `vocabId` so they can be
 * added to Practice; multi-word phrases are browse + listen only.
 */
export const phrasebook: Record<CourseId, PhrasePack[]> = {
  ru: [
    {
      id: 'ru-essentials',
      title: 'Essentials',
      icon: 'hand',
      phrases: [
        { text: 'Привет', translation: 'Hi', vocabId: 'privet' },
        { text: 'Здравствуйте', translation: 'Hello (formal)', vocabId: 'zdravstvuyte' },
        { text: 'Спасибо', translation: 'Thank you', vocabId: 'spasibo' },
        { text: 'Пожалуйста', translation: 'Please / you are welcome', vocabId: 'pozhaluysta' },
        { text: 'Извините', translation: 'Excuse me / sorry', vocabId: 'izvinite' },
        { text: 'До свидания', translation: 'Goodbye', vocabId: 'do-svidaniya' },
      ],
    },
    {
      id: 'ru-cafe',
      title: 'At the café',
      icon: 'coffee',
      phrases: [
        { text: 'Я хочу кофе, пожалуйста.', translation: 'I want a coffee, please.' },
        { text: 'Можно воду?', translation: 'May I have water?' },
        { text: 'Сколько это стоит?', translation: 'How much is it?' },
        { text: 'Счёт, пожалуйста.', translation: 'The bill, please.' },
      ],
    },
    {
      id: 'ru-help',
      title: 'Getting help',
      icon: 'life-buoy',
      phrases: [
        { text: 'Вы говорите по-английски?', translation: 'Do you speak English?' },
        { text: 'Я не понимаю.', translation: 'I do not understand.' },
        { text: 'Помогите, пожалуйста!', translation: 'Help, please!' },
        { text: 'Где туалет?', translation: 'Where is the toilet?' },
      ],
    },
  ],
  es: [
    {
      id: 'es-essentials',
      title: 'Essentials',
      icon: 'hand',
      phrases: [
        { text: 'Hola', translation: 'Hello', vocabId: 'hola' },
        { text: 'Gracias', translation: 'Thank you', vocabId: 'gracias' },
        { text: 'Por favor', translation: 'Please', vocabId: 'por-favor' },
        { text: 'Perdón', translation: 'Excuse me / sorry', vocabId: 'perdon' },
        { text: 'Adiós', translation: 'Goodbye', vocabId: 'adios' },
      ],
    },
    {
      id: 'es-cafe',
      title: 'At the café',
      icon: 'coffee',
      phrases: [
        { text: 'Quiero un café, por favor.', translation: 'I want a coffee, please.' },
        { text: '¿Me da agua?', translation: 'May I have water?' },
        { text: '¿Cuánto cuesta?', translation: 'How much is it?' },
        { text: 'La cuenta, por favor.', translation: 'The bill, please.' },
      ],
    },
    {
      id: 'es-help',
      title: 'Getting help',
      icon: 'life-buoy',
      phrases: [
        { text: '¿Habla inglés?', translation: 'Do you speak English?' },
        { text: 'No entiendo.', translation: 'I do not understand.' },
        { text: '¡Ayuda, por favor!', translation: 'Help, please!' },
        { text: '¿Dónde está el baño?', translation: 'Where is the toilet?' },
      ],
    },
  ],
}
