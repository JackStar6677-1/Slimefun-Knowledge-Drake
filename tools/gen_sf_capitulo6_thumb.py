#!/usr/bin/env python3
"""
tools/gen_sf_capitulo6_thumb.py — Miniatura profesional (1280x720) para:
Slimefun en DrakesCraft: Capítulo 6 — Mecánica Cuántica, GPS & Teletransportación
"""
import os
import pathlib
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
PUBLIC_DIR = ROOT / "video" / "public"
OUT_FILE = PUBLIC_DIR / "thumbnail_sf_capitulo6.png"

def get_font(size, bold=True):
    font_paths = [
        r"C:\Windows\Fonts\segoeuib.ttf" if bold else r"C:\Windows\Fonts\segoeui.ttf",
        r"C:\Windows\Fonts\arialbd.ttf" if bold else r"C:\Windows\Fonts\arial.ttf",
        r"C:\Windows\Fonts\consola.ttf"
    ]
    for p in font_paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                continue
    return ImageFont.load_default()

def main():
    width, height = 1280, 720
    im = Image.new("RGBA", (width, height), (8, 6, 20, 255))
    draw = ImageDraw.Draw(im)

    # 1. Grid tecnológico de fondo púrpura / cuántico
    for x in range(0, width, 40):
        draw.line([(x, 0), (x, height)], fill=(28, 20, 54, 130), width=1)
    for y in range(0, height, 40):
        draw.line([(0, y), (width, y)], fill=(28, 20, 54, 130), width=1)

    # 2. Resplandor / Tarjeta derecha
    glow_box = [(width - 460, 40), (width - 40, height - 40)]
    draw.rounded_rectangle(glow_box, radius=24, fill=(16, 12, 36, 230), outline=(168, 85, 247), width=3)

    # Fuentes
    font_badge = get_font(22, bold=True)
    font_title = get_font(44, bold=True)
    font_sub = get_font(21, bold=False)
    font_detail = get_font(18, bold=True)
    font_brand = get_font(26, bold=True)

    # Badge de cabecera
    accent_color = (168, 85, 247) # Púrpura cuántico brillante
    draw.rounded_rectangle([(70, 65), (550, 115)], radius=8, fill=accent_color)
    draw.text((85, 74), "SLIMEFUN MASTERCLASS // EP. 06", font=font_badge, fill=(2, 6, 23, 255))

    # Título principal
    draw.text((70, 145), "MECÁNICA CUÁNTICA", font=font_title, fill=(255, 255, 255, 255))
    draw.text((70, 205), "GPS & TELEPORTACIÓN", font=font_title, fill=(233, 213, 255, 255))

    # Subtítulo
    draw.text((70, 275), "Constelación de Satélites GPS, Teletransporte Instantáneo y Geo-Scanners", font=font_sub, fill=(148, 163, 184, 255))

    # Cajas de especificaciones
    details = [
        "🛰️ Satélites GPS: Lanzamiento orbital para cobertura y precisión planetaria",
        "🌐 Geo-Scanner: Prospección satelital de petróleo y minerales ocultos",
        "🌀 Teletransportadores Cuánticos: Desmaterialización a destinos sintonizados",
        "📶 Ascensores Cuánticos: Tránsito vertical instantáneo entre niveles de base",
        "🛡️ Cifrado SRE: Bloqueo de waypoints privados contra intrusos"
    ]
    y_start = 330
    for i, det in enumerate(details):
        draw.rounded_rectangle([(70, y_start + i * 55), (740, y_start + i * 55 + 44)], radius=8, fill=(24, 16, 48, 220), outline=(168, 85, 247, 100), width=1)
        draw.text((85, y_start + i * 55 + 10), det, font=font_detail, fill=(245, 243, 255, 255))

    # Panel lateral derecho (Specs visuales)
    draw.text((width - 430, 80), "DRAKES QUANTUM", font=font_brand, fill=(168, 85, 247, 255))
    draw.text((width - 430, 120), "GPS CONSTELLATION", font=font_badge, fill=(255, 255, 255, 255))

    specs = [
        ("NIVEL TECNOLÓGICO", "Tier 6: Era Cuántica"),
        ("RED SATELITAL", "GPS Transmitters + Cobertura"),
        ("DESPLAZAMIENTO", "Instantáneo (0 Ticks)"),
        ("PROSPECCIÓN", "Geo-Scanner de Chunks"),
        ("ELEVACIÓN", "Quantum Elevators Verticales"),
        ("PRIVACIDAD", "Canales y Waypoints Cifrados"),
        ("NETWORK", "play.drakescraft.cl")
    ]
    for idx, (k, v) in enumerate(specs):
        sy = 180 + idx * 60
        draw.text((width - 430, sy), k, font=get_font(13, bold=True), fill=(148, 163, 184, 255))
        draw.text((width - 430, sy + 18), v, font=get_font(18, bold=True), fill=(255, 255, 255, 255))

    # Guardar
    im.save(OUT_FILE, format="PNG")
    print(f"[OK] Miniatura profesional para Capítulo 6 guardada en: {OUT_FILE}")

if __name__ == "__main__":
    main()
