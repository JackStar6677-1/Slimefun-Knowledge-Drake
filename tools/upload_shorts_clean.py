import os
import sys
import time
import pickle
from google.auth.transport.requests import Request
import googleapiclient.discovery
from googleapiclient.http import MediaFileUpload

token_path = "/opt/stacks/youtube-stream/token.pickle"
if not os.path.exists(token_path):
    token_path = "/app/token.pickle"

with open(token_path, "rb") as f:
    creds = pickle.load(f)

if creds.expired and creds.refresh_token:
    creds.refresh(Request())
    with open(token_path, "wb") as f:
        pickle.dump(creds, f)

youtube = googleapiclient.discovery.build("youtube", "v3", credentials=creds)

queue = [
    {
        "file": "/app/start-reel.mp4",
        "title": "Tu 1ª Hora en Slimefun: Guía Rápida #Shorts",
        "description": "¿Empezando en Slimefun? Todo lo que necesitas para tu primera hora:\n\n1. Escribe /sf guide y abre la guía.\n2. La Enhanced Crafting Table es GRATIS (Mesa sobre dispensador vanilla).\n3. Con solo 20 niveles desbloqueas Grind Stone, Ore Washer, Gold Pan y Ore Crusher.\n4. Termina Basic Machines y se abren Energía, GPS, Androides y Cargo.\n\nJuega en:\nIP: mc.drakescraft.cl (Java & Bedrock)\nDiscord: https://discord.gg/rv3vtXZTk7\n\n#Shorts #Minecraft #Slimefun #DrakesCraft #Gaming #Tutorial",
        "tags": ["minecraft", "slimefun", "drakescraft", "tutorial", "gaming", "shorts", "papermc"]
    },
    {
        "file": "/app/short_saori.mp4",
        "title": "¿Qué es S.A.O.R.I.? El Cerebro SRE de DrakesCraft #Shorts",
        "description": "¿Pensabas que SAORI era solo un nombre al azar?\n\nEn DrakesCraft son siglas de alta ingeniería:\nS - Server\nA - Autonomous\nO - Orchestrator for\nR - Resilient\nI - Infrastructure\n\nNuestro enjambre multi-agente vigila el clúster 24/7, audita la JVM y aplica mitigaciones forenses sin reinicios a ciegas ni pérdida de datos.\n\nConéctate en:\nIP: mc.drakescraft.cl:25565 (Java & Bedrock)\nDiscord Oficial: https://discord.gg/rv3vtXZTk7\n\n#Shorts #Minecraft #SRE #AI #Saori #DevOps #Gaming #DrakesCraft",
        "tags": ["minecraft", "sre", "saori", "drakescraft", "ai", "devops", "shorts", "gaming"]
    }
]

for item in queue:
    print(f"Subiendo: {item['title']}...")
    body = {
        "snippet": {
            "title": item["title"][:100],
            "description": item["description"][:5000],
            "tags": item["tags"],
            "categoryId": "20"
        },
        "status": {
            "privacyStatus": "public",
            "selfDeclaredMadeForKids": False
        }
    }
    media = MediaFileUpload(item["file"], mimetype="video/mp4", resumable=True, chunksize=1024*1024*4)
    req = youtube.videos().insert(part="snippet,status", body=body, media_body=media)
    resp = None
    while resp is None:
        status, resp = req.next_chunk()
        if status:
            print(f"  Progreso: {int(status.progress() * 100)}%")
    vid_id = resp.get("id")
    print(f"[OK] Subido con éxito: https://youtube.com/shorts/{vid_id}")
    time.sleep(15)

print("=== SUBIDA DE AMBOS SHORTS COMPLETADA ===")
