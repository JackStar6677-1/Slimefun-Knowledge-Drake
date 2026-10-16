#!/usr/bin/env python3
"""
gen_sf_capitulo3_audio.py — Generador de locución y storyboard para:
"Slimefun en DrakesCraft — Capítulo 3: Metalurgia Avanzada, Aleaciones & Armería de Precisión"
Voz: es-CL-LorenzoNeural (Jack, Sysadmin & Guía Oficial de DrakesCraft).
"""
import asyncio
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from voice_engine import generate_speech

AUDIO_DIR = ROOT / "video" / "public" / "audio"
JSON_OUT = ROOT / "video" / "src" / "sf-capitulo3-storyboard.json"

SECTIONS = [
    {
        "id": "sf3_p01_intro",
        "file": "sf3_p01_intro.mp3",
        "title": "LA ERA DE LOS METALES",
        "subtitle": "Superando las limitaciones del hierro y diamante vainilla",
        "badge": "01 // METALURGIA: FUNDAMENTOS",
        "spoken_text": (
            "Bienvenidos al Capítulo tres de nuestra guía de Slimefun en DrakesCraft. "
            "Una vez que cuentas con tus primeros multibloques y tu red eléctrica básica, "
            "descubrirás que el hierro, el oro y los diamantes convencionales no son suficientes para la alta tecnología. "
            "Hoy dominaremos la metalurgia avanzada: aleaciones industriales, la forja de armaduras y componentes de alta resistencia."
        ),
        "text": (
            "Bienvenidos al Capítulo 3 de Slimefun en DrakesCraft. "
            "Con tus primeros multibloques y red de energía operativa, "
            "el hierro y diamante vainilla ya no bastan para la alta tecnología. "
            "Hoy dominaremos la metalurgia avanzada: aleaciones industriales y armería especializada."
        ),
        "action": "idle",
        "camera": "close",
        "diagram": "metallurgy_intro"
    },
    {
        "id": "sf3_p02_smeltery",
        "file": "sf3_p02_smeltery.mp3",
        "title": "EL FUNDIDOR (SMELTERY)",
        "subtitle": "El corazón pirometalúrgico para fusionar polvos y metales",
        "badge": "02 // MULTIBLOQUE: THE SMELTERY",
        "spoken_text": (
            "El Fundidor, o Smeltery, es la máquina central de la metalurgia en Slimefun. "
            "Se construye con un dispensador central, vallas del Nether como soporte refractario y una fuente de lava o fuego en la base. "
            "Aquí combinas polvos metálicos extraídos de la grava lavada para crear lingotes compuestos imposibles de fundir en un horno ordinario."
        ),
        "text": (
            "El Fundidor (Smeltery) es la máquina pirometalúrgica central. "
            "Se construye con un dispensador, vallas del Nether refractarias y fuego inferior. "
            "Combina polvos minerales de la grava lavada para fundir lingotes compuestos."
        ),
        "action": "interact",
        "camera": "normal",
        "diagram": "smeltery"
    },
    {
        "id": "sf3_p03_basic_alloys",
        "file": "sf3_p03_basic_alloys.mp3",
        "title": "BRONCE, DURALUMINIO Y LATÓN",
        "subtitle": "Las primeras tres aleaciones fundamentales del sistema",
        "badge": "03 // ALEACIONES BÁSICAS: TIER 1",
        "spoken_text": (
            "Tus primeras aleaciones son tres pilares industriales. "
            "Primero, el Bronce: combinando polvo de cobre y estaño en el fundidor. "
            "Segundo, el Duraluminio: combinando aluminio y cobre, vital para estructuras aeroespaciales y máquinas ligeras. "
            "Y tercero, el Latón, obtenido de cobre y zinc. "
            "Asegúrate de tener un tamiz automático para no quedarte sin polvos base."
        ),
        "text": (
            "Tus primeras 3 aleaciones base: "
            "1. Bronce: Cobre + Estaño (componentes mecánicos iniciales). "
            "2. Duraluminio: Aluminio + Cobre (estructuras ligeras e ingeniería). "
            "3. Latón: Cobre + Zinc. Automatiza tu tamiz para producción continua."
        ),
        "action": "explain",
        "camera": "dynamic",
        "diagram": "basic_alloys"
    },
    {
        "id": "sf3_p04_steel_damascus",
        "file": "sf3_p04_steel_damascus.mp3",
        "title": "ACERO Y ACERO DE DAMASCO",
        "subtitle": "Resistencia estructural superior para maquinaria pesada",
        "badge": "04 // ACERO: ESTRUCTURA PESADA",
        "spoken_text": (
            "Para maquinaria de alto rendimiento necesitas Acero. "
            "Se produce combinando lingotes de hierro con carbono concentrado en el fundidor. "
            "Al refinar el acero con capas adicionales de hierro y carbono obtienes el mítico Acero de Damasco. "
            "Este metal es el estándar para pistones industriales, placas de blindaje y armaduras de alta durabilidad."
        ),
        "text": (
            "Para maquinaria pesada necesitas Acero: Hierro + Carbono en el Fundidor. "
            "Al refinarlo con capas adicionales obtienes el Acero de Damasco. "
            "Es el estándar para pistones industriales, armazones y blindajes resistentes."
        ),
        "action": "interact",
        "camera": "normal",
        "diagram": "steel_damascus"
    },
    {
        "id": "sf3_p05_armor_forge",
        "file": "sf3_p05_armor_forge.mp3",
        "title": "LA FORJA DE ARMADURAS",
        "subtitle": "Ensamblando equipamiento de protección avanzada",
        "badge": "05 // MULTIBLOQUE: ARMOR FORGE",
        "spoken_text": (
            "Los lingotes de aleación especial no se pueden transformar en armaduras en la mesa de crafteo común. "
            "Debes ensamblar la Forja de Armaduras, compuesta por un yunque sobre un dispensador. "
            "Colocas el patrón exacto con lingotes de Damasco o Aleación Reforzada y activas el dispensador. "
            "El resultado es un equipo táctico con reducciones de daño muy superiores al diamante."
        ),
        "text": (
            "Las aleaciones no se craftean en mesas normales. "
            "Usa la Forja de Armaduras: Yunque sobre Dispensador. "
            "Inserta el patrón con lingotes de Damasco o Aleación Reforzada. "
            "Obtienes equipamiento táctico con durabilidad y mitigación de daño superior."
        ),
        "action": "explain",
        "camera": "dynamic",
        "diagram": "armor_forge"
    },
    {
        "id": "sf3_p06_high_tech_alloys",
        "file": "sf3_p06_high_tech_alloys.mp3",
        "title": "ALEACIONES DE ALTA TECNOLOGÍA",
        "subtitle": "Aleación Reforzada, Lingotes de Redstone y Oro Sintético",
        "badge": "06 // TECH METALS: REACTORES Y CIRCUITOS",
        "spoken_text": (
            "En la cúspide de la metalurgia encontramos los metales de grado nuclear. "
            "La Aleación Reforzada, combinando placas endurecidas de acero y corindón, es indispensable para contenedores de reactores nucleares. "
            "El Lingote de Redstone es el super-conductor que enlaza chips avanzados. "
            "Y el Oro Sintético te permite independizarte de las minas naturales para crafteos masivos."
        ),
        "text": (
            "Metales de grado nuclear y alta tecnología: "
            "1. Aleación Reforzada: blindaje indispensable para reactores nucleares. "
            "2. Lingote de Redstone: superconductor para circuitos y placas lógicas. "
            "3. Oro Sintético: abastecimiento ilimitado para componentes electrónicos."
        ),
        "action": "interact",
        "camera": "normal",
        "diagram": "high_tech_alloys"
    },
    {
        "id": "sf3_p07_efficiency_sre",
        "file": "sf3_p07_efficiency_sre.mp3",
        "title": "BUENAS PRÁCTICAS SRE EN METALURGIA",
        "subtitle": "Ratios de compresión, trituración y gestión de inventario",
        "badge": "07 // SRE OPTIMIZATION: METALS PIPELINE",
        "spoken_text": (
            "Desde el enfoque de estabilidad de DrakesCraft, nunca fundas minerales crudos de forma directa. "
            "Pasa siempre tus menas por un Triturador de Minerales eléctrico para duplicar la producción de polvos. "
            "Utiliza el Compresor automático para lingotes de carbono y mantén tus dispensadores de fundición abastecidos de forma limpia. "
            "Optimizar el flujo de entrada evita la saturación de cofres y cuello de botella en tu base."
        ),
        "text": (
            "Buenas prácticas de ingeniería en DrakesCraft: "
            "1. Nunca fundas menas crudas: usa el Triturador Eléctrico para duplicar polvos. "
            "2. Automatiza el Compresor para lingotes de carbono. "
            "3. Mantén los dispensadores limpios para evitar cuellos de botella."
        ),
        "action": "explain",
        "camera": "close",
        "diagram": "efficiency_pipeline"
    },
    {
        "id": "sf3_p08_conclusion",
        "file": "sf3_p08_conclusion.mp3",
        "title": "CONCLUSIÓN Y CAPÍTULO 4",
        "subtitle": "El próximo paso: Logística automatizada con Cargo Management",
        "badge": "08 // NEXT STEP: CARGO SYSTEMS",
        "spoken_text": (
            "Ahora cuentas con el dominio completo de los metales y aleaciones en Slimefun. "
            "Tus herramientas, armaduras y futuros reactores tienen ahora la base material necesaria. "
            "En el Capítulo cuatro abordaremos el sistema más potente y peligroso si se malconfigura: "
            "el sistema de Cargo y transporte de ítems sin generar lag de entidades en el servidor. "
            "Nos vemos en DrakesCraft."
        ),
        "text": (
            "Tienes el dominio de la metalurgia y aleaciones en Slimefun. "
            "Tus herramientas, blindajes y reactores tienen la base material lista. "
            "En el Capítulo 4 veremos Cargo Management: logística de ítems sin lag de entidades. "
            "Conéctate en play.drakescraft.cl:25565."
        ),
        "action": "idle",
        "camera": "close",
        "diagram": "cargo_preview"
    }
]

