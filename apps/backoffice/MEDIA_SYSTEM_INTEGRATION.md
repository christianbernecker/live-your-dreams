# Media System - Integration Guide

## ✅ IMPLEMENTIERTE KOMPONENTEN

### 1. **FileUpload** (`components/media/FileUpload.tsx`)
- Drag & Drop mit react-dropzone
- Vercel Blob Upload
- URL-Eingabe (Unsplash/Pexels)
- Progress-Anzeige
- Max 5MB, JPG/PNG/WebP/GIF

### 2. **ImagePreview** (`components/media/ImagePreview.tsx`)
- Thumbnail mit Delete-Button
- Alt-Text Editor (inline)
- Responsive Größen (sm/md/lg)

### 3. **HTMLEmbedEditor** (`components/media/HTMLEmbedEditor.tsx`)
- Textarea für HTML/iframe Code
- Live-Validation mit Whitelist
- Security-Checks
- Preview nach dem Speichern

### 4. **MediaManager** (`components/media/MediaManager.tsx`)
- Featured Image Upload
- Placeholder-Detection aus Content
- Dynamische Upload-Felder für erkannte Placeholders
- State-Management für media Array

---

## 🔗 INTEGRATION IN EDITOR

### Im `edit/[id]/page.tsx` hinzufügen:

```tsx
import { MediaManager } from '@/components/media/MediaManager';

// Im Component:
<MediaManager
  content={formData.content}
  media={formData.media || null}
  onMediaUpdate={(media) => updateField('media', media)}
/>
```

### Position im Layout:
- **Nach SEO-Section**, vor Save-Buttons
- Oder als eigener Tab in einer Tab-Navigation

---

## 📝 USAGE FÜR REDAKTEURE

### 1. Featured Image:
1. Drag & Drop oder Klick zum Upload
2. ODER URL von Unsplash/Pexels eingeben
3. Alt-Text direkt im Preview bearbeiten

### 2. Content Medien:
1. Placeholders im Content schreiben: `{{image:intro-photo}}` oder `{{html:stats-chart}}`
2. MediaManager erkennt automatisch und zeigt Upload-Felder
3. Bilder hochladen ODER URLs eingeben
4. HTML-Code einfügen (nur whitelisted iframes)

---

## 🔒 SICHERHEIT

**Whitelist für HTML Embeds:**
- YouTube, Vimeo
- Datawrapper, Flourish
- Google Maps
- liveyourdreams.online

**Validation:**
- Keine Script-Tags
- Keine inline Event-Handler (onclick, onerror)
- Automatisches Sandboxing von iframes
- Max Filesize: 5MB

---

## 🚀 DEPLOYMENT STATUS

**Backend:** ✅ Deployed & Live
- Upload API
- Validation
- Preview Renderer
- Database Schema

**Frontend UI:** ⚠️ Komponenten fertig, Integration pending
- Alle Components erstellt
- Noch nicht in Edit-Page integriert
- Benötigt: State-Anbindung an formData.media

---

## 📋 NÄCHSTE SCHRITTE

1. MediaManager in `/dashboard/blog/edit/[id]/page.tsx` integrieren
2. formData.media State-Handling testen
3. End-to-End Test: Upload → Save → Preview
4. KI-Prompt mit Media-Beispielen aktualisieren
5. Dokumentation für Content-Team

---

## 🎯 JSON SCHEMA FÜR KI

```json
{
  "title": "Artikel Titel",
  "content": "...Text {{image:intro-photo}} mehr Text {{html:stats-chart}}...",
  "media": [
    {
      "id": "featured",
      "type": "image",
      "url": null,
      "alt": "Featured Image Alt-Text",
      "isFeatured": true,
      "position": "header"
    },
    {
      "id": "intro-photo",
      "type": "image",
      "url": null,
      "alt": "München Skyline mit Immobilien",
      "position": "content"
    },
    {
      "id": "stats-chart",
      "type": "html",
      "html": null,
      "description": "Interaktive Courtage-Statistik",
      "position": "content"
    }
  ]
}
```
