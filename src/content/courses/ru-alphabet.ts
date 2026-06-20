import type { Alphabet } from '../types'

export const ruAlphabet: Alphabet = {
  groups: [
    {
      id: 'identical',
      title: 'Old friends',
      description: 'These 5 letters look AND sound like English. You already know them!',
      letters: [
        {
          letter: 'А', lower: 'а', sound: 'a as in father',
          example: { word: 'мама', translation: 'mom', hint: 'mama', position: 'middle' },
          extraExamples: [
            { word: 'арбуз', translation: 'watermelon', hint: 'arbuz', position: 'start' },
            { word: 'луна', translation: 'moon', hint: 'luna', position: 'end' },
          ],
        },
        {
          letter: 'К', lower: 'к', sound: 'k as in kite',
          example: { word: 'кот', translation: 'cat', hint: 'kot', position: 'start' },
          extraExamples: [
            { word: 'рука', translation: 'hand', hint: 'ruka', position: 'middle' },
            { word: 'парк', translation: 'park', hint: 'park', position: 'end' },
          ],
        },
        {
          letter: 'М', lower: 'м', sound: 'm as in mother',
          example: { word: 'дом', translation: 'house', hint: 'dom', position: 'end' },
          extraExamples: [
            { word: 'март', translation: 'March', hint: 'mart', position: 'start' },
            { word: 'лампа', translation: 'lamp', hint: 'lampa', position: 'middle' },
          ],
        },
        {
          letter: 'О', lower: 'о', sound: 'o as in more (stressed)',
          example: { word: 'окно', translation: 'window', hint: 'okno', position: 'start' },
          extraExamples: [
            { word: 'молоко', translation: 'milk', hint: 'moloko', position: 'middle' },
            { word: 'кино', translation: 'cinema', hint: 'kino', position: 'end' },
          ],
        },
        {
          letter: 'Т', lower: 'т', sound: 't as in table',
          example: { word: 'там', translation: 'there', hint: 'tam', position: 'start' },
          extraExamples: [
            { word: 'кот', translation: 'cat', hint: 'kot', position: 'end' },
            { word: 'ветер', translation: 'wind', hint: 'veter', position: 'middle' },
          ],
        },
      ],
    },
    {
      id: 'false-friends',
      title: 'False friends',
      description: 'Danger zone! These look English but sound completely different. They cause 80% of beginner mistakes.',
      letters: [
        {
          letter: 'В', lower: 'в', sound: 'v as in vet (NOT b!)',
          example: { word: 'вода', translation: 'water', hint: 'voda', position: 'start' },
          extraExamples: [
            { word: 'слово', translation: 'word', hint: 'slovo', position: 'middle' },
            { word: 'остров', translation: 'island', hint: 'ostrov', position: 'end' },
          ],
          mnemonic: 'Looks like B, sounds like V',
          confusables: ['Б'],
        },
        {
          letter: 'Е', lower: 'е', sound: 'ye as in yes',
          example: { word: 'нет', translation: 'no', hint: 'nyet', position: 'middle' },
          extraExamples: [
            { word: 'если', translation: 'if', hint: 'yesli', position: 'start' },
            { word: 'море', translation: 'sea', hint: 'morye', position: 'end' },
          ],
          mnemonic: 'Looks like E, sounds like YE',
          confusables: ['Ё', 'Э'],
        },
        {
          letter: 'Н', lower: 'н', sound: 'n as in note (NOT h!)',
          example: { word: 'нос', translation: 'nose', hint: 'nos', position: 'start' },
          extraExamples: [
            { word: 'окно', translation: 'window', hint: 'okno', position: 'middle' },
            { word: 'сон', translation: 'dream', hint: 'son', position: 'end' },
          ],
          mnemonic: 'Looks like H, sounds like N',
        },
        {
          letter: 'Р', lower: 'р', sound: 'rolled r (NOT p!)',
          example: { word: 'рука', translation: 'hand', hint: 'ruka', position: 'start' },
          extraExamples: [
            { word: 'город', translation: 'city', hint: 'gorod', position: 'middle' },
            { word: 'сыр', translation: 'cheese', hint: 'syr', position: 'end' },
          ],
          mnemonic: 'Looks like P, sounds like R',
          confusables: ['П'],
        },
        {
          letter: 'С', lower: 'с', sound: 's as in sun (NOT k!)',
          example: { word: 'сок', translation: 'juice', hint: 'sok', position: 'start' },
          extraExamples: [
            { word: 'маска', translation: 'mask', hint: 'maska', position: 'middle' },
            { word: 'нос', translation: 'nose', hint: 'nos', position: 'end' },
          ],
          mnemonic: 'Looks like C, sounds like S',
        },
        {
          letter: 'У', lower: 'у', sound: 'oo as in moon (NOT y!)',
          example: { word: 'утро', translation: 'morning', hint: 'utro', position: 'start' },
          extraExamples: [
            { word: 'друг', translation: 'friend', hint: 'drug', position: 'middle' },
            { word: 'внизу', translation: 'below', hint: 'vnizu', position: 'end' },
          ],
          mnemonic: 'Looks like Y, sounds like OO',
        },
        {
          letter: 'Х', lower: 'х', sound: 'kh as in loch (NOT x!)',
          example: { word: 'хлеб', translation: 'bread', hint: 'khleb', position: 'start' },
          extraExamples: [
            { word: 'ухо', translation: 'ear', hint: 'ukho', position: 'middle' },
            { word: 'мех', translation: 'fur', hint: 'mekh', position: 'end' },
          ],
          mnemonic: 'Looks like X, sounds like KH',
        },
      ],
    },
    {
      id: 'new-shapes',
      title: 'New shapes, familiar sounds',
      description: 'New letter shapes, but the sounds all exist in English.',
      letters: [
        {
          letter: 'Б', lower: 'б', sound: 'b as in bed',
          example: { word: 'брат', translation: 'brother', hint: 'brat', position: 'start' },
          extraExamples: [
            { word: 'работа', translation: 'work', hint: 'rabota', position: 'middle' },
            { word: 'хлеб', translation: 'bread', hint: 'khleb', position: 'end' },
          ],
          mnemonic: 'A b with a flat hat',
          confusables: ['В', 'Ь'],
        },
        {
          letter: 'Г', lower: 'г', sound: 'g as in go',
          example: { word: 'год', translation: 'year', hint: 'god', position: 'start' },
          extraExamples: [
            { word: 'нога', translation: 'leg', hint: 'noga', position: 'middle' },
            { word: 'друг', translation: 'friend', hint: 'drug', position: 'end' },
          ],
          mnemonic: 'A gallows shape',
        },
        {
          letter: 'Д', lower: 'д', sound: 'd as in dog',
          example: { word: 'да', translation: 'yes', hint: 'da', position: 'start' },
          extraExamples: [
            { word: 'город', translation: 'city', hint: 'gorod', position: 'middle' },
            { word: 'сад', translation: 'garden', hint: 'sad', position: 'end' },
          ],
          mnemonic: 'A little house',
        },
        {
          letter: 'З', lower: 'з', sound: 'z as in zoo',
          example: { word: 'зима', translation: 'winter', hint: 'zima', position: 'start' },
          extraExamples: [
            { word: 'глаза', translation: 'eyes', hint: 'glaza', position: 'middle' },
            { word: 'мороз', translation: 'frost', hint: 'moroz', position: 'end' },
          ],
          mnemonic: 'Looks like number 3, buzzes like Z',
        },
        {
          letter: 'И', lower: 'и', sound: 'ee as in see',
          example: { word: 'или', translation: 'or', hint: 'ili', position: 'start' },
          extraExamples: [
            { word: 'книга', translation: 'book', hint: 'kniga', position: 'middle' },
            { word: 'такси', translation: 'taxi', hint: 'taksi', position: 'end' },
          ],
          mnemonic: 'Backwards N says EE',
          confusables: ['Й'],
        },
        {
          letter: 'Й', lower: 'й', sound: 'y as in boy',
          example: { word: 'чай', translation: 'tea', hint: 'chai', position: 'end' },
          extraExamples: [
            { word: 'йогурт', translation: 'yogurt', hint: 'yogurt', position: 'start' },
            { word: 'майка', translation: 'T-shirt', hint: 'maika', position: 'middle' },
          ],
          mnemonic: 'И with a beret — short Y',
          confusables: ['И'],
        },
        {
          letter: 'Л', lower: 'л', sound: 'l as in lamp',
          example: { word: 'лук', translation: 'onion', hint: 'luk', position: 'start' },
          extraExamples: [
            { word: 'молоко', translation: 'milk', hint: 'moloko', position: 'middle' },
            { word: 'стол', translation: 'table', hint: 'stol', position: 'end' },
          ],
          mnemonic: 'A little tent for L',
        },
        {
          letter: 'П', lower: 'п', sound: 'p as in pen',
          example: { word: 'папа', translation: 'dad', hint: 'papa', position: 'start' },
          extraExamples: [
            { word: 'лампа', translation: 'lamp', hint: 'lampa', position: 'middle' },
            { word: 'суп', translation: 'soup', hint: 'sup', position: 'end' },
          ],
          mnemonic: 'Greek pi = P',
          confusables: ['Р'],
        },
        {
          letter: 'Ф', lower: 'ф', sound: 'f as in fun',
          example: { word: 'кофе', translation: 'coffee', hint: 'kofe', position: 'middle' },
          extraExamples: [
            { word: 'факт', translation: 'fact', hint: 'fakt', position: 'start' },
            { word: 'шарф', translation: 'scarf', hint: 'sharf', position: 'end' },
          ],
          mnemonic: 'A person with hands on hips saying F',
        },
        {
          letter: 'Э', lower: 'э', sound: 'e as in end',
          example: { word: 'это', translation: 'this', hint: 'eto', position: 'start' },
          extraExamples: [
            { word: 'поэт', translation: 'poet', hint: 'poet', position: 'middle' },
            { word: 'кафе', translation: 'café', hint: 'kafe', position: 'end' },
          ],
          mnemonic: 'Backwards E, plain E sound',
          confusables: ['Е'],
        },
        {
          letter: 'Ю', lower: 'ю', sound: 'yu as in you',
          example: { word: 'юг', translation: 'south', hint: 'yug', position: 'start' },
          extraExamples: [
            { word: 'люди', translation: 'people', hint: 'lyudi', position: 'middle' },
            { word: 'пою', translation: 'I sing', hint: 'poyu', position: 'end' },
          ],
          mnemonic: 'I-O glued together says YU',
        },
        {
          letter: 'Я', lower: 'я', sound: 'ya as in yard',
          example: { word: 'я', translation: 'I', hint: 'ya', position: 'start' },
          extraExamples: [
            { word: 'яблоко', translation: 'apple', hint: 'yabloko', position: 'start' },
            { word: 'земля', translation: 'earth', hint: 'zemlya', position: 'end' },
          ],
          mnemonic: 'Backwards R says YA',
        },
      ],
    },
    {
      id: 'unique',
      title: 'The truly Russian crew',
      description: 'Sounds and signs unique to Russian. Mnemonics are your friends here.',
      letters: [
        {
          letter: 'Ё', lower: 'ё', sound: 'yo as in yogurt',
          example: { word: 'ёж', translation: 'hedgehog', hint: 'yozh', position: 'start' },
          extraExamples: [
            { word: 'ёлка', translation: 'fir tree', hint: 'yolka', position: 'start' },
            { word: 'мёд', translation: 'honey', hint: 'myod', position: 'middle' },
          ],
          mnemonic: 'E with eyes says YO',
          confusables: ['Е'],
        },
        {
          letter: 'Ж', lower: 'ж', sound: 'zh as in pleasure',
          example: { word: 'жук', translation: 'beetle', hint: 'zhuk', position: 'start' },
          extraExamples: [
            { word: 'кожа', translation: 'skin', hint: 'kozha', position: 'middle' },
            { word: 'нож', translation: 'knife', hint: 'nozh', position: 'end' },
          ],
          mnemonic: 'Looks like a bug — ZH',
          confusables: ['Ш'],
        },
        {
          letter: 'Ц', lower: 'ц', sound: 'ts as in cats',
          example: { word: 'цирк', translation: 'circus', hint: 'tsirk', position: 'start' },
          extraExamples: [
            { word: 'улица', translation: 'street', hint: 'ulitsa', position: 'middle' },
            { word: 'отец', translation: 'father', hint: 'otets', position: 'end' },
          ],
          mnemonic: 'U with a tail — TS',
        },
        {
          letter: 'Ч', lower: 'ч', sound: 'ch as in chat',
          example: { word: 'час', translation: 'hour', hint: 'chas', position: 'start' },
          extraExamples: [
            { word: 'ночь', translation: 'night', hint: 'noch', position: 'middle' },
            { word: 'мяч', translation: 'ball', hint: 'myach', position: 'end' },
          ],
          mnemonic: 'Upside-down chair — CH',
        },
        {
          letter: 'Ш', lower: 'ш', sound: 'sh as in shop',
          example: { word: 'школа', translation: 'school', hint: 'shkola', position: 'start' },
          extraExamples: [
            { word: 'каша', translation: 'porridge', hint: 'kasha', position: 'middle' },
            { word: 'душ', translation: 'shower', hint: 'dush', position: 'end' },
          ],
          mnemonic: 'Sharp nails sticking up — SH',
          confusables: ['Щ', 'Ж'],
        },
        {
          letter: 'Щ', lower: 'щ', sound: 'shch — soft long sh',
          example: { word: 'щека', translation: 'cheek', hint: 'shcheka', position: 'start' },
          extraExamples: [
            { word: 'овощи', translation: 'vegetables', hint: 'ovoshchi', position: 'middle' },
            { word: 'борщ', translation: 'borscht', hint: 'borshch', position: 'end' },
          ],
          mnemonic: 'Ш with a tail — softer, longer',
          confusables: ['Ш'],
        },
        {
          letter: 'Ы', lower: 'ы', sound: 'i as in ill, but deeper',
          example: { word: 'сыр', translation: 'cheese', hint: 'syr', position: 'middle' },
          extraExamples: [
            { word: 'мы', translation: 'we', hint: 'my', position: 'end' },
            { word: 'рыба', translation: 'fish', hint: 'ryba', position: 'middle' },
          ],
          mnemonic: 'Soft sign + I — say "ih" from the gut',
          confusables: ['И'],
        },
        {
          letter: 'Ь', lower: 'ь', sound: 'soft sign — softens the letter before',
          example: { word: 'соль', translation: 'salt', hint: 'solʹ', position: 'end' },
          extraExamples: [
            { word: 'мать', translation: 'mother', hint: 'matʹ', position: 'end' },
            { word: 'письмо', translation: 'letter (mail)', hint: 'pisʹmo', position: 'middle' },
          ],
          mnemonic: 'Silent. Makes the previous consonant soft',
          confusables: ['Ъ', 'Б'],
        },
        {
          letter: 'Ъ', lower: 'ъ', sound: 'hard sign — tiny pause',
          example: { word: 'въезд', translation: 'entrance (by car)', hint: 'v-yezd', position: 'middle' },
          extraExamples: [
            { word: 'объект', translation: 'object', hint: 'ob-yekt', position: 'middle' },
            { word: 'подъезд', translation: 'doorway', hint: 'pod-yezd', position: 'middle' },
          ],
          mnemonic: 'Silent. Rare. A tiny speed bump',
          confusables: ['Ь'],
        },
      ],
    },
  ],
}

