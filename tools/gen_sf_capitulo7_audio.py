#!/usr/bin/env python3
"""
gen_sf_capitulo7_audio.py — Generador de locución y storyboard para:
"Slimefun en DrakesCraft — Capítulo 7: Addons Avanzados, Automatización Infinita & Mitigación de Lag"
Voz: es-CL-LorenzoNeural (Jack, Sysadmin & Fundador de DrakesCraft).
"""
import asyncio
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from voice_engine import generate_speech

AUDIO_DIR = ROOT / "video" / "public" / "audio"
JSON_OUT = ROOT / "video" / "src" / "sf-capitulo7-storyboard.json"

SECTIONS = [
    {
        "id": "sf7_p01_intro",
        "file": "sf7_p01_intro.mp3",
        "title": "LA FRONTERA INDUSTRIAL: ADDONS DE SLIMEFUN",
        "subtitle": "Infinity Expansion, Fluffy Machines y Redes v6 a escala",
        "badge": "01 // ERA DE LOS ADDONS: MÁS ALLÁ DEL LÍMITE",
        "spoken_text": (
            "Bienvenidos al Capítulo siete de nuestra guía de Slimefun en DrakesCraft. "
            "Si ya dominas la energía cuántica y los reactores nucleares, estás listo para cruzar la última frontera. "
            "En DrakesCraft llevamos la jugabilidad técnica al extremo integrando tres de los addons más potentes del ecosistema: "
            "Infinity Expansion para la generación infinita de recursos y singularidades, "
            "Fluffy Machines para el crafteo automático masivo, "
            "y Redes versión seis para el almacenamiento digital instantáneo. "
            "Hoy veremos cómo opera este ecosistema y los secretos de ingeniería que implementamos para mantener el servidor en veinte TPS."
        ),
        "text": (
            "Bienvenidos al Capítulo 7 de Slimefun en DrakesCraft. "
            "Superada la era nuclear y cuántica, cruzamos la frontera de los Addons. "
            "Infinity Expansion, Fluffy Machines y Redes de Almacenamiento v6. "
            "Automatización total sin comprometer el rendimiento del servidor a 20 TPS."
        ),
        "action": "idle",
        "camera": "close",
        "diagram": "infinity_intro"
    },
    {
        "id": "sf7_p02_infinity_expansion",
        "file": "sf7_p02_infinity_expansion.mp3",
        "title": "INFINITY EXPANSION: EL FIN DEL GRIND MANUAL",
        "subtitle": "Singularidades, Cámaras de Simulación y Lingotes Infinitos",
        "badge": "02 // END-GAME: INFINITY EXPANSION",
        "spoken_text": (
            "Infinity Expansion redefine lo que significa el juego tardío. "
            "Su núcleo son los Generadores de Singularidades, máquinas que comprimen miles de lingotes de cobre, hierro o netherite "
            "en una sola esfera hiperdensa de materia. "
            "Pero su mayor genialidad son las Cámaras de Simulación de Mobs. "
            "En lugar de construir granjas tradicionales que saturan el servidor con cientos de entidades de esqueletos o withers, "
            "estas cámaras simulan las muertes matemáticamente en memoria virtual y te entregan los drops limpios, "
            "produciendo estrellas del nether y shulkers sin generar una sola partícula de lag."
        ),
        "text": (
            "Infinity Expansion: Fin del Grind Manual. "
            "Generadores de Singularidades: compresión de millones de recursos en núcleos estables. "
            "Cámaras de Simulación: farmeo computado en memoria sin spawnear entidades. "
            "Estrellas del Nether y Shulker Shells a coste computacional cero."
        ),
        "action": "point",
        "camera": "mid",
        "diagram": "simulation_chamber"
    },
    {
        "id": "sf7_p03_fluffy_machines",
        "file": "sf7_p03_fluffy_machines.mp3",
        "title": "FLUFFY MACHINES & AUTO-CRAFTERS",
        "subtitle": "Ensamblado industrial recursivo sin intervención del jugador",
        "badge": "03 // INDUSTRIA PESADA: FLUFFY MACHINES",
        "spoken_text": (
            "¿Cansado de hacer click derecho durante horas para fabricar componentes avanzados? "
            "Aquí es donde entra Fluffy Machines. "
            "Su joya de la corona es el Auto-Crafter Eléctrico. "
            "Esta máquina memoriza cualquier receta de Slimefun o Minecraft Vanilla, absorbe los ingredientes de tus barriles "
            "y fabrica piezas en cadena a velocidades industriales. "
            "Combinado con hornos eléctricos de alta temperatura y mesas de lavado automáticas, "
            "puedes transformar menas crudas en circuitos cuánticos terminados de forma cien por ciento desatendida."
        ),
        "text": (
            "Fluffy Machines: Crafteo Autónomo en Cadena. "
            "Auto-Crafter Eléctrico: memorización de recetas complejas de Slimefun. "
            "Líneas de ensamblado continuas conectadas a barriles de suministros. "
            "De polvo de mineral a componentes cuánticos sin tocar una mesa manual."
        ),
        "action": "interact",
        "camera": "close",
        "diagram": "autocrafter"
    },
    {
        "id": "sf7_p04_networks_v6",
        "file": "sf7_p04_networks_v6.mp3",
        "title": "REDES v6 & MITIGACIÓN CRÍTICA DE DUPES",
        "subtitle": "La auditoría técnica del plugin más desafiante de Minecraft",
        "badge": "04 // ARQUITECTURA SRE: NETWORKS v6",
        "spoken_text": (
            "Hablemos ahora de Redes versión seis, el plugin de almacenamiento digital. "
            "A nivel técnico, Redes es una obra de arte, pero históricamente fue el dolor de cabeza de todos los servidores técnicos. "
            "En versiones anteriores, los barriles de Fluffy e Infinity se desincronizaban al descargar chunks rápidamente, "
            "generando duplicaciones masivas conocidas en la comunidad. "
            "En DrakesCraft auditamos los commits directamente en el código fuente, parcheamos los puntos de race conditions "
            "y blindamos la sincronización de inventarios. "
            "El resultado es una red de almacenamiento masivo instantánea, totalmente segura y libre de glitches."
        ),
        "text": (
            "Redes v6: Almacenamiento Digital Blindado. "
            "Historial técnico: desincronización de barriles y dupes en chunk unloads. "
            "Auditoría DrakesCraft: corrección de race conditions en código fuente. "
            "Almacenamiento masivo instantáneo, ultra-eficiente y cien por ciento seguro."
        ),
        "action": "point",
        "camera": "mid",
        "diagram": "networks_core"
    },
    {
        "id": "sf7_p05_sre_lag_mitigation",
        "file": "sf7_p05_sre_lag_mitigation.mp3",
        "title": "CÓMO AUTOMATIZAR SIN LAG: REGLAS SRE",
        "subtitle": "Por qué las tolvas de Vanilla ahogan el CPU a gran escala",
        "badge": "05 // INGENIERÍA: CERO LAG A 20.0 TPS",
        "spoken_text": (
            "La regla de oro de DrakesCraft es simple: cero lag para todos. "
            "Muchas personas intentan conectar tolvas de Minecraft Vanilla a sus máquinas de Slimefun, "
            "sin saber que una tolva vacía consulta el inventario veinte veces por segundo en el hilo principal del servidor. "
            "Cincuenta tolvas pueden congelar un servidor entero. "
            "En cambio, los Nodos de Carga de Slimefun y los cables de Redes v6 operan mediante punteros en memoria RAM, "
            "moviendo miles de ítems por tick sin crear entidades de bloque. "
            "Automatiza con lógica SRE: menos tolvas físicas, más redes directas."
        ),
        "text": (
            "Reglas SRE Anti-Lag para Bases Industriales. "
            "El peligro de las tolvas: escaneos continuos en el hilo principal del servidor. "
            "Solución Slimefun & Redes: transferencia atómica por punteros en memoria RAM. "
            "Mantén tu factoría masiva a 20.0 TPS estables sin penalizar el rendimiento."
        ),
        "action": "interact",
        "camera": "close",
        "diagram": "lag_architecture"
    },
    {
        "id": "sf7_p06_starter_commands",
        "file": "sf7_p06_starter_commands.mp3",
        "title": "COMANDOS DE INICIO & COMUNIDAD DRAKES",
        "subtitle": "/pwarp xp, protección de tierras y soporte autónomo SAORI",
        "badge": "06 // COMUNIDAD: DRAKES & SAORI",
        "spoken_text": (
            "Si estás recién comenzando en DrakesCraft, no tienes que empezar desde cero ni temer que te roben tus máquinas. "
            "Usa el comando barra pe warp xp para acceder de inmediato a la granja pública de experiencia comunitaria. "
            "Protege tu zona con los bloques de protección de tierras para que tu factoría sea inexpugnable. "
            "Y recuerda: nuestro sistema de inteligencia artificial SAORI está monitoreando la red veinticuatro siete, "
            "respondiendo dudas en nuestro Discord oficial y vigilando la salud de la infraestructura. "
            "Únete hoy en play punto drakescraft punto ce ele y forma parte de la mejor comunidad técnica."
        ),
        "text": (
            "Inicio Rápido & Comunidad DrakesCraft. "
            "/pwarp xp: granja comunitaria para encantar tus primeros ítems. "
            "Protección de Tierras: claims blindados contra griefing y robos. "
            "SAORI 24/7 en Discord (discord.gg/drakescraft) | IP: play.drakescraft.cl"
        ),
        "action": "wave",
        "camera": "mid",
        "diagram": "community_drakes"
    }
]

