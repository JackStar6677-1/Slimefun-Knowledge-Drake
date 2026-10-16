# 🧬 Mob Simulation & Data Cards — Guía Maestra de Supervivencia Técnica

> **Addon Origen:** `InfinityExpansion-drake`  
> **Clase Java Clave:** `com.github.drakescraft_labs.infinityexpansion.items.mobdata.MobSimulationChamber` & `MobDataCard`  
> **Área:** Automatización de Drops, Farm de Experiencia 100% AFK, Cero Entidades / Cero Lag.

---

## 1. ¿Qué es la Mob Simulation Chamber y por qué reemplaza los Mob Farms tradicionales?

En servidores técnicos de alto rendimiento como **DrakesCraft**, los generadores de mobs físicos (spawners con agua, pistones y caídas) provocan colisiones de entidades, pathfinding excesivo y tick-lag severo en chunks cargados.

La **Mob Simulation Chamber** resuelve esto simulando virtualmente la muerte de entidades dentro de una cámara computarizada. No genera ninguna entidad en el mundo (`World`):
1. **0% Lag de Entidades**: Sin colisiones ni IA de Minecraft.
2. **Generación Continua de XP**: Almacena experiencia en un buffer numérico interno.
3. **Drops Automatizados**: Deposita los drops exactos del mob directamente en sus ranuras de salida.
4. **100% AFK**: El jugador puede dejar la máquina operando continuamente mientras esté alimentada de energía eléctrica (J/s).

---

## 2. Los Tiers de Data Cards y Consumo de Energía

Cada mob requiere una tarjeta codificada (**Mob Data Card**). Los mobs están clasificados en 6 Tiers que definen el consumo energético y la XP producida por ciclo:

| Tier | Ejemplos de Mobs | XP Base / Ciclo | Consumo Energético (`J/s`) | Material de Armadura Base |
|---|---|---|---|---|
| **PASSIVE** | Pollo, Vaca, Cerdo, Oveja | 1 XP | 75 J/s | `IRON_CHESTPLATE` |
| **NEUTRAL** | Slime, Abeja, Aldeano | 1 XP | 150 J/s | `IRON_CHESTPLATE` |
| **HOSTILE** | Zombie, Esqueleto, Spider, Creeper | 2 XP | 300 J/s | `DIAMOND_CHESTPLATE` |
| **ADVANCED** | Enderman, Blaze, Ghast, Shulker | 4 XP | 600 J/s | `DIAMOND_CHESTPLATE` |
| **MINI_BOSS** | Wither, Warden | 32 XP | 4,500 J/s | `NETHERITE_CHESTPLATE` |
| **BOSS** | **Ender Dragon** | **96 XP** | **9,000 J/s** | `NETHERITE_CHESTPLATE` |

> [!NOTE]  
> La XP final otorgada se multiplica por el multiplicador global configurado en el servidor (`mob-simulation-options.xp-multiplier`), permitiendo multiplicadores masivos de farmeo en eventos o perks de DrakesCraft.

---

## 3. Guía de la Tarjeta Suprema: Ender Dragon Data Card

La tarjeta más codiciada del juego técnico es la **Ender Dragon Data Card**, permitiendo matar virtualmente al Dragón del End cada ciclo sin necesidad de respawnearlo con cristales ni resetear el End.

### Receta en el Mob Data Infuser
Se infunde en la máquina multibloque/eléctrica **Mob Data Infuser** con los siguientes materiales exactos extraídos del código Java:

```
[ 64x End Crystal ]       [ 32x Void Ingot ]      [ 64x Chorus Flower ]
[ 1x Infused Elytra ]    [ 1x Empty Data Card ]   [ 1x Dragon Head ]
[ 64x Ender Lump III ]    [ 32x Void Ingot ]      [ 64x Dragon's Breath ]
```

### Drops Obtenidos en la Cámara:
* **Void Dust** (Probabilidad base garantizada 1)
* **Ender Essence** (x4 unidades)
* **Dragon Egg** (Drop ultra raro procedural: 1 en 1,000,000)
* **+96 XP por ciclo** acumulado en el buffer.

