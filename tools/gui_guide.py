#!/usr/bin/env python3
"""Reconstruye el libro de Slimefun (Guide) de DrakesCraft como datos para el visualizador de GUIs del video.

Todo sale del volcado: grupos (categorias), su orden de registro, iconos, bloqueos (LockedItemGroup), subgrupos y los items de cada una.
La disposicion replica SurvivalSlimefunGuide.java:
  - menu de 54 slots: fila 0 = cabecera (1 ajustes, 5 favoritos, 7 buscar), slots 9..44 = 36 categorias por pagina, 45..53 = pie (46 anterior, 52 siguiente)
  - receta: 27 slots, cuadricula 3x3 en 3,4,5/12,13,14/21,22,23, tipo de receta en 10 y resultado en 16
  Fuente: Slimefun4-Drake/.../implementation/guide/SurvivalSlimefunGuide.java:75,78,216,227,719-734,743-775
Es una RECONSTRUCCION: el orden real en produccion depende del orden de carga de los addons y de guide.alphabetical-sorting.

  python tools/gui_guide.py     # -> video/public/guide.json
"""
from __future__ import annotations

import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from kb import KB  # noqa: E402

kb = KB()
PAGE = 36
RECIPE_SLOTS = [3, 4, 5, 12, 13, 14, 21, 22, 23]
sys.stdout.reconfigure(encoding="utf-8")


def icon_of(g: dict) -> dict:
    return {"key": g["icon_sf"], "sf": True} if g.get("icon_sf") else {"key": g["icon_material"], "sf": False}


def main() -> int:
    groups = sorted(kb.groups.values(), key=lambda g: g["order"])
    subs = {g["key"] for g in groups if g.get("parent")}
    top = [g for g in groups if g["key"] not in subs and (g.get("items") or g["class"] in ("NestedItemGroup", "LockedItemGroup", "FlexItemGroup"))]
    pages = [top[i:i + PAGE] for i in range(0, len(top), PAGE)]
    main_pages = []
    for n, chunk in enumerate(pages, 1):
        slots = []
        for i, g in enumerate(chunk):
            slots.append({"slot": 9 + i, "name": g["display_name"], "lore": g["lore"][:4], "addon": g["addon"] or "Slimefun",
                          "locked_by": [kb.groups.get(k, {}).get("display_name", k) for k in g.get("locked_by", [])],
                          "nested": g["class"] == "NestedItemGroup", "n_items": len(g.get("items", [])), "key": g["key"], **icon_of(g)})
        main_pages.append({"page": n, "of": len(pages), "slots": slots})

    def category(key: str, limit: int = 36) -> dict:
        g = kb.groups[key]
        items = []
        for i, iid in enumerate(g["items"][:limit]):
            it = kb.items.get(iid)
            if not it:
                continue
            items.append({"slot": 9 + i, "id": iid, "name": it["name"], "key": iid, "sf": True, "research": it.get("research_cost"),
                          "recipe_type": it["recipe_type"].split(":")[1].replace("_", " ").title()})
        return {"key": key, "name": g["display_name"], "n_items": len(g["items"]), "slots": items}

    def recipe(item_id: str) -> dict:
        it = kb.items[item_id]
        cells = []
        for slot, s in zip(RECIPE_SLOTS, it["recipe"]):
            if s:
                cells.append({"slot": slot, "name": kb.items[s["sf"]]["name"] if "sf" in s else s["material"].replace("_", " ").title(),
                              "key": s.get("sf") or s["material"], "sf": "sf" in s, "n": s["amount"]})
        tk = it["recipe_type"].split(":")[1].upper()
        return {"id": item_id, "name": it["name"], "key": item_id, "sf": True, "type_icon": {"key": tk, "sf": tk in kb.items}, "type": it["recipe_type"].split(":")[1].replace("_", " ").title(),
                "type_key": it["recipe_type"].split(":")[1].upper(), "cells": cells, "research": it.get("research_cost")}

    stats = {"groups_total": len(groups), "top_level": len(top), "main_pages": len(pages), "subgroups": len(subs),
             "locked": [g["display_name"] for g in top if g["class"] == "LockedItemGroup"],
             "nested": [g["display_name"] for g in top if g["class"] == "NestedItemGroup"],
             "addons": len({g["addon"] for g in top if g.get("addon")})}
    ui = [{"key": k, "sf": False} for k in ("ENCHANTING_TABLE", "NETHER_STAR", "COMPASS", "ARROW", "BARRIER")]
    data = {"ui": ui, "stats": stats, "main_pages": main_pages,
            "category": category("slimefun:basic_machines"), "locked_example": next((g for g in main_pages[0]["slots"] + main_pages[-1]["slots"] if g["locked_by"]), None),
            "recipe": recipe("ELECTRIC_ORE_GRINDER"), "source": {"slimefun": kb.meta["slimefun"], "generated": kb.meta["generated_at"]}}
    out = ROOT / "video" / "public" / "guide.json"
    out.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{len(groups)} grupos, {len(top)} en el menu principal en {len(pages)} paginas, {len(subs)} subgrupos -> {out}")
    print("bloqueados:", stats["locked"], "| anidados:", len(stats["nested"]), "| addons:", stats["addons"])
    return 0


if __name__ == "__main__":
    sys.exit(main())
