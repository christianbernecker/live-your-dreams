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

**Batch A (2024-12-19):** Monorepo-Struktur, Workspaces, CI-Skeleton erstellt ✅
