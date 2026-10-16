#!/usr/bin/env python3
"""
tools/gen_sf_capitulo3_thumb.py — Miniatura profesional (1280x720) para:
Slimefun en DrakesCraft: Capítulo 3 — Metalurgia Avanzada, Aleaciones & Armería de Precisión
"""
import os
import pathlib
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parent.parent
PUBLIC_DIR = ROOT / "video" / "public"
OUT_FILE = PUBLIC_DIR / "thumbnail_sf_capitulo3.png"

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
    im = Image.new("RGBA", (width, height), (6, 9, 19, 255))
    draw = ImageDraw.Draw(im)

    # 1. Grid tecnológico de fondo con matiz naranja/lava
    for x in range(0, width, 40):
        draw.line([(x, 0), (x, height)], fill=(40, 25, 15, 130), width=1)
    for y in range(0, height, 40):
        draw.line([(0, y), (width, y)], fill=(40, 25, 15, 130), width=1)

    # 2. Resplandor / Tarjeta derecha
    glow_box = [(width - 460, 40), (width - 40, height - 40)]
    draw.rounded_rectangle(glow_box, radius=24, fill=(24, 16, 12, 230), outline=(249, 115, 22), width=3)

    # Fuentes
    font_badge = get_font(22, bold=True)
    font_title = get_font(44, bold=True)
    font_sub = get_font(21, bold=False)
    font_detail = get_font(18, bold=True)
    font_brand = get_font(26, bold=True)

    # Badge de cabecera
    accent_color = (249, 115, 22) # Naranja fuego pirometalurgia
    draw.rounded_rectangle([(70, 65), (550, 115)], radius=8, fill=accent_color)
    draw.text((85, 74), "SLIMEFUN MASTERCLASS // EP. 03", font=font_badge, fill=(10, 10, 10, 255))

    # Título principal
    draw.text((70, 145), "METALURGIA AVANZADA", font=font_title, fill=(255, 255, 255, 255))
    draw.text((70, 205), "& ALEACIONES COMPLEJAS", font=font_title, fill=(254, 215, 170, 255))

    # Subtítulo
    draw.text((70, 275), "Domina el Fundidor (Smeltery), Forja de Armaduras y Redstone Alloy", font=font_sub, fill=(203, 213, 225, 255))

    # Cajas de especificaciones
    details = [
        "🔥 El Fundidor (Smeltery): Fusión de polvos y lava",
        "⚔️ Acero de Damasco: Blindaje táctico y durabilidad",
        "🛡️ Armor Forge: Equipamiento imposible en mesa común",
        "⚡ Redstone Alloy & Metales Grado Nuclear",
        "💎 Duplicación SRE: 2x polvos con Ore Crusher"
    ]
    y_start = 330
    for i, det in enumerate(details):
        draw.rounded_rectangle([(70, y_start + i * 55), (740, y_start + i * 55 + 44)], radius=8, fill=(15, 23, 42, 220), outline=(249, 115, 22, 100), width=1)
        draw.text((85, y_start + i * 55 + 10), det, font=font_detail, fill=(241, 245, 249, 255))

    # Panel lateral derecho (Specs visuales)
    draw.text((width - 430, 80), "DRAKES PROTOCOL", font=font_brand, fill=(249, 115, 22, 255))
    draw.text((width - 430, 120), "PIROMETALURGIA 3D", font=font_badge, fill=(255, 255, 255, 255))

    specs = [
        ("MÁQUINA 01", "Smeltery (Multibloque)"),
        ("MÁQUINA 02", "Armor Forge (Yunque)"),
        ("ALEACIÓN 01", "Bronce (Cobre + Estaño)"),
        ("ALEACIÓN 02", "Duraluminio (Aluminio + Cobre)"),
        ("SUPERALEACIÓN", "Damascus Steel & Nuclear"),
        ("CONDUCTOR", "Redstone Alloy Ingot"),
        ("NETWORK", "play.drakescraft.cl")
    ]
    for idx, (k, v) in enumerate(specs):
        sy = 180 + idx * 60
        draw.text((width - 430, sy), k, font=get_font(13, bold=True), fill=(148, 163, 184, 255))
        draw.text((width - 430, sy + 20), v, font=get_font(16, bold=True), fill=(254, 215, 170, 255))

    # Footer oficial
    draw.line([(70, height - 70), (width - 70, height - 70)], fill=(249, 115, 22, 120), width=2)
    draw.text((70, height - 52), "DRAKES PROTOCOL // JAVA & BEDROCK: play.drakescraft.cl:25565", font=get_font(15, bold=True), fill=(249, 115, 22, 255))
    draw.text((width - 290, height - 52), "SLIMEFUN GUIDE v2026", font=get_font(14, bold=True), fill=(100, 116, 139, 255))

    im.save(OUT_FILE, format="PNG")
    print(f"[OK] Miniatura guardada en: {OUT_FILE}")

if __name__ == "__main__":
    main()
