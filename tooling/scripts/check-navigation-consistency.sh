#!/bin/bash

echo "=== NAVIGATION KONSISTENZ-ANALYSE ==="
echo ""
echo "| URL | Nav-Links | Status |"
echo "|-----|-----------|--------|"

REFERENCE_COUNT=34

# Liste aller URLs
urls=(
"http://designsystem.liveyourdreams.online/"
"http://designsystem.liveyourdreams.online/design-principles/overview/"
"http://designsystem.liveyourdreams.online/design-principles/colors/"
"http://designsystem.liveyourdreams.online/design-principles/typography/"
"http://designsystem.liveyourdreams.online/design-principles/grid/"
"http://designsystem.liveyourdreams.online/design-principles/spacing/"
"http://designsystem.liveyourdreams.online/implementation/overview/"
"http://designsystem.liveyourdreams.online/implementation/css/"
"http://designsystem.liveyourdreams.online/implementation/nextjs/"
"http://designsystem.liveyourdreams.online/components/overview/"
"http://designsystem.liveyourdreams.online/components/buttons/"
"http://designsystem.liveyourdreams.online/components/inputs/"
"http://designsystem.liveyourdreams.online/components/cards/"
"http://designsystem.liveyourdreams.online/components/select/"
"http://designsystem.liveyourdreams.online/components/accordion/"
"http://designsystem.liveyourdreams.online/components/modal/"
"http://designsystem.liveyourdreams.online/components/dropdown/"
"http://designsystem.liveyourdreams.online/components/checkbox/"
"http://designsystem.liveyourdreams.online/components/radio/"
"http://designsystem.liveyourdreams.online/components/toast/"
"http://designsystem.liveyourdreams.online/components/tabs/"
"http://designsystem.liveyourdreams.online/components/navbar/"
"http://designsystem.liveyourdreams.online/components/badge/"
"http://designsystem.liveyourdreams.online/components/tooltip/"
"http://designsystem.liveyourdreams.online/components/progress/"
"http://designsystem.liveyourdreams.online/components/spinner/"
"http://designsystem.liveyourdreams.online/components/switch/"
"http://designsystem.liveyourdreams.online/components/textarea/"
"http://designsystem.liveyourdreams.online/components/breadcrumb/"
"http://designsystem.liveyourdreams.online/components/pagination/"
"http://designsystem.liveyourdreams.online/components/avatar/"
"http://designsystem.liveyourdreams.online/components/table/"
"http://designsystem.liveyourdreams.online/components/autocomplete/"
"http://designsystem.liveyourdreams.online/components/calendar/"
"http://designsystem.liveyourdreams.online/components/datepicker/"
)

for url in "${urls[@]}"; do
    count=$(curl -s "$url" | grep -c 'class="nav-item"' 2>/dev/null || echo "0")
    
    if [ "$count" -eq "$REFERENCE_COUNT" ]; then
        status="✅ OK"
    else
        status="❌ INKONSISTENT"
    fi
    
    # Kürze URL für bessere Lesbarkeit
    short_url=$(echo "$url" | sed 's|http://designsystem.liveyourdreams.online||')
    [ -z "$short_url" ] && short_url="/"
    
    echo "| $short_url | $count | $status |"
done

echo ""
echo "Referenz-Anzahl: $REFERENCE_COUNT Navigation-Links"
