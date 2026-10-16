# ⚙️ Guía Maestra: FluffyMachines en DrakesCraft (1.21.x)

> **Plugin / Addon:** `FluffyMachines-drake`  
> **Arquitectura:** Automatización Industrial, Crafteo Eléctrico Autónomo y Almacenamiento Cuántico.  
> **Compatibilidad SRE:** Optimizado para Paper 1.21.1 con ZGC Generacional (Cero Lag de Ticks).

---

## 1. Visión General de FluffyMachines

FluffyMachines es una de las expansiones mecánicas más potentes del ecosistema Slimefun en DrakesCraft. Su objetivo fundamental es eliminar el trabajo manual repetitivo mediante maquinaria automatizada de alta frecuencia:

1. **Auto-Crafteo Eléctrico (Electric Auto-Crafter)**: Permite automatizar cualquier receta de mesa de trabajo vanilla y de máquinas de Slimefun de 3x3.
2. **Generación y Almacenamiento Masivo**: Bancos de capacitores de densidad ultra-alta y generadores biológicos.
3. **Procesamiento Continuo**: Mesas de encantamiento automatizadas, des-encantadores y procesadores de alimentos.

---

## 2. El Auto-Crafter Eléctrico (Electric Auto-Crafter)

El corazón de la fábrica automatizada en DrakesCraft:

* **Consumo Energético**: 32 J/s continuo durante el ciclo de ensamble.
* **Malla de Entrada**: Matriz de 3x3 donde se programa el patrón del crafteo.
* **Búfer de Materiales**: 18 slots de inventario interno dedicados a la recepción de insumos vía redes de Cargo o Networks v6.
* **Regla SRE Anti-Dupe**:
  - En DrakesCraft, las recetas recursivas con contenedores devueltos (e.g. baldes vacíos tras usar baldes de agua/lava) son procesadas con transacciones atómicas.
  - Se recomienda acoplar un **Export Bus** o **Cargo Output Node** exclusivo para drenar los subproductos inmediatamente hacia un cofre de retorno.

---

## 3. Maquinaria de Procesamiento Pesado

| Máquina | Tiers Disponibles | Función Principal | Tasa de Producción |
|---|---|---|---|
| **Auto-Smelter** | Tier I / II / III | Fundición paralela de lingotes | 1 a 4 ítems/seg |
| **Electric Dust Washer** | Tier I / II | Lavado de menas trituradas sin consumo de agua manual | 2 polvos/seg |
| **Material Generator** | Mineral / Biomasa | Generación pasiva de bloques base consumiendo energía | 1 bloque cada 3 seg |
| **Advanced Quarry** | Superficie / Nether | Minería vertical automática sin bloques fantasmas | Escaneo por chunks |

---

## 4. Mejores Prácticas de Rendimiento (Dogma DrakesCraft SRE)

1. **Aislamiento de Redes**: Nunca conectes más de 16 Auto-Crafters a una sola línea de cableado sin un `Energy Regulator` dedicado.
2. **Buffer de Entrada Limpio**: Si un Auto-Crafter se queda sin uno de los 9 ingredientes de la receta, entra en modo espera (0 ticks de CPU) gracias al parche del buffer reactivo.
3. **Sinergia con Networks v6**: Utiliza **Network Interfaces** directamente adheridas a la parte trasera de los Auto-Crafters para evitar la creación de entidades de ítems en el suelo.
