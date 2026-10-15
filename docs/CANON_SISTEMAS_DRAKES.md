# 🏛️ Canon Integral de Sistemas, Flujos y Plugins en DrakesCraft
> **Fuente Canónica de Verdad para Agentes de IA y Generación de Contenido Técnico**  
> *Prohibido asumir código upstream de TheBusyBiscuit. Toda la lógica de DrakesCraft se basa en los repositorios de la organización (`DrakesCraft-Labs`), el monorepo `Drakes-Suites` y los 163 plugins `.jar` corriendo en producción (Dallas, Paper 1.21.11+).*

---

## 📌 1. Repositorio de Verdad: Slimefun4-Drake & Drakes-Suites (No Upstream)

1. **Paquetes y Clases Reales:**
   - El código upstream de TheBusyBiscuit (`io.github.thebusybiscuit.slimefun4`) está completamente obsoleto en nuestro ecosistema.
   - En nuestro fork oficial:
     * Paquete base: `com.github.drakescraft_labs.slimefun4.*`
     * Ubicación local: `/home/jack/Documentos/Desarrollo/Repositorios/drakescraft/Slimefun4-Drake`
     * JAR en producción: `Slimefun-1.2.DEV v11.0-Drake-1.21.11-SNAPSHOT.jar`
   - En la suite consolidada (**StarSuites / Drakes-Suites**):
     * Paquete base: `com.drakescraft.suites.*`
     * Ubicación local: `/home/jack/Documentos/Desarrollo/Repositorios/drakescraft/Drakes-Suites`
2. **Aceleración Nativa Off-Heap (Rust FFM Java 21):**
   - **`Slimefun-Rust` (`libslimefun_ffi.so`):** Resuelve la topología de grafos de red (Networks/Cargo) y la matriz de energía con instrucciones SIMD en memoria nativa, evitando el freeze del Garbage Collector en Paper 1.21.11+.
   - **`Star-Rust` / `Odysseia-Rust` (`libodysseia_ffi.so`):** `RedstoneClockGuard` (throttling anti-lag de loops), filtro de chat y evaluador espacial 3D de auras para los 26 dioses de `DrakesBosses`.

---

## 📦 2. Demarcación de Almacenamiento y Logística (6 Sistemas Diferentes)

En DrakesCraft existen 6 arquitecturas de transporte y almacenamiento. **ESTÁ PROHIBIDO MEZCLARLAS O ASUMIR MECÁNICAS CRUZADAS:**

| Sistema | Tipo / Addon | ¿Usa Canales? | Selector en GUI | Almacenamiento Físico |
| :--- | :--- | :--- | :--- | :--- |
| **1. Slimefun Cargo** | Core Slimefun (`slimefun4`) | **SÍ (0 al 15)** | Flechas `◀ Prev` / `Next ▶` | Red de tuberías directas entre contenedores. |
| **2. Networks V6** | Addon SF (`NetworksV6-drake`) | **NO (CERO canales)** | **Brújula Direccional** (N, S, W, E, UP, DN) + Template Slots (25 & 34) | Discos cuánticos / Celdas en `NetworkRoot`. |
| **3. MultiverseNets** | **Standalone 100%** (Chagui68) | **NO (CERO canales)** | **FilterMenu 27 slots** (0-16 filtros, 17 Modo, 18-23 caras) | Celdas cuánticas T1 a T6 en Terminal / Controller. |
| **4. ChestTerminal** | Addon SF (`ChestTerminal-drake`) | No | Buscador de texto sobre cofres | Cofres vanilla indexados por cables de terminal. |
| **5. SensibleToolbox** | Standalone / Bridge (`SensibleToolbox`) | No | Módulos y GUI de tuberías STB | Red de bloques modulares STB. |
| **6. Infinity Storage** | Addon SF (`InfinityExpansion-drake`) | No | GUI de unidad de almacenamiento | Storage Units (Singularidades, Void, Infinite). |

---

## ⚡ 3. Red de Energía (Energy Net)

* **Arquitectura:**
  - `EnergyNet.java` (`com.github.drakescraft_labs.slimefun4.core.networks.energy.EnergyNet`).
  - No usa cables de red; la energía viaja a través de bloques adyacentes o nodos conectores (`ENERGY_CONNECTOR`).
* **Roles de Componentes:**
  - **Generadores (`AbstractEnergyProvider`):** Solar (`4 J/s`), Coal (`16 J/s`), Lava (`20 J/s`), Bio, Combustion, Magnesium, Nuclear.
  - **Capacitores (`Capacitor`):** Almacenan Joules (J). Small (`16 J`), Medium (`128 J`), Big (`512 J`), Large (`1024 J`), Carbon (`4096 J`), Power Crystal (`16384 J`).
  - **Consumidores:** Máquinas eléctricas con buffer interno y consumo por tick (`J/tick`).
  - **Reguladores (`EnergyRegulator`):** Nodos clave que evitan la sobrecarga del grafo y sincronizan la red en el tick.
* **Optimización en Producción:**
  - El cómputo del grafo de energía está delegado a `Slimefun-Rust` (`libslimefun_ffi.so`) para procesar 100,000+ máquinas concurrentes a 20 TPS sin ticks perdidos.

