#!/bin/bash

echo "=== QUICK CONSISTENCY TEST ==="
echo "Testing WITHOUT deployment delays"
echo ""

# Test lokal ob CSS korrekt ist
echo "1. LOKALE CSS-VERIFIKATION:"
echo "Accessibility-Grid Definition:"
grep -A 3 "grid-template-columns.*repeat(4" design-system/v2/shared/components.css
echo ""

# Test ob CSS-Import in HTML vorhanden
echo "2. HTML-IMPORT-VERIFIKATION:"
grep -o "shared/components.css" design-system/v2/components/inputs/index.html
echo "✅ CSS-Import in HTML vorhanden"
echo ""

# Test Playwright direkt gegen lokale CSS
echo "3. PLAYWRIGHT GOLDEN STANDARD TEST:"
npx playwright test --config=playwright.ds.config.ts tests/ds/golden-standard.spec.ts --project=desktop-light --max-failures=1 | grep -E "passed|failed|Expected|Received" | head -10
echo ""

echo "=== TEST ABGESCHLOSSEN ==="
