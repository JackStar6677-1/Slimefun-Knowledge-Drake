#!/usr/bin/env python3
"""
gen_sf_capitulo4_audio.py — Generador de locución y storyboard para:
"Slimefun en DrakesCraft — Capítulo 4: Logística, Cargo Management & Optimización Anti-Lag"
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
JSON_OUT = ROOT / "video" / "src" / "sf-capitulo4-storyboard.json"

SECTIONS = [
    {
        "id": "sf4_p01_intro",
        "file": "sf4_p01_intro.mp3",
        "title": "EL CUELLO DE BOTELLA LOGÍSTICO",
        "subtitle": "Por qué las tolvas vainilla y corrientes de agua colapsan un servidor",
        "badge": "01 // LOGÍSTICA: EL RETO SRE",
        "spoken_text": (
            "Bienvenidos al Capítulo cuatro de nuestra guía de Slimefun en DrakesCraft. "
            "Tienes energía eléctrica abundante y fundidores procesando lingotes a toda máquina. "
            "Pero ahora enfrentas el mayor desafío de cualquier base industrial: el transporte de ítems. "
            "Usar cientos de tolvas o corrientes de agua genera una sobrecarga severa en la CPU del servidor. "
            "Hoy aprenderás a implementar el sistema de transporte más veloz y eficiente: Cargo Management."
        ),
        "text": (
            "Bienvenidos al Capítulo 4 de Slimefun en DrakesCraft. "
            "Con energía y fundición operativa, el transporte de ítems es el verdadero reto. "
            "Las tolvas y corrientes de agua vainilla causan un severo lag en el servidor. "
            "Hoy implementaremos la solución más limpia y eficiente: Cargo Management."
        ),
        "action": "idle",
        "camera": "close",
        "diagram": "cargo_intro"
    },
    {
        "id": "sf4_p02_manager",
        "file": "sf4_p02_manager.mp3",
        "title": "EL ADMINISTRADOR DE CARGA",
        "subtitle": "El nodo coordinador que enlaza el grafo de transporte",
        "badge": "02 // CORE COMPONENT: CARGO MANAGER",
        "spoken_text": (
            "El Administrador de Carga, o Cargo Manager, es el corazón de la logística. "
            "A diferencia de las tolvas que revisan inventarios cada cuatro ticks, "
            "este nodo gestiona la transferencia instantánea de ítems directamente en memoria, "
            "sin spawnear entidades en el mundo y sin generar partículas innecesarias. "
            "Es una pieza compacta capaz de gobernar cientos de contenedores conectados."
        ),
        "text": (
            "El Administrador de Carga (Cargo Manager) es el cerebro de la red. "
            "Transfiere ítems directamente en memoria sin generar entidades ni partículas. "
            "Elimina el costoso escaneo continuo de tolvas y soporta cientos de contenedores."
        ),
        "action": "interact",
        "camera": "normal",
        "diagram": "cargo_manager"
    },
    {
        "id": "sf4_p03_nodes",
        "file": "sf4_p03_nodes.mp3",
        "title": "NODOS DE ENTRADA Y SALIDA",
        "subtitle": "La anatomía de extracción e inserción en contenedores",
        "badge": "03 // NODOS: INPUT & OUTPUT",
        "spoken_text": (
            "Para conectar tus máquinas a la red utilizas dos tipos de nodos especializados. "
            "El Nodo de Entrada, o Input Node, extrae materiales desde cofres o máquinas hacia el circuito. "
            "El Nodo de Salida, u Output Node, recibe los ítems y los deposita en su destino. "
            "Se colocan adyacentes a cualquier contenedor y se comunican a través de cables de red o bloques contiguos."
        ),
        "text": (
            "Conectores de red especializados: "
            "1. Nodo de Entrada (Input Node): extrae ítems desde cofres y máquinas. "
            "2. Nodo de Salida (Output Node): inserta ítems en el contenedor de destino. "
            "Se colocan junto a los contenedores y viajan por cables o bloques contiguos."
        ),
        "action": "explain",
        "camera": "dynamic",
        "diagram": "input_output_nodes"
    },
    {
        "id": "sf4_p04_channels",
        "file": "sf4_p04_channels.mp3",
        "title": "CANALES DE FRECUENCIA (1 AL 16)",
        "subtitle": "Aislamiento de tráfico para evitar contaminación de materiales",
        "badge": "04 // CANALES: AISLAMIENTO DE TRÁFICO",
        "spoken_text": (
            "Imagina que tus generadores de lava necesitan carbón, pero tus fundidores necesitan polvo de hierro. "
            "Para evitar que los ítems se mezclen en los mismos cofres, el sistema cuenta con dieciséis canales de frecuencia. "
            "Al hacer clic derecho en un nodo, asignas un color o canal del uno al dieciséis. "
            "Los nodos del canal azul jamás enviarán materiales a un receptor configurado en canal rojo."
        ),
        "text": (
            "Para que los materiales no se mezclen, cuentas con 16 canales de frecuencia. "
            "Al interactuar con cada nodo seleccionas un canal del 1 al 16. "
            "Los nodos del Canal 1 (Azul) solo interactúan con receptores del Canal 1."
        ),
        "action": "interact",
        "camera": "normal",
        "diagram": "frequency_channels"
    },
    {
        "id": "sf4_p05_filters",
        "file": "sf4_p05_filters.mp3",
        "title": "FILTROS AVANZADOS Y ROUND-ROBIN",
        "subtitle": "Whitelists, blacklists y balanceo equitativo de carga",
        "badge": "05 // FILTROS: DISTRIBUCIÓN EQUITATIVA",
        "spoken_text": (
            "Cada nodo de transporte permite configurar filtros avanzados mediante listas blancas o listas negras. "
            "Puedes especificar exactamente qué lingotes o polvos transferir y en qué cantidades. "
            "Además, el modo Round-Robin distribuye los ítems equitativamente entre múltiples destinos, "
            "permitiéndote abastecer una batería de ocho hornos eléctricos en paralelo sin saturar el primero."
        ),
        "text": (
            "Filtros avanzados en cada nodo: "
            "1. Listas Blancas (Whitelist) y Negras (Blacklist) para controlar cada ítem. "
            "2. Modo Round-Robin: balancea recursos equitativamente entre múltiples hornos."
        ),
        "action": "explain",
        "camera": "dynamic",
        "diagram": "filters_roundrobin"
    },
    {
        "id": "sf4_p06_autocrafting",
        "file": "sf4_p06_autocrafting.mp3",
        "title": "AUTOMATIZACIÓN DE CRAFTEO Y LOGÍSTICA",
        "subtitle": "Llegando a la autonomía total de procesamiento de menas",
        "badge": "06 // PIPELINE COMPLETO: CERO INTERVENCIÓN",
        "spoken_text": (
            "Al combinar el triturador de minerales, el lavador y los fundidores con Cargo Management, "
            "logras el sueño de todo ingeniero: minas crudas ingresan por un cofre inicial, "
            "se duplican automáticamente en polvos, viajan por canal específico al fundidor, "
            "y se depositan convertidas en lingotes de acero o bronce en tu almacén central sin tocar un solo botón."
        ),
        "text": (
            "El pipeline de autonomía total: "
            "Menas crudas ingresan al cofre -> Triturador eléctrico (2x polvos) -> "
            "Nodos de Cargo por canal específico -> Fundidores -> Almacén clasificado."
        ),
        "action": "interact",
        "camera": "normal",
        "diagram": "full_pipeline"
    },
    {
        "id": "sf4_p07_sre_rules",
        "file": "sf4_p07_sre_rules.mp3",
        "title": "REGLAS DE ORO SRE CONTRA EL LAG",
        "subtitle": "Prevención de bucles infinitos y saturación de grafos",
        "badge": "07 // SRE PROTOCOL: EVITANDO BUCLES",
        "spoken_text": (
            "La regla número uno en DrakesCraft para sistemas de carga: nunca configures dos nodos en bucle cerrado. "
            "Si un cofre A envía al cofre B y el B reenvía al A en el mismo canal sin filtro de parada, "
            "generarás millones de lecturas de inventario en pocos segundos. "
            "Diseña siempre flujos unidireccionales con un origen claro y un destino final delimitado."
        ),
        "text": (
            "Reglas de Oro de estabilidad en DrakesCraft: "
            "1. Cero bucles cerrados: jamás enlaces dos cofres que se extraigan mutuamente. "
            "2. Flujo unidireccional estricto: Origen -> Proceso -> Destino final. "
            "3. Mantén los canales segregados por función para proteger los 20.0 TPS."
        ),
        "action": "explain",
        "camera": "close",
        "diagram": "sre_loop_prevention"
    },
    {
        "id": "sf4_p08_conclusion",
        "file": "sf4_p08_conclusion.mp3",
        "title": "CONCLUSIÓN DE LA MASTERCLASS",
        "subtitle": "Tu base industrial está lista para dominar Slimefun",
        "badge": "08 // DRAKES PROTOCOL: DOMINIO TOTAL",
        "spoken_text": (
            "Con la logística de Cargo completada, has dominado los cuatro pilares fundamentales de Slimefun: "
            "multibloques iniciales, red eléctrica EnergyNet, metalurgia avanzada y transporte automatizado. "
            "Tu base ahora opera con la máxima eficiencia de recursos y cero impacto en el rendimiento del servidor. "
            "Construye tu imperio industrial hoy mismo en play punto drakescraft punto ce ele."
        ),
        "text": (
            "¡Dominio total de los 4 pilares de Slimefun! "
            "1. Multibloques base // 2. EnergyNet // 3. Metalurgia // 4. Cargo Logistics. "
            "Tu factoría opera a máxima velocidad y cero impacto en el rendimiento. "
            "¡Únete ya en play.drakescraft.cl:25565!"
        ),
        "action": "idle",
        "camera": "close",
        "diagram": "final_summary"
    }
]

async def main():
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    scenes_output = []
    
    print("=" * 60)
    print("GENERANDO AUDIO Y STORYBOARD PARA SLIMEFUN CAPÍTULO 4")
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
    print(f"TOTAL STORYBOARD SF CAPÍTULO 4: {total_sec:.1f}s ({total_frames} frames a 30fps = ~{total_sec/60:.2f} mins)")
    print("=" * 60)

    storyboard_data = {
        "chapter": 4,
        "series": "Slimefun Masterclass",
        "title": "Slimefun en DrakesCraft: Capítulo 4 — Logística, Cargo Management & Optimización Anti-Lag",
        "fps": 30,
        "scenes": scenes_output
    }

    with open(JSON_OUT, "w", encoding="utf-8") as f:
        json.dump(storyboard_data, f, indent=2, ensure_ascii=False)
    print(f"[OK] Guardado storyboard en: {JSON_OUT}")

if __name__ == "__main__":
    asyncio.run(main())
