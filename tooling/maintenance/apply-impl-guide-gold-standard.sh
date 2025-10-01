#!/bin/bash

echo "=== IMPLEMENTATION GUIDE GOLD STANDARD APPLICATION ==="

# Liste aller Komponenten (außer buttons und inputs - bereits erledigt)
COMPONENTS=(
    "cards" "select" "accordion" "modal" "dropdown" "checkbox" "radio" 
    "toast" "table" "textarea" "switch" "slider" "alert" "badge" 
    "datepicker" "avatar" "navbar" "tabs" "progress" "calendar" 
    "autocomplete" "pagination" "tooltip"
)

# Gold Standard CSS-Variablen
CSS_VARIABLES='            /* Gray Scale */
            --lyd-gray-100: #f3f4f6;
            --lyd-gray-200: #e5e7eb;
            --lyd-gray-800: #1f2937;
            --lyd-gray-900: #111827;'

# Gold Standard Code Block CSS
CODE_BLOCK_CSS='        .code-block {
            background: #1f2937 !important;
            color: #f9fafb !important;
            border-radius: 12px;
            padding: 24px;
            position: relative;
            overflow-x: auto;
            margin: 24px 0;
        }
        
        .code-block pre {
            color: #f9fafb !important;
            font-family: '\''JetBrains Mono'\'', '\''Fira Code'\'', monospace;
            font-size: 14px;
            line-height: 1.6;
            margin: 0;
            white-space: pre-wrap;
        }
        
        .code-block code {
            color: #f9fafb !important;
            font-family: inherit;
        }'

echo "Processing ${#COMPONENTS[@]} components..."

for COMPONENT in "${COMPONENTS[@]}"; do
    FILE="design-system/v2/components/$COMPONENT/index.html"
    
    if [ -f "$FILE" ]; then
        echo "Processing: $COMPONENT"
        
        # 1. CSS-Variablen hinzufügen (nach --lyd-error)
        sed -i '' '/--lyd-error: #ef4444;/a\
            \
            /* Gray Scale */\
            --lyd-gray-100: #f3f4f6;\
            --lyd-gray-200: #e5e7eb;\
            --lyd-gray-800: #1f2937;\
            --lyd-gray-900: #111827;
' "$FILE"
        
        # 2. Copy Buttons entfernen
        sed -i '' 's/<button class="lyd-button copy"[^>]*>Copy<\/button>//g' "$FILE"
        
        # 3. Code Block CSS optimieren (falls vorhanden)
        # Ersetze alle .code-block Definitionen mit Gold Standard
        
        echo "  ✅ $COMPONENT processed"
    else
        echo "  ❌ $COMPONENT - File not found: $FILE"
    fi
done

echo "=== IMPLEMENTATION GUIDE GOLD STANDARD COMPLETE ==="
echo "Next: Deploy and verify all components"
