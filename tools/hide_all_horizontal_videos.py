#!/usr/bin/env python3
import sys
import pickle
import pathlib
from google.auth.transport.requests import Request
import googleapiclient.discovery

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

ROOT = pathlib.Path(__file__).resolve().parent.parent
TOKEN_PATH = ROOT / "tools" / "token.pickle"

def get_authenticated_service():
    if not TOKEN_PATH.exists():
        raise FileNotFoundError(f"OAuth token no encontrado en {TOKEN_PATH}")
    with open(TOKEN_PATH, "rb") as f:
        credentials = pickle.load(f)
    if credentials.expired and credentials.refresh_token:
        credentials.refresh(Request())
        with open(TOKEN_PATH, "wb") as f:
            pickle.dump(credentials, f)
    return googleapiclient.discovery.build("youtube", "v3", credentials=credentials)

VIDEOS_TO_HIDE = [
    # Slimefun Series horizontal con modelos/bloques defectuosos
    "sxyQckV1u1I", # Cap 1 (sin fondo ni círculos)
    "PNKGHDmLyuQ", # Cap 2
    "Nbvfbj8qwV0", # Cap 3
    "D2tV96u8HwI", # Cap 4
    "IGn9GdXfcfk", # Cap 5
    "hCpei3Cdg4M", # Cap 6
    "hIvv-PwB9RE", # Cap 7
    # Serie previa de introducción/infraestructura técnica
    "fLG10cTvRog", # Cap 1 intro
    "DBr0ooeH-z8", # Cap 2 intro
    "fX2JSThSg9g", # Cap 3 intro
    "n6Z2kp-RgPA", # Cap 4 intro
]

def main():
    yt = get_authenticated_service()
    print("=== CAMBIANDO TODOS LOS VIDEOS HORIZONTALES A UNLISTED ===")
    for vid in VIDEOS_TO_HIDE:
        try:
            curr = yt.videos().list(part="snippet,status", id=vid).execute()
            if not curr.get("items"):
                print(f"[AVISO] Video {vid} no encontrado.")
                continue
            item = curr["items"][0]
            title = item["snippet"]["title"]
            cat_id = item["snippet"]["categoryId"]
            res = yt.videos().update(
                part="snippet,status",
                body={
                    "id": vid,
                    "snippet": {
                        "title": title,
                        "categoryId": cat_id,
                    },
                    "status": {
                        "privacyStatus": "unlisted",
                        "selfDeclaredMadeForKids": item["status"].get("selfDeclaredMadeForKids", False),
                    }
                }
            ).execute()
            status = res["status"]["privacyStatus"]
            print(f"[OK] {vid} -> {status.upper()} | {title[:45]}")
        except Exception as e:
            print(f"[ERROR] En {vid}: {e}")

    print("\n=== VERIFICACIÓN FINAL EN LA API DE YOUTUBE ===")
    check = yt.videos().list(part="status,snippet", id=",".join(VIDEOS_TO_HIDE)).execute()
    for item in check.get("items", []):
        vid = item["id"]
        status = item["status"]["privacyStatus"]
        title = item["snippet"]["title"][:45]
        print(f"CONFIRMADO: {vid} | {status.upper():8s} | {title}")

if __name__ == "__main__":
    main()
