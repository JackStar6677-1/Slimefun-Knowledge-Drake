#!/usr/bin/env python3
"""Storyboard del video "De cero a tu primera granja de polvo", construido SOLO con datos del volcado y del codigo.

Cada cifra sale de data/slimefun-dump.json (costes de investigacion, recetas, addons) o de una cita de codigo:
  - Dust Extractor (InfinityExpansion): InfinityExpansion-drake/.../items/machines/Machines.java:532-541
      4 bloques de piedra (cobble/andesita/stone/diorita/granito) -> 2 de un polvo al azar (9 posibles)
  - Cobblestone Generator (ExtraTools): una cobblestone por ciclo (CobblestoneGenerator.java:148)
  - Cargo: los nodos Input sacan items de la maquina y los Output los entregan; frecuencias 0-15
      Slimefun4-Drake/.../core/networks/cargo/CargoNet.java:57,145-150,202-205
Genera video/public/storyboard.json (escenas con narracion en ingles y datos para las animaciones).
"""
from __future__ import annotations

import json
import pathlib
import sys
from collections import Counter

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from kb import KB  # noqa: E402

kb = KB()
FARM = ["COBBLESTONE_GENERATOR", "DUST_EXTRACTOR", "SOLAR_GENERATOR", "COAL_GENERATOR", "LAVA_GENERATOR", "SMALL_CAPACITOR",
        "CARGO_MANAGER", "CARGO_NODE_INPUT", "CARGO_NODE_OUTPUT", "CARGO_NODE", "OUTPUT_CHEST"]
DUSTS = ["Copper", "Zinc", "Tin", "Aluminum", "Lead", "Silver", "Gold", "Iron", "Magnesium"]  # Machines.java:543-552 (twoDust)


def closure(ids: list[str]) -> set[str]:
    seen: set[str] = set()
    stack = list(ids)
    while stack:
        c = stack.pop()
        if c in seen or c not in kb.items:
            continue
        seen.add(c)
        it = kb.items[c]
        if it["recipe_type"].endswith("multiblock"):
            continue
        stack += [s["sf"] for s in it["recipe"] if s and "sf" in s]
    return seen


def grid(item_id: str) -> list:
    it = kb.items[item_id]
    return [None if not s else {"name": (kb.items[s["sf"]]["name"] if "sf" in s else s["material"].replace("_", " ").title()),
                                "key": s["sf"] if "sf" in s else s["material"], "sf": "sf" in s, "n": s["amount"]} for s in it["recipe"]]


def lore_rate(item_id: str) -> int | None:
    for line in kb.items[item_id].get("lore", []):
        if "J/s" in line:
            digits = "".join(ch for ch in line.split("J/s")[0].split()[-1] if ch.isdigit())
            return int(digits) if digits else None
    return None


