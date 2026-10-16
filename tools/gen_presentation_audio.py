#!/usr/bin/env python3
"""
Genera los audios y subtítulos sincronizados palabra por palabra para el Short de Presentación de DrakesCraft.
Utiliza es-CL-LorenzoNeural (Voz masculina chilena natural para Jack).
"""
import asyncio
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from voice_engine import generate_speech

AUDIO_DIR = ROOT / "video" / "public" / "audio"
JSON_OUT = ROOT / "video" / "src" / "presentation-storyboard.json"

SECTIONS = [
    {
        "id": "p1_hook",
        "file": "pres_p1_hook.mp3",
        "spoken_text": "Hola, soy Jack, dueño de DrakesCraft. Muchos decían que Slimefun estaba muerto, pero en nuestro laboratorio lo revivimos y optimizamos en la versión uno punto veintiuno punto once con más de ochenta expansiones.",
        "text": "Hola, soy Jack, dueño de DrakesCraft. Muchos decían que Slimefun estaba muerto, pero en nuestro laboratorio lo revivimos y optimizamos en la 1.21.11 con más de 80 expansiones."
    },
    {
        "id": "p2_tech",
        "file": "pres_p2_tech.mp3",
        "spoken_text": "DrakesCraft es un entorno de alta automatización con administración SRE propia: cero lag, cero pérdidas de ítems y un equipo que cuida a nuestra comunidad.",
        "text": "DrakesCraft es un entorno de alta automatización con administración SRE propia: cero lag, cero pérdidas de ítems y un equipo que cuida a nuestra comunidad."
    },
    {
        "id": "p3_season2",
        "file": "pres_p3_season2.mp3",
        "spoken_text": "Varios modos de juego, wiki y tienda web activa. Y atentos, porque a mediados de dos mil veintisiete lanzamos la gran Temporada Dos con novedades masivas.",
        "text": "Varios modos de juego, wiki y tienda web activa. Y atentos, porque a mediados de 2027 lanzamos la gran Temporada 2 con novedades masivas."
    },
    {
        "id": "p4_tutorials",
        "file": "pres_p4_tutorials.mp3",
        "spoken_text": "En este canal subiré tutoriales semanales en este mismo formato sobre Slimefun y trucos avanzados de automatización.",
        "text": "En este canal subiré tutoriales semanales en este mismo formato sobre Slimefun y trucos avanzados de automatización."
    },
    {
        "id": "p5_cta",
        "file": "pres_p5_cta.mp3",
        "spoken_text": "Únete a la red técnica en mc punto drakescraft punto cl, para Java y Bedrock en el puerto veinticinco quinientos sesenta y cinco. ¡Te espero en DrakesCraft!",
        "text": "Únete a la red técnica en mc.drakescraft.cl, para Java y Bedrock en el puerto 25565. ¡Te espero en DrakesCraft!"
    }
]

async def main():
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    results = []
    
    total_duration = 0.0
    for sec in SECTIONS:
        out_file = AUDIO_DIR / sec["file"]
        print(f"Generando voz para: {sec['id']}...")
        spoken = sec.get("spoken_text", sec["text"])
        res = await generate_speech(spoken, out_file, voice="es-CL-LorenzoNeural", rate="+6%")
        print(f"  -> Duración: {res['duration']:.2f}s | Palabras: {len(res['words'])}")
        sec_data = {
            "id": sec["id"],
            "file": sec["file"],
            "duration": res["duration"],
            "words": res["words"]
        }
        results.append(sec_data)
        total_duration += res["duration"]
        
    print(f"\nDuración total de voz calculada: {total_duration:.2f}s")
    
    with open(JSON_OUT, "w", encoding="utf-8") as f:
        json.dump({"sections": results, "total_duration": total_duration}, f, indent=2, ensure_ascii=False)
        
    print(f"Storyboard guardado en: {JSON_OUT}")

if __name__ == "__main__":
    asyncio.run(main())
