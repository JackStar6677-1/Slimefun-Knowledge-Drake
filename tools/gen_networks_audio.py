#!/usr/bin/env python3
"""Genera los audios faltantes para NetworksEpisode y NetworksReel."""
import asyncio
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from voice_engine import generate_speech

AUDIO = ROOT / "video" / "public" / "audio"

STEPS = {
    "step1_intro.mp3": "Olvídate de tolvas lentas: mueve miles de ítems por segundo con una red digital centralizada.",
    "step2_grabber.mp3": "Coloca el Network Grabber pegado al cofre o máquina desde donde quieras sacar ítems.",
    "step3_gui_grabber.mp3": "Abre su menú: marca la cara adyacente, como Norte. Recuerda que Networks no usa canales numéricos, todo va directo a la red.",
    "step4_pusher.mp3": "En destino, coloca el Pusher, elige su dirección y configura los slots de plantilla para filtrar los ítems.",
    "step5_transfer.mp3": "¡Listo! Conecta cables al Network Controller y los ítems viajarán instantáneamente sin lag."
}

async def main():
    AUDIO.mkdir(parents=True, exist_ok=True)
    for fname, text in STEPS.items():
        out = AUDIO / fname
        res = await generate_speech(text, out, voice="es-CL-CatalinaNeural", rate="+6%")
        print(f"Generado {fname}: {res['duration']:.2f}s -> {res['file']}")

if __name__ == "__main__":
    asyncio.run(main())
