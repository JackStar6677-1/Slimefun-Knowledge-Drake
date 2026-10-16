#!/usr/bin/env python3
"""
tools/upload_capitulo2.py — Uploader oficial para Capítulo 2 (Versión Extendida) a YouTube Data API v3
Sube el video horizontal en 720p + miniatura personalizada de alta fidelidad.
"""
import os
import sys
import pickle
import argparse
from google.auth.transport.requests import Request
import googleapiclient.discovery
from googleapiclient.http import MediaFileUpload

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOKEN_PATH = os.path.join(ROOT, "tools", "token.pickle")
VIDEO_PATH = os.path.join(ROOT, "video", "out", "capitulo2_720p.mp4")
THUMBNAIL_PATH = os.path.join(ROOT, "video", "public", "thumbnail_capitulo2.png")

def get_authenticated_service(token_path=TOKEN_PATH):
    if not os.path.exists(token_path):
        raise FileNotFoundError(f"OAuth token not found at {token_path}")
    with open(token_path, "rb") as f:
        credentials = pickle.load(f)
    if credentials.expired and credentials.refresh_token:
        print("[YouTube API] Token expired, refreshing with refresh_token...")
        credentials.refresh(Request())
        with open(token_path, "wb") as f:
            pickle.dump(credentials, f)
        print("[YouTube API] Token refreshed and saved.")
    return googleapiclient.discovery.build("youtube", "v3", credentials=credentials)

def upload_video(video_path, thumbnail_path, title, description, tags, privacy="public", category_id="20"):
    if not os.path.isfile(video_path):
        raise FileNotFoundError(f"Video file not found: {video_path}")

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
        video_path,
        mimetype="video/mp4",
        resumable=True,
        chunksize=1024 * 1024 * 4  # 4MB chunks
    )

    print(f"\n[YouTube Upload] Iniciando subida de: {video_path}")
    print(f"  Título: {title}")
    print(f"  Privacidad: {privacy}")
    print(f"  Categoría: {category_id} (Gaming)")

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
            print(f"  Progreso: {pct}%...")

    video_id = response.get("id")
    print(f"\n[OK] Video subido exitosamente con ID: {video_id}")
    video_url = f"https://youtu.be/{video_id}"
    print(f"  Enlace: {video_url}")

    # Subir Miniatura Dedicada
    if thumbnail_path and os.path.isfile(thumbnail_path):
        print(f"\n[YouTube Upload] Subiendo miniatura dedicada: {thumbnail_path}")
        try:
            thumb_media = MediaFileUpload(thumbnail_path, mimetype="image/png")
            youtube.thumbnails().set(
                videoId=video_id,
                media_body=thumb_media
            ).execute()
            print("[OK] Miniatura de Capítulo 2 asignada con éxito.")
        except Exception as e:
            print(f"[WARN] Error al subir miniatura: {e}")

    print("\n" + "=" * 60)
    print(f"CAPÍTULO 2 PUBLICADO: {video_url}")
    print("=" * 60 + "\n")
    return video_id

if __name__ == "__main__":
    title = "Capítulo 2 — Arquitectura Distribuida & SRE: La Ingeniería Detrás del Laboratorio"
    
    description = """Capítulo 2 — Arquitectura Distribuida & SRE: La Ingeniería Detrás del Laboratorio (Versión Extendida).

Una inmersión profunda y forense en los sistemas de DrakesCraft: cómo operar Minecraft 1.21.x con más de 80 addons de Slimefun concurrentes, tuning de ZGC Generacional para pausas de recolección de basura menores a 1 ms, clúster distribuido entre Dallas y Linux Central, y el agente centinela SRE SAORI.

⏱️ TIMESTAMPS:
00:00 - El Mito del Juego de Bloques (OpenJDK 21 64-Bit)
00:12 - El Presupuesto de Tick: 50.00 ms Inflexibles
00:30 - Deuda Computacional & Tick Drift en Producción
00:49 - El Operador: Infraestructura Física y Redes Institucionales
01:04 - Disciplina Operativa SRE & Repositorio Maven Propio
01:19 - Banco de Pruebas de Ingeniería & Contenedores Docker
01:34 - El Subsistema Slimefun 4 & Lógica por Bloque Server-Side
01:49 - El Punto de Ruptura en 1.21.x: Fugas de Memoria & Pausas GC
02:16 - 80+ Addons Concurrentes Activos en 1.21.11
02:34 - Tuning JVM: ZGC Generacional & Latencia < 1ms
02:49 - Topología Distribuida: Nodo Dallas & Orquestador Linux
03:00 - Agente Centinela SRE (SAORI) & Mitigación Forense 24/7
03:25 - Política de Persistencia Atómica: Write-Ahead Logging (WAL)
03:42 - Interoperabilidad Transparente Java & Bedrock (Puerto 25565)
03:57 - Hoja de Ruta Empírica hacia la Temporada 2 (2027)
04:13 - Conclusión & Bienvenida al Laboratorio

🌐 CONECTA CON EL ECOSISTEMA:
• Servidor Minecraft: play.drakescraft.cl:25565 (Java & Bedrock)
• Web Oficial: https://drakescraft.cl
• Repositorio Maven: https://maven.drakescraft.cl
• Discord de la Comunidad: https://discord.gg/drakescraft

#Minecraft #Slimefun #Sysadmin #SRE #Java #Linux #Docker #DrakesCraft #Engineering #ZGC"""

    tags = "minecraft,slimefun,drakescraft,sysadmin,sre,java,docker,linux,spark,profiling,zgc,latency,docuserie,tecnologia,bedrock,geyser"

    upload_video(VIDEO_PATH, THUMBNAIL_PATH, title, description, tags, privacy="public")
