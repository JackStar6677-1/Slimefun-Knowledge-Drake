#!/usr/bin/env python3
"""
gen_capitulo1_audio.py — Generador de locución TTS y subtítulos sincronizados para el Capítulo 1.
Voz: es-CL-LorenzoNeural (Jack, Sysadmin & Dueño de DrakesCraft).
Pacing: natural, pausado, con fonética cuidada al milímetro para términos técnicos.
"""

import asyncio
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from voice_engine import generate_speech

AUDIO_DIR = ROOT / "video" / "public" / "audio"
JSON_OUT = ROOT / "video" / "src" / "capitulo1-storyboard.json"

SECTIONS = [
    {
        "id": "bloque1_mito",
        "file": "cap1_b1_mito.mp3",
        "title": "EL MITO DEL JUEGO DE BLOQUES",
        "subtitle": "Cómputo en tiempo real y presupuesto por tick",
        "spoken_text": (
            "A nivel de superficie, Minecraft suele catalogarse como un simple juego de gestión de bloques. "
            "Pero desde la perspectiva de la computación, el modelo cambia drásticamente. "
            "El motor del juego corre sobre un bucle estricto de veinte ciclos por segundo. "
            "Eso significa que el hilo principal tiene una ventana inflexible de sólo cincuenta milisegundos "
            "para evaluar la física, el movimiento de entidades, las máquinas y las transacciones de estado de cada jugador. "
            "Si la lógica de un bloque o una tubería excede esa ventana, el servidor acumula retraso. "
            "Lo que ven aquí no es una partida casual; es una prueba de estrés de sistemas distribuidos y concurrencia en producción."
        ),
        "text": (
            "A nivel de superficie, Minecraft suele catalogarse como un simple juego de bloques. "
            "Pero computacionalmente el modelo es implacable: corre sobre un bucle de 20 ciclos por segundo, "
            "con un presupuesto estricto de 50 milisegundos por tick para evaluar física, entidades y máquinas. "
            "Si la lógica excede esa ventana, el tiempo colapsa. Esto es una prueba de estrés de sistemas en producción."
        ),
        "badge": "01 // PRESUPUESTO DE TICK: 50.0 MS"
    },
    {
        "id": "bloque2_operador",
        "file": "cap1_b2_operador.mp3",
        "title": "EL OPERADOR: INGENIERÍA Y DISCIPLINA",
        "subtitle": "Infraestructura física de día, laboratorio de noche",
        "spoken_text": (
            "Mi nombre es Jack, dueño de DrakesCraft. De lunes a viernes, durante el día, "
            "mi trabajo consiste en administrar la infraestructura física, switches gestionables, "
            "servidores y plataformas de red institucional para cientos de usuarios en una entidad educativa. "
            "Esa misma disciplina operativa, la que exige trazabilidad de incidentes, "
            "respaldos atómicos y redundancia ante fallos, es la que aplico por las noches. "
            "Contamos con compilación propia de plugins en Java, repositorio Maven dedicado "
            "y orquestación de contenedores en Docker. DrakesCraft fue concebido como un banco de pruebas de ingeniería de software."
        ),
        "text": (
            "Soy Jack, dueño de DrakesCraft. De día, administro infraestructura física, redes, switches "
            "y servidores institucionales para cientos de usuarios en una entidad educativa. "
            "Por las noches, aplico esa misma disciplina SRE: compilación Java propia, repositorio Maven dedicado, "
            "contenedores Docker y trazabilidad de incidentes. Un banco de pruebas de ingeniería de software."
        ),
        "badge": "02 // OPERADOR: JACK · SYSADMIN & SRE"
    },
    {
        "id": "bloque3_slimefun",
        "file": "cap1_b3_slimefun.mp3",
        "title": "EL RETO SLIMEFUN EN VERSIONES MODERNAS",
        "subtitle": "Más de 80 expansiones concurrentes en 1.21",
        "spoken_text": (
            "Dentro del ecosistema existe Slimefun, un marco que añade tecnología industrial y redes eléctricas complejas. "
            "En comunidades técnicas, correr Slimefun en versiones modernas como la uno punto veintiuno "
            "se consideraba inviable debido a fugas de memoria y pausas en la recolección de basura. "
            "Muchos administradores se rinden o congelan sus servidores en versiones antiguas. "
            "Nosotros decidimos tomar el camino de la ingeniería: adaptamos el entorno a la versión "
            "uno punto veintiuno punto once, integrando más de ochenta addons activos simultáneos. "
            "Aplicamos tuning fino de Z-G-C generacional de baja latencia y optimización de hilos para sostener veinte T-P-S estables."
        ),
        "text": (
            "Slimefun introduce tecnología industrial y redes eléctricas complejas. "
            "En la versión 1.21 se consideraba inviable por fugas de memoria y sobrecarga de la JVM. "
            "Nosotros adaptamos el entorno a la 1.21.11 con más de 80 addons activos concurrentes, "
            "aplicando tuning fino de ZGC generacional de baja latencia para sostener 20.0 TPS constantes."
        ),
        "badge": "03 // RUNTIME: 84+ ADDONS · ZGC GENERACIONAL"
    },
    {
        "id": "bloque4_arquitectura",
        "file": "cap1_b4_arquitectura.mp3",
        "title": "ARQUITECTURA DE SOPORTE & CENTINELA",
        "subtitle": "Topología distribuida y cero tolerancia a rollbacks",
        "spoken_text": (
            "Para sostener esta carga, separamos responsabilidades en una topología distribuida. "
            "El nodo de cómputo en Dallas procesa la simulación del juego con hardware dedicado. "
            "En nuestro servidor Linux central orquestamos bases de datos transaccionales con registro previo "
            "y un agente centinela S-R-E llamado SAORI, que audita el socket y aplica mitigaciones autónomas. "
            "Nuestra política fundamental es la preservación absoluta del progreso: "
            "tratamos el inventario y las máquinas de cada jugador como transacciones financieras, con cero tolerancia a rollbacks."
        ),
        "text": (
            "Topología distribuida: nodo dedicado en Dallas computando el juego, "
            "y servidor Linux central con bases de datos WAL y el agente centinela SRE SAORI "
            "auditando sockets y recursos 24/7. "
            "Tratamos el inventario de los jugadores como transacciones financieras: cero pérdida de datos."
        ),
        "badge": "04 // CLÚSTER DISTRIBUIDO & AGENTE SRE"
    },
    {
        "id": "bloque5_conclusion",
        "file": "cap1_b5_conclusion.mp3",
        "title": "BIENVENIDOS AL LABORATORIO",
        "subtitle": "Interoperabilidad Java/Bedrock y camino a Temporada 2",
        "spoken_text": (
            "Eliminamos barreras de entrada mediante interoperabilidad completa: "
            "jugadores en Java y en Bedrock comparten el mismo mundo a través del puerto veinticinco quinientos sesenta y cinco. "
            "Pueden ingresar en la dirección eme-ce punto drakescraft punto ce-ele. "
            "Todo lo desplegado hoy sienta las bases para nuestra Temporada Dos, proyectada para mediados de dos mil veintisiete. "
            "En este canal documentaremos el código y las guías de cada máquina. Bienvenidos a DrakesCraft."
        ),
        "text": (
            "Interoperabilidad total: Java y Bedrock unificados en el puerto 25565. "
            "Conéctate en mc.drakescraft.cl. "
            "Este laboratorio sienta las bases para la Temporada 2 a mediados de 2027. "
            "En este canal documentaremos cada sistema. Bienvenidos a DrakesCraft."
        ),
        "badge": "05 // ENLACE: play.drakescraft.cl:25565"
    }
]

async def main():
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    results = []
    total_duration = 0.0
    
    print("=" * 65)
    print("GENERANDO VOCES DE ALTA FIDELIDAD PARA CAPÍTULO 1 (DRAKES DOCU-SERIE)")
    print("=" * 65)
    
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
            "file": sec["file"],
            "duration": res["duration"],
            "words": res["words"]
        }
        results.append(sec_data)
        total_duration += res["duration"]
        
    print(f"\n[OK] Duración total del Capítulo 1: {total_duration:.2f}s (~{total_duration/60:.2f} minutos)")
    
    with open(JSON_OUT, "w", encoding="utf-8") as f:
        json.dump({"sections": results, "total_duration": total_duration}, f, indent=2, ensure_ascii=False)
        
    print(f"[OK] Storyboard guardado en: {JSON_OUT}")

if __name__ == "__main__":
    asyncio.run(main())
