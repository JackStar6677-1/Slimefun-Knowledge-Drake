#!/usr/bin/env python3
"""
gen_capitulo3_audio.py — Generador de locución TTS y subtítulos sincronizados para el Capítulo 3.
Tema: El Enjambre Centinela: SAORI & Resiliencia en Tiempo Real.
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
JSON_OUT = ROOT / "video" / "src" / "capitulo3-storyboard.json"

SECTIONS = [
    {
        "id": "c3_p01_intro",
        "file": "cap3_p01_intro.mp3",
        "title": "EL DESAFÍO DE LA ESTABILIDAD 24/7",
        "subtitle": "La falacia del reinicio a ciegas en clusters de juego",
        "badge": "01 // SRE PRINCIPLE: ZERO BLIND RESTARTS",
        "spoken_text": (
            "En la mayoría de los servidores comunitarios, cuando el rendimiento se degrada o la latencia sube, "
            "la respuesta habitual de los administradores suele ser reiniciar la máquina a ciegas. "
            "En DrakesCraft consideramos esa práctica inaceptable. Reiniciar sin investigar destruye la evidencia forense y castiga a los jugadores."
        ),
        "text": (
            "En la mayoría de servidores comunitarios, cuando la latencia sube, la respuesta habitual es reiniciar a ciegas. "
            "En DrakesCraft consideramos esa práctica inaceptable. Reiniciar sin investigar destruye la evidencia forense y castiga al jugador."
        ),
        "action": "idle",
        "camera": "close",
        "diagram": "sentinel_loop"
    },
    {
        "id": "c3_p02_acronym",
        "file": "cap3_p02_acronym.mp3",
        "title": "QUÉ ES EXACTAMENTE SAORI",
        "subtitle": "Server Autonomous Orchestrator for Resilient Infrastructure",
        "badge": "02 // ARCHITECTURE: S.A.O.R.I. SYSTEM",
        "spoken_text": (
            "Para resolver este dilema diseñamos SAORI. No es un simple bot de discord ni un nombre decorativo. "
            "Son las siglas de Server Autonomous Orchestrator for Resilient Infrastructure. "
            "Es un enjambre de servicios desarrollado a medida que supervisa todo el clúster de forma ininterrumpida."
        ),
        "text": (
            "Para resolver este dilema diseñamos SAORI. No es un simple bot decorativo. "
            "Son siglas: Server Autonomous Orchestrator for Resilient Infrastructure. "
            "Un enjambre de servicios desarrollado a medida que supervisa el clúster de forma ininterrumpida."
        ),
        "action": "interact",
        "camera": "normal",
        "diagram": "saori_architecture"
    },
    {
        "id": "c3_p03_telemetry",
        "file": "cap3_p03_telemetry.mp3",
        "title": "TELEMETRÍA DE RED EN TIEMPO REAL",
        "subtitle": "Sondeo de socket raw cada segundo sobre el puerto 25565",
        "badge": "03 // TELEMETRY: RAW SOCKET POLLING",
        "spoken_text": (
            "Desde nuestro servidor central Linux, SAORI mantiene un sondeo constante contra el socket de red en Dallas. "
            "Cada segundo valida la respuesta del protocolo de enlace, mide los tiempos de respuesta y audita el jitter de conexión. "
            "Si un hilo secundario se cuelga o el socket se satura, el centinela lo detecta milisegundos antes de que el jugador note un corte."
        ),
        "text": (
            "Desde nuestro servidor central Linux, SAORI mantiene un sondeo constante contra el socket de Dallas. "
            "Cada segundo valida el protocolo de enlace, mide latencia y audita el jitter. "
            "Si un hilo se cuelga, el centinela lo detecta milisegundos antes de que el jugador note un corte."
        ),
        "action": "interact",
        "camera": "wide",
        "diagram": "network_socket"
    },
    {
        "id": "c3_p04_jvm_audit",
        "file": "cap3_p04_jvm_audit.mp3",
        "title": "AUDITORÍA INTERNA DE LA JVM",
        "subtitle": "Monitoreo continuo de memoria off-heap y pausas de ZGC",
        "badge": "04 // RUNTIME: JVM METRICS & GC PAUSES",
        "spoken_text": (
            "En paralelo al socket de red, el agente extrae métricas directas de la máquina virtual de Java. "
            "Monitorea la memoria fuera del montículo, la tasa de asignación por segundo y los tiempos de pausa de ZGC. "
            "Si una fábrica de Slimefun genera una acumulación anómala de objetos efímeros, SAORI aísla el chunk responsable."
        ),
        "text": (
            "En paralelo, el agente extrae métricas directas de la JVM. "
            "Monitorea memoria off-heap, tasa de asignación por segundo y pausas de ZGC. "
            "Si una fábrica de Slimefun genera acumulación anómala de objetos, SAORI aísla el chunk responsable."
        ),
        "action": "idle",
        "camera": "normal",
        "diagram": "jvm_profiling"
    },
    {
        "id": "c3_p05_forensics",
        "file": "cap3_p05_forensics.mp3",
        "title": "DIAGNÓSTICO FORENSE Y MITIGACIÓN",
        "subtitle": "Captura automática de Thread Dumps y perfilado con Spark",
        "badge": "05 // FORENSICS: AUTO THREAD DUMPS",
        "spoken_text": (
            "Cuando se detecta un patrón de degradación, el centinela dispara mitigaciones automáticas y programadas. "
            "Captura volcados de hilos de ejecución en tiempo real y perfiles de consumo de cpu mediante Spark. "
            "Esto nos permite solucionar la causa raíz en el código del plugin sin detener la partida de nadie."
        ),
        "text": (
            "Cuando se detecta degradación, el centinela dispara mitigaciones automáticas y programadas. "
            "Captura volcados de hilos en tiempo real y perfiles de CPU con Spark. "
            "Esto permite solucionar la causa raíz en el código del plugin sin detener la partida."
        ),
        "action": "interact",
        "camera": "close",
        "diagram": "thread_dumps"
    },
    {
        "id": "c3_p06_bridge",
        "file": "cap3_p06_bridge.mp3",
        "title": "INTEROPERABILIDAD JAVA Y BEDROCK",
        "subtitle": "Puerto unificado 25565 con Geyser y Floodgate",
        "badge": "06 // PROTOCOL: UNIFIED PORT 25565",
        "spoken_text": (
            "Otro pilar fundamental de la red es la interoperabilidad multiplataforma. "
            "Implementamos una capa de traducción de paquetes de red mediante Geyser y Floodgate sobre el mismo puerto dos cinco cinco seis cinco. "
            "Tanto jugadores de computadora como de consolas y celulares interactúan en el mismo mundo sin desincronizaciones."
        ),
        "text": (
            "Otro pilar fundamental es la interoperabilidad multiplataforma. "
            "Implementamos traducción de paquetes mediante Geyser y Floodgate sobre el puerto 25565 unificado. "
            "Jugadores de PC, consolas y móviles interactúan en el mismo mundo sin desincronizaciones."
        ),
        "action": "idle",
        "camera": "normal",
        "diagram": "geyser_bridge"
    },
    {
        "id": "c3_p07_community",
        "file": "cap3_p07_community.mp3",
        "title": "TRANSPARENCIA CON LA COMUNIDAD",
        "subtitle": "Sincronización de telemetría y changelog en Discord",
        "badge": "07 // SRE OPS: LIVE AUDIT & DISCORD SYNC",
        "spoken_text": (
            "La disciplina SRE no se queda encerrada en la consola de Linux. SAORI sincroniza el estado del servidor, "
            "los avisos técnicos y los cambios de configuración directamente con nuestra comunidad en Discord. "
            "Cada mantenimiento es transparente, predecible y con documentación verificable."
        ),
        "text": (
            "La disciplina SRE no se queda en la consola. SAORI sincroniza el estado del servidor, "
            "avisos técnicos y cambios de configuración directamente en Discord. "
            "Cada mantenimiento es transparente, predecible y con documentación verificable."
        ),
        "action": "interact",
        "camera": "wide",
        "diagram": "discord_sync"
    },
    {
        "id": "c3_p08_conclusion",
        "file": "cap3_p08_conclusion.mp3",
        "title": "EL CENTINELA NO DUERME",
        "subtitle": "Infraestructura robusta lista para la compilación de código",
        "badge": "08 // STATUS: CLUSTER 100% NOMINAL",
        "spoken_text": (
            "Con SAORI protegiendo la disponibilidad y conteniendo cualquier anomalía en caliente, la infraestructura es inexpugnable. "
            "Pero un entorno robusto sólo tiene valor si el software que ejecuta está a la misma altura. "
            "En el próximo capítulo, analizaremos cómo desarrollamos y compilamos nuestros propios plugins para garantizar cero rollbacks."
        ),
        "text": (
            "Con SAORI protegiendo la disponibilidad en caliente, la infraestructura es inexpugnable. "
            "Pero un entorno robusto sólo tiene valor si el software que ejecuta está a la misma altura. "
            "En el siguiente capítulo analizaremos cómo desarrollamos nuestros propios plugins para garantizar cero rollbacks."
        ),
        "action": "idle",
        "camera": "close",
        "diagram": "next_bridge"
    }
]

async def main():
    print("=" * 60)
    print("GENERANDO AUDIO Y STORYBOARD PARA CAPÍTULO 3")
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
        "chapter": 3,
        "title": "Capítulo 3 — El Enjambre Centinela: SAORI & Resiliencia en Tiempo Real",
        "fps": 30,
        "scenes": scenes_output
    }

    with open(JSON_OUT, "w", encoding="utf-8") as f:
        json.dump(storyboard_data, f, indent=2, ensure_ascii=False)

    print(f"\n[OK] Storyboard guardado en: {JSON_OUT}")
    print(f"Total palabras procesadas: {total_words}")

if __name__ == "__main__":
    asyncio.run(main())
