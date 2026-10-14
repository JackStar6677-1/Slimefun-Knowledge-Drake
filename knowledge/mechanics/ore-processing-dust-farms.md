# Ore processing and dust: where every dust comes from

Audience: user. Language: English. Facts are from the runtime dump (Slimefun `11.0-Drake-1.21.11`) and the cited source files.

## Summary

Slimefun has four ways to get metal dust. Which one you use depends on what you can already mine and how much power you have.

| Route | Input | Machine | Output | Needs power |
|---|---|---|---|---|
| Crush ore | Iron Ore or Gold Ore | Ore Crusher (multiblock) | 2 Iron Dust or 2 Gold Dust per ore | no |
| Pan gravel, then wash | Gravel | Gold Pan, then Ore Washer (multiblock) | 1 random dust per Sifted Ore | no |
| Electric chain | Ores, gravel, Sifted Ore | Electric Ore Grinder, Electric Gold Pan, Electric Dust Washer | same results, 1x to 10x faster | yes |
| Cobble to dust | 4 cobblestone-type blocks | Dust Extractor (InfinityExpansion) | 2 of one random dust | yes (480 J/s listed) |

## How it works

**Gold Pan (gravel dust).** Right-click Gravel with the Gold Pan. Each use gives one random drop, weighted by default: Flint 40, Clay 20,
**Sifted Ore 35**, Iron Nugget 5 (so about 35% of pans give Sifted Ore). The weights are item settings (`chance.FLINT`, `chance.CLAY`, `chance.SIFTED_ORE`, `chance.IRON_NUGGET`), so a server can change them. The Nether Gold Pan does the same on Soul Sand.

**Ore Washer (Sifted Ore to dust).** Build the multiblock: Dispenser on top, Oak Fence in the middle, Cauldron at the bottom (filled with water).
Put Sifted Ore in the Dispenser and right-click the Oak Fence (the middle block; the washer looks for the Dispenser above the block you click). Each Sifted Ore gives one dust chosen at random from nine: Iron, Gold, Copper, Tin, Zinc, Aluminum, Magnesium, Lead and Silver, **plus one Stone Chunk** as a by-product. The washer also turns 2 Sand into Salt and Pulverized Ore into Pure Ore Cluster.

**Ore Crusher.** Iron Ore and Gold Ore are the only ores it doubles into dust (`IRON_DUST` and `GOLD_DUST`, 2 each). It also turns
Sifted Ore into Crushed Ore, and Crushed Ore into Pulverized Ore, which the Ore Washer turns into Pure Ore Cluster.

**Electric versions.** Electric Gold Pan (researches 18/25/32 XP levels for tiers I/II/III), speed 1x/3x/10x, listed at 2/4/14 J/s.
Electric Dust Washer tier I is listed at 6 J/s (research 18 levels) and tier III at 30 J/s with speed 10x (research 32 levels).

**Dust Extractor.** Four cobblestone, andesite, stone, diorite or granite give 2 of one random dust of the same nine. It is the only route
that needs no ore and no gravel, only cobblestone (from a Cobblestone Generator) and about 480 J/s.

## Step by step: your first dust without electricity

1. Research Gold Pan (5 XP levels) and Ore Washer (5 XP levels), and Ore Crusher (6 levels) in the Slimefun Guide.
2. Craft a Gold Pan: Stone in the sides and bottom, Bowl in the middle of the row above the bottom (see `GOLD_PAN` page).
3. Pan Gravel until you collect Sifted Ore.
4. Build the Ore Washer, put Sifted Ore in the Dispenser and right-click the Oak Fence. You get one random dust (and a Stone Chunk) each time.
5. Build the Ore Crusher and crush Iron/Gold Ore for 2 dust each.

## Common mistakes

- Expecting the Ore Washer to give a chosen dust: it is random among nine, so a farm needs storage that accepts all of them.
- Forgetting that panning has only ~35% chance of Sifted Ore with default weights; electric pans and a gravel source fix that.
- Planning the Dust Extractor's power late: it lists 480 J/s, far above one generator (Solar 4 J/s, Coal 16, Lava 20 as listed on the items).

## Sources

- `Slimefun4-Drake/src/main/java/com/github/drakescraft_labs/slimefun4/implementation/items/tools/GoldPan.java:54`
- `Slimefun4-Drake/src/main/java/com/github/drakescraft_labs/slimefun4/implementation/items/tools/GoldPan.java:92`
- `Slimefun4-Drake/src/main/java/com/github/drakescraft_labs/slimefun4/implementation/items/multiblocks/OreWasher.java:44`
- `Slimefun4-Drake/src/main/java/com/github/drakescraft_labs/slimefun4/implementation/items/multiblocks/OreWasher.java:62`
- `Slimefun4-Drake/src/main/java/com/github/drakescraft_labs/slimefun4/implementation/items/multiblocks/OreWasher.java:95`
- `Slimefun4-Drake/src/main/java/com/github/drakescraft_labs/slimefun4/implementation/items/multiblocks/OreWasher.java:131`
- `InfinityExpansion-drake/src/main/java/com/github/drakescraft_labs/infinityexpansion/items/machines/Machines.java:532`
- `data/slimefun-dump.json.gz` (recipe types ore_crusher, ore_washer, gold_pan; energy and lore of the electric machines)
