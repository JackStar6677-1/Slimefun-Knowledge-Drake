#!/usr/bin/env python3
"""
tools/gen_sf_capitulo5_thumb.py — Miniatura profesional (1280x720) para:
Slimefun en DrakesCraft: Capítulo 5 — Reactores Nucleares & Refrigeración Criogénica
"""
import os
import pathlib
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
PUBLIC_DIR = ROOT / "video" / "public"
OUT_FILE = PUBLIC_DIR / "thumbnail_sf_capitulo5.png"

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
    im = Image.new("RGBA", (width, height), (6, 12, 10, 255))
    draw = ImageDraw.Draw(im)

    # 1. Grid tecnológico de fondo verde esmeralda / atómico
    for x in range(0, width, 40):
        draw.line([(x, 0), (x, height)], fill=(16, 40, 24, 130), width=1)
    for y in range(0, height, 40):
        draw.line([(0, y), (width, y)], fill=(16, 40, 24, 130), width=1)

    # 2. Resplandor / Tarjeta derecha
    glow_box = [(width - 460, 40), (width - 40, height - 40)]
    draw.rounded_rectangle(glow_box, radius=24, fill=(10, 24, 16, 230), outline=(74, 222, 128), width=3)

    # Fuentes
    font_badge = get_font(22, bold=True)
    font_title = get_font(44, bold=True)
    font_sub = get_font(21, bold=False)
    font_detail = get_font(18, bold=True)
    font_brand = get_font(26, bold=True)

    # Badge de cabecera
    accent_color = (74, 222, 128) # Verde atómico brillante
    draw.rounded_rectangle([(70, 65), (550, 115)], radius=8, fill=accent_color)
    draw.text((85, 74), "SLIMEFUN MASTERCLASS // EP. 05", font=font_badge, fill=(2, 6, 23, 255))

    # Título principal
    draw.text((70, 145), "REACTORES NUCLEARES", font=font_title, fill=(255, 255, 255, 255))
    draw.text((70, 205), "Y COOLANT CRIOGÉNICO", font=font_title, fill=(220, 252, 231, 255))

    # Subtítulo
    draw.text((70, 275), "Domina la Fisión de U-235, Traje Hazmat, Varillas Criogénicas y Cero Meltdowns", font=font_sub, fill=(148, 163, 184, 255))

    # Cajas de especificaciones
    details = [
        "☣️ Bioseguridad SRE: Traje Hazmat Completo (4 piezas anti-radiación)",
        "⚛️ Enriquecimiento: Purificación de Uranio-235 en Centrífuga Nuclear",
        "⚡ Potencia Extrema: Generación masiva de hasta 1,200 Joules/segundo",
        "❄️ Prevención de Meltdown: Alimentación continua de Coolant Criogénico",
        "🛡️ Gestión de Residuos: Blindaje de plomo y reciclaje cuántico"
    ]
    y_start = 330
    for i, det in enumerate(details):
        draw.rounded_rectangle([(70, y_start + i * 55), (740, y_start + i * 55 + 44)], radius=8, fill=(15, 28, 20, 220), outline=(74, 222, 128, 100), width=1)
        draw.text((85, y_start + i * 55 + 10), det, font=font_detail, fill=(241, 245, 249, 255))

    # Panel lateral derecho (Specs visuales)
    draw.text((width - 430, 80), "DRAKES NUCLEAR", font=font_brand, fill=(74, 222, 128, 255))
    draw.text((width - 430, 120), "REACTOR PROTOCOL", font=font_badge, fill=(255, 255, 255, 255))

    specs = [
        ("TIPO DE GENERADOR", "Reactor Nuclear de Fisión"),
        ("COMBUSTIBLE", "Varillas de Uranio-235"),
        ("POTENCIA", "1,200 Joules / segundo"),
        ("REFRIGERANTE", "Coolant Criogénico (Líquido)"),
        ("RIESGO", "Meltdown si buffer = 0"),
        ("MONITOREO SRE", "Cargo Auto-Refill 24/7"),
        ("NETWORK", "play.drakescraft.cl")
    ]
    for idx, (k, v) in enumerate(specs):
        sy = 180 + idx * 60
        draw.text((width - 430, sy), k, font=get_font(13, bold=True), fill=(148, 163, 184, 255))
        draw.text((width - 430, sy + 18), v, font=get_font(18, bold=True), fill=(255, 255, 255, 255))

    # Guardar
    im.save(OUT_FILE, format="PNG")
    print(f"[OK] Miniatura profesional para Capítulo 5 guardada en: {OUT_FILE}")

if __name__ == "__main__":
    main()
