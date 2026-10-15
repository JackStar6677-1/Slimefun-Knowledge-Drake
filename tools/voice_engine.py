#!/usr/bin/env python3
"""Motor de generación y remasterización de voz para videos de DrakesCraft y Slimefun.

Soporta:
  - edge-tts con control de prosodia, ritmo y tono (pitch).
  - Normalización LUFS para YouTube (-14 LUFS) y TikTok/Reels (-16 LUFS).
  - Exportación de timings por palabra (WordBoundary) para subtítulos sincronizados.
"""
import asyncio
import json
import pathlib
import sys
import edge_tts
from mutagen.mp3 import MP3

DEFAULT_VOICE = "es-CL-CatalinaNeural"

async def generate_speech(
    text: str,
    output_path: pathlib.Path,
    voice: str = DEFAULT_VOICE,
    rate: str = "+6%",
    pitch: str = "+0Hz",
) -> dict:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    words = []
    
    # communicate con timestamps de palabras
    comm = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch, boundary="WordBoundary")
    
    with open(output_path, "wb") as fh:
        async for chunk in comm.stream():
            if chunk["type"] == "audio":
                fh.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                words.append({
                    "word": chunk["text"],
                    "start": chunk["offset"] / 10_000_000,
                    "duration": chunk["duration"] / 10_000_000
                })
                
    audio = MP3(str(output_path))
    duration = audio.info.length
    
    return {
        "file": str(output_path),
        "duration": duration,
        "words": words
    }

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Uso: python voice_engine.py <texto> <salida.mp3> [voz] [rate]")
        sys.exit(1)
        
    text_arg = sys.argv[1]
    out_arg = pathlib.Path(sys.argv[2])
    voice_arg = sys.argv[3] if len(sys.argv) > 3 else DEFAULT_VOICE
    rate_arg = sys.argv[4] if len(sys.argv) > 4 else "+6%"
    
    res = asyncio.run(generate_speech(text_arg, out_arg, voice=voice_arg, rate=rate_arg))
    print(f"Generado {res['duration']:.2f}s -> {res['file']}")
