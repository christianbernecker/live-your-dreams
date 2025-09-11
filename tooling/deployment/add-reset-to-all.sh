#!/bin/bash

echo "=== ADDING RESET-CASCADE.CSS TO ALL COMPONENTS ==="

COMPONENTS=("cards" "table" "accordion" "typography" "select" "inputs" "toast" "modal" "checkbox" "radio" "dropdown")

for component in "${COMPONENTS[@]}"; do
    echo "Adding reset-cascade.css to $component..."
    
    # Füge reset-cascade.css nach components.css hinzu
    sed -i '' 's|<link rel="stylesheet" href="../shared/components.css">|<link rel="stylesheet" href="../shared/components.css">\
    <!-- Force Override - Nuclear Option für Konsistenz -->\
    <link rel="stylesheet" href="../shared/reset-cascade.css">|g' "design-system/v2/components/$component/index.html"
    
    echo "✅ $component updated"
done

echo ""
echo "=== ALL COMPONENTS UPDATED WITH RESET-CASCADE ==="
