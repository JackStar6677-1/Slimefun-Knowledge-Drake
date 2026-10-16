#!/usr/bin/env python3
"""
tools/gen_more_shorts.py — Generador de audio y subtítulos para Shorts 3 y 4 (Bilingüe ES/EN).
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

MORE_SHORTS = [
    {
        "id": "short_customgui_es",
        "title": "Maquinaria 3D y GUIs en Minecraft 1.21 sin Mods",
        "lang": "es",
        "voice": "es-CL-LorenzoNeural",
        "file": "short_customgui_es.mp3",
        "json_out": ROOT / "video" / "src" / "short-customgui.json",
        "text": (
            "¿Cómo logramos que reactores nucleares y maquinaria industrial funcionen en Minecraft sin obligar a los jugadores a instalar Forge o Fabric? "
            "En DrakesCraft usamos la potencia de CustomModelData y Resource Packs optimizados por servidor. "
            "El servidor mapea dinámicamente cada ítem y bloque de Slimefun a geometrías tridimensionales reales. "
            "Cualquier cliente vanilla en versión uno veintidós se conecta al instante, abre interfaces visuales complejas y procesa energía en tiempo real. "
            "Pruébalo sin mods en play punto drakescraft punto ce ele y entra a nuestro Discord oficial."
        )
    },
    {
        "id": "short_architecture_en",
        "title": "Why We Decoupled Minecraft Compute from Orchestration",
        "lang": "en",
        "voice": "en-US-GuyNeural",
        "file": "short_architecture_en.mp3",
        "json_out": ROOT / "video" / "src" / "short-architecture.json",
        "text": (
            "Running modern Minecraft with eighty Slimefun addons on a single VPS is a recipe for disaster. "
            "At DrakesCraft, we segregated the system into isolated fault domains. "
            "The pure game tick loop executes on high frequency cores at our Dallas compute node with Generational ZGC. "
            "Meanwhile, relational databases, telemetry bots, and Docker microservices reside on our Linux orchestration server. "
            "Even if web APIs experience heavy load, Minecraft maintains rock solid twenty point zero TPS. "
            "Experience high availability at play dot drakescraft dot cl."
        )
    }
]

async def main():
    print("=" * 60)
    print("GENERANDO VOCES Y SUBTÍTULOS PARA SHORTS 3 Y 4")
    print("=" * 60)
    
    for s in MORE_SHORTS:
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
