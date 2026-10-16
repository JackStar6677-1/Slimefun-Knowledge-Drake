#!/usr/bin/env python3
"""
gen_sf_capitulo6_audio.py — Generador de locución y storyboard para:
"Slimefun en DrakesCraft — Capítulo 6: Mecánica Cuántica, GPS & Teletransportación"
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
JSON_OUT = ROOT / "video" / "src" / "sf-capitulo6-storyboard.json"

SECTIONS = [
    {
        "id": "sf6_p01_intro",
        "file": "sf6_p01_intro.mp3",
        "title": "LA CÚSPIDE TECNOLÓGICA DE SLIMEFUN",
        "subtitle": "De la fisión nuclear a la manipulación cuántica del espacio",
        "badge": "01 // ERA CUÁNTICA: EL PINÁCULO",
        "spoken_text": (
            "Bienvenidos al Capítulo seis de nuestra guía de Slimefun en DrakesCraft. "
            "Has conquistado la energía nuclear y dominas la logística automatizada. "
            "Ahora ingresamos a la cúspide tecnológica de todo el plugin: la categoría de Mecánica Cuántica y GPS. "
            "Hoy aprenderás a poner satélites en órbita, escanear el subsuelo mediante satélites geoestacionarios "
            "y construir redes de teletransportación instantánea para moverte por el mapa en cero segundos."
        ),
        "text": (
            "Bienvenidos al Capítulo 6 de Slimefun en DrakesCraft. "
            "Superada la energía nuclear, ingresamos al pináculo: Mecánica Cuántica y GPS. "
            "Satélites orbitales, teletransportadores cuánticos y geo-escáneres de recursos. "
            "Manipula el hiperespacio y viaja instantáneamente sin comandos."
        ),
        "action": "idle",
        "camera": "close",
        "diagram": "quantum_intro"
    },
    {
        "id": "sf6_p02_gps_network",
        "file": "sf6_p02_gps_network.mp3",
        "title": "RED DE SATÉLITES GPS",
        "subtitle": "Constelación orbital, transmisores y cálculo de cobertura",
        "badge": "02 // INFRAESTRUCTURA: RED GPS",
        "spoken_text": (
            "El corazón de toda la tecnología cuántica es la Red GPS. "
            "Para que un teletransportador o escáner funcione, necesitas cobertura satelital activa. "
            "Los satélites GPS se fabrican con componentes de oro reforzado, circuitos avanzados y paneles solares. "
            "Al lanzarlos con un Transmisor GPS en tu base, se elevan a la estratosfera y añaden puntos de señal orbital. "
            "A mayor complejidad de señal, mayor precisión y rango de teletransporte tendrás en el mundo."
        ),
        "text": (
            "La Red GPS Orbital de DrakesCraft. "
            "Componentes: Circuitos avanzados, oro reforzado y paneles solares. "
            "Transmisor GPS: lanza satélites a la estratosfera para generar señal orbital. "
            "A mayor índice de señal GPS, mayor velocidad y alcance de teletransporte."
        ),
        "action": "point",
        "camera": "mid",
        "diagram": "gps_satellite"
    },
    {
        "id": "sf6_p03_geo_scanner",
        "file": "sf6_p03_geo_scanner.mp3",
        "title": "GEO-SCANNER Y RECURSOS DEL SUBSUELO",
        "subtitle": "Mapeo de yacimientos de petróleo y menas subterráneas",
        "badge": "03 // PROSPECCIÓN: GEO-SCANNER",
        "spoken_text": (
            "Con tu red GPS en línea, puedes operar el Geo-Scanner. "
            "Esta máquina analiza los chunks circundantes en busca de vetas de petróleo subterráneo, "
            "núcleos de hierro enriquecido y yacimientos minerales profundos. "
            "Ya no necesitas picar a ciegas durante horas. "
            "El escáner te entrega las coordenadas exactas para instalar tus Taladros Mineros Automáticos y extraer riqueza en piloto automático."
        ),
        "text": (
            "Geo-Scanner: Prospección Satelital. "
            "Escanea el subsuelo del chunk en busca de petróleo y yacimientos minerales. "
            "Elimina el minado manual a ciegas mediante telemetría satelital precisa. "
            "Coordenadas exactas para desplegar Taladros Mineros Automáticos."
        ),
        "action": "interact",
        "camera": "close",
        "diagram": "geo_scanner"
    },
    {
        "id": "sf6_p04_teleporter",
        "file": "sf6_p04_teleporter.mp3",
        "title": "MATRICES DE TELETRANSPORTACIÓN",
        "subtitle": "Viajes instantáneos entre bases, granjas y minas",
        "badge": "04 // HIPERESPACIO: TELETRANSPORTADORES",
        "spoken_text": (
            "Los Teletransportadores Cuánticos son la obra maestra de la movilidad en Slimefun. "
            "Construidos con obsidiana reforzada, perlas de ender modificadas y un Ancla Cuántica central. "
            "Cada teletransportador se conecta a la red GPS y permite sintonizar destinos específicos mediante waypoints. "
            "Al pararte sobre la plataforma, eres desmaterializado y ensamblado en tu destino de forma instantánea, "
            "sin consumir puntos de experiencia ni depender de permisos de moderación."
        ),
        "text": (
            "Teletransportadores Cuánticos de Slimefun. "
            "Matriz de obsidiana reforzada, perlas de ender cuánticas y anclaje GPS. "
            "Desmaterialización instantánea hacia waypoints sintonizados. "
            "Viajes inmediatos entre bases y macro-granjas sin comandos de servidor."
        ),
        "action": "cheer",
        "camera": "wide",
        "diagram": "teleporter_matrix"
    },
    {
        "id": "sf6_p05_elevators",
        "file": "sf6_p05_elevators.mp3",
        "title": "ASCENSORES CUÁNTICOS VERTICALES",
        "subtitle": "Tránsito veloz entre pisos sin escaleras ni corrientes de agua",
        "badge": "05 // MOVILIDAD VERTICAL: ELEVADORES",
        "spoken_text": (
            "Si tu base industrial tiene múltiples pisos subterráneos o torres verticales, "
            "las escaleras y corrientes de agua son lentas y arruinan la estética. "
            "Los Elevadores Cuánticos de Slimefun resuelven esto a la perfección. "
            "Coloca una placa de elevador en la misma coordenada X y Z en diferentes alturas. "
            "Al saltar subes instantáneamente al piso superior, y al agacharte desciendes suavemente al nivel inferior."
        ),
        "text": (
            "Ascensores Cuánticos Verticales. "
            "Misma coordenada X/Z en diferentes niveles de altura. "
            "Saltar = ascenso instantáneo al siguiente nivel superior. "
            "Agacharse = descenso suave e inmediato sin daño por caída."
        ),
        "action": "point",
        "camera": "mid",
        "diagram": "quantum_elevator"
    },
    {
        "id": "sf6_p06_security",
        "file": "sf6_p06_security.mp3",
        "title": "SEGURIDAD Y PRIVACIDAD DE WAYPOINTS",
        "subtitle": "Protección contra intrusos y cifrado de coordenadas",
        "badge": "06 // SEGURIDAD SRE: ENLACE PRIVADO",
        "spoken_text": (
            "En un servidor survival competitivo como DrakesCraft, la seguridad es prioritaria. "
            "Nunca dejes tus coordenadas cuánticas en modo público si no quieres visitas inesperadas. "
            "Slimefun te permite bloquear teletransportadores para que solo miembros autorizados de tu clan puedan enlazarse. "
            "Combina esto con tus bloques de protección PS para garantizar que tu santuario tecnológico permanezca inexpugnable."
        ),
        "text": (
            "Seguridad y Cifrado de Coordenadas. "
            "Bloqueo de waypoints privados para miembros autorizados del clan. "
            "Integración con bloques de protección /ps get contra intrusos. "
            "Santuario tecnológico 100% blindado contra accesos hostiles."
        ),
        "action": "interact",
        "camera": "close",
        "diagram": "security_encryption"
    },
    {
        "id": "sf6_p07_conclusion",
        "file": "sf6_p07_conclusion.mp3",
        "title": "EL DOMINIO TOTAL DE SLIMEFUN",
        "subtitle": "Conéctate a play.drakescraft.cl y lidera la era industrial",
        "badge": "07 // CONCLUSIÓN Y RED DRAKES",
        "spoken_text": (
            "Has completado la formación tecnológica completa de Slimefun en DrakesCraft. "
            "Desde la humilde mesa mejorada hasta redes de satélites GPS y reactores de fisión a veinte punto cero TPS. "
            "Ahora el límite es tu propia imaginación ingenieril. "
            "Conéctate hoy mismo en play punto drakescraft punto ce ele, "
            "forma tu clan, automatiza tu producción y domina el survival más avanzado. "
            "Nos vemos en el servidor."
        ),
        "text": (
            "Dominio Total de Slimefun en DrakesCraft. "
            "De la Mesa Mejorada a Satélites GPS y Fisión Nuclear a 20.0 TPS. "
            "Construye el imperio industrial definitivo sin mods. "
            "¡Conéctate en play.drakescraft.cl:25565 y únete a la leyenda!"
        ),
        "action": "cheer",
        "camera": "wide",
        "diagram": "master_summary"
    }
]

async def main():
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    print("=" * 60)
    print("GENERANDO AUDIO Y STORYBOARD: SLIMEFUN CAPÍTULO 6")
    print("Mecánica Cuántica, GPS & Teletransportación (DrakesCraft)")
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
    print(f"RESUMEN CAPÍTULO 6: {len(SECTIONS)} escenas | {total_sec:.1f}s ({total_frames} frames)")
    print("=" * 60)

    out_data = {
        "title": "Slimefun en DrakesCraft — Capítulo 6: Mecánica Cuántica, GPS & Teletransportación",
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