def main() -> int:
    cl = closure(FARM)
    researches = {}
    for c in cl:
        r = kb.items[c].get("research")
        if r:
            researches[r] = kb.items[c].get("research_cost") or 0
    xp = sum(researches.values())
    types = Counter(kb.items[c]["recipe_type"].split(":")[1] for c in cl)
    addons = Counter(kb.items[c]["addon"] for c in cl)
    cobble_use = lore_rate("COBBLESTONE_GENERATOR")      # J/s segun el propio item
    extractor_use = lore_rate("DUST_EXTRACTOR")
    total = (cobble_use or 0) + (extractor_use or 0)
    gens = {k: lore_rate(k) for k in ("SOLAR_GENERATOR", "COAL_GENERATOR", "LAVA_GENERATOR")}
    need = {k: -(-total // v) for k, v in gens.items() if v}
    crafted = types["enhanced_crafting_table"]

    def r(item_id: str) -> int:
        return kb.items[item_id].get("research_cost") or 0

    scenes = [
        {"id": "title", "kind": "title", "title": "From zero to your first dust farm",
         "subtitle": "Slimefun on DrakesCraft · cobblestone in, nine metal dusts out",
         "narration": "You start with nothing but the Slimefun Guide. By the end of this video you will have a machine that turns "
                      "plain cobblestone into nine kinds of metal dust, and sends them to a chest on its own."},
        {"id": "guide", "kind": "guide",
         "stats": [{"label": "items to make", "value": len(cl)}, {"label": "researches", "value": len(researches)},
                   {"label": "XP levels in total", "value": xp}],
         "samples": sorted(({"name": k.split(":")[1].replace("_", " ").title(), "cost": v} for k, v in researches.items()),
                           key=lambda x: x["cost"])[:3] +
                    sorted(({"name": k.split(":")[1].replace("_", " ").title(), "cost": v} for k, v in researches.items()),
                           key=lambda x: -x["cost"])[:3],
         "narration": f"Everything begins locked. In the Slimefun Guide you spend experience levels to unlock each research, and only then "
                      f"can you craft the item. This farm needs {len(researches)} researches, {xp} experience levels in total, and {len(cl)} "
                      f"different items. It uses three addons: {addons['Slimefun']} items from Slimefun itself, {addons['InfinityExpansion']} "
                      f"from InfinityExpansion and {addons['ExtraTools']} from ExtraTools."},
        {"id": "early", "kind": "bars",
         "bars": [{"label": "Enhanced Crafting Table", "value": types["enhanced_crafting_table"]},
                  {"label": "Smeltery", "value": types["smeltery"]}, {"label": "Ore Washer", "value": types["ore_washer"]},
                  {"label": "Ore Crusher", "value": types["ore_crusher"]},
                  {"label": "Heated Pressure Chamber", "value": types["heated_pressure_chamber"]},
                  {"label": "Compressor", "value": types["compressor"]}],
         "narration": f"The early game is about metals. Of those {len(cl)} items, {types['enhanced_crafting_table']} are crafted in the Enhanced "
                      f"Crafting Table and {types['smeltery']} come out of a Smeltery. Others need the Ore Washer, the Ore Crusher, "
                      f"the Heated Pressure Chamber and the Compressor. Dusts and ingots are the backbone of everything that follows."},
        {"id": "sources", "kind": "routes",
         "routes": [
             {"at": 1, "title": "Crush ore", "note": "no power · Iron and Gold ore only",
              "steps": [{"label": "Iron Ore", "key": "IRON_ORE", "sf": False}, {"label": "Ore Crusher", "key": "ORE_CRUSHER", "sf": True, "tag": "multiblock"},
                        {"label": "2 Iron Dust", "key": "IRON_DUST", "sf": True}]},
             {"at": 11, "title": "Pan gravel, then wash", "note": "no power · this is how you make dust from gravel",
              "steps": [{"label": "Gravel", "key": "GRAVEL", "sf": False}, {"label": "Gold Pan", "key": "GOLD_PAN", "sf": True, "tag": "35% Sifted Ore"},
                        {"label": "Sifted Ore", "key": "SIFTED_ORE", "sf": True}, {"label": "Ore Washer", "key": "ORE_WASHER", "sf": True, "tag": "multiblock"},
                        {"label": "1 random dust", "key": "COPPER_DUST", "sf": True}]},
             {"at": 35, "title": "Electric chain", "note": "same results, up to 10x faster",
              "steps": [{"label": "Electric Gold Pan", "key": "ELECTRIC_GOLD_PAN_3", "sf": True}, {"label": "Electric Dust Washer", "key": "ELECTRIC_DUST_WASHER_3", "sf": True}]},
             {"at": 44, "title": "Cobble to dust", "note": "needs lots of power",
              "steps": [{"label": "Cobblestone x4", "key": "COBBLESTONE", "sf": False}, {"label": "Dust Extractor", "key": "DUST_EXTRACTOR", "sf": True},
                        {"label": "2 random dust", "key": "TIN_DUST", "sf": True}]}],
         "narration": "Before the machines, where does dust come from? There are four routes. First, crush iron or gold ore in the Ore Crusher and you get two dust for each ore, with no power. "
                      "Second, and this is the one most people ask about, gravel. Right-click gravel with a Gold Pan. By default about thirty-five percent of the time you get Sifted Ore; the rest is flint, clay or an iron nugget. "
                      "Then build the Ore Washer: a dispenser on top, an oak fence in the middle and a cauldron of water below. Put the Sifted Ore in the dispenser and right-click the fence. "
                      "You get one random dust, from nine kinds, and a stone chunk. Third, the electric Gold Pan and Dust Washer do the same up to ten times faster. "
                      "And fourth, the Dust Extractor turns plain cobblestone into dust, which is the one we are building today."},
        {"id": "power", "kind": "power",
         "machines": [{"name": "Cobblestone Generator", "addon": "ExtraTools", "use": cobble_use},
                      {"name": "Dust Extractor", "addon": "InfinityExpansion", "use": extractor_use}],
         "total": total, "generators": [{"name": kb.items[k]["name"], "gives": v, "need": need[k]} for k, v in gens.items() if v],
         "narration": f"Power is the real cost. The Cobblestone Generator lists {cobble_use} joules per second and the Dust Extractor "
                      f"lists {extractor_use}. Together that is {total}. A Solar Generator gives {gens['SOLAR_GENERATOR']} joules per second, so you would need "
                      f"{need['SOLAR_GENERATOR']} of them. Coal Generators give {gens['COAL_GENERATOR']}, so {need['COAL_GENERATOR']}. Lava Generators give "
                      f"{gens['LAVA_GENERATOR']}, so {need['LAVA_GENERATOR']}. Plan your generators first, and add capacitors to smooth the flow."},
        {"id": "cobble", "kind": "recipe", "item": "COBBLESTONE_GENERATOR", "grid": grid("COBBLESTONE_GENERATOR"),
         "label": kb.items["COBBLESTONE_GENERATOR"]["name"], "research": r("COBBLESTONE_GENERATOR"),
         "narration": f"First, the Cobblestone Generator from ExtraTools. Its research costs {r('COBBLESTONE_GENERATOR')} levels. "
                      f"Powered, it produces one cobblestone per cycle and pushes it into its output slots."},
        {"id": "extractor", "kind": "recipe", "item": "DUST_EXTRACTOR", "grid": grid("DUST_EXTRACTOR"),
         "label": kb.items["DUST_EXTRACTOR"]["name"], "research": None, "dusts": [{"name": d, "key": d.upper() + "_DUST"} for d in DUSTS],
         "narration": "Then the star of the farm: the Dust Extractor from InfinityExpansion. You craft it in the Enhanced Crafting Table from "
                      "a second-tier Electric Ore Grinder, a third-tier Electric Gold Pan and a third-tier Electric Dust Washer, two of each, plus machine circuits and a core. "
                      "Feed it four blocks of cobblestone, andesite, stone, diorite or granite, and it returns two of a random dust. "
                      "It can be copper, zinc, tin, aluminum, lead, silver, gold, iron or magnesium."},
        {"id": "storage", "kind": "cargo",
         "items": [{"name": kb.items[k]["name"], "research": r(k)} for k in ("CARGO_MANAGER", "CARGO_NODE_INPUT", "CARGO_NODE_OUTPUT", "OUTPUT_CHEST")],
         "narration": f"Now automate the storage with a cargo network. Place an Input Node touching the Dust Extractor: input nodes pull items out of "
                      f"the machine. Place an Output Node touching a chest, link them with connector nodes, and put a Cargo Manager in the network. "
                      f"Give both nodes the same channel, from zero to fifteen. The researches cost {r('CARGO_MANAGER')} levels for the manager and "
                      f"{r('CARGO_NODE_INPUT')} for the nodes. Dust now flows into the chest while you do something else."},
        {"id": "layout", "kind": "layout",
         "chain": ["Generators", "Capacitor", "Cobblestone Generator", "Dust Extractor", "Cargo Network", "Chest"],
         "narration": "Here is the whole line. Generators feed capacitors, capacitors power the Cobblestone Generator and the Dust Extractor, "
                      "the cargo network carries the dust, and a chest keeps it. From here, the dust can go to ingots and alloys."},
        {"id": "outro", "kind": "outro", "title": "Next: ingots, alloys and armor",
         "subtitle": "Want unlimited storage? Network Quantum Storage goes from 4K items up to infinity.",
         "narration": "For bigger setups, the Networks addon offers quantum storage with eight tiers, from four thousand items all the way up to infinite. "
                      "That is your first dust farm. See you at mc dot drakescraft dot cl."},
    ]
    out = ROOT / "video" / "public" / "storyboard.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps({"fps": 30, "scenes": scenes, "source": {"slimefun": kb.meta["slimefun"], "generated": kb.meta["generated_at"]}},
                              ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{len(scenes)} scenes -> {out}")
    print(f"items={len(cl)} researches={len(researches)} xp={xp} need={need} crafted={crafted}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
