# Videos — estado y pendientes

Última actualización: 2026-10-14. Detalle técnico: [VIDEO_STANDARD.md](VIDEO_STANDARD.md) y [VIDEO_PIPELINE.md](VIDEO_PIPELINE.md).

## Hechos (en `out/`, git-ignorado; regenerables con los guiones de `tools/`)

| Video | Formato | Guion | Notas |
|---|---|---|---|
| `promo-presentacion.mp4` | reel 9:16, 29,6 s, español | `tools/promo_v2.py` | presentación de DrakesCraft: Slimefun, modalidades, web; loop RingLab |
| `start-reel.mp4` / `start-youtube.mp4` | 9:16 (38 s) / 16:9 (2:19), español | `tools/start_videos.py` | "Cómo empezar con Slimefun", con modelos 3D de multibloques |
| `guide-book.mp4` | 16:9, 2:11, inglés | `tools/storyboard_guide.py` | el libro con el visualizador de GUIs (el que más gustó) |
| `dust-farm-v3.mp4` | 16:9, 4:14, inglés | `tools/storyboard_dust_farm.py` | primera granja de polvo; largo, conviene cortarlo en episodios |
| `promo-reel.mp4` | 9:16, 26 s, español | `tools/reel_promo.py` | primer promo (loop antiguo), reemplazado por `promo-presentacion` |

## Pendientes, en orden

1. **Meter el Output Chest en el video de YouTube "Cómo empezar"** (pedido de Jack): primer almacenamiento y su funcionamiento. Datos ya verificados en
   `knowledge/mechanics/output-chest.md`: investigación 20 niveles; receta 5 Lead Ingot + Hopper + Chest; se coloca pegado al dispensador de un multibloque
   (arriba, norte, este, sur u oeste, no abajo); si el producto no cabe en el chest va al dispensador, y si no cabe en ninguno la máquina no craftea.
   Escena sugerida: modelo 3D del Ore Crusher con el chest al lado y los items entrando al cofre. Añadir en `tools/start_videos.py` (escena tras "trio") y re-renderizar.
1b. **Hoja de cada multibloque y máquina** (pedido de Jack, base de todos los episodios): `tools/multiblock_info.py` ya genera `knowledge/guides/multiblocks.md` con patrón,
   dónde está el dispensador (solo si se detecta en el código, con línea citada) y si usa el Output Chest. Quedan por revisar a mano en el código: Smeltery, Makeshift Smeltery,
   Magic Workbench, Table Saw, Automated Panning Machine e Industrial Miners. Después hacer lo mismo para las máquinas eléctricas y las de los addons.
   **Cuándo hace falta sí o sí el Output Chest:** al craftear varias unidades a la vez los stacks dejan los 9 slots del dispensador ocupados y el resultado no cabe
   (Jack lo observó en el juego; el código confirma que el resultado necesita espacio libre en el dispensador o un Output Chest). Cifras del volcado: 2.069 recetas de la mesa mejorada,
   83 con salida >1 y 1.501 que usan los 9 slots.
1c. **Currículo desde cero** generado de los datos (orden por profundidad y coste de investigación, `tools/roadmap.py`) como vista sobre la misma base de conocimiento:
   un solo flujo de contexto, no dos.
2. Versiones en español de los episodios largos que están en inglés (libro, granja de polvo) y luego multi-idioma.
3. Cortes verticales de 30–60 s del episodio del libro (gancho en 3 s).
4. Episodio de multibloques en detalle (los 15 del núcleo, con 3D y bloque activador de cada uno; ya verificados ECT, Grind Stone, Ore Crusher, Ore Washer).
5. Mecánicas restantes (20 de 21 temas, `tools/study_queue.py`).
6. Clips de stock para el fondo de los reels (Pexels/Pixabay: requiere que el dueño cree la clave de API; guardar fuente y licencia en `video/public/bg/SOURCES.md`).
7. Migrar los videos antiguos (`Video.tsx`, `Guide.tsx`, `Reel.tsx`) al estándar `std/` (tema, loops, captions) y re-renderizarlos.
8. Programar `tools/refresh.sh` (timer en Nexus o tras cada despliegue) y exponer `consultar_slimefun` en el MCP de Star.
9. Listar los ítems sin textura en el pack Slimefun-Texture-Drake (Dust Extractor, Cobblestone Generator, Armor Forge…).

## Reglas que no cambian

Solo datos del volcado o del código citado; nada se publica sin aprobación del dueño; sin gameplay de juegos con copyright; texto de jugador en el idioma del video.
