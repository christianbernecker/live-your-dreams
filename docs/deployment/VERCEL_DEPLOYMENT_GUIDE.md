# Vercel Deployment Guide

## Übersicht

Live Your Dreams nutzt Vercel als Deployment-Platform für beide Hauptapplikationen:
- **Design System**: Static Site mit Edge Functions
- **Backoffice**: Next.js mit Serverless Functions

## Voraussetzungen

- Vercel Account (Pro Plan empfohlen)
- GitHub Repository Zugriff
- Domain-Management (DNS)

## Design System Deployment

### 1. Projekt Setup
```bash
cd design-system/v2
vercel --prod
```

### 2. Konfiguration
Das Design System verwendet eine `vercel.json` Konfiguration:

```json
{
  "name": "lyd-design-system",
  "buildCommand": "",
  "outputDirectory": ".",
  "framework": null,
  "cleanUrls": true,
  "trailingSlash": false
}
```

### 3. Basic Auth
Basic Authentication wird über Edge Functions implementiert:
- Benutzername: `admin`  
- Passwort: `lyd-design-2024`

## Backoffice Deployment

### 1. Projekt Setup
```bash
cd apps/backoffice
vercel --prod
```

### 2. Konfiguration
Das Backoffice nutzt Next.js mit `vercel.json`:

```json
{
  "name": "lyd-backoffice",
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next"
}
```

### 3. Environment Variables
Über Vercel Dashboard konfigurieren:

#### Production
- `NODE_ENV`: `production`
- `DATABASE_URL`: Vercel Postgres Connection String
- `NEXTAUTH_SECRET`: Strong random secret
- `NEXTAUTH_URL`: `https://backoffice.liveyourdreams.online`

## Domain Configuration

### Automatisch (Empfohlen)
1. Vercel Dashboard öffnen
2. Projekt auswählen
3. Settings → Domains → Add Domain
4. DNS-Einstellungen befolgen

### Manuell
CNAME Records erstellen:
- `designsystem.liveyourdreams.online` → `cname-china.vercel-dns.com`
- `backoffice.liveyourdreams.online` → `cname-china.vercel-dns.com`

## Datenbank Setup (Vercel Postgres)

### 1. Datenbank erstellen
```bash
vercel postgres create lyd-production
```

### 2. Environment Variables setzen
```bash
vercel env pull .env.local
```

### 3. Prisma Migration
```bash
npx prisma db push
npx prisma db seed
```

## Monitoring & Debugging

### Logs
```bash
vercel logs backoffice
vercel logs design-system
```

### Analytics
- Vercel Analytics automatisch aktiviert
- Speed Insights verfügbar
- Real User Monitoring (RUM)

## Kosten & Skalierung

### Pro Plan Features
- Unlimited Deployments
- Custom Domains
- Environment Variables
- Team Collaboration
- Premium Support

### Geschätzte Kosten
- Vercel Pro: $20/Monat
- Vercel Postgres: $20/Monat (bei >0.5GB)
- **Total**: ~$40/Monat

**Ersparnis gegenüber AWS**: ~$40/Monat (50% günstiger)

## Best Practices

### Performance
- Images über `next/image` optimieren
- API Routes caching nutzen
- Edge Runtime wo möglich

### Security
- Environment Variables niemals committen
- HTTPS automatisch aktiviert
- XSS Protection aktiviert

### Development
- Preview Deployments für Feature Branches
- Production Deployment nur über `main` Branch
- Instant Rollback verfügbar
