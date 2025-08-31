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

**Batch A-I (2024-12-19):** Life Your Dreams Design System Monorepo vollständig implementiert ✅

- **Batch A:** Monorepo-Struktur, pnpm Workspaces, CI/CD-Pipelines
- **Batch B:** Design Tokens mit Style-Dictionary (LYD Brand Colors) 
- **Batch C:** CSS Primitives und Reset-Styles
- **Batch D:** React Components mit Provider und Button
- **Batch E:** Storybook mit LYD Branding und Stories
- **Batch F:** Next.js Backoffice mit Security Middleware
- **Batch G:** API-Endpoints (Health, Rate-Limiting, Error-Handling)
- **Batch H:** Docker-Compose Dev-Stack (Postgres, Redis, MinIO, MailHog)
- **Batch I:** Branding-Guards und Release-Pipeline

### Akzeptanzkriterien erfüllt ✅

- ✅ Monorepo baut lokal (`pnpm -r build`)
- ✅ Storybook baut ohne Warnungen  
- ✅ `pnpm check:brand` findet 0 Treffer (kein Fremd-Branding)
- ✅ Backoffice App startet mit LdsProvider
- ✅ Security-Header aktiv (CSP, X-Frame-Options, etc.)
- ✅ API-Endpoints vorhanden (/health, Rate-Limiting)
- ✅ CI-Workflows implementiert (Build/Test/Brand-Check)
- ✅ Design Tokens in Tailwind/Backoffice angewandt
