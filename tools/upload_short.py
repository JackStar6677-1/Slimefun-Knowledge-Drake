#!/usr/bin/env python3
"""
YouTube Shorts Automated Uploader for DrakesCraft / JackStar6677
Uploads vertical 9:16 videos directly as YouTube Shorts via YouTube Data API v3.
"""
import os
import sys
import argparse
import pickle
from google.auth.transport.requests import Request
import googleapiclient.discovery
from googleapiclient.http import MediaFileUpload

TOKEN_PATH = os.environ.get("YOUTUBE_TOKEN_PATH", "/opt/stacks/youtube-stream/token.pickle")

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

def upload_short(file_path, title, description, tags, privacy="unlisted", category_id="20", token_path=TOKEN_PATH):
    if not os.path.isfile(file_path):
        raise FileNotFoundError(f"Video file not found: {file_path}")

    # Ensure #Shorts is in title or description
    if "#Shorts" not in title and "#shorts" not in title:
        title = f"{title} #Shorts"
    if "#Shorts" not in description and "#shorts" not in description:
        description = f"{description}\n\n#Shorts #Minecraft #Slimefun #DrakesCraft"

    youtube = get_authenticated_service(token_path)

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
        file_path,
        mimetype="video/mp4",
        resumable=True,
        chunksize=1024 * 1024 * 4  # 4MB chunks
    )

    print(f"[YouTube Upload] Initiating upload for: {file_path}")
    print(f"  Title: {title}")
    print(f"  Privacy: {privacy}")
    print(f"  Category: {category_id} (Gaming)")

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
            print(f"[YouTube Upload] Progress: {pct}% uploaded...")

    video_id = response.get("id")
    print(f"\n==========================================")
    print(f"✅ VIDEO SUBIDO EXITOSAMENTE A YOUTUBE!")
    print(f"ID del Video: {video_id}")
    print(f"Enlace Short: https://youtube.com/shorts/{video_id}")
    print(f"Enlace Clásico: https://youtu.be/{video_id}")
    print(f"==========================================\n")
    return video_id

def main():
    parser = argparse.ArgumentParser(description="Upload vertical video to YouTube Shorts")
    parser.add_argument("--file", "-f", required=True, help="Path to video MP4 file")
    parser.add_argument("--title", "-t", required=True, help="Title of the video")
    parser.add_argument("--description", "-d", default="Guía oficial de DrakesCraft.net - Servidor de Supervivencia Técnica Minecraft 1.21.11. IP: play.drakescraft.net", help="Description")
    parser.add_argument("--tags", default="minecraft,slimefun,drakescraft,shorts,gaming,tutorial,paper,purpur", help="Comma-separated tags")
    parser.add_argument("--privacy", "-p", choices=["public", "unlisted", "private"], default="unlisted", help="Privacy status (default: unlisted)")
    parser.add_argument("--category", default="20", help="YouTube Category ID (20 = Gaming)")
    parser.add_argument("--token", default=TOKEN_PATH, help="Path to token.pickle")

    args = parser.parse_args()
    try:
        upload_short(args.file, args.title, args.description, args.tags, args.privacy, args.category, args.token)
    except Exception as e:
        print(f"❌ Error al subir video: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
