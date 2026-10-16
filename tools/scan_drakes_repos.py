#!/usr/bin/env python3
"""
Scanner y Analizador Maestro de Repositorios para DrakesCraft-Labs y JackStar.
Audita automáticamente todos los repositorios locales (170+), extrae:
  - plugin.yml / paper-plugin.yml (metadatos, dependencias, comandos, permisos)
  - pom.xml (artefacto, versión, dependencias Maven)
  - Clases Java, ítems Slimefun (SlimefunItemStack), multibloques, máquinas, listeners
  - Multiverse Suite (MultiverseNets, MultiverseCreatures) y sus componentes
  - Genera 'knowledge/master_repos_index.json' y 'docs/REPOSITORIOS_DRAKES_MASTER.md'
"""

import os
import re
import json
import pathlib
import xml.etree.ElementTree as ET
from collections import defaultdict

ROOT = pathlib.Path(__file__).resolve().parent.parent
DRAKES_DIR = pathlib.Path(r"C:\Users\Jack\Documents\Github\DrakesCraft-Labs")
JACKSTAR_DIR = pathlib.Path(r"C:\Users\Jack\Documents\Github\JackStar6677-1")

CATEGORIES = {
    "multiverse_suite": [
        "MultiverseNets", "MultiverseCreatures"
    ],
    "core_framework": [
        "Slimefun4-Drake", "Slimefun4-Igdrassil", "Slimefun-Rust", "Drakes-Suites",
        "Pylon-Drake", "SefiLib", "GuizhanLib", "InfinityLib-Drake", "KinematicCore-drake", "Rebar-Drake"
    ],
    "networks_logistics": [
        "NetworksV6-drake", "NetworksExpansion", "NetworksExpansion-Igdrassil",
        "Networks---Better-Compatibility-Unofficial-", "Auto-Crafter-drake",
        "ChestTerminal-drake", "Simple-Storage-drake", "SfBetterChests-drake",
        "PrivateStorage", "Barrels-drake"
    ],
    "endgame_tech": [
        "InfinityExpansion-drake", "Supreme-Drake", "TranscEndence-drake",
        "Quaptics-drake", "Galactifun2-drake", "Galaxyfun-drake", "SlimefunNukes",
        "EquivalencyTech", "ObsidianExpansion"
    ],
    "machines_automation": [
        "FluffyMachines-drake", "FoxyMachines-drake", "GlobiaMachines",
        "LiteXpansion-drake", "SlimeTinker-drake", "ElectricSpawners-drake",
        "FN-FAL-s-Amplifications-drake", "SFPortalGun", "SensibleToolbox-drake"
    ],
    "magic_alchemy": [
        "AlchimiaVitae-drake", "CrystamaeHistoria-drake", "MagicXpansion",
        "RelicsOfCthonia-drake", "SoulJars-drake", "SpiritsUnchained-drake",
        "Netheopoiesis", "PotionExpansion-drake"
    ],
    "agriculture_nature": [
        "ExoticGarden-drake", "Gastronomicon-drake", "SlimyBees", "SlimyTreeTaps-drake",
        "GeneticChickengineering-Reborn-drake", "Wildernether-drake", "FlowerPower-drake"
    ],
    "combat_gear": [
        "ExtraGear-drake", "ExtraTools-drake", "ExtraUtils-drake", "Obsidian-Armor",
        "SlimefunWarfare-Drake", "Military-Arsenal", "MissileWarfare-drake",
        "ArmorPlus-drake", "BetterTools-drake"
    ],
    "server_utilities": [
        "EssentialsX-Drake", "PlayerVaultZ-Drake", "ProtectionStones-Drake",
        "S-PlayerWarps-Drake", "sbank", "InvSwitcher-Drake", "HeadLimiter-drake",
        "SlimeHUD-drake", "SlimeCustomizer", "RykenSlimeCustomizer-EN-drake",
        "WorldEditSlimefun-drake", "WorldwideChat"
    ]
}

