# 📦 Canon Canónico de Sistemas de Logística y Redes en DrakesCraft
> **Documento de Referencia Inmutable para Agentes de IA y Creadores de Video**  
> *Prohibido asumir mecánicas sin consultar este documento. Ningún agente debe mezclar las mecánicas de Cargo, Networks V6 y MultiverseNets.*

---

## 🏛️ Los Tres Sistemas de Logística Coexistentes

En DrakesCraft coexisten tres arquitecturas de transporte y almacenamiento digital de ítems. Cada una tiene su propio código fuente, sus propias GUIs exactas y sus propias mecánicas:

| Sistema | Autor / Origen | ¿Requiere Slimefun? | ¿Usa Canales Numéricos? | Interfaz y Selector Principal |
| :--- | :--- | :--- | :--- | :--- |
| **1. Slimefun Cargo** | TheBusyBiscuit (Vanilla SF) | Sí (Core Slimefun) | **SÍ (Canales 0 al 15)** | Flechas izquierda/derecha para cambiar ID de canal (0-15). |
| **2. Networks V6** | Sefiraat / Balugaq / Drake | Sí (Addon Slimefun) | **NO usa canales** | **Brújula Direccional** (North, South, East, West, Up, Down) + Slots de Plantilla (Template). |
| **3. MultiverseNets** | Chagui68 (Soberano Drake) | **NO (Standalone)** | **NO usa canales** | **FilterMenu 27 slots** (0-16 filtros, 17 Whitelist/Blacklist, 18-23 caras direccionales). |

---

## 1. Slimefun Base CARGO (`com.github.drakescraft_labs.slimefun4.implementation.items.cargo`)

* **Concepto:** Red de transporte básica por tuberías y nodos sobre bloques de inventario vanilla o Slimefun.
* **Componentes:**
  * `CARGO_INPUT_NODE`: **Extrae** ítems de un cofre o máquina y los inyecta al canal asignado.
  * `CARGO_OUTPUT_NODE`: **Inserta** ítems desde el canal hacia un cofre o máquina.
  * `CARGO_OUTPUT_NODE_2` (Avanzado): Inserta con filtro de 9 slots, modo Round Robin y Blacklist/Whitelist.
  * `CARGO_MANAGER`: Bloque central que gestiona el tick de la red.
* **Mecánica de Canales:**
  * La GUI de `AbstractCargoNode` tiene un selector de canal con dos flechas:
    * Slot izquierdo: `&bPrevious Channel`
    * Slot central: Indicador del canal actual (`Channel: 0` a `15`)
    * Slot derecho: `&bNext Channel`
  * Dos nodos solo se comunican si tienen exactamente el **mismo número de canal (0 al 15)** y están conectados físicamente por cables o adyacencia al Cargo Manager.

---

## 2. NETWORKS V6 (`io.github.sefiraat.networks`)

* **Concepto:** Red digital avanzada inspirada en Applied Energistics / Refined Storage. No utiliza canales; todos los nodos conectados forman una red lógica gobernada por un `NetworkRoot` (definido por el `Network Controller`).
* **Componentes Principales:**
  * `NETWORK_CONTROLLER` / `NETWORK_ROOT`: Cerebro de la red. Limita el número máximo de nodos según su nivel.
  * `NETWORK_BRIDGE` / `NETWORK_CABLE`: Conectores físicos entre nodos.
  * `NETWORK_GRABBER` (`NetworkGrabber.java`): Extrae ítems de inventarios adyacentes y los manda a la red.
  * `NETWORK_ADVANCED_GRABBER` (`NetworkAdvancedGrabber.java`): Extractor masivo (hasta 3.456 ítems/tick) con filtro.
  * `NETWORK_PUSHER` (`NetworkPusher.java`): Saca ítems de la red y los introduce al inventario adyacente.
  * `NETWORK_AUTO_CRAFTER` (`NetworkAutoCrafter.java`): Crafteador automático de recetas.
