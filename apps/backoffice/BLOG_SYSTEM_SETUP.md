# 📝 **LYD Blog System v1.1 - Setup Guide**

> **Multi-Platform Blog mit KI-Import Support - Production-Ready**

---

## 🎯 **System Overview**

Das LYD Blog System v1.1 unterstützt:
- ✅ **Multi-Platform Distribution:** WOHNEN, MAKLER, ENERGIE
- ✅ **KI-Agent Integration:** JSON v1.1 Import Format
- ✅ **Security-First:** HTML Sanitization & XSS-Schutz
- ✅ **SEO-Optimiert:** Meta-Tags, JSON-LD, OpenGraph
- ✅ **Asset Management:** S3/CDN Integration
- ✅ **Design System:** 100% LYD-konform

---

## 🚀 **Quick Start**

### **1. Database Migration**
```bash
cd apps/backoffice

# Prisma Client generieren
npx prisma generate

# Schema zu Neon PostgreSQL pushen
npx prisma db push

# Verifizierung
npx prisma studio
```

### **2. Environment Variables**

**Erstelle `.env.local` (falls nicht vorhanden):**
```bash
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://neondb_owner:npg_hz8vgpX6UOBw@ep-divine-dust-abhyp415.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-nextauth-secret"

# S3/CDN für Blog Assets (Optional - kann später konfiguriert werden)
AWS_REGION="eu-central-1"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_S3_BUCKET="lyd-blog-assets"
CDN_BASE_URL="https://lyd-blog-assets.s3.eu-central-1.amazonaws.com"
```

### **3. Dependencies Installation**
```bash
# Dependencies sind bereits in package.json definiert
npm install

# Falls Workspace-Fehler:
rm -rf node_modules package-lock.json
npm install
```

### **4. Development Server**
```bash
npm run dev
```

**Zugriff:** `http://localhost:3001/dashboard/blog`

---

## 📱 **User Interface**

### **Blog Dashboard** (`/dashboard/blog`)
- **Multi-Platform Filtering:** Status, Plattformen, Kategorien
- **Statistics Cards:** Total, Published, Drafts, Scheduled
- **Search & Filter:** Volltext-Suche, Date Range
- **Quick Actions:** KI-Import starten

### **Import Interface** (`/dashboard/blog/import`)
- **JSON v1.1 Dropzone:** Drag & Drop oder File Select
- **Live Preview:** Content, SEO, Platforms  
- **Security Check:** HTML Sanitization, Asset Validation
- **Copy-Prompt Panel:** KI-Agent Templates & Briefing

---

## 🤖 **KI-Agent Integration**

### **JSON v1.1 Format:**
```json
{
  "version": "1.1",
  "source": {
    "agent": "chatgpt",
    "model": "gpt-4.1", 
    "timestamp": "2025-09-29T14:00:00Z"
  },
  "content": {
    "platforms": ["WOHNEN"],
    "category": "Ratgeber",
    "title": "Immobilie ohne Makler verkaufen - Kompletter Guide 2025",
    "slug": "immobilie-ohne-makler-verkaufen-guide-2025",
    "excerpt": "So verkaufen Sie in München rechtssicher ohne Courtage...",
    "seo": {
      "metaTitle": "Ohne Makler verkaufen - so gelingt's (Guide 2025)",
      "metaDescription": "Schritt-für-Schritt Anleitung...",
      "focusKeyword": "immobilie ohne makler verkaufen"
    },
    "format": "mdx",
    "body": "# Titel...",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "BlogPosting"
    }
  }
}
```

### **Plattform-Kategorien:**
- **WOHNEN:** Ratgeber, Markt, Recht, DIY, Verkauf, Kauf
- **MAKLER:** Premium, Investment, Referenz, Luxury, Off-Market
- **ENERGIE:** GEG, Förderung, Technik, Modernisierung, Energieausweis

---

## 🔒 **Security Features**

### **HTML Sanitization:**
- **DOMPurify Integration:** Whitelist-basierte Bereinigung
- **Allowed Tags:** p, h1-h6, ul, ol, li, strong, em, a, img, svg, table
- **iframe Restrictions:** Nur YouTube-NoCookie erlaubt
- **XSS Protection:** Automatic Script/Event Handler Removal

### **Content Validation:**
- **Size Limits:** 2MB JSON, 10MB pro Asset, 50MB total
- **MIME Validation:** WebP, JPEG, PNG, SVG, CSS, JS
- **Schema Validation:** Zod-basierte Typ-Sicherheit
- **Platform-Category Matching:** Automatische Plausibilitätsprüfung

---

## ☁️ **Asset Management** 

### **S3 Configuration (Optional):**
```bash
# AWS S3 Bucket erstellen
aws s3 mb s3://lyd-blog-assets --region eu-central-1

# Public Read Policy setzen
aws s3api put-bucket-policy --bucket lyd-blog-assets --policy '{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::lyd-blog-assets/*"
  }]
}'

# CloudFront Distribution (optional)
# Für bessere Performance und CDN
```

### **Vercel Blob Alternative:**
```typescript
// Falls S3 nicht verfügbar, nutze Vercel Blob
import { put } from '@vercel/blob';

const blob = await put(filename, file, {
  access: 'public',
  addRandomSuffix: false
});
```

---

## 📊 **Database Schema**

### **Neue Tabellen:**
- ✅ **`blog_posts`** - Haupt-Content Tabelle
- ✅ **Blog-spezifische Enums:** BlogStatus, Platform
- ✅ **Audit Integration:** blog_post_id in audit_events

