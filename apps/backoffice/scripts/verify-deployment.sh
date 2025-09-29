#!/bin/bash

# Deployment Verification Script
# Autark testet alle Features nach Deployment

echo "🔍 AUTARKE DEPLOYMENT-VERIFIKATION"
echo "════════════════════════════════════════════════════════════════════════════"
echo ""

if [ -z "$1" ]; then
    echo "❌ Fehler: URL nicht angegeben"
    echo "Usage: ./verify-deployment.sh <URL>"
    exit 1
fi

URL="$1"
echo "📋 Teste URL: $URL"
echo ""

# Test 1: Login-Seite
echo "1️⃣ LOGIN-SEITE..."
LOGIN_TEST=$(curl -s "$URL" | grep -c "Backoffice Login")
if [ $LOGIN_TEST -gt 0 ]; then
    echo "✅ Login-Seite lädt korrekt"
else
    echo "❌ Login-Seite fehlerhaft"
fi

# Test 2: Admin-Dashboard
echo ""
echo "2️⃣ ADMIN-DASHBOARD..."
ADMIN_TEST=$(curl -s "$URL/admin" 2>/dev/null | grep -c "Administration\|Admin\|404")
if [[ $(curl -s "$URL/admin" 2>/dev/null | grep -c "Administration") -gt 0 ]]; then
    echo "✅ Admin-Dashboard erreichbar"
elif [[ $(curl -s "$URL/admin" 2>/dev/null | grep -c "404") -gt 0 ]]; then
    echo "❌ Admin-Dashboard: 404 Not Found"
else
    echo "⚠️ Admin-Dashboard: Unbekannter Status"
fi

# Test 3: API-Endpoints
echo ""
echo "3️⃣ API-ENDPOINTS..."

# Test Health Check
HEALTH_TEST=$(curl -s "$URL/api/test-auth" | grep -c '"status":"ok"')
if [ $HEALTH_TEST -gt 0 ]; then
    echo "✅ Database Connection funktioniert"
else
    echo "❌ Database Connection fehlerhaft"
fi

# Test Users API (should require auth, expect 401/403)
USERS_API=$(curl -s -o /dev/null -w "%{http_code}" "$URL/api/users")
if [ "$USERS_API" = "401" ] || [ "$USERS_API" = "403" ]; then
    echo "✅ Users API geschützt (HTTP $USERS_API)"
elif [ "$USERS_API" = "200" ]; then
    echo "⚠️ Users API erreichbar ohne Auth"
else
    echo "❌ Users API Fehler (HTTP $USERS_API)"
fi

# Test Roles API
ROLES_API=$(curl -s -o /dev/null -w "%{http_code}" "$URL/api/roles")
if [ "$ROLES_API" = "401" ] || [ "$ROLES_API" = "403" ]; then
    echo "✅ Roles API geschützt (HTTP $ROLES_API)"
elif [ "$ROLES_API" = "200" ]; then
    echo "⚠️ Roles API erreichbar ohne Auth"
else
    echo "❌ Roles API Fehler (HTTP $ROLES_API)"
fi

# Test 4: CSS/Design System Loading
echo ""
echo "4️⃣ DESIGN SYSTEM..."
CSS_TEST=$(curl -s "$URL" | grep -c "master.css\|lyd-")
if [ $CSS_TEST -gt 0 ]; then
    echo "✅ Design System CSS geladen"
else
    echo "❌ Design System CSS fehlt"
fi

# Test 5: Next.js Build
echo ""
echo "5️⃣ NEXT.JS BUILD..."
NEXTJS_TEST=$(curl -s "$URL" | grep -c "_next/static")
if [ $NEXTJS_TEST -gt 0 ]; then
    echo "✅ Next.js Build korrekt"
else
    echo "❌ Next.js Build fehlerhaft"
fi

echo ""
echo "🎯 VERIFIKATION ABGESCHLOSSEN"
echo "════════════════════════════════════════════════════════════════════════════"
echo ""
echo "🔗 URL für manuellen Test:"
echo "$URL"
echo ""
echo "🔑 Login-Credentials:"
echo "admin@liveyourdreams.online / changeme123"
echo ""
echo "📝 Manuell zu testen:"
echo "• Login → Dashboard → /admin"
echo "• User-Management: Create/Edit/Delete"
echo "• Role-Management: Permission Matrix"
echo "• Design System Konsistenz"

