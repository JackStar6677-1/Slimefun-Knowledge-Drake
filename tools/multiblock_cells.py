#!/usr/bin/env python3
"""Patrones de los multibloques del volcado como celdas 3D (x, y, material) para el modelo 3D del video.

La receta 3x3 de un multibloque es su vista frontal: fila de arriba = arriba, columna = izquierda/derecha.
  python tools/multiblock_cells.py [ID ...]   # -> video/src/multiblocks.json
"""
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from kb import KB  # noqa: E402

kb = KB()
ids = sys.argv[1:] or [i["id"] for i in kb.items.values() if i["recipe_type"].endswith("multiblock") and i["addon"] == "Slimefun"]
out = {}
for i in ids:
    it = kb.items[i]
    cells = []
    for n, s in enumerate(it["recipe"]):
        if s and "material" in s:
            cells.append({"x": n % 3 - 1, "y": 2 - n // 3, "material": s["material"]})
    out[i] = {"name": it["name"], "cells": cells}
(ROOT / "video" / "src" / "multiblocks.json").write_text(json.dumps(out, indent=1), encoding="utf-8")
print(len(out), "multibloques ->", "video/src/multiblocks.json")