### **Wichtige Felder:**
```sql
-- Multi-Platform Support
platforms        Platform[]  -- WOHNEN, MAKLER, ENERGIE

-- Content Formats  
content          TEXT        -- Markdown/MDX/HTML
html_blocks      JSON        -- Komplexe Grafiken/Interaktivität

-- SEO Optimization
meta_title       VARCHAR(120)
meta_description VARCHAR(200)
json_ld          JSON        -- Structured Data

-- KI Integration
import_source    VARCHAR     -- "chatgpt", "claude", etc.
import_model     VARCHAR     -- "gpt-4.1", etc.
import_timestamp TIMESTAMP
```

---

## 📋 **Testing & Verification**

### **Manual Test:**
1. **Navigate:** `http://localhost:3001/dashboard/blog`
2. **Import Test:** Klick auf "KI-Import starten"
3. **Copy Template:** JSON v1.1 Template kopieren
4. **Upload Test:** JSON-Datei hochladen
5. **Validation:** Security-Check durchlaufen
6. **Import:** "Validieren & als Draft anlegen"

### **API Test:**
```bash
# Validation Test
curl -X POST http://localhost:3001/api/blog/validate \
  -H "Content-Type: application/json" \
  -d @test-blog-post.json

# Import Test  
curl -X POST http://localhost:3001/api/blog/import \
  -H "Content-Type: application/json" \
  -d @test-blog-post.json
```

---

## 🎯 **Production Deployment**

### **Vercel Setup:**
```bash
# Deploy Backoffice mit Blog System
cd apps/backoffice
vercel --prod

# Environment Variables setzen
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add AWS_ACCESS_KEY_ID production  # (falls S3 verwendet)
vercel env add AWS_SECRET_ACCESS_KEY production
```

### **Database Migration:**
```bash
# Production Schema Push
npx prisma db push --accept-data-loss
```

---

## 🔄 **Workflow**

### **Content Creation via KI:**
1. **Agent Setup:** JSON Template + Briefing in KI-Agent
2. **Content Request:** "Schreibe Artikel für WOHNEN über..."
3. **JSON Export:** KI liefert JSON v1.1 Format
4. **Import:** Upload in `/dashboard/blog/import`
5. **Review:** Security-Check & SEO Preview
6. **Publish:** Import als Draft → Review → Publish

### **Manual Content Creation:**
1. **Direct Creation:** `/dashboard/blog` → "Neuer Artikel"
2. **Editor Interface:** Meta-Daten + Content Editor
3. **Preview:** SERP & OpenGraph Preview
4. **Workflow:** Draft → Review → Published

---

## 📈 **Monitoring & Analytics**

### **Audit Logging:**
Alle Blog-Aktivitäten werden geloggt:
- `BLOG_IMPORT_SUCCESS` - Erfolgreicher KI-Import
- `BLOG_IMPORT_VALIDATION_FAILED` - Validation Fehler
- `BLOG_POST_PUBLISH` - Artikel veröffentlicht
- `BLOG_ASSET_UPLOAD` - Asset hochgeladen
- `BLOG_HTML_BLOCK_SANITIZE` - HTML bereinigt

### **Performance Monitoring:**
```sql
-- Import Success Rate
SELECT 
  COUNT(*) FILTER (WHERE type = 'BLOG_IMPORT_SUCCESS') as successful,
  COUNT(*) FILTER (WHERE type = 'BLOG_IMPORT_VALIDATION_FAILED') as failed,
  COUNT(*) as total
FROM audit_events 
WHERE type LIKE 'BLOG_IMPORT_%'
AND created_at >= NOW() - INTERVAL '30 days';

-- Content Statistics
SELECT 
  status,
  COUNT(*) as count,
  AVG(LENGTH(content)) as avg_content_length
FROM blog_posts 
GROUP BY status;
```

---

## 🚨 **Troubleshooting**

### **Häufige Probleme:**

**🔴 Import Validation Failed:**
```
Problem: "Validation failed" bei JSON Upload
Lösung: JSON Schema prüfen, version: "1.1" verwenden
Debug: /api/blog/validate für Details
```

**🔴 HTML Sanitization Errors:**
```
Problem: "Content sanitization failed"  
Lösung: Gefährliche HTML-Elemente entfernen
Erlaubt: p, h1-h6, ul, ol, strong, em, a, img, svg
Verboten: script, iframe (außer YouTube-NoCookie)
```

**🔴 Asset Upload Fails:**
```
Problem: "Asset upload failed"
Lösung: S3 Credentials prüfen, Asset-Größe < 10MB
Alternative: Vercel Blob verwenden
```

**🔴 Database Connection:**
```
Problem: Prisma connection failed
Lösung: DATABASE_URL in .env.local prüfen
Test: npx prisma db pull
```

---

## ✅ **Success Criteria**

**🎯 BLOG SYSTEM BEREIT wenn:**
- [ ] `/dashboard/blog` lädt ohne Fehler
- [ ] JSON v1.1 Import funktioniert
- [ ] Security-Check zeigt "Validation erfolgreich"
- [ ] SERP/OG Preview wird angezeigt
- [ ] Blog-Artikel als Draft erstellt wird
- [ ] Multi-Platform Badges werden korrekt angezeigt
- [ ] Audit-Events werden in DB gespeichert

**🚀 PRODUCTION-READY für KI-Content Import!**

---

*Erstellt: September 2025 | LYD Blog System v1.1*
