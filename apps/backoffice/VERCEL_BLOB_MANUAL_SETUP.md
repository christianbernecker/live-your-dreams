# MANUELLE VERCEL BLOB STORE KONFIGURATION

## ⚠️ KRITISCH: Blob Store fehlt aktuell

Der Upload-Fix ist implementiert, ABER der Production-Upload funktioniert erst nach diesem manuellen Setup.

## SCHRITTE ZUM BLOB STORE SETUP:

### 1. Vercel Dashboard öffnen
```
https://vercel.com/christianberneckers-projects/backoffice
```

### 2. Storage erstellen
1. Klicke auf "Storage" im linken Menü
2. Klicke "Create Database"
3. Wähle "Blob" aus der Liste

### 3. Blob Store konfigurieren
- **Name:** `blog-images`
- **Region:** `iad1` (Washington, D.C. - nächste zu EU)
- Klicke "Create"

### 4. Mit Projekt verknüpfen
1. Bei "Link to a project" das Projekt **backoffice** auswählen
2. Vercel fügt automatisch diese Environment Variables hinzu:
   - `BLOB_READ_WRITE_TOKEN`

3. Bestätige mit "Link Store"

### 5. Deployment triggern
Nach dem Setup automatisch deployed werden. Falls nicht:
```bash
cd /Users/christianbernecker/live-your-dreams/apps/backoffice
vercel --prod
```

### 6. Verifikation
Nach erfolgreichem Deploy:
1. Gehe zu https://backoffice.liveyourdreams.online/dashboard/blog/edit/[id]
2. Lade ein Testbild hoch (JPG, PNG, oder GIF)
3. Sollte ohne Fehler zu WebP konvertiert und hochgeladen werden
4. Öffne Browser DevTools → Console
5. Du solltest sehen:
   ```
   Original file: test.jpg image/jpeg 2.5MB
   WebP file: test.webp image/webp 0.3MB
   ```

## Was passiert nach dem Setup?

✅ **Mit Blob Store (Production):**
- Uploads gehen zu Vercel Blob Storage
- CDN-backed, global verfügbar
- Automatische Skalierung

⚠️ **Ohne Blob Store (Development):**
- Uploads gehen zu `/public/uploads/blog/`
- Nur lokal verfügbar
- Console-Warning erscheint

## Troubleshooting

### "Upload failed" trotz Setup
```bash
# Check Environment Variables
vercel env ls

# BLOB_READ_WRITE_TOKEN sollte dort sein
# Falls nicht, Store neu verknüpfen im Dashboard
```

### Deployment stuck
```bash
# Redeploy manuell triggern
vercel --prod --force
```

### Alte Deployments löschen
```bash
# Liste alle Deployments
vercel list

# Lösche altes Deployment
vercel remove [deployment-id]
```
