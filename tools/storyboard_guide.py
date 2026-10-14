#!/usr/bin/env python3
"""Storyboard del episodio "Como funciona el libro de Slimefun (Guide)", con cifras del volcado y citas al codigo.

Citas: SurvivalSlimefunGuide.java:75 (36 categorias por pagina), :78 (slots de receta), :216/:227 (botones de pagina),
:400 ("Click to unlock" y "Cost: N Level(s)"), :313 (categoria bloqueada), :719-734 (vista de receta), :743-775 (cabecera, favoritos, busqueda).
Salida: video/public/guide-storyboard.json (los datos de las GUIs estan en guide.json, generado por gui_guide.py).
"""
from __future__ import annotations

import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
G = json.loads((ROOT / "video" / "public" / "guide.json").read_text(encoding="utf-8"))
S = G["stats"]
cat = G["category"]
rec = G["recipe"]
n_pages = S["main_pages"]


def main() -> int:
    scenes = [
        {"id": "title", "kind": "title", "title": "How the Slimefun Guide works",
         "subtitle": "Categories, researches and recipes · DrakesCraft",
         "narration": "Everything in Slimefun starts in one book: the Slimefun Guide. Before you build a single machine, it is worth learning how to read it."},
        {"id": "menu", "kind": "gui_menu", "page": 1,
         "callouts": [{"slot": 1, "text": "Settings"}, {"slot": 5, "text": "Favorites"}, {"slot": 7, "text": "Search"}],
         "narration": f"This is the main menu. The top row holds your settings, your favorites and the search button. Each category is an icon, "
                      f"with thirty-six categories per page. On DrakesCraft the guide has about {S['top_level']} categories across {n_pages} pages, "
                      f"because every addon adds its own. Click an icon to open it."},
        {"id": "pages", "kind": "gui_pages",
         "narration": f"Use the arrows at the bottom to change pages. The previous arrow and the next arrow sit in the bottom row. "
                      f"There are {n_pages} pages, and the addons we run fill most of them."},
        {"id": "locked", "kind": "gui_locked", "locked": S["locked"],
         "narration": "Some categories show a red barrier instead of an icon. They are locked. Energy and Electricity, GPS-based Machines, Programmable Androids "
                      "and Cargo Management stay locked until you finish the Basic Machines category, and Talismans Tier Two stays locked until you finish Tier One. "
                      "That is the guide telling you the order to learn things."},
        {"id": "category", "kind": "gui_category",
         "narration": f"Open a category and you see its items, thirty-six per page. {cat['name']} has {cat['n_items']}. An item you cannot craft yet is shown locked, "
                      f"with a line that says click to unlock and a cost in levels. That cost is the research: you pay experience levels once, and the item is yours forever."},
        {"id": "recipe", "kind": "gui_recipe",
         "narration": f"Click an unlocked item to see its recipe. The three by three grid is the crafting pattern, the icon on the left shows where to craft it, "
                      f"here the {rec['type']}, and the item on the right is the result. The {rec['name']}, for example, needs research costing {rec['research']} levels."},
        {"id": "extras", "kind": "title", "title": "Search and favorites",
         "subtitle": "Search any item by name · right-click a recipe to save it to Favorites",
         "narration": "If you do not know where something is, use the search button and type its name in chat. And when you find a recipe you will need again, "
                      "right-click it to save it to your favorites."},
        {"id": "outro", "kind": "title", "title": "DrakesCraft keeps growing",
         "subtitle": f"This tour is rebuilt from the live server · {S['addons']} addons and counting",
         "narration": f"DrakesCraft is always in development, and this tour is generated from the live server, so it stays up to date as we add addons. "
                      f"Next: how multiblocks work, and then your first dust farm."},
    ]
    out = ROOT / "video" / "public" / "guide-storyboard.json"
    out.write_text(json.dumps({"fps": 30, "scenes": scenes, "source": G["source"]}, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{len(scenes)} escenas -> {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
