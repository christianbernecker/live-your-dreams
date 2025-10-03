#!/bin/bash
#
# Backoffice Production Deployment Script
# 
# Deployed das Backoffice zu Vercel Production
# Verwendung: ./scripts/deploy-backoffice.sh

set -e

echo "🚀 Backoffice Production Deployment"
echo "===================================="
echo ""

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Fehler: Muss aus dem Repository Root ausgeführt werden!"
    exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  Warnung: Du hast uncommitted changes!"
    read -p "Trotzdem fortfahren? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Get current branch
BRANCH=$(git branch --show-current)
echo "📍 Current Branch: $BRANCH"

# Confirm if not on main
if [ "$BRANCH" != "main" ]; then
    echo "⚠️  Du bist nicht auf 'main' Branch!"
    read -p "Trotzdem deployen? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Show last commit
echo ""
echo "📝 Letzter Commit:"
git log --oneline -1
echo ""

# Confirm deployment
read -p "🎯 Production Deployment starten? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment abgebrochen."
    exit 1
fi

echo ""
echo "⏳ Deploying..."
echo ""

# Deploy to production
cd apps/backoffice
vercel --prod --yes

echo ""
echo "✅ Deployment abgeschlossen!"
echo ""
echo "🌐 URLs:"
echo "   Production: https://backoffice.liveyourdreams.online"
echo "   Vercel Dashboard: https://vercel.com/christianberneckers-projects/backoffice"
echo ""
echo "💡 Tipp: Prüfe die Live-URL in 1-2 Minuten"
