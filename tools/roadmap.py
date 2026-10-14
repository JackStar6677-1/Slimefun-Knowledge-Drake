#!/usr/bin/env python3
"""Roadmap de Slimefun calculado desde el volcado: que se desbloquea antes que que, por categoria del libro.

La "profundidad" de un item es la longitud de su cadena de ingredientes de Slimefun mas larga (0 = solo materiales vanilla o
multibloques). Una categoria con profundidad media baja se puede empezar antes; el coste en XP sale de las investigaciones.

  python tools/roadmap.py            # escribe knowledge/guides/roadmap.md
"""
from __future__ import annotations

import pathlib
import statistics
import sys
from collections import defaultdict
from functools import lru_cache

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from kb import KB  # noqa: E402

kb = KB()
sys.setrecursionlimit(10000)


@lru_cache(maxsize=None)
def depth(item_id: str, stack: tuple = ()) -> int:
    it = kb.items.get(item_id)
    if not it or item_id in stack or it["recipe_type"].endswith("multiblock"):
        return 0
    kids = [s["sf"] for s in it["recipe"] if s and "sf" in s and s["sf"] in kb.items]
    return 1 + max((depth(k, stack + (item_id,)) for k in kids), default=-1) if kids else 0


def main() -> int:
    groups: dict[str, list[dict]] = defaultdict(list)
    for it in kb.items.values():
        if it["addon"] == "Slimefun":
            groups[it["group"]].append(it)
    rows = []
    for g, items in groups.items():
        d = [depth(i["id"]) for i in items]
        res = {i["research"]: i.get("research_cost") or 0 for i in items if i.get("research")}
        rows.append({"group": g, "name": kb.groups.get(g, {}).get("name", g), "n": len(items), "depth_med": statistics.median(d),
                     "depth_max": max(d), "xp": sum(res.values()), "researches": len(res),
                     "examples": [i["name"] for i in sorted(items, key=lambda x: -depth(x["id"]))[:4]]})
    rows.sort(key=lambda r: (r["depth_med"], r["depth_max"]))
    multis = sorted((i for i in kb.items.values() if i["recipe_type"].endswith("multiblock") and i["addon"] == "Slimefun"), key=lambda x: x["name"])
    lines = ["# Slimefun roadmap (generated)", "",
             f"Built from the runtime dump (Slimefun `{kb.meta['slimefun']}`). Categories are ordered by how deep their ingredient chains are: "
             "start at the top and work down. **Depth** = longest chain of Slimefun ingredients (0 = only vanilla items or a multiblock).", "",
             "| # | Book category | Items | Median depth | Max depth | Researches | XP levels | Deepest items |", "|---|---|---|---|---|---|---|---|"]
    for i, r in enumerate(rows, 1):
        lines.append(f'| {i} | {r["name"]} | {r["n"]} | {r["depth_med"]:g} | {r["depth_max"]} | {r["researches"]} | {r["xp"]} | {", ".join(r["examples"])} |')
    lines += ["", "## Multiblocks you build in the world (not crafted)", "",
              "These are built block by block following the pattern in the guide; they are used by right-clicking a block of the structure "
              "(which one depends on the machine; see its mechanics page).", ""]
    for m in multis:
        pattern = [kb.name(x).rsplit(" x", 1)[0] for x in m["recipe"] if x]
        lines.append(f'- **{m["name"]}** (`{m["id"]}`): {", ".join(pattern)}')
    lines += ["", "## Addons", "", "| Addon | Items |", "|---|---|"]
    from collections import Counter
    for a, n in Counter(i["addon"] for i in kb.items.values()).most_common():
        if a != "Slimefun":
            lines.append(f"| {a} | {n} |")
    out = ROOT / "knowledge" / "guides" / "roadmap.md"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"{len(rows)} categories, {len(multis)} multiblocks -> {out}")
    for i, r in enumerate(rows, 1):
        print(f'{i:>2}. {r["name"]:<34} items={r["n"]:<4} depth med/max={r["depth_med"]:g}/{r["depth_max"]:<2} xp={r["xp"]}')
    return 0


if __name__ == "__main__":
    sys.exit(main())