def classify_repo(name: str) -> str:
    for cat, members in CATEGORIES.items():
        if name in members:
            return cat
    lname = name.lower()
    if "multiverse" in lname:
        return "multiverse_suite"
    if "network" in lname or "storage" in lname or "chest" in lname:
        return "networks_logistics"
    if "machine" in lname or "tech" in lname:
        return "machines_automation"
    if "magic" in lname or "alchimia" in lname or "relic" in lname or "soul" in lname:
        return "magic_alchemy"
    if "armor" in lname or "gear" in lname or "tool" in lname or "warfare" in lname or "weapon" in lname:
        return "combat_gear"
    if "farm" in lname or "bee" in lname or "garden" in lname or "tree" in lname or "chick" in lname:
        return "agriculture_nature"
    if "sf" in lname or "slime" in lname or "expansion" in lname:
        return "endgame_tech"
    return "other_addons"

def parse_yaml_simple(text: str) -> dict:
    """Parser liviano y tolerante para plugin.yml sin requerir dependencias complejas."""
    data = {}
    current_key = None
    list_items = []
    
    for line in text.splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if ":" in line and not line.startswith("-"):
            if current_key and list_items:
                data[current_key] = list_items
                list_items = []
            parts = line.split(":", 1)
            k = parts[0].strip()
            v = parts[1].strip() if len(parts) > 1 else ""
            current_key = k
            if v:
                # Quitar comillas
                v = v.strip("'\"")
                if v.startswith("[") and v.endswith("]"):
                    items = [x.strip(" '\"") for x in v[1:-1].split(",") if x.strip()]
                    data[k] = items
                    current_key = None
                else:
                    data[k] = v
        elif line.startswith("-") and current_key:
            val = line[1:].strip().strip("'\"")
            list_items.append(val)
            
    if current_key and list_items:
        data[current_key] = list_items
    return data

def parse_pom_xml(pom_path: pathlib.Path) -> dict:
    try:
        tree = ET.parse(pom_path)
        root = tree.getroot()
        ns = {"m": "http://maven.apache.org/POM/4.0.0"}
        
        def find_text(elem, tag):
            res = elem.find(f"m:{tag}", ns)
            if res is None:
                res = elem.find(tag)
            return res.text.strip() if res is not None and res.text else None

        group = find_text(root, "groupId")
        artifact = find_text(root, "artifactId")
        version = find_text(root, "version")
        
        # Parent fallback
        parent = root.find("m:parent", ns) or root.find("parent")
        if parent is not None:
            if not group:
                group = find_text(parent, "groupId")
            if not version:
                version = find_text(parent, "version")
                
        deps = []
        deps_elem = root.find("m:dependencies", ns) or root.find("dependencies")
        if deps_elem is not None:
            for d in (deps_elem.findall("m:dependency", ns) or deps_elem.findall("dependency")):
                aid = find_text(d, "artifactId")
                gid = find_text(d, "groupId")
                ver = find_text(d, "version")
                if aid:
                    deps.append(f"{gid}:{aid}" if gid else aid)
                    
        return {
            "groupId": group,
            "artifactId": artifact,
            "version": version,
            "dependencies": deps
        }
    except Exception:
        return {}

def scan_java_sources(repo_path: pathlib.Path) -> dict:
    src_dir = repo_path / "src" / "main" / "java"
    if not src_dir.exists():
        src_dir = repo_path / "src"
    if not src_dir.exists():
        return {"java_files": 0, "lines_of_code": 0, "sf_items": [], "multiblocks": [], "devices": []}

    java_files = list(src_dir.rglob("*.java"))
    loc = 0
    sf_items = []
    multiblocks = []
    devices = []
    has_listeners = False

    re_sf_item = re.compile(r'SlimefunItemStack\s+([A-Z0-9_]+)\s*=\s*new\s+SlimefunItemStack\(\s*["\']([A-Z0-9_]+)["\']\s*,\s*([^,]+)\s*,\s*["\']([^"\']+)["\']')
    re_multiblock = re.compile(r'class\s+([A-Za-z0-9_]+)\s+extends\s+MultiBlockMachine')
    re_device_type = re.compile(r'public\s+enum\s+DeviceType')

    for jf in java_files:
        try:
            content = jf.read_text(encoding="utf-8", errors="ignore")
            lines = content.splitlines()
            loc += len(lines)
            
            if "@EventHandler" in content:
                has_listeners = True

            for m in re_sf_item.finditer(content):
                var_name, item_id, mat, display_name = m.groups()
                sf_items.append({
                    "id": item_id,
                    "name": display_name,
                    "material": mat.replace("Material.", "").strip(),
                    "file": jf.name
                })
                
            for m in re_multiblock.finditer(content):
                multiblocks.append({
                    "class": m.group(1),
                    "file": jf.name
                })

            if "MultiverseNets" in repo_path.name or "DeviceType" in jf.name:
                for line in lines:
                    m_dev = re.search(r'^\s*([A-Z0-9_]+)\s*\(', line)
                    if m_dev and not line.strip().startswith("//"):
                        devices.append(m_dev.group(1))
        except Exception:
            pass

    return {
        "java_files": len(java_files),
        "lines_of_code": loc,
        "sf_items": sf_items,
        "multiblocks": multiblocks,
        "devices": list(set(devices)),
        "has_listeners": has_listeners
    }

