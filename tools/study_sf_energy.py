#!/usr/bin/env python3
"""
tools/study_sf_energy.py — Extractor y analizador del ecosistema de energía de Slimefun en DrakesCraft.
Extrae todos los generadores, capacitores, reguladores y consumidores con sus tasas exactas en Joules por segundo (J/s).
"""
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = ROOT / "data" / "slimefun-dump.json"
OUT_JSON = ROOT / "video" / "src" / "sf-energy-data.json"

sys.stdout.reconfigure(encoding="utf-8")

def main():
    print("=" * 60)
    print("ANALIZANDO ECOSISTEMA DE ENERGÍA DE SLIMEFUN (DRAKESCRAFT)")
    print("=" * 60)

    if not DATA.exists():
        print(f"Error: {DATA} no encontrado.")
        return

    with open(DATA, "r", encoding="utf-8") as f:
        dump = json.load(f)

    items = dump.get("items", [])
    
    generators = []
    capacitors = []
    consumers = []
    regulators = []

    for it in items:
        if it.get("disabled"):
            continue
        
        energy_info = it.get("energy", {})
        type_str = str(energy_info).upper()
        name = it.get("name", "")
        item_id = it.get("id", "")
        
        # Clasificar según función energética
        if "REGULATOR" in item_id or "REGULATOR" in name.upper():
            regulators.append({
                "id": item_id,
                "name": name,
                "energy": energy_info,
                "recipe_type": it.get("recipe_type", "")
            })
        elif "CAPACITOR" in item_id or "CAPACITOR" in name.upper():
            capacitors.append({
                "id": item_id,
                "name": name,
                "capacity": energy_info.get("capacity", energy_info.get("buffer", 0)),
                "recipe_type": it.get("recipe_type", "")
            })
        elif "GENERATOR" in item_id or "REACTOR" in item_id or "SOLAR" in item_id:
            generators.append({
                "id": item_id,
                "name": name,
                "production": energy_info.get("production", energy_info.get("rate", 0)),
                "buffer": energy_info.get("buffer", 0),
                "recipe_type": it.get("recipe_type", "")
            })
        elif energy_info and (energy_info.get("consumption") or energy_info.get("rate", 0) < 0):
            consumers.append({
                "id": item_id,
                "name": name,
                "consumption": energy_info.get("consumption", abs(energy_info.get("rate", 0))),
                "buffer": energy_info.get("buffer", 0),
                "recipe_type": it.get("recipe_type", "")
            })

    print(f"Reguladores encontrados: {len(regulators)}")
    print(f"Generadores encontrados: {len(generators)}")
    print(f"Capacitores encontrados: {len(capacitors)}")
    print(f"Consumidores eléctricos encontrados: {len(consumers)}")

    result = {
        "regulators": regulators,
        "generators": generators[:15],
        "capacitors": capacitors,
        "consumers": consumers[:20],
    }

    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

    print(f"[OK] Catálogo de energía guardado en: {OUT_JSON}")

if __name__ == "__main__":
    main()
