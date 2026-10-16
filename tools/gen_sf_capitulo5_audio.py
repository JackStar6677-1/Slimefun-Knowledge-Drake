#!/usr/bin/env python3
"""
gen_sf_capitulo5_audio.py — Generador de locución y storyboard para:
"Slimefun en DrakesCraft — Capítulo 5: Reactores Nucleares & Refrigeración Criogénica"
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
JSON_OUT = ROOT / "video" / "src" / "sf-capitulo5-storyboard.json"

SECTIONS = [
    {
        "id": "sf5_p01_intro",
        "file": "sf5_p01_intro.mp3",
        "title": "LA FRONTERA NUCLEAR DE SLIMEFUN",
        "subtitle": "De la generación solar y fósil al poder atómico de fisión",
        "badge": "01 // INTRODUCCIÓN A LA ENERGÍA NUCLEAR",
        "spoken_text": (
            "Bienvenidos al Capítulo cinco de nuestra guía de Slimefun en DrakesCraft. "
            "Si has seguido la serie, tu base ya cuenta con redes eléctricas estables y logística de carga automatizada. "
            "Pero cuando comienzas a operar reactores de infusión, compresores de diamante y máquinas industriales masivas, "
            "los paneles solares y generadores de combustión ya no dan abasto. "
            "Ha llegado el momento de ingresar a la era atómica con Reactores Nucleares."
        ),
        "text": (
            "Bienvenidos al Capítulo 5 de Slimefun en DrakesCraft. "
            "Con redes eléctricas y logística listas, las máquinas pesadas demandan energía extrema. "
            "Los paneles solares y generadores básicos ya no son suficientes. "
            "Hoy ingresamos a la era atómica: Reactores Nucleares y refrigeración criogénica."
        ),
        "action": "idle",
        "camera": "close",
        "diagram": "nuclear_intro"
    },
    {
        "id": "sf5_p02_radiation",
        "file": "sf5_p02_radiation.mp3",
        "title": "SEGURIDAD Y TRAJE HAZMAT",
        "subtitle": "Protocolo biológico estricto: la radiación no perdona descuidos",
        "badge": "02 // BIOSEGURIDAD SRE: TRAJE HAZMAT",
        "spoken_text": (
            "Antes de tocar un solo gramo de material fisible, la regla número uno es equiparte con un Traje Hazmat completo. "
            "En DrakesCraft, los minerales radiactivos como el Uranio y el Neptunio infligen daño letal directo si los sostienes sin protección. "
            "El traje Hazmat se fabrica con tela Scuba, plomo reforzado y filtros especiales. "
            "Nunca abras un cofre con uranio sin tener puestas las cuatro piezas del traje protector."
        ),
        "text": (
            "Protocolo Obligatorio: Traje Hazmat Completo. "
            "Sostener Uranio o Neptunio sin protección causa envenenamiento radiológico instantáneo. "
            "Fabricado con tela Scuba, placas de plomo y filtros de respiración. "
            "Las 4 piezas deben estar equipadas antes de manipular combustible."
        ),
        "action": "point",
        "camera": "mid",
        "diagram": "hazmat_suit"
    },
    {
        "id": "sf5_p03_uranium",
        "file": "sf5_p03_uranium.mp3",
        "title": "ENRIQUECIMIENTO DE URANIO-235",
        "subtitle": "Centrifugado y purificación de polvo radiactivo",
        "badge": "03 // CICLO DEL COMBUSTIBLE: U-235",
        "spoken_text": (
            "Para alimentar un reactor nuclear no basta con uranio en bruto. "
            "Necesitas procesar Polvo de Uranio en una Centrífuga Nuclear para separar los isótopos y obtener Uranio-235. "
            "Luego, en el Compresor Eléctrico, combinas el combustible enriquecido con placas de plomo "
            "para moldear las Varillas de Combustible Nuclear estables, listas para ser insertadas en el núcleo del reactor."
        ),
        "text": (
            "Ciclo del Combustible: Uranio-235. "
            "1. Centrifugado: procesa polvo de uranio en la Centrífuga Nuclear. "
            "2. Aislamiento: obtén Uranio-235 enriquecido de alta pureza. "
            "3. Compresión: sella las Varillas de Combustible con plomo reforzado."
        ),
        "action": "interact",
        "camera": "close",
        "diagram": "uranium_cycle"
    },
    {
        "id": "sf5_p04_reactor",
        "file": "sf5_p04_reactor.mp3",
        "title": "ARQUITECTURA DEL REACTOR NUCLEAR",
        "subtitle": "Generación de hasta mil doscientos Joules por segundo",
        "badge": "04 // EL NÚCLEO: REACTOR NUCLEAR",
        "spoken_text": (
            "El Reactor Nuclear es una maravilla de ingeniería de Slimefun. "
            "Es capaz de entregar hasta mil doscientos Joules por segundo de forma continua, "
            "suficiente para abastecer una ciudad industrial completa. "
            "Sin embargo, este enorme poder conlleva una responsabilidad crítica: "
            "el reactor genera calor masivo en cada ciclo operativo y requiere refrigeración ininterrumpida."
        ),
        "text": (
            "Reactor Nuclear: Potencia Pura. "
            "Genera hasta 1,200 J/s continuos de energía limpia para macro-factorías. "
            "Sustituye granjas enteras de paneles solares reduciendo entidades en el chunk. "
            "Requisito ineludible: refrigeración criogénica ininterrumpida."
        ),
        "action": "cheer",
        "camera": "wide",
        "diagram": "nuclear_reactor"
    },
    {
        "id": "sf5_p05_coolant",
        "file": "sf5_p05_coolant.mp3",
        "title": "REFRIGERACIÓN CRIOGÉNICA Y MELTDOWN",
        "subtitle": "Varillas de enfriamiento y prevención de explosiones catastróficas",
        "badge": "05 // SEGURIDAD TÉRMICA: COOLANT",
        "spoken_text": (
            "La regla dorada de un reactor Slimefun es simple: si se queda sin refrigerante, sufrirá un colapso térmico. "
            "Un reactor sobrecalentado detonará violentamente, vaporizando los bloques circundantes y liberando una nube radiactiva mortal. "
            "Para evitarlo, debes automatizar el suministro de Varillas de Refrigerante Criogénico mediante Cargo Nodes. "
            "Mientras el reactor reciba refrigerante a tiempo, operará al cien por ciento de eficiencia con total seguridad."
        ),
        "text": (
            "Prevención de Meltdown (Colapso Nuclear). "
            "Sin refrigeración, el núcleo detona y vaporiza la estructura circundante. "
            "Varillas de Refrigerante Criogénico: suministro continuo vía Cargo Nodes. "
            "Regla SRE: monitoreo de buffer y redundancia de suministro 100% automatizada."
        ),
        "action": "point",
        "camera": "mid",
        "diagram": "coolant_system"
    },
    {
        "id": "sf5_p06_waste",
        "file": "sf5_p06_waste.mp3",
        "title": "GESTIÓN DE RESIDUOS RADIACTIVOS",
        "subtitle": "Subproductos, almacenamiento en plomo y reciclaje nuclear",
        "badge": "06 // TRATAMIENTO DE RESIDUOS",
        "spoken_text": (
            "Tras consumir cada varilla de combustible, el reactor produce Residuos Nucleares altamente tóxicos. "
            "No puedes tirarlos al suelo ni destruirlos con lava común. "
            "Debes canalizarlos hacia un Contenedor Blindado de Plomo utilizando tu red de carga. "
            "Más adelante, estos residuos pueden ser reprocesados para fabricar aleaciones exóticas y armamento avanzado."
        ),
        "text": (
            "Gestión de Residuos Nucleares. "
            "El subproducto tóxico no puede destruirse en lava ni liberarse al entorno. "
            "Extracción obligatoria por Cargo Node hacia cofres blindados de plomo. "
            "Reciclaje futuro: insumo clave para tecnología cuántica y aleaciones exóticas."
        ),
        "action": "interact",
        "camera": "close",
        "diagram": "nuclear_waste"
    },
    {
        "id": "sf5_p07_summary",
        "file": "sf5_p07_summary.mp3",
        "title": "ENERGÍA INFINITA Y SEGURA",
        "subtitle": "Conéctate a DrakesCraft y construye tu imperio atómico",
        "badge": "07 // CONCLUSIÓN Y RED DRAKES",
        "spoken_text": (
            "Ahora dominas el ciclo completo de la energía nuclear: protección biológica, combustible enriquecido, "
            "refrigeración criogénica automatizada y control seguro de residuos. "
            "Tu base en DrakesCraft está lista para las tecnologías más avanzadas del servidor sin caídas de tensión ni lag. "
            "Conéctate ahora mismo en play punto drakescraft punto ce ele y únete a nuestra comunidad en Discord. Nos vemos en el próximo capítulo."
        ),
        "text": (
            "Dominio de la Fisión Nuclear en Slimefun. "
            "Bioseguridad Hazmat + Enriquecimiento U-235 + Refrigeración Segura. "
            "Potencia infinita para macro-factorías a 20.0 TPS impecables. "
            "¡Conéctate en play.drakescraft.cl:25565 y únete a la comunidad!"
        ),
        "action": "cheer",
        "camera": "wide",
        "diagram": "summary_network"
    }
]

async def main():
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    print("=" * 60)
    print("GENERANDO AUDIO Y STORYBOARD: SLIMEFUN CAPÍTULO 5")
    print("Reactores Nucleares & Refrigeración Criogénica (DrakesCraft)")
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
    print(f"RESUMEN CAPÍTULO 5: {len(SECTIONS)} escenas | {total_sec:.1f}s ({total_frames} frames)")
    print("=" * 60)

    out_data = {
        "title": "Slimefun en DrakesCraft — Capítulo 5: Reactores Nucleares & Refrigeración Criogénica",
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
