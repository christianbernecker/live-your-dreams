# Live Your Dreams - Projekt-Kontext

## Projekt-Übersicht
**Live Your Dreams** ist ein Immobilien-Backoffice-System mit integriertem Design System.

## Architektur

### Monorepo-Struktur
```
/
├── apps/
│   └── backoffice/          Next.js 14 App Router, TypeScript
├── packages/
│   ├── design-system/       CSS/Components (npm package)
│   ├── design-tokens/       Design Tokens
│   └── ui/                  Shared UI Components
├── design-system/           Separates Vercel-Projekt (HTML/CSS)
├── docs/                    Zentrale Dokumentation
├── tooling/                 Entwickler-Tools & MCP Server
└── scripts/                 Build/Deploy Automation
```

### Tech Stack
- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **Backend:** Next.js API Routes, NextAuth 5
- **Database:** Neon PostgreSQL (Serverless)
- **ORM:** Prisma 5
- **Deployment:** Vercel (2 separate Projekte)
- **Package Manager:** Yarn Workspaces

## Deployment-Architektur

### Backoffice (Haupt-Anwendung)
- **Working Directory:** `apps/backoffice/`
- **Vercel Project:** `christianberneckers-projects/backoffice`
- **Domain:** https://backoffice.liveyourdreams.online
- **Deploy Command:** `cd apps/backoffice && vercel --prod`
- **KRITISCH:** NIEMALS aus Root deployen (Yarn Workspace Error)

### Design System (Separate Demo-Site)
- **Working Directory:** `design-system/v2/`
- **Vercel Project:** `christianberneckers-projects/lyd-design-system`
- **Domain:** https://designsystem.liveyourdreams.online
- **Separates Deployment:** Unabhängig vom Backoffice

## Database Schema

### Core Models (Prisma)
- **User:** PascalCase Model, snake_case DB (mit @map)
- **Role:** RBAC System mit Permissions
- **BlogPost:** Content Management
- **AuditEvent:** Audit-Logging aller Aktionen

### Naming Convention
```typescript
// Prisma Model (TypeScript)
model User {
  firstName  String  @map("first_name")
  isActive   Boolean @map("is_active")
  
  @@map("users")  // DB-Tabelle in snake_case
}
```

## Kritische Regeln

### Deployment
- ❌ **NIEMALS** `vercel --prod` aus Root (Workspace-Error)
- ✅ **IMMER** aus `apps/backoffice/` deployen
- ✅ **IMMER** `vercel link` vor erstem Deploy

### Code-Qualität
- ✅ **IMMER** German responses
- ❌ **NIEMALS** Emojis in Production-Code
- ✅ **NUR** SVG-Icons mit `stroke="currentColor"`
- ✅ Design System Compliance prüfen (MCP ds-linter)

### Testing
- ✅ Build-Test nach jeder Struktur-Änderung
- ✅ Pre-commit Hooks laufen automatisch
- ✅ MCP Compliance Check bei Git-Operationen

## MCP Server (Model Context Protocol)

### Verfügbare Server
- **github:** GitHub API (Issues, PRs, Commits)
- **neon:** Neon Database Queries
- **ds-linter:** Design System Compliance Check
- **docs:** Documentation Management

### Usage
MCP Server sind in beiden Tools (Cursor + Claude Code) verfügbar.
Konfiguration: `.aiconfig/mcp-servers.json`

## Common Issues

### Workspace Error
```
error Workspaces can only be enabled in private projects
```
**Lösung:** Deploy aus `apps/backoffice/`, nicht aus Root

### Admin Permissions
```
Redirect zu /dashboard?error=insufficient_permissions
```
**Lösung:** User-Rollen in Database prüfen (RBAC-System aktiv)

### Pre-render Error
```
TypeError: Cannot read properties of null (reading 'useContext')
```
**Lösung:** Error Pages benötigen eigenes HTML ohne SessionProvider

## Workflow

### Feature Development
1. Branch erstellen: `git checkout -b feature/xyz`
2. Code implementieren (mit MCP-Unterstützung)
3. Build testen: `cd apps/backoffice && npm run build`
4. Commit: Conventional Commits Format
5. Push + Vercel Preview Deploy (automatisch)

### Production Deploy
1. Merge zu `main`
2. Automatischer Vercel Deploy
3. Live-URL verifizieren
4. Monitoring prüfen

## Dokumentation

### Wichtige Docs
- `docs/architecture/` - System-Architektur
- `docs/deployment/` - Deploy-Anleitungen
- `docs/project/` - Meta-Dokumentation
- `docs/content/` - Blog-Content

### Letzte Änderungen
- 2025-10-01: Pre-render Error behoben (Custom Error Pages)
- 2025-10-01: Projekt-Cleanup Phase 1+2 (Root aufgeräumt, Tools konsolidiert)
- 2025-10-01: Rollback snake_case Migration (zurück zu PascalCase mit @map)

## Kontakt & Links
- **GitHub:** https://github.com/christianbernecker/live-your-dreams
- **Vercel Dashboard:** https://vercel.com/christianberneckers-projects
- **Live Backoffice:** https://backoffice.liveyourdreams.online
- **Live Design System:** https://designsystem.liveyourdreams.online

