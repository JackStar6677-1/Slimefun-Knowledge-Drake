import pickle
from google.auth.transport.requests import Request
import googleapiclient.discovery
from googleapiclient.http import MediaFileUpload

TOKEN_PATH = r"C:\Users\Jack\Documents\Github\DrakesCraft-Labs\Slimefun-Knowledge-Drake\tools\token.pickle"
THUMBNAIL_PATH = r"C:\Users\Jack\Documents\Github\DrakesCraft-Labs\Slimefun-Knowledge-Drake\video\public\thumbnail_capitulo1.png"

with open(TOKEN_PATH, "rb") as f:
    credentials = pickle.load(f)
if credentials.expired and credentials.refresh_token:
    credentials.refresh(Request())

youtube = googleapiclient.discovery.build("youtube", "v3", credentials=credentials)

# Get channel's uploads playlist
ch_resp = youtube.channels().list(mine=True, part="contentDetails,snippet").execute()
channel_title = ch_resp['items'][0]['snippet']['title']
uploads_id = ch_resp['items'][0]['contentDetails']['relatedPlaylists']['uploads']

# Get latest video
pl_resp = youtube.playlistItems().list(playlistId=uploads_id, part="snippet", maxResults=5).execute()
latest_item = pl_resp['items'][0]['snippet']
video_id = latest_item['resourceId']['videoId']
video_title = latest_item['title']

print(f"Channel: {channel_title}")
print(f"Latest Video ID: {video_id}")
print(f"Latest Video Title: {video_title}")
print(f"YouTube URL: https://youtu.be/{video_id}")

# Upload Thumbnail
thumb_media = MediaFileUpload(THUMBNAIL_PATH, mimetype="image/png")
youtube.thumbnails().set(videoId=video_id, media_body=thumb_media).execute()
print("Thumbnail uploaded and assigned successfully!")
