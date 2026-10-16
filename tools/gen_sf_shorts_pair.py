#!/usr/bin/env python3
"""
tools/gen_sf_shorts_pair.py — Generador de locución para nuevos Shorts:
- Short 5 (ES): ¿Cómo Iniciar en Slimefun? (Guía Rápida DrakesCraft)
- Short 6 (EN): The 1 Energy Regulator Rule (Slimefun Zero Lag)
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
        "id": "short_sf_start",
        "file": "short_sf_start.mp3",
        "json_out": JSON_DIR / "short-sf-start.json",
        "voice": "es-CL-LorenzoNeural",
        "rate": "+2%",
        "pitch": "-1Hz",
        "spoken_text": (
            "¿Quieres empezar en Slimefun sin frustrarte en DrakesCraft? "
            "Sigue esta ruta rápida de tres pasos. "
            "Paso uno: usa barra sf guide para abrir la guía interactiva y navegar las ramas de tecnología. "
            "Paso dos: escribe barra rtp para teletransportarte al mundo survival, "
            "y asegura tu territorio con barra ps get para obtener bloques de protección automáticos. "
            "Paso tres: construye tu primer multibloque: la Mesa de Trabajo Mejorada, "
            "colocando una mesa de crafteo sobre un dispensador apuntando arriba. "
            "Cero mods requeridos. Conéctate en play punto drakescraft punto ce ele."
        ),
        "text": (
            "¿Cómo empezar en Slimefun sin morir en el intento? "
            "1. /sf guide para abrir el manual interactivo. "
            "2. /rtp y /ps get para proteger tu base de grifeos. "
            "3. Monta tu Mesa Mejorada: Mesa sobre Dispensador. "
            "¡100% vanilla sin mods en play.drakescraft.cl!"
        )
    },
    {
        "id": "short_sf_energy_rule",
        "file": "short_sf_energy_rule.mp3",
        "json_out": JSON_DIR / "short-sf-energy-rule.json",
        "voice": "en-US-ChristopherNeural",
        "rate": "+2%",
        "pitch": "+0Hz",
        "spoken_text": (
            "Here is the golden engineering rule for zero-lag Slimefun networks: "
            "never place two Energy Regulators on the same connected circuit. "
            "During every server tick, Slimefun performs a breadth-first search to traverse the network graph and distribute Joules. "
            "When multiple regulators share connected cables or machines, "
            "the JVM recalculates the graph repeatedly, creating exponential tick lag. "
            "Keep exactly one regulator per isolated energy grid for twenty point zero flawless TPS. "
            "Play lag-free Slimefun right now on play dot drakescraft dot cl."
        ),
        "text": (
            "The 1 Energy Regulator Rule for Zero Lag: "
            "Slimefun uses graph traversal each tick to distribute Joules. "
            "Two regulators in one circuit trigger recursive JVM recalculations. "
            "Exactly 1 regulator per circuit = 20.0 flawless TPS. "
            "Test it on play.drakescraft.cl!"
        )
    }
]

async def main():
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    print("=" * 60)
    print("GENERANDO AUDIO Y STORYBOARD PARA PAREJA DE SHORTS SF")
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
        print(f"  [OK] Duración: {duration:.2f}s ({frames} frames) | {len(words)} palabras")

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
        print(f"  [OK] Guardado: {s['json_out'].name}")

    print("\n" + "=" * 60)
    print("TODOS LOS AUDIOS Y METADATOS GENERADOS EXITOSAMENTE")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(main())
