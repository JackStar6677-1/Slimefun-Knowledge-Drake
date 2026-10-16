#!/usr/bin/env python3
"""
tools/gen_all_thumbnails.py — Generador de miniaturas profesionales (1280x720) para:
  - Capítulo 3: El Enjambre Centinela SAORI
  - Capítulo 4: Código Propio & Cero Rollbacks
  - Slimefun Capítulo 1: La Guía Maestra & Multibloques
"""
import os
import pathlib
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parent.parent
PUBLIC_DIR = ROOT / "video" / "public"
SKINS_DIR = PUBLIC_DIR / "jack_parts"

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

def create_thumbnail(title, subtitle, badge, accent_color, out_name, details=[]):
    width, height = 1280, 720
    im = Image.new("RGBA", (width, height), (5, 9, 20, 255))
    draw = ImageDraw.Draw(im)

    # 1. Grid tecnológico de fondo
    for x in range(0, width, 50):
        draw.line([(x, 0), (x, height)], fill=(20, 30, 55, 120), width=1)
    for y in range(0, height, 50):
        draw.line([(0, y), (width, y)], fill=(20, 30, 55, 120), width=1)

    # 2. Resplandor de acento lateral
    glow_box = [(width - 450, 40), (width - 40, height - 40)]
    draw.rounded_rectangle(glow_box, radius=24, fill=(15, 23, 42, 220), outline=accent_color, width=3)

    # 3. Textos y Badges
    font_badge = get_font(20, bold=True)
    font_title = get_font(44, bold=True)
    font_sub = get_font(22, bold=False)
    font_detail = get_font(18, bold=True)
    font_brand = get_font(26, bold=True)

    # Badge de cabecera
    draw.rounded_rectangle([(70, 70), (450, 115)], radius=8, fill=accent_color)
    draw.text((85, 78), badge, font=font_badge, fill=(2, 6, 23, 255))

    # Título principal
    draw.text((70, 150), title, font=font_title, fill=(255, 255, 255, 255))

    # Subtítulo
    draw.text((70, 220), subtitle, font=font_sub, fill=(148, 163, 184, 255))

    # Puntos clave técnicos en la columna izquierda
    y_pos = 290
    for det in details:
        draw.rounded_rectangle([(70, y_pos), (750, y_pos + 55)], radius=10, fill=(15, 23, 42, 230), outline=(56, 189, 248, 80), width=1)
        draw.text((95, y_pos + 14), det, font=font_detail, fill=(226, 232, 240, 255))
        y_pos += 72

    # Brand Footer
    draw.text((70, height - 75), "DRAKESCRAFT LABS // play.drakescraft.cl:25565", font=font_brand, fill=accent_color)

    # Guardar thumbnail PNG
    out_path = PUBLIC_DIR / out_name
    im.convert("RGB").save(str(out_path), "PNG")
    print(f"[OK] Miniatura generada: {out_path} ({out_path.stat().st_size / 1024:.1f} KB)")

def main():
    print("=" * 60)
    print("GENERANDO MINIATURAS PROFESIONALES PARA CAPÍTULOS 3, 4 Y SLIMEFUN 1")
    print("=" * 60)

    # Capítulo 3
    create_thumbnail(
        title="CAPÍTULO 3 // EL ENJAMBRE SAORI",
        subtitle="Server Autonomous Orchestrator for Resilient Infrastructure",
        badge="DRAKESCRAFT SRE // 24/7 NOMINAL",
        accent_color=(6, 182, 212, 255),
        out_name="thumbnail_capitulo3.png",
        details=[
            "✔ Socket Raw en Dallas // Sondeo por segundo en 25565",
            "✔ Diagnóstico Forense // Spark Profiler & Thread Dumps",
            "✔ Crossplay Unificado // Java & Bedrock sin Desincronización"
        ]
    )

    # Capítulo 4
    create_thumbnail(
        title="CAPÍTULO 4 // CÓDIGO PROPIO & CERO ROLLBACKS",
        subtitle="Maven Propio · Patch Atómico Networks v6 · Persistencia WAL",
        badge="SRE CREED // ZERO DATA LOSS",
        accent_color=(168, 85, 247, 255),
        out_name="thumbnail_capitulo4.png",
        details=[
            "✔ Repositorio Maven Dedicado // maven.drakescraft.cl (Java 21)",
            "✔ Patch Networks v6 // Buffer de Confirmación Atómica contra Dupes",
            "✔ Cero Pérdida de Datos // Write-Ahead Logging & Persistencia Real"
        ]
    )

    # Slimefun Capítulo 1
    create_thumbnail(
        title="SLIMEFUN 1.21 // GUÍA MAESTRA & MULTIBLOQUES",
        subtitle="El Tutorial Completo: Guía /sf, GUI Real de MC, Multibloques & Comandos",
        badge="DRAKESCRAFT TUTORIAL // PASO A PASO",
        accent_color=(16, 185, 129, 255),
        out_name="thumbnail_sf_capitulo1.png",
        details=[
            "✔ Comandos de Inicio // /rtp, /sethome y protección /ps",
            "✔ Guía y Menú de Investigaciones // /sf guide & Warps de XP (/pwarp)",
            "✔ Multibloques Iniciales // Mesa Mejorada, Grindstone, Smeltery y Forja"
        ]
    )

if __name__ == "__main__":
    main()
