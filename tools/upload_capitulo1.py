#!/usr/bin/env python3
"""
Uploader for Capítulo 1 (Docu-Serie DrakesCraft) to YouTube Data API v3
Supports horizontal 16:9 full videos + custom thumbnail upload.
"""
import os
import sys
import pickle
import argparse
from google.auth.transport.requests import Request
import googleapiclient.discovery
from googleapiclient.http import MediaFileUpload

TOKEN_PATH = r"C:\Users\Jack\Documents\Github\DrakesCraft-Labs\Slimefun-Knowledge-Drake\tools\token.pickle"
VIDEO_PATH = r"C:\Users\Jack\Documents\Github\DrakesCraft-Labs\Slimefun-Knowledge-Drake\video\out\capitulo1_completo.mp4"
THUMBNAIL_PATH = r"C:\Users\Jack\Documents\Github\DrakesCraft-Labs\Slimefun-Knowledge-Drake\video\public\thumbnail_capitulo1.png"

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
    print(f"\n✅ Video subido exitosamente con ID: {video_id}")
    video_url = f"https://youtu.be/{video_id}"
    print(f"  Enlace: {video_url}")

    # Upload Custom Thumbnail
    if thumbnail_path and os.path.isfile(thumbnail_path):
        print(f"\n[YouTube Upload] Subiendo miniatura personalizada: {thumbnail_path}")
        try:
            thumb_media = MediaFileUpload(thumbnail_path, mimetype="image/png")
            youtube.thumbnails().set(
                videoId=video_id,
                media_body=thumb_media
            ).execute()
            print("✅ Miniatura asignada con éxito.")
        except Exception as e:
            print(f"⚠️ Advertencia al subir miniatura: {e}")

    print("\n=======================================================")
    print(f"🎬 CAPÍTULO 1 PUBLICADO: {video_url}")
    print("=======================================================\n")
    return video_id

if __name__ == "__main__":
    title = "Capítulo 1 — Introducción & Visión: Quién es Jack, qué es DrakesCraft y la ingeniería del lab"
    
    description = """Capítulo 1 — Introducción & Visión: Quién es Jack, qué es DrakesCraft y la ingeniería detrás del laboratorio.

Una mirada técnica y transparente a la infraestructura, retos de rendimiento con Slimefun en Minecraft 1.21.x, optimización de JVM, profiling con Spark y la arquitectura de sistemas distribuidos que sostiene el servidor.

⏱️ TIMESTAMPS:
00:00 - Introducción & Filosofía SRE
00:35 - Infraestructura Física y Nodos de Cómputo
01:10 - El Desafío Slimefun 1.21.x & Tick Loop
01:45 - Herramientas de Profiling (Spark, JVM & Heap)
02:15 - Visión de Futuro & Conclusiones

🌐 CONECTA CON EL ECOSISTEMA:
• Servidor Minecraft: play.drakescraft.cl (1.21.x)
• Web Oficial: https://drakescraft.cl
• Repositorio Maven: https://maven.drakescraft.cl
• Discord de la Comunidad: https://discord.gg/drakescraft

#Minecraft #Slimefun #Sysadmin #SRE #Java #Linux #DrakesCraft #Engineering"""

    tags = "minecraft,slimefun,drakescraft,sysadmin,sre,java,docker,linux,spark,profiling,gaming,docuserie,tecnologia"

    upload_video(VIDEO_PATH, THUMBNAIL_PATH, title, description, tags, privacy="public")
