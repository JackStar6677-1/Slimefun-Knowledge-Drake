# Output Chest: your first automatic storage

Audience: user. Language: English. Facts from the runtime dump (Slimefun `11.0-Drake-1.21.11`) and the cited source files.

## Summary

The Output Chest is the simplest storage in Slimefun: put it next to a multiblock machine's dispenser and the machine drops its results into the chest instead of
into the dispenser. It needs research (20 XP levels) and is crafted in the Enhanced Crafting Table.

## How it works

- The item's own description: "A basic machine will try to put items in this chest if it's placed adjacent to the dispenser."
- When a multiblock machine (Enhanced Crafting Table, Grind Stone, Ore Crusher, Ore Washer, Armor Forge, Compressor…) finishes, it asks for an Output Chest next to
  the dispenser before using the dispenser itself (`MultiBlockMachine.java:169`).
- The chest is looked for on five sides of the dispenser: up, north, east, south and west (not below it) (`OutputChest.java:40-45`).
- It only counts if the block is a Chest that was placed from the Output Chest item (`OutputChest.java:80-86`).
- It is also used by the Composter and the Automated Panning Machine (`Composter.java:123`, `AutomatedPanningMachine.java:96`).
- Recipe (Enhanced Crafting Table, research 20 levels): Lead Ingot ×5, Hopper ×1, Chest ×1 — see the `OUTPUT_CHEST` page for the exact 3×3 pattern.

## Step by step

1. Research Output Chest in the Slimefun Guide (20 levels) and craft it.
2. Build your multiblock machine (for example the Ore Crusher: Nether Brick Fence on top of a Dispenser, Iron Bars at both sides).
3. Place the Output Chest touching the dispenser, on any side except below it.
4. Put the ingredients in the dispenser and use the machine as usual: the results now land in the chest.

## Common mistakes

- Placing the chest below the dispenser: that side is not checked.
- Expecting it to move items from other machines: it only captures multiblock machine output (the electric machines and cargo networks use other systems).
- Letting the chest fill up: if the product does not fit in the Output Chest it is put in the dispenser instead, and if it fits in neither the machine cannot craft (`MultiBlockMachine.java:167-180`, `OutputChest.java:86`). Empty it or move to a bigger storage.

## Sources

- `Slimefun4-Drake/src/main/java/com/github/drakescraft_labs/slimefun4/implementation/items/blocks/OutputChest.java:40`
- `Slimefun4-Drake/src/main/java/com/github/drakescraft_labs/slimefun4/core/multiblocks/MultiBlockMachine.java:169`
- `Slimefun4-Drake/src/main/java/com/github/drakescraft_labs/slimefun4/implementation/items/blocks/Composter.java:123`
- `Slimefun4-Drake/src/main/java/com/github/drakescraft_labs/slimefun4/implementation/items/multiblocks/AutomatedPanningMachine.java:96`
- `data/slimefun-dump.json.gz` (OUTPUT_CHEST: research cost, recipe, lore)
