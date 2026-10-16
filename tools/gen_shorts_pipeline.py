#!/usr/bin/env python3
"""
tools/gen_shorts_pipeline.py — Generador de audio y subtítulos para YouTube Shorts (Bilingüe: ES / EN).
"""
import asyncio
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from voice_engine import generate_speech

AUDIO_DIR = ROOT / "video" / "public" / "audio"
AUDIO_DIR.mkdir(parents=True, exist_ok=True)

SHORTS = [
    {
        "id": "short_saori_es",
        "title": "¿Qué significa SAORI? El Cerebro SRE de DrakesCraft",
        "lang": "es",
        "voice": "es-CL-LorenzoNeural",
        "file": "short_saori_es.mp3",
        "json_out": ROOT / "video" / "src" / "short-saori.json",
        "text": (
            "Muchos en la comunidad piensan que SAORI es sólo un nombre femenino al azar. "
            "Pero en DrakesCraft, cada letra tiene un propósito de ingeniería. "
            "SAORI son siglas: Server Autonomous Orchestrator for Resilient Infrastructure. "
            "Es nuestro enjambre multi-agente que vigila el clúster las veinticuatro horas del día. "
            "Audita el socket de red, analiza la recolección de basura de la máquina virtual de Java, "
            "detecta anomalías y aplica mitigaciones forenses sin necesidad de reiniciar a ciegas ni interrumpir a los jugadores. "
            "Cero pérdida de datos, cero rollbacks. Conéctate en play punto drakescraft punto ce ele y únete a nuestro Discord."
        )
    },
    {
        "id": "short_networks_en",
        "title": "Fixing the Networks v6 Infinity Dupe in Minecraft 1.21",
        "lang": "en",
        "voice": "en-US-GuyNeural",
        "file": "short_networks_en.mp3",
        "json_out": ROOT / "video" / "src" / "short-networks.json",
        "text": (
            "If you have ever managed a Slimefun server, you know the nightmare of Networks version six. "
            "Under concurrent tick loads in modern Minecraft, item synchronization between Infinity Expansion and Fluffy barrels could trigger massive dupe glitches. "
            "Most server owners just ban the addons. "
            "At DrakesCraft, we patched the transaction commit layer inside Networks with atomic verification and zero dupe buffers. "
            "The result is infinite digital storage and stable twenty point zero TPS on Paper one twenty-one. "
            "Join the lab at play dot drakescraft dot cl and check our Discord."
        )
    }
]

async def main():
    print("=" * 60)
    print("GENERANDO VOCES Y SUBTÍTULOS PARA SHORTS BILINGÜES")
    print("=" * 60)
    
    for s in SHORTS:
        out_file = AUDIO_DIR / s["file"]
        print(f"\n[+] Generando {s['id']} ({s['lang'].upper()} - {s['voice']})...")
        res = await generate_speech(s["text"], out_file, voice=s["voice"], rate="+4%")
        print(f"    -> Duración: {res['duration']:.2f}s | Palabras: {len(res['words'])}")
        
        data = {
            "id": s["id"],
            "title": s["title"],
            "lang": s["lang"],
            "file": s["file"],
            "duration": res["duration"],
            "words": res["words"]
        }
        
        with open(s["json_out"], "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"[OK] Guardado en: {s['json_out']}")

if __name__ == "__main__":
    asyncio.run(main())
