#!/bin/bash

# Quick User Creation Script for Neon Database
# ═══════════════════════════════════════════════════════════════════════════

echo "🚀 SCHNELL-LÖSUNG: USER IN NEON DATABASE ERSTELLEN"
echo "════════════════════════════════════════════════════════════════════════════"
echo ""
echo "📝 ANLEITUNG:"
echo "1. Gehe zu: https://console.neon.tech"
echo "2. Klicke auf dein 'lyd' Projekt"
echo "3. Kopiere den Connection String"
echo "4. Füge ihn hier ein und drücke Enter:"
echo ""
read -p "DATABASE_URL: " DATABASE_URL

if [ -z "$DATABASE_URL" ]; then
    echo "❌ Keine DATABASE_URL eingegeben!"
    exit 1
fi

echo ""
echo "🔧 Erstelle Admin und Demo User..."
DATABASE_URL="$DATABASE_URL" node scripts/create-admin.js

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ERFOLGREICH! User wurden erstellt:"
    echo "════════════════════════════════════════════════════════════════════════════"
    echo "Admin: admin@liveyourdreams.online / changeme123"
    echo "Demo:  demo@liveyourdreams.online / demo123"
else
    echo ""
    echo "❌ Fehler beim Erstellen der User!"
    echo "Stelle sicher, dass die DATABASE_URL korrekt ist."
fi

