#!/usr/bin/env python3
"""Consulta la base de conocimiento de Slimefun generada por el volcado (data/slimefun-dump.json).

Responde preguntas del tipo "como se craftea X, que necesito antes, que maquina lo produce, cuanta
energia consume", expandiendo recetas hasta materias primas. Todo sale del volcado: no inventa nada.

  python tools/kb.py buscar solar
  python tools/kb.py receta ELECTRIC_FURNACE
  python tools/kb.py arbol ELECTRIC_FURNACE        # todo hasta materias primas
  python tools/kb.py usos GILDED_IRON              # donde se usa
  python tools/kb.py produce IRON_DUST             # que maquinas/recetas lo producen
  python tools/kb.py ruta ELECTRIC_FURNACE         # investigaciones y grupo que hay que desbloquear
"""
from __future__ import annotations

import json
import pathlib
import sys
from collections import Counter, defaultdict

DATA = pathlib.Path(__file__).resolve().parent.parent / "data" / "slimefun-dump.json"
DATA_GZ = DATA.with_suffix(".json.gz")
sys.stdout.reconfigure(encoding="utf-8")


class KB:
    def __init__(self, path: pathlib.Path = DATA):
        if not path.exists() and DATA_GZ.exists():
            import gzip
            d = json.loads(gzip.open(DATA_GZ, "rt", encoding="utf-8").read())
        else:
            d = json.loads(path.read_text(encoding="utf-8"))
        self.meta = {k: d[k] for k in ("slimefun", "server", "generated_at")}
        self.items = {i["id"]: i for i in d["items"] if not i.get("disabled")}
        self.groups = {g["key"]: g for g in d["groups"]}
        self.researches = {r["key"]: r for r in d["researches"]}
        self.used_in = defaultdict(list)
        self.made_by = defaultdict(list)  # id|material -> [(maquina, receta)]
        for i in self.items.values():
            for s in i["recipe"]:
                if s and "sf" in s:
                    self.used_in[s["sf"]].append(i["id"])
            for r in i.get("machine_recipes", []):
                for o in r["output"]:
                    if o:
                        self.made_by[o.get("sf") or o["material"]].append((i["id"], r))

    # --- busqueda -----------------------------------------------------------------------------
    def find(self, text: str) -> list[dict]:
        t = text.lower().replace(" ", "_")
        exact = self.items.get(text.upper())
        if exact:
            return [exact]
        return [i for i in self.items.values() if t in i["id"].lower() or text.lower() in i["name"].lower()]

    def name(self, ref: dict | None) -> str:
        if not ref:
            return "(empty)"
        if "sf" in ref:
            it = self.items.get(ref["sf"])
            return f'{it["name"] if it else ref["sf"]} x{ref["amount"]}'
        return f'{ref["material"].replace("_", " ").title()} x{ref["amount"]}'

    # --- recetas ------------------------------------------------------------------------------
    def recipe_text(self, item: dict) -> str:
        rt = item["recipe_type"].split(":")[1].replace("_", " ")
        lines = [f'{item["name"]} ({item["id"]}) - obtained in: {rt}']
        if item["recipe_type"].endswith("multiblock"):
            lines.append("  Multiblock: build it in the world with this layout (3x3, top to bottom):")
        grid = item["recipe"]
        for r in range(3):
            row = [self.name(grid[r * 3 + c]) if grid[r * 3 + c] else "-" for c in range(3)]
            lines.append("  | " + " | ".join(f"{x:<26}" for x in row) + " |")
        if item.get("output_amount", 1) > 1:
            lines.append(f'  Result: x{item["output_amount"]}')
        if "energy" in item:
            e = item["energy"]
            lines.append(f'  Energy: {e["type"]}, buffer {e["capacity"]} J'
                         + (f', uses {e["consumption_per_tick"]} J/tick' if "consumption_per_tick" in e else ""))
        return "\n".join(lines)

    def raw_cost(self, item_id: str, qty: int = 1, seen: tuple = ()) -> Counter:
        """Materias primas (materiales vanilla o items sin receta propia) para fabricar qty de item_id."""
        it = self.items.get(item_id)
        total: Counter = Counter()
        if not it or item_id in seen or it["recipe_type"].endswith("multiblock"):
            total[item_id] += qty
            return total
        out = max(1, it.get("output_amount", 1))
        crafts = -(-qty // out)
        if not any(it["recipe"]):
            total[item_id] += qty
            return total
        for s in it["recipe"]:
            if not s:
                continue
            if "sf" in s:
                total.update(self.raw_cost(s["sf"], s["amount"] * crafts, seen + (item_id,)))
            else:
                total[s["material"]] += s["amount"] * crafts
        return total

    def tree(self, item_id: str, depth: int = 0, seen: tuple = ()) -> list[str]:
        it = self.items.get(item_id)
        pad = "  " * depth
        if not it:
            return [f"{pad}{item_id}"]
        rt = it["recipe_type"].split(":")[1]
        lines = [f'{pad}{it["name"]}  [{rt}]']
        if item_id in seen or not any(it["recipe"]) or rt == "multiblock":
            return lines
        merged: Counter = Counter()
        for s in it["recipe"]:
            if s:
                merged[(s.get("sf") or s["material"], "sf" in s)] += s["amount"]
        for (ref, is_sf), n in merged.items():
            if is_sf:
                sub = self.tree(ref, depth + 1, seen + (item_id,))
                sub[0] = sub[0].replace(self.items[ref]["name"], f'{n}x {self.items[ref]["name"]}', 1)
                lines += sub
            else:
                lines.append(f'{pad}  {n}x {ref.replace("_", " ").title()}')
        return lines

    def path(self, item_id: str) -> list[str]:
        it = self.items[item_id]
        out = [f'Guide category: {self.groups.get(it["group"], {}).get("name", it["group"])}']
        if it.get("research"):
            out.append(f'Research required: {self.researches.get(it["research"], {}).get("name", it["research"])}'
                       f' (cost {it["research_cost"]} XP levels)')
        need = [i for i in self.raw_cost(item_id) if i in self.items]
        if need:
            out.append("Slimefun items you must be able to make first: " + ", ".join(self.items[i]["name"] for i in need))
        return out


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print(__doc__)
        return 1
    kb = KB()
    cmd, arg = argv[0], " ".join(argv[1:])
    if cmd == "buscar":
        for i in kb.find(arg)[:40]:
            print(f'{i["id"]:<32} {i["name"]}  [{i["group"].split(":")[1]}]')
        return 0
    found = kb.find(arg)
    if not found:
        print("No encontrado")
        return 2
    if len(found) > 1:
        print("Ambiguo:", ", ".join(i["id"] for i in found[:15]))
        return 2
    it = found[0]
    if cmd == "receta":
        print(kb.recipe_text(it))
    elif cmd == "arbol":
        print("\n".join(kb.tree(it["id"])))
        print("\nMaterias primas totales:")
        for ref, n in sorted(kb.raw_cost(it["id"]).items(), key=lambda x: -x[1]):
            print(f'  {n:>4}x {kb.items[ref]["name"] if ref in kb.items else ref.replace("_", " ").title()}')
    elif cmd == "usos":
        print(", ".join(dict.fromkeys(kb.items[i]["name"] for i in kb.used_in.get(it["id"], []))) or "No se usa en otras recetas")
    elif cmd == "produce":
        for m, r in kb.made_by.get(it["id"], []):
            print(f'{kb.items[m]["name"]}: {", ".join(kb.name(x) for x in r["input"])} -> '
                  f'{", ".join(kb.name(x) for x in r["output"])} ({r["ticks"]} ticks)')
    elif cmd == "ruta":
        print("\n".join(kb.path(it["id"])))
    else:
        print(__doc__)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