/** Words that can be read using only letters from the given groups */
export const readingPractice: Record<string, { word: string; hint: string; translation: string }[]> = {
  identical: [
    { word: 'мама', hint: 'mama', translation: 'mom' },
    { word: 'там', hint: 'tam', translation: 'there' },
    { word: 'кот', hint: 'kot', translation: 'cat' },
    { word: 'ток', hint: 'tok', translation: 'current' },
    { word: 'атом', hint: 'atom', translation: 'atom' },
    { word: 'мак', hint: 'mak', translation: 'poppy' },
  ],
  'false-friends': [
    { word: 'вот', hint: 'vot', translation: 'here (is)' },
    { word: 'нос', hint: 'nos', translation: 'nose' },
    { word: 'сон', hint: 'son', translation: 'dream' },
    { word: 'ус', hint: 'us', translation: 'whisker' },
    { word: 'рот', hint: 'rot', translation: 'mouth' },
    { word: 'ухо', hint: 'ukho', translation: 'ear' },
    { word: 'сок', hint: 'sok', translation: 'juice' },
    { word: 'ветер', hint: 'veter', translation: 'wind' },
  ],
  'new-shapes': [
    { word: 'друг', hint: 'drug', translation: 'friend' },
    { word: 'книга', hint: 'kniga', translation: 'book' },
    { word: 'лампа', hint: 'lampa', translation: 'lamp' },
    { word: 'город', hint: 'gorod', translation: 'city' },
    { word: 'зима', hint: 'zima', translation: 'winter' },
    { word: 'стул', hint: 'stul', translation: 'chair' },
    { word: 'суп', hint: 'sup', translation: 'soup' },
    { word: 'папа', hint: 'papa', translation: 'dad' },
  ],
  unique: [
    { word: 'борщ', hint: 'borshch', translation: 'borscht' },
    { word: 'щека', hint: 'shcheka', translation: 'cheek' },
    { word: 'школа', hint: 'shkola', translation: 'school' },
    { word: 'жук', hint: 'zhuk', translation: 'beetle' },
    { word: 'ночь', hint: 'noch', translation: 'night' },
    { word: 'мёд', hint: 'myod', translation: 'honey' },
    { word: 'сыр', hint: 'syr', translation: 'cheese' },
    { word: 'цирк', hint: 'tsirk', translation: 'circus' },
  ],
}

