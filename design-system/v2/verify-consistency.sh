#!/bin/bash

echo "=== LYD DESIGN SYSTEM CONSISTENCY VERIFICATION ==="
echo "Systematische Prüfung gegen Screenshots"
echo ""

# Base URL
BASE_URL="http://designsystem.liveyourdreams.online/v2/components"

# Komponenten-Liste
COMPONENTS=("buttons" "cards" "table" "inputs" "select" "typography" "accordion")

echo "1. PAGE-TITLE KONSISTENZ (Soll: Blaues Uppercase):"
echo "=================================================="
for component in "${COMPONENTS[@]}"; do
    echo -n "Testing $component: "
    
    # Teste ob Page-Title das blaue Gradient-Styling hat
    result=$(curl -s "$BASE_URL/$component/" | grep -o "text-transform: uppercase" | head -1)
    
    if [ ! -z "$result" ]; then
        echo "✅ Uppercase aktiv"
    else
        echo "❌ Kein Uppercase"
    fi
done

echo ""
echo "2. ACCESSIBILITY-GRID KONSISTENZ (Soll: 4-Spalten-Layout):"
echo "==========================================================="
for component in "${COMPONENTS[@]}"; do
    echo -n "Testing $component: "
    
    # Teste ob 4-Spalten-Grid verwendet wird
    result=$(curl -s "$BASE_URL/$component/" | grep -o "repeat(4, 1fr)" | head -1)
    
    if [ ! -z "$result" ]; then
        echo "✅ 4-Spalten-Grid aktiv"
    else
        echo "❌ Falsches Grid-Layout"
    fi
done

echo ""
echo "3. ZENTRALE CSS-IMPORTS:"
echo "========================"
for component in "${COMPONENTS[@]}"; do
    echo -n "Testing $component: "
    
    # Teste ob zentrale CSS-Imports vorhanden sind
    result=$(curl -s "$BASE_URL/$component/" | grep -o "shared/components.css" | head -1)
    
    if [ ! -z "$result" ]; then
        echo "✅ Zentrale Imports"
    else
        echo "❌ Keine zentralen Imports"
    fi
done

echo ""
echo "4. ACCESSIBILITY-ITEM STYLING:"
echo "==============================="
for component in "${COMPONENTS[@]}"; do
    echo -n "Testing $component: "
    
    # Teste ob lokale Accessibility-Definitionen vorhanden sind (sollten NICHT da sein)
    result=$(curl -s "$BASE_URL/$component/" | grep -o "\.accessibility-item.*{" | head -1)
    
    if [ -z "$result" ]; then
        echo "✅ Keine lokalen Styles"
    else
        echo "❌ Hat noch lokale Styles"
    fi
done

echo ""
echo "=== VERIFIKATION ABGESCHLOSSEN ==="
