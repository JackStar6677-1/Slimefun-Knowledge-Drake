#!/usr/bin/env python3
"""
gen_sf_capitulo2_audio.py — Generador de locución y storyboard para:
"Slimefun en DrakesCraft — Capítulo 2: Redes Eléctricas, Energía & Automatización Básica"
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
JSON_OUT = ROOT / "video" / "src" / "sf-capitulo2-storyboard.json"

SECTIONS = [
    {
        "id": "sf2_p01_intro",
        "file": "sf2_p01_intro.mp3",
        "title": "EL SALTO A LA ELECTRICIDAD",
        "subtitle": "Dejar atrás el crafteo manual para entrar a la era industrial",
        "badge": "01 // ERA INDUSTRIAL: LA RED ELÉCTRICA",
        "spoken_text": (
            "Bienvenidos al Capítulo dos de nuestra guía de Slimefun en DrakesCraft. "
            "En el episodio anterior aprendiste a craftear tus primeros materiales usando multibloques manuales. "
            "Pero si quieres procesar miles de minerales y construir reactores, el trabajo manual por clic no es suficiente. "
            "Hoy daremos el gran salto tecnológico: aprenderás a diseñar tu primera red de energía eléctrica automatizada."
        ),
        "text": (
            "Bienvenidos al Capítulo 2 de Slimefun en DrakesCraft. "
            "En el episodio anterior aprendiste a fabricar con multibloques manuales. "
            "Para procesar miles de minerales y construir reactores, el trabajo manual no basta. "
            "Hoy daremos el gran salto tecnológico: tu primera red de energía eléctrica automatizada."
        ),
        "action": "idle",
        "camera": "close",
        "diagram": "energy_intro"
    },
    {
        "id": "sf2_p02_regulator",
        "file": "sf2_p02_regulator.mp3",
        "title": "EL REGULADOR DE ENERGÍA",
        "subtitle": "La antena maestra que coordina toda la red EnergyNet",
        "badge": "02 // CORE COMPONENT: ENERGY REGULATOR",
        "spoken_text": (
            "Toda red eléctrica en Slimefun requiere obligatoriamente una pieza central: el Regulador de Energía. "
            "Es una antena tecnológica que detecta automáticamente todos los generadores, capacitores y máquinas conectadas a su alrededor. "
            "Cada segundo calcula cuánta energía entra al sistema y la distribuye equitativamente hacia las máquinas que la demandan. "
            "Solo necesitas colocar uno por cada red de tu base."
        ),
        "text": (
            "Toda red eléctrica en Slimefun requiere una pieza central: el Regulador de Energía. "
            "Detecta automáticamente generadores, capacitores y máquinas conectadas a su alrededor. "
            "Cada segundo calcula la energía producida y la distribuye a las máquinas activas. "
            "Solo necesitas colocar un regulador por cada red de tu base."
        ),
        "action": "interact",
        "camera": "normal",
        "diagram": "energy_regulator"
    },
    {
        "id": "sf2_p03_capacitors",
        "file": "sf2_p03_capacitors.mp3",
        "title": "ALMACENAMIENTO CON CAPACITORES",
        "subtitle": "Bancos de baterías para acumular reservas de Joules",
        "badge": "03 // STORAGE: CAPACITOR BANKS",
        "spoken_text": (
            "La energía que tus generadores producen y que no se consume de inmediato se perdería si no tienes capacitores. "
            "Los capacitores actúan como grandes baterías industriales medidas en Joules. "
            "Comienzas con el Capacitor Pequeño de dieciséis Joules, avanzas al Mediano y Grande, "
            "hasta alcanzar los bancos de Carbonado de más de mil Joules de capacidad para soportar la noche o picos de consumo masivo."
        ),
        "text": (
            "La energía no consumida de inmediato se perdería sin capacitores: baterías industriales medidas en Joules. "
            "Comienzas con el Capacitor Pequeño de 16 J, avanzas al Mediano y Grande, "
            "hasta los bancos de Carbonado de más de 1.000 J para soportar la noche o picos de demanda."
        ),
        "action": "interact",
        "camera": "close",
        "diagram": "capacitor_banks"
    },
    {
        "id": "sf2_p04_solar",
        "file": "sf2_p04_solar.mp3",
        "title": "GENERACIÓN SOLAR LIMPIA",
        "subtitle": "Paneles solares básicos para arrancar tu base",
        "badge": "04 // GENERATORS: SOLAR POWER",
        "spoken_text": (
            "Tu primer generador eléctrico recomendado es el Generador Solar. "
            "Se craftea en la Mesa Mejorada usando celdas fotovoltaicas, motores eléctricos y lingotes de aluminio. "
            "Produce cuatro Joules por segundo de forma gratuita durante las horas de luz solar directa sin consumir combustible. "
            "Es la fuente perfecta para alimentar tus primeras máquinas de procesamiento mientras minas."
        ),
        "text": (
            "Tu primer generador recomendado es el Generador Solar. "
            "Se fabrica en la Mesa Mejorada con celdas fotovoltaicas, motores eléctricos y aluminio. "
            "Genera 4 J/s de forma limpia y gratuita durante el día sin gastar combustible. "
            "Ideal para alimentar tus primeras máquinas de procesamiento mientras minas."
        ),
        "action": "idle",
        "camera": "normal",
        "diagram": "solar_generator"
    },
    {
        "id": "sf2_p05_combustion",
        "file": "sf2_p05_combustion.mp3",
        "title": "ENERGÍA CONTINUA: GENERADORES DE CARBÓN Y LAVA",
        "subtitle": "Producción constante las veinticuatro horas del día",
        "badge": "05 // GENERATORS: COAL & LAVA THERMAL",
        "spoken_text": (
            "Cuando cae la noche o expandes tus máquinas a cavernas subterráneas, el sol no te alcanzará. "
            "Aquí entran los generadores térmicos. El Generador de Carbón entrega dieciséis Joules por segundo quemando carbón o carbón vegetal. "
            "Y el Generador de Lava produce veinticuatro Joules por segundo continuos usando cubos de lava, garantizando energía estable sin interrupciones."
        ),
        "text": (
            "Cuando cae la noche o expandes tu base subterránea, necesitas generadores térmicos. "
            "El Generador de Carbón entrega 16 J/s quemando carbón o carbón vegetal. "
            "El Generador de Lava produce 24 J/s continuos con cubos de lava, asegurando energía 24/7."
        ),
        "action": "interact",
        "camera": "wide",
        "diagram": "thermal_generators"
    },
    {
        "id": "sf2_p06_wiring",
        "file": "sf2_p06_wiring.mp3",
        "title": "CÓMO CONECTAR TU RED SIN CABLES",
        "subtitle": "Transferencia por bloques contiguos y relés de energía",
        "badge": "06 // TOPOLOGY: WIRELESS ENERGY TRANSFER",
        "spoken_text": (
            "Una gran ventaja del diseño de Slimefun es que no necesitas llenar tu base de tuberías desordenadas. "
            "La energía fluye de forma natural a través de bloques adyacentes de la red. "
            "Puedes colocar un generador al lado de un capacitor, y el capacitor al lado de tu horno eléctrico. "
            "Para distancias mayores, puedes usar cables y relés de energía para llevar la corriente hasta donde la necesites."
        ),
        "text": (
            "Slimefun no te obliga a llenar tu base de tuberías caóticas: la energía fluye por bloques adyacentes. "
            "Coloca un generador junto a un capacitor, y este junto a tu horno eléctrico. "
            "Para distancias mayores, usa cables y relés para extender la red por toda tu base."
        ),
        "action": "idle",
        "camera": "normal",
        "diagram": "network_topology"
    },
    {
        "id": "sf2_p07_machines",
        "file": "sf2_p07_machines.mp3",
        "title": "PRIMERAS MÁQUINAS: HORNO Y LAVADOR ELÉCTRICO",
        "subtitle": "Procesamiento automático a alta velocidad",
        "badge": "07 // AUTOMATION: ELECTRIC MACHINES",
        "spoken_text": (
            "Una vez que tu regulador y capacitores están listos, conectas tus primeras máquinas industriales. "
            "El Horno Eléctrico funde menas y comida en fracciones de segundo consumiendo ocho Joules por tick. "
            "Y el Lavador de Minerales Eléctrico procesa automáticamente grava y polvo mineral con agua, multiplicando pepitas de oro y polvos sin esfuerzo."
        ),
        "text": (
            "Con tu red lista, conecta tus primeras máquinas industriales. "
            "El Horno Eléctrico funde menas en fracciones de segundo con 8 J/tick. "
            "El Lavador de Minerales Eléctrico procesa grava y polvos con agua automáticamente, "
            "multiplicando pepitas de oro y recursos sin mover un solo dedo."
        ),
        "action": "interact",
        "camera": "close",
        "diagram": "electric_machines"
    },
    {
        "id": "sf2_p08_ingots",
        "file": "sf2_p08_ingots.mp3",
        "title": "LA FÁBRICA ELÉCTRICA DE LINGOTES",
        "subtitle": "Compactación industrial y aleaciones automáticas",
        "badge": "08 // INDUSTRY: ELECTRIC INGOT FACTORY",
        "spoken_text": (
            "La cúspide de la fase básica es la Fábrica Eléctrica de Lingotes. "
            "Esta máquina reemplaza las combinaciones manuales de la fundición para transformar polvos metálicos directamente en lingotes refinados. "
            "Combinando un Horno Eléctrico con una Fábrica de Lingotes, tu taller se convierte en una línea de ensamblaje continua."
        ),
        "text": (
            "La cúspide de esta fase es la Fábrica Eléctrica de Lingotes. "
            "Reemplaza las fundiciones manuales, transformando polvos minerales directamente en lingotes refinados. "
            "Combinando Horno Eléctrico y Fábrica de Lingotes, tu base se convierte en una refinería industrial continua."
        ),
        "action": "interact",
        "camera": "normal",
        "diagram": "ingot_factory"
    },
    {
        "id": "sf2_p09_sre_tips",
        "file": "sf2_p09_sre_tips.mp3",
        "title": "BUENAS PRÁCTICAS SRE PARA ENERGÍA",
        "subtitle": "Topología limpia y cero sobrecarga de ticks en el clúster",
        "badge": "09 // SRE GUIDE: ZERO TICK OVERHEAD",
        "spoken_text": (
            "Como administrador de sistemas, te daré un consejo crucial: nunca conectes dos reguladores de energía en el mismo circuito cerrado. "
            "Tener dos cerebros compitiendo por la misma red obliga a la máquina virtual de Java a recalcular rutas continuamente, generando lag de ticks. "
            "Mantén tus redes delimitadas por zonas o fábricas, y tu base correrá a veinte punto cero TPS permanentes."
        ),
        "text": (
            "Consejo SRE fundamental: nunca conectes dos Reguladores de Energía en el mismo circuito cerrado. "
            "Tener dos cerebros en la misma red obliga a la JVM a recalcular rutas, generando lag innecesario. "
            "Mantén tus redes delimitadas por zonas, y tu base correrá a 20.0 TPS impecables."
        ),
        "action": "idle",
        "camera": "close",
        "diagram": "sre_tips"
    },
    {
        "id": "sf2_p10_conclusion",
        "file": "sf2_p10_conclusion.mp3",
        "title": "LISTOS PARA LA METALURGIA AVANZADA",
        "subtitle": "Tu base eléctrica está activa en play.drakescraft.cl",
        "badge": "10 // NEXT: METALLURGY & CARGO LOGISTICS",
        "spoken_text": (
            "Con tu red de energía, generadores solares y capacitores en marcha, has desbloqueado la era industrial. "
            "En el Capítulo tres nos adentraremos en la metalurgia avanzada, aleaciones de acero de Damasco, "
            "y la logística con nodos de transporte de ítems. "
            "Empieza a construir tu red eléctrica hoy mismo en play punto drakescraft punto ce ele."
        ),
        "text": (
            "Con tu red de energía, generadores solares y capacitores activos, entraste de lleno a la era industrial. "
            "En el Capítulo 3 dominaremos la metalurgia avanzada, aleaciones de acero de Damasco y logística de transporte. "
            "¡Comienza a construir tu red eléctrica en play.drakescraft.cl!"
        ),
        "action": "interact",
        "camera": "normal",
        "diagram": "chapter2_final"
    }
]

async def main():
    print("=" * 60)
    print("GENERANDO AUDIO Y STORYBOARD PARA SLIMEFUN CAPÍTULO 2")
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
        "chapter": 2,
        "series": "Slimefun Masterclass",
        "title": "Slimefun en DrakesCraft: Capítulo 2 — Redes Eléctricas, Energía & Automatización Básica",
        "fps": 30,
        "scenes": scenes_output
    }

    with open(JSON_OUT, "w", encoding="utf-8") as f:
        json.dump(storyboard_data, f, indent=2, ensure_ascii=False)

    print(f"\n[OK] Storyboard guardado en: {JSON_OUT}")
    print(f"Total palabras procesadas: {total_words}")

if __name__ == "__main__":
    asyncio.run(main())
