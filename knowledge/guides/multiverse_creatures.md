# 🐉 MultiverseCreatures — Guía Canónica y Arquitectura Técnica
> **Autor / Creador:** Chagui68 (DrakesCraft Sovereign Suite)  
> **Tipo:** Sistema de Entidades, Jefes Personalizados, Dimensiones de Ritual y Progresión RPG  
> **Código Fuente:** `DrakesCraft-Labs/MultiverseCreatures`  
> **Documentación Oficial:** `MultiverseCreatures/wiki-es` y `MultiverseCreatures/wiki-en`

---

## 1. Visión General
**MultiverseCreatures** es el plugin de combate avanzado, jefes míticos, rituales dimensionales y armamento exótico desarrollado por **Chagui68** para DrakesCraft.
Añade mecánicas de combate por fases, IA personalizada de jefes, invocación por pedestales, armas legendarias con habilidades activas y la **Dimensión de Ritual**.

---

## 2. Jefes Personalizados y Mecánicas de Invocación (`Bosses.md`)

| Jefe / Entidad Mítica | Requisitos de Invocación | Fases / Habilidades | Recompensas Principales |
| :--- | :--- | :--- | :--- |
| **Abyssal Devourer** | Altar Abisal en Deep Dark + Ojo de las Profundidades | Fases de oscuridad, proyectiles sónicos, ceguera y ondas de vacío. | Corazón del Abismo, Escamas Abisales, Armas del Abismo. |
| **Infernal Behemoth** | Núcleo de Magma en Fortaleza del Nether | Lluvia de meteoritos, suelo de lava temporal, empuje sísmico. | Esencia del Caos Ígneo, Lingotes Volcánicos. |
| **Void Harbinger** | Cristal del Vacío en las Islas del End | Teletransporte en cadena, vórtices gravitacionales, proyectiles teledirigidos. | Fragmento de Vacío Puro, Alas de Éter. |
| **Celestial Guardian** | Invocación en la Dimensión del Ritual | Rayos de luz sagrada, escudo de inmunidad temporal, juicio divino. | Reliquia Celestial, Armadura Radiante. |

---

## 3. Dimensión del Ritual (`Ritual-Dimension.md`)
- **Acceso:** Se accede mediante el portal ritual activado con la Llave Dimensional.
- **Estructura:** Mundo flotante con biomas suspendidos donde las físicas convencionales varían (menor gravedad, efectos de partículas místicas).
- **Progresión:**
  1. Construcción del Altar de Sacrificio con pilares de soporte.
  2. Ofrenda de componentes y reliquias en los pedestales.
  3. Desbloqueo de batallas contra jefes dimensionales y desbloqueo de árboles de habilidades de Stands.

---

## 4. Armamento, Reliquias y Stands (`Weapons.md`, `Stands.md`)

### Armas y Reliquias
- **Scythe of the Damned:** Guadaña con daño de área en cono frontal y robo de vida porcentual.
- **Solaris Greatsword:** Mandoble con habilidad de explosión solar que ciega y quema a todos los enemigos cercanos.
- **Aegis of the Fallen:** Escudo legendario con parada perfecta (parry) que devuelve proyectiles.

### Stands & Habilidades Espirituales
- Los jugadores pueden desbloquear y vincular un **Stand** a través de la evolución ritual.
- Los Stands proveen bonificaciones pasivas de velocidad, daño crítico y resistencia, además de una habilidad especial de ráfaga (Ultimate) activable con clic derecho en combate.

---

## 5. Comandos de Administración y Jugador (`Commands.md`)
- `/mvc help`: Muestra el menú interactivo de ayuda.
- `/mvc spawn <creature_id>`: Genera una criatura o jefe en la ubicación del jugador (Permiso: `mvc.admin`).
- `/mvc give <player> <item_id> [amount]`: Entrega un ítem o reliquia personalizada.
- `/mvc ritual portal`: Crea o localiza la entrada a la Dimensión del Ritual.
- `/mvc stand info`: Muestra el progreso del Stand del jugador.
