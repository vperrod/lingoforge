"""
Generate MP3 audio files for all LingoForge content using edge-tts neural voices.
Run from the project root: python scripts/gen-audio.py

Files saved to public/audio/{lang}/{safe_text}.mp3
  safe_text = text with '/' replaced by '-' (only char unsafe in filenames)
tts.ts uses the same safeText() transformation, no percent-encoding.
When the browser fetches the URL, it auto-encodes Unicode → server decodes → matches file.
"""

import asyncio
import re
import sys
from pathlib import Path

import edge_tts

# Windows consoles default to cp1252 which can't print Cyrillic
sys.stdout.reconfigure(encoding="utf-8", errors="replace")  # type: ignore[attr-defined]

VOICES = {
    "ru": "ru-RU-SvetlanaNeural",
    "es": "es-ES-ElviraNeural",
}

OUT_DIR = Path("public/audio")


def safe_filename(text: str) -> str:
    """Make text safe for use as a filename. Only replace chars invalid in paths."""
    return text.replace("/", "-").replace("\\", "-")


def extract_lemmas(ts_path: str) -> list[str]:
    text = Path(ts_path).read_text(encoding="utf-8")
    return re.findall(r"lemma:\s*['\"]([^'\"]+)['\"]", text)


def extract_forms(ts_path: str) -> list[str]:
    text = Path(ts_path).read_text(encoding="utf-8")
    matches = re.findall(r"forms:\s*\[([^\]]+)\]", text)
    words = []
    for m in matches:
        words.extend(re.findall(r"['\"]([^'\"]+)['\"]", m))
    return words


def extract_alphabet(ts_path: str) -> tuple[list[str], list[str]]:
    text = Path(ts_path).read_text(encoding="utf-8")
    letters = re.findall(r"letter:\s*['\"]([^'\"]+)['\"]", text)
    lowers = re.findall(r"lower:\s*['\"]([^'\"]+)['\"]", text)
    words = re.findall(r"word:\s*['\"]([^'\"]+)['\"]", text)
    return list(set(letters + lowers)), words


async def generate(text: str, voice: str, out_dir: Path) -> None:
    out_path = out_dir / (safe_filename(text) + ".mp3")
    if out_path.exists() and out_path.stat().st_size > 0:
        return
    try:
        communicate = edge_tts.Communicate(text, voice)
        await communicate.save(str(out_path))
        print(f"  OK  {out_path.name}")
    except Exception as e:
        print(f"  SKIP  {text!r}  ({e})")


async def generate_batch(texts: list[str], lang: str) -> None:
    voice = VOICES[lang]
    out_dir = OUT_DIR / lang
    out_dir.mkdir(parents=True, exist_ok=True)
    sem = asyncio.Semaphore(4)  # cap concurrent edge-tts requests to avoid rate limiting

    async def throttled(text: str) -> None:
        async with sem:
            await generate(text, voice, out_dir)

    await asyncio.gather(*[throttled(t) for t in texts])


async def main() -> None:
    print("=== LingoForge audio generation ===\n")

    ru_texts = list(dict.fromkeys(
        extract_lemmas("src/content/courses/ru.ts")
        + extract_forms("src/content/courses/ru.ts")
        + extract_alphabet("src/content/courses/ru-alphabet.ts")[0]
        + extract_alphabet("src/content/courses/ru-alphabet.ts")[1]
    ))
    print(f"Russian: {len(ru_texts)} unique texts")
    await generate_batch(ru_texts, "ru")

    es_texts = list(dict.fromkeys(
        extract_lemmas("src/content/courses/es.ts")
        + extract_forms("src/content/courses/es.ts")
    ))
    print(f"\nSpanish: {len(es_texts)} unique texts")
    await generate_batch(es_texts, "es")

    print(f"\nDone. Files in {OUT_DIR}/")


if __name__ == "__main__":
    asyncio.run(main())
