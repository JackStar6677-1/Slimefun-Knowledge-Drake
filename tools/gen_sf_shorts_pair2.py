#!/usr/bin/env python3
"""
tools/gen_sf_shorts_pair2.py — Generador de locución para pareja de Shorts 7 & 8:
- Short 7 (ES): ¿Por Qué NO Usar Tolvas en Slimefun?
- Short 8 (EN): The SRE Rules of Slimefun Cargo Logistics
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
        "id": "short_sf_no_hoppers",
        "file": "short_sf_no_hoppers.mp3",
        "json_out": JSON_DIR / "short-sf-no-hoppers.json",
        "voice": "es-CL-LorenzoNeural",
        "rate": "+2%",
        "pitch": "-1Hz",
        "spoken_text": (
            "¿Por qué está estrictamente prohibido usar tolvas comunes para automatizar Slimefun en DrakesCraft? "
            "Una sola tolva vanilla escanea el mundo cada tick buscando entidades flotantes y contenedores vecinos. "
            "Si colocas cincuenta tolvas en tu fábrica, la JVM sufrirá picos de lag y desincronización de inventario. "
            "La solución oficial es Cargo Management. "
            "Los Cargo Nodes transfieren ítems directamente en memoria, usando canales de frecuencia cero lag y filtrado inteligente sin generar entidades físicas. "
            "Automatiza como un verdadero ingeniero en play punto drakescraft punto ce ele."
        ),
        "text": (
            "¿Por Qué NO Usar Tolvas en Slimefun?\n"
            "1. Tolvas vanilla = escaneo por tick y lag masivo.\n"
            "2. Cargo Management = transferencia directa en memoria RAM.\n"
            "3. 16 canales de frecuencia y filtrado inteligente.\n"
            "¡Ingeniería zero-lag en play.drakescraft.cl!"
        )
    },
    {
        "id": "short_sf_cargo_rules",
        "file": "short_sf_cargo_rules.mp3",
        "json_out": JSON_DIR / "short-sf-cargo-rules.json",
        "voice": "en-US-ChristopherNeural",
        "rate": "+2%",
        "pitch": "+0Hz",
        "spoken_text": (
            "If you want high-throughput industrial automation without tanking your server ticks, follow these SRE rules for Slimefun cargo. "
            "First: avoid closed cargo feedback loops. Items circulating indefinitely consume CPU cycles traversing graph trees. "
            "Second: segregate your cargo channels. Slimefun provides sixteen independent frequency channels. Keep channel zero strictly for raw ores, channel one for dusts, and channel two for ingots. "
            "Third: connect Cargo Output Nodes directly to auto-crafters with round-robin distribution to prevent buffer saturation. "
            "Experience zero-lag industrial engineering right now on play dot drakescraft dot cl."
        ),
        "text": (
            "The SRE Rules of Slimefun Cargo Logistics:\n"
            "1. Avoid feedback loops to stop CPU tree traversal.\n"
            "2. Segregate 16 frequency channels by item type.\n"
            "3. Use round-robin output nodes to prevent buffer saturation.\n"
            "Zero-lag engineering on play.drakescraft.cl!"
        )
    }
]

async def main():
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    print("=" * 60)
    print("GENERANDO AUDIO Y STORYBOARD PARA SHORTS 7 & 8")
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
