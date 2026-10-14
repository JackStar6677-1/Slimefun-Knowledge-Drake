#!/usr/bin/env python3
"""Genera un explicador animado en SVG ("How to craft X") a partir del volcado, y su guion.

Todo el texto sale de los datos de data/slimefun-dump.json, nunca de un LLM libre: cada cifra del
video se puede rastrear al volcado. Salidas: out/<ID>.svg (animado, 1280x720) y out/<ID>.script.md
(narracion en ingles y espanol, con la misma cronologia que las escenas).

  python tools/explainer_svg.py ELECTRIC_FURNACE
"""
from __future__ import annotations

import html
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from kb import KB  # noqa: E402

OUT = pathlib.Path(__file__).resolve().parent.parent / "out"
W, H = 1280, 720
SCENE = 6.0  # segundos por escena
N_SCENES = 5
TOTAL = N_SCENES * SCENE
_scene = 0  # escena en construccion (para sincronizar las aparicones con su escena)
BG, GOLD, CREAM, LINE = "#071712", "#d8b65a", "#f4efdf", "#2a3d34"


def esc(s: str) -> str:
    return html.escape(str(s), quote=True)


def pop(inner: str, delay: float) -> str:
    """Aparicion con fundido dentro de la escena en construccion; se repite con el bucle del video."""
    a = (_scene * SCENE + delay) / TOTAL
    b = min(a + 0.4 / TOTAL, (_scene + 1) * SCENE / TOTAL)
    e = (_scene + 1) * SCENE / TOTAL
    kt = ";".join(f"{v:.4f}" for v in (0, a, b, e, 1))
    return (f'<g opacity="0"><animate attributeName="opacity" values="0;0;1;1;0" keyTimes="{kt}" '
            f'dur="{TOTAL}s" repeatCount="indefinite"/>{inner}</g>')


def tile(x: int, y: int, label: str, amount: int, kind: str, delay: float, size: int = 150) -> str:
    fill = {"sf": "#12352a", "vanilla": "#1b2330", "empty": "#0b1c16"}[kind]
    stroke = GOLD if kind == "sf" else "#6b7a8c" if kind == "vanilla" else LINE
    words = label.split()
    lines, cur = [], ""
    for w in words:
        if len(cur) + len(w) + 1 > 13 and cur:
            lines.append(cur)
            cur = w
        else:
            cur = f"{cur} {w}".strip()
    if cur:
        lines.append(cur)
    text = "".join(
        f'<text x="{x + size // 2}" y="{y + size // 2 - 6 * (len(lines) - 1) + i * 22}" text-anchor="middle" '
        f'fill="{CREAM}" font-size="19" font-weight="600">{esc(l)}</text>' for i, l in enumerate(lines[:3]))
    amt = f'<text x="{x + size - 10}" y="{y + size - 12}" text-anchor="end" fill="{GOLD}" font-size="22" ' \
          f'font-family="DM Mono, monospace">x{amount}</text>' if amount > 1 else ""
    return pop(f'<rect x="{x}" y="{y}" width="{size}" height="{size}" rx="6" '
               f'fill="{fill}" stroke="{stroke}" stroke-width="2"/>{text if kind != "empty" else ""}{amt}', delay)


