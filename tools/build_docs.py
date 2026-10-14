#!/usr/bin/env python3
"""Convierte el volcado (data/slimefun-dump.json) en la base de conocimiento legible y navegable.

Genera, bajo knowledge/ (todo "generated": no se edita a mano, se regenera):
  items/<addon>/<ID>.md   una pagina por item: como se obtiene, que desbloquear, energia, que lo produce, usos
  addons/<addon>.md       indice por addon y por grupo del menu de la guia
  flows/<ID>.md           cadena de produccion hacia adelante desde un recurso (polvo -> lingote -> aleacion -> ...)
  index.json              indice maquina-legible para herramientas y para la consulta por MCP
Las paginas escritas a mano o por agentes (knowledge/mechanics/, knowledge/guides/) NO se tocan.

  python tools/build_docs.py
"""
from __future__ import annotations

import json
import pathlib
import re
import shutil
import sys
from collections import Counter, defaultdict, deque

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from kb import KB  # noqa: E402

GEN = ROOT / "knowledge"
AUD = json.loads((GEN / "audience.json").read_text(encoding="utf-8")) if (GEN / "audience.json").exists() else {}


def slug(s: str) -> str:
    return re.sub(r"[^A-Za-z0-9_.-]+", "_", s)


def audience(it: dict) -> str:
    for pat in AUD.get("staff_id_patterns", []):
        if re.search(pat, it["id"]):
            return "staff"
    if it["group"] in AUD.get("staff_groups", []):
        return "staff"
    if it["addon"] in AUD.get("staff_addons", []):
        return "staff"
    return "user"