async def main():
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    print("=" * 60)
    print("GENERANDO AUDIO Y STORYBOARD: SLIMEFUN CAPÍTULO 7")
    print("Addons Avanzados, Automatización Infinita & Mitigación de Lag")
    print("=" * 60)

    storyboard_scenes = []
    total_frames = 0

    for idx, s in enumerate(SECTIONS):
        out_path = AUDIO_DIR / s["file"]
        print(f"\n[{idx+1}/{len(SECTIONS)}] Generando audio para '{s['id']}'...")
        res = await generate_speech(
            text=s["spoken_text"],
            output_path=out_path,
            voice="es-CL-LorenzoNeural",
            rate="+2%",
            pitch="-1Hz"
        )
        duration = res["duration"]
        words = res["words"]
        frames = int(duration * 30) + 30
        total_frames += frames

        print(f"  [OK] Duración: {duration:.2f}s ({frames} frames) | {len(words)} palabras")

        storyboard_scenes.append({
            "id": s["id"],
            "title": s["title"],
            "subtitle": s["subtitle"],
            "badge": s["badge"],
            "text": s["text"],
            "spoken_text": s["spoken_text"],
            "audio_file": s["file"],
            "duration": duration,
            "frames": frames,
            "action": s["action"],
            "camera": s["camera"],
            "diagram": s["diagram"],
            "words": words
        })

    total_sec = total_frames / 30
    print("\n" + "=" * 60)
    print(f"RESUMEN CAPÍTULO 7: {len(SECTIONS)} escenas | {total_sec:.1f}s ({total_frames} frames)")
    print("=" * 60)

    out_data = {
        "title": "Slimefun en DrakesCraft — Capítulo 7: Addons Avanzados, Automatización Infinita & Mitigación de Lag",
        "server": "play.drakescraft.cl",
        "total_frames": total_frames,
        "total_duration": total_sec,
        "scenes": storyboard_scenes
    }

    with open(JSON_OUT, "w", encoding="utf-8") as f:
        json.dump(out_data, f, indent=2, ensure_ascii=False)

    print(f"[OK] Storyboard guardado exitosamente en: {JSON_OUT.name}")

if __name__ == "__main__":
    asyncio.run(main())
