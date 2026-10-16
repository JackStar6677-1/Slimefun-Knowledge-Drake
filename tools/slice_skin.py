#!/usr/bin/env python3
"""
Slices a 64x64 (or 64x32) standard Minecraft skin PNG into the 24 face textures
required by Steve3D in Remotion (head, torso, arm, leg faces).
"""
import os
import sys
from PIL import Image

def slice_minecraft_skin(skin_path, output_folder):
    os.makedirs(output_folder, exist_ok=True)
    skin = Image.open(skin_path).convert("RGBA")
    
    # Minecraft Skin UV Map coordinates (box: left, upper, right, lower)
    # Head (8x8x8)
    head_coords = {
        "head_top": (8, 0, 16, 8),
        "head_bottom": (16, 0, 24, 8),
        "head_right": (0, 8, 8, 16),
        "head_front": (8, 8, 16, 16),
        "head_left": (16, 8, 24, 16),
        "head_back": (24, 8, 32, 16),
    }

    # Torso (8x12x4)
    torso_coords = {
        "torso_top": (20, 16, 28, 20),
        "torso_bottom": (28, 16, 36, 20),
        "torso_right": (16, 20, 20, 32),
        "torso_front": (20, 20, 28, 32),
        "torso_left": (28, 20, 32, 32),
        "torso_back": (32, 20, 40, 32),
    }

    # Right Arm (4x12x4)
    arm_coords = {
        "arm_top": (44, 16, 48, 20),
        "arm_bottom": (48, 16, 52, 20),
        "arm_right": (40, 20, 44, 32),
        "arm_front": (44, 20, 48, 32),
        "arm_left": (48, 20, 52, 32),
        "arm_back": (52, 20, 56, 32),
    }

    # Right Leg (4x12x4)
    leg_coords = {
        "leg_top": (4, 16, 8, 20),
        "leg_bottom": (8, 16, 12, 20),
        "leg_right": (0, 20, 4, 32),
        "leg_front": (4, 20, 8, 32),
        "leg_left": (8, 20, 12, 32),
        "leg_back": (12, 20, 16, 32),
    }

    all_coords = {**head_coords, **torso_coords, **arm_coords, **leg_coords}

    for part_name, box in all_coords.items():
        cropped = skin.crop(box)
        # Upscale with Nearest Neighbor to 64x64 or 128x128 for crisp 3D rendering
        upscaled = cropped.resize((cropped.width * 8, cropped.height * 8), resample=Image.Resampling.NEAREST)
        out_file = os.path.join(output_folder, f"{part_name}.png")
        upscaled.save(out_file)
        
    print(f"[OK] Skin cortada exitosamente en 24 partes: {output_folder}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Uso: python slice_skin.py <skin.png> <carpeta_destino>")
        sys.exit(1)
    slice_minecraft_skin(sys.argv[1], sys.argv[2])
