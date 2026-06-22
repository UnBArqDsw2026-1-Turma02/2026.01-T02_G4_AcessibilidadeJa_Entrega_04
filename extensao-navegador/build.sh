#!/usr/bin/env bash
#
# Empacota a extensao Acessibilidade Ja em um .zip pronto para distribuir
# ou para subir na Chrome Web Store / Edge Add-ons.
#
# Uso:  ./build.sh
# Saida: dist/acessibilidadeja-extensao.zip
#
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT_DIR="$DIR/dist"
OUT_ZIP="$OUT_DIR/acessibilidadeja-extensao.zip"

# Arquivos que entram no pacote (nao inclui dist, build.sh nem README).
FILES=(
  "manifest.json"
  "bridge.js"
  "acessibilidadeja.js"
  "popup.html"
  "popup.js"
  "icons"
)

echo "==> Validando manifest.json"
node -e "JSON.parse(require('fs').readFileSync('$DIR/manifest.json','utf8')); console.log('manifest.json valido')"

mkdir -p "$OUT_DIR"
rm -f "$OUT_ZIP"

echo "==> Empacotando"
( cd "$DIR" && zip -r -q "$OUT_ZIP" "${FILES[@]}" )

echo "==> Pronto: $OUT_ZIP"
unzip -l "$OUT_ZIP"
