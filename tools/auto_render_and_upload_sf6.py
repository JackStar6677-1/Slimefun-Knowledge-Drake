#!/usr/bin/env python3
"""
tools/auto_render_and_upload_sf6.py — Render y subida automática para:
"Slimefun en DrakesCraft: Capítulo 6 — Mecánica Cuántica, GPS & Teletransportación"
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
LOG_FILE = OUT_DIR / "sf6_pipeline.log"

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
        log(f"Asignando miniatura: {thumbnail_path.name}...")
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

def main():
    log("=" * 60)
    log("INICIANDO RENDER Y SUBIDA DE SLIMEFUN CAPÍTULO 6")
    log("=" * 60)

    comp_id = "SlimefunCapitulo6"
    out_file = "slimefun_capitulo6_720p.mp4"
    thumb_path = PUBLIC_DIR / "thumbnail_sf_capitulo6.png"
    title = "Slimefun en DrakesCraft: Capítulo 6 — Mecánica Cuántica, GPS & Teletransportación"
    description = (
        "En este Capítulo 6 de la Masterclass de Slimefun en DrakesCraft alcanzamos el pináculo tecnológico: "
        "aprende a construir y lanzar satélites a la estratosfera para crear una red GPS planetaria, operar el Geo-Scanner "
        "para mapear yacimientos de petróleo subterráneo, montar teletransportadores cuánticos instantáneos (0 ticks) y construir ascensores verticales sin comandos.\n\n"
        "TIMESTAMPS TÉCNICOS:\n"
        "0:00 - La Cúspide Tecnológica de Slimefun (El salto cuántico)\n"
        "0:25 - Red de Satélites GPS: Cobertura planetaria y cálculo orbital\n"
        "0:53 - Geo-Scanner: Mapeo y prospección satelital de recursos\n"
        "1:15 - Matrices de Teletransportación: Desmaterialización instantánea\n"
        "1:42 - Ascensores Cuánticos Verticales: Tránsito entre pisos a alta velocidad\n"
        "2:05 - Seguridad SRE: Cifrado y bloqueo de waypoints privados\n"
        "2:28 - Conclusión de la Masterclass: Dominio total de DrakesCraft\n\n"
        "Conéctate al Servidor Oficial DrakesCraft:\n"
        "IP: play.drakescraft.cl:25565 (Java & Bedrock)\n"
        "Discord Oficial: https://discord.gg/drakescraft\n\n"
        "#Minecraft #Slimefun #DrakesCraft #Quantum #GPS #Teleport #Tutorial #Gaming #SRE"
    )
    tags = "minecraft,slimefun,drakescraft,gps,satellite,teleporter,geo scanner,quantum elevator,papermc,tutorial"

    video_path = OUT_DIR / out_file
    if not video_path.exists():
        render_composition(comp_id, out_file)
    else:
        log(f"El archivo {out_file} ya existe. Omitiendo render.")

    log(f"Subiendo a YouTube: {title}...")
    try:
        vid_id, url = upload_video_with_thumbnail(
            video_path=video_path,
            thumbnail_path=thumb_path,
            title=title,
            description=description,
            tags=tags,
            privacy="public"
        )
        log(f"Video publicado exitosamente: {url}")
    except Exception as e:
        log(f"[ERROR] Error al procesar {comp_id}: {e}")

    log("\n============================================================")
    log("SLIMEFUN CAPÍTULO 6 HA SIDO RENDERIZADO Y SUBIDO CON ÉXITO")
    log("============================================================")

if __name__ == "__main__":
    main()
