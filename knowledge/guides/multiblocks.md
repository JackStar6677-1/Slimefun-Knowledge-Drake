# Core multiblocks (generated)

Generated from the runtime dump (Slimefun `11.0-Drake-1.21.11-SNAPSHOT`) and the core source. Every statement below cites the line it comes from; `review in code` means the pattern was not detected automatically.

Only lines that assign the dispenser block or internal container are used; every entry below is verified directly against Slimefun4-Drake source code.

| Multiblock | Dispenser / Container | Uses Output Chest | Recipes | Recipes with output > 1 | Source |
|---|---|---|---|---|---|
| Advanced Industrial Miner (`ADVANCED_INDUSTRIAL_MINER`) | none (chest above clicked blast furnace) | no (uses integrated chest) | 0 | 0 | `Slimefun4-Drake/src/main/java/com/github/drakescraft_labs/slimefun4/implementation/items/multiblocks/miner/IndustrialMiner.java:184` |
| Armor Forge (`ARMOR_FORGE`) | below the clicked block | yes | 119 | 0 | `Slimefun4-Drake/src/main/java/com/github/drakescraft_labs/slimefun4/implementation/items/multiblocks/ArmorForge.java:38` |
| Automated Panning Machine (`AUTOMATED_PANNING_MACHINE`) | none (hand input on oak trapdoor) | yes (adjacent to cauldron) | 0 | 0 | `Slimefun4-Drake/src/main/java/com/github/drakescraft_labs/slimefun4/implementation/items/multiblocks/AutomatedPanningMachine.java:96` |
| Compressor (`COMPRESSOR`) | below the clicked block | yes | 18 | 1 | `Slimefun4-Drake/src/main/java/com/github/drakescraft_labs/slimefun4/implementation/items/multiblocks/Compressor.java:61` |
| Enhanced Crafting Table (`ENHANCED_CRAFTING_TABLE`) | below the clicked block | yes | 2069 | 83 | `Slimefun4-Drake/src/main/java/com/github/drakescraft_labs/slimefun4/implementation/items/multiblocks/EnhancedCraftingTable.java:39` |
| Grind Stone (`GRIND_STONE`) | below the clicked block | yes | 19 | 13 | `Slimefun4-Drake/src/main/java/com/github/drakescraft_labs/slimefun4/implementation/items/multiblocks/GrindStone.java:121` |
| Industrial Miner (`INDUSTRIAL_MINER`) | none (chest above clicked blast furnace) | no (uses integrated chest) | 0 | 0 | `Slimefun4-Drake/src/main/java/com/github/drakescraft_labs/slimefun4/implementation/items/multiblocks/miner/IndustrialMiner.java:184` |
| Juicer (`JUICER`) | below the clicked block | yes | 29 | 0 | `Slimefun4-Drake/src/main/java/com/github/drakescraft_labs/slimefun4/implementation/items/multiblocks/Juicer.java:57` |
| Magic Workbench (`MAGIC_WORKBENCH`) | horizontally adjacent to crafting table | yes | 181 | 19 | `Slimefun4-Drake/src/main/java/com/github/drakescraft_labs/slimefun4/implementation/items/multiblocks/MagicWorkbench.java:78,120` |
| Makeshift Smeltery (`MAKESHIFT_SMELTERY`) | below the clicked block | yes | 0 | 0 | `Slimefun4-Drake/src/main/java/com/github/drakescraft_labs/slimefun4/implementation/items/multiblocks/AbstractSmeltery.java:44` |
| Ore Crusher (`ORE_CRUSHER`) | below the clicked block | yes | 16 | 2 | `Slimefun4-Drake/src/main/java/com/github/drakescraft_labs/slimefun4/implementation/items/multiblocks/OreCrusher.java:185` |
| Ore Washer (`ORE_WASHER`) | above the clicked block | yes | 11 | 0 | `Slimefun4-Drake/src/main/java/com/github/drakescraft_labs/slimefun4/implementation/items/multiblocks/OreWasher.java:95` |
| Pressure Chamber (`PRESSURE_CHAMBER`) | above the clicked block | yes | 3 | 0 | `Slimefun4-Drake/src/main/java/com/github/drakescraft_labs/slimefun4/implementation/items/multiblocks/PressureChamber.java:46` |
| Smeltery (`SMELTERY`) | below the clicked block | yes | 119 | 1 | `Slimefun4-Drake/src/main/java/com/github/drakescraft_labs/slimefun4/implementation/items/multiblocks/AbstractSmeltery.java:44` |
| Table Saw (`TABLE_SAW`) | none (hand input on stonecutter) | yes (adjacent to stonecutter) | 0 | 0 | `Slimefun4-Drake/src/main/java/com/github/drakescraft_labs/slimefun4/implementation/items/multiblocks/TableSaw.java:144` |

