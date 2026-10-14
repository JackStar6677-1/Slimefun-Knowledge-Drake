#!/usr/bin/env python3
"""Extrae los iconos que usa un storyboard: texturas de Slimefun (pack Slimefun-Texture-Drake) y de Minecraft vanilla.

  python tools/icons.py                 # lee video/public/storyboard.json y deja PNG en video/public/icons/
Variables de entorno:
  SF_PACK    carpeta pack/ del repo Slimefun-Texture-Drake (por defecto el clon junto a este repo)
  MC_VERSION version vanilla (por defecto 1.21.11)
El jar de cliente de Mojang se baja de su manifiesto oficial a work/ y NUNCA se versiona ni se publica.
"""
from __future__ import annotations

import json
import os
import pathlib
import re
import sys
import urllib.request
import zipfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
SB = ROOT / "video" / "public" / "storyboard.json"
OUT = ROOT / "video" / "public" / "icons"
MC_VERSION = os.environ.get("MC_VERSION", "1.21.11")
PACK = pathlib.Path(os.environ.get("SF_PACK", ROOT.parent / "Slimefun-Texture-Drake" / "pack"))
CLIENT = ROOT / "work" / f"client-{MC_VERSION}.jar"
sys.stdout.reconfigure(encoding="utf-8")


def fetch_client() -> None:
    if CLIENT.exists():
        return
    base = "https://piston-meta.mojang.com/mc/game/version_manifest_v2.json"
    man = json.load(urllib.request.urlopen(base))
    url = next(v["url"] for v in man["versions"] if v["id"] == MC_VERSION)
    meta = json.load(urllib.request.urlopen(url))
    CLIENT.parent.mkdir(exist_ok=True)
    urllib.request.urlretrieve(meta["downloads"]["client"]["url"], CLIENT)


class Source:
    """Lee archivos de una carpeta (pack) o de un jar (vanilla)."""

    def __init__(self, path: pathlib.Path):
        self.path = path
        self.zip = zipfile.ZipFile(path) if path.suffix == ".jar" else None

    def read(self, rel: str) -> bytes | None:
        if self.zip:
            try:
                return self.zip.read(rel)
            except KeyError:
                return None
        p = self.path / rel
        return p.read_bytes() if p.exists() else None

    def names(self, prefix: str) -> list[str]:
        if self.zip:
            return [n for n in self.zip.namelist() if n.startswith(prefix)]
        return [str(p.relative_to(self.path)).replace("\\", "/") for p in (self.path / prefix).rglob("*") if p.is_file()]


def split(ref: str) -> tuple[str, str]:
    ns, _, p = ref.partition(":") if ":" in ref else ("minecraft", "", ref)
    return ns, p


def model_texture(src: Source, ref: str, depth: int = 0) -> str | None:
    """Sigue la cadena de 'parent' del modelo hasta dar con una textura utilizable."""
    if depth > 6:
        return None
    ns, p = split(ref)
    raw = src.read(f"assets/{ns}/models/{p}.json")
    if raw is None:
        return None
    m = json.loads(raw)
    tex = m.get("textures", {})
    for key in ("layer0", "all", "front", "top", "side", "texture", "0", "particle"):
        if key in tex and not str(tex[key]).startswith("#"):
            return tex[key]
    for v in tex.values():
        if not str(v).startswith("#"):
            return v
    if "parent" in m:
        return model_texture(src, m["parent"], depth + 1)
    return None


def first_model(raw: bytes) -> str | None:
    m = re.search(r'"model"\s*:\s*"([^"]+)"', raw.decode("utf-8"))
    return m.group(1) if m else None


def build_sf_map() -> dict[str, str]:
    """id de Slimefun -> modelo, leyendo assets/minecraft/items/*.json del pack."""
    out: dict[str, str] = {}
    for f in (PACK / "assets" / "minecraft" / "items").glob("*.json"):
        text = f.read_text(encoding="utf-8")
        for m in re.finditer(r'"slimefun:slimefun_item"\s*:\s*"([^"]+)"\}\}\s*,\s*"model"\s*:\s*\{[^}]*?"model"\s*:\s*"([^"]+)"', text):
            out.setdefault(m.group(1), m.group(2))
    return out


