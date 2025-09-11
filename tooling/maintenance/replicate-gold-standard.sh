#!/bin/bash

echo "=== REPLIZIERE GOLD STANDARD (INPUTS) 1:1 ==="

# Extrahiere exaktes CSS aus Input-Komponente
echo "Extrahiere Gold Standard CSS..."
GOLD_CSS=$(sed -n '/\/\* Accessibility Grid - Screenshot-konform \*\//,/\/\* Responsive \*\//p' design-system/v2/components/inputs/index.html | head -n -2)

echo "Gold Standard CSS extrahiert ($(echo "$GOLD_CSS" | wc -l) Zeilen)"

# Komponenten die das CSS brauchen
COMPONENTS=("buttons" "cards" "table" "accordion" "typography" "select")

for component in "${COMPONENTS[@]}"; do
    echo "Repliziere zu $component..."
    
    # Finde und ersetze Accessibility-CSS-Block
    START_LINE=$(grep -n "\/\* Accessibility" "design-system/v2/components/$component/index.html" | cut -d: -f1)
    END_LINE=$(grep -n "\/\* Responsive \*\/" "design-system/v2/components/$component/index.html" | cut -d: -f1)
    
    if [ ! -z "$START_LINE" ] && [ ! -z "$END_LINE" ]; then
        # Erstelle temporäre Datei mit neuem CSS
        head -n $((START_LINE-1)) "design-system/v2/components/$component/index.html" > temp_file
        echo "$GOLD_CSS" >> temp_file
        tail -n +$END_LINE "design-system/v2/components/$component/index.html" >> temp_file
        
        # Ersetze Original
        mv temp_file "design-system/v2/components/$component/index.html"
        echo "✅ $component: Gold Standard CSS repliziert"
    else
        echo "⚠️ $component: CSS-Block nicht gefunden"
    fi
done

echo ""
echo "=== GOLD STANDARD REPLIKATION ABGESCHLOSSEN ==="
echo "Alle Komponenten verwenden jetzt das exakte Input-CSS"
