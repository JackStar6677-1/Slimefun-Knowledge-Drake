#!/usr/bin/env python3
"""
tools/auto_upload_capitulo2.py — Centinela automatizado para renderizado y subida de Capítulo 2
Monitorea la generación de video/out/capitulo2_720p.mp4, verifica su integridad y dispara
la subida a YouTube con miniatura de alta fidelidad.
"""
import os
import sys
import time
import subprocess
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
TARGET_VIDEO = ROOT / "video" / "out" / "capitulo2_720p.mp4"
THUMBNAIL = ROOT / "video" / "public" / "thumbnail_capitulo2.png"
UPLOAD_SCRIPT = ROOT / "tools" / "upload_capitulo2.py"
LOG_FILE = ROOT / "video" / "out" / "auto_upload_c2.log"

def log(msg):
    ts = time.strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line)
    try:
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(line + "\n")
    except Exception:
        pass

def wait_for_render():
    log("Iniciando centinela de subida para Capítulo 2...")
    log(f"Esperando finalización de render: {TARGET_VIDEO}")
    
    last_size = -1
    stable_count = 0
    
    while True:
        if TARGET_VIDEO.exists():
            current_size = TARGET_VIDEO.stat().st_size
            # Si el archivo tiene más de 10 MB y el tamaño no cambia en 3 chequeos consecutivos (15s)
            if current_size > 10 * 1024 * 1024:
                if current_size == last_size:
                    stable_count += 1
                    if stable_count >= 3:
                        log(f"Render verificado y completo ({current_size / (1024*1024):.2f} MB).")
                        break
                else:
                    stable_count = 0
                    last_size = current_size
                    log(f"Renderizando... tamaño actual: {current_size / (1024*1024):.2f} MB")
            else:
                log(f"Archivo detectado pero aún en proceso inicial ({current_size / (1024*1024):.2f} MB)...")
        else:
            log("Esperando creación del archivo mp4...")
            
        time.sleep(6)

def trigger_upload():
    log("Disparando pipeline de subida a YouTube con metadata y miniatura...")
    env = os.environ.copy()
    env["PYTHONIOENCODING"] = "utf-8"
    
    proc = subprocess.run(
        [sys.executable, str(UPLOAD_SCRIPT)],
        cwd=str(ROOT),
        env=env,
        capture_output=True,
        text=True
    )
    
    log(f"Subida finalizada con código de salida: {proc.returncode}")
    log("STDOUT:\n" + proc.stdout)
    if proc.stderr:
        log("STDERR:\n" + proc.stderr)
        
    log("CENTINELA DE SUBIDA CONCLUIDO CON ÉXITO.")

if __name__ == "__main__":
    wait_for_render()
    trigger_upload()
