import json
import pathlib
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT = pathlib.Path(__file__).resolve().parent.parent
data_file = ROOT / "data" / "slimefun-dump.json"

if not data_file.exists():
    print("No sf-knowledge-data.json found")
    sys.exit(0)

with open(data_file, "r", encoding="utf-8") as f:
    dump = json.load(f)

items = dump.get("items", [])
print(f"Total items in knowledge data: {len(items)}")

# Search for metals, alloys, and smeltery recipes
metals = []
multiblocks = []
for item in items:
    cat = item.get("category", "")
    name = item.get("name", "")
    item_id = item.get("id", "")
    recipe_type = item.get("recipe_type", "")
    
    if any(k in name.lower() or k in item_id.lower() for k in ["ingot", "dust", "alloy", "steel", "bronze", "duralumin", "carbon", "gold", "silver", "lead", "copper", "tin", "zinc", "magnesium", "aluminum"]):
        metals.append(item)
    if any(k in name.lower() or k in item_id.lower() for k in ["smeltery", "armor forge", "compressor", "crusher", "pressure"]):
        multiblocks.append(item)

print(f"Found {len(metals)} metal/alloy items and {len(multiblocks)} metallurgy-related machines.")

# Output top alloys
print("\n--- SAMPLE ALLOYS & METALS ---")
for m in metals[:20]:
    print(f"- {m.get('name')} [{m.get('id')}]: RecipeType={m.get('recipe_type')}")

out_metals = ROOT / "video" / "src" / "sf-metals-data.json"
with open(out_metals, "w", encoding="utf-8") as f:
    json.dump({"metals": metals, "multiblocks": multiblocks}, f, indent=2, ensure_ascii=False)
print(f"\nSaved {out_metals.name}")
