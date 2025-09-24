# Vercel Postgres Setup Guide

## Warum Vercel Postgres?

Für das Live Your Dreams Backoffice ist **Vercel Postgres** die beste Wahl (20€/Monat):

### ✅ Vorteile
- **Native Integration**: Nahtlos mit Vercel Functions
- **Edge-optimiert**: Schnelle Queries weltweit
- **Zero-Config**: Läuft sofort ohne komplexe Konfiguration
- **Auto-scaling**: Skaliert automatisch mit Traffic
- **Monitoring**: Integriert im Vercel Dashboard
- **Backups**: Automatisch und zuverlässig
- **Connection Pooling**: Optimierte Datenbankverbindungen

### 📊 Specifications (Pro Plan - 20€/Monat)
- **Storage**: 8GB 
- **Queries**: 1 Million/Monat
- **Connections**: Connection Pooling
- **Backups**: Automatisch täglich
- **Monitoring**: Real-time Dashboard
- **Support**: Priority Support

## Setup Anleitung

### 1. Vercel Postgres erstellen

```bash
cd apps/backoffice
vercel postgres create lyd-production
```

### 2. Environment Variables

Vercel setzt automatisch die korrekten Environment Variables:

```bash
# Lokale .env Datei erstellen
vercel env pull .env.local
```

Die folgenden Variables werden automatisch gesetzt:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL` 
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

### 3. Prisma Konfiguration

Ihre `schema.prisma` bleibt unverändert:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_PRISMA_URL") // Connection Pooling
  directUrl = env("POSTGRES_URL_NON_POOLING") // Migrations
}
```

### 4. Database Migration

```bash
# Schema zu Vercel Postgres pushen
npx prisma db push

# Seed Data laden
npx prisma db seed
```

### 5. Vercel Deployment

```bash
# Production Deployment
vercel --prod
```

## Monitoring & Management

### Vercel Dashboard
1. Gehen Sie zu: https://vercel.com/dashboard
2. Klicken Sie auf Ihr `lyd-backoffice` Projekt
3. Navigation: Storage → lyd-production

### Database Browser
- **Query Editor**: Direkt im Browser SQL ausführen
- **Tables**: Tabellen-Struktur visualisieren  
- **Metrics**: Performance und Query-Statistiken
- **Logs**: Slow Queries und Fehler monitoren

## Lokale Entwicklung

### Database Proxy (Empfohlen)
```bash
# Vercel Postgres lokal nutzen
vercel dev
```

### Alternative: Lokale PostgreSQL
```bash
# Lokale Datenbank für Development
export DATABASE_URL="postgresql://postgres:password@localhost:5432/lyd_dev"
```

## Best Practices

### Connection Management
- Verwenden Sie immer `POSTGRES_PRISMA_URL` (mit Connection Pooling)
- Nutzen Sie `POSTGRES_URL_NON_POOLING` nur für Migrations
- Schließen Sie Connections ordnungsgemäß

### Performance
- Nutzen Sie Prisma's Query Optimization
- Implementieren Sie Caching für häufige Queries
- Überwachen Sie Slow Queries im Dashboard

### Security
- Environment Variables niemals in Code committen
- Nutzen Sie Row Level Security bei sensiblen Daten
- Regelmäßige Backups verifizieren

## Kosten & Skalierung

### Pro Plan (20€/Monat)
- **Ideal für**: Kleine bis mittlere Anwendungen
- **Skalierung**: Bis zu 1M Queries/Monat
- **Storage**: 8GB ausreichend für Start

### Scale Plan (100€/Monat)
- **Upgrade bei**: >1M Queries oder >8GB Storage
- **Features**: Mehr Connections, Analytics, Support

## Troubleshooting

### Connection Errors
```bash
# Prisma Client neu generieren
npx prisma generate

# Environment Variables überprüfen
vercel env ls
```

### Performance Issues
1. Prüfen Sie das Vercel Dashboard für Slow Queries
2. Implementieren Sie Database Indexing
3. Nutzen Sie Prisma's `relationLoadStrategy`

### Migration Probleme
```bash
# Reset Database (Development only!)
npx prisma migrate reset

# Production Migration
npx prisma db push
```

## Migration von anderen Anbietern

### Von Neon/Supabase
1. Export von alter Datenbank: `pg_dump`
2. Import in Vercel Postgres: `psql`
3. Environment Variables aktualisieren
4. Deployment testen

### Von SQLite
```bash
# Prisma Schema anpassen auf PostgreSQL
npx prisma db push
npx prisma db seed
```

## Support

- **Vercel Support**: Bei Problemen mit der Datenbank
- **Prisma Docs**: https://prisma.io/docs
- **Vercel Postgres Docs**: https://vercel.com/docs/storage/vercel-postgres
