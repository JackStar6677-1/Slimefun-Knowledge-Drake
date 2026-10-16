#!/usr/bin/env python3
"""
gen_capitulo4_audio.py — Generador de locución TTS y subtítulos sincronizados para el Capítulo 4.
Tema: Código Propio & Cero Rollbacks: El Fin de la Era de Pruebas.
Voz: es-CL-LorenzoNeural (Jack, Sysadmin & Dueño de DrakesCraft).
"""
import asyncio
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from voice_engine import generate_speech

AUDIO_DIR = ROOT / "video" / "public" / "audio"
JSON_OUT = ROOT / "video" / "src" / "capitulo4-storyboard.json"

SECTIONS = [
    {
        "id": "c4_p01_intro",
        "file": "cap4_p01_intro.mp3",
        "title": "EL PELIGRO DE DEPENDER DE TERCEROS",
        "subtitle": "Por qué los plugins genéricos fallan en producción moderna",
        "badge": "01 // SRE DEV: IN-HOUSE SOFTWARE ENGINEERING",
        "spoken_text": (
            "Cuando administras un servidor con más de ochenta addons de Slimefun en una versión moderna de Minecraft, "
            "depender ciegamente de archivos descargados de foros públicos es un riesgo inaceptable. "
            "Muchos proyectos arrastran código sin mantenimiento, fugas de memoria y fallos de concurrencia que destruyen el tick loop."
        ),
        "text": (
            "Cuando administras un servidor con 80+ addons de Slimefun en Minecraft moderno, "
            "depender de archivos de foros públicos es un riesgo inaceptable. "
            "Muchos proyectos arrastran código sin mantenimiento, fugas de memoria y fallos de concurrencia que destruyen el tick loop."
        ),
        "action": "idle",
        "camera": "close",
        "diagram": "legacy_risk"
    },
    {
        "id": "c4_p02_maven",
        "file": "cap4_p02_maven.mp3",
        "title": "REPOSITORIO MAVEN PROPIO & CI/CD",
        "subtitle": "Compilación Java 21 sobre maven.drakescraft.cl",
        "badge": "02 // PIPELINE: PRIVATE MAVEN ARTIFACTS",
        "spoken_text": (
            "Por esta razón levantamos nuestro propio ecosistema de ingeniería. Contamos con un repositorio Maven dedicado, "
            "donde compilamos y gestionamos nuestras propias bifurcaciones de código fuente sobre Java veintiuno y la API de Paper. "
            "Cada cambio se audita, se versiona y se despliega mediante pipelines de integración continua sin parches manuales a ciegas."
        ),
        "text": (
            "Por ello levantamos nuestro propio ecosistema de ingeniería. Contamos con repositorio Maven dedicado, "
            "donde compilamos nuestras bifurcaciones sobre Java 21 y la API de Paper. "
            "Cada cambio se audita, se versiona y se despliega mediante CI/CD sin parches manuales a ciegas."
        ),
        "action": "interact",
        "camera": "normal",
        "diagram": "maven_pipeline"
    },
    {
        "id": "c4_p03_networks_v6",
        "file": "cap4_p03_networks_v6.mp3",
        "title": "CASO DE ESTUDIO: EL DUPE DE NETWORKS V6",
        "subtitle": "Condición de carrera entre ticks asíncronos y Fluffy Barrels",
        "badge": "03 // ROOT CAUSE: ASYNC TICK DESYNC",
        "spoken_text": (
            "El ejemplo más claro de esta disciplina fue el infame fallo de Networks versión seis. "
            "Bajo cargas intensas de procesamiento por tick, la sincronización entre redes de almacenamiento digital "
            "y los barriles infinitos de Fluffy permitía duplicar ítems por colisión de eventos asíncronos. "
            "La solución estándar en otras comunidades fue prohibir el addon y castigar el progreso de los jugadores."
        ),
        "text": (
            "El ejemplo más claro fue el infame fallo de Networks versión 6. "
            "Bajo cargas intensas, la sincronización entre redes de almacenamiento "
            "y barriles de Fluffy permitía duplicar ítems por colisión de eventos asíncronos. "
            "La solución estándar en otras comunidades fue prohibir el addon y castigar el progreso de los jugadores."
        ),
        "action": "interact",
        "camera": "close",
        "diagram": "dupe_vulnerability"
    },
    {
        "id": "c4_p04_atomic_fix",
        "file": "cap4_p04_atomic_fix.mp3",
        "title": "LA SOLUCIÓN ATÓMICA DE JACK",
        "subtitle": "Buffer de confirmación transaccional con verificación de escritura",
        "badge": "04 // PATCH: ATOMIC WRITE VERIFICATION",
        "spoken_text": (
            "En DrakesCraft reescribimos la capa de confirmación de transacciones dentro del código de Networks. "
            "Implementamos un buffer de confirmación atómica con verificación estricta de escritura antes de confirmar la extracción. "
            "Si el destino no certifica la persistencia física del ítem, la transacción revierte instantáneamente. Cero duplicaciones, cero pérdidas."
        ),
        "text": (
            "En DrakesCraft reescribimos la capa de confirmación de transacciones dentro de Networks. "
            "Implementamos un buffer atómico con verificación estricta de escritura antes de confirmar la extracción. "
            "Si el destino no certifica la persistencia física del ítem, la transacción revierte. Cero duplicaciones, cero pérdidas."
        ),
        "action": "interact",
        "camera": "normal",
        "diagram": "atomic_buffer"
    },
    {
        "id": "c4_p05_zero_rollbacks",
        "file": "cap4_p05_zero_rollbacks.mp3",
        "title": "EL DOGMA SRE: CERO ROLLBACKS",
        "subtitle": "Integridad inmutable de inventarios, cofres y bóvedas",
        "badge": "05 // SRE CREED: IMMUTABLE DATA PERSISTENCE",
        "spoken_text": (
            "La mayor pesadilla de un jugador técnico es dedicar días enteros a diseñar reactores y reactivar la economía, "
            "para luego perder su progreso debido a un rollback masivo de veinticuatro horas. "
            "Nuestra infraestructura cuenta con registros transaccionales write-ahead logging y copias consistentes que eliminan la necesidad de rollbacks destructivos."
        ),
        "text": (
            "La mayor pesadilla de un jugador técnico es perder días de trabajo en reactores "
            "debido a un rollback masivo de 24 horas. "
            "Nuestra infraestructura cuenta con WAL y respaldos consistentes que eliminan la necesidad de rollbacks destructivos."
        ),
        "action": "idle",
        "camera": "wide",
        "diagram": "data_persistence"
    },
    {
        "id": "c4_p06_bridge_to_slimefun",
        "file": "cap4_p06_bridge_to_slimefun.mp3",
        "title": "LOS CIMIENTOS ESTÁN COMPLETOS",
        "subtitle": "Concluye la serie de sistemas: el laboratorio queda abierto",
        "badge": "06 // MILESTONE: FOUNDATIONS CERTIFIED",
        "spoken_text": (
            "Con este capítulo cerramos la presentación técnica de nuestra infraestructura. "
            "Ya conocen quién está detrás de la consola, cómo dividimos el cómputo distribuido entre Dallas y Star, "
            "cómo vigila el centinela SAORI y la ingeniería detrás de nuestro código. "
            "Las bases son sólidas como una roca. La plataforma está calibrada."
        ),
        "text": (
            "Con este capítulo cerramos la presentación técnica de nuestra infraestructura. "
            "Ya conocen quién está detrás de la consola, cómo dividimos el cómputo distribuido, "
            "cómo vigila el centinela SAORI y la ingeniería de nuestro código. "
            "Las bases son sólidas como una roca. La plataforma está calibrada."
        ),
        "action": "interact",
        "camera": "normal",
        "diagram": "platform_ready"
    },
    {
        "id": "c4_p07_invitation",
        "file": "cap4_p07_invitation.mp3",
        "title": "EL VERDADERO COMIENZO: SLIMEFUN",
        "subtitle": "Bienvenidos a la serie técnica de maestría industrial",
        "badge": "07 // NEXT: SLIMEFUN MASTERCLASS EPISODE 1",
        "spoken_text": (
            "A partir de este momento, dejamos atrás la administración de servidores para sumergirnos de lleno en el juego. "
            "En el verdadero capítulo uno que verán a continuación, aprenderán a usar la guía de Slimefun, "
            "construir sus primeros multibloques y dominar los comandos esenciales para proteger su territorio. "
            "Nos vemos en play punto drakescraft punto ce ele."
        ),
        "text": (
            "A partir de este momento, dejamos atrás la administración para sumergirnos en el juego. "
            "En el verdadero capítulo 1 a continuación, aprenderán a usar la guía de Slimefun, "
            "construir sus primeros multibloques y dominar los comandos de protección de territorio. "
            "Nos vemos en play.drakescraft.cl."
        ),
        "action": "idle",
        "camera": "close",
        "diagram": "slimefun_gateway"
    }
]

