# 💥 ExtraTools & Minería Explosiva 3x3 — Guía de Herramientas de Área

> **Repositorios de Referencia:** `Slimefun4-Drake`, `ExtraTools-drake`  
> **Área:** Minería de Área 3x3, Picos Explosivos, Protección de Cofres, Martillos de Conversión de Minerales.

---

## 1. El Pico Explosivo 3x3 y la Protección de Contenedores en DrakesCraft

El **Pico Explosivo (`EXPLOSIVE_PICKAXE`)** y la **Pala Explosiva (`EXPLOSIVE_SHOVEL`)** son de las herramientas más codiciadas para terraformar y minar canteras masivas a gran velocidad. Al romper un bloque central, detonan una onda de choque controlada que destruye instantáneamente una matriz de **3x3x3 bloques**.

### 🛡️ Protección Exclusiva de Cofres (`protectContainers`) en DrakesCraft-Labs
En la versión vanilla de Slimefun, usar un pico 3x3 dentro o cerca de una base privada destruía cofres, barriles y máquinas adyacentes, borrando todos los ítems almacenados.

En `Slimefun4-Drake`, JackStar implementó la protección nativa en el código:
```java
/*
 * El area de efecto es 3x3x3, asi que picar al lado de un cofre se lo lleva por delante junto
 * con lo que hubiera dentro. En una base propia el jugador tiene permiso de romper ahi, asi
 * que ninguna proteccion lo frena: es la queja de "el pico que dañaba todo".
 *
 * El bloque que se pica a mano sigue rompiendose siempre -eso lo gestiona el evento, no este
 * codigo-, asi que quien quiera vaciar su cofre puede. Lo que se evita es el daño colateral.
 */
private final ItemSetting<Boolean> protectContainers = new ItemSetting<>(this, "protect-containers", true);
```
* **Comportamiento en DrakesCraft**: Si el jugador pica un bloque de piedra contiguo a un cofre o tolva, la onda explosiva 3x3 **ignora los inventarios y contenedores**, protegiendo el almacenamiento del jugador sin reducir la efectividad de la cantera.

---

## 2. El Martillo Transmutador (`Hammer`) de ExtraTools

El **Martillo (`HAMMER`)** de `ExtraTools-drake` se craftea en la **Magic Workbench** con 5 lingotes de hierro y 2 palos. No destruye los bloques ordinariamente, sino que realiza transmutaciones geológicas directas en el mundo:

* **Piedra, Granito, Diorita, Andesita o Cobblestone** $\rightarrow$ Se convierte instantáneamente en **Grava (`GRAVEL`)**.
* **Grava, Césped, Tierra, Podzol o Tierra Estéril** $\rightarrow$ Se convierte instantáneamente en **Arena (`SAND`)**.
* **Mena de Hierro / Oro** $\rightarrow$ Se desmenuza en polvos minerales concentrados.

---

## 3. Maquinaria Complementaria de ExtraTools

* **Generador de Cobblestone Eléctrico**: Produce bloques continuos de piedra sin necesidad de fuentes de agua y lava físicas que generen lag de fluidos.
* **Compostador Eléctrico**: Acelera la conversión de materia orgánica, hojas y cultivos en tierra fértil y fertilizantes técnicos.
* **Vaporizador (`Vaporizer`)**: Procesa cubos de agua y fluidos para separar sales y condensados industriales.
