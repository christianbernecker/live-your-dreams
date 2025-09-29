# 🚀 **Vercel Complete Deployment Guide**

> **Vollständige Anleitung für das Live Your Dreams System auf Vercel**

---

## 🎯 **Aktuelle Production-URLs**

| Service | URL | Status | Vercel Project |
|---------|-----|--------|----------------|
| **Backoffice** | [backoffice.liveyourdreams.online](https://backoffice.liveyourdreams.online) | ✅ Production | `lyd-backoffice` |
| **Design System** | [designsystem.liveyourdreams.online](https://designsystem.liveyourdreams.online) | ✅ Production | `lyd-design-system` |

---

## 🏗️ **System-Architektur**

```mermaid
graph TD
    A[User Browser] --> B[Vercel CDN]
    B --> C[Backoffice App - Next.js]
    B --> D[Design System - Static]
    C --> E[Neon PostgreSQL]
    C --> F[NextAuth.js]
    F --> E
```

### **Technologie-Stack:**
- **Frontend:** Next.js 14+ (App Router)
- **Deployment:** Vercel (Edge Functions + CDN)
- **Database:** Neon PostgreSQL (Serverless)
- **Authentication:** NextAuth.js
- **Design System:** Static HTML/CSS/JS
- **DNS:** Custom Domains via Vercel

---

## 🚀 **Deployment-Workflow**

### **1. Backoffice Deployment**

```bash
# Im Backoffice-Verzeichnis deployen (KRITISCH!)
cd apps/backoffice

# Production Deployment
vercel --prod

# Erste Konfiguration (einmalig)
vercel link --yes
vercel domains add backoffice.liveyourdreams.online
```

**🔥 WICHTIG:** Deploye **NIE** aus dem Root-Verzeichnis! Nutze immer `apps/backoffice/`.

### **2. Design System Deployment**

```bash
# Design System deployen
cd design-system/v2

# Production Deployment
vercel --prod

# Domain konfigurieren (einmalig)
vercel link --yes
vercel domains add designsystem.liveyourdreams.online
```

---

## ⚙️ **Environment Variables**

### **Backoffice (.env.local):**
```bash
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"

# NextAuth
NEXTAUTH_URL="https://backoffice.liveyourdreams.online"
NEXTAUTH_SECRET="your-nextauth-secret"

# OAuth Providers (falls benötigt)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### **Vercel Dashboard Setup:**
1. Gehe zu Vercel Dashboard → Projekt → Settings → Environment Variables
2. Füge alle Environment Variables hinzu
3. Setze Environment auf "Production" 
4. Trigger Redeploy

---

## 📊 **Domain-Konfiguration**

### **DNS Records (bei Domain Provider):**
```
Type: CNAME
Name: backoffice
Value: cname.vercel-dns.com

Type: CNAME
Name: designsystem
Value: cname.vercel-dns.com
```

### **Vercel Domain Verification:**
```bash
# Domain hinzufügen
vercel domains add backoffice.liveyourdreams.online

# SSL automatisch aktiviert
vercel domains ls
```

---

## 🔧 **Build-Konfiguration**

### **apps/backoffice/vercel.json:**
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["fra1"],
  "functions": {
    "app/**/*": {
      "runtime": "nodejs18.x"
    }
  }
}
```

### **Design System (Statische Seite):**
```json
{
  "buildCommand": "npm run build || echo 'No build needed'",
  "outputDirectory": "./",
  "installCommand": "npm install || echo 'No install needed'",
  "framework": null,
  "regions": ["fra1"]
}
```

---

## 🎯 **Performance-Optimierung**

### **Vercel Features Aktiviert:**
- ✅ **Edge Functions:** Für schnelle API Responses
- ✅ **Image Optimization:** Automatische Bildkomprimierung  
- ✅ **CDN:** Globale Content Delivery
- ✅ **Gzip/Brotli:** Automatische Komprimierung
- ✅ **HTTP/2:** Moderne Protokolle
- ✅ **Edge Caching:** Statische Assets

### **Next.js Optimierungen:**
```javascript
// next.config.mjs
export default {
  experimental: {
    optimizeCss: true,
    optimizeServerReact: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['designsystem.liveyourdreams.online'],
  },
  compress: true,
  poweredByHeader: false,
};
```

---

## 🔍 **Monitoring & Debugging**

### **Vercel Logs:**
```bash
# Aktuelle Deployment Logs
vercel logs https://backoffice.liveyourdreams.online

# Function Logs
vercel logs --follow

# Build Logs
vercel inspect <deployment-url>
```

### **Performance Monitoring:**
- ✅ **Vercel Analytics:** Automatisch aktiviert
- ✅ **Web Vitals:** Core Web Vitals Tracking
- ✅ **Function Duration:** Serverless Function Performance
- ✅ **Error Tracking:** Automatic Error Detection

---

## 🚨 **Troubleshooting**

### **Häufige Probleme:**

**🔴 Build Error - Workspace Dependencies:**
```bash
# Problem: Root deployment schlägt fehl
# Lösung: IMMER aus apps/backoffice/ deployen
cd apps/backoffice
vercel --prod
```

**🔴 Environment Variables nicht verfügbar:**
```bash
# Problem: Database Connection failed
# Lösung: Environment Variables in Vercel Dashboard setzen
vercel env add DATABASE_URL production
```

**🔴 Domain nicht erreichbar:**
```bash
# Problem: DNS Propagation
# Lösung: DNS Records prüfen
dig backoffice.liveyourdreams.online CNAME
```

**🔴 CSS/Assets nicht geladen:**
```bash
# Problem: Falsche Asset-Pfade
# Lösung: Absolut Pfade in Next.js Config
// next.config.mjs
export default {
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://backoffice.liveyourdreams.online' : '',
};
```

---

## 📋 **Deployment Checklist**

### **Pre-Deployment:**
- [ ] Environment Variables konfiguriert
- [ ] Database Schema aktuell (Prisma migrate)
- [ ] CSS/Assets kompiliert
- [ ] Tests durchlaufen
- [ ] Linting ohne Errors

### **Post-Deployment:**
- [ ] URLs erreichbar (200 Status)
- [ ] Database Connection funktioniert
- [ ] Login/Authentication funktioniert
- [ ] Design System Assets laden
- [ ] Performance: Core Web Vitals ✅

### **Monitoring:**
- [ ] Vercel Analytics aktiviert
- [ ] Error Tracking funktioniert
- [ ] Function Logs sichtbar
- [ ] Domain SSL Zertifikat aktiv

---

## 🎉 **Success Criteria**

**✅ DEPLOYMENT ERFOLGREICH wenn:**
- Backoffice unter `backoffice.liveyourdreams.online` erreichbar
- Design System unter `designsystem.liveyourdreams.online` erreichbar  
- Database Verbindung stabil
- Authentication funktioniert
- Core Web Vitals Score > 90
- Alle Assets werden korrekt geladen

---

*Erstellt: September 2025 | Vercel-Native Deployment ohne Docker/AWS*
