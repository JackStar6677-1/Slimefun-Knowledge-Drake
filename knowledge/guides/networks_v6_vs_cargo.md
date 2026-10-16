# 🌐 Networks V6 vs Cargo Clásico — Guía de Logística y Almacenamiento

> **Repositorios de Referencia:** `NetworksV6-drake`, `Slimefun4-Drake`  
> **Tema Clave:** Diferencias visuales (Bloques/Cristales vs Cabezas de Jugador), Rendimiento, Automatización e Interfaces Gráficas (GUI).

---

## 1. La Gran Diferencia Visual: Bloques de Cristal vs Cabezas de Jugador

Una de las confusiones más comunes entre jugadores novatos y avanzados es cómo distinguir físicamente una instalación de Cargo clásico frente a una red moderna de **Networks V6**:

| Característica | Cargo Clásico (Legacy Slimefun4) | Networks V6 (Estándar DrakesCraft) |
|---|---|---|
| **Modelo Visual** | **Cabezas personalizadas (`PLAYER_HEAD` / Skulls)** montadas sobre los bloques. | **Bloques completos de Minecraft y Paneles/Bloques de Cristal Teñido (`STAINED_GLASS`)**. |
| **Punto Central** | **Cargo Manager** (Cabeza de jugador con textura de chip/controlador). | **Network Root / Network Controller** (Bloque completo con iluminación y núcleo activo). |
| **Canalizaciones** | Ninguna o conectores basados en nodos de cabeza. | **Cables de Red**: Bloques translúcidos de cristal teñido (Cian, Azul Claro, Magenta, Púrpura). |
| **Puntos de Conexión** | **Input Node / Output Node** (Cabezas adosadas a la cara de los cofres). | **Import / Export Bridges e Interfaces** (Bloques físicos que enlazan directamente a los contenedores). |
| **Acceso a Ítems** | Debe abrirse cada cofre individualmente. | **Network Grid**: Terminal interactiva donde se buscan y extraen ítems de toda la base en una sola pantalla. |

---

## 2. ¿Por qué el Cargo Clásico ya no se recomienda?

Aunque el Cargo de Slimefun original sigue existiendo por compatibilidad retrospectiva, en servidores con alta economía y supervivencia técnica avanzada como DrakesCraft presenta graves desventajas:

1. **Impacto en los Ticks del Servidor (TPS)**:
   - El Cargo clásico comprueba inventarios periódicamente mediante eventos pesados y tareas programadas en el hilo principal del servidor.
   - En granjas masivas de minerales o cultivos, cientos de nodos de Cargo provocan micro-tirones y bajan los TPS del servidor.
2. **Limitación de Frecuencias y Canales**:
   - Requiere configurar números de canal (1 al 16) abriendo manualmente la GUI de cada cabeza de nodo.
   - Es propenso a errores humanos donde un nodo mal configurado satura cofres equivocados.
3. **Cero Capacidad de Búsqueda Global**:
   - El Cargo sólo mueve ítems de A a B; no indexa el contenido. Si el jugador necesita encontrar 1 pieza de diamante entre 50 cofres dobles, debe revisar cofre por cofre.

---

## 3. La Superioridad de Networks V6

Networks V6 transforma Minecraft en una red de logística inspirada en sistemas como Applied Energistics 2 / Refined Storage, pero 100% nativa en el servidor (server-side, sin que el cliente necesite instalar mods):

### Componentes Principales y Bloques en el Juego:
* **Network Root**: El corazón del sistema. Un solo bloque que suministra energía eléctrica a toda la red de almacenamiento.
* **Cables de Cristal Teñido**:
  - Transportan datos e ítems de forma instantánea entre nodos sin tiempo de viaje físico.
  - Textura transparente/translúcida con rebordes que simula fibra óptica de alta tecnología.
* **Network Grid (Terminal de Acceso)**:
  - GUI de 54 ranuras con barra de búsqueda rápida.
  - Permite ordenar por nombre, cantidad o addon de Slimefun.
  - Permite craftear y retirar ítems directamente desde la pantalla.
* **Import & Export Buses**:
  - Succionan automáticamente productos terminados desde máquinas (por ejemplo, desde la `MobSimulationChamber`, hornos o maceradores) hacia los almacenes.
* **Integración con Infinity Barrels y Multiverse**:
  - Almacena hasta miles de millones de un solo ítem en un único bloque de barril, indexado en tiempo real dentro del Grid.

---

## 4. Guía Rápida para el Jugador: Cómo montar tu primera red Networks V6

1. **Paso 1: Colocar el Network Root**:
   - Pon el `Network Root` en el centro de tu sala de almacenamiento.
   - Aliméntalo con un cable de energía eléctrica Slimefun (`Energy Regulator` y red de generadores).
2. **Paso 2: Conectar tus Contenedores**:
   - Conecta líneas de cable de cristal desde el Root hasta tus cofres o barriles.
   - En la cara contigua a cada cofre/barril, coloca una **Network Storage Interface**.
3. **Paso 3: Colocar el Network Grid**:
   - Coloca el `Network Grid` en una pared accesible.
   - Haz clic derecho sobre el Grid: ¡verás instantáneamente todos los ítems almacenados en todos tus cofres conectados, listos para buscar con una sola palabra!