def main() -> int:
    kb = KB()
    for sub in ("items", "addons", "flows"):
        shutil.rmtree(GEN / sub, ignore_errors=True)
        (GEN / sub).mkdir(parents=True, exist_ok=True)
    by_addon: dict[str, list[dict]] = defaultdict(list)
    for it in kb.items.values():
        by_addon[it["addon"]].append(it)

    # grafo hacia adelante: item -> [(producto, via)]
    fwd: dict[str, list[tuple[str, str]]] = defaultdict(list)
    for it in kb.items.values():
        rt = it["recipe_type"].split(":")[1]
        for s in it["recipe"]:
            if s and "sf" in s:
                fwd[s["sf"]].append((it["id"], rt))
        for mid in [it["id"]] if it.get("machine_recipes") else []:
            for r in it["machine_recipes"]:
                outs = [o.get("sf") or o["material"] for o in r["output"] if o]
                for i in r["input"]:
                    if i and "sf" in i:
                        for o in outs:
                            if o in kb.items:
                                fwd[i["sf"]].append((o, f"machine:{it['id']}"))

    collapse = set(AUD.get("collapse_addons", []))
    index = []
    for it in kb.items.values():
        if it["addon"] in collapse:
            continue
        aud = audience(it)
        lines = [f'# {it["name"]}', "",
                 f'`{it["id"]}` · addon **{it["addon"]}** · group `{it["group"]}` · audience **{aud}**', ""]
        lore = it.get("lore") or []
        if lore:
            lines += ["## In-game description", *[f"> {l}" for l in lore[:8]], ""]
        lines += ["## How to get it", kb.recipe_text(it).replace("\n", "\n    ", 0), ""]
        lines[-2] = "```\n" + kb.recipe_text(it) + "\n```"
        path = kb.path(it["id"])
        lines += ["## Before you can use it", *[f"- {p}" for p in path], ""]
        prod = kb.made_by.get(it["id"], [])
        if prod:
            lines += ["## Produced by machines"]
            for m, r in prod[:12]:
                lines.append(f'- **{kb.items[m]["name"]}** ({m}): {", ".join(kb.name(x) for x in r["input"])} → '
                             f'{", ".join(kb.name(x) for x in r["output"])} in {r["ticks"]} ticks')
            lines.append("")
        used = list(dict.fromkeys(kb.used_in.get(it["id"], [])))
        if used:
            lines += ["## Used to make", ", ".join(f'[{kb.items[u]["name"]}](../{slug(kb.items[u]["addon"])}/{slug(u)}.md)' for u in used[:40])
                      + (f" … (+{len(used) - 40})" if len(used) > 40 else ""), ""]
        if it.get("machine_recipes"):
            lines += [f'## Machine recipes ({len(it["machine_recipes"])})']
            for r in it["machine_recipes"][:60]:
                lines.append(f'- {", ".join(kb.name(x) for x in r["input"])} → {", ".join(kb.name(x) for x in r["output"])} ({r["ticks"]} ticks)')
            lines.append("")
        lines += ["## Source", f'- implementation class: `{it["class"]}`',
                  f'- dump: Slimefun `{kb.meta["slimefun"]}`, generated {kb.meta["generated_at"]}', ""]
        out = GEN / "items" / slug(it["addon"]) / f'{slug(it["id"])}.md'
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text("\n".join(lines), encoding="utf-8")
        index.append({"id": it["id"], "name": it["name"], "addon": it["addon"], "group": it["group"], "audience": aud,
                      "recipe_type": it["recipe_type"], "research": it.get("research"),
                      "page": f'items/{slug(it["addon"])}/{slug(it["id"])}.md'})

    # indices por addon / grupo
    for addon, items in by_addon.items():
        if addon in collapse:
            sample = ", ".join(i2["name"] for i2 in items[:12])
            text = f"# {addon}" + chr(10) + chr(10) + f"{len(items)} generated variants (not documented one by one). Examples: {sample}." + chr(10)
            (GEN / "addons" / f"{slug(addon)}.md").write_text(text, encoding="utf-8")
            continue
        groups: dict[str, list[dict]] = defaultdict(list)
        for it in items:
            groups[it["group"]].append(it)
        lines = [f"# {addon}", "", f"{len(items)} items.", ""]
        for g, its in sorted(groups.items()):
            lines += [f'## {kb.groups.get(g, {}).get("name", g)} (`{g}`)', ""]
            for it in sorted(its, key=lambda x: x["name"]):
                lines.append(f'- [{it["name"]}](../items/{slug(addon)}/{slug(it["id"])}.md) — `{it["id"]}`')
            lines.append("")
        (GEN / "addons" / f"{slug(addon)}.md").write_text("\n".join(lines), encoding="utf-8")

    # flujos: para cada recurso "base" (sin ingredientes de Slimefun) el arbol de todo lo que se deriva de el
    roots = [i for i in kb.items.values() if kb.used_in.get(i["id"]) and not any(s and "sf" in s for s in i["recipe"])]
    roots = [r for r in roots if len(fwd.get(r["id"], [])) >= 3]
    for r in roots:
        seen = {r["id"]: 0}
        q = deque([r["id"]])
        layers: dict[int, list[tuple[str, str]]] = defaultdict(list)
        while q:
            cur = q.popleft()
            for nxt, via in fwd.get(cur, []):
                if nxt not in seen:
                    seen[nxt] = seen[cur] + 1
                    layers[seen[nxt]].append((nxt, via))
                    q.append(nxt)
        lines = [f'# Production flow from {r["name"]}', "",
                 f'Everything you can derive, step by step, starting from `{r["id"]}` ({len(seen) - 1} items reachable).', ""]
        for depth in sorted(layers)[:6]:
            lines.append(f"## Step {depth}")
            for nxt, via in sorted(layers[depth], key=lambda x: kb.items[x[0]]["name"])[:80]:
                how = via.replace("machine:", "machine ") if via.startswith("machine:") else f"craft in {via.replace('_', ' ')}"
                lines.append(f'- {kb.items[nxt]["name"]} (`{nxt}`) — {how}')
            lines.append("")
        (GEN / "flows" / f'{slug(r["id"])}.md').write_text("\n".join(lines), encoding="utf-8")

    (GEN / "index.json").write_text(json.dumps({"meta": kb.meta, "items": index}, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f'{len(index)} paginas de items, {len(by_addon)} addons, {len(roots)} flujos -> {GEN}')
    print("addons:", ", ".join(f"{a}({len(v)})" for a, v in sorted(by_addon.items(), key=lambda x: -len(x[1]))[:12]))
    return 0


if __name__ == "__main__":
    sys.exit(main())
