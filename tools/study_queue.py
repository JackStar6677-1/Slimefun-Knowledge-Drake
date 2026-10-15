#!/usr/bin/env python3
"""Cola de estudio: que temas de Slimefun todavia no tienen su documento de mecanicas y donde leer el codigo.

Un agente (Claude, Codex, Antigravity...) toma un tema pendiente, lee los archivos fuente indicados, escribe
knowledge/mechanics/<id>.md siguiendo doc_rules de knowledge/topics.json y lo valida con tools/verify.py.

  python tools/study_queue.py            # lista pendientes y cobertura
  python tools/study_queue.py brief ID   # instrucciones completas para el agente (rutas reales resueltas)
"""
from __future__ import annotations

import glob
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SEARCH_BASES = [
    ROOT.parent.parent / "drakescraft",
    ROOT.parent,
    ROOT,
]
sys.stdout.reconfigure(encoding="utf-8")
T = json.loads((ROOT / "knowledge" / "topics.json").read_text(encoding="utf-8"))
EXT = (".java", ".kt", ".yml", ".html", ".md", ".json")


import fnmatch

def resolve(spec: str) -> list[str]:
    if ":" not in spec:
        for base in SEARCH_BASES:
            matches = [str(p.relative_to(base)) for p in base.glob(spec) if p.is_file()]
            if matches:
                return sorted(matches)[:30]
        return [spec]
    repo_pat, pat = spec.split(":", 1)
    out = []
    for base in SEARCH_BASES:
        if not base.exists():
            continue
        matched_dirs = [d for d in base.iterdir() if d.is_dir() and fnmatch.fnmatch(d.name.lower(), repo_pat.lower())]
        for d in matched_dirs:
            for p in glob.glob(str(d / pat), recursive=True):
                if p.endswith(EXT) and pathlib.Path(p).is_file():
                    out.append(str(pathlib.Path(p).relative_to(base)).replace("\\", "/"))
    return sorted(out)


def status() -> list[dict]:
    rows = []
    for t in T["topics"]:
        doc = ROOT / "knowledge" / "mechanics" / f"{t['id']}.md"
        rows.append({**t, "done": doc.exists(), "doc": f"knowledge/mechanics/{t['id']}.md"})
    return rows


def main(argv: list[str]) -> int:
    rows = status()
    if argv and argv[0] == "brief" and len(argv) > 1:
        t = next((r for r in rows if r["id"] == argv[1]), None)
        if not t:
            print("tema desconocido")
            return 2
        print(f"# Task: write {t['doc']}\nTopic: {t['title']}\nAudience: {t['audience']}\n")
        print("Rules:\n" + json.dumps(T["doc_rules"], indent=2, ensure_ascii=False))
        print("\nRead these source files (paths relative to the clones folder, e.g. DrakesCraft-Labs/):")
        total = 0
        for s in t["sources"]:
            files = resolve(s)
            total += len(files)
            for p in files[:25]:
                print(f"  - {p}")
            if len(files) > 25:
                print(f"  ... (+{len(files) - 25} more matching {s})")
        if not total:
            print("  (no source files resolved: clone the missing repo next to the others)")
        print("\nUse data/slimefun-dump.json (or tools/kb.py) for every item id, recipe, number and energy value. "
              f"Then run: python tools/verify.py {t['doc']}")
        return 0
    done = sum(r["done"] for r in rows)
    print(f"Mechanics coverage: {done}/{len(rows)} topics\n")
    for r in rows:
        print(f"[{'x' if r['done'] else ' '}] {r['id']:<34} {r['audience']:<6} {r['title']}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