/** Confusable letter pairs for dedicated drills */
export const confusablePairs: { a: string; b: string; tip: string }[] = [
  { a: 'В', b: 'Б', tip: 'В = V (like vet), Б = B (like bed). В looks like B but sounds like V!' },
  { a: 'Р', b: 'П', tip: 'Р = R (rolled), П = P (like pen). Р looks like P but sounds like R!' },
  { a: 'Н', b: 'H', tip: 'Russian Н = N sound. English H doesn\'t exist as a separate Cyrillic letter.' },
  { a: 'С', b: 'C', tip: 'Russian С always = S sound. Never K like English C sometimes is.' },
  { a: 'Ш', b: 'Щ', tip: 'Ш = SH (short, hard). Щ = SHCH (longer, softer). Щ has a tail!' },
  { a: 'Е', b: 'Э', tip: 'Е = YE (yes). Э = plain E (end). Э faces backwards ← ' },
  { a: 'Е', b: 'Ё', tip: 'Е = YE (yes). Ё = YO (yogurt). Ё has two dots (eyes)!' },
  { a: 'И', b: 'Й', tip: 'И = long EE (see). Й = short Y (boy). Й has a little hat!' },
  { a: 'Ь', b: 'Ъ', tip: 'Ь = soft sign (softens). Ъ = hard sign (separates). Ъ has a tail on top.' },
  { a: 'Ь', b: 'Б', tip: 'Ь = soft sign (silent). Б = B sound. Б has a horizontal bar on top.' },
  { a: 'Ш', b: 'Ж', tip: 'Ш = SH (shop). Ж = ZH (pleasure). Ж looks like a bug with antennae!' },
  { a: 'Ы', b: 'И', tip: 'Ы = deep "ih" (gut sound). И = clean "ee" (see). Very different mouth positions!' },
]