## Patterns (front view, top row first; `·` = empty)

### Advanced Industrial Miner (`ADVANCED_INDUSTRIAL_MINER`)
```
·                    | ·                    | ·                   
Piston               | Chest                | Piston              
Diamond Block        | Blast Furnace        | Diamond Block       
```

### Armor Forge (`ARMOR_FORGE`)
```
·                    | ·                    | ·                   
·                    | Anvil                | ·                   
·                    | Dispenser            | ·                   
```
Makes: Ender Helmet, Ender Chestplate, Ender Leggings, Ender Boots, Slime Helmet, Slime Chestplate … (+113)

### Automated Panning Machine (`AUTOMATED_PANNING_MACHINE`)
```
·                    | ·                    | ·                   
·                    | Oak Trapdoor         | ·                   
·                    | Cauldron             | ·                   
```

### Compressor (`COMPRESSOR`)
```
·                    | ·                    | ·                   
·                    | Nether Brick Fence   | ·                   
Piston               | Dispenser            | Piston              
```
Makes: Carbon, Steel Plate, Compressed Carbon, Reinforced Plate, Advanced Alloy, Carbon Plate … (+12)

### Enhanced Crafting Table (`ENHANCED_CRAFTING_TABLE`)
```
·                    | ·                    | ·                   
·                    | Crafting Table       | ·                   
·                    | Dispenser            | ·                   
```
Makes: Grandmas Walking Stick, Grandpas Walking Stick, Portable Crafter, Fortune Cookie, Output Chest, Portable Dustbin … (+2063)

### Grind Stone (`GRIND_STONE`)
```
·                    | ·                    | ·                   
·                    | Oak Fence            | ·                   
·                    | Dispenser            | ·                   
```
Makes: Magical Lump - I ×2, Ender Lump - I ×2, Wheat Flour, Ice Cube ×4, Mayo, Mustard … (+13)

### Industrial Miner (`INDUSTRIAL_MINER`)
```
·                    | ·                    | ·                   
Piston               | Chest                | Piston              
Iron Block           | Blast Furnace        | Iron Block          
```

### Juicer (`JUICER`)
```
·                    | Glass                | ·                   
·                    | Nether Brick Fence   | ·                   
·                    | Dispenser            | ·                   
```
Makes: Apple Juice, Carrot Juice, Melon Juice, Pumpkin Juice, Sweet Berry Juice, Golden Apple Juice … (+23)

### Magic Workbench (`MAGIC_WORKBENCH`)
```
·                    | ·                    | ·                   
·                    | ·                    | ·                   
Bookshelf            | Crafting Table       | Dispenser           
```
Makes: Diet Cookie, Ender Backpack, Magic Eye of Ender, Magical Glass, Elemental Staff, Elemental Staff - Wind … (+175)

### Makeshift Smeltery (`MAKESHIFT_SMELTERY`)
```
·                    | Oak Fence            | ·                   
Bricks               | Dispenser            | Bricks              
·                    | Flint And Steel      | ·                   
```

### Ore Crusher (`ORE_CRUSHER`)
```
·                    | ·                    | ·                   
·                    | Nether Brick Fence   | ·                   
Iron Bars            | Dispenser            | Iron Bars           
```
Makes: Iron Dust ×2, Gold Dust ×2, Sulfate, Crushed Ore, Pulverized Ore, Tiny Pile of Uranium … (+10)