async def main():
    print("=" * 60)
    print("GENERANDO AUDIO Y STORYBOARD PARA CAPÍTULO 4")
    print("=" * 60)

    total_words = 0
    scenes_output = []

    for idx, sec in enumerate(SECTIONS):
        out_path = AUDIO_DIR / sec["file"]
        print(f"\n[{idx+1}/{len(SECTIONS)}] Generando {sec['id']}...")
        print(f"    Texto: {sec['spoken_text'][:65]}...")

        res = await generate_speech(
            text=sec["spoken_text"],
            output_path=out_path,
            voice="es-CL-LorenzoNeural",
            rate="+2%",
            pitch="-1Hz"
        )

        duration = res["duration"]
        words = res["words"]
        total_words += len(words)
        print(f"    -> Duración: {duration:.2f}s | Palabras: {len(words)}")

        scenes_output.append({
            "id": sec["id"],
            "title": sec["title"],
            "subtitle": sec["subtitle"],
            "badge": sec["badge"],
            "text": sec["text"],
            "spoken_text": sec["spoken_text"],
            "action": sec["action"],
            "camera": sec["camera"],
            "diagram": sec["diagram"],
            "audio_file": sec["file"],
            "duration": duration,
            "frames": int(duration * 30) + 15,
            "words": words
        })

    storyboard_data = {
        "chapter": 4,
        "title": "Capítulo 4 — Código Propio & Cero Rollbacks: El Fin de la Era de Pruebas",
        "fps": 30,
        "scenes": scenes_output
    }

    with open(JSON_OUT, "w", encoding="utf-8") as f:
        json.dump(storyboard_data, f, indent=2, ensure_ascii=False)

    print(f"\n[OK] Storyboard guardado en: {JSON_OUT}")
    print(f"Total palabras procesadas: {total_words}")

if __name__ == "__main__":
    asyncio.run(main())
