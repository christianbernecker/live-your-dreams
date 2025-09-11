#!/bin/bash

echo "=== FIXING ALL COMPONENTS WITH DIRECT CSS ==="

# CSS-Block definieren
CSS_BLOCK='        /* Accessibility Grid - Screenshot-konform */
        .accessibility-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 24px;
            margin: 32px 0;
            padding: 32px;
            background: #E8F0FE;
            border-radius: 8px;
        }
        
        .accessibility-item {
            background: white;
            padding: 20px;
            border-radius: 6px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .accessibility-item h4 {
            font-size: 16px;
            font-weight: 600;
            color: #111111;
            margin-bottom: 12px;
        }
        
        .accessibility-item ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .accessibility-item li {
            padding: 4px 0;
            color: #666666;
            font-size: 14px;
            display: flex;
            align-items: flex-start;
            gap: 8px;
        }
        
        .accessibility-item li:before {
            content: "✓";
            color: #3366CC;
            font-weight: bold;
            flex-shrink: 0;
        }
        
        @media (max-width: 1200px) {
            .accessibility-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        
        @media (max-width: 768px) {
            .accessibility-grid {
                grid-template-columns: 1fr;
                padding: 16px;
                gap: 16px;
            }
        }'

# Komponenten-Liste
COMPONENTS=("buttons" "cards" "table" "accordion" "typography" "select" "toast" "modal")

for component in "${COMPONENTS[@]}"; do
    echo "Fixing $component..."
    
    # Ersetze den Platzhalter-Kommentar mit dem vollen CSS-Block
    sed -i '' "s|/\* Accessibility styles.*shared/components.css \*/|$CSS_BLOCK|g" "design-system/v2/components/$component/index.html"
    
    echo "✅ $component fixed"
done

echo ""
echo "=== ALL COMPONENTS FIXED ==="
echo "Direct CSS implementation bypasses central loading issues"