### Ore Washer (`ORE_WASHER`)
```
·                    | Dispenser            | ·                   
·                    | Oak Fence            | ·                   
·                    | Cauldron             | ·                   
```
Makes: Copper Dust, Tin Dust, Silver Dust, Lead Dust, Aluminum Dust, Zinc Dust … (+5)

### Pressure Chamber (`PRESSURE_CHAMBER`)
```
Smooth Stone Slab    | Dispenser            | Smooth Stone Slab   
Piston               | Glass                | Piston              
Piston               | Cauldron             | Piston              
```
Makes: Synthetic Diamond, Carbonado, Soda Candy

### Smeltery (`SMELTERY`)
```
·                    | Nether Brick Fence   | ·                   
Nether Bricks        | Dispenser            | Nether Bricks       
·                    | Flint And Steel      | ·                   
```
Makes: Reinforced Alloy Ingot, Hardened Metal, Damascus Steel Ingot, Steel Ingot, Bronze Ingot, Duralumin Ingot … (+113)

### Table Saw (`TABLE_SAW`)
```
·                    | ·                    | ·                   
Smooth Stone Slab    | Stonecutter          | Smooth Stone Slab   
·                    | Iron Block           | ·                   
```

## When you really need an Output Chest

- Enhanced Crafting Table recipes in the dump: 2069. 83 produce more than one item per craft and 1501 use all nine slots.
- The table crafts into the dispenser's own free space after consuming one of each ingredient (`Slimefun4-Drake/src/main/java/com/github/drakescraft_labs/slimefun4/implementation/items/multiblocks/EnhancedCraftingTable.java:68`, `Slimefun4-Drake/src/main/java/com/github/drakescraft_labs/slimefun4/core/multiblocks/MultiBlockMachine.java:167`). If you load stacks to craft in bulk, every slot stays occupied, so the result has nowhere to go unless an Output Chest is next to the dispenser.
- Grind Stone, Ore Crusher and Ore Washer multiply or add outputs (Ore Crusher: 2 dust per ore; Ore Washer: dust + Stone Chunk), so their results also fill the dispenser quickly.

  - Christmas Cookie ×16
  - Hardened Glass ×16
  - Magical Essence ×16
  - Void Glass ×16
  - Mystery Metal Ingot ×16
  - Optic Cable ×16
  - Chain ×8
  - Cloth ×8
  - Tin Can ×8
  - Copper Wire ×8
  - Energy Connector ×8
  - GPS Teleporter Pylon ×8

## Sources

- `data/slimefun-dump.json.gz` (patterns, recipes, output amounts)
- `Slimefun4-Drake/src/main/java/com/github/drakescraft_labs/slimefun4/implementation/items/multiblocks/ArmorForge.java:38`
- `Slimefun4-Drake/src/main/java/com/github/drakescraft_labs/slimefun4/implementation/items/multiblocks/Compressor.java:61`
- `Slimefun4-Drake/src/main/java/com/github/drakescraft_labs/slimefun4/implementation/items/multiblocks/EnhancedCraftingTable.java:39`
- `Slimefun4-Drake/src/main/java/com/github/drakescraft_labs/slimefun4/implementation/items/multiblocks/GrindStone.java:121`
- `Slimefun4-Drake/src/main/java/com/github/drakescraft_labs/slimefun4/implementation/items/multiblocks/Juicer.java:57`
- `Slimefun4-Drake/src/main/java/com/github/drakescraft_labs/slimefun4/implementation/items/multiblocks/OreCrusher.java:185`
- `Slimefun4-Drake/src/main/java/com/github/drakescraft_labs/slimefun4/implementation/items/multiblocks/OreWasher.java:95`
- `Slimefun4-Drake/src/main/java/com/github/drakescraft_labs/slimefun4/implementation/items/multiblocks/PressureChamber.java:46`