def scan_all_repositories() -> dict:
    results = {}
    target_dirs = [DRAKES_DIR, JACKSTAR_DIR]

    for base_dir in target_dirs:
        if not base_dir.exists():
            continue
        for repo_dir in sorted(base_dir.iterdir()):
            if not repo_dir.is_dir() or not (repo_dir / ".git").exists():
                continue
            name = repo_dir.name
            if name in results:
                continue

            category = classify_repo(name)
            
            # plugin.yml
            plugin_data = {}
            for cand in [
                repo_dir / "src" / "main" / "resources" / "plugin.yml",
                repo_dir / "src" / "main" / "resources" / "paper-plugin.yml",
                repo_dir / "plugin.yml"
            ]:
                if cand.exists():
                    try:
                        raw = cand.read_text(encoding="utf-8", errors="ignore")
                        plugin_data = parse_yaml_simple(raw)
                        break
                    except Exception:
                        pass

            # pom.xml
            pom_data = {}
            pom_path = repo_dir / "pom.xml"
            if pom_path.exists():
                pom_data = parse_pom_xml(pom_path)

            # Java source analysis
            java_data = scan_java_sources(repo_dir)

            # Docs / Readme
            readme = repo_dir / "README.md"
            has_wiki_es = (repo_dir / "wiki-es").exists() or (repo_dir / "Wiki-es").exists()
            has_wiki_en = (repo_dir / "wiki-en").exists() or (repo_dir / "Wiki-en").exists()
            has_docs = (repo_dir / "docs").exists()

            results[name] = {
                "name": name,
                "category": category,
                "path": str(repo_dir),
                "is_plugin": bool(plugin_data.get("name")),
                "plugin_name": plugin_data.get("name"),
                "version": plugin_data.get("version") or pom_data.get("version"),
                "main_class": plugin_data.get("main"),
                "api_version": plugin_data.get("api-version"),
                "depend": plugin_data.get("depend", []),
                "softdepend": plugin_data.get("softdepend", []),
                "commands": list(plugin_data.get("commands", {}).keys()) if isinstance(plugin_data.get("commands"), dict) else [],
                "pom": pom_data,
                "java": java_data,
                "documentation": {
                    "has_readme": readme.exists(),
                    "has_wiki_es": has_wiki_es,
                    "has_wiki_en": has_wiki_en,
                    "has_docs": has_docs,
                    "readme_size": readme.stat().st_size if readme.exists() else 0
                }
            }

    return results

