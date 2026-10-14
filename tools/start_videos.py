#!/usr/bin/env python3
"""Videos "Como empezar con Slimefun" en espanol: un reel vertical y un video horizontal para YouTube.

Todo sale del volcado (costes de investigacion, patrones de multibloques, categorias bloqueadas) y de codigo citado:
  - Mesa de crafteo mejorada / Grind Stone / Ore Crusher: el bloque que se toca es el del medio y el dispensador esta DEBAJO
      EnhancedCraftingTable.java:38, GrindStone.java:121, OreCrusher.java:185 (y mensajes "pattern-not-found"/"inventory-empty", :56-60)
  - Ore Washer: el dispensador esta ENCIMA del bloque que se toca (OreWasher.java:95); Sifted Ore -> 1 polvo al azar de 9 (+ Stone Chunk)
  - Categorias bloqueadas: hay que haber investigado TODOS los items de la categoria padre (LockedItemGroup.java:153)
Salida: video/public/start-yt.json y start-reel.json (con audio y tiempos por palabra).
  python tools/start_videos.py [voz]      # por defecto es-CL-CatalinaNeural
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
PUB = ROOT / "video" / "public"
sys.stdout.reconfigure(encoding="utf-8")
kb = KB()


def cost(item_id: str) -> int:
    return kb.items[item_id].get("research_cost") or 0


def cheap() -> list[dict]:
    rows = []
    for k in ("ARMOR_FORGE", "GRIND_STONE", "TABLE_SAW", "ORE_WASHER", "GOLD_PAN", "ORE_CRUSHER", "MAKESHIFT_SMELTERY", "COMPRESSOR", "SMELTERY"):
        rows.append({"id": k, "name": kb.items[k]["name"], "cost": cost(k)})
    return sorted(rows, key=lambda r: (r["cost"], r["name"]))


async def main() -> None:
    c = {k: cost(k) for k in ("GRIND_STONE", "ORE_WASHER", "GOLD_PAN", "ORE_CRUSHER")}
    three = c["GRIND_STONE"] + c["ORE_WASHER"] + c["ORE_CRUSHER"]
    four = three + c["GOLD_PAN"]
    locked = ["Energy and Electricity", "GPS-based Machines", "Programmable Androids", "Cargo Management"]
    rows = cheap()
    listed = ", ".join(f"{r['name']}, {r['cost']}" for r in rows)

    yt = [
        {"id": "hook", "kind": "title", "title": "Slimefun: tu primera hora", "sub": "Del libro a tus primeras máquinas · DrakesCraft",
         "text": "Slimefun tiene miles de ítems y puede abrumar. Pero la primera hora es simple: abre el libro, usa tu mesa de crafteo mejorada y construye tus primeras máquinas. Vamos paso a paso."},
        {"id": "guide", "kind": "gui", "label": "PASO 1 · EL LIBRO", "head": "Abre la Guía de Slimefun",
         "points": ["Escribe /sf guide", "Todas las categorías, 36 por página", "Investigar = pagar niveles de XP una sola vez"],
         "text": "Primero, el libro. Escribe barra sf guide para recibir la Guía de Slimefun. Aquí están todas las categorías de Slimefun y de los addons del servidor, treinta y seis por página. "
                 "Para craftear algo, primero hay que investigarlo: pagas niveles de experiencia una sola vez, y es tuyo para siempre."},
        {"id": "research", "kind": "bars", "label": "PASO 2 · INVESTIGAR LO BARATO", "head": "Las investigaciones más baratas", "rows": rows,
         "text": f"Estas son las investigaciones más baratas para empezar, en niveles de experiencia. La mesa de crafteo mejorada no necesita investigación. {listed}."},
        {"id": "ect", "kind": "model1", "label": "PASO 3 · TU PRIMERA MÁQUINA", "head": "Mesa de crafteo mejorada", "block": "ENHANCED_CRAFTING_TABLE",
         "points": ["Sin investigación", "Mesa de crafteo sobre un dispensador", "Ingredientes dentro del dispensador", "Clic derecho en la mesa de crafteo"],
         "text": "Tu primera máquina es la mesa de crafteo mejorada, y no necesita investigación. Es un multibloque: una mesa de crafteo encima de un dispensador. "
                 "Pon los ingredientes dentro del dispensador y haz clic derecho sobre la mesa de crafteo. Si el patrón no existe, el juego te avisa."},
        {"id": "trio", "kind": "model3", "label": "PASO 4 · POLVO Y MINERALES", "head": "Tres multibloques para empezar",
         "blocks": [{"id": "GRIND_STONE", "name": "Grind Stone", "cost": c["GRIND_STONE"], "note": "valla sobre dispensador"},
                    {"id": "ORE_CRUSHER", "name": "Ore Crusher", "cost": c["ORE_CRUSHER"], "note": "hierro y oro → 2 polvos"},
                    {"id": "ORE_WASHER", "name": "Ore Washer", "cost": c["ORE_WASHER"], "note": "Sifted Ore → polvo al azar"}],
         "text": f"Con {three} niveles tienes tres máquinas clave. El Grind Stone: una valla de roble sobre un dispensador. El Ore Crusher: una valla de ladrillo del Nether sobre un dispensador, con barras de hierro a los lados; "
                 f"convierte mena de hierro y de oro en dos polvos cada una. Y el Ore Washer: dispensador, valla de roble y caldero con agua, donde el Sifted Ore se convierte en un polvo de metal al azar. "
                 f"Con {c['GOLD_PAN']} niveles más tienes el Gold Pan, para sacar Sifted Ore de la grava. En total, {four} niveles."},
        {"id": "next", "kind": "next", "label": "PASO 5 · EL CAMINO", "head": "Lo que se desbloquea después", "locked": locked,
         "text": "Cuando termines todos los ítems de Basic Machines se desbloquean Energía y Electricidad, GPS, Androides programables y Cargo. Ese es el camino: máquinas básicas, energía y automatización. "
                 "En los próximos videos: los multibloques en detalle y tu primera granja de polvo."},
        {"id": "cta", "kind": "title", "title": "mc.drakescraft.cl", "sub": "Java y Bedrock · únete al Discord",
         "text": "Entra a mc punto drakescraft punto cl, Java y Bedrock, y únete al Discord. ¡Nos vemos dentro!"},
    ]
    reel = [
        {"id": "hook", "kind": "big", "big": "1ª hora", "small": "en Slimefun", "text": "¿Empezando con Slimefun? Esto es todo lo que necesitas la primera hora."},
        {"id": "guide", "kind": "cmd", "cmd": "/sf guide", "small": "abre el libro", "text": "Uno: escribe barra sf guide y abre el libro."},
        {"id": "ect", "kind": "model", "block": "ENHANCED_CRAFTING_TABLE", "small": "GRATIS · sin investigación",
         "text": "Dos: la mesa de crafteo mejorada es gratis. Mesa sobre un dispensador, ingredientes dentro, clic derecho."},
        {"id": "xp", "kind": "big", "big": f"{four} niveles", "small": "Grind Stone · Ore Washer · Gold Pan · Ore Crusher",
         "text": f"Tres: con solo {four} niveles desbloqueas el Grind Stone, el Ore Washer, el Gold Pan y el Ore Crusher. Ya puedes hacer polvo."},
        {"id": "next", "kind": "locked", "items": locked, "small": "se abren al terminar Basic Machines",
         "text": "Cuatro: termina Basic Machines y se abren Energía, GPS, Androides y Cargo."},
        {"id": "cta", "kind": "cta", "ip": "mc.drakescraft.cl", "line": "Java y Bedrock", "text": "Juega en mc punto drakescraft punto cl. Link en la bio."},
    ]
    for name, scenes, rate in (("start-yt", yt, "+2%"), ("start-reel", reel, "+8%")):
        for s in scenes:
            words: list = []
            f = AUDIO / f"{name}-{s['id']}.mp3"
            AUDIO.mkdir(parents=True, exist_ok=True)
            comm = edge_tts.Communicate(s["text"], VOICE, rate=rate, boundary="WordBoundary")
            with open(f, "wb") as fh:
                async for ch in comm.stream():
                    if ch["type"] == "audio":
                        fh.write(ch["data"])
                    elif ch["type"] == "WordBoundary":
                        words.append({"w": ch["text"], "t": round(ch["offset"] / 1e7, 3), "d": round(ch["duration"] / 1e7, 3)})
            s["audio"] = f"audio/{name}-{s['id']}.mp3"
            s["words"] = words
            s["seconds"] = round(MP3(str(f)).info.length + 0.4, 2)
        (PUB / f"{name}.json").write_text(json.dumps({"fps": 30, "voice": VOICE, "scenes": scenes, "source": kb.meta}, ensure_ascii=False, indent=1), encoding="utf-8")
        print(name, round(sum(s["seconds"] for s in scenes), 1), "s")


asyncio.run(main())
