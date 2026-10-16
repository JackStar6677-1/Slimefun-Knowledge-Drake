#!/usr/bin/env python3
"""
gen_long_presentation_audio.py — Generador de voz y subtítulos para el Video Largo Horizontal de DrakesCraft.
Voz: es-CL-LorenzoNeural (Jack, dueño de DrakesCraft).
Formato: 16:9 Horizontal (1920x1080).
"""

import asyncio
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from voice_engine import generate_speech

AUDIO_DIR = ROOT / "video" / "public" / "audio"
JSON_OUT = ROOT / "video" / "src" / "long-presentation-storyboard.json"

SECTIONS = [
    {
        "id": "intro",
        "file": "long_p1_intro.mp3",
        "spoken_text": (
            "Hola a todos, soy Jack, dueño de DrakesCraft. Bienvenidos a esta presentación completa "
            "del proyecto. Muchos nos conocen como un servidor técnico de Minecraft, pero detrás hay "
            "toda una infraestructura de desarrollo y experimentación orientada a resolver problemas "
            "reales de estabilidad, automatización y rendimiento."
        ),
        "text": (
            "Hola a todos, soy Jack, dueño de DrakesCraft. Bienvenidos a esta presentación completa "
            "del proyecto. Muchos nos conocen como un servidor técnico de Minecraft, pero detrás hay "
            "toda una infraestructura de desarrollo y experimentación orientada a resolver problemas "
            "reales de estabilidad, automatización y rendimiento."
        ),
        "title": "INTRODUCCIÓN & VISIÓN DE DRAKES"
    },
    {
        "id": "slimefun",
        "file": "long_p2_slimefun.mp3",
        "spoken_text": (
            "Durante años, la comunidad dio a Slimefun por estancado o prácticamente inviable en versiones "
            "recientes debido a fugas de memoria, bloqueos de hilos y lag de entidades. En nuestro laboratorio "
            "tomamos el desafío de revivirlo por completo en la versión uno punto veintiuno punto once, "
            "optimizando el bucle de ticks y soportando un ecosistema activo de más de ochenta expansiones, "
            "incluyendo Networks versión seis, Infinity, Magic y sistemas de almacenamiento masivo sin caídas de rendimiento."
        ),
        "text": (
            "Durante años, la comunidad dio a Slimefun por estancado o inviable en versiones recientes "
            "por problemas de memoria y lag. En nuestro laboratorio lo revivimos en la 1.21.11, "
            "optimizando el bucle de ticks con más de 80 expansiones: Networks V6, Infinity, Magic "
            "y almacenamiento masivo sin caídas de rendimiento."
        ),
        "title": "RESURRECCIÓN DE SLIMEFUN 1.21.11"
    },
    {
        "id": "sre",
        "file": "long_p3_sre.mp3",
        "spoken_text": (
            "Para sostener esto implementamos una arquitectura SRE totalmente automatizada que supervisa "
            "el estado del clúster las veinticuatro horas del día. Contamos con sincronización atómica de datos "
            "para garantizar cero pérdidas de inventario o máquinas, junto a un equipo humano de soporte "
            "que acompaña a los jugadores en su progresión técnica."
        ),
        "text": (
            "Implementamos una arquitectura SRE automatizada 24/7 que supervisa el clúster. "
            "Sincronización atómica para cero pérdida de inventarios o máquinas, "
            "junto al soporte de nuestro equipo humano para la comunidad."
        ),
        "title": "INFRAESTRUCTURA SRE & CERO PÉRDIDAS"
    },
    {
        "id": "season2",
        "file": "long_p4_season2.mp3",
        "spoken_text": (
            "Contamos con múltiples modos de juego, wiki técnica integrada y tienda web oficial. "
            "Y mirando hacia adelante, nos preparamos para el lanzamiento de la gran Temporada Dos "
            "proyectada para mediados de dos mil veintisiete, con reingeniería de mundos y nuevas mecánicas exclusivas."
        ),
        "text": (
            "Múltiples modos de juego, wiki técnica y tienda web oficial. "
            "Nos preparamos para el lanzamiento de la Temporada 2 a mediados de 2027, "
            "con reingeniería de mundos y nuevas mecánicas exclusivas."
        ),
        "title": "TIENDA WEB & TEMPORADA 2 (2027)"
    },
    {
        "id": "tutorials_cta",
        "file": "long_p5_cta.mp3",
        "spoken_text": (
            "En este canal publicaremos guías y tutoriales exhaustivos paso a paso de cada máquina, "
            "receta y addon del servidor. Puedes unirte ahora mismo desde Java o Bedrock en la dirección "
            "mc punto drakescraft punto cl, utilizando el puerto veinticinco quinientos sesenta y cinco. "
            "¡Te esperamos en DrakesCraft!"
        ),
        "text": (
            "Publicaremos guías paso a paso de cada máquina, receta y addon de Slimefun. "
            "Únete desde Java o Bedrock en mc.drakescraft.cl (puerto 25565). "
            "¡Te esperamos en DrakesCraft!"
        ),
        "title": "TUTORIALES EN EL CANAL & CONEXIÓN"
    }
]

async def main():
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    results = []
    total_duration = 0.0
    
    print("=" * 60)
    print("GENERANDO AUDIO PARA VIDEO LARGO HORIZONTAL DE DRAKES...")
    print("=" * 60)
    
    for sec in SECTIONS:
        out_file = AUDIO_DIR / sec["file"]
        print(f"[+] Generando locución: {sec['id']}...")
        spoken = sec.get("spoken_text", sec["text"])
        res = await generate_speech(spoken, out_file, voice="es-CL-LorenzoNeural", rate="+4%")
        print(f"    Duración: {res['duration']:.2f}s | Palabras: {len(res['words'])}")
        
        sec_data = {
            "id": sec["id"],
            "title": sec["title"],
            "text": sec["text"],
            "file": sec["file"],
            "duration": res["duration"],
            "words": res["words"]
        }
        results.append(sec_data)
        total_duration += res["duration"]
        
    print(f"\n[OK] Duración total calculada: {total_duration:.2f}s (~{total_duration/60:.1f} minutos)")
    
    with open(JSON_OUT, "w", encoding="utf-8") as f:
        json.dump({"sections": results, "total_duration": total_duration}, f, indent=2, ensure_ascii=False)
        
    print(f"[OK] Storyboard guardado en: {JSON_OUT}")

if __name__ == "__main__":
    asyncio.run(main())
