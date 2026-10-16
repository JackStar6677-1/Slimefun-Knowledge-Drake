#!/usr/bin/env python3
"""
gen_capitulo2_audio.py — Generador de locución TTS y subtítulos sincronizados para el Capítulo 2 (Versión Extendida).
Voz: es-CL-LorenzoNeural (Jack, Sysadmin & Dueño de DrakesCraft).
Pacing: natural, pausado, con fonética cuidada para términos de ingeniería y sistemas.
"""

import asyncio
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from voice_engine import generate_speech

AUDIO_DIR = ROOT / "video" / "public" / "audio"
JSON_OUT = ROOT / "video" / "src" / "capitulo2-storyboard.json"

SECTIONS = [
    {
        "id": "c2_p01_intro",
        "file": "cap2_p01_intro.mp3",
        "title": "EL MITO DEL JUEGO DE BLOQUES",
        "subtitle": "OpenJDK 21 64-Bit & ZGC Generacional",
        "badge": "01 // SYS_PROFILE: OPENJDK_21_64BIT",
        "spoken_text": (
            "A nivel de superficie, Minecraft suele catalogarse como un simple juego de gestión de bloques y mecánicas básicas. "
            "Pero cuando se analiza desde la perspectiva de la computación, el modelo cambia drásticamente."
        ),
        "text": (
            "A nivel de superficie, Minecraft parece un juego de bloques simple. "
            "Pero desde la perspectiva de la computación, el modelo cambia drásticamente."
        ),
        "action": "idle",
        "camera": "close",
        "diagram": "jvm_stack"
    },
    {
        "id": "c2_p02_budget",
        "file": "cap2_p02_budget.mp3",
        "title": "EL PRESUPUESTO POR TICK",
        "subtitle": "50.00 ms inflexibles por ciclo computacional",
        "badge": "02 // BUDGET: 50.00 MS / TICK",
        "spoken_text": (
            "El motor del juego corre sobre un bucle síncrono inflexible: cada segundo contiene exactamente veinte ciclos de cómputo. "
            "Eso significa que el hilo principal tiene una ventana estricta de cincuenta milisegundos "
            "para evaluar la física, el movimiento de entidades, las máquinas y las transacciones de estado de cada jugador conectado."
        ),
        "text": (
            "El motor corre sobre un bucle síncrono de 20 ciclos por segundo. "
            "El hilo principal tiene una ventana estricta de 50 ms para evaluar física, entidades, "
            "máquinas y transacciones de estado de cada jugador conectado."
        ),
        "action": "interact",
        "camera": "normal",
        "diagram": "tick_budget"
    },
    {
        "id": "c2_p03_drift",
        "file": "cap2_p03_drift.mp3",
        "title": "DEUDA COMPUTACIONAL & TICK DRIFT",
        "subtitle": "Colapso del tiempo versus estabilidad en producción",
        "badge": "03 // TARGET: 20.00 TPS CONSTANT",
        "spoken_text": (
            "Si la lógica de un bloque o una tubería excede esa ventana por un milisegundo, el servidor acumula deuda computacional. "
            "Si la deuda se sostiene, el tiempo colapsa en el infame tick drift. "
            "Lo que están viendo en pantalla no es una partida casual; es una prueba de estrés de sistemas distribuidos y concurrencia ejecutándose en producción."
        ),
        "text": (
            "Si un bloque excede la ventana, se acumula deuda computacional y ocurre tick drift. "
            "Esto no es una partida casual: es una prueba de estrés de sistemas distribuidos y concurrencia en producción."
        ),
        "action": "walk",
        "camera": "wide",
        "diagram": "spark_histogram"
    },
    {
        "id": "c2_p04_operador",
        "file": "cap2_p04_operador.mp3",
        "title": "EL OPERADOR: INGENIERÍA DE DÍA",
        "subtitle": "Infraestructura física, redes y switches institucionales",
        "badge": "04 // OPERADOR: JACK · SYSADMIN & SRE",
        "spoken_text": (
            "Mi nombre es Jack. De lunes a viernes, durante el día, mi trabajo consiste en administrar la infraestructura física, "
            "switches gestionables, servidores hipervisores y las plataformas de red institucional para una entidad educativa con cientos de usuarios concurrentes."
        ),
        "text": (
            "Soy Jack. De día administro infraestructura física, switches gestionables, "
            "servidores hipervisores y redes institucionales para cientos de usuarios concurrentes."
        ),
        "action": "desk",
        "camera": "close",
        "diagram": "network_topology"
    },
    {
        "id": "c2_p05_disciplina",
        "file": "cap2_p05_disciplina.mp3",
        "title": "DISCIPLINA OPERATIVA SRE",
        "subtitle": "Trazabilidad de incidentes y repositorio Maven propio",
        "badge": "05 // ARTIFACT: maven.drakescraft.cl",
        "spoken_text": (
            "Esa misma disciplina operativa, la que exige trazabilidad de incidentes, políticas de respaldo consistentes y redundancia ante fallos, "
            "es la que aplico cuando termina mi jornada laboral. Por las noches no entro a jugar; entro a construir, auditar y operar software."
        ),
        "text": (
            "Esa disciplina que exige trazabilidad de incidentes, respaldos atómicos y redundancia ante fallos "
            "la aplico por las noches: repositorio Maven propio, compilación Java y operaciones SRE."
        ),
        "action": "interact",
        "camera": "normal",
        "diagram": "maven_pipeline"
    },
    {
        "id": "c2_p06_testbed",
        "file": "cap2_p06_testbed.mp3",
        "title": "UN BANCO DE PRUEBAS DE INGENIERÍA",
        "subtitle": "Dockerización y exploración de límites de la JVM",
        "badge": "06 // OPERATIONAL: CONTAINERIZED STACKS",
        "spoken_text": (
            "Para mí, DrakesCraft nunca fue pensado como una red comercial con microtransacciones. "
            "Fue concebido desde el primer día como un banco de pruebas de ingeniería de software para explorar los límites reales del ecosistema de la máquina virtual de Java bajo condiciones extremas."
        ),
        "text": (
            "DrakesCraft no es una red comercial de minijuegos. "
            "Es un banco de pruebas de ingeniería de software para explorar los límites reales de la JVM bajo condiciones extremas."
        ),
        "action": "idle",
        "camera": "normal",
        "diagram": "docker_stacks"
    },
    {
        "id": "c2_p07_slimefun",
        "file": "cap2_p07_slimefun.mp3",
        "title": "EL SUBSISTEMA SLIMEFUN 4",
        "subtitle": "Lógica por bloque procesada enteramente en el servidor",
        "badge": "07 // SUBSYSTEM: SLIMEFUN 4 RUNTIME",
        "spoken_text": (
            "Dentro del ecosistema existe un marco de trabajo llamado Slimefun. "
            "Slimefun añade capas de tecnología industrial, redes de transporte de energía y almacenamiento digital sin exigirle al cliente que instale mods externos: todo se procesa en el servidor."
        ),
        "text": (
            "Slimefun introduce tecnología industrial, redes energéticas y almacenamiento digital "
            "sin requerir mods externos en el cliente: todo se procesa íntegramente en el servidor."
        ),
        "action": "walk",
        "camera": "wide",
        "diagram": "slimefun_energy"
    },
    {
        "id": "c2_p08_ruptura",
        "file": "cap2_p08_ruptura.mp3",
        "title": "EL PUNTO DE RUPTURA EN 1.21.x",
        "subtitle": "Sobrecarga de metadatos persistentes y Garbage Collection",
        "badge": "08 // BREAKING POINT: GC OVERHEAD",
        "spoken_text": (
            "Sin embargo, en las comunidades técnicas de servidores, Slimefun en versiones modernas como la uno punto veintiuno tiene una reputación conocida: es considerado inviable. "
            "La sobrecarga de miles de bloques consultando metadatos persistentes en cada tick suele saturar el recolector de basura tradicional, degradando el servidor en cuestión de horas. "
            "La respuesta habitual de muchos administradores es rendirse: congelar el servidor en versiones antiguas de hace años o desactivar la mitad de las máquinas."
        ),
        "text": (
            "En versiones 1.21.x, Slimefun se consideraba inviable: miles de bloques consultando "
            "metadatos por tick saturan el Garbage Collector en horas. "
            "Muchos optan por rendirse o congelar versiones antiguas. Nosotros fuimos al fondo."
        ),
        "action": "interact",
        "camera": "normal",
        "diagram": "gc_pause_graph"
    },
    {
        "id": "c2_p09_addons",
        "file": "cap2_p09_addons.mp3",
        "title": "80+ ADDONS SIMULTÁNEOS ACTIVOS",
        "subtitle": "Logística, química, energía y computación espacial",
        "badge": "09 // RUNTIME: 84 CONCURRENT ADDONS",
        "spoken_text": (
            "Nosotros decidimos tomar el camino de la ingeniería. Llevamos el entorno a Minecraft uno punto veintiuno punto once integrando más de ochenta addons simultáneos y activos: "
            "desde logística de redes masivas hasta química avanzada y computación espacial. No se logró con suerte, sino aplicando perfilado estricto."
        ),
        "text": (
            "Adaptamos el ecosistema a 1.21.11 con más de 80 addons simultáneos y concurrentes: "
            "redes logísticas masivas, química avanzada y módulos espaciales, sostenidos con profiling estricto."
        ),
        "action": "interact",
        "camera": "normal",
        "diagram": "addon_matrix"
    },
    {
        "id": "c2_p10_tuning",
        "file": "cap2_p10_tuning.mp3",
        "title": "TUNING JVM: ZGC GENERACIONAL",
        "subtitle": "Latencia menor a 1 ms y memoria off-heap",
        "badge": "10 // TUNING: GENERATIONAL ZGC",
        "spoken_text": (
            "Configuramos recolección de basura generacional de ultra-baja latencia para mitigar pausas en el hilo de cómputo, "
            "reescribimos listeners de eventos conflictivos y reubicamos accesos de almacenamiento a estructuras concurrentes en memoria. El resultado es estabilidad matemática constante."
        ),
        "text": (
            "ZGC generacional de ultra-baja latencia (<1ms de pausa), reescritura de listeners conflictivos "
            "y estructuras concurrentes off-heap en memoria: estabilidad matemática constante."
        ),
        "action": "desk",
        "camera": "close",
        "diagram": "zgc_telemetry"
    },
    {
        "id": "c2_p11_topologia",
        "file": "cap2_p11_topologia.mp3",
        "title": "TOPOLOGÍA DISTRIBUIDA",
        "subtitle": "Nodo de cómputo en Dallas interconectado con Linux Central",
        "badge": "11 // TOPOLOGY: DALLAS <--> CENTRAL",
        "spoken_text": (
            "Para sostener este nivel de carga sin intervención constante, la arquitectura no descansa en una sola máquina aislada. "
            "Separamos responsabilidades de forma estricta entre nodos especializados."
        ),
        "text": (
            "Separación estricta de responsabilidades: nodo de cómputo en Dallas "
            "para el tick loop puro, interconectado a nuestro servidor central Linux."
        ),
        "action": "walk",
        "camera": "wide",
        "diagram": "distributed_arch"
    },
    {
        "id": "c2_p12_saori",
        "file": "cap2_p12_saori.mp3",
        "title": "AGENTE CENTINELA SRE (SAORI)",
        "subtitle": "Auditoría de sockets y mitigación autónoma de incidentes",
        "badge": "12 // SENTINEL: SRE DAEMON",
        "spoken_text": (
            "En el nodo de Dallas corre la instancia pura de juego, aislada para maximizar el rendimiento por núcleo. "
            "En nuestro servidor central Linux orquestamos los microservicios, bases de datos transaccionales y un agente centinela S-R-E llamado SAORI. "
            "Este daemon monitorea el socket, valida la consistencia de memoria y, si detecta una anomalía de concurrencia, ejecuta mitigaciones forenses sin necesidad de una intervención manual de madrugada."
        ),
        "text": (
            "Instancia de juego aislada en Dallas por núcleo. "
            "En Linux central: bases de datos WAL y el daemon centinela SAORI, auditando sockets y mitigando anomalías automáticamente 24/7."
        ),
        "action": "interact",
        "camera": "normal",
        "diagram": "sentinel_flow"
    },
    {
        "id": "c2_p13_wal",
        "file": "cap2_p13_wal.mp3",
        "title": "POLÍTICA DE PERSISTENCIA ATÓMICA",
        "subtitle": "Bases de datos WAL y cero pérdida de inventarios",
        "badge": "13 // STORAGE: ATOMIC WAL BACKUPS",
        "spoken_text": (
            "Nuestra política fundamental es la preservación absoluta del progreso. "
            "Un jugador puede invertir doscientas horas diseñando una refinería automatizada: el sistema trata su inventario y sus chunks como transacciones financieras. No toleramos rollbacks arbitrarios ni desastres de corrupción."
        ),
        "text": (
            "Preservación absoluta del progreso: inventarios y fábricas auditados "
            "como transacciones financieras con Write-Ahead Logging (WAL). Cero tolerancia a rollbacks."
        ),
        "action": "idle",
        "camera": "close",
        "diagram": "wal_storage"
    },
    {
        "id": "c2_p14_crossplay",
        "file": "cap2_p14_crossplay.mp3",
        "title": "INTEROPERABILIDAD JAVA & BEDROCK",
        "subtitle": "Puerto unificado 25565 con traducción binaria en caliente",
        "badge": "14 // PROTOCOL: JAVA & BEDROCK UNIFIED",
        "spoken_text": (
            "Además, eliminamos barreras de entrada mediante interoperabilidad completa de red. "
            "Usuarios en Java Edition y en Bedrock Edition ingresan al mismo espacio y operan las mismas máquinas a través del puerto estándar veinticinco quinientos sesenta y cinco, sin configuraciones complejas."
        ),
        "text": (
            "Interoperabilidad total: Java y Bedrock unificados en el puerto 25565. "
            "Traducción binaria de paquetes en caliente para jugar en PC, consolas o móviles sin clientes modificados."
        ),
        "action": "walk",
        "camera": "wide",
        "diagram": "crossplay_protocol"
    },
    {
        "id": "c2_p15_vision",
        "file": "cap2_p15_vision.mp3",
        "title": "HOJA DE RUTA & TEMPORADA 2",
        "subtitle": "Calibración empírica proyectada hacia mediados de 2027",
        "badge": "15 // CONNECT: play.drakescraft.cl",
        "spoken_text": (
            "DrakesCraft es el laboratorio donde documentamos lo que ocurre cuando la infraestructura de misión crítica se encuentra con un entorno de simulación persistente. "
            "Todo lo que tenemos desplegado hoy es la base de calibración para nuestra Temporada Dos, proyectada hacia mediados de dos mil veintisiete."
        ),
        "text": (
            "DrakesCraft es el laboratorio de encuentro entre infraestructura crítica y simulación persistente. "
            "Todo lo desplegado hoy es la base de calibración para la Temporada 2 (mediados de 2027)."
        ),
        "action": "desk",
        "camera": "normal",
        "diagram": "roadmap_timeline"
    },
    {
        "id": "c2_p16_outro",
        "file": "cap2_p16_outro.mp3",
        "title": "BIENVENIDOS AL LABORATORIO",
        "subtitle": "Transmisión concluida · Documentación técnica abierta",
        "badge": "16 // STATUS: END TRANSMISSION",
        "spoken_text": (
            "En los próximos capítulos analizaremos a fondo el código fuente, las matrices de compatibilidad de los addons y el diseño de los pipelines que mantienen este sistema funcionando. "
            "Si valoran los sistemas bien diseñados, bienvenidos al laboratorio."
        ),
        "text": (
            "En próximos episodios analizaremos el código de los plugins, matrices de compatibilidad y pipelines. "
            "Conéctate en play.drakescraft.cl:25565. Bienvenidos al laboratorio."
        ),
        "action": "interact",
        "camera": "close",
        "diagram": "final_card"
    }
]

