#!/usr/bin/env python3
"""
tools/gen_all_thumbnails.py — Generador de miniaturas visuales de alto impacto (1280x720)
Enfocado en figuras prominentes, elementos icónicos de Minecraft, glow vibrante y tipografía audaz sin exceso de texto.
"""
import os
import pathlib
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parent.parent
PUBLIC_DIR = ROOT / "video" / "public"
OUT_DIR = ROOT / "video" / "out"

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

def draw_glow_rect(draw, bbox, color, radius=16, width=4):
    x0, y0, x1, y1 = bbox
    # Multiple fading outlines for neon glow effect
    r, g, b = color[:3]
    for i in range(4, 0, -1):
        alpha = int(35 / i)
        draw.rounded_rectangle([x0 - i, y0 - i, x1 + i, y1 + i], radius=radius, outline=(r, g, b, alpha), width=width + i)
    draw.rounded_rectangle(bbox, radius=radius, outline=color, width=width)

def create_high_impact_thumbnail(
    main_title,
    badge_text,
    accent_color,
    out_name,
    featured_tags=[],
    mc_icons=[]
):
    width, height = 1280, 720
    im = Image.new("RGBA", (width, height), (6, 11, 25, 255))
    draw = ImageDraw.Draw(im)

    # 1. Gradiente radial y grid espacial de fondo
    for x in range(0, width, 48):
        draw.line([(x, 0), (x, height)], fill=(16, 26, 48, 90), width=1)
    for y in range(0, height, 48):
        draw.line([(0, y), (width, y)], fill=(16, 26, 48, 90), width=1)

    # Resplandor de acento central/derecho
    glow_bg = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_bg)
    r, g, b = accent_color[:3]
    glow_draw.ellipse([width - 550, 60, width + 50, height - 60], fill=(r, g, b, 45))
    glow_draw.ellipse([80, 100, 500, 520], fill=(r, g, b, 25))
    glow_bg = glow_bg.filter(ImageFilter.GaussianBlur(50))
    im = Image.alpha_composite(im, glow_bg)
    draw = ImageDraw.Draw(im)

    # 2. Tipografías audaces para YouTube
    font_badge = get_font(22, bold=True)
    font_main = get_font(72, bold=True)
    font_sub = get_font(32, bold=True)
    font_tag = get_font(20, bold=True)
    font_brand = get_font(22, bold=True)

    # 3. Badge superior llamativo
    badge_w = 420
    draw.rounded_rectangle([(70, 65), (70 + badge_w, 115)], radius=12, fill=accent_color)
    draw.text((95, 75), badge_text, font=font_badge, fill=(2, 6, 23, 255))

    # 4. Título Principal Masivo (Impacto a primera vista)
    # Sombra del texto
    draw.text((74, 144), main_title[0], font=font_main, fill=(0, 0, 0, 180))
    draw.text((70, 140), main_title[0], font=font_main, fill=(255, 255, 255, 255))

    if len(main_title) > 1:
        draw.text((74, 234), main_title[1], font=font_main, fill=(0, 0, 0, 180))
        draw.text((70, 230), main_title[1], font=font_main, fill=accent_color)

    # 5. Etiquetas estilo "Pills" llamativas (máximo 3, cortas)
    pill_y = 350
    for tag in featured_tags:
        pill_w = 260
        draw.rounded_rectangle([(70, pill_y), (70 + pill_w, pill_y + 54)], radius=12, fill=(15, 23, 42, 230), outline=accent_color, width=2)
        draw.text((95, pill_y + 14), tag, font=font_tag, fill=(255, 255, 255, 255))
        pill_y += 72

    # 6. Íconos y Figuras de Minecraft en el tercio derecho
    card_right = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    card_draw = ImageDraw.Draw(card_right)
    card_box = [(width - 520, 60), (width - 60, height - 60)]
    card_draw.rounded_rectangle(card_box, radius=24, fill=(10, 16, 32, 235), outline=accent_color, width=3)
    card_right = Image.alpha_composite(im, card_right)
    draw = ImageDraw.Draw(card_right)

    # Compositar íconos de Minecraft agrandados con pixel-art
    icon_positions = [
        (width - 450, 120, 160),
        (width - 250, 120, 160),
        (width - 380, 310, 220),
    ]

    for i, icon_rel in enumerate(mc_icons[:3]):
        icon_path = PUBLIC_DIR / icon_rel
        if icon_path.exists():
            try:
                icon_img = Image.open(icon_path).convert("RGBA")
                target_size = icon_positions[i][2]
                icon_resized = icon_img.resize((target_size, target_size), Image.Resampling.NEAREST)
                card_right.paste(icon_resized, (icon_positions[i][0], icon_positions[i][1]), icon_resized)
            except Exception as e:
                print(f"Error loading icon {icon_path}: {e}")

    # Brand Footer
    draw.text((70, height - 70), "DRAKESCRAFT LABS  //  play.drakescraft.cl", font=font_brand, fill=accent_color)
    draw.text((width - 450, height - 70), "100% VANILLA  ·  JAVA & BEDROCK", font=font_brand, fill=(148, 163, 184, 255))

    out_path = PUBLIC_DIR / out_name
    card_right.convert("RGB").save(str(out_path), "PNG")
    print(f"[OK] Miniatura de alto impacto generada: {out_path} ({out_path.stat().st_size / 1024:.1f} KB)")

