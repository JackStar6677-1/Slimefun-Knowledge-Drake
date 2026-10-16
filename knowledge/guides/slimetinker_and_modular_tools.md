# 🛠️ SlimeTinker — Guía de Herramientas Modulares y Forja de Modificadores

> **Addon Origen:** `SlimeTinker-drake`  
> **Inspirado en:** Conceptos de Tinkers' Construct adaptados 100% al ecosistema Slimefun4 de DrakesCraft.  
> **Área:** Creación modular de herramientas, Moldes (Casts & Dies), Rasgos de Materiales y Modificadores.

---

## 1. El Concepto Modular de SlimeTinker

En el Minecraft vanilla y en Slimefun básico, las herramientas son piezas fijas (un pico de diamante o un pico de cobalto). Si se gasta o no tiene los encantamientos deseados, debe crearse otro desde cero.

**SlimeTinker** cambia completamente este paradigma permitiendo construir herramientas combinando componentes individuales:
1. **Cabeza de Herramienta (Tool Head)**: Determina la velocidad base de minado y el daño de ataque.
2. **Mango (Tool Rod / Handle)**: Multiplica la durabilidad total de la herramienta.
3. **Fijador / Unión (Binding / Extra Part)**: Añade propiedades pasivas y rasgos especiales.

---

## 2. Las Estaciones de Trabajo

* **Mesa de Moldes (Stencil / Pattern Station)**:
  - Permite recortar patrones de madera en blanco para darles la forma deseada (cabeza de pico, hoja de espada, mango, binding).
* **Forja de Partes (Part Builder / Casting Table)**:
  - Si el material es básico (madera, piedra, hueso), se talla directamente en el Part Builder.
  - Si el material es metálico o mágico (hierro, oro, cobalto, aleaciones de Slimefun), se debe fundir en la fundición y verter sobre un molde de arcilla o latón (**Cast / Die**).
* **Estación / Forja de Herramientas (Tool Station & Tool Forge)**:
  - La GUI donde el jugador coloca las partes terminadas para ensamblar la herramienta final.
  - Asigna automáticamente el nombre, la durabilidad total y los rasgos combinados.

---

## 3. Rasgos de Materiales (Material Traits)

Cada material que el jugador utiliza aporta un rasgo distintivo extraído del código del addon (`TraitPartType` y `TraitEventType`):
* **Slime / Baba**: *Bouncy / Resorte* — Posibilidad de repeler ataques y no recibir daño de retroceso.
* **Madera**: *Ecológico* — Se repara lentamente bajo la luz solar directa.
* **Cobalto / Aleaciones Rápidas**: *Ligereza* — Aumenta drásticamente la velocidad de oscilación y minado.
* **Obsidiana Reforzada**: *Durabilidad Extrema* — 20% de probabilidad de no consumir durabilidad al picar bloques duros.
* **Materiales Mágicos / Ender**: *Telequinesis* — Los bloques rotos caen directamente en el inventario del jugador.

---

## 4. Modificadores (Upgrades)

Una vez ensamblada la herramienta, el jugador dispone de ranuras de modificación libres que puede mejorar en la Tool Station:
* **Polvo de Redstone**: Aumenta la velocidad de minado de forma exponencial.
* **Cuarzo del Nether**: Aumenta el daño de ataque por nivel.
* **Diamante / Esmeralda**: Aumenta la durabilidad base y eleva el nivel de minado.
* **Lápiz Lázuli**: Otorga el efecto Fortuna / Botín progresivo.
* **Mousse de Slime**: Aumenta la probabilidad de auto-reparación pasiva.