async def main():
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    results = []
    total_duration = 0.0
    
    print("=" * 70)
    print("GENERANDO AUDIO Y SUBTÍTULOS SINCRONIZADOS PARA CAPÍTULO 2 (VERSIÓN EXTENDIDA)")
    print("=" * 70)
    
    for sec in SECTIONS:
        out_file = AUDIO_DIR / sec["file"]
        print(f"\n[+] Generando {sec['id']} ({sec['title']})...")
        spoken = sec["spoken_text"]
        res = await generate_speech(spoken, out_file, voice="es-CL-LorenzoNeural", rate="+2%")
        print(f"    -> Duración: {res['duration']:.2f}s | Palabras sincronizadas: {len(res['words'])}")
        
        sec_data = {
            "id": sec["id"],
            "title": sec["title"],
            "subtitle": sec["subtitle"],
            "badge": sec["badge"],
            "text": sec["text"],
            "spoken_text": sec["spoken_text"],
            "file": sec["file"],
            "action": sec["action"],
            "camera": sec["camera"],
            "diagram": sec["diagram"],
            "duration": res["duration"],
            "words": res["words"]
        }
        results.append(sec_data)
        total_duration += res["duration"]
        
    print(f"\n[OK] Duración total del Capítulo 2: {total_duration:.2f}s (~{total_duration/60:.2f} minutos)")
    
    with open(JSON_OUT, "w", encoding="utf-8") as f:
        json.dump({"sections": results, "total_duration": total_duration}, f, indent=2, ensure_ascii=False)
        
    print(f"[OK] Storyboard guardado en: {JSON_OUT}")

if __name__ == "__main__":
    asyncio.run(main())
