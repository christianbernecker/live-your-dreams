# Vercel Blob Storage Setup

## Problem
Upload-Fehler: `BLOB_READ_WRITE_TOKEN` fehlt in der Projekt-Konfiguration.

## Lösung: Blob Store manuell im Vercel Dashboard erstellen

### Schritte:

1. **Vercel Dashboard öffnen:**
   https://vercel.com/christianberneckers-projects/backoffice

2. **Storage Tab öffnen:**
   - Navigiere zu "Storage" im linken Menü
   - Klicke auf "Create Database"
   - Wähle "Blob" aus

3. **Blob Store erstellen:**
   - Name: `blog-images`
   - Region: `iad1` (Washington, D.C.)
   - Klicke auf "Create"

4. **Store mit Projekt verknüpfen:**
   - Wähle das Projekt `backoffice` aus
   - Vercel fügt automatisch `BLOB_READ_WRITE_TOKEN` zu den Environment Variables hinzu

5. **Environment Variables verifizieren:**
   ```bash
   cd /Users/christianbernecker/live-your-dreams/apps/backoffice
   vercel env pull .env.local --environment development
   ```

   Die `.env.local` sollte jetzt enthalten:
   ```
   BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxxxxxxxxxx"
   ```

6. **Redeploy triggern:**
   ```bash
   vercel --prod
   ```

## Alternative: CLI (funktioniert nur non-interaktiv)
```bash
# Blob Store erstellen
vercel blob store add blog-images

# Bei Prompt "Y" eingeben zum Verknüpfen mit Projekt
```

## Verifikation
Nach Setup sollte dieser Test erfolgreich sein:
```bash
curl -X POST https://backoffice.liveyourdreams.online/api/media/upload \
  -H "Cookie: ..." \
  -F "file=@test.jpg"
```

## Development Workaround (ohne Blob Store)
Siehe `app/api/media/upload/route.ts` - implementiert automatischen Fallback auf lokales File-System.
