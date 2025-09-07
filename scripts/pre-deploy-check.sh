#!/bin/bash

echo "=== LYD DESIGN SYSTEM PRE-DEPLOYMENT CHECK ==="
echo "Automatische Qualitätssicherung vor Deployment"
echo ""

cd "$(dirname "$0")/.."

# 1. Komponenten-Konsistenz prüfen
echo "1. KOMPONENTEN-KONSISTENZ:"
echo "=========================="

COMPONENTS=("buttons" "cards" "table" "accordion" "typography" "select" "inputs" "modal")
ERRORS=0

for component in "${COMPONENTS[@]}"; do
    echo -n "Prüfe $component: "
    
    # Prüfe Gold Standard CSS
    if grep -q "accessibility-grid" "design-system/v2/components/$component/index.html"; then
        echo -n "✅ CSS "
    else
        echo -n "❌ CSS "
        ((ERRORS++))
    fi
    
    # Prüfe Premium Headlines
    if grep -q "section-title premium" "design-system/v2/components/$component/index.html"; then
        echo -n "✅ Headlines "
    else
        echo -n "❌ Headlines "
        ((ERRORS++))
    fi
    
    # Prüfe Accessibility Headlines
    if grep -q "section-title accessibility" "design-system/v2/components/$component/index.html"; then
        echo "✅ Accessibility"
    else
        echo "❌ Accessibility"
        ((ERRORS++))
    fi
done

echo ""

# 2. Playwright Visual Tests
echo "2. VISUAL REGRESSION TESTS:"
echo "==========================="
yarn ds:test:visual --max-failures=3 | grep -E "passed|failed|Running"

# 3. Gold Standard Verifikation
echo ""
echo "3. GOLD STANDARD VERIFIKATION:"
echo "=============================="
npx playwright test --config=playwright.ds.config.ts tests/ds/golden-standard.spec.ts --project=desktop-light --max-failures=1 | grep -E "passed|failed|Expected|Received"

echo ""
echo "=== PRE-DEPLOYMENT CHECK SUMMARY ==="
if [ $ERRORS -eq 0 ]; then
    echo "✅ ALLE CHECKS BESTANDEN - DEPLOYMENT FREIGEGEBEN"
    exit 0
else
    echo "❌ $ERRORS FEHLER GEFUNDEN - DEPLOYMENT BLOCKIERT"
    echo "Bitte Fehler beheben vor Deployment"
    exit 1
fi
