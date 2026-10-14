---
name: slimefun-knowledge
description: Knowledge base about Slimefun and the DrakesCraft addons (items, recipes, energy, automation flows, Networks, Galaxyfun, Multiverse…). Use before answering any question about how to craft or automate something in Slimefun, or before writing tutorials, dialogues or video scripts.
---

# Slimefun knowledge — how to use it

Facts come from a runtime dump of the real server registry (`data/slimefun-dump.json`). Never answer a recipe, number or
requirement from memory: look it up.

1. **Find an item**: `python tools/kb.py buscar <text>` → id.
2. **How to craft / what you need first / who produces it / where it is used**:
   `python tools/kb.py receta|ruta|produce|usos <ID>`; full ingredient tree: `arbol <ID>`.
3. **Pages**: `knowledge/items/<addon>/<ID>.md`, `knowledge/addons/<addon>.md`, production chains in `knowledge/flows/<ID>.md`.
4. **How a system works** (energy, cargo, androids, Networks, Galaxyfun…): `knowledge/mechanics/<topic>.md`. If the page does not
   exist yet, run `python tools/study_queue.py brief <topic>`, read the listed sources, write the page and validate it with
   `python tools/verify.py <file>`.
5. **Audience**: anything marked `staff` (see `knowledge/audience.json`) must never appear in public guides, dialogues or videos.
6. **Language**: player-facing text is in English; notes to the owner may be Spanish.
7. **Never invent**: if the dump or the code does not say it, say you do not know and add it to the study queue.

Video/dialogue scripts: generate them from the dump with `python tools/explainer_svg.py <ID>` (SVG + EN/ES script); do not
publish without the owner's approval.