def build(item_id: str) -> tuple[str, str]:
    kb = KB()
    it = kb.items[item_id]
    name = it["name"]
    group = kb.groups.get(it["group"], {}).get("name", it["group"])
    research = kb.researches.get(it.get("research", ""), {}).get("name")
    cost = it.get("research_cost")
    rt = it["recipe_type"].split(":")[1].replace("_", " ").title()

    global _scene
    scenes: list[str] = []
    narr_en: list[str] = []
    narr_es: list[str] = []

    # --- escena 1: titulo
    _scene = 0
    s1 = [f'<text x="640" y="250" text-anchor="middle" fill="{GOLD}" font-size="26" letter-spacing="6" '
          f'font-family="DM Mono, monospace">SLIMEFUN · HOW TO CRAFT</text>',
          f'<text x="640" y="360" text-anchor="middle" fill="{CREAM}" font-size="84" font-weight="800">{esc(name)}</text>',
          f'<text x="640" y="430" text-anchor="middle" fill="#9bb0a5" font-size="30">{esc(group)}</text>']
    scenes.append("".join(s1))
    narr_en.append(f"Today: how to craft the {name}. You will find it in the {group} category of the Slimefun guide.")
    narr_es.append(f"Hoy: cómo craftear el {name}. Lo encuentras en la categoría {group} de la guía de Slimefun.")

    # --- escena 2: receta 3x3
    _scene = 1
    ox, oy, gap, size = 150, 190, 12, 150
    parts = [f'<text x="640" y="110" text-anchor="middle" fill="{GOLD}" font-size="30" font-family="DM Mono, monospace">'
             f'STEP 1 · CRAFT IN THE {esc(rt.upper())}</text>']
    grid = it["recipe"]
    for r in range(3):
        for c in range(3):
            ref = grid[r * 3 + c]
            x, y = ox + c * (size + gap), oy + r * (size + gap)
            if not ref:
                parts.append(tile(x, y, "", 0, "empty", 0.2 * (r * 3 + c)))
            elif "sf" in ref:
                parts.append(tile(x, y, kb.items[ref["sf"]]["name"] if ref["sf"] in kb.items else ref["sf"], ref["amount"], "sf", 0.35 * (r * 3 + c) + 0.3))
            else:
                parts.append(tile(x, y, ref["material"].replace("_", " ").title(), ref["amount"], "vanilla", 0.35 * (r * 3 + c) + 0.3))
    parts.append(f'<text x="820" y="395" fill="{GOLD}" font-size="90">➜</text>')
    parts.append(tile(930, 320, name, it.get("output_amount", 1), "sf", 3.6, 200))
    scenes.append("".join(parts))
    rows = []
    for r in range(3):
        rows.append(", ".join(kb.name(grid[r * 3 + c]) if grid[r * 3 + c] else "empty" for c in range(3)))
    narr_en.append(f"Open the {rt} and place the ingredients like this. Top row: {rows[0]}. Middle row: {rows[1]}. "
                   f"Bottom row: {rows[2]}.")
    narr_es.append(f"Abre el {rt} y coloca los ingredientes así. Fila de arriba: {rows[0]}. Fila del medio: {rows[1]}. "
                   f"Fila de abajo: {rows[2]}.")

    # --- escena 3: de donde sale cada cosa
    _scene = 2
    parts = [f'<text x="640" y="110" text-anchor="middle" fill="{GOLD}" font-size="30" font-family="DM Mono, monospace">'
             f'STEP 2 · WHERE EACH PART COMES FROM</text>']
    sf_parts = {}
    for s in grid:
        if s and "sf" in s and s["sf"] in kb.items:
            sf_parts[s["sf"]] = kb.items[s["sf"]]
    y = 170
    en_bits, es_bits = [], []
    for sid, sit in list(sf_parts.items())[:5]:
        how = sit["recipe_type"].split(":")[1].replace("_", " ").title()
        ings = sorted({kb.name(x).rsplit(" x", 1)[0] for x in sit["recipe"] if x})
        line = f'{sit["name"]}  ←  {how}: ' + ", ".join(ings[:4]) + ("…" if len(ings) > 4 else "")
        parts.append(pop(f'<rect x="120" y="{y - 38}" width="1040" height="68" rx="6" fill="#0e241c" stroke="{LINE}"/>'
                         f'<text x="150" y="{y + 6}" fill="{CREAM}" font-size="26">{esc(line)}</text>', 0.5 + (y - 170) / 120))
        en_bits.append(f'{sit["name"]} is made in the {how} from {", ".join(ings[:4])}')
        es_bits.append(f'{sit["name"]} se fabrica en {how} con {", ".join(ings[:4])}')
        y += 90
    scenes.append("".join(parts))
    narr_en.append("Before that, make the parts. " + ". ".join(en_bits) + ".")
    narr_es.append("Antes, fabrica las piezas. " + ". ".join(es_bits) + ".")

    # --- escena 4: energia + investigacion + materias primas
    _scene = 3
    parts = [f'<text x="640" y="110" text-anchor="middle" fill="{GOLD}" font-size="30" font-family="DM Mono, monospace">'
             f'STEP 3 · UNLOCK AND POWER</text>']
    en_t, es_t = [], []
    yy = 220
    if research:
        parts.append(pop(f'<text x="160" y="{yy}" fill="{CREAM}" font-size="38">'
                         f'🔓 Research: <tspan fill="{GOLD}">{esc(research)}</tspan> · {cost} XP levels</text>', 0.4))
        en_t.append(f"First unlock the {research} research. It costs {cost} experience levels.")
        es_t.append(f"Primero desbloquea la investigación {research}. Cuesta {cost} niveles de experiencia.")
        yy += 90
    if "energy" in it:
        e = it["energy"]
        cons = f', uses {e["consumption_per_tick"]} J every tick' if "consumption_per_tick" in e else ""
        parts.append(pop(f'<text x="160" y="{yy}" fill="{CREAM}" font-size="38">'
                         f'⚡ Energy: <tspan fill="{GOLD}">{esc(e["type"].title())}</tspan>, buffer {e["capacity"]} J'
                         f'{esc(cons)}</text>', 1.2))
        en_t.append(f'It is an energy {e["type"].lower()} with a {e["capacity"]} joule buffer{cons}. Connect it to an energy network.')
        es_t.append(f'Es un componente de energía tipo {e["type"].lower()} con un búfer de {e["capacity"]} julios'
                    f'{(", y consume " + str(e["consumption_per_tick"]) + " J por tick") if "consumption_per_tick" in e else ""}. Conéctalo a una red de energía.')
        yy += 90
    scenes.append("".join(parts))
    narr_en.append(" ".join(en_t))
    narr_es.append(" ".join(es_t))

    # --- escena 5: cierre
    _scene = 4
    scenes.append(f'<text x="640" y="330" text-anchor="middle" fill="{CREAM}" font-size="64" font-weight="800">That\'s the {esc(name)}.</text>'
                  f'<text x="640" y="410" text-anchor="middle" fill="{GOLD}" font-size="34">Play it at mc.drakescraft.cl</text>')
    narr_en.append(f"That is the {name}. Come and build it on DrakesCraft.")
    narr_es.append(f"Eso es el {name}. Ven a construirlo en DrakesCraft.")

    n = len(scenes)
    assert n == N_SCENES
    total = TOTAL
    css = [f'text{{font-family:"Instrument Sans","Segoe UI",sans-serif}}',
           ]
    body = [f'<rect width="{W}" height="{H}" fill="{BG}"/>',
            f'<rect x="0" y="0" width="{W}" height="6" fill="{GOLD}"/>']
    for i, sc in enumerate(scenes):
        a, b = i * SCENE / total, (i + 1) * SCENE / total
        fade = min(0.4 / total, (b - a) / 2)
        kt = ";".join(f"{v:.4f}" for v in (0, a, a + fade, b - fade, b, 1))
        body.append(f'<g id="sc{i}" opacity="0"><animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="{kt}" '
                    f'dur="{total}s" repeatCount="indefinite"/>{sc}</g>')
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" '
           f'aria-label="How to craft {esc(name)} in Slimefun"><style>{"".join(css)}</style>{"".join(body)}</svg>')
    script = [f"# {name} ({item_id}) — explainer script", "", f"Source: slimefun-dump.json ({kb.meta['slimefun']}), generated {kb.meta['generated_at']}", ""]
    for i, (en, es) in enumerate(zip(narr_en, narr_es)):
        script += [f"## Scene {i + 1} ({i * SCENE:.0f}–{(i + 1) * SCENE:.0f}s)", f"- EN: {en}", f"- ES: {es}", ""]
    return svg, "\n".join(script)


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 1
    item_id = sys.argv[1].upper()
    svg, script = build(item_id)
    OUT.mkdir(exist_ok=True)
    (OUT / f"{item_id}.svg").write_text(svg, encoding="utf-8")
    (OUT / f"{item_id}.script.md").write_text(script, encoding="utf-8")
    print(f"out/{item_id}.svg  out/{item_id}.script.md")
    return 0


if __name__ == "__main__":
    sys.exit(main())
