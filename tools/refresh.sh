#!/usr/bin/env bash
# Actualiza TODO el conocimiento desde el servidor actual. Pensado para correr tras cada despliegue o por timer (Nexus).
#   1. volcado en ejecucion (usa los jars de work/addons, que se refrescan en solo lectura desde produccion)
#   2. comparacion con el volcado anterior -> knowledge/changes/<fecha>.md  ("novedades de DrakesCraft")
#   3. paginas, roadmap, datos de las GUIs del libro, iconos
# Los videos se regeneran aparte (cd video && npm run render) y solo se publican con aprobacion del dueño.
set -euo pipefail
cd "$(dirname "$0")/.."
bash tools/run_dump.sh
python tools/diff_dumps.py || true
python tools/build_docs.py
python tools/roadmap.py
python tools/gui_guide.py
python tools/icons.py
cp video/public/icons/index.json video/src/icons-index.json
cp video/public/guide.json video/src/guide.json
echo "[refresh] listo: $(date -Is)"
