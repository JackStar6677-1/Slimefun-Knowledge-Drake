#!/usr/bin/env python3
"""
gen_sf_capitulo1_audio.py — Generador de locución y storyboard para:
"Slimefun en DrakesCraft — Capítulo 1: La Guía Maestra, Multibloques & Comandos Iniciales"
Voz: es-CL-LorenzoNeural (Jack, Sysadmin & Guía Oficial de DrakesCraft).
"""
import asyncio
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from voice_engine import generate_speech

AUDIO_DIR = ROOT / "video" / "public" / "audio"
JSON_OUT = ROOT / "video" / "src" / "sf-capitulo1-storyboard.json"

SECTIONS = [
    {
        "id": "sf1_p01_bienvenida",
        "file": "sf1_p01_bienvenida.mp3",
        "title": "BIENVENIDOS A DRAKESCRAFT: LOBBY & MODALIDADES",
        "subtitle": "Conexión: play.drakescraft.cl:25565 // Usa /lobby y /modalidades",
        "badge": "01 // CONEXIÓN & LOBBY: /MODALIDADES",
        "spoken_text": (
            "Bienvenidos al verdadero capítulo uno de nuestra guía oficial de Slimefun en DrakesCraft. "
            "Al conectarte en play punto drakescraft punto c e l en el puerto dos cinco cinco seis cinco, "
            "no apareces directamente en el mundo de supervivencia, sino en el Lobby principal. "
            "Desde el Lobby debes usar el comando barra modalidades para abrir el selector y elegir tu servidor. "
            "Mucha atención: las modalidades que tienen Slimefun son tres: Slimefun Survival, OneBlock y SkyBlock. "
            "Nuestra modalidad Clásico es supervivencia vanilla tradicional y no tiene Slimefun."
        ),
        "text": (
            "Conéctate a play.drakescraft.cl:25565 (Java & Bedrock). "
            "Apareces en el Lobby principal (/lobby). Usa /modalidades para elegir tu servidor. "
            "Modalidades CON Slimefun: Slimefun Survival, OneBlock y SkyBlock. "
            "¡Ojo! La modalidad Clásico es 100% Vanilla y NO tiene Slimefun."
        ),
        "action": "explain",
        "camera": "close",
        "diagram": "modalidades_menu"
    },
    {
        "id": "sf1_p02_comandos_inicio",
        "file": "sf1_p02_comandos_inicio.mp3",
        "title": "INICIO EN SLIMEFUN & COMANDOS ESENCIALES",
        "subtitle": "/rtp para mundo salvaje, /sethome para tu base y /home",
        "badge": "02 // COMANDOS DE SUPERVIVENCIA: /RTP & /SETHOME",
        "spoken_text": (
            "Una vez que ingresas a la modalidad Slimefun desde el selector, comenzarás tu aventura. "
            "Para salir al mundo salvaje y buscar recursos, escribe barra rtp en el chat. "
            "Este comando te teletransportará de forma aleatoria y completamente segura a una zona virgen. "
            "Cuando encuentres un terreno que te guste, utiliza barra sethome con un nombre para fijar tu base y volver cuando quieras con barra home. "
            "Y si deseas regresar al inicio o cambiar de servidor, barra lobby te llevará al punto de encuentro."
        ),
        "text": (
            "Al ingresar a la modalidad Slimefun, escribe /rtp para teletransportarte de forma aleatoria y segura al mundo salvaje. "
            "Fija tu base con /sethome <nombre> y regresa cuando quieras con /home <nombre>. "
            "Para volver al selector en cualquier momento, usa /lobby o /modalidades."
        ),
        "action": "point",
        "camera": "normal",
        "diagram": "commands_hud"
    },
    {
        "id": "sf1_p03_protecciones",
        "file": "sf1_p03_protecciones.mp3",
        "title": "PROTECCIÓN DE TERRENO Y COFRES",
        "subtitle": "Sistema ProtectionStones (/ps) para blindar tu territorio",
        "badge": "03 // SEGURIDAD: /PS PROTECTION STONES",
        "spoken_text": (
            "En un servidor técnico con reactores y almacenamiento digital, proteger tus recursos es primordial. "
            "En DrakesCraft usamos ProtectionStones. Al colocar tu bloque de protección en el suelo, "
            "se creará automáticamente un cubo protegido donde ningún extraño puede romper bloques, abrir cofres ni usar tus máquinas. "
            "Escribe barra ps para abrir el menú de gestión, añadir amigos o ajustar los límites de tu terreno."
        ),
        "text": (
            "Proteger tus recursos es primordial. En DrakesCraft usamos ProtectionStones (/ps). "
            "Al colocar tu bloque de protección en el suelo, se crea un cubo blindado donde nadie puede romper bloques, "
            "abrir cofres ni tocar tus máquinas. Escribe /ps para añadir amigos o gestionar límites."
        ),
        "action": "interact",
        "camera": "normal",
        "diagram": "protection_zone"
    },
    {
        "id": "sf1_p04_pwarp_xp",
        "file": "sf1_p04_pwarp_xp.mp3",
        "title": "WARPS COMUNITARIOS Y GRANJAS DE EXPERIENCIA",
        "subtitle": "Acceso a granjas públicas de XP mediante /pwarp",
        "badge": "04 // ECONOMÍA: /PWARP GRANJAS DE XP",
        "spoken_text": (
            "Slimefun exige niveles de experiencia de Minecraft para desbloquear tecnologías. "
            "No necesitas pasar horas matando monstruos en la oscuridad: escribe barra pwarp en el chat "
            "para explorar los warps públicos creados por la comunidad. "
            "Allí encontrarás granjas de experiencia masivas y abiertas donde podrás subir a nivel treinta en cuestión de minutos."
        ),
        "text": (
            "Slimefun exige niveles de experiencia para desbloquear tecnologías. "
            "No pases horas matando mobs: escribe /pwarp para explorar warps comunitarios. "
            "Allí encontrarás granjas masivas de XP para subir a nivel 30 en cuestión de minutos."
        ),
        "action": "interact",
        "camera": "wide",
        "diagram": "pwarp_menu"
    },
    {
        "id": "sf1_p05_sf_guide",
        "file": "sf1_p05_sf_guide.mp3",
        "title": "LA GUÍA MAESTRA DE SLIMEFUN",
        "subtitle": "El comando /sf guide y el libro enciclopédico",
        "badge": "05 // MANUAL: /SF GUIDE EN VIVO",
        "spoken_text": (
            "El corazón de toda la tecnología es la Guía de Slimefun. Puedes abrirla en cualquier momento escribiendo barra sf guide, "
            "o usando el libro de Slimefun que recibes al iniciar. "
            "La guía se despliega dentro de la interfaz gráfica real de Minecraft, "
            "con iconos nativos organizados en categorías como Herramientas, Armaduras, Máquinas Básicas, Electricidad y Logística."
        ),
        "text": (
            "El corazón tecnológico es la Guía de Slimefun. Ábrela con /sf guide o con tu libro inicial. "
            "Se despliega en la GUI nativa de Minecraft, organizada en categorías: "
            "Herramientas, Armaduras, Máquinas Básicas, Electricidad, Logística y Almacenamiento."
        ),
        "action": "interact",
        "camera": "close",
        "diagram": "guide_categories"
    },
    {
        "id": "sf1_p06_investigaciones",
        "file": "sf1_p06_investigaciones.mp3",
        "title": "EL SISTEMA DE INVESTIGACIÓN",
        "subtitle": "Canje de niveles de experiencia para desbloquear tecnología",
        "badge": "06 // PROGRESSION: RESEARCH TREES",
        "spoken_text": (
            "Al abrir cualquier categoría notarás que muchos ítems aparecen marcados como bloqueados. "
            "Para aprender a fabricarlos, simplemente haz clic sobre el ítem. "
            "El servidor consumirá una cantidad determinada de niveles de experiencia y desbloqueará la receta de forma permanente. "
            "Por eso es tan útil visitar antes las granjas públicas de experiencia con barra pwarp."
        ),
        "text": (
            "Al abrir una categoría, verás ítems bloqueados. Haz clic sobre ellos para investigarlos. "
            "El servidor consumirá niveles de XP y desbloqueará la receta permanentemente. "
            "Por eso es fundamental aprovechar las granjas de /pwarp."
        ),
        "action": "idle",
        "camera": "normal",
        "diagram": "research_tree"
    },
    {
        "id": "sf1_p07_recetas_gui",
        "file": "sf1_p07_recetas_gui.mp3",
        "title": "CÓMO LEER UNA RECETA DE SLIMEFUN",
        "subtitle": "Matriz de 3x3, ingredientes y la máquina requerida",
        "badge": "07 // CRAFTING: RECIPE MATRIX & MACHINES",
        "spoken_text": (
            "Cuando haces clic en un ítem ya investigado, la guía te mostrará su ficha técnica. "
            "A la izquierda verás la matriz de tres por tres con los componentes exactos, "
            "y en el centro te indicará en qué máquina multibloque debes fabricarlo. "
            "Los ítems de Slimefun no se craftean en una mesa de crafteo común de Minecraft: requieren multibloques especializados."
        ),
        "text": (
            "Al hacer clic en un ítem investigado, verás su ficha técnica: matriz 3x3 con componentes "
            "y la máquina multibloque exacta donde debe fabricarse. "
            "Los ítems de Slimefun requieren multibloques especializados, no la mesa vanilla."
        ),
        "action": "interact",
        "camera": "close",
        "diagram": "recipe_gui"
    },
    {
        "id": "sf1_p08_multibloques_intro",
        "file": "sf1_p08_multibloques_intro.mp3",
        "title": "QUÉ ES UN MULTIBLOQUE",
        "subtitle": "Estructuras en el mundo real que cobran vida mediante interacción",
        "badge": "08 // WORLD BUILD: MULTIBLOCK ESSENTIALS",
        "spoken_text": (
            "Un multibloque es una máquina construida directamente en el mundo colocando bloques vanilla de Minecraft en una disposición específica. "
            "No tienen un bloque único de bloque de máquina: la combinación física de bloques normales forma la estructura. "
            "Para usarlos, introduces los ingredientes dentro del dispensador y haces clic derecho en la pieza de interacción para fabricar."
        ),
        "text": (
            "Un multibloque es una máquina construida en el mundo combinando bloques vanilla en una disposición fija. "
            "No son un solo bloque: la estructura completa cobra vida al interactuar. "
            "Colocas los materiales en el dispensador y haces clic derecho en la pieza de activación."
        ),
        "action": "idle",
        "camera": "normal",
        "diagram": "multiblock_concept"
    },
    {
        "id": "sf1_p09_enhanced_table",
        "file": "sf1_p09_enhanced_table.mp3",
        "title": "MULTIBLOQUE 1: MESA DE TRABAJO MEJORADA",
        "subtitle": "Dispensador en la base + Mesa de crafteo encima",
        "badge": "09 // CORE MACHINE: ENHANCED CRAFTING TABLE",
        "spoken_text": (
            "El primer multibloque que debes construir obligatoriamente es la Mesa de Trabajo Mejorada. "
            "Coloca un dispensador en el suelo mirando hacia arriba o al frente, y pon una mesa de crafteo justo encima. "
            "Dentro del dispensador colocas los ingredientes siguiendo la receta de la guía, y haces clic derecho en la mesa de crafteo. "
            "El ítem resultante aparecerá en el dispensador. Es el corazón del noventa por ciento de los componentes iniciales."
        ),
        "text": (
            "El primer multibloque obligatorio: Mesa de Trabajo Mejorada. "
            "Coloca un dispensador en el suelo y una mesa de crafteo justo encima. "
            "Pon los ingredientes dentro del dispensador y haz clic derecho en la mesa de crafteo. "
            "El resultado aparecerá dentro del dispensador. Es la base de casi todo Slimefun."
        ),
        "action": "interact",
        "camera": "normal",
        "diagram": "enhanced_crafting_table"
    },
    {
        "id": "sf1_p10_grindstone",
        "file": "sf1_p10_grindstone.mp3",
        "title": "MULTIBLOQUE 2: TRITURADORA",
        "subtitle": "Dispensador en la base + Valla de roble encima",
        "badge": "10 // PROCESSING: GRIND STONE",
        "spoken_text": (
            "El segundo multibloque es la Trituradora o Grindstone. "
            "Se construye colocando un dispensador en el suelo y una valla de roble encima. "
            "Sirve para moler trigo en harina de trigo para comida avanzada, triturar huesos en polvo de hueso eficiente, "
            "y pulverizar materiales geológicos básicos. Basta con poner el material en el dispensador y hacer clic derecho en la valla."
        ),
        "text": (
            "Segundo multibloque: Trituradora (Grind Stone). "
            "Coloca un dispensador en el suelo y una valla de roble encima. "
            "Muele trigo en harina, huesos en polvo eficiente y procesa recursos iniciales. "
            "Coloca el material en el dispensador y haz clic derecho en la valla."
        ),
        "action": "interact",
        "camera": "close",
        "diagram": "grind_stone"
    },
    {
        "id": "sf1_p11_armor_forge",
        "file": "sf1_p11_armor_forge.mp3",
        "title": "MULTIBLOQUE 3: FORJA DE ARMADURAS",
        "subtitle": "Dispensador en la base + Yunque encima",
        "badge": "11 // METALLURGY: ARMOR FORGE",
        "spoken_text": (
            "Para fabricar equipamiento defensivo de alto nivel necesitarás la Forja de Armaduras. "
            "Se arma colocando un dispensador y un yunque normal encima de él. "
            "Aquí podrás forjar armaduras de acero de Damasco, armaduras reforzadas y trajes con resistencia química "
            "que te protegerán contra la radiación y los ambientes hostiles de los reactores."
        ),
        "text": (
            "Para equipo defensivo superior necesitas la Forja de Armaduras: dispensador con un yunque encima. "
            "Permite forjar armaduras de acero de Damasco, aleaciones reforzadas "
            "y trajes con protección contra radiación para ambientes industriales hostiles."
        ),
        "action": "idle",
        "camera": "normal",
        "diagram": "armor_forge"
    },
    {
        "id": "sf1_p12_ore_crusher",
        "file": "sf1_p12_ore_crusher.mp3",
        "title": "MULTIBLOQUE 4: TRITURADOR DE MINERALES",
        "subtitle": "Dispensador + Valla del Nether + 2 Barrotes de Hierro",
        "badge": "12 // RESOURCES: ORE CRUSHER",
        "spoken_text": (
            "El Triturador de Minerales es tu primera máquina de multiplicación de recursos. "
            "Se construye con un dispensador, una valla de ladrillo del Nether encima, y dos barrotes de hierro a los lados. "
            "Al procesar menas de hierro, oro o cobre, las convierte en polvos minerales duplicados, "
            "otorgándote el doble de lingotes y generando los polvos necesarios para sintetizar aleaciones metálicas."
        ),
        "text": (
            "El Triturador de Minerales multiplica recursos: dispensador, valla de ladrillo del Nether encima "
            "y dos barrotes de hierro a los lados. "
            "Convierte menas en polvos duplicados, rindiendo el doble de lingotes y polvos esenciales para aleaciones."
        ),
        "action": "interact",
        "camera": "wide",
        "diagram": "ore_crusher"
    },
    {
        "id": "sf1_p13_smeltery",
        "file": "sf1_p13_smeltery.mp3",
        "title": "MULTIBLOQUE 5: HORNO DE FUNDICIÓN",
        "subtitle": "Fuego inferior + Caldero + Valla del Nether + Dispensador",
        "badge": "13 // FOUNDRY: THE SMELTERY",
        "spoken_text": (
            "La Smeltery o Horno de Fundición es la fundición industrial por excelencia. "
            "Requiere encender fuego en el suelo con pedernal y acero, colocar un caldero encima del fuego, "
            "una valla de ladrillo del Nether encima del caldero, y un dispensador arriba mirando hacia abajo. "
            "Aquí combinarás polvos de cobre y estaño para fundir bronce, crear duraluminio, oro sintético y aleaciones de alta conductividad."
        ),
        "text": (
            "La Smeltery es la fundición industrial: fuego en el suelo, caldero encima, valla del Nether y dispensador arriba. "
            "Combina polvos de cobre y estaño para fundir bronce, crear duraluminio, "
            "oro sintético y aleaciones de alta conductividad eléctrica."
        ),
        "action": "interact",
        "camera": "normal",
        "diagram": "smeltery"
    },
    {
        "id": "sf1_p14_pressure_chamber",
        "file": "sf1_p14_pressure_chamber.mp3",
        "title": "CALDERO DE PRESIÓN Y MESA MÁGICA",
        "subtitle": "Síntesis de diamantes, plásticos y catalizadores mágicos",
        "badge": "14 // SYNTHESIS: PRESSURE & MAGIC",
        "spoken_text": (
            "Para completar el taller básico, el Caldero de Presión comprime carbono en diamantes sintéticos y produce plásticos industriales. "
            "Y la Mesa de Trabajo Mágica, compuesta por una estantería, dispensador y mesa de crafteo, "
            "te permite crear talismanes mágicos y catalizadores que te otorgarán visión nocturna, resistencia al fuego y caída de pluma permanente."
        ),
        "text": (
            "Para completar tu taller: el Caldero de Presión sintetiza diamantes y plásticos industriales. "
            "La Mesa de Trabajo Mágica (estantería + dispensador + mesa de crafteo) "
            "crea talismanes mágicos con visión nocturna, resistencia al fuego y caída de pluma permanente."
        ),
        "action": "idle",
        "camera": "normal",
        "diagram": "magic_and_pressure"
    },
    {
        "id": "sf1_p15_hoja_de_ruta",
        "file": "sf1_p15_hoja_de_ruta.mp3",
        "title": "TU HOJA DE RUTA PARA LA PRIMERA SESIÓN",
        "subtitle": "De la madera básica a la primera red eléctrica en DrakesCraft",
        "badge": "15 // ROADMAP: YOUR FIRST INDUSTRIAL BASE",
        "spoken_text": (
            "Tu plan de acción para hoy es directo: entra al servidor, usa barra rtp, coloca tu ProtectionStone, "
            "visita barra pwarp para subir nivel de experiencia, abre barra sf guide y monta tu Mesa Mejorada y tu Smeltery. "
            "Con estas máquinas estarás listo para el Capítulo dos, donde construiremos generadores solares y redes de energía automáticas. "
            "Te esperamos en play punto drakescraft punto ce ele."
        ),
        "text": (
            "Tu plan de acción: entra a play.drakescraft.cl, usa /rtp, asegura con /ps, "
            "sube XP en /pwarp, abre /sf guide y monta tu Mesa Mejorada y Smeltery. "
            "Estarás listo para el Capítulo 2: energía solar y redes eléctricas. "
            "¡Te esperamos en DrakesCraft!"
        ),
        "action": "interact",
        "camera": "close",
        "diagram": "roadmap_final"
    }
]