async def main():
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    scenes_output = []
    
    print("=" * 60)
    print("GENERANDO AUDIO Y STORYBOARD PARA SLIMEFUN CAPÍTULO 3")
    print("=" * 60)

    for idx, sec in enumerate(SECTIONS):
        out_path = AUDIO_DIR / sec["file"]
        print(f"\n[{idx+1}/{len(SECTIONS)}] Generando {sec['id']} -> {sec['file']}...")
        
        res = await generate_speech(
            text=sec["spoken_text"],
            output_path=out_path,
            voice="es-CL-LorenzoNeural",
            rate="+2%",
            pitch="-1Hz"
        )
        
        duration = res["duration"]
        words = res["words"]
        frames = int(duration * 30) + 15
        print(f"  [OK] Duración: {duration:.2f}s ({frames} frames) | Palabras: {len(words)}")
        
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
            "frames": frames,
            "words": words
        })
        
    total_frames = sum(s["frames"] for s in scenes_output)
    total_sec = sum(s["duration"] for s in scenes_output)
    print("\n" + "=" * 60)
    print(f"TOTAL STORYBOARD SF CAPÍTULO 3: {total_sec:.1f}s ({total_frames} frames a 30fps = ~{total_sec/60:.2f} mins)")
    print("=" * 60)

    storyboard_data = {
        "chapter": 3,
        "series": "Slimefun Masterclass",
        "title": "Slimefun en DrakesCraft: Capítulo 3 — Metalurgia Avanzada, Aleaciones & Armería de Precisión",
        "fps": 30,
        "scenes": scenes_output
    }

    with open(JSON_OUT, "w", encoding="utf-8") as f:
        json.dump(storyboard_data, f, indent=2, ensure_ascii=False)
    print(f"[OK] Guardado storyboard en: {JSON_OUT}")

if __name__ == "__main__":
    asyncio.run(main())
