#!/usr/bin/env python3
"""Extrae las texturas por cara de los bloques vanilla que forman los multibloques, para los modelos 3D del video.

Lee los patrones de los multibloques del volcado (recipe_type multiblock), resuelve para cada material su modelo (cadena de 'parent', variables '#x')
en el jar de cliente de Mojang y copia las caras a video/public/blocks/<MATERIAL>/{up,down,north,east,south,west}.png + video/public/blocks/index.json
con la forma (cubo, valla, barras, caldero, yunque, losa...) y las caras disponibles.

  python tools/blocks.py [ITEM_ID ...]     # por defecto todos los multibloques del core
"""
from __future__ import annotations

import json
import pathlib
import re
import shutil
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from kb import KB  # noqa: E402
from icons import CLIENT, Source, fetch_client, first_model, split  # noqa: E402

OUT = ROOT / "video" / "public" / "blocks"
sys.stdout.reconfigure(encoding="utf-8")


def model_textures(src: Source, ref: str, depth: int = 0) -> dict[str, str]:
    """Texturas de un modelo con sus padres (el hijo manda), con las variables '#x' ya resueltas."""
    if depth > 8:
        return {}
    ns, p = split(ref)
    raw = src.read(f"assets/{ns}/models/{p}.json")
    if raw is None:
        return {}
    m = json.loads(raw)
    tex = dict(model_textures(src, m["parent"], depth + 1)) if "parent" in m else {}
    tex.update(m.get("textures", {}))
    for _ in range(4):
        for k, v in list(tex.items()):
            if isinstance(v, str) and v.startswith("#") and v[1:] in tex:
                tex[k] = tex[v[1:]]
    return tex


SHAPE = [("FENCE", "fence"), ("IRON_BARS", "bars"), ("CAULDRON", "cauldron"), ("ANVIL", "anvil"), ("_SLAB", "slab"), ("GLASS", "glass"), ("BOOKSHELF", "cube")]


def faces_for(src: Source, material: str) -> dict[str, str]:
    name = material.lower()
    raw = src.read(f"assets/minecraft/items/{name}.json")
    ref = first_model(raw) if raw else None
    tex = model_textures(src, ref) if ref else {}
    if not tex:
        tex = model_textures(src, f"minecraft:block/{name}")
    faces: dict[str, str] = {}
    pick = {"up": ("up", "top", "end", "all", "texture", "side"), "down": ("down", "bottom", "end", "all", "side"), "north": ("north", "front", "side", "all"),
            "east": ("east", "side", "all", "north"), "south": ("south", "side", "all", "north"), "west": ("west", "side", "all", "north")}
    for face, keys in pick.items():
        for k in keys:
            if k in tex and not str(tex[k]).startswith("#"):
                faces[face] = tex[k]
                break
    if not faces and tex:
        first = next((v for v in tex.values() if not str(v).startswith("#")), None)
        if first:
            faces = {f: first for f in pick}
    return faces


def shape_of(material: str) -> str:
    for needle, shape in SHAPE:
        if needle in material:
            return shape
    return "cube"


def main(argv: list[str]) -> int:
    kb = KB()
    fetch_client()
    jar = Source(CLIENT)
    ids = argv or [i["id"] for i in kb.items.values() if i["recipe_type"].endswith("multiblock") and i["addon"] == "Slimefun"]
    mats = sorted({s["material"] for i in ids for s in kb.items[i]["recipe"] if s and "material" in s})
    OUT.mkdir(parents=True, exist_ok=True)
    index, missing = {}, []
    for m in mats:
        faces = faces_for(jar, m)
        if not faces:
            missing.append(m)
            continue
        d = OUT / m
        d.mkdir(exist_ok=True)
        saved = {}
        for face, ref in faces.items():
            ns, p = split(ref)
            data = jar.read(f"assets/{ns}/textures/{p}.png")
            if data:
                (d / f"{face}.png").write_bytes(data)
                saved[face] = f"blocks/{m}/{face}.png"
        index[m] = {"shape": shape_of(m), "faces": saved}
    (OUT / "index.json").write_text(json.dumps(index, indent=1), encoding="utf-8")
    shutil.copy(OUT / "index.json", ROOT / "video" / "src" / "blocks-index.json")
    print(f"{len(index)}/{len(mats)} materiales con texturas -> {OUT}")
    if missing:
        print("sin texturas:", missing)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
