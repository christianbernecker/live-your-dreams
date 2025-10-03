# Deployment Workflow - Live Your Dreams

## Aktive Production Deployments

### 1. Backoffice
- **URL**: https://backoffice.liveyourdreams.online
- **Source**: `apps/backoffice/`
- **Deploy**: `./scripts/deploy-backoffice.sh`

### 2. Design System
- **URL**: https://designsystem.liveyourdreams.online
- **Source**: `design-system/`
- **Deploy**: `./scripts/deploy-design-system.sh`

## Deployment-Strategie

### ❌ Git Auto-Deploy DEAKTIVIERT

**Warum?**
- Monorepo-Struktur (Yarn Workspaces)
- Git-Push triggert Deploy vom Repository-Root
- Root-Deploys schlagen fehl (Workspace-Fehler)

**Lösung:**
- Vercel Git Integration deaktiviert
- Manueller CLI Deploy aus Subdirectories

### ✅ Manueller CLI Deploy

**Workflow (3 Schritte):**

```bash
# 1. Deploy via Vercel CLI
./scripts/deploy-backoffice.sh
# Oder: cd apps/backoffice && vercel --prod

# 2. Warte auf erfolgreichen Deploy (Exit Code 0)
# Check: "Deployment completed"

# 3. DANN Git Commit & Push
git add -A
git commit -m "fix: your commit message"
git push origin main
```

### Helper Scripts

**Backoffice deployen:**
```bash
./scripts/deploy-backoffice.sh
```

Script macht:
- ✅ Build-Test (`npm run build`)
- ✅ Vercel Production Deploy
- ✅ Erfolgs-Meldung mit Next-Steps

**Design System deployen:**
```bash
./scripts/deploy-design-system.sh
```

Script macht:
- ✅ Build-Test (`npm run build`)
- ✅ Vercel Production Deploy
- ✅ Erfolgs-Meldung mit Next-Steps

## Vercel Projekt-Konfiguration

### Backoffice
- **Vercel Project**: `backoffice`
- **Git Integration**: ❌ Deaktiviert
- **Build Command**: `npm run build`
- **Install Command**: `npm install`
- **Framework**: Next.js

### Design System
- **Vercel Project**: `lyd-design-system` (oder `design-system`)
- **Git Integration**: ❌ Deaktiviert
- **Build Command**: `npm run build`
- **Install Command**: `npm install`
- **Framework**: Storybook / HTML

## Troubleshooting

### Problem: "error Workspaces can only be enabled in private projects"
**Ursache:** Deploy aus Repository-Root
**Lösung:** Deploy aus `apps/backoffice/` oder `design-system/`

### Problem: Vercel Auto-Deploy schlägt fehl
**Ursache:** Git Integration aktiviert (triggert Root-Deploy)
**Lösung:**
1. Vercel Dashboard → Project Settings → Git
2. Git Integration deaktivieren
3. Nur CLI Deploy nutzen

### Problem: Build-Fehler lokal, aber Deploy soll gemacht werden
**Lösung:** NICHT deployen! Erst Fehler fixen, dann deployen.

```bash
# ❌ NIEMALS:
cd apps/backoffice && vercel --prod  # Mit Build-Errors

# ✅ IMMER:
npm run build  # Erst lokal testen
# Fehler fixen
npm run build  # Nochmal testen
vercel --prod  # Dann deployen
```

## Vercel Projekte (Cleanup)

### Aktiv (Behalten)
- ✅ `backoffice` → https://backoffice.liveyourdreams.online
- ✅ `lyd-design-system` → https://designsystem.liveyourdreams.online

### Archivieren (Nicht mehr benötigt)
- ❌ `live-your-dreams` (Root-Deploy, deaktiviert)
- ❌ `design-system` (Legacy, falls duplikat)
- ❌ `lyd-spinner-design-system` (Alt)
- ❌ `lyd-design-system-v2` (Alt)

**Aktion:** Im Vercel Dashboard archivieren oder löschen

## Best Practices

### ✅ DO
- Erst lokal testen (`npm run build`)
- Helper Scripts nutzen (`./scripts/deploy-*.sh`)
- Auf erfolgreichen Deploy warten (Exit Code 0)
- Deployment verifizieren (Production URL testen)
- DANN Git Commit & Push

### ❌ DON'T
- NIEMALS aus Repository-Root deployen
- NIEMALS mit Build-Errors deployen
- NIEMALS Git-Push vor Vercel-Deploy
- NIEMALS Git Auto-Deploy aktivieren (Monorepo!)

## Deployment-Logs

### Erfolgreiche Deploys prüfen
```bash
vercel list backoffice --scope christianberneckers-projects
vercel list lyd-design-system --scope christianberneckers-projects
```

### Deployment-Details ansehen
```bash
vercel inspect <deployment-url> --scope christianberneckers-projects
```

### Production-URLs testen
```bash
curl -I https://backoffice.liveyourdreams.online
curl -I https://designsystem.liveyourdreams.online
```

## Verantwortlichkeiten

**Claude Code:**
- Deployment via CLI durchführen
- Erfolgsmeldung abwarten
- Bei Erfolg: Git Commit empfehlen
- Bei Fehler: Build-Logs analysieren und fixen

**Entwickler:**
- Deployment-Scripts ausführen
- Git Commits nach erfolgreichem Deploy
- Vercel Dashboard für Monitoring
- Legacy-Projekte archivieren (optional)

## Related Files
- [deploy-backoffice.sh](../../scripts/deploy-backoffice.sh) - Backoffice Deploy Script
- [deploy-design-system.sh](../../scripts/deploy-design-system.sh) - Design System Deploy Script
- [.vercelignore](../../.vercelignore) - Blocks root-level deploys
- [vercel.json.disabled](../../vercel.json.disabled) - Old root config (disabled)
- [CLAUDE.md](../../CLAUDE.md) - Deployment rules for Claude
