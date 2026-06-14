"""
Generate MP3 audio files for all LingoForge content using edge-tts neural voices.
Run from the project root: python scripts/gen-audio.py

Files saved to public/audio/{lang}/{percent_encoded_text}.mp3
tts.ts uses encodeURIComponent(text) which produces the same encoding.
"""

import asyncio
import re
import sys
from pathlib import Path
from urllib.parse import quote

import edge_tts

# Windows consoles default to cp1252 which can't print Cyrillic
sys.stdout.reconfigure(encoding="utf-8", errors="replace")  # type: ignore[attr-defined]

VOICES = {
    "ru": "ru-RU-SvetlanaNeural",
    "es": "es-ES-ElviraNeural",
}

OUT_DIR = Path("public/audio")


def extract_lemmas(ts_path: str) -> list[str]:
    """Extract lemma values from a course TS file."""
    text = Path(ts_path).read_text(encoding="utf-8")
    return re.findall(r"lemma:\s*['\"]([^'\"]+)['\"]", text)


def extract_forms(ts_path: str) -> list[str]:
    """Extract word forms from a course TS file."""
    text = Path(ts_path).read_text(encoding="utf-8")
    # forms: ['word1', 'word2']
    matches = re.findall(r"forms:\s*\[([^\]]+)\]", text)
    words = []
    for m in matches:
        words.extend(re.findall(r"['\"]([^'\"]+)['\"]", m))
    return words


def extract_alphabet(ts_path: str) -> tuple[list[str], list[str]]:
    """Extract letters and example words from the alphabet TS file."""
    text = Path(ts_path).read_text(encoding="utf-8")
    # letter: 'А'
    letters = re.findall(r"letter:\s*['\"]([^'\"]+)['\"]", text)
    # lower: 'а'
    lowers = re.findall(r"lower:\s*['\"]([^'\"]+)['\"]", text)
    # word: 'мама'
    words = re.findall(r"word:\s*['\"]([^'\"]+)['\"]", text)
    return list(set(letters + lowers)), words


async def generate(text: str, voice: str, out_path: Path) -> None:
    if out_path.exists():
        return  # skip already generated
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(str(out_path))
    print(f"  OK  {out_path.name}  ({text})")


async def generate_batch(items: list[tuple[str, str]], lang: str) -> None:
    voice = VOICES[lang]
    out_dir = OUT_DIR / lang
    out_dir.mkdir(parents=True, exist_ok=True)

    tasks = []
    for text, label in items:
        filename = quote(text, safe="") + ".mp3"
        out_path = out_dir / filename
        tasks.append(generate(text, voice, out_path))

    await asyncio.gather(*tasks)


async def main() -> None:
    print("=== LingoForge audio generation ===\n")

    # Russian vocab
    ru_lemmas = extract_lemmas("src/content/courses/ru.ts")
    ru_forms = extract_forms("src/content/courses/ru.ts")
    ru_letters, ru_alpha_words = extract_alphabet("src/content/courses/ru-alphabet.ts")

    ru_texts = list(dict.fromkeys(ru_lemmas + ru_forms + ru_letters + ru_alpha_words))
    print(f"Russian: {len(ru_texts)} unique texts")
    await generate_batch([(t, t) for t in ru_texts], "ru")

    # Spanish vocab
    es_lemmas = extract_lemmas("src/content/courses/es.ts")
    es_forms = extract_forms("src/content/courses/es.ts")
    es_texts = list(dict.fromkeys(es_lemmas + es_forms))
    print(f"\nSpanish: {len(es_texts)} unique texts")
    await generate_batch([(t, t) for t in es_texts], "es")

    print(f"\nDone. Files in {OUT_DIR}/")


if __name__ == "__main__":
    asyncio.run(main())