def main():
    print("=" * 60)
    print("GENERANDO MINIATURAS VISUALES DE ALTO IMPACTO (SIN EXCESO DE TEXTO)")
    print("=" * 60)

    # 1. Slimefun Capítulo 1
    create_high_impact_thumbnail(
        main_title=["SLIMEFUN 1.21", "GUÍA MAESTRA"],
        badge_text="DRAKESCRAFT  //  CAPÍTULO 1",
        accent_color=(16, 185, 129, 255), # Emerald Green
        out_name="thumbnail_sf_capitulo1.png",
        featured_tags=[
            "✦ MULTIBLOQUES 3D",
            "✦ GUI 100% VANILLA",
            "✦ COMANDOS & CLAIMS"
        ],
        mc_icons=[
            "icons/sf/ENHANCED_CRAFTING_TABLE.png",
            "icons/sf/ARMOR_FORGE.png",
            "icons/sf/ORE_CRUSHER.png"
        ]
    )

    # 2. Capítulo 3: SAORI Enjambre
    create_high_impact_thumbnail(
        main_title=["SAORI // IA", "CENTINELA SRE"],
        badge_text="INGENIERÍA DEL LAB  //  CAPÍTULO 3",
        accent_color=(6, 182, 212, 255), # Cyan Neon
        out_name="thumbnail_capitulo3.png",
        featured_tags=[
            "⚡ SONDEO RAW 25565",
            "⚡ SPARK PROFILER",
            "⚡ AUTO-HEALING"
        ],
        mc_icons=[
            "icons/mc/NETHER_STAR.png",
            "icons/sf/GPS_TRANSMITTER.png",
            "icons/mc/BEACON.png"
        ]
    )

    # 3. Capítulo 4: Cero Rollbacks
    create_high_impact_thumbnail(
        main_title=["CERO ROLLBACKS", "CÓDIGO PROPIO"],
        badge_text="INGENIERÍA DEL LAB  //  CAPÍTULO 4",
        accent_color=(245, 158, 11, 255), # Gold / Amber
        out_name="thumbnail_capitulo4.png",
        featured_tags=[
            "🛡️ REPO MAVEN PROPIO",
            "🛡️ ATOMIC BUFFER",
            "🛡️ JAVA 21 LTS"
        ],
        mc_icons=[
            "icons/mc/ENCHANTED_BOOK.png",
            "icons/mc/DIAMOND.png",
            "icons/sf/DAMASCUS_STEEL_CHESTPLATE.png"
        ]
    )

if __name__ == "__main__":
    main()
