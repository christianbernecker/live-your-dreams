# Git Integration deaktivieren - Vercel Dashboard

## Problem
Git-Pushes triggern weiterhin Auto-Deploys die fehlschlagen:
- Backoffice: Auto-Deploy aus Root-Context schlägt fehl
- Design System: Auto-Deploy aus Root-Context schlägt fehl

## Lösung: Git Integration deaktivieren

### Für Backoffice Project

1. **Vercel Dashboard öffnen**
   - URL: https://vercel.com/christianberneckers-projects/backoffice

2. **Settings → Git**
   - Navigation: Settings (Sidebar) → Git (Tab)

3. **Git Integration deaktivieren**
   - Unter "Git Repository" auf **"Disconnect"** klicken
   - Bestätigen

4. **Verifizieren**
   ```bash
   # Git Push sollte KEINEN Auto-Deploy mehr triggern
   git push origin main

   # Warte 10 Sekunden
   sleep 10

   # Check: Keine neuen Deployments
   vercel list backoffice --scope christianberneckers-projects
   ```

### Für Design System Project (lyd-design-system)

1. **Vercel Dashboard öffnen**
   - URL: https://vercel.com/christianberneckers-projects/lyd-design-system

2. **Settings → Git**
   - Navigation: Settings (Sidebar) → Git (Tab)

3. **Git Integration deaktivieren**
   - Unter "Git Repository" auf **"Disconnect"** klicken
   - Bestätigen

4. **Verifizieren**
   ```bash
   # Git Push sollte KEINEN Auto-Deploy mehr triggern
   git push origin main

   # Warte 10 Sekunden
   sleep 10

   # Check: Keine neuen Deployments
   vercel list lyd-design-system --scope christianberneckers-projects
   ```

## Nach Deaktivierung

### Deployment Workflow (Manual CLI)

**Backoffice:**
```bash
./scripts/deploy-backoffice.sh
# Oder: cd apps/backoffice && vercel --prod
```

**Design System:**
```bash
./scripts/deploy-design-system.sh
# Oder: cd design-system && vercel --prod
```

**Git Commit:**
```bash
# NACH erfolgreichem Vercel Deploy
git add -A
git commit -m "..."
git push origin main
# → KEIN Auto-Deploy mehr!
```

## Vorteile

✅ **Keine fehlerhaften Auto-Deploys mehr**
- Vercel Dashboard zeigt keine Errors mehr
- Sauberer Deployment-Status

✅ **Volle Kontrolle über Deployments**
- Test before Deploy
- Fehler fixen vor Production-Deploy
- Kein "Oops, broken build in Production"

✅ **Besserer Workflow**
- 1. Deploy via CLI → 2. Verifizieren → 3. Git Commit
- Etabliert in Commit 8acb7a7

## Alternative: Root Directory setzen (NICHT empfohlen)

Falls Auto-Deploy gewünscht:
1. Settings → General → "Root Directory" setzen:
   - Backoffice: `apps/backoffice`
   - Design System: `design-system`
2. Git-Push triggert dann korrekten Deploy

**Nachteile:**
- Kein Pre-Deploy Testing
- Broken builds landen direkt in Production
- Gegen etablierten Workflow (CLI → Git)

## Status Check

### Vor Deaktivierung
```bash
$ vercel list backoffice
  36s     https://backoffice-o8s1e3ctc-[...].vercel.app     ● Error     Production
  11m     https://backoffice-p0agiy0ta-[...].vercel.app     ● Error     Production
  # → Auto-Deploys schlagen fehl
```

### Nach Deaktivierung
```bash
$ git push origin main
# → KEIN neuer Deployment

$ vercel list backoffice
  2h      https://backoffice-2rzdrmq4i-[...].vercel.app     ● Ready     Production
  # → Nur manuelle CLI Deploys (Ready)
```

## Related Commits
- 332c7df: Disable root-level deployment (vercel.json disabled)
- c1276a1: Add CLI deployment scripts + documentation
- 8acb7a7: Security fix with CLI deploy workflow

## Next Steps
Nach Deaktivierung der Git Integration:
1. ✅ Teste: `git push origin main` triggert KEINEN Deploy
2. ✅ Teste: `./scripts/deploy-backoffice.sh` funktioniert
3. ✅ Archiviere alte Vercel-Projekte (live-your-dreams, etc.)
