# Backoffice Deployment Workflow

## Übersicht

Das Backoffice wird auf **Vercel** gehostet mit manueller Deployment-Kontrolle via CLI.

**Production URL:** https://backoffice.liveyourdreams.online  
**Vercel Project:** `backoffice` (christianberneckers-projects)

---

## Quick Start

### 1. Production Deployment (Empfohlen)

```bash
# Aus Repository Root
./scripts/deploy-backoffice.sh
```

Das Script:
- ✅ Prüft uncommitted changes
- ✅ Zeigt aktuellen Branch und letzten Commit
- ✅ Fragt vor Deployment nach
- ✅ Deployed zu Production
- ✅ Zeigt Live-URLs an

### 2. Manuelles Deployment (Fortgeschritten)

```bash
cd apps/backoffice
vercel --prod --yes
```

---

## Warum kein automatisches GitHub Deployment?

**Problem:** Monorepo-Struktur  
Das Repository hat mehrere Apps (`apps/backoffice`, `design-system/v2`), aber Vercel's GitHub Integration kann nicht zuverlässig erkennen, welche Changes das Backoffice betreffen.

**Lösung:** Manuelles Deployment via CLI  
- Volle Kontrolle über Deployments
- Keine ungewollten Deployments bei Changes in anderen Apps
- Konsistente Build-Umgebung

---

## Deployment Checklist

### Vor dem Deployment

- [ ] Alle Changes committed: `git status`
- [ ] Tests erfolgreich: `npm run test` (falls vorhanden)
- [ ] Build lokal erfolgreich: `npm run build`
- [ ] Auf `main` Branch: `git branch --show-current`
- [ ] Neueste Changes gepullt: `git pull origin main`

### Deployment durchführen

```bash
./scripts/deploy-backoffice.sh
```

### Nach dem Deployment

- [ ] Vercel Build Log prüfen (keine Errors)
- [ ] Live-URL testen: https://backoffice.liveyourdreams.online
- [ ] Login testen
- [ ] Kritische Features prüfen

---

## Monorepo Konfiguration

### vercel.json (Repository Root)

```json
{
  "buildCommand": "cd apps/backoffice && npm run build",
  "installCommand": "cd apps/backoffice && npm install",
  "outputDirectory": "apps/backoffice/.next"
}
```

Diese Konfiguration sagt Vercel:
- **Build-Kontext:** `apps/backoffice/`
- **Build-Command:** `npm run build` (im backoffice Verzeichnis)
- **Output:** `.next` Build-Artefakte

---

## Troubleshooting

### Problem: Build Error

```bash
# Lokalen Build testen
cd apps/backoffice
npm install
npm run build
```

### Problem: Alte Version wird ausgeliefert

```bash
# Hard Refresh im Browser
# Mac: Cmd+Shift+R
# Windows: Ctrl+Shift+R

# Oder: Cache in Vercel clearen
vercel --prod --yes --force
```

### Problem: Environment Variables fehlen

Vercel Project Settings:
1. https://vercel.com/christianberneckers-projects/backoffice/settings/environment-variables
2. Prüfe: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`

---

## Environment Variables

### Production (Vercel)

Kritische Variablen:
- `DATABASE_URL` → Neon PostgreSQL Connection String
- `NEXTAUTH_SECRET` → Auth Secret Key
- `NEXTAUTH_URL` → `https://backoffice.liveyourdreams.online`
- `NODE_ENV` → `production` (automatisch)

### Lokale Entwicklung

```bash
# apps/backoffice/.env.local
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="generate-with-openssl-rand"
NEXTAUTH_URL="http://localhost:3000"
```

---

## Alternative: GitHub Actions (Future)

Für automatisches Deployment via GitHub Actions:

```yaml
# .github/workflows/deploy-backoffice.yml
name: Deploy Backoffice
on:
  push:
    branches: [main]
    paths:
      - 'apps/backoffice/**'
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: apps/backoffice
          vercel-args: '--prod'
```

**Status:** Noch nicht implementiert  
**Reason:** Manuelle Kontrolle bevorzugt für Stabilität

---

## Rollback

Falls ein Deployment fehlschlägt:

```bash
# 1. Vorheriges Deployment finden
cd apps/backoffice
vercel ls --prod

# 2. Zum vorherigen Deployment promoten
vercel promote <DEPLOYMENT-URL> --yes
```

Oder im Vercel Dashboard:
1. https://vercel.com/christianberneckers-projects/backoffice/deployments
2. Vorheriges "Ready" Deployment auswählen
3. "Promote to Production" klicken

---

## Siehe auch

- [Vercel Complete Guide](./VERCEL_COMPLETE_GUIDE.md)
- [Neon Database Setup](./NEON_DATABASE_SETUP.md)
- [Quick Start Guide](../development/QUICK_START_GUIDE.md)
