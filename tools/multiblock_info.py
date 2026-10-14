#!/usr/bin/env python3
"""Ficha de cada multibloque del nucleo, sacada del volcado y del codigo (con numero de linea): patron, bloque que se toca, donde esta el dispensador,
si usa el Output Chest, cuantas recetas tiene y si hay recetas que necesitan Output Chest en la practica.

  python tools/multiblock_info.py      # -> knowledge/guides/multiblocks.md (generado)
Regla: solo se afirma lo que sale de una linea citada; lo que no se detecta queda como "revisar en el codigo".
"""
from __future__ import annotations

import pathlib
import re
import sys
from collections import Counter

ROOT = pathlib.Path(__file__).resolve().parent.parent
REPOS = ROOT.parent
CORE = REPOS / "Slimefun4-Drake" / "src" / "main" / "java"
sys.path.insert(0, str(ROOT / "tools"))
from kb import KB  # noqa: E402

sys.stdout.reconfigure(encoding="utf-8")
kb = KB()


def source_of(cls: str) -> pathlib.Path | None:
    p = CORE / (cls.replace(".", "/") + ".java")
    return p if p.exists() else None


def find_lines(path: pathlib.Path, pattern: str) -> list[tuple[int, str]]:
    rx = re.compile(pattern)
    return [(n, l.strip()) for n, l in enumerate(path.read_text(encoding="utf-8").splitlines(), 1) if rx.search(l)]


def main() -> int:
    multis = sorted((i for i in kb.items.values() if i["recipe_type"].endswith("multiblock") and i["addon"] == "Slimefun"), key=lambda x: x["name"])
    by_type = {}
    for it in kb.items.values():
        by_type.setdefault(it["recipe_type"], []).append(it)
    lines = ["# Core multiblocks (generated)", "",
             f"Generated from the runtime dump (Slimefun `{kb.meta['slimefun']}`) and the core source. Every statement below cites the line it comes from; "
             "`review in code` means the pattern was not detected automatically.", "",
             "Only lines that assign the dispenser block are used (`possibleDispenser`/`dispBlock = b.getRelative(...)`); `review in code` means the machine does not follow that pattern "
             "(for example the Smeltery uses the block below for its fire, not for a dispenser).", ""]
    rows = []
    for m in multis:
        src = source_of(m["class"])
        rel = None
        out_chest = False
        cite = ""
        if src:
            rel_lines = find_lines(src, r"(?i)(dispenser|dispblock)\w*\s*=.*getRelative\(BlockFace\.(UP|DOWN)\)")
            if rel_lines:
                n, l = rel_lines[0]
                face = re.search(r"BlockFace\.(\w+)", l).group(1)
                rel = "below the clicked block" if face == "DOWN" else "above the clicked block"
                cite = f"`{src.relative_to(REPOS).as_posix()}:{n}`"
            oc = find_lines(src, r"findOutputInventory|findOutputChestFor")
            out_chest = bool(oc)
        recipes = by_type.get("slimefun:" + m["id"].lower(), [])
        multi_out = [r for r in recipes if r.get("output_amount", 1) > 1]
        pattern = [kb.name(x).rsplit(" x", 1)[0] if x else "·" for x in m["recipe"]]
        grid = [pattern[i * 3:(i + 1) * 3] for i in range(3)]
        rows.append((m, rel, out_chest, cite, recipes, multi_out, grid))
    lines += ["| Multiblock | Dispenser is | Uses Output Chest | Recipes | Recipes with output > 1 | Source |", "|---|---|---|---|---|---|"]
    for m, rel, oc, cite, recipes, mo, _ in rows:
        lines.append(f"| {m['name']} (`{m['id']}`) | {rel or 'review in code'} | {'yes' if oc else 'review in code'} | {len(recipes)} | {len(mo)} | {cite or '-'} |")
    lines += ["", "## Patterns (front view, top row first; `·` = empty)", ""]
    for m, rel, oc, cite, recipes, mo, grid in rows:
        lines += [f"### {m['name']} (`{m['id']}`)", "```", *[" | ".join(f"{c:<20}" for c in row) for row in grid], "```"]
        if recipes:
            ex = recipes[:6]
            lines.append("Makes: " + ", ".join(f"{r['name']}" + (f" ×{r['output_amount']}" if r.get('output_amount', 1) > 1 else "") for r in ex) + (f" … (+{len(recipes) - 6})" if len(recipes) > 6 else ""))
        lines.append("")
    ect_src = source_of("com.github.drakescraft_labs.slimefun4.implementation.items.multiblocks.EnhancedCraftingTable")
    ect_line = find_lines(ect_src, r"private void craft")[0][0] if ect_src else 0
    ect_cite = f"`{ect_src.relative_to(REPOS).as_posix()}:{ect_line}`" if ect_src else "review in code"
    ect = by_type.get("slimefun:enhanced_crafting_table", [])
    stacked = [r for r in ect if sum(1 for x in r["recipe"] if x) == 9]
    multi_ect = [r for r in ect if r.get("output_amount", 1) > 1]
    lines += ["## When you really need an Output Chest", "",
              f"- Enhanced Crafting Table recipes in the dump: {len(ect)}. {len(multi_ect)} produce more than one item per craft and {len(stacked)} use all nine slots.",
              f"- The table crafts into the dispenser's own free space after consuming one of each ingredient ({ect_cite}, `Slimefun4-Drake/src/main/java/com/github/drakescraft_labs/slimefun4/core/multiblocks/MultiBlockMachine.java:167`). "
              "If you load stacks to craft in bulk, every slot stays occupied, so the result has nowhere to go unless an Output Chest is next to the dispenser.",
              "- Grind Stone, Ore Crusher and Ore Washer multiply or add outputs (Ore Crusher: 2 dust per ore; Ore Washer: dust + Stone Chunk), so their results also fill the dispenser quickly.", ""]
    for r in sorted(multi_ect, key=lambda x: -x.get("output_amount", 1))[:12]:
        lines.append(f"  - {r['name']} ×{r['output_amount']}")
    lines += ["", "## Sources", "", "- `data/slimefun-dump.json.gz` (patterns, recipes, output amounts)"]
    for m, rel, oc, cite, *_ in rows:
        if cite:
            lines.append(f"- {cite}")
    out = ROOT / "knowledge" / "guides" / "multiblocks.md"
    out.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"{len(rows)} multibloques -> {out}")
    print("ECT:", len(ect), "recetas;", len(multi_ect), "con salida >1;", len(stacked), "con los 9 slots")
    for m, rel, oc, cite, *_ in rows:
        print(f"{m['id']:<28} dispenser {rel or '?':<26} outputchest={oc}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
