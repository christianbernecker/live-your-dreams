# Life Your Dreams - Immobilienvermarktung

Monorepo für die Life Your Dreams Plattform mit Design System und Backoffice.

## Setup

```bash
# Node.js 20+ und pnpm installieren
nvm use 20
npm install -g pnpm

# Repository klonen und Dependencies installieren
pnpm bootstrap

# Entwicklungsumgebung starten
docker compose -f infra/docker/compose.dev.yml up -d
cp .env.example .env
pnpm dev
```

## Architektur

- **Design Tokens** (`packages/design-tokens`) - Style Dictionary basierte Token
- **Design System** (`packages/design-system`) - CSS Primitives und Web Components
- **React Components** (`packages/design-system-react`) - React Wrapper für LDS
- **Backoffice** (`apps/backoffice`) - Next.js Admin Interface
- **Design System Docs** (`apps/designsystem-docs`) - Storybook Dokumentation

## Entwicklung

```bash
# Alle Pakete bauen
pnpm build

# Tests ausführen
pnpm test

# Linting
pnpm lint

# Branding prüfen
pnpm check:brand
```

## Deployment

Design System Dokumentation ist intern unter `designsystem.lifeyourdreams.de` verfügbar (Basic Auth).

---

## Entwicklungshistorie

**Phase 1 (2024-12-19):** Life Your Dreams Design System vollständig implementiert ✅

### Design System (Phase 1 - Abgeschlossen)
- **Tokens:** Extended Design Tokens (Focus, Z-Index, Typography, Spacing, Motion)
- **Components:** Button, Input, Select, Dialog, Card, Table, Badge mit A11y
- **Stories:** Storybook mit LYD Branding, Form-Patterns, Component-Dokumentation
- **Tests:** Jest Setup mit Testing Library (A11y Tests folgen)
- **Infrastructure:** Monorepo, CI/CD, Branding-Guards, Security Middleware

### Backoffice (Phase 2 - MVP Abgeschlossen ✅)
- **Framework:** Next.js 14 App Router mit vollständiger LDS Integration
- **Database:** Prisma Schema (Property, Room, Lead, Media, User Models)
- **API:** Properties CRUD, Leads, Upload Presign, Health-Endpoint
- **UI:** Dashboard, Properties Table, Leads Management mit LDS Components
- **Security:** CSP, Rate-Limiting, Error-Handling, DSGVO-Grundlagen
- **Dev-Stack:** Docker-Compose (Postgres, Redis, MinIO, MailHog)

### Akzeptanzkriterien erfüllt ✅

- ✅ Monorepo baut lokal (`pnpm -r build`)
- ✅ Storybook baut ohne Warnungen  
- ✅ `pnpm check:brand` findet 0 Treffer (kein Fremd-Branding)
- ✅ Backoffice App startet mit LdsProvider
- ✅ Security-Header aktiv (CSP, X-Frame-Options, etc.)
- ✅ API-Endpoints vorhanden (/health, Rate-Limiting)
- ✅ CI-Workflows implementiert (Build/Test/Brand-Check)
- ✅ Design Tokens in Tailwind/Backoffice angewandt
