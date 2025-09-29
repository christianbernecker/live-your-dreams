# 🗄️ BACKOFFICE DATABASE SETUP

## 🔴 Problem mit ursprünglichem Setup

### SQLite (Original)
- ✅ **Vorteile:** Einfach, keine externe Dependencies, perfekt für lokale Entwicklung
- ❌ **Problem:** NICHT deploybar auf Vercel/Serverless Plattformen
- ❌ **Problem:** File-basiert, braucht persistenten Storage
- ❌ **Problem:** Keine Multi-User/Multi-Connection Unterstützung

### Warum Migration notwendig war
```
Vercel/Serverless → Stateless Functions → Kein lokaler Storage
                 ↓
         Braucht externe Database
                 ↓
         PostgreSQL (Industry Standard)
```

## ✅ Aktueller Status

### Bereits erledigt
- [x] Schema Migration SQLite → PostgreSQL
- [x] Prisma Schema vollständig angepasst
- [x] Lokale PostgreSQL läuft perfekt
- [x] Build Process mit `prisma generate`
- [x] TypeScript Fehler behoben  
- [x] Vercel Deployment erfolgreich
- [x] Design System voll integriert

### Noch offen
- [ ] Production Database URL
- [ ] Admin User erstellen
- [ ] Media Upload reaktivieren

## 🎯 ROBUSTE PRODUCTION INTEGRATION

### Option A: Neon PostgreSQL (EMPFOHLEN) 🏆
```yaml
Vorteile:
  - 3GB kostenlos
  - Auto-Scaling
  - Serverless-optimiert
  - Branching (Dev/Staging/Prod)
  - 1-Click Vercel Integration
  
URL: https://neon.tech
Zeit: 5 Minuten
```

### Option B: Railway
```yaml
Vorteile:
  - $5 Credit kostenlos
  - Simple UI
  
Nachteile:
  - Nur 500MB
  
URL: https://railway.app
Zeit: 5 Minuten
```

### Option C: Supabase
```yaml
Vorteile:
  - 500MB kostenlos
  - Extra Features (Auth, Storage)
  
Nachteile:
  - Überdimensioniert für simple DB
  
URL: https://supabase.com
Zeit: 10 Minuten
```

## 🚀 QUICK SETUP MIT NEON (5 Minuten)

### 1. Neon Account erstellen
```bash
1. Gehe zu https://neon.tech
2. Sign up mit GitHub
3. Create Database "lyd_production"
```

### 2. Connection String kopieren
```bash
# Format:
postgresql://user:password@host.neon.tech/dbname?sslmode=require

# Im Neon Dashboard: Direct Copy Button
```

### 3. Vercel Environment Variable setzen
```bash
# In deinem Projekt:
cd apps/backoffice
vercel env add DATABASE_URL production

# Paste die Neon URL
# Vercel deployed automatisch neu
```

### 4. Database Schema pushen
```bash
# Mit der Neon URL:
DATABASE_URL="postgresql://..." npx prisma db push

# Erstellt alle Tabellen automatisch
```

### 5. Admin User erstellen
```sql
-- Via Neon SQL Editor oder prisma studio:
INSERT INTO users (
  id, 
  email, 
  password, 
  name, 
  role,
  is_active,
  is_verified
) VALUES (
  'admin_001',
  'admin@liveyourdreams.online',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeVMst.a7WUl31ZLu', -- "changeme"
  'System Admin',
  'admin',
  true,
  true
);
```

### 6. Features reaktivieren
```typescript
// app/api/media/upload/route.ts
// Entferne die TEMPORARILY DISABLED comments
// Aktiviere wieder den originalen Code
```

## 🔐 Login Credentials

### Lokale Entwicklung
```
Email: demo@lyd.com
Password: demo123
```

### Production (nach Setup)
```
Email: admin@liveyourdreams.online
Password: changeme (bitte ändern!)
```

## 🎯 Finale Architektur

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Vercel    │────▶│  Next.js App │────▶│    Neon     │
│   Hosting   │     │   + Prisma   │     │ PostgreSQL  │
└─────────────┘     └──────────────┘     └─────────────┘
       ↑                    │                     │
       │                    ▼                     │
┌─────────────┐     ┌──────────────┐            │
│   Browser   │────▶│ Design System│            │
│    Client   │     │   (Live CSS) │            │
└─────────────┘     └──────────────┘            │
                                                 ▼
                                         ┌──────────────┐
                                         │ Vercel Blob  │
                                         │   Storage    │
                                         └──────────────┘
```

## 📋 Deployment Checklist

- [x] PostgreSQL Schema
- [x] Prisma Client Generation
- [x] Vercel Build Process
- [x] Design System Integration
- [ ] Production Database URL
- [ ] Environment Variables
- [ ] Admin User
- [ ] Media Upload
- [ ] Full Testing

## 🆘 Troubleshooting

### Problem: "Cannot find module @prisma/client"
```bash
# Lösung: In package.json build script:
"build": "prisma generate && next build"
```

### Problem: "PrismaClient is not available in Edge Runtime"
```bash
# Lösung: Verwende Node.js runtime
# next.config.mjs:
experimental: {
  serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs']
}
```

### Problem: "relation does not exist"
```bash
# Lösung: Schema pushen
DATABASE_URL="..." npx prisma db push
```

## 🎉 Fertig!

Nach diesen Schritten hast du:
- ✅ Voll funktionsfähiges Backoffice
- ✅ Production-ready Database
- ✅ Sicheres Authentication System
- ✅ Media Upload Funktionalität
- ✅ Design System Integration

---
*Letztes Update: 25.09.2025*

