# Vercel Git Auto-Deploy aktivieren - Root Directory Lösung

## Ziel
Git-Push soll automatisch Vercel Deployments triggern (erfolgreich, nicht Error).

## Problem
Aktuelle Auto-Deploys schlagen fehl weil:
- Vercel deployed aus Repository-Root
- Builds benötigen Subdirectory-Context (`apps/backoffice/` oder `design-system/`)
- Yarn Workspaces funktioniert nicht von Root

## Lösung: Root Directory Setting

### Schritt 1: Backoffice konfigurieren

**1.1 Vercel Dashboard öffnen**
- URL: https://vercel.com/christianberneckers-projects/backoffice
- Oder: https://vercel.com → Projects → "backoffice"

**1.2 Settings → General**
- Linke Sidebar: "Settings"
- Tab: "General"

**1.3 Root Directory setzen**
- Scrolle zu "Root Directory"
- Klicke "Edit"
- **Trage ein: `apps/backoffice`**
- Klicke "Save"

**1.4 Build Settings verifizieren**
Stelle sicher diese Werte sind gesetzt:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (oder leer für default)
- **Install Command**: `npm install` (oder leer für default)
- **Output Directory**: `.next` (default für Next.js)

**1.5 Speichern & Verifizieren**
- Klicke "Save" falls Änderungen gemacht
- Status: "Root Directory: apps/backoffice" sollte angezeigt werden

### Schritt 2: Design System konfigurieren

**2.1 Vercel Dashboard öffnen**
- URL: https://vercel.com/christianberneckers-projects/lyd-design-system
- Oder: https://vercel.com → Projects → "lyd-design-system"

**2.2 Settings → General**
- Linke Sidebar: "Settings"
- Tab: "General"

**2.3 Root Directory setzen**
- Scrolle zu "Root Directory"
- Klicke "Edit"
- **Trage ein: `design-system`**
- Klicke "Save"

**2.4 Build Settings verifizieren**
Stelle sicher diese Werte sind gesetzt:
- **Framework Preset**: Other (oder Storybook falls verfügbar)
- **Build Command**: `npm run build`
- **Install Command**: `npm install`
- **Output Directory**: `storybook-static` (oder dein Output-Dir)

**2.5 Speichern & Verifizieren**
- Klicke "Save" falls Änderungen gemacht
- Status: "Root Directory: design-system" sollte angezeigt werden

## Schritt 3: Testen

### 3.1 Test-Commit machen
```bash
# Kleine Änderung machen (z.B. in README)
echo "# Test Auto-Deploy" >> apps/backoffice/README.md

# Commit & Push
git add apps/backoffice/README.md
git commit -m "test: Verify Vercel auto-deploy with Root Directory"
git push origin main
```

### 3.2 Vercel Dashboard beobachten
- Gehe zu: https://vercel.com/christianberneckers-projects
- Projekt "backoffice" sollte **neuen Deployment starten**
- Status sollte **"Building..."** dann **"Ready"** werden (nicht Error!)

### 3.3 Deployment verifizieren
```bash
# Warte 30-60 Sekunden
sleep 60

# Check Deployment Status
vercel list backoffice --scope christianberneckers-projects

# Erwartetes Resultat:
# 1m    https://backoffice-xxxx.vercel.app    ● Ready    Production    45s
```

### 3.4 Production URL testen
```bash
curl -I https://backoffice.liveyourdreams.online

# Erwartetes Resultat:
# HTTP/2 200 (oder 307 für Redirect zu Login)
```

## Was passiert nach der Konfiguration?

### Vorher (Root-Deploy)
```
Git Push → Vercel Build aus Root → ❌ Yarn Workspace Error → ● Error (7s)
```

### Nachher (Subdirectory-Deploy)
```
Git Push → Vercel Build aus apps/backoffice/ → ✅ Success → ● Ready (45s)
```

## Workflow nach Aktivierung

```bash
# 1. Code ändern
vim apps/backoffice/app/some-file.tsx

# 2. Commit & Push
git add -A
git commit -m "feat: your feature"
git push origin main

# 3. Vercel Auto-Deploy startet automatisch ✅
# 4. Warte auf "Ready" Status (30-60s)
# 5. Production URL ist automatisch aktualisiert
```

**Kein manueller `vercel --prod` mehr nötig!**

## Cleanup (Optional)

Nach erfolgreicher Konfiguration kannst du aufräumen:

```bash
# Root vercel.json ist nicht mehr nötig
git rm vercel.json.disabled

# .vercelignore ist nicht mehr nötig (Root Directory nutzt Subdirectory)
git rm .vercelignore

# Helper Scripts BEHALTEN als Backup/Manual Deploy Option
# ./scripts/deploy-backoffice.sh
# ./scripts/deploy-design-system.sh

git commit -m "chore: Remove obsolete Vercel config files"
git push origin main
```

## Troubleshooting

### Problem: "Root Directory not found"
**Lösung:** Prüfe Schreibweise
- ✅ Korrekt: `apps/backoffice` (kein trailing slash!)
- ❌ Falsch: `apps/backoffice/` (trailing slash)
- ❌ Falsch: `/apps/backoffice` (leading slash)

### Problem: Build schlägt weiterhin fehl
**Debug:**
1. Vercel Dashboard → Deployments → Neuester Build
2. Klicke auf "View Build Logs"
3. Prüfe Error-Message
4. Verifiziere Build Commands:
   ```bash
   # Lokal testen
   cd apps/backoffice
   npm install
   npm run build  # Sollte funktionieren
   ```

### Problem: "No Build Output found"
**Lösung:** Output Directory prüfen
- Next.js: `.next`
- Storybook: `storybook-static`
- Custom: Check package.json Build Script Output

## Verifikation Checklist

Nach Konfiguration:

- [ ] Root Directory in Vercel Dashboard: `apps/backoffice` ✅
- [ ] Root Directory in Vercel Dashboard: `design-system` ✅
- [ ] Test-Push triggert Auto-Deploy ✅
- [ ] Auto-Deploy Status: "Ready" (nicht "Error") ✅
- [ ] Production URL aktualisiert: https://backoffice.liveyourdreams.online ✅
- [ ] Production URL aktualisiert: https://designsystem.liveyourdreams.online ✅

## Nächste Schritte

Nach erfolgreicher Konfiguration:

1. ✅ Git Auto-Deploy funktioniert
2. ✅ Kein manueller CLI Deploy mehr nötig
3. ✅ Git ist immer aktuell (Push = Deploy)
4. ✅ Alte Helper Scripts als Backup behalten
5. ✅ Cleanup (vercel.json.disabled, .vercelignore entfernen)

**Status:** Ready for Production! 🚀
