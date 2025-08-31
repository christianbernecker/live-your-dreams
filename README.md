# Live Your Dreams - Immobilienvermarktung

Monorepo für die Live Your Dreams Plattform mit Design System und Backoffice.

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

Design System Dokumentation ist intern unter `designsystem.liveyourdreams.online` verfügbar (Basic Auth).

---

## Entwicklungshistorie

**Phase 1 (2024-12-19):** Live Your Dreams Design System vollständig implementiert ✅

### Design System (Phase 1 - Abgeschlossen)
- **Tokens:** Extended Design Tokens (Focus, Z-Index, Typography, Spacing, Motion)
- **Components:** Button, Input, Select, Dialog, Card, Table, Badge mit A11y
- **Stories:** Storybook mit LYD Branding, Form-Patterns, Component-Dokumentation
- **Tests:** Jest Setup mit Testing Library (A11y Tests folgen)
- **Infrastructure:** Monorepo, CI/CD, Branding-Guards, Security Middleware

### Backoffice (Phase 2 - Kritische Fixes ✅)
- **Framework:** Next.js 14 App Router mit echten LDS CSS-Modulen (nicht Tailwind)
- **Authentication:** NextAuth.js vollständig implementiert mit Login-Page und bcrypt
- **Database:** Prisma Schema mit Seed-Daten (Demo: admin@liveyourdreams.online / admin123)
- **API:** Properties CRUD, Leads, Upload Presign, Auth-Endpoints
- **UI:** Dashboard, Properties Table, Leads Management mit nativen LDS Components
- **Security:** CSP, Rate-Limiting, Session-Management, DSGVO-Compliance
- **Dev-Stack:** Docker-Compose mit DB-Init und Environment-Setup

### Brand-Korrektur v15.15 ✅

**KRITISCHE ÄNDERUNG:** Grammatik-Korrektur 'Life' → 'Live Your Dreams'
- ✅ **Globale Umbenennung:** Alle Dateien, Packages, Dokumentation aktualisiert
- ✅ **Domain-Migration:** liveyourdreams.online als neue Hauptdomain
- ✅ **Package-Namen:** @liveyourdreams Scope in allen Packages
- ✅ **Logo-Korrektur:** LIVE YOUR DREAMS in allen SVG-Dateien
- ✅ **Demo-Zugang:** admin@liveyourdreams.online / admin123

### Akzeptanzkriterien erfüllt ✅

- ✅ Monorepo baut lokal (`pnpm build`)
- ✅ Storybook baut ohne Warnungen  
- ✅ `pnpm check:brand` findet 0 Treffer (kein Fremd-Branding)
- ✅ Backoffice App startet mit LDS CSS-Modulen (kein Tailwind in Components)
- ✅ Security-Header aktiv (CSP, X-Frame-Options, etc.)
- ✅ API-Endpoints vorhanden (/health, Rate-Limiting)
- ✅ CI-Workflows implementiert (Build/Test/Brand-Check)
- ✅ Design Tokens vollständig (Text, Border, Breakpoints)
