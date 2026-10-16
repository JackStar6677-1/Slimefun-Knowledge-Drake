#!/usr/bin/env python3
"""
tools/auto_render_and_upload_shorts.py — Pipeline de render y subida automática para Shorts de DrakesCraft.

Maneja secuencialmente:
  1. Short 1 (ShortSaori - ES) [YA SUBIDO: https://youtube.com/shorts/B8PjoPU1IL0]
  2. Renderizar Short 2 (ShortNetworksDupe - EN) y subir a YouTube.
  3. Renderizar Short 3 (ShortCustomGui - ES) y subir a YouTube.
  4. Renderizar Short 4 (ShortArchitecture - EN) y subir a YouTube.
"""
import os
import sys
import time
import subprocess
import pathlib
import pickle
from datetime import datetime

# Configurar stdout y stderr en UTF-8 para evitar errores con charmap/cp1252 en Windows
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
LOG_FILE = OUT_DIR / "shorts_pipeline.log"

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

    youtube = get_authenticated_service()

    body = {
        "snippet": {
            "title": title[:100],
            "description": description[:5000],
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
        chunksize=1024 * 1024 * 4
    )

    log(f"Iniciando subida a YouTube: {file_path.name}")
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
    short_url = f"https://youtube.com/shorts/{video_id}"
    log(f"[OK] SHORT SUBIDO EXITOSAMENTE: {short_url}")
    return video_id, short_url

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

SHORTS_QUEUE = [
    {
        "id": "ShortNetworksDupe",
        "file": "short_networks.mp4",
        "lang": "en",
        "title": "Fixing the Slimefun Networks v6 Dupe Glitch in Minecraft 1.21 #Shorts",
        "description": (
            "If you have ever managed a Slimefun server, you know the nightmare of Networks version 6. Under concurrent tick loads in modern Minecraft, item synchronization between Infinity Expansion and Fluffy barrels could trigger massive dupe glitches.\n\n"
            "Most server owners just ban the addons. At DrakesCraft, we patched the transaction commit layer inside Networks with atomic verification and zero-dupe buffers.\n\n"
            "The result is infinite digital storage and stable 20.0 TPS on Paper 1.21.\n"
            "Server IP: play.drakescraft.cl:25565\n"
            "Discord Community: https://discord.gg/drakescraft\n\n"
            "#Shorts #Minecraft #Slimefun #Networks #InfinityExpansion #PaperMC #Gaming #Engineering"
        ),
        "tags": "minecraft,slimefun,networks v6,infinity expansion,fluffy barrels,dupe glitch fix,drakescraft,papermc,purpur,shorts,gaming"
    },
    {
        "id": "ShortCustomGui",
        "file": "short_customgui.mp4",
        "lang": "es",
        "title": "Maquinaria 3D y GUIs en Minecraft 1.21 sin Mods #Shorts",
        "description": (
            "¿Cómo logramos que reactores nucleares y maquinaria industrial funcionen en Minecraft sin obligar a los jugadores a instalar Forge o Fabric?\n\n"
            "En DrakesCraft usamos la potencia de CustomModelData y Resource Packs optimizados por servidor. El servidor mapea dinámicamente cada ítem y bloque de Slimefun a geometrías tridimensionales reales. Cualquier cliente vanilla en versión 1.21.x se conecta al instante, abre interfaces visuales complejas y procesa energía en tiempo real.\n\n"
            "Pruébalo sin mods en:\n"
            "IP: play.drakescraft.cl:25565\n"
            "Discord Oficial: https://discord.gg/drakescraft\n\n"
            "#Shorts #Minecraft #Slimefun #ResourcePack #CustomModelData #Minecraft121 #DrakesCraft #Gaming #Vanilla"
        ),
        "tags": "minecraft,slimefun,custommodeldata,resource pack,minecraft 1.21,drakescraft,vanilla minecraft,shorts,gaming,tutorial"
    },
    {
        "id": "ShortArchitecture",
        "file": "short_architecture.mp4",
        "lang": "en",
        "title": "Why We Decoupled Minecraft Compute from Orchestration #Shorts",
        "description": (
            "Running modern Minecraft with 80 Slimefun addons on a single VPS is a recipe for disaster. At DrakesCraft, we segregated the system into isolated fault domains.\n\n"
            "The pure game tick loop executes on high-frequency cores at our Dallas compute node with Generational ZGC. Meanwhile, relational databases, telemetry bots, and Docker microservices reside on our Linux orchestration server. Even if web APIs experience heavy load, Minecraft maintains rock-solid 20.0 TPS.\n\n"
            "Experience high availability at:\n"
            "Server IP: play.drakescraft.cl:25565\n"
            "Discord Community: https://discord.gg/drakescraft\n\n"
            "#Shorts #Minecraft #Slimefun #SRE #DevOps #ZGC #Java21 #Linux #Docker #DrakesCraft #Shorts"
        ),
        "tags": "minecraft,slimefun,sre,devops,docker,linux,java zgc,dallas,high availability,drakescraft,shorts"
    }
]

def main():
    log("=" * 60)
    log("PIPELINE AUTOMÁTICO DE RENDER Y SUBIDA DE SHORTS (EN PROCESO)")
    log("=" * 60)

    for item in SHORTS_QUEUE:
        log(f"\n>>> Procesando {item['id']} ({item['lang'].upper()}) <<<")
        video_path = OUT_DIR / item["file"]
        
        # 1. Renderizar
        render_composition(item["id"], item["file"])

        # 2. Subir a YouTube
        log(f"Subiendo a YouTube: {item['title']}...")
        try:
            vid_id, url = upload_short(
                file_path=video_path,
                title=item["title"],
                description=item["description"],
                tags=item["tags"],
                privacy="public"
            )
            log(f"Short subido con éxito: {url}")
        except Exception as e:
            log(f"[ERROR] Error al subir {item['id']}: {e}")

        # Pequeña pausa de 10s entre subidas
        time.sleep(10)

    log("\n============================================================")
    log("TODOS LOS SHORTS DE LA COLA HAN SIDO RENDERIZADOS Y SUBIDOS")
    log("============================================================")

if __name__ == "__main__":
    main()
