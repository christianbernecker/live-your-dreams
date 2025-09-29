# 🚀 NextAuth + Neon Database Deployment Guide

## 📋 SCHRITT-FÜR-SCHRITT ANLEITUNG

### 1. NextAuth Konfiguration

#### A) Auth Config erstellen
```typescript
// lib/auth.ts
import { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Deine Auth-Logik hier
      }
    })
  ],
  pages: {
    signIn: "/",
    error: "/auth/error",
  }
}
```

#### B) NextAuth Handler erstellen ⚠️ KRITISCH!
```typescript
// lib/nextauth.ts
import NextAuth from "next-auth"
import { authConfig } from "./auth"

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig)
```

#### C) Route Handler
```typescript
// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/lib/nextauth"

export const { GET, POST } = handlers
```

### 2. Neon Database Setup

#### A) Database URL Format
```env
# ❌ FALSCH
DATABASE_URL="neondb_owner:password@host/db"

# ✅ KORREKT  
DATABASE_URL="postgresql://neondb_owner:password@ep-xxx-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require"
```

#### B) Prisma Schema
```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"  // Nicht "sqlite"!
  url      = env("DATABASE_URL")
}
```

### 3. Vercel Environment Variables

```bash
# Alle auf einmal setzen
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production  
vercel env add NEXTAUTH_URL production
```

**Werte:**
- `DATABASE_URL`: Vollständige Neon URL mit `postgresql://`
- `NEXTAUTH_SECRET`: Starkes Secret (min. 32 Zeichen)
- `NEXTAUTH_URL`: `https://deine-domain.vercel.app`

### 4. Deployment & Test

```bash
# 1. Deploy
vercel --prod

# 2. Test Database
curl https://deine-app.vercel.app/api/test-auth

# 3. Test Login
# Browser → Login Seite → Credentials eingeben
```

## ⚠️ HÄUFIGE FEHLER

### "Configuration Error"
- **Ursache:** `lib/nextauth.ts` fehlt
- **Lösung:** Handler-Datei erstellen

### "Password Authentication Failed"  
- **Ursache:** Falsches DATABASE_URL Format
- **Lösung:** `postgresql://` Protokoll verwenden

### "Database Connection Failed"
- **Ursache:** Neon Database suspended
- **Lösung:** Database in Neon Console aktivieren

## 🔍 DEBUGGING COMMANDS

```bash
# Environment Variables prüfen
vercel env ls

# Database Connection testen
curl https://app.vercel.app/api/test-auth

# Deployment Logs anzeigen  
vercel logs --limit 50
```

## ✅ SUCCESS CHECKLIST

- [ ] `lib/auth.ts` existiert
- [ ] `lib/nextauth.ts` existiert ⚠️ 
- [ ] `app/api/auth/[...nextauth]/route.ts` importiert korrekt
- [ ] DATABASE_URL beginnt mit `postgresql://`
- [ ] Alle Environment Variables gesetzt
- [ ] Neon Database ist aktiv
- [ ] Test API gibt `{status: "ok"}` zurück
- [ ] Login funktioniert im Browser

---

**🎯 RESULTAT:** Funktionierendes NextAuth mit Neon Database auf Vercel!

