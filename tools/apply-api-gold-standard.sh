#!/bin/bash

# API Gold Standard CSS Template
API_GOLD_STANDARD='        .api-table {
            width: 100%;
            border-collapse: collapse;
            margin: 24px 0;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid #e5e7eb;
        }
        
        .api-table th {
            background: #1f2937 !important;
            color: white !important;
            padding: 12px;
            text-align: left;
            font-weight: 700;
            border: none;
        }
        
        .api-table th:first-child {
            border-top-left-radius: 12px;
        }
        
        .api-table th:last-child {
            border-top-right-radius: 12px;
        }
        
        .api-table td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
            border-right: 1px solid #e5e7eb;
            color: var(--lyd-text);
            background: white;
        }
        
        .api-table td:first-child {
            border-left: none;
        }
        
        .api-table tr:last-child td {
            border-bottom: none;
        }
        
        .api-table code {
            background: var(--lyd-gray-200);
            color: var(--lyd-text);
            padding: 2px 6px;
            border-radius: 4px;
            font-family: '"'"'JetBrains Mono'"'"', monospace;
            font-size: 13px;
            font-weight: 600;
        }'

# Liste aller Komponenten (außer buttons, inputs, cards - bereits gemacht)
COMPONENTS=(
    "select" "accordion" "modal" "dropdown" "checkbox" "radio" "toast" "table" 
    "textarea" "switch" "slider" "alert" "badge" "datepicker" "avatar" "navbar" 
    "tabs" "progress" "calendar" "autocomplete" "pagination" "tooltip"
)

echo "=== APPLYING API GOLD STANDARD TO ALL COMPONENTS ==="

for component in "${COMPONENTS[@]}"; do
    file="design-system/v2/components/${component}/index.html"
    if [ -f "$file" ]; then
        echo "Processing: $component"
        
        # Backup original file
        cp "$file" "${file}.backup-$(date +%Y%m%d-%H%M%S)"
        
        # Use Python for complex multi-line replacement
        python3 << EOF
import re

with open('$file', 'r') as f:
    content = f.read()

# Pattern to match existing api-table CSS block
pattern = r'(\s*)\.api-table\s*\{[^}]*\}(\s*\.api-table\s+th\s*\{[^}]*\})?(\s*\.api-table\s+td\s*\{[^}]*\})?(\s*\.api-table\s+code\s*\{[^}]*\})?'

# Replace with gold standard
new_content = re.sub(pattern, r'\1$API_GOLD_STANDARD', content, flags=re.MULTILINE | re.DOTALL)

with open('$file', 'w') as f:
    f.write(new_content)
EOF
        
        echo "✅ $component updated"
    else
        echo "❌ $component file not found: $file"
    fi
done

echo "=== API GOLD STANDARD APPLIED TO ALL COMPONENTS ==="
