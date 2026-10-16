# 🔮 Crystamae Historia — Guía Maestra de Magia y Hechizos

> **Addon Origen:** `CrystamaeHistoria-drake`  
> **Área:** Hechicería Survival, Compendios de Hechizos, Cristales Mágicos, Varitas y Altares.

---

## 1. Introducción a Crystamae Historia

**Crystamae Historia** introduce un sistema de magia y hechicería procedural para Slimefun en DrakesCraft. A diferencia de las máquinas industriales de energía eléctrica, Crystamae se basa en la manipulación de **energía arcana**, cristales de resonancia elemental y fórmulas inscritas en pergaminos.

---

## 2. Los Dos Libros Guía del Jugador (Compendios)

El addon proporciona dos interfaces centrales tipo libro que el jugador utiliza para progresar sin necesidad de comandos de staff:

1. **Spell Compendium (`OpenSpellCompendium`)**:
   - Catálogo interactivo de todos los hechizos disponibles.
   - Detalla el costo de maná/esencia, el tipo de cristal requerido, el alcance en bloques y la combinación de runas necesaria para canalizarlo.
2. **Story Compendium (`OpenStoryCompendium`)**:
   - Guía narrativa y lore de los antiguos alquimistas que descubrieron la cristalización de la energía en el mundo.
   - Describe la progresión de rangos mágicos que el jugador desbloquea a medida que realiza rituales exitosos.

---

## 3. Elementos Fundamentales de la Hechicería

* **Varitas y Bastones (`Wands` & `InstanceStave`)**:
  - Objetos canalizadores que se sostienen en la mano principal.
  - Al hacer clic derecho o izquierdo según el modo seleccionado, proyectan el hechizo cargado en memoria (`SpellMemory`).
* **Altares y Placas de Invocación (`InstancePlate`)**:
  - Plataformas multibloque ceremoniales donde se colocan cristales sobre atriles o placas de presión para realizar transmutaciones de materia.
* **Cristales Elementales**:
  - Fuego, Hielo, Rayo, Vacío y Tierra. Cada uno posee pureza y nivel de resonancia. Si se sobrecargan, pueden degradarse (`CrystaDowngradeListener`).
* **Sales Taumatúrgicas (`ThaumaturgicSalts`) y Spray Filosófico (`PhilosophersSpray`)**:
  - Reactivos químicos arcanos utilizados para purificar impurezas en los minerales y desbloquear catalizadores de nivel superior.
* **Inhibidores y Velas de Mobs (`EndermanInhibitor` & `MobCandle`)**:
  - Herramientas defensivas para la base mágica: impiden que los Endermans se teletransporten dentro de la zona protegida o repelen mobs hostiles en un radio determinado.