---

## 🔨 4. Procesamiento de Minerales (Ore Processing & Dust)

### A. Cadena Multibloque Manual:
1. **`GOLD_PAN` (Grava):** Clic derecho en Gravel. Probabilidades estándar: Flint (40%), Sifted Ore (35%), Clay (20%), Iron Nugget (5%).
2. **`ORE_CRUSHER` (Nether Brick Fence sobre Dispenser + Iron Bars):** Duplica solo Iron Ore y Gold Ore (2 polvos). Sifted Ore ➔ Crushed Ore ➔ Pulverized Ore.
3. **`ORE_WASHER` (Dispenser arriba + Oak Fence al medio + Cauldron con agua abajo):** Clic derecho a la valla. Sifted Ore ➔ 1 polvo aleatorio de los 9 metales (Iron, Gold, Copper, Tin, Zinc, Aluminum, Magnesium, Lead, Silver) + 1 Stone Chunk.
4. **`OUTPUT_CHEST` (Cofre de Salida):**
   - **Regla de Oro:** Se coloca en 5 caras posibles del Dispenser: **Arriba, Norte, Este, Sur u Oeste**. **JAMÁS ABAJO**.
   - Solo captura productos de multibloques mecánicos (`MultiBlockMachine`). Si está lleno, el producto va al Dispenser; si ambos están llenos, la máquina se detiene.

### B. Cadena Eléctrica Automatizada (Tech):
1. **`ELECTRIC_GOLD_PAN` (Tiers I, II, III):** Paneo automático a alta velocidad.
2. **`ELECTRIC_DUST_WASHER` (Tiers I, II, III):** Lavado continuo con energía.
3. **`ELECTRIC_ORE_GRINDER` (Tiers I, II, III):** Molienda eléctrica directa.
4. **`DUST_EXTRACTOR` (InfinityExpansion):** Convierte 4 Cobblestone directamente en 2 polvos de mineral aleatorio, consumiendo alta energía (480 J/s).

---

## 🤖 5. Crafteo Automático (4 Arquitecturas)

1. **Networks Auto-Crafter (`NetworkAutoCrafter.java`):**
   - No usa mesas de trabajo. Requiere un plano (**Blueprint**) en el **slot 10**, muestra el estado en el **slot 13** (`STANDBY`, `OPERATIONAL`, `MISSING_MATERIALS`) y entrega en el **slot 16**. Saca los ingredientes directamente de los discos/celdas de la red.
2. **Multiverse Crafter (`MVN_CRAFTER` / `MVN_SF_CRAFTER` — Chagui68):**
   - Crafteo automático independiente. Graba planos en el `MVN_ENCODER` y craftea recetas vanilla 3x3 o recetas Slimefun conectadas a la red de celdas cuánticas.
3. **Automated Crafting Chamber (Slimefun Base):**
   - Máquina eléctrica que automatiza las recetas del Enhanced Crafting Table mediante energía eléctrica.
4. **Infinity Forge (InfinityExpansion):**
   - Forja de recetas de endgame para Singularidades, armaduras infinitas y reactores avanzados.

---

## 🧬 6. Biología, Genética y Fauna

1. **`GeneticChickengineering-Reborn-drake`:**
   - Sistema de pollos genéticos de Tiers 0 al 9.
   - Requiere incubadoras (`INCUBATOR`), cámaras de empalme genético (`GENE_SPLICER`) y clonadoras de ADN.
2. **`SlimyBees`:**
   - Abejas genéticamente modificadas con panales que producen metales preciosos y recursos raros de Slimefun.
3. **`MobCapturer-drake`:**
   - Cañones y esferas de contención para transportar mobs pacíficos y hostiles.
4. **`ExoticGarden-drake`:**
   - Plantas exóticas, árboles frutales y recetas gastronómicas (jugos, comidas y elixires).

---

## ⚔️ 7. Panteones de Jefes y Modalidades (DrakesCraft Ecosistema)

1. **`DrakesBosses` & `MultiverseCreatures`:**
   - 26 Dioses en panteones (Griego, Nórdico, Egipcio, Abisal, Celestial).
   - Comportamientos marciales dinámicos, invocaciones por altares y auras evaluadas por `Star-Rust`.
2. **`InvSwitcher-Drake`:**
   - Aislamiento estricto de inventarios, armaduras, niveles y efectos entre las 5 modalidades del servidor (Survival, OneBlock, SkyBlock, CaveBlock, AcidIsland).
3. **`PlayerVaultZ-Drake`:**
   - Bóvedas seguras (`/pv`) con aislamiento estricto por modalidad en base de datos SQLite WAL.
4. **`DrakesSlimeMarket` (`/sm`):**
   - Motor macroeconómico con 777 ofertas dinámicas, suavizado de circulante (alpha 0.30) e impuestos automáticos.
5. **Plugins Comerciales Licenciados (Propietarios - Cerrados):**
   - `nLogin` (NickUC) con anti-bot y captcha off-thread.
   - `TAB` (NEZNAMY) para tablist y prefijos.
   - `UltimateShop` para transacciones comunitarias en GUI.
   - `GrimAC` para detección de cheats predictiva.
