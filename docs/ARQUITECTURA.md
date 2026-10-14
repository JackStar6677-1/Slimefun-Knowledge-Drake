# Arquitectura — aprendizaje autónomo de Slimefun

Objetivo: que cualquier IA (Claude, Codex, Antigravity, OpenCode…) **entienda** cómo funciona Slimefun y los addons del
servidor —recetas, flujos, redes, automatizaciones— sin que Jack se lo explique en el juego, y que de ahí salgan guías,
diálogos y videos. Lo que ve el jugador es la base; lo de staff (cheat, comandos admin) queda marcado y fuera del contenido público.

## Principio

Una IA no memoriza código. Lo que funciona es separar **hechos** de **comprensión**:

| Capa | Qué contiene | Cómo se obtiene | Se puede equivocar |
|---|---|---|---|
| 1. Hechos | ítems, recetas, energía, investigaciones, recetas de máquinas, grupos del menú | **Volcado en ejecución**: un Paper descartable carga Slimefun + addons y un plugin exporta el registro real (`dump-plugin/`) | No: es lo que el servidor tiene |
| 2. Grafo | qué produce qué, cadenas hacia adelante (polvo → lingote → aleación → armadura…) | `tools/build_docs.py` recorre los hechos | No: es cálculo |
| 3. Mecánicas | cómo funcionan energía, cargo, androides, Networks, Galaxyfun, portales… | Agentes leen el código fuente y escriben `knowledge/mechanics/*.md` citando archivo:línea | Sí → se valida (`tools/verify.py`) y se revisa |
| 4. Guías y diálogos | tutoriales paso a paso, guiones, videos | Se generan **solo desde** las capas 1–3 | Solo si las capas anteriores lo están |

## Flujo de trabajo (cada versión nueva del core o de un addon)

```
tools/run_dump.sh            # 1. volcado real  -> data/slimefun-dump.json
python tools/build_docs.py   # 2. paginas por item, indices por addon, flujos de produccion
python tools/study_queue.py  # 3. que mecanicas faltan o cambiaron
python tools/study_queue.py brief <tema>   # 4. instrucciones + archivos fuente para el agente
python tools/verify.py knowledge/mechanics/<tema>.md   # 5. validar lo que escribio el agente
```

Cada documento lleva la versión del volcado; si el volcado cambia, el CI marca las páginas afectadas para revisión.

## Cómo la consumen las IAs

- **Claude Code**: `SKILL.md` (en la raíz) enseña a consultar `knowledge/` y `tools/kb.py`.
- **Codex / Antigravity / OpenCode**: una línea en su `AGENTS.md` apunta a este repo; la consulta pesada se hace con `tools/kb.py`.
- **Servidor (MCP de Star)**: pendiente exponer `consultar_slimefun(tema)` sobre `knowledge/index.json` para que todas usen la misma fuente.

## Alcance y público

`knowledge/audience.json` marca qué es de staff (patrones de id, grupos y addons). Todo lo marcado queda fuera de la guía web, los
diálogos y los videos. Lo que no esté marcado se considera de jugador.

## Lo que NO hace (a propósito)

- No inventa recetas: si no está en el volcado, no existe para los guiones.
- No publica nada: los videos y guías pasan por aprobación de Jack antes de subirse.
- No toca el servidor de producción: el volcado corre en un Paper local descartable; los jars de addons se leen de producción en solo lectura.

## Licencias

Slimefun es GPL-3.0; los addons mantienen sus licencias y créditos (ver cada repo). Las texturas vienen del pack comunitario
(autores en `Slimefun-Texture-Drake`). Este repo documenta; no redistribuye jars de terceros (`work/` está ignorado por git).
