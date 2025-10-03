# Vercel Auto-Deploy - Quick Setup

## 🎯 Ziel
Git Push → Auto-Deploy → Production Update (automatisch)

## ⚡ 5-Minuten Setup

### 1️⃣ Backoffice
```
URL: https://vercel.com/christianberneckers-projects/backoffice
Settings → General → Root Directory
Setze: apps/backoffice
Save ✓
```

### 2️⃣ Design System
```
URL: https://vercel.com/christianberneckers-projects/lyd-design-system
Settings → General → Root Directory
Setze: design-system
Save ✓
```

### 3️⃣ Testen
```bash
git push origin main
# → Auto-Deploy startet
# → Warte 60s
# → Status sollte "Ready" sein (nicht "Error")
```

## ✅ Erfolg wenn:
- Vercel Dashboard zeigt: **● Ready** (grün)
- Deployment Duration: **~45s** (nicht 7s Error)
- Production URL aktualisiert automatisch

## 📖 Vollständige Anleitung
Siehe: [ENABLE_AUTO_DEPLOY.md](ENABLE_AUTO_DEPLOY.md)

## 🆘 Bei Problemen
1. Root Directory Schreibweise prüfen (kein trailing `/`)
2. Build Commands verifizieren
3. Logs anschauen: Vercel Dashboard → Deployment → Build Logs
