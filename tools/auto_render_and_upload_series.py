#!/usr/bin/env python3
"""
tools/auto_render_and_upload_series.py — Pipeline de render y subida automática para:
  1. Capítulo 3: El Enjambre Centinela SAORI & Resiliencia en Tiempo Real
  2. Capítulo 4: Código Propio & Cero Rollbacks: El Fin de la Era de Pruebas
  3. Slimefun Capítulo 1: La Guía Maestra, Multibloques & Comandos Iniciales
"""
import os
import sys
import time
import subprocess
import pathlib
import pickle
from datetime import datetime

# UTF-8 para stdout y stderr
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

from google.auth.transport.requests import Request
import googleapiclient.discovery
from googleapiclient.http import MediaFileUpload

ROOT = pathlib.Path(__file__).resolve().parent.parent
VIDEO_DIR = ROOT / "video"
OUT_DIR = VIDEO_DIR / "out"
PUBLIC_DIR = VIDEO_DIR / "public"
TOKEN_PATH = ROOT / "tools" / "token.pickle"
LOG_FILE = OUT_DIR / "series_pipeline.log"

def log(msg):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {msg}"
    try:
        print(line)
    except Exception:
        print(line.encode("ascii", "replace").decode("ascii"))
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(line + "\n")

def get_authenticated_service():
    if not TOKEN_PATH.exists():
        raise FileNotFoundError(f"OAuth token no encontrado en {TOKEN_PATH}")
    with open(TOKEN_PATH, "rb") as f:
        credentials = pickle.load(f)
    if credentials.expired and credentials.refresh_token:
        log("[OAuth] Token expirado, renovando...")
        credentials.refresh(Request())
        with open(TOKEN_PATH, "wb") as f:
            pickle.dump(credentials, f)
        log("[OAuth] Token renovado exitosamente.")
    return googleapiclient.discovery.build("youtube", "v3", credentials=credentials)

def upload_video_with_thumbnail(video_path, thumbnail_path, title, description, tags, privacy="public", category_id="20"):
    video_path = pathlib.Path(video_path)
    if not video_path.is_file():
        raise FileNotFoundError(f"Archivo de video no encontrado: {video_path}")

    # Sanitizar descripción para evitar HttpError 400 por corchetes angulares
    clean_desc = description.replace("<", "sub-").replace(">", "")

    youtube = get_authenticated_service()

    body = {
        "snippet": {
            "title": title[:100],
            "description": clean_desc[:5000],
            "tags": [t.strip() for t in tags.split(",") if t.strip()],
            "categoryId": str(category_id)
        },
        "status": {
            "privacyStatus": privacy,
            "selfDeclaredMadeForKids": False
        }
    }

    media = MediaFileUpload(
        str(video_path),
        mimetype="video/mp4",
        resumable=True,
        chunksize=1024 * 1024 * 4
    )

    log(f"Iniciando subida de video: {video_path.name}")
    log(f"  Título: {title}")
    log(f"  Privacidad: {privacy}")

    insert_request = youtube.videos().insert(
        part="snippet,status",
        body=body,
        media_body=media
    )

    response = None
    while response is None:
        status, response = insert_request.next_chunk()
        if status:
            pct = int(status.progress() * 100)
            log(f"  Progreso de subida: {pct}%")

    video_id = response.get("id")
    video_url = f"https://youtu.be/{video_id}"
    log(f"[OK] Video subido exitosamente: {video_url}")

    # Subir miniatura si existe
    if thumbnail_path and pathlib.Path(thumbnail_path).is_file():
        log(f"Asignando miniatura personalizada: {thumbnail_path.name}...")
        try:
            thumb_media = MediaFileUpload(str(thumbnail_path), mimetype="image/png")
            youtube.thumbnails().set(videoId=video_id, media_body=thumb_media).execute()
            log("[OK] Miniatura asignada exitosamente.")
        except Exception as e:
            log(f"[WARN] No se pudo asignar miniatura: {e}")

    return video_id, video_url

