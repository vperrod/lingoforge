import type { Alphabet } from '../types'

export const ruAlphabet: Alphabet = {
  groups: [
    {
      id: 'identical',
      title: 'Old friends',
      description: 'These 5 letters look AND sound like English. You already know them!',
      letters: [
        { letter: 'А', lower: 'а', sound: 'a as in father', example: { word: 'мама', translation: 'mom', hint: 'mama' } },
        { letter: 'К', lower: 'к', sound: 'k as in kite', example: { word: 'кот', translation: 'cat', hint: 'kot' } },
        { letter: 'М', lower: 'м', sound: 'm as in mother', example: { word: 'дом', translation: 'house', hint: 'dom' } },
        { letter: 'О', lower: 'о', sound: 'o as in more (stressed)', example: { word: 'окно', translation: 'window', hint: 'okno' } },
        { letter: 'Т', lower: 'т', sound: 't as in table', example: { word: 'там', translation: 'there', hint: 'tam' } },
      ],
    },
    {
      id: 'false-friends',
      title: 'False friends',
      description: 'Danger zone! These look English but sound completely different. They cause 80% of beginner mistakes.',
      letters: [
        { letter: 'В', lower: 'в', sound: 'v as in vet (NOT b!)', example: { word: 'вода', translation: 'water', hint: 'voda' }, mnemonic: 'Looks like B, sounds like V' },
        { letter: 'Е', lower: 'е', sound: 'ye as in yes', example: { word: 'нет', translation: 'no', hint: 'nyet' }, mnemonic: 'Looks like E, sounds like YE' },
        { letter: 'Н', lower: 'н', sound: 'n as in note (NOT h!)', example: { word: 'нос', translation: 'nose', hint: 'nos' }, mnemonic: 'Looks like H, sounds like N' },
        { letter: 'Р', lower: 'р', sound: 'rolled r (NOT p!)', example: { word: 'рука', translation: 'hand', hint: 'ruka' }, mnemonic: 'Looks like P, sounds like R' },
        { letter: 'С', lower: 'с', sound: 's as in sun (NOT k!)', example: { word: 'сок', translation: 'juice', hint: 'sok' }, mnemonic: 'Looks like C, sounds like S' },
        { letter: 'У', lower: 'у', sound: 'oo as in moon (NOT y!)', example: { word: 'утро', translation: 'morning', hint: 'utro' }, mnemonic: 'Looks like Y, sounds like OO' },
        { letter: 'Х', lower: 'х', sound: 'kh as in loch (NOT x!)', example: { word: 'хлеб', translation: 'bread', hint: 'khleb' }, mnemonic: 'Looks like X, sounds like KH' },
      ],
    },
    {
      id: 'new-shapes',
      title: 'New shapes, familiar sounds',
      description: 'New letter shapes, but the sounds all exist in English.',
      letters: [
        { letter: 'Б', lower: 'б', sound: 'b as in bed', example: { word: 'брат', translation: 'brother', hint: 'brat' }, mnemonic: 'A b with a flat hat' },
        { letter: 'Г', lower: 'г', sound: 'g as in go', example: { word: 'год', translation: 'year', hint: 'god' }, mnemonic: 'A gallows shape' },
        { letter: 'Д', lower: 'д', sound: 'd as in dog', example: { word: 'да', translation: 'yes', hint: 'da' }, mnemonic: 'A little house' },
        { letter: 'З', lower: 'з', sound: 'z as in zoo', example: { word: 'зима', translation: 'winter', hint: 'zima' }, mnemonic: 'Looks like number 3, buzzes like Z' },
        { letter: 'И', lower: 'и', sound: 'ee as in see', example: { word: 'или', translation: 'or', hint: 'ili' }, mnemonic: 'Backwards N says EE' },
        { letter: 'Й', lower: 'й', sound: 'y as in boy', example: { word: 'чай', translation: 'tea', hint: 'chai' }, mnemonic: 'И with a beret — short Y' },
        { letter: 'Л', lower: 'л', sound: 'l as in lamp', example: { word: 'лук', translation: 'onion', hint: 'luk' }, mnemonic: 'A little tent for L' },
        { letter: 'П', lower: 'п', sound: 'p as in pen', example: { word: 'папа', translation: 'dad', hint: 'papa' }, mnemonic: 'Greek pi = P' },
        { letter: 'Ф', lower: 'ф', sound: 'f as in fun', example: { word: 'кофе', translation: 'coffee', hint: 'kofe' }, mnemonic: 'A person with hands on hips saying F' },
        { letter: 'Э', lower: 'э', sound: 'e as in end', example: { word: 'это', translation: 'this', hint: 'eto' }, mnemonic: 'Backwards E, plain E sound' },
        { letter: 'Ю', lower: 'ю', sound: 'yu as in you', example: { word: 'юг', translation: 'south', hint: 'yug' }, mnemonic: 'I-O glued together says YU' },
        { letter: 'Я', lower: 'я', sound: 'ya as in yard', example: { word: 'я', translation: 'I', hint: 'ya' }, mnemonic: 'Backwards R says YA' },
      ],
    },
    {
      id: 'unique',
      title: 'The truly Russian crew',
      description: 'Sounds and signs unique to Russian. Mnemonics are your friends here.',
      letters: [
        { letter: 'Ё', lower: 'ё', sound: 'yo as in yogurt', example: { word: 'ёж', translation: 'hedgehog', hint: 'yozh' }, mnemonic: 'E with eyes says YO' },
        { letter: 'Ж', lower: 'ж', sound: 'zh as in pleasure', example: { word: 'жук', translation: 'beetle', hint: 'zhuk' }, mnemonic: 'Looks like a bug — ZH' },
        { letter: 'Ц', lower: 'ц', sound: 'ts as in cats', example: { word: 'цирк', translation: 'circus', hint: 'tsirk' }, mnemonic: 'U with a tail — TS' },
        { letter: 'Ч', lower: 'ч', sound: 'ch as in chat', example: { word: 'час', translation: 'hour', hint: 'chas' }, mnemonic: 'Upside-down chair — CH' },
        { letter: 'Ш', lower: 'ш', sound: 'sh as in shop', example: { word: 'школа', translation: 'school', hint: 'shkola' }, mnemonic: 'Sharp nails sticking up — SH' },
        { letter: 'Щ', lower: 'щ', sound: 'shch — soft long sh', example: { word: 'щека', translation: 'cheek', hint: 'shcheka' }, mnemonic: 'Ш with a tail — softer, longer' },
        { letter: 'Ы', lower: 'ы', sound: 'i as in ill, but deeper', example: { word: 'сыр', translation: 'cheese', hint: 'syr' }, mnemonic: 'Soft sign + I — say "ih" from the gut' },
        { letter: 'Ь', lower: 'ь', sound: 'soft sign — softens the letter before', example: { word: 'соль', translation: 'salt', hint: 'solʹ' }, mnemonic: 'Silent. Makes the previous consonant soft' },
        { letter: 'Ъ', lower: 'ъ', sound: 'hard sign — tiny pause', example: { word: 'въезд', translation: 'entrance (by car)', hint: 'v-yezd' }, mnemonic: 'Silent. Rare. A tiny speed bump' },
      ],
    },
  ],
}
