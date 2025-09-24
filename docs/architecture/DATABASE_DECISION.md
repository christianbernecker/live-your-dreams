# Datenbank-Architekturentscheidung

## Entscheidung: Vercel Postgres

**Datum**: 24. September 2025  
**Budget**: ≤20€/Monat  
**Status**: Beschlossen

---

## Gewählte Lösung

**Vercel Postgres (20€/Monat)**

### Spezifikationen
- **Storage**: 8GB
- **Queries**: 1 Million/Monat
- **Connections**: Connection Pooling automatisch
- **Backups**: Täglich automatisch
- **Monitoring**: Integriert in Vercel Dashboard

### Technische Details
- **PostgreSQL**: Version 15+
- **Connection Pooling**: PgBouncer integriert
- **Locations**: Global Edge Network
- **SSL**: Automatisch aktiviert
- **Prisma Integration**: Native Unterstützung

---

## Entscheidungskriterien

### 1. Integration (Gewicht: 40%)
**Vercel Postgres**: ⭐⭐⭐⭐⭐
- Zero-Configuration mit Vercel Platform
- Automatische Environment Variables
- Native Next.js Support
- Edge-optimierte Verbindungen

### 2. Performance (Gewicht: 25%)
**Vercel Postgres**: ⭐⭐⭐⭐⭐
- Connection Pooling automatisch
- Edge-Lokationen weltweit
- Optimiert für Serverless Functions
- Sub-100ms Latenz

### 3. Kosten (Gewicht: 20%)
**Vercel Postgres**: ⭐⭐⭐⭐
- 20€/Monat (im Budget)
- Keine versteckten Kosten
- Inkludierte Features (Backup, Monitoring)

### 4. Wartung (Gewicht: 15%)
**Vercel Postgres**: ⭐⭐⭐⭐⭐
- Zero-Maintenance
- Automatische Updates
- Integriertes Monitoring
- Support enthalten

---

## Alternativen Bewertung

### Neon PostgreSQL (19€/Monat)
✅ **Vorteile:**
- 1€ günstiger
- 10GB Storage (mehr als Vercel)
- Database Branching (Git für Datenbanken)
- EU-Standort (DSGVO-konform)

❌ **Nachteile:**
- Zusätzliche Konfiguration nötig
- Weniger nahtlose Vercel-Integration
- Separates Dashboard/Monitoring

### Supabase (25€/Monat)
✅ **Vorteile:**
- Komplettes Backend-as-a-Service
- Authentication inklusive
- Realtime Features
- File Storage inklusive

❌ **Nachteile:**
- 25% über Budget (25€ vs 20€)
- Komplexer als nötig für aktuelle Anforderungen
- Potenzielle Vendor-Lock-in Risiken

---

## Technische Umsetzung

### Setup Commands
```bash
# Vercel Postgres erstellen
vercel postgres create lyd-production

# Environment Variables automatisch setzen
vercel env pull .env.local

# Prisma Schema deployen
npx prisma db push

# Seed Data laden
npx prisma db seed
```

### Environment Variables (automatisch gesetzt)
```env
POSTGRES_URL=postgresql://user:pass@host:5432/db
POSTGRES_PRISMA_URL=postgresql://user:pass@host:5432/db?pgbouncer=true&connect_timeout=15
POSTGRES_URL_NON_POOLING=postgresql://user:pass@host:5432/db
```

### Prisma Configuration
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("POSTGRES_PRISMA_URL") // Connection pooling
  directUrl = env("POSTGRES_URL_NON_POOLING") // Migrations
}
```

---

## Migration Strategy

### Von aktueller SQLite (Development)
1. Prisma Schema auf PostgreSQL umstellen
2. `prisma db push` für Schema-Erstellung
3. `prisma db seed` für Demo-Daten
4. Vercel Deployment mit automatischen Environment Variables

### Rollback Plan
- SQLite bleibt für lokale Entwicklung verfügbar
- Vercel Postgres kann jederzeit pausiert/gelöscht werden
- Migration zu anderem PostgreSQL-Anbieter jederzeit möglich

---

## Monitoring & Maintenance

### Metriken
- **Query Performance**: Via Vercel Dashboard
- **Connection Count**: Automatisches Pooling
- **Storage Usage**: Alerts bei >80% Auslastung
- **Error Rate**: Integration mit Vercel Analytics

### Backup Strategy
- **Automatische Backups**: Täglich durch Vercel
- **Point-in-Time Recovery**: Bis zu 7 Tage
- **Manual Backups**: Bei Major-Releases via `pg_dump`

---

## Kosten-Benefit-Analyse

### Kosten (monatlich)
- **Vercel Postgres**: 20€
- **Vercel Pro Plan**: Bereits vorhanden
- **Gesamt Datenbank-Kosten**: 20€

### Eingesparte Kosten vs. AWS
- **AWS RDS**: 30-50€/Monat
- **AWS VPC**: 10€/Monat
- **Management-Overhead**: 10h/Monat
- **Ersparnis**: 20-40€/Monat + Zeit

### ROI
- **Setup-Zeit**: 5 Minuten (vs. Stunden bei AWS)
- **Maintenance**: 0 Stunden/Monat
- **Performance**: Besser durch Edge-Integration
- **Skalierung**: Automatisch ohne Konfiguration

---

## Risiko-Assessment

### Niedrige Risiken ✅
- **Vendor Lock-in**: PostgreSQL-Standard, einfache Migration
- **Performance**: Edge-optimiert, bewährte Technologie
- **Kosten**: Transparente Preisstruktur, im Budget

### Mitlierungsmaßnahmen
- **Regelmäßige Backups**: Außerhalb Vercel (monatlich)
- **Schema Documentation**: In Git versioniert
- **Migration Scripts**: Bereit für Anbieter-Wechsel

---

## Nächste Schritte

### Sofort (bei Bedarf)
1. ✅ Entscheidung dokumentiert
2. ⏳ Vercel Postgres Setup (bei erster DB-Anforderung)
3. ⏳ Prisma Migration von SQLite
4. ⏳ Production Deployment

### Monitoring (nach Setup)
- Query Performance überwachen
- Storage Usage tracked
- Kosten monatlich reviewen
- Performance vs. Budget bewerten

---

**Entscheidung final bestätigt für Live Your Dreams Backoffice**
**Nächster Review**: Bei Bedarf oder Q1 2026
