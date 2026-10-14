#!/usr/bin/env bash
# Levanta un Paper local descartable con Slimefun (+ addons opcionales de work/addons/*.jar), carga el
# plugin de volcado y escribe data/slimefun-dump.json. Se apaga solo. No toca ningun servidor real.
set -euo pipefail
cd "$(dirname "$0")/.."
SRV=work/server
rm -rf "$SRV" && mkdir -p "$SRV/plugins"
cp work/paper.jar "$SRV/paper.jar"
cp work/Slimefun.jar "$SRV/plugins/Slimefun.jar"
cp dump-plugin/target/SlimefunKnowledgeDump.jar "$SRV/plugins/"
[ -d work/addons ] && cp work/addons/*.jar "$SRV/plugins/" 2>/dev/null || true
echo "eula=true" > "$SRV/eula.txt"
printf 'online-mode=false\nlevel-type=flat\ngenerate-structures=false\nspawn-protection=0\nview-distance=2\nsimulation-distance=2\nserver-port=25599\n' > "$SRV/server.properties"
OUT="$(pwd)/data/slimefun-dump.json"
mkdir -p data
( cd "$SRV" && timeout 600 java -Xmx2G -Dknowledge.out="$OUT" -Dcom.mojang.eula.agree=true -jar paper.jar --nogui > ../server.log 2>&1 ) || true
grep -E "Volcado:|Fallo el volcado|ERROR" work/server.log | tail -5
gzip -kf9 "$OUT" && ls -la "$OUT" "$OUT.gz"
