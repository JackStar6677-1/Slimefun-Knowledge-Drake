#!/usr/bin/env python3
"""Que cambio en DrakesCraft entre dos volcados: items nuevos o quitados, recetas, costes de investigacion, categorias, addons.

  python tools/diff_dumps.py                 # volcado actual vs el del ultimo commit  -> knowledge/changes/<fecha>.md
  python tools/diff_dumps.py viejo.json.gz nuevo.json.gz
Sirve para "novedades del servidor" (web, Discord, videos) sin que nadie tenga que apuntarlas a mano.
"""
from __future__ import annotations

import datetime
import gzip
import json
import pathlib
import subprocess
import sys
from collections import Counter

ROOT = pathlib.Path(__file__).resolve().parent.parent
DUMP = ROOT / "data" / "slimefun-dump.json"
sys.stdout.reconfigure(encoding="utf-8")


def load(path: pathlib.Path) -> dict:
    if path.suffix == ".gz":
        return json.loads(gzip.open(path, "rt", encoding="utf-8").read())
    return json.loads(path.read_text(encoding="utf-8"))


def canon(v):
    """Compara sin depender del orden (las recetas de maquina salen de un conjunto)."""
    if isinstance(v, list):
        return sorted(json.dumps(x, sort_keys=True) for x in v) if v and isinstance(v[0], dict) and "ticks" in v[0] else v
    return v


def previous() -> dict | None:
    r = subprocess.run(["git", "-C", str(ROOT), "show", "HEAD:data/slimefun-dump.json.gz"], capture_output=True)
    return json.loads(gzip.decompress(r.stdout).decode("utf-8")) if r.returncode == 0 and r.stdout else None


def main(argv: list[str]) -> int:
    if len(argv) >= 2:
        old, new = load(pathlib.Path(argv[0])), load(pathlib.Path(argv[1]))
    else:
        old, new = previous(), load(DUMP)
        if old is None:
            print("no hay volcado previo en git para comparar")
            return 1
    oi, ni = {i["id"]: i for i in old["items"]}, {i["id"]: i for i in new["items"]}
    added, removed = sorted(set(ni) - set(oi)), sorted(set(oi) - set(ni))
    changed = []
    for k in set(oi) & set(ni):
        a, b = oi[k], ni[k]
        diffs = [f for f in ("recipe", "recipe_type", "research_cost", "energy", "machine_recipes") if canon(a.get(f)) != canon(b.get(f))]
        if "RELIC" in k:  # las reliquias tienen receta aleatoria en cada arranque: ruido, no un cambio real
            diffs = [d for d in diffs if d != "recipe"]
        if diffs:
            changed.append((k, diffs))
    og, ng = {g["key"] for g in old["groups"]}, {g["key"] for g in new["groups"]}
    today = datetime.date.today().isoformat()
    lines = [f"# What changed on DrakesCraft ({today})", "",
             f"Compared runtime dumps: `{old.get('generated_at', '?')[:10]}` → `{new.get('generated_at', '?')[:10]}`. "
             f"Items {len(oi)} → {len(ni)} (+{len(added)} / −{len(removed)}), categories {len(og)} → {len(ng)}.", ""]
    if added:
        by = Counter(ni[k]["addon"] for k in added)
        lines += ["## New items", *[f"- **{a}**: {n} new" for a, n in by.most_common()], ""]
        lines += [f"- {ni[k]['name']} (`{k}`, {ni[k]['addon']})" for k in added[:80]] + ([f"- … and {len(added) - 80} more"] if len(added) > 80 else []) + [""]
    if removed:
        lines += ["## Removed items", *[f"- {oi[k]['name']} (`{k}`)" for k in removed[:80]], ""]
    if changed:
        lines += ["## Changed items", *[f"- {ni[k]['name']} (`{k}`): {', '.join(d)}" for k, d in sorted(changed)[:120]], ""]
    for key in sorted(ng - og):
        lines.append(f"- New category: `{key}`")
    for key in sorted(og - ng):
        lines.append(f"- Removed category: `{key}`")
    out = ROOT / "knowledge" / "changes" / f"{today}.md"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"+{len(added)} −{len(removed)} ~{len(changed)} items; categorias +{len(ng - og)} −{len(og - ng)} -> {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
