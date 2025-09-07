#!/bin/bash

echo "=== LYD DESIGN SYSTEM POST-DEPLOYMENT VERIFIKATION ==="
echo "Automatische Live-URL-Verifikation nach Deployment"
echo ""

cd "$(dirname "$0")/.."

# Warte auf Deployment-Completion
echo "1. WARTE AUF DEPLOYMENT-COMPLETION:"
echo "==================================="
TIMEOUT=300  # 5 Minuten
ELAPSED=0

while [ $ELAPSED -lt $TIMEOUT ]; do
    STATUS=$(aws ecs describe-services --cluster lyd-cluster --services lyd-design-system --region eu-central-1 --query 'services[0].deployments[0].rolloutState' --output text 2>/dev/null)
    
    if [ "$STATUS" = "COMPLETED" ]; then
        echo "✅ Deployment completed nach $ELAPSED Sekunden"
        break
    fi
    
    echo "⏳ Deployment läuft... ($ELAPSED/$TIMEOUT Sekunden)"
    sleep 30
    ((ELAPSED+=30))
done

if [ $ELAPSED -ge $TIMEOUT ]; then
    echo "❌ Deployment-Timeout nach $TIMEOUT Sekunden"
    exit 1
fi

# 2. Live-URL-Verifikation
echo ""
echo "2. LIVE-URL-VERIFIKATION:"
echo "========================="
node final-verification.js

# 3. Playwright-Verifikation gegen Live-System
echo ""
echo "3. PLAYWRIGHT LIVE-VERIFIKATION:"
echo "================================"
yarn ds:test:visual --max-failures=1 | tail -5

echo ""
echo "=== POST-DEPLOYMENT VERIFIKATION ABGESCHLOSSEN ==="
