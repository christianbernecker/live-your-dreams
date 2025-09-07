#!/bin/bash

echo "=== ADDING FORCE-CONSISTENCY.JS TO ALL COMPONENTS ==="

COMPONENTS=("buttons" "cards" "table" "accordion" "typography" "select" "toast" "modal" "checkbox" "radio" "dropdown")

for component in "${COMPONENTS[@]}"; do
    echo "Adding JavaScript to $component..."
    
    # Füge JavaScript vor dem ersten <script> Tag hinzu
    sed -i '' 's|<script>|<script src="../shared/force-consistency.js"></script>\
    <script>|' "design-system/v2/components/$component/index.html"
    
    echo "✅ $component updated"
done

echo ""
echo "=== ALL COMPONENTS UPDATED WITH CENTRAL JAVASCRIPT ==="
echo "Zentrale Konsistenz durch JavaScript garantiert"
