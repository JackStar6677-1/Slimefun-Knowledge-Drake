#!/usr/bin/env python3
"""
tools/publish_sf_capitulo1.py — Renderiza y publica en YouTube el Capítulo 1 definitivo de Slimefun:
- Texturas pixel art 100% reales de Minecraft en todos los multibloques 3D
- GUI completa de 54 slots y 27 slots de cofres de Slimefun (/sf guide, investigaciones, recetas)
- Flujo de entrada real: /lobby, /modalidades (Slimefun, OneBlock, SkyBlock vs Clásico sin SF)
- Steve escalado a 0.58 con encuadre amplio y más de 45% de margen superior (cero recortes)
- Gestos y kinematics vivos (oratoria, señalamiento, crafteo, asentimiento)
- Miniatura de alto impacto sin texto redundante
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
LOG_FILE = OUT_DIR / "publish_sf1.log"

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

def render_sf1():
    out_mp4 = OUT_DIR / "slimefun_capitulo1_720p.mp4"
    if out_mp4.exists():
        log(f"Eliminando versión anterior de {out_mp4.name} para render limpio...")
        try:
            out_mp4.unlink()
        except Exception as e:
            log(f"Aviso al eliminar: {e}")

    cmd = [
        "npx", "remotion", "render",
        "SlimefunCapitulo1",
        f"out/{out_mp4.name}",
        "--concurrency=4",
        "--gl=angle"
    ]
    log(f"Iniciando render Remotion en GPU RTX 4060: {' '.join(cmd)}")
    t0 = time.time()
    res = subprocess.run(cmd, cwd=str(VIDEO_DIR), shell=True, capture_output=True, text=True, encoding="utf-8")
    dur = time.time() - t0

    if res.returncode != 0:
        log(f"[ERROR] Error durante el render:\n{res.stderr}\n{res.stdout}")
        raise RuntimeError("Fallo el render de Remotion")

    size_mb = out_mp4.stat().st_size / (1024 * 1024)
    log(f"[OK] Render completado con éxito en {dur:.1f}s: {out_mp4.name} ({size_mb:.2f} MB)")
    return out_mp4

def upload_sf1(video_path):
    thumb_path = PUBLIC_DIR / "thumbnail_sf_capitulo1.png"
    title = "Slimefun en DrakesCraft: Capítulo 1 — Guía Maestra, Lobby, Multibloques & Comandos"
    description = (
        "¡Bienvenidos al Capítulo 1 definitivo de la Masterclass de Slimefun en DrakesCraft!\n\n"
        "En esta guía técnica oficial aprenderás paso a paso el flujo de ingreso correcto, las modalidades "
        "con y sin Slimefun, los comandos de supervivencia y la construcción física de los 7 multibloques "
        "iniciales con texturas 100% vanilla.\n\n"
        "TIMESTAMPS TÉCNICOS:\n"
        "0:00 - Bienvenida y Conexión (play.drakescraft.cl:25565 - Java & Bedrock)\n"
        "0:31 - El Lobby (/lobby) y Selector de Servidores (/modalidades)\n"
        "0:59 - Modalidades CON Slimefun (Survival, OneBlock, SkyBlock) vs Clásico (Vanilla Puro)\n"
        "1:27 - Comandos de Supervivencia: /rtp al mundo salvaje, /sethome y /home\n"
        "1:51 - Protección de Terreno (/ps): ProtectionStones para blindar tu base contra robos\n"
        "2:15 - Warps Comunitarios (/pwarp xp): Granjas públicas de XP para costear investigaciones\n"
        "2:34 - La Guía Maestra de Slimefun (/sf guide) y navegación por categorías (GUI de cofre)\n"
        "2:55 - El Sistema de Investigaciones: Árbol tecnológico y costo de niveles de XP\n"
        "3:15 - Cómo Leer una Receta: Matriz 3x3 de ensamblado y máquina requerida\n"
        "3:35 - Qué es un Multibloque en Slimefun: Estructuras físicas en el mundo real\n"
        "3:55 - Multibloque 1: Mesa de Trabajo Mejorada (Enhanced Crafting Table)\n"
        "4:20 - Multibloque 2: Trituradora (Grind Stone) para trigo en harina y polvos\n"
        "4:41 - Multibloque 3: Forja de Armaduras (Armor Forge) y acero de Damasco\n"
        "5:00 - Multibloque 4: Triturador de Minerales (Ore Crusher) para duplicar menas\n"
        "5:22 - Multibloque 5: Horno de Fundición (The Smeltery) y aleaciones pirometalúrgicas\n"
        "5:44 - Multibloques Avanzados: Cámara de Presión 3x3 (Diamantes) y Mesa Mágica 1x3\n"
        "6:04 - Hoja de Ruta para tu Primera Sesión en DrakesCraft\n\n"
        "Conéctate al Servidor Oficial:\n"
        "IP: play.drakescraft.cl:25565 (Java & Bedrock)\n"
        "Discord Oficial: https://discord.gg/drakescraft\n\n"
        "#Minecraft #Slimefun #DrakesCraft #Tutorial #Guia #Multibloques #Minecraft121 #Gaming #Vanilla"
    )
    tags = "minecraft,slimefun,drakescraft,guia slimefun,multibloques,enhanced crafting table,grindstone,smeltery,protectionstones,pwarp,modalidades,lobby,papermc"

    youtube = get_authenticated_service()

    body = {
        "snippet": {
            "title": title[:100],
            "description": description[:5000],
            "tags": [t.strip() for t in tags.split(",") if t.strip()],
            "categoryId": "20" # Gaming
        },
        "status": {
            "privacyStatus": "public",
            "selfDeclaredMadeForKids": False
        }
    }

    media = MediaFileUpload(
        str(video_path),
        mimetype="video/mp4",
        resumable=True,
        chunksize=1024 * 1024 * 4
    )

    log(f"Iniciando subida de video a YouTube: {video_path.name}")
    log(f"  Título: {title}")

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

    video_id = response["id"]
    video_url = f"https://youtu.be/{video_id}"
    log(f"[OK] Video subido exitosamente: {video_url}")

    # Asignar miniatura
    if thumb_path.exists():
        log(f"Asignando miniatura de alto impacto: {thumb_path.name}...")
        try:
            youtube.thumbnails().set(
                videoId=video_id,
                media_body=MediaFileUpload(str(thumb_path), mimetype="image/png")
            ).execute()
            log("[OK] Miniatura asignada exitosamente.")
        except Exception as e:
            log(f"[WARN] Error al asignar miniatura: {e}")

    log(f"Video publicado exitosamente en YouTube: {video_url}")
    return video_id, video_url

def main():
    log("=" * 60)
    log("PUBLICACIÓN DEFINITIVA: SLIMEFUN CAPÍTULO 1")
    log("=" * 60)

    # 1. Renderizar
    mp4_file = render_sf1()

    # 2. Subir
    vid_id, url = upload_sf1(mp4_file)

    log("\n============================================================")
    log(f"PROCESO COMPLETADO EXITOSAMENTE: {url}")
    log("============================================================")

if __name__ == "__main__":
    main()
