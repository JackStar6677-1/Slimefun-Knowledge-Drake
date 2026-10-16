#!/usr/bin/env python3
"""
tools/slice_skin.py — Cortador de Skins de Minecraft 64x64 con Soporte Completo para Doble Capa (Outer Layer).
Extrae las texturas de la Capa Base y de la Segunda Capa (Hat, Jacket, Sleeves, Pants)
para renderizado 3D de alta fidelidad en Remotion con Three.js.
"""
import os
import sys
from PIL import Image

def slice_minecraft_skin(skin_path, output_folder):
    os.makedirs(output_folder, exist_ok=True)
    skin = Image.open(skin_path).convert("RGBA")
    
    # Si la skin es formato clásico 64x32, expandir a 64x64
    if skin.size == (64, 32):
        canvas = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
        canvas.paste(skin, (0, 0))
        skin = canvas

    # ==========================================
    # 1. CAPA BASE (INNER BODY LAYER)
    # ==========================================
    head_coords = {
        "head_top": (8, 0, 16, 8),
        "head_bottom": (16, 0, 24, 8),
        "head_right": (0, 8, 8, 16),
        "head_front": (8, 8, 16, 16),
        "head_left": (16, 8, 24, 16),
        "head_back": (24, 8, 32, 16),
    }

    torso_coords = {
        "torso_top": (20, 16, 28, 20),
        "torso_bottom": (28, 16, 36, 20),
        "torso_right": (16, 20, 20, 32),
        "torso_front": (20, 20, 28, 32),
        "torso_left": (28, 20, 32, 32),
        "torso_back": (32, 20, 40, 32),
    }

    rarm_coords = {
        "arm_top": (44, 16, 48, 20),
        "arm_bottom": (48, 16, 52, 20),
        "arm_right": (40, 20, 44, 32),
        "arm_front": (44, 20, 48, 32),
        "arm_left": (48, 20, 52, 32),
        "arm_back": (52, 20, 56, 32),
    }

    larm_coords = {
        "larm_top": (36, 48, 40, 52),
        "larm_bottom": (40, 48, 44, 52),
        "larm_right": (32, 52, 36, 64),
        "larm_front": (36, 52, 40, 64),
        "larm_left": (40, 52, 44, 64),
        "larm_back": (44, 52, 48, 64),
    }

    rleg_coords = {
        "leg_top": (4, 16, 8, 20),
        "leg_bottom": (8, 16, 12, 20),
        "leg_right": (0, 20, 4, 32),
        "leg_front": (4, 20, 8, 32),
        "leg_left": (8, 20, 12, 32),
        "leg_back": (12, 20, 16, 32),
    }

    lleg_coords = {
        "lleg_top": (20, 48, 24, 52),
        "lleg_bottom": (24, 48, 28, 52),
        "lleg_right": (16, 52, 20, 64),
        "lleg_front": (20, 52, 24, 64),
        "lleg_left": (24, 52, 28, 64),
        "lleg_back": (28, 52, 32, 64),
    }

    # ==========================================
    # 2. SEGUNDA CAPA (OUTER OVERLAY LAYER)
    # ==========================================
    hat_coords = {
        "hat_top": (40, 0, 48, 8),
        "hat_bottom": (48, 0, 56, 8),
        "hat_right": (32, 8, 40, 16),
        "hat_front": (40, 8, 48, 16),
        "hat_left": (48, 8, 56, 16),
        "hat_back": (56, 8, 64, 16),
    }

    jacket_coords = {
        "jacket_top": (20, 32, 28, 36),
        "jacket_bottom": (28, 32, 36, 36),
        "jacket_right": (16, 36, 20, 48),
        "jacket_front": (20, 36, 28, 48),
        "jacket_left": (28, 36, 32, 48),
        "jacket_back": (32, 36, 40, 48),
    }

    rsleeve_coords = {
        "rsleeve_top": (44, 32, 48, 36),
        "rsleeve_bottom": (48, 32, 52, 36),
        "rsleeve_right": (40, 36, 44, 48),
        "rsleeve_front": (44, 36, 48, 48),
        "rsleeve_left": (48, 36, 52, 48),
        "rsleeve_back": (52, 36, 56, 48),
    }

    lsleeve_coords = {
        "lsleeve_top": (52, 48, 56, 52),
        "lsleeve_bottom": (56, 48, 60, 52),
        "lsleeve_right": (48, 52, 52, 64),
        "lsleeve_front": (52, 52, 56, 64),
        "lsleeve_left": (56, 52, 60, 64),
        "lsleeve_back": (60, 52, 64, 64),
    }

    rpant_coords = {
        "rpant_top": (4, 32, 8, 36),
        "rpant_bottom": (8, 32, 12, 36),
        "rpant_right": (0, 36, 4, 48),
        "rpant_front": (4, 36, 8, 48),
        "rpant_left": (8, 36, 12, 48),
        "rpant_back": (12, 36, 16, 48),
    }

    lpant_coords = {
        "lpant_top": (4, 48, 8, 52),
        "lpant_bottom": (8, 48, 12, 52),
        "lpant_right": (0, 52, 4, 64),
        "lpant_front": (4, 52, 8, 64),
        "lpant_left": (8, 52, 12, 64),
        "lpant_back": (12, 52, 16, 64),
    }

    all_coords = {
        **head_coords, **torso_coords, **rarm_coords, **larm_coords, **rleg_coords, **lleg_coords,
        **hat_coords, **jacket_coords, **rsleeve_coords, **lsleeve_coords, **rpant_coords, **lpant_coords
    }

    for part_name, box in all_coords.items():
        cropped = skin.crop(box)
        # Upscale con Nearest Neighbor para preservar píxeles nítidos y canal alfa intacto
        upscaled = cropped.resize((cropped.width * 8, cropped.height * 8), resample=Image.Resampling.NEAREST)
        out_file = os.path.join(output_folder, f"{part_name}.png")
        upscaled.save(out_file)
        
    print(f"[OK] Skin cortada con doble capa (base + overlay) en: {output_folder}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Uso: python slice_skin.py <skin.png> <carpeta_destino>")
        sys.exit(1)
    slice_minecraft_skin(sys.argv[1], sys.argv[2])
