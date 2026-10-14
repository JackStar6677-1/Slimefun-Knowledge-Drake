#!/usr/bin/env python3
"""Reel de presentacion de DrakesCraft (maximo 30 s): Slimefun, modalidades y web. Espanol, voz chilena femenina.

Cifras: items distintos del volcado (sin las variantes de ColoredEnderChests), modalidades de web.drakescraft.cl, secciones de su menu
(Comandos, Rangos, Slimefun, Tienda). Capturas de la web en video/public/web/ (se toman con Edge headless, ver docs/VIDEO_PIPELINE.md).
Escribe video/public/promo-v2.json. Si la voz pasa de 29,5 s sube la velocidad automaticamente.

  python tools/promo_v2.py [voz]
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
AUDIO = ROOT / "video" / "public" / "audio"
OUT = ROOT / "video" / "public" / "promo-v2.json"
sys.stdout.reconfigure(encoding="utf-8")


async def render(rate: str) -> list[dict]:
    kb = KB()
    unique = sum(1 for i in kb.items.values() if i["addon"] != "ColoredEnderChests")
    approx = (unique // 100) * 100
    scenes = [
        {"id": "hook", "kind": "hook", "big": approx, "small": "ítems de Slimefun",
         "text": "Casi ocho mil ítems de Slimefun en un solo servidor de Minecraft."},
        {"id": "modes", "kind": "modes", "modes": ["Slimefun", "Clásico", "SkyBlock", "OneBlock", "Laboratorio"],
         "text": "Cinco modalidades: Slimefun, Clásico, SkyBlock, OneBlock y laboratorio creativo."},
        {"id": "slimefun", "kind": "slimefun", "block": "ENHANCED_CRAFTING_TABLE",
         "dusts": ["COPPER", "ZINC", "TIN", "ALUMINUM", "LEAD", "SILVER", "GOLD", "IRON", "MAGNESIUM"],
         "text": "Máquinas, energía y automatización, hasta convertir cobblestone en nueve polvos de metal."},
        {"id": "web", "kind": "web", "shots": ["home", "slimefun", "rangos"], "tags": ["Comandos", "Rangos", "Slimefun", "Tienda"],
         "text": "Todo explicado en nuestra web: comandos, rangos, la guía de Slimefun y la tienda."},
        {"id": "cta", "kind": "cta", "ip": "mc.drakescraft.cl", "line": "Java y Bedrock",
         "text": "Entra ya: mc punto drakescraft punto cl. Java y Bedrock. Link en la bio."},
    ]
    AUDIO.mkdir(parents=True, exist_ok=True)
    for s in scenes:
        f = AUDIO / f"promo-v2-{s['id']}.mp3"
        words = []
        comm = edge_tts.Communicate(s["text"], VOICE, rate=rate, boundary="WordBoundary")
        with open(f, "wb") as fh:
            async for ch in comm.stream():
                if ch["type"] == "audio":
                    fh.write(ch["data"])
                elif ch["type"] == "WordBoundary":
                    words.append({"w": ch["text"], "t": round(ch["offset"] / 1e7, 3), "d": round(ch["duration"] / 1e7, 3)})
        s["audio"] = f"audio/promo-v2-{s['id']}.mp3"
        s["words"] = words
        s["seconds"] = round(MP3(str(f)).info.length + 0.25, 2)
    return scenes


async def main() -> None:
    for rate in ("+8%", "+14%", "+20%"):
        scenes = await render(rate)
        total = sum(s["seconds"] for s in scenes)
        print(rate, round(total, 1), "s")
        if total <= 29.6:
            break
    OUT.write_text(json.dumps({"fps": 30, "voice": VOICE, "rate": rate, "scenes": scenes}, ensure_ascii=False, indent=1), encoding="utf-8")
    print("->", OUT)


asyncio.run(main())