def save(src: Source, texture_ref: str, dest: pathlib.Path) -> bool:
    ns, p = split(texture_ref)
    data = src.read(f"assets/{ns}/textures/{p}.png")
    if data is None:
        return False
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(data)
    return True


def head_icon(src: Source, dest: pathlib.Path) -> bool:
    """PLAYER_HEAD no tiene textura plana: se dibuja la cara de la skin por defecto (Steve) con su capa de sombrero."""
    raw = src.read("assets/minecraft/textures/entity/player/wide/steve.png")
    if raw is None:
        return False
    import io
    from PIL import Image
    skin = Image.open(io.BytesIO(raw)).convert("RGBA")
    face = skin.crop((8, 8, 16, 16))
    face.alpha_composite(skin.crop((40, 8, 48, 16)))
    dest.parent.mkdir(parents=True, exist_ok=True)
    face.resize((16, 16), Image.NEAREST).save(dest)
    return True


def vanilla_icon(src: Source, material: str, dest: pathlib.Path) -> bool:
    name = material.lower()
    if name == "player_head":
        return head_icon(src, dest)
    raw = src.read(f"assets/minecraft/items/{name}.json")
    if raw:
        ref = first_model(raw)
        if ref:
            tex = model_texture(src, ref)
            if tex and save(src, tex, dest):
                return True
    for cand in (f"item/{name}", f"block/{name}", f"block/{name}_front", f"block/{name}_top", f"block/{name}_side"):
        if save(src, cand, dest):
            return True
    return False


def kb_items() -> dict:
    sys.path.insert(0, str(ROOT / "tools"))
    from kb import KB
    return KB().items


def main() -> int:
    fetch_client()
    vanilla = Source(CLIENT)
    pack = Source(PACK)
    sfmap = build_sf_map()
    sb = json.loads(SB.read_text(encoding="utf-8"))
    cells: list[dict] = []
    for s in sb["scenes"]:
        cells += [c for c in s.get("grid", []) if c]
    wanted = {(c["key"], c["sf"]) for c in cells if c.get("key")}
    wanted |= {(s["item"], True) for s in sb["scenes"] if s.get("item")}
    wanted |= {(d["key"], True) for s in sb["scenes"] for d in s.get("dusts", [])}
    wanted |= {(st["key"], st["sf"]) for s in sb["scenes"] for r in s.get("routes", []) for st in r["steps"]}
    # cualquier otro JSON del video (p. ej. guide.json): todo dict con "key" y "sf" pide su icono
    def walk(o):
        if isinstance(o, dict):
            if "key" in o and "sf" in o and isinstance(o["key"], str):
                yield (o["key"], bool(o["sf"]))
            for v in o.values():
                yield from walk(v)
        elif isinstance(o, list):
            for v in o:
                yield from walk(v)
    gj = SB.parent / "guide.json"
    if gj.exists():
        wanted |= set(walk(json.loads(gj.read_text(encoding="utf-8"))))
    missing = []
    fallback = []
    for key, is_sf in sorted(wanted):
        dest = OUT / ("sf" if is_sf else "mc") / f"{key}.png"
        ok = False
        if is_sf and key in sfmap:
            tex = model_texture(pack, sfmap[key])
            ok = bool(tex) and save(pack, tex, dest)
        elif not is_sf:
            ok = vanilla_icon(vanilla, key, dest)
        if not ok and is_sf:
            # el pack no tiene textura para este item: en el juego se ve como su material base, asi que se muestra igual
            mat = kb_items().get(key, {}).get("material")
            if mat and vanilla_icon(vanilla, mat, dest):
                fallback.append((key, mat))
                ok = True
        if not ok:
            missing.append(("sf" if is_sf else "mc", key))
    print(f"{len(wanted) - len(missing)}/{len(wanted)} iconos extraidos -> {OUT}")
    if fallback:
        print("sin textura en el pack (se muestra el material base, como en el juego):", fallback)
    if missing:
        print("sin icono (se mostrara el nombre):", missing)
    (OUT / "index.json").write_text(json.dumps(sorted(f"{k}/{n.stem}" for k in ("sf", "mc") if (OUT / k).exists()
                                                    for n in (OUT / k).glob("*.png"))), encoding="utf-8")
    return 0


if __name__ == "__main__":
    sys.exit(main())
