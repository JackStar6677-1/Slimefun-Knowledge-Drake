#!/usr/bin/env python3
"""
tools/gen_sf_shorts_pair3.py — Generador de locución para pareja de Shorts 9 & 10:
- Short 9 (ES): ¿Cómo Evitar que tu Reactor Nuclear Explote en Slimefun?
- Short 10 (EN): Why Memory Pointers Beat Entities in Minecraft Slimefun
"""
import asyncio
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from voice_engine import generate_speech

AUDIO_DIR = ROOT / "video" / "public" / "audio"
JSON_DIR = ROOT / "video" / "src"

SHORTS = [
    {
        "id": "short_sf_reactor_safety",
        "file": "short_sf_reactor_safety.mp3",
        "json_out": JSON_DIR / "short-sf-reactor-safety.json",
        "voice": "es-CL-LorenzoNeural",
        "rate": "+2%",
        "pitch": "-1Hz",
        "spoken_text": (
            "¿Quieres generar mil doscientos Joules por segundo con un reactor nuclear en Slimefun sin volar tu base en pedazos? "
            "Sigue esta regla de seguridad crítica. "
            "Un reactor jamás debe depender de una sola línea de refrigerante. "
            "Configura dos Cargo Nodes independientes abasteciendo Varillas Criogénicas desde contenedores separados. "
            "Si un contenedor se vacía, la línea secundaria mantendrá la temperatura bajo control mientras Saori te alerta en Discord. "
            "Ingeniería a prueba de fallos en play punto drakescraft punto ce ele."
        ),
        "text": (
            "¿Cómo Evitar que tu Reactor Explote en Slimefun?\n"
            "1. Jamás confíes en una sola línea de refrigerante.\n"
            "2. Configura 2 Cargo Nodes con redundancia N+1.\n"
            "3. Contenedores separados de varillas criogénicas.\n"
            "¡Genera 1,200 J/s seguro en play.drakescraft.cl!"
        )
    },
    {
        "id": "short_sf_memory_pointers",
        "file": "short_sf_memory_pointers.mp3",
        "json_out": JSON_DIR / "short-sf-memory-pointers.json",
        "voice": "en-US-ChristopherNeural",
        "rate": "+2%",
        "pitch": "+0Hz",
        "spoken_text": (
            "Here is why custom inventory plugins like Networks v6 and Fluffy Barrels beat vanilla entities every single time. "
            "Vanilla storage creates entity drops, tile-entity tick listeners, and chunk re-renders that ruin server performance. "
            "In DrakesCraft, we engineered custom data pointers directly inside the Java Virtual Machine heap. "
            "When millions of items move through our cargo pipelines, zero physical entities are spawned in the Minecraft world. "
            "The result is twenty point zero flawless ticks per second under extreme load. "
            "Experience high-performance Minecraft on play dot drakescraft dot cl."
        ),
        "text": (
            "Why JVM Memory Pointers Beat Entities in Minecraft:\n"
            "1. Vanilla = tile-entity tick lag & entity drops.\n"
            "2. Custom Networks v6 = direct RAM pointer updates.\n"
            "3. Millions of items with 0 physical entity spawns.\n"
            "Flawless 20.0 TPS on play.drakescraft.cl!"
        )
    }
]

async def main():
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    print("=" * 60)
    print("GENERANDO AUDIO Y STORYBOARD PARA SHORTS 9 & 10")
    print("=" * 60)

    for s in SHORTS:
        out_path = AUDIO_DIR / s["file"]
        print(f"\nGenerando {s['id']} ({s['voice']})...")
        res = await generate_speech(
            text=s["spoken_text"],
            output_path=out_path,
            voice=s["voice"],
            rate=s["rate"],
            pitch=s["pitch"]
        )
        duration = res["duration"]
        words = res["words"]
        frames = int(duration * 30) + 30
        print(f"  [OK] Duracion: {duration:.2f}s ({frames} frames) | {len(words)} palabras")

        data = {
            "id": s["id"],
            "voice": s["voice"],
            "duration": duration,
            "frames": frames,
            "audio_file": s["file"],
            "text": s["text"],
            "spoken_text": s["spoken_text"],
            "words": words
        }
        with open(s["json_out"], "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"  [OK] Guardado metadata JSON en {s['json_out'].name}")

    print("\n[OK] Generacion de audio completada con exito.")

if __name__ == "__main__":
    asyncio.run(main())
