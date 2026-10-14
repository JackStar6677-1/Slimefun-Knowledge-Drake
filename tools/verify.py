#!/usr/bin/env python3
"""Valida un documento de mecanicas escrito por una IA: estructura, citas reales e ids existentes.

  python tools/verify.py knowledge/mechanics/energy-network.md
Falla (exit 1) si: faltan secciones, una ruta citada en Sources no existe en los clones, o un `ITEM_ID`
entre backticks (antes de Sources) no esta en el volcado.
"""
from __future__ import annotations

import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
REPOS = ROOT.parent
sys.stdout.reconfigure(encoding="utf-8")
ID_RE = re.compile(r"`([A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+)`")


def main(paths: list[str]) -> int:
    rules = json.loads((ROOT / "knowledge" / "topics.json").read_text(encoding="utf-8"))["doc_rules"]
    ids = {i["id"] for i in json.loads((ROOT / "data" / "slimefun-dump.json").read_text(encoding="utf-8"))["items"]}
    bad = 0
    for p in paths:
        f = pathlib.Path(p) if pathlib.Path(p).is_absolute() else ROOT / p
        t = f.read_text(encoding="utf-8")
        errs = []
        for sec in rules["required_sections"]:
            if not re.search(rf"^#+\s*{re.escape(sec)}\b", t, re.M):
                errs.append(f"missing section '{sec}'")
        parts = re.split(r"^#+\s*Sources\b", t, maxsplit=1, flags=re.M)
        body = parts[0]
        if len(parts) > 1:
            for m in re.finditer(r"`([^`\s]+?\.(?:java|kt|yml|json|md|html))(?::\d+)?`", parts[1]):
                rel = m.group(1)
                if not ((REPOS / rel).exists() or (ROOT / rel).exists()):
                    errs.append(f"cited source does not exist: {rel}")
        for m in ID_RE.finditer(body):
            if m.group(1) not in ids:
                errs.append(f"item id not in the dump: {m.group(1)}")
        print(("FAIL " if errs else "OK   ") + p)
        for e in sorted(set(errs)):
            print("   -", e)
        bad += bool(errs)
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
