#!/usr/bin/env python3
"""
tools/auto_render_and_upload_sf7.py — Render y subida automática para:
"Slimefun en DrakesCraft: Addons Avanzados, Automatización Infinita & Mitigación de Lag (Cap. 7)"
"""
import os
import sys
import time
import subprocess
import pathlib
import pickle
from datetime import datetime

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
LOG_FILE = OUT_DIR / "sf7_pipeline.log"

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

    if thumbnail_path and pathlib.Path(thumbnail_path).is_file():
        log(f"Asignando miniatura personalizada: {thumbnail_path}")
        try:
            youtube.thumbnails().set(
                videoId=video_id,
                media_body=MediaFileUpload(str(thumbnail_path), mimetype="image/png")
            ).execute()
            log("[OK] Miniatura asignada correctamente.")
        except Exception as e:
            log(f"[WARN] Error al asignar miniatura: {e}")

    return video_url

def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    video_out = OUT_DIR / "slimefun_capitulo7_720p.mp4"
    thumb_path = PUBLIC_DIR / "thumbnail_sf_capitulo7.png"

    log("============================================================")
    log("PIPELINE AUTOMÁTICO: SLIMEFUN CAPÍTULO 7 — ADDONS & REDES v6")
    log("============================================================")

    # 1. Renderizado en Remotion
    cmd = [
        "cmd.exe", "/c",
        "npx", "remotion", "render",
        "SlimefunCapitulo7",
        "out/slimefun_capitulo7_720p.mp4",
        "--gl=angle"
    ]
    log(f"Iniciando render Remotion: {' '.join(cmd)}")
    t0 = time.time()
    res = subprocess.run(cmd, cwd=str(VIDEO_DIR), capture_output=True, text=True)
    dt = time.time() - t0

    if res.returncode != 0:
        log(f"[ERROR] Render falló (código {res.returncode}):")
        log(res.stderr)
        log(res.stdout)
        sys.exit(1)

    log(f"[OK] Render completado en {dt:.1f}s ({dt/60:.2f} min). Archivo: {video_out.name} ({video_out.stat().st_size / (1024*1024):.1f} MB)")

    # 2. Metadatos de YouTube
    title = "Slimefun en DrakesCraft: Addons Avanzados, Automatización Infinita & Mitigación de Lag (Cap. 7)"
    description = """Capítulo 7 de la Guía Oficial de Slimefun en DrakesCraft: Addons Industriales, Automatización Infinita y Mitigación de Lag SRE.

En este capítulo exploramos el verdadero juego tardío técnico de Slimefun:
1. Infinity Expansion: Generadores de Singularidades y Cámaras de Simulación de Mobs sin generar entidades en el mundo.
2. Fluffy Machines: Auto-Crafters Eléctricos y líneas de producción recursiva continua.
3. Redes v6: Almacenamiento digital masivo, mitigación crítica de dupes de barriles y sincronización atómica en memoria.
4. Reglas SRE Anti-Lag: Por qué las tolvas de Minecraft Vanilla ahogan el servidor vs la eficiencia de punteros de Slimefun Cargo y Redes.
5. Comandos de Inicio: /pwarp xp, protección de tierras y la IA autónoma SAORI activa 24/7.

IP del Servidor: play.drakescraft.cl:25565 (Java & Bedrock)
Discord Oficial: https://discord.gg/drakescraft
Infraestructura: Purpur 1.21.11 // 20.0 TPS Estables

#Slimefun #DrakesCraft #Minecraft #InfinityExpansion #FluffyMachines #Networks #MinecraftTecnico #SRE #Gaming #MinecraftServer"""

    tags = "Slimefun, DrakesCraft, Minecraft Slimefun, Infinity Expansion, Fluffy Machines, Networks v6, Slimefun Guia, Minecraft Servidor Tecnico, Minecraft SRE, SAORI, Purpur 1.21, Slimefun Español, Minecraft Automatizacion"

    # 3. Subida a YouTube
    log("Iniciando subida a YouTube...")
    try:
        url = upload_video_with_thumbnail(
            video_path=video_out,
            thumbnail_path=thumb_path,
            title=title,
            description=description,
            tags=tags,
            privacy="public"
        )
        log("============================================================")
        log(f"¡CAPÍTULO 7 PUBLICADO EXITOSAMENTE!")
        log(f"URL: {url}")
        log("============================================================")
    except Exception as e:
        log(f"[ERROR] Subida falló: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