* **GUIs Exactas de Networks V6:**
  * **Brújula Direccional en Pusher y Grabber (`NetworkDirectional.java`):**
    * No hay canales numéricos. El nodo necesita saber **hacia qué cara del bloque adyacente interactuar**.
    * GUI tipo cofre con botones direccionales:
      * `NORTH_SLOT` (11 o 12)
      * `SOUTH_SLOT` (29 o 30)
      * `EAST_SLOT` (21 o 22)
      * `WEST_SLOT` (19 o 20)
      * `UP_SLOT` (14 o 15)
      * `DOWN_SLOT` (32 o 33)
    * `NetworkPusher` contiene además los `TEMPLATE_SLOTS` (slots 25 y 34) rodeados de cristales azules (`Push items matching template`). Si pones un ítem ahí, el Pusher solo empujará ese ítem específico.
  * **GUI de Auto-Crafter (`NetworkAutoCrafter.java`):**
    * 27 slots totales (3x9):
      * `BLUEPRINT_SLOT` = 10 (ranura izquierda para el plano de crafteo).
      * `STATUS_SLOT` = 13 (pantalla central: `STANDBY`, `OPERATIONAL`, `MISSING_MATERIALS`, `INSUFFICIENT_POWER`, `OUTPUT_FULL`).
      * `OUTPUT_SLOT` = 16 (ranura derecha de entrega del producto crafteado).
      * No requiere asignar canales; toma los ingredientes directamente del almacenamiento de la red Networks.

---

## 3. MULTIVERSENETS (`com.chagui68.multiversenets`) — Chagui68

* **Concepto:** Suite logística 100% standalone creada por **Chagui68** para DrakesCraft. No depende de Slimefun, no tiene colisiones de ABI y se craftea en mesa vanilla y en la `Quantum Workbench`.
* **Componentes Principales (`DeviceType.java`):**
  * `MVN_CONTROLLER` (Magnetita / Lodestone): Controlador central con telemetría de CPU y memoria.
  * `MVN_CABLE` (Vidrio / Glass): Cable de transmisión.
  * `MVN_TERMINAL` (Faro / Beacon): Terminal de almacenamiento masivo con buscador interactivo y ordenación.
  * `MVN_MONITOR` (Ancla de reaparición): Holograma que proyecta la cantidad exacta de un ítem en tiempo real.
  * `MVN_GRABBER` (Observer) y `MVN_GRABBER_HT` (Sticky Piston): Importadores simple y de alta velocidad.
  * `MVN_PUSHER` (Target) y `MVN_PUSHER_HT` (Piston): Exportadores simple y de alta velocidad.
  * `MVN_CELL_T1` a `T6`: Celdas cuánticas de almacenamiento de datos escaladas por color.
  * `MVN_QUANTUM_WORKBENCH`: Mesa especial para upgradear de Tier las celdas cuánticas sin perder su contenido.
  * `MVN_CRAFTER` y `MVN_ENCODER`: Crafteo automático vanilla mediante planos codificados.
  * `MVN_SF_CRAFTER` y `MVN_SF_ENCODER`: Crafteo automático de recetas Slimefun integrado con la red Multiverse.
  * `MVN_CONFIGURATOR` (Comparador): Llave de configuración para interactuar con caras y modos sin abrir el menú.
* **GUI Exacta de Filtros (`FilterMenu.java`):**
  * Inventario de 27 slots (3 filas de 9):
    * **Slots 0 al 16 (17 slots):** Cuadrícula de ítems filtrados (Ghost items / plantillas).
    * **Slot 17:** Botón conmutador de Modo (`WHITELIST` en esmeralda vs `BLACKLIST` en redstone).
    * **Slots 18 al 23:** Botones de Caras Direccionales activas (`DOWN`, `UP`, `NORTH`, `SOUTH`, `WEST`, `EAST`).
    * **Slot 24:** Botón `ALL DIRECTIONS` (activar o desactivar todas las caras).
    * **Slot 25:** Botón `CLEAR` (borrar todos los filtros).
    * **Slot 26:** Botón `HELP` (guía interactiva en chat).

---

## 🎯 Directrices para Videos y Tutoriales

1. **Si el video es de Slimefun Cargo:**
   * Mostrar el `Cargo Manager`, los cables de Slimefun y el selector de **Canal 0 al 15** con las flechas cyan `Previous` / `Next`.
2. **Si el video es de Networks V6:**
   * Mostrar el `Network Controller`, cables de Networks, y la **brújula direccional** (North, South, East, West, Up, Down). En el Pusher, mostrar los **Template Slots** (25 y 34). En el Auto-Crafter, mostrar el **Blueprint** en el slot 10 y el visor de estado en el slot 13.
3. **Si el video es de MultiverseNets (Chagui68):**
   * Mostrar la estética standalone: Controller de Magnetita, Terminal de Faro, celdas de terracota y el `FilterMenu` de 27 slots con las 6 caras en la fila inferior y el switch de Whitelist/Blacklist en el slot 17.
