#!/usr/bin/env python3
"""
tools/auto_render_and_upload_shorts_pair3.py — Pipeline de render y subida automática para la cuarta pareja de Shorts:
  - Short 9 (ShortSfReactorSafety - ES): ¿Cómo Evitar que tu Reactor Explote en Slimefun? (1,200 J/s)
  - Short 10 (ShortSfMemoryPointers - EN): Why Memory Pointers Beat Entities in Minecraft Slimefun
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
TOKEN_PATH = ROOT / "tools" / "token.pickle"
LOG_FILE = OUT_DIR / "sf_shorts_pair3_pipeline.log"

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
        raise FileNotFoundError(f"OAuth token not found at {TOKEN_PATH}")
    with open(TOKEN_PATH, "rb") as f:
        credentials = pickle.load(f)
    if credentials.expired and credentials.refresh_token:
        log("[OAuth] Token expirado, renovando...")
        credentials.refresh(Request())
        with open(TOKEN_PATH, "wb") as f:
            pickle.dump(credentials, f)
        log("[OAuth] Token renovado exitosamente.")
    return googleapiclient.discovery.build("youtube", "v3", credentials=credentials)

def upload_short(file_path, title, description, tags, privacy="public", category_id="20"):
    file_path = pathlib.Path(file_path)
    if not file_path.is_file():
        raise FileNotFoundError(f"Archivo de video no encontrado: {file_path}")

    if "#Shorts" not in title and "#shorts" not in title:
        title = f"{title} #Shorts"
    if "#Shorts" not in description and "#shorts" not in description:
        description = f"{description}\n\n#Shorts #Minecraft #Slimefun #DrakesCraft"

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
        str(file_path),
        mimetype="video/mp4",
        resumable=True,
        chunksize=1024 * 1024 * 2
    )

    log(f"Iniciando subida de Short: {file_path.name}")
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
    video_url = f"https://youtube.com/shorts/{video_id}"
    log(f"[OK] Short subido exitosamente: {video_url}")
    return video_id, video_url

def render_short(comp_id, out_file):
    out_path = OUT_DIR / out_file
    log(f"Iniciando render de {comp_id} -> {out_file}...")
    cmd = [
        "npx.cmd", "remotion", "render", comp_id,
        f"out/{out_file}",
        "--concurrency=4"
    ]
    t0 = time.time()
    res = subprocess.run(cmd, cwd=str(VIDEO_DIR), capture_output=True, text=True, shell=True)
    dt = time.time() - t0
    if res.returncode != 0:
        log(f"[ERROR] Error en render de {comp_id} (codigo {res.returncode}):\n{res.stderr[-1000:]}")
        raise RuntimeError(f"Fallo al renderizar {comp_id}")
    log(f"[OK] Render completado en {dt:.1f}s: {out_file} ({out_path.stat().st_size / (1024*1024):.2f} MB)")
    return out_path

SHORTS_QUEUE = [
    {
        "comp_id": "ShortSfReactorSafety",
        "out_file": "short_sf_reactor_safety.mp4",
        "lang": "ES",
        "title": "¿Cómo Evitar que tu Reactor Explote en Slimefun? (1,200 J/s)",
        "description": (
            "¿Quieres generar 1,200 Joules por segundo con un reactor nuclear en Slimefun sin volar tu base en pedazos?\n\n"
            "1. Cero Rutas Únicas: Jamás dependas de una sola línea de refrigerante.\n"
            "2. Redundancia N+1: Configura 2 Cargo Nodes independientes desde contenedores separados.\n"
            "3. Monitoreo Inteligente: Si un buffer baja, Saori te notifica en Discord antes del colapso térmico.\n\n"
            "Servidor Oficial DrakesCraft:\n"
            "IP: play.drakescraft.cl:25565 (Java & Bedrock)\n"
            "Discord Oficial: https://discord.gg/drakescraft"
        ),
        "tags": "minecraft,slimefun,drakescraft,reactor nuclear,meltdown,seguridad,coolant,sre,tutorial,shorts"
    },
    {
        "comp_id": "ShortSfMemoryPointers",
        "out_file": "short_sf_memory_pointers.mp4",
        "lang": "EN",
        "title": "Why Memory Pointers Beat Entities in Minecraft Slimefun",
        "description": (
            "Here is why custom inventory plugins like Networks v6 and Fluffy Barrels beat vanilla entities every single time:\n\n"
            "1. Vanilla Limitations: Tile-entity listeners and item drop physics destroy server ticks.\n"
            "2. JVM Direct Memory Pointers: Items update as RAM address references without spawning entities.\n"
            "3. Flawless 20.0 TPS: Millions of items transferred with zero lag on DrakesCraft.\n\n"
            "Official Server:\n"
            "IP: play.drakescraft.cl:25565 (Java & Bedrock)\n"
            "Discord Oficial: https://discord.gg/drakescraft"
        ),
        "tags": "minecraft,slimefun,drakescraft,jvm,ram,pointers,networks,fluffy barrels,sre,tps,shorts"
    }
]

def main():
    log("=" * 60)
    log("INICIANDO PIPELINE DE SHORTS 9 & 10 SLIMEFUN (ES & EN)")
    log("=" * 60)

    for idx, item in enumerate(SHORTS_QUEUE):
        short_num = idx + 9
        log(f"\n--- Procesando Short {short_num} [{item['lang']}]: {item['title']} ---")
        out_file = item["out_file"]
        comp_id = item["comp_id"]
        video_path = OUT_DIR / out_file

        if not video_path.exists():
            render_short(comp_id, out_file)
        else:
            log(f"El archivo {out_file} ya existe. Omitiendo render.")

        log(f"Subiendo a YouTube: {item['title']}...")
        try:
            vid_id, url = upload_short(
                file_path=video_path,
                title=item["title"],
                description=item["description"],
                tags=item["tags"],
                privacy="public"
            )
            log(f"[OK] Short {short_num} publicado: {url}")
        except Exception as e:
            log(f"[ERROR] Error al subir Short {short_num}: {e}")

    log("\n============================================================")
    log("PIPELINE DE SHORTS 9 & 10 COMPLETADO CON EXITO")
    log("============================================================")

if __name__ == "__main__":
    main()
