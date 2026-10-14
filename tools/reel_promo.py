#!/usr/bin/env python3
"""Promo vertical (Reel / Short) de DrakesCraft en espanol, con subtitulos palabra por palabra.

Las cifras salen del volcado (items distintos = sin las variantes de colores de ColoredEnderChests, addons, modalidades de la web).
Narra con edge-tts (voz chilena) usando las marcas de tiempo por palabra y escribe video/public/reel-promo.json.

  python tools/reel_promo.py [voz]        # por defecto es-CL-CatalinaNeural
"""
from __future__ import annotations

import asyncio
import json
import pathlib
import sys

import edge_tts
from mutagen.mp3 import MP3

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from kb import KB  # noqa: E402

VOICE = sys.argv[1] if len(sys.argv) > 1 else "es-CL-CatalinaNeural"
OUT = ROOT / "video" / "public" / "reel-promo.json"
AUDIO = ROOT / "video" / "public" / "audio"
sys.stdout.reconfigure(encoding="utf-8")


def thousands(n: int) -> str:
    return f"{n:,}".replace(",", ".")


async def narrate(sid: str, text: str) -> dict:
    AUDIO.mkdir(parents=True, exist_ok=True)
    f = AUDIO / f"reel-{sid}.mp3"
    words: list[dict] = []
    comm = edge_tts.Communicate(text, VOICE, rate="+6%", boundary="WordBoundary")
    with open(f, "wb") as fh:
        async for ch in comm.stream():
            if ch["type"] == "audio":
                fh.write(ch["data"])
            elif ch["type"] == "WordBoundary":
                words.append({"w": ch["text"], "t": round(ch["offset"] / 1e7, 3), "d": round(ch["duration"] / 1e7, 3)})
    return {"audio": f"audio/reel-{sid}.mp3", "words": words, "seconds": round(MP3(str(f)).info.length + 0.35, 2)}


async def main() -> None:
    kb = KB()
    unique = sum(1 for i in kb.items.values() if i["addon"] != "ColoredEnderChests")
    addons = len({i["addon"] for i in kb.items.values()})
    approx = (unique // 100) * 100
    scenes = [
        {"id": "hook", "kind": "hook", "big": thousands(approx) + "+", "small": "ítems de Slimefun",
         "text": f"¿Sabías que este servidor de Minecraft tiene casi ocho mil ítems de Slimefun?"},
        {"id": "modes", "kind": "modes", "modes": ["Slimefun", "Clásico", "SkyBlock", "OneBlock", "Laboratorio"], "addons": addons,
         "text": f"{addons} addons y cinco modalidades: Slimefun, Clásico, SkyBlock, OneBlock y un laboratorio creativo."},
        {"id": "dust", "kind": "dust", "dusts": ["COPPER", "ZINC", "TIN", "ALUMINUM", "LEAD", "SILVER", "GOLD", "IRON", "MAGNESIUM"],
         "text": "Convierte simple cobblestone en nueve tipos de polvo de metal, y automatiza todo hasta un cofre."},
        {"id": "cta", "kind": "cta", "ip": "mc.drakescraft.cl", "line": "Java y Bedrock",
         "text": "Entra ya: mc punto drakescraft punto cl. Java y Bedrock. Link en la bio."},
    ]
    for s in scenes:
        s.update(await narrate(s["id"], s["text"]))
        print(s["id"], s["seconds"], len(s["words"]), "palabras")
    OUT.write_text(json.dumps({"fps": 30, "voice": VOICE, "scenes": scenes, "facts": {"unique_items": unique, "addons": addons}},
                              ensure_ascii=False, indent=1), encoding="utf-8")
    print("total", round(sum(s["seconds"] for s in scenes), 1), "s ->", OUT)


asyncio.run(main())