---

## 4. Anatomía de la Interfaz Gráfica (GUI)

Al hacer clic derecho sobre la `MobSimulationChamber`, el jugador interactúa con un panel de 54 ranuras (Chest Menu de 6 filas):

```
Fila 0: [ # ] [ # ] [ # ] [Border] [Border] [Border] [Border] [Border] [Border]
Fila 1: [ 10: STATUS ] [ # ] [Border] [ 13: OUT ] [ 14: OUT ] [ 15: OUT ] [ 16: OUT ] [Border]
Fila 2: [ # ] [ # ] [ # ] [Border] [ 22: OUT ] [ 23: OUT ] [ 24: OUT ] [ 25: OUT ] [Border]
Fila 3: [InBorder] [InBorder] [InBorder] [Border] [ 31: OUT ] [ 32: OUT ] [ 33: OUT ] [ 34: OUT ] [Border]
Fila 4: [InBorder] [ 37: CARD_SLOT ] [InBorder] [Border] [ 40: OUT ] [ 41: OUT ] [ 42: OUT ] [ 43: OUT ] [Border]
Fila 5: [InBorder] [ 46: XP_SLOT ] [InBorder] [Border] [Border] [Border] [Border] [Border] [Border]
```

### Componentes Clave:
1. **Ranura 37 (`CARD_SLOT`)**:
   - Aquí se inserta la `MobDataCard`. Si está vacía o se coloca un ítem inválido, la ranura 10 mostrará una barrera roja: `&cInput a Mob Data Card!`.
2. **Ranura 10 (`STATUS_SLOT`)**:
   - Muestra el estado operativo de la máquina en tiempo real:
     - `&aSimulating... (9,000 J/s)` con panel de cristal teñido de verde lima cuando tiene energía y tarjeta.
     - `&cNot enough energy!` si la red eléctrica de Slimefun no suple la demanda.
     - `&cNo room for outputs!` si las 16 ranuras de salida están repletas.
3. **Ranura 46 (`XP_SLOT`) — Cobro de Experiencia AFK**:
   - Muestra un cristal verde lima (`LIME_STAINED_GLASS_PANE`):
     ```
     &aStored xp: <cantidad_acumulada>
     
     &a> Click to claim
     ```
   - **Mecánica de Cobro**: El jugador simplemente hace clic izquierdo sobre esta ranura. La experiencia acumulada pasa instantáneamente al jugador, reproduciendo el sonido oficial `Sound.ENTITY_EXPERIENCE_ORB_PICKUP`.
   - **Protección contra Pérdidas**: Si el jugador rompe la máquina con un pico, el evento `BlockBreakEvent` llama a `e.getPlayer().giveExp(xp)` para asegurar que ninguna partícula de XP se pierda al desmantelar la base.
4. **Ranuras 13-16, 22-25, 31-34, 40-43 (16 Ranuras de Salida)**:
   - Matriz 4x4 donde se depositan los drops del mob de forma automática.
   - Compatible al 100% con **Networks V6 Import Bus** para succionar los drops hacia cofres o barriles infinitos de forma automática.

---

## 5. Mejores Prácticas para Jugadores en DrakesCraft

1. **Alimentación Eléctrica Segura**: Asegúrate de tener al menos una batería capacitiva o un reactor de energía (`Infinity Reactor` o `Nuclear Reactor`) que garantice un suministro continuo de más de 9,000 J/s antes de activar el Ender Dragon.
2. **Logística Desatendida con Networks V6**: Coloca un `Import Cable` de Networks V6 conectado a la cara superior o trasera de la cámara para que nunca se llene el buffer de 16 slots y la máquina nunca se detenga con el error `No room for outputs`.
3. **Farm de XP sin Muerte**: Los jugadores en DrakesCraft pueden pararse junto a la máquina mientras leen o chatean en Discord y periódicamente hacer 1 clic en el slot 46 para subir de nivel 0 a 100 en cuestión de minutos.