def generate_markdown_report(data: dict) -> str:
    total_repos = len(data)
    total_plugins = sum(1 for r in data.values() if r["is_plugin"])
    total_loc = sum(r["java"]["lines_of_code"] for r in data.values())
    total_java_files = sum(r["java"]["java_files"] for r in data.values())
    total_sf_items = sum(len(r["java"]["sf_items"]) for r in data.values())
    total_multiblocks = sum(len(r["java"]["multiblocks"]) for r in data.values())

    lines = [
        "# 📚 Catálogo Maestro de Repositorios y Addons — DrakesCraft",
        "> **Auditoría Global Automatizada del Código Fuente**  ",
        f"> *Generado automáticamente el 2026-10-15 | Base de Conocimientos DrakesCraft-Labs*\n",
        "---",
        "",
        "## 📊 Métricas Globales del Ecosistema",
        f"- **Repositorios auditados:** `{total_repos}`",
        f"- **Plugins activos con plugin.yml:** `{total_plugins}`",
        f"- **Archivos de código fuente Java:** `{total_java_files:,}`",
        f"- **Líneas de código Java (LOC):** `{total_loc:,}`",
        f"- **Ítems Slimefun extraídos en código:** `{total_sf_items:,}`",
        f"- **Máquinas Multibloque detectadas:** `{total_multiblocks}`",
        "",
        "---",
        "",
        "## 🧭 Repositorios por Categoría y Dominio",
        ""
    ]

    by_cat = defaultdict(list)
    for r in data.values():
        by_cat[r["category"]].append(r)

    cat_titles = {
        "multiverse_suite": "🌟 Multiverse Suite (Soberano Chagui68)",
        "core_framework": "🏛️ Core Frameworks & Slimefun Engine",
        "networks_logistics": "📦 Redes Digitales, Almacenamiento & Logística",
        "endgame_tech": "⚛️ Tecnología Avanzada, Expansiones & Endgame",
        "machines_automation": "⚙️ Máquinas Industriales & Automatización",
        "magic_alchemy": "🔮 Magia, Alquimia & Sistemas Místicos",
        "agriculture_nature": "🌿 Agricultura, Genética & Naturaleza",
        "combat_gear": "⚔️ Armamento, Combate & Herramientas",
        "server_utilities": "🛠️ Suites de Servidor, Seguridad & Economía",
        "other_addons": "🧩 Otros Addons & Utilidades Complementarias"
    }

    for cat_key, cat_title in cat_titles.items():
        repos_in_cat = by_cat.get(cat_key, [])
        if not repos_in_cat:
            continue
            
        lines.append(f"### {cat_title} (`{len(repos_in_cat)}` repos)")
        lines.append("")
        lines.append("| Repositorio | Plugin Name | Versión | Dependencias Clave | Ítems / Multibloques | Documentación |")
        lines.append("| :--- | :--- | :--- | :--- | :--- | :--- |")
        
        for r in sorted(repos_in_cat, key=lambda x: x["name"]):
            pname = r["plugin_name"] or "-"
            ver = r["version"] or "-"
            deps = []
            if r["depend"]:
                deps.extend(r["depend"] if isinstance(r["depend"], list) else [str(r["depend"])])
            dep_str = ", ".join(deps[:3]) if deps else "-"
            if len(deps) > 3:
                dep_str += f" (+{len(deps)-3})"
                
            n_items = len(r["java"]["sf_items"])
            n_multi = len(r["java"]["multiblocks"])
            counts = f"{n_items} ítems" if n_items else ""
            if n_multi:
                counts = f"{counts}, {n_multi} MB" if counts else f"{n_multi} MB"
            if not counts:
                counts = f"{r['java']['java_files']} clases"
                
            docs = []
            if r["documentation"]["has_wiki_es"]:
                docs.append("Wiki-ES")
            elif r["documentation"]["has_wiki_en"]:
                docs.append("Wiki-EN")
            if r["documentation"]["has_docs"]:
                docs.append("Docs")
            if r["documentation"]["has_readme"]:
                docs.append("README")
            doc_str = " · ".join(docs) if docs else "-"

            lines.append(f"| **`{r['name']}`** | `{pname}` | `{ver}` | {dep_str} | {counts} | {doc_str} |")
            
        lines.append("")

    return "\n".join(lines)

def main():
    print("Iniciando escaneo masivo de repositorios en DrakesCraft-Labs y JackStar...")
    data = scan_all_repositories()
    print(f"Escaneo finalizado: {len(data)} repositorios analizados.")

    # Guardar JSON completo
    out_json = ROOT / "knowledge" / "master_repos_index.json"
    out_json.parent.mkdir(parents=True, exist_ok=True)
    out_json.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Base de conocimiento JSON guardada en: {out_json}")

    # Guardar Reporte Markdown Maestro
    report_md = generate_markdown_report(data)
    out_md = ROOT / "docs" / "REPOSITORIOS_DRAKES_MASTER.md"
    out_md.parent.mkdir(parents=True, exist_ok=True)
    out_md.write_text(report_md, encoding="utf-8")
    print(f"Reporte maestro Markdown guardado en: {out_md}")

if __name__ == "__main__":
    main()
