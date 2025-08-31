#!/bin/bash
set -e
FOUND=$(grep -RniE "porsche|@porsche-design-system|\\bpds-\\b" --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=docs --exclude=check-lyd-brand.sh . | wc -l | tr -d ' ')
if [ "$FOUND" != "0" ]; then
  echo "❌ Fremd-Branding gefunden – Build abgebrochen"
  exit 1
fi
echo "✅ Branding sauber"
