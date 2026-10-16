import time
import re
import os
import urllib.request
from selenium import webdriver
from selenium.webdriver.edge.options import Options

VIDEO_DIR = r"C:\Users\Jack\Documents\Github\DrakesCraft-Labs\Slimefun-Knowledge-Drake\video"
SKINS_DIR = os.path.join(VIDEO_DIR, "public", "skins")
os.makedirs(SKINS_DIR, exist_ok=True)

options = Options()
# Run normal headed desktop Edge
options.add_argument("--disable-blink-features=AutomationControlled")
options.add_experimental_option("excludeSwitches", ["enable-automation"])
options.add_experimental_option('useAutomationExtension', False)

print("Abriendo Edge para cargar NameMC...")
driver = webdriver.Edge(options=options)

try:
    url = "https://namemc.com/profile/JackStar6677.1"
    driver.get(url)
    
    # Wait up to 30 seconds for verification or page load
    for i in range(30):
        title = driver.title
        print(f"[{i+1}/30s] Titulo actual: {title}")
        if "Un momento" not in title and ("JackStar" in title or "NameMC" in title or "Skins" in title):
            print("Verificación de Cloudflare completada o superada!")
            break
        time.sleep(1)
        
    time.sleep(2)
    html = driver.page_source
    
    # Extract all skin hashes
    # Patterns: /skin/([a-f0-9]{16,64}) or textures.minecraft.net/texture/([a-f0-9]{64})
    skin_hashes = re.findall(r'/skin/([a-f0-9]{16,64})', html)
    skin_hashes = list(dict.fromkeys(skin_hashes))
    
    textures = re.findall(r'textures\.minecraft\.net/texture/([a-f0-9]{64})', html)
    textures = list(dict.fromkeys(textures))
    
    print(f"\nSkins detectadas: {len(skin_hashes)} enlaces /skin/, {len(textures)} texturas directas")
    
    downloaded = []
    
    # Download textures first (highest quality from Mojang)
    for idx, tex in enumerate(textures, 1):
        t_url = f"https://textures.minecraft.net/texture/{tex}"
        dest = os.path.join(SKINS_DIR, f"jack_skin_{idx:02d}_{tex[:8]}.png")
        try:
            req = urllib.request.Request(t_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as resp, open(dest, "wb") as out:
                out.write(resp.read())
            downloaded.append(dest)
            print(f"Descargada textura {idx}: {dest}")
        except Exception as e:
            print(f"Error descargando {t_url}: {e}")
            
    # Also download from namemc skin CDN
    for idx, sh in enumerate(skin_hashes, len(downloaded) + 1):
        s_url = f"https://s.namemc.com/i/{sh}.png"
        dest = os.path.join(SKINS_DIR, f"jack_namemc_{idx:02d}_{sh[:8]}.png")
        try:
            req = urllib.request.Request(s_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as resp, open(dest, "wb") as out:
                out.write(resp.read())
            downloaded.append(dest)
            print(f"Descargada skin NameMC {idx}: {dest}")
        except Exception as e:
            print(f"Error descargando {s_url}: {e}")
            
    print(f"\nTotal de skins descargadas en {SKINS_DIR}: {len(downloaded)}")
    
    # Write rotation manifest
    manifest_path = os.path.join(VIDEO_DIR, "src", "skin_rotation.json")
    import json
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump({
            "player": "JackStar6677",
            "total_skins": len(downloaded),
            "skins": [os.path.basename(p) for p in downloaded]
        }, f, indent=2)
    print(f"Manifiesto de rotación guardado en: {manifest_path}")

finally:
    driver.quit()
