#!/usr/bin/env python3
"""
tools/gen_sf_capitulo7_thumb.py — Miniatura profesional (1280x720) para:
Slimefun en DrakesCraft: Capítulo 7 — Addons Avanzados, Automatización Infinita & Mitigación de Lag
"""
import os
import pathlib
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
PUBLIC_DIR = ROOT / "video" / "public"
OUT_FILE = PUBLIC_DIR / "thumbnail_sf_capitulo7.png"

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
    im = Image.new("RGBA", (width, height), (6, 8, 20, 255))
    draw = ImageDraw.Draw(im)

    # 1. Grid tecnológico de fondo cian / sci-fi
    for x in range(0, width, 40):
        draw.line([(x, 0), (x, height)], fill=(15, 30, 55, 120), width=1)
    for y in range(0, height, 40):
        draw.line([(0, y), (width, y)], fill=(15, 30, 55, 120), width=1)

    # 2. Resplandor / Tarjeta derecha
    glow_box = [(width - 460, 40), (width - 40, height - 40)]
    draw.rounded_rectangle(glow_box, radius=24, fill=(12, 20, 38, 230), outline=(56, 189, 248), width=3)

    # Fuentes
    font_badge = get_font(22, bold=True)
    font_title = get_font(42, bold=True)
    font_sub = get_font(21, bold=False)
    font_detail = get_font(18, bold=True)
    font_brand = get_font(26, bold=True)

    # Badge de cabecera
    accent_color = (56, 189, 248) # Cian industrial brillante
    draw.rounded_rectangle([(70, 65), (550, 115)], radius=8, fill=accent_color)
    draw.text((85, 74), "SLIMEFUN MASTERCLASS // EP. 07", font=font_badge, fill=(2, 6, 23, 255))

    # Título principal
    draw.text((70, 145), "ADDONS & AUTOMATIZACIÓN", font=font_title, fill=(255, 255, 255, 255))
    draw.text((70, 205), "INFINITY, FLUFFY & REDES v6", font=font_title, fill=(56, 189, 248, 255))

    # Subtítulo
    draw.text((70, 275), "Singularidades, Crafteo Autónomo, Fix de Dupes y Arquitectura SRE a 20 TPS", font=font_sub, fill=(148, 163, 184, 255))

    # Cajas de especificaciones
    details = [
        "♾️ Infinity Expansion: Singularidades y Simulación de Mobs sin lag",
        "⚙️ Fluffy Machines: Auto-Crafters eléctricos para ensamblado recursivo",
        "🌐 Redes v6: Almacenamiento digital instantáneo con dupes corregidos",
        "⚡ Reglas SRE: Por qué las tolvas ahogan el CPU vs Punteros en RAM",
        "🛡️ Comandos Iniciales: /pwarp xp, protección de bases y SAORI en Discord"
    ]
    y_start = 330
    for i, det in enumerate(details):
        draw.rounded_rectangle([(70, y_start + i * 55), (740, y_start + i * 55 + 44)], radius=8, fill=(15, 25, 45, 220), outline=(56, 189, 248, 100), width=1)
        draw.text((85, y_start + i * 55 + 10), det, font=font_detail, fill=(240, 249, 255, 255))

    # Panel lateral derecho (Specs visuales)
    draw.text((width - 430, 80), "DRAKES SRE ENGINE", font=font_brand, fill=(56, 189, 248, 255))
    draw.text((width - 430, 120), "END-GAME INDUSTRY", font=font_badge, fill=(255, 255, 255, 255))

    specs = [
        ("NIVEL TECNOLÓGICO", "Tier 7: Addons End-Game"),
        ("INFINITY EXPANSION", "Singularidades & Simulación"),
        ("FLUFFY MACHINES", "Auto-Crafters Eléctricos"),
        ("ALMACENAMIENTO", "Redes v6 Blindadas"),
        ("ESTABILIDAD PURPUR", "20.0 TPS // Cero Dupes"),
        ("ASISTENTE 24/7", "SAORI AI en Discord"),
        ("CONECTIVIDAD", "play.drakescraft.cl")
    ]
    for idx, (k, v) in enumerate(specs):
        sy = 180 + idx * 60
        draw.text((width - 430, sy), k, font=get_font(13, bold=True), fill=(148, 163, 184, 255))
        draw.text((width - 430, sy + 18), v, font=get_font(18, bold=True), fill=(255, 255, 255, 255))

    # Guardar
    im.save(OUT_FILE, format="PNG")
    print(f"[OK] Miniatura profesional para Capítulo 7 guardada en: {OUT_FILE}")

if __name__ == "__main__":
    main()
