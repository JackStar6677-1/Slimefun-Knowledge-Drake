#!/usr/bin/env python3
"""Narra cada escena del storyboard con edge-tts y guarda la duracion real (la animacion se ajusta al audio).

  python tools/tts_scenes.py [voz]      # por defecto en-US-AndrewNeural
"""
import asyncio
import json
import pathlib
import sys

import edge_tts
from mutagen.mp3 import MP3

ROOT = pathlib.Path(__file__).resolve().parent.parent
SB = ROOT / "video" / "public" / (sys.argv[2] if len(sys.argv) > 2 else "storyboard.json")
PREFIX = (sys.argv[3] + "-") if len(sys.argv) > 3 else ""
AUDIO = ROOT / "video" / "public" / "audio"
VOICE = sys.argv[1] if len(sys.argv) > 1 else "en-US-AndrewNeural"


async def main() -> None:
    AUDIO.mkdir(parents=True, exist_ok=True)
    sb = json.loads(SB.read_text(encoding="utf-8"))
    for s in sb["scenes"]:
        f = AUDIO / f'{PREFIX}{s["id"]}.mp3'
        await edge_tts.Communicate(s["narration"], VOICE, rate="-4%").save(str(f))
        s["audio"] = f'audio/{PREFIX}{s["id"]}.mp3'
        s["seconds"] = round(MP3(str(f)).info.length + 0.7, 2)
        print(s["id"], s["seconds"])
    sb["voice"] = VOICE
    SB.write_text(json.dumps(sb, ensure_ascii=False, indent=1), encoding="utf-8")
    print("total", round(sum(s["seconds"] for s in sb["scenes"]), 1), "s")


asyncio.run(main())
