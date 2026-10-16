#!/usr/bin/env python3
"""
tools/patch_shorts_framing.py — Aplica encuadre 3D perfecto, escala 0.62 y gestos expresivos
a todos los shorts para evitar cortes de cabeza y enriquecer las acciones del personaje.
"""
import re
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
VIDEO_SRC = ROOT / "video" / "src"

SHORTS_FILES = [
    "ShortArchitecture.tsx",
    "ShortCustomGui.tsx",
    "ShortNetworksDupe.tsx",
    "ShortSaori.tsx",
    "ShortSfCargoRules.tsx",
    "ShortSfEnergyRule.tsx",
    "ShortSfMemoryPointers.tsx",
    "ShortSfNoHoppers.tsx",
    "ShortSfReactorSafety.tsx",
]

def patch_file(fname):
    p = VIDEO_SRC / fname
    if not p.exists():
        print(f"Skipping {fname}: file not found")
        return

    content = p.read_text(encoding="utf-8")

    # 1. Cámara y ThreeCanvas
    content = re.sub(
        r"camera=\{\{\s*position:\s*\[0,\s*1\.25,\s*4\.3\],\s*fov:\s*38\s*\}\}",
        "camera={{ position: [0, 0.85, 4.2], fov: 36 }}",
        content
    )

    # 2. Posición de Steve (bajar Y y alejar Z)
    content = re.sub(
        r"pos:\s*\[0,\s*-0\.15,\s*1\.3\]",
        "pos: [0, -0.42, 0.2]",
        content
    )

    # 3. Escala reducida a 0.62
    content = re.sub(
        r"scale=\{1\.05\}",
        "scale={0.62}",
        content
    )

    # 4. Grupo de Steve
    content = re.sub(
        r"<group position=\{\[0, -0\.1, 0\]\}>",
        "<group position={[0, -0.15, 0]}>",
        content
    )

    # 5. Gestos oratorios vivos y variados
    content = re.sub(
        r'action:\s*\(frame\s*%\s*120\s*<\s*60\s*\?\s*"interact"\s*:\s*"idle"\)\s*as\s*SteveAction',
        'action: (frame % 300 < 100 ? "explain" : frame % 300 < 200 ? "point" : "nod") as SteveAction',
        content
    )

    p.write_text(content, encoding="utf-8")
    print(f"[OK] Patched {fname}")

if __name__ == "__main__":
    for f in SHORTS_FILES:
        patch_file(f)