def render_composition(comp_id, out_file):
    out_path = OUT_DIR / out_file
    log(f"Iniciando render Remotion: {comp_id} -> {out_file}...")
    cmd = [
        "npx.cmd", "remotion", "render", comp_id,
        f"out/{out_file}",
        "--concurrency=4"
    ]
    t0 = time.time()
    res = subprocess.run(cmd, cwd=str(VIDEO_DIR), capture_output=True, text=True, shell=True)
    dt = time.time() - t0
    if res.returncode != 0:
        log(f"[ERROR] Error en render de {comp_id} (salida: {res.returncode}):\n{res.stderr[-1000:]}")
        raise RuntimeError(f"Fallo al renderizar {comp_id}")
    log(f"[OK] Render completado en {dt:.1f}s: {out_file} ({out_path.stat().st_size / (1024*1024):.2f} MB)")
    return out_path

QUEUE = [
    {
        "id": "Capitulo3",
        "file": "capitulo3_720p.mp4",
        "thumb": PUBLIC_DIR / "thumbnail_capitulo3.png",
        "title": "Capítulo 3 — El Enjambre Centinela: SAORI & Resiliencia en Tiempo Real",
        "description": (
            "En este Capítulo 3 analizamos la arquitectura de SAORI (Server Autonomous Orchestrator for Resilient Infrastructure).\n\n"
            "0:00 - El Desafío de la Estabilidad 24/7 (Cero reinicios a ciegas)\n"
            "0:18 - Qué es exactamente SAORI: Filosofía y Componentes\n"
            "0:35 - Telemetría de Red en Tiempo Real (Socket raw cada 1000ms en puerto 25565)\n"
            "0:55 - Auditoría Interna de la JVM y memoria off-heap\n"
            "1:13 - Diagnóstico Forense: Thread Dumps automáticos y Spark Profiler\n"
            "1:31 - Interoperabilidad Unificada: Java y Bedrock en el puerto 25565 con Geyser\n"
            "1:48 - Transparencia SRE: Integración y avisos en Discord\n"
            "2:05 - Conclusión: La red está protegida y lista para la ingeniería de código\n\n"
            "Servidor Oficial DrakesCraft:\n"
            "IP: play.drakescraft.cl:25565 (Java & Bedrock)\n"
            "Discord Oficial: https://discord.gg/drakescraft\n"
            "Repositorio Maven: https://maven.drakescraft.cl\n\n"
            "#Minecraft #DrakesCraft #Slimefun #SRE #DevOps #SAORI #Java21 #Linux #Docker"
        ),
        "tags": "minecraft,drakescraft,saori,sre,sysadmin,docker,linux,java 21,slimefun,geyser,floodgate,papermc,purpur"
    },
    {
        "id": "Capitulo4",
        "file": "capitulo4_720p.mp4",
        "thumb": PUBLIC_DIR / "thumbnail_capitulo4.png",
        "title": "Capítulo 4 — Código Propio & Cero Rollbacks: El Fin de la Era de Pruebas",
        "description": (
            "En este Capítulo 4 cerramos la serie de infraestructura técnica explicando nuestra cadena de desarrollo de plugins propios y la garantía inmutable de cero rollbacks.\n\n"
            "0:00 - El Peligro de Depender de Terceros en Producción Masiva\n"
            "0:17 - Repositorio Maven Propio y Pipeline CI/CD sobre Java 21\n"
            "0:36 - Caso de Estudio Forense: El Dupe de Networks v6 y Fluffy Barrels\n"
            "0:58 - La Solución Atómica de Jack: Buffer de Verificación de Escritura\n"
            "1:19 - El Dogma SRE: Cero Pérdida de Datos y Cero Rollbacks\n"
            "1:37 - Los Cimientos Están Completos: El Laboratorio Queda Abierto\n"
            "1:56 - El Verdadero Comienzo: Bienvenidos a Slimefun\n\n"
            "Servidor Oficial DrakesCraft:\n"
            "IP: play.drakescraft.cl:25565 (Java & Bedrock)\n"
            "Discord Oficial: https://discord.gg/drakescraft\n"
            "Repositorio Maven: https://maven.drakescraft.cl\n\n"
            "#Minecraft #DrakesCraft #Slimefun #SRE #Java21 #Maven #Networks #ZeroRollbacks #PaperMC"
        ),
        "tags": "minecraft,drakescraft,networks v6,slimefun,maven,java 21,sre,sysadmin,papermc,purpur,zero rollbacks"
    },
    {
        "id": "SlimefunCapitulo1",
        "file": "slimefun_capitulo1_720p.mp4",
        "thumb": PUBLIC_DIR / "thumbnail_sf_capitulo1.png",
        "title": "Slimefun en DrakesCraft: Capítulo 1 — La Guía Maestra, Multibloques & Comandos Iniciales",
        "description": (
            "¡Bienvenidos al verdadero Capítulo 1 de Slimefun en DrakesCraft! En esta masterclass técnica aprenderás todo lo necesario para comenzar tu imperio industrial desde cero sin mods en el cliente.\n\n"
            "TIMESTAMPS TÉCNICOS:\n"
            "0:00 - Bienvenida a DrakesCraft y Conexión (Java & Bedrock en puerto 25565)\n"
            "0:19 - Comandos de Inicio: /rtp para mundo salvaje seguro, /sethome y /home\n"
            "0:40 - Protección de Terreno (/ps): Cómo colocar tu ProtectionStone y blindar tu base\n"
            "1:04 - Warps Comunitarios (/pwarp): Acceso a granjas de XP públicas para subir a nivel 30\n"
            "1:23 - La Guía Maestra de Slimefun (/sf guide) y navegación por categorías\n"
            "1:44 - El Sistema de Investigaciones (Research): Desbloqueando tecnología con niveles de XP\n"
            "2:05 - Cómo Leer una Ficha de Receta: Matriz 3x3, componentes y máquina requerida\n"
            "2:24 - Qué es un Multibloque en Slimefun: Estructuras físicas en el mundo real\n"
            "2:44 - Multibloque 1: Mesa de Trabajo Mejorada (Enhanced Crafting Table)\n"
            "3:09 - Multibloque 2: Trituradora (Grind Stone) para harina, huesos y polvos\n"
            "3:30 - Multibloque 3: Forja de Armaduras (Armor Forge) y acero de Damasco\n"
            "3:49 - Multibloque 4: Triturador de Minerales (Ore Crusher) para duplicar menas\n"
            "4:11 - Multibloque 5: Horno de Fundición (The Smeltery) y aleaciones de bronce\n"
            "4:33 - Multibloques Avanzados: Caldero de Presión (Diamantes) y Mesa Mágica (Runas)\n"
            "4:53 - Tu Hoja de Ruta para la Primera Sesión en DrakesCraft\n\n"
            "Conéctate al Servidor Oficial:\n"
            "IP: play.drakescraft.cl:25565 (Java & Bedrock)\n"
            "Discord Oficial: https://discord.gg/drakescraft\n\n"
            "#Minecraft #Slimefun #DrakesCraft #Tutorial #Guia #Multibloques #Minecraft121 #Gaming"
        ),
        "tags": "minecraft,slimefun,drakescraft,guia slimefun,multibloques,enhanced crafting table,grindstone,smeltery,protectionstones,pwarp,papermc"
    }
]

def main():
    log("=" * 60)
    log("INICIANDO PIPELINE DE RENDER Y SUBIDA DE LA SERIE TÉCNICA")
    log("=" * 60)

    for item in QUEUE:
        log(f"\n>>> Procesando {item['id']} <<<")
        video_path = OUT_DIR / item["file"]

        # 1. Renderizar si no existe
        if not video_path.exists():
            render_composition(item["id"], item["file"])
        else:
            log(f"El archivo {item['file']} ya existe. Omitiendo render.")

        # 2. Subir a YouTube
        log(f"Subiendo a YouTube: {item['title']}...")
        try:
            vid_id, url = upload_video_with_thumbnail(
                video_path=video_path,
                thumbnail_path=item["thumb"],
                title=item["title"],
                description=item["description"],
                tags=item["tags"],
                privacy="public"
            )
            log(f"Video publicado exitosamente: {url}")
        except Exception as e:
            log(f"[ERROR] Error al procesar {item['id']}: {e}")

        # Pequeña pausa de estabilización entre videos
        time.sleep(15)

    log("\n============================================================")
    log("TODOS LOS VIDEOS DE LA SERIE HAN SIDO RENDERIZADOS Y SUBIDOS")
    log("============================================================")

if __name__ == "__main__":
    main()
