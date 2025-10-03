# Vercel Deployment Strategy - Live Your Dreams

## Problem: Auto-Deploy Failures

### Symptoms
- Backoffice Git-Push triggers auto-deploys that fail
- Design-system Git-Push triggers auto-deploys that fail
- Manual CLI deploys (vercel --prod) work correctly

### Root Cause
Vercel Projects sind mit Git-Repository verbunden, aber:
1. **Git Auto-Deploy Context**: Deployed aus Root-Directory
2. **CLI Deploy Context**: Deployed aus Subdirectory (apps/backoffice/)
3. **Monorepo Structure**: Yarn Workspaces nicht kompatibel mit Root-Deploys

## Current Architecture

### Vercel Projects
1. **backoffice** (christianberneckers-projects)
   - Source: `apps/backoffice/`
   - Git Integration: ⚠️ Aktiviert aber fehlerhaft
   - Manual Deploy: ✅ `cd apps/backoffice && vercel --prod`

2. **design-system** (christianberneckers-projects)
   - Source: `design-system/`
   - Git Integration: ⚠️ Aktiviert aber fehlerhaft
   - Manual Deploy: ✅ `cd design-system && vercel --prod`

3. **live-your-dreams** (christianberneckers-projects)
   - Source: Repository Root
   - Git Integration: ❌ Deaktiviert (vercel.json → vercel.json.disabled)
   - Manual Deploy: ❌ Nicht möglich (Yarn Workspaces)

## Solutions

### Option 1: Git Integration deaktivieren (empfohlen)
**Für Projekte: backoffice, design-system**

1. Vercel Dashboard öffnen
2. Project Settings → Git
3. "Git Integration" deaktivieren
4. Deployments nur via CLI: `cd apps/backoffice && vercel --prod`

**Vorteile:**
- ✅ Volle Kontrolle über Deployments
- ✅ Kein Error-Spam im Dashboard
- ✅ Test before Deploy (wie bereits implementiert)

**Nachteile:**
- ❌ Kein automatisches Deploy bei Git-Push
- ❌ Manueller Deploy-Schritt nötig

### Option 2: Vercel Project Root Directory konfigurieren
**Für Projekte: backoffice, design-system**

1. Vercel Dashboard → Project Settings
2. "Root Directory" setzen:
   - backoffice: `apps/backoffice`
   - design-system: `design-system`
3. "Ignore Build Step" deaktivieren

**Vorteile:**
- ✅ Auto-Deploy bei Git-Push funktioniert
- ✅ Korrekte Build-Context

**Nachteile:**
- ❌ Kein Pre-Deploy Testing
- ❌ Failed builds landen direkt in Production

### Option 3: Separate Git Branches
**Für Projekte: backoffice, design-system**

1. Branch-Strategy implementieren:
   - `main` → Manual CLI Deploy only
   - `production-backoffice` → Auto-Deploy für backoffice
   - `production-design-system` → Auto-Deploy für design-system
2. Merge main → production-* nach erfolgreichem CLI Test

**Vorteile:**
- ✅ Test before Deploy
- ✅ Auto-Deploy möglich
- ✅ Granulare Kontrolle

**Nachteile:**
- ❌ Komplexere Branch-Strategy
- ❌ Mehr Overhead

## Current Implementation (Commit 332c7df)

### What Changed
- ✅ Root vercel.json → vercel.json.disabled
- ✅ Created .vercelignore (blocks root deploys)
- ✅ live-your-dreams Auto-Deploys gestoppt

### What Still Fails
- ⚠️ backoffice Git Auto-Deploys (fehlerhafter Build-Context)
- ⚠️ design-system Git Auto-Deploys (fehlerhafter Build-Context)

### Working Deployments
- ✅ `cd apps/backoffice && vercel --prod` (Manual CLI)
- ✅ `cd design-system && vercel --prod` (Manual CLI)

## Recommended Action

**Immediate (heute):**
1. Vercel Dashboard → backoffice Project → Settings → Git
2. "Git Integration" deaktivieren
3. Vercel Dashboard → design-system Project → Settings → Git
4. "Git Integration" deaktivieren

**Workflow:**
```bash
# Test locally
npm run build

# Deploy via CLI
cd apps/backoffice && vercel --prod

# Commit after successful deploy
git add -A && git commit -m "..." && git push
```

**Future (optional):**
- Implement Option 2 (Root Directory) wenn Auto-Deploy gewünscht
- Oder Option 3 (Branch Strategy) für Best-of-Both-Worlds

## Verification Commands

```bash
# Check Deployment Status
vercel list backoffice --scope christianberneckers-projects
vercel list design-system --scope christianberneckers-projects
vercel list live-your-dreams --scope christianberneckers-projects

# Check Project Settings
vercel project ls --scope christianberneckers-projects

# Manual Deploy (Working)
cd apps/backoffice && vercel --prod
cd design-system && vercel --prod
```

## Related Files
- [.vercelignore](../.vercelignore) - Blocks root-level deploys
- [vercel.json.disabled](../vercel.json.disabled) - Old root config
- [apps/backoffice/vercel.json](../apps/backoffice/vercel.json) - Backoffice config
- [CLAUDE.md](../CLAUDE.md) - Deployment rules

## Related Commits
- 332c7df: Disable root-level deployment
- 8acb7a7: Security fix with working CLI deploy
- See: Git log for deployment history
