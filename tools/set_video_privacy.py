#!/usr/bin/env python3
"""
tools/set_video_privacy.py — Actualiza la privacidad de videos de YouTube (e.g. unlisted / private).
"""
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
        print("[OAuth] Token expirado, renovando...")
        credentials.refresh(Request())
        with open(TOKEN_PATH, "wb") as f:
            pickle.dump(credentials, f)
        print("[OAuth] Token renovado exitosamente.")
    return googleapiclient.discovery.build("youtube", "v3", credentials=credentials)

def set_privacy(video_id: str, privacy: str = "unlisted"):
    yt = get_authenticated_service()
    res = yt.videos().update(
        part="status",
        body={
            "id": video_id,
            "status": {
                "privacyStatus": privacy
            }
        }
    ).execute()
    print(f"[OK] Video {video_id} actualizado a estado: {res['status']['privacyStatus']}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python tools/set_video_privacy.py <video_id> [unlisted|private|public]")
        sys.exit(1)
    vid = sys.argv[1]
    priv = sys.argv[2] if len(sys.argv) > 2 else "unlisted"
    set_privacy(vid, priv)
