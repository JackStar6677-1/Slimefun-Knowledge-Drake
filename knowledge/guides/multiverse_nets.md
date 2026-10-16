# 🌐 MultiverseNets — Guía Canónica y Arquitectura Técnica
> **Autor / Creador:** Chagui68 (DrakesCraft Sovereign Suite)  
> **Tipo:** Sistema Logístico Standalone de Redes Digitales (Sin dependencia de Slimefun, pero 100% interoperable)  
> **Código Fuente:** `DrakesCraft-Labs/MultiverseNets`  
> **Documentación Oficial:** `MultiverseNets/Wiki-es` y `MultiverseNets/Wiki-en`

---

## 1. Visión General y Filosofía de Diseño
**MultiverseNets** es una solución de transporte, almacenamiento digital masivo y autocrafteo diseñada específicamente para DrakesCraft. A diferencia de los addons tradicionales de Slimefun:
- **No depende de Slimefun ni de GuizhanLib:** No sufre roturas de ABI ante actualizaciones de Minecraft (1.21.11 -> 26.X).
- **Recetas Híbridas:** Se craftea en mesa de trabajo vanilla y utiliza la `Quantum Workbench` para subir de nivel las celdas sin pérdida de datos.
- **Interoperabilidad Total:** Puede importar y exportar ítems tanto de cofres vanilla como de cualquier bloque, máquina o contenedor de Slimefun.

---

## 2. Dispositivos y Bloques de Red (`DeviceType.java`)

| Dispositivo | Bloque Base Vanilla | Función Principal | Notas Técnicas |
| :--- | :--- | :--- | :--- |
| **`MVN_CONTROLLER`** | Magnetita (`LODESTONE`) | Núcleo de la red. Coordina dispositivos, calcula rutas y expone telemetría de CPU y memoria. | 1 controlador por red lógica. |
| **`MVN_CABLE`** | Cristal (`GLASS`) | Conducción de datos y energía entre nodos. | Sin pérdida de señal por distancia. |
| **`MVN_TERMINAL`** | Faro (`BEACON`) | Interfaz gráfica interactiva de visualización y extracción de ítems con buscador y filtros. | Búsqueda por texto y ordenación instantánea. |
| **`MVN_MONITOR`** | Ancla de Reaparición (`RESPAWN_ANCHOR`) | Muestra un holograma flotante con el ícono y cantidad en tiempo real de un ítem fijado. | Actualización en tiempo real. |
| **`MVN_GRABBER`** | Observador (`OBSERVER`) | Extrae ítems de un inventario adyacente hacia la red digital (velocidad estándar). | Configuración por caras. |
| **`MVN_GRABBER_HT`** | Pistón Pegajoso (`STICKY_PISTON`) | Importador de Alta Velocidad (High Throughput). | Extrae stacks completos por tick. |
| **`MVN_PUSHER`** | Diana (`TARGET`) | Inserta ítems de la red digital hacia el inventario adyacente según filtros. | Configurable con FilterMenu. |
| **`MVN_PUSHER_HT`** | Pistón (`PISTON`) | Exportador de Alta Velocidad (High Throughput). | Inserta stacks completos por tick. |
| **`MVN_QUANTUM_WORKBENCH`** | Mesa de Herrería / Crafteo | Mesa cuántica para upgradear Celdas de Almacenamiento conservando los ítems almacenados. | Crucial para migrar de Tier. |
| **`MVN_CRAFTER`** | Soltador (`DROPPER`) | Crafteador automático para recetas Vanilla mediante planos. | Ejecución autónoma. |
| **`MVN_ENCODER`** | Mesa de Cartografía | Codificador de patrones y planos de crafteo vanilla. | Graba la receta en un Blueprint. |
| **`MVN_SF_CRAFTER`** | Mesa de Flechas | Crafteador automático compatible con recetas de máquinas Slimefun. | Compatible con addons. |
| **`MVN_SF_ENCODER`** | Telar (`LOOM`) | Codificador de planos para recetas complejas de Slimefun. | Almacena recetas de ECT, Smeltery, etc. |
| **`MVN_CONFIGURATOR`** | Comparador (`COMPARATOR`) | Herramienta de mano para cambiar caras y modos sin abrir interfaces. | Clic derecho para inspeccionar. |

---

## 3. Celdas Cuánticas de Almacenamiento (`Quantum Storage Cells`)

Las celdas de almacenamiento se insertan en los dispositivos de disco y escalan exponencialmente:

| Celda | Capacidad | Bytes / Tipos de Ítems | Color / Estética |
| :--- | :--- | :--- | :--- |
| **`MVN_CELL_T1`** | **1,000 ítems** | 16 tipos | Terracota Blanca |
| **`MVN_CELL_T2`** | **4,000 ítems** | 32 tipos | Terracota Naranja |
| **`MVN_CELL_T3`** | **16,000 ítems** | 64 tipos | Terracota Magenta |
| **`MVN_CELL_T4`** | **64,000 ítems** | 128 tipos | Terracota Celeste |
| **`MVN_CELL_T5`** | **256,000 ítems** | 256 tipos | Terracota Amarilla |
| **`MVN_CELL_T6`** | **1,048,576 ítems** | Ilimitado | Terracota Verde Lima |

---

## 4. Interfaz Gráfica de Filtros (`FilterMenu.java` — 27 Slots)

A diferencia de Networks V6 (brújula de caras y slots 25/34) y Slimefun Cargo (canales 0-15), MultiverseNets implementa una GUI unificada de 3 filas (27 slots):

```
Fila 1 [00] [01] [02] [03] [04] [05] [06] [07] [08] -> Slots 0 al 8: Ítems filtrados
Fila 2 [09] [10] [11] [12] [13] [14] [15] [16] [17] -> Slots 9 al 16: Ítems filtrados | Slot 17: MODO (Whitelist / Blacklist)
Fila 3 [18] [19] [20] [21] [22] [23] [24] [25] [26] -> Caras: DOWN, UP, NORTH, SOUTH, WEST, EAST | ALL | CLEAR | HELP
```

- **Slots 0 a 16 (17 ranuras):** Plantillas de ítems fantasma (Ghost Items).
- **Slot 17:** Conmutador de modo:
  - 🟢 **Whitelist:** Solo transfiere los ítems en la lista.
  - 🔴 **Blacklist:** Transfiere todo excepto los ítems en la lista.
- **Slots 18 a 23:** Conmutadores individuales de caras (`DOWN`, `UP`, `NORTH`, `SOUTH`, `WEST`, `EAST`).
- **Slot 24:** `ALL DIRECTIONS` (activa o desactiva las 6 caras a la vez).
- **Slot 25:** `CLEAR` (limpia todos los filtros activos).
- **Slot 26:** `HELP` (imprime la guía interactiva en el chat del jugador).