async def main():
    print("=" * 60)
    print("GENERANDO AUDIO Y STORYBOARD PARA SLIMEFUN CAPÍTULO 1")
    print("=" * 60)

    total_words = 0
    scenes_output = []

    for idx, sec in enumerate(SECTIONS):
        out_path = AUDIO_DIR / sec["file"]
        print(f"\n[{idx+1}/{len(SECTIONS)}] Generando {sec['id']}...")
        print(f"    Texto: {sec['spoken_text'][:65]}...")

        res = await generate_speech(
            text=sec["spoken_text"],
            output_path=out_path,
            voice="es-CL-LorenzoNeural",
            rate="+2%",
            pitch="-1Hz"
        )

        duration = res["duration"]
        words = res["words"]
        total_words += len(words)
        print(f"    -> Duración: {duration:.2f}s | Palabras: {len(words)}")

        scenes_output.append({
            "id": sec["id"],
            "title": sec["title"],
            "subtitle": sec["subtitle"],
            "badge": sec["badge"],
            "text": sec["text"],
            "spoken_text": sec["spoken_text"],
            "action": sec["action"],
            "camera": sec["camera"],
            "diagram": sec["diagram"],
            "audio_file": sec["file"],
            "duration": duration,
            "frames": int(duration * 30) + 15,
            "words": words
        })

    storyboard_data = {
        "chapter": 1,
        "series": "Slimefun Masterclass",
        "title": "Slimefun en DrakesCraft: Capítulo 1 — La Guía Maestra, Multibloques & Comandos Iniciales",
        "fps": 30,
        "scenes": scenes_output
    }

    with open(JSON_OUT, "w", encoding="utf-8") as f:
        json.dump(storyboard_data, f, indent=2, ensure_ascii=False)

    print(f"\n[OK] Storyboard guardado en: {JSON_OUT}")
    print(f"Total palabras procesadas: {total_words}")

if __name__ == "__main__":
    asyncio.run(main())
