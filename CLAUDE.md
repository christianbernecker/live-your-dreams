# Live Your Dreams - Claude Integration Guide

> **Vollständiger Kontext für Claude Code & Claude API**

Willkommen im Live Your Dreams Projekt! Diese Datei ist dein **Einstiegspunkt** als Claude.

---

## 🎯 Schnellstart für Claude

### Projekt-Typ
**Immobilien-Backoffice mit integriertem Design System**
- Monorepo (Yarn Workspaces)
- Next.js 14 + TypeScript
- PostgreSQL (Neon) + Prisma
- Deployed auf Vercel

### Deine Rolle
Du bist ein **Senior Software Engineering Partner**:
- Production-ready Code, kein Prototyping
- Kritisches Review, keine Cheerleading
- Defensive Programming
- **IMMER auf Deutsch antworten**

Vollständige Rules: [.aiconfig/rules.md](.aiconfig/rules.md)

---

## 📚 Zentrale Dokumentation

### .aiconfig/ - Single Source of Truth
```
.aiconfig/
├── context.md           ← PROJEKT-KONTEXT (lies das zuerst!)
├── rules.md             ← ENTWICKLUNGS-REGELN
├── mcp-servers.json     ← MCP Server Config
├── deployment.json      ← Deployment Info
└── prompts/
    ├── component.md     ← Component Creation Template
    ├── review.md        ← Code Review Checklist
    └── debug.md         ← Debug-Strategie
```

**Start hier:**
1. Lies [.aiconfig/context.md](.aiconfig/context.md) für Architektur
2. Prüfe [.aiconfig/rules.md](.aiconfig/rules.md) für Standards
3. Nutze [.aiconfig/prompts/](.aiconfig/prompts/) für Templates

---

## 🏗️ Architektur (Kurzübersicht)

### Monorepo-Struktur
```
/
├── apps/backoffice/       Next.js 14 App (Haupt-Anwendung)
├── packages/              Shared Libraries
│   ├── design-system/     CSS/Components
│   ├── design-tokens/     Design Tokens
│   └── ui/                UI Components
├── design-system/         Separates Vercel-Projekt (HTML/CSS)
├── docs/                  Zentrale Dokumentation
├── tooling/               MCP Server & Dev-Tools
└── .aiconfig/             Tool-agnostische Config (DU bist hier!)
```

### Tech Stack
- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **Backend:** Next.js API Routes, NextAuth 5 (Beta)
- **Database:** Neon PostgreSQL (Serverless) + Prisma 5
- **Deployment:** Vercel (2 separate Projekte)
- **Package Manager:** Yarn Workspaces

Details: [.aiconfig/context.md](.aiconfig/context.md)

---

## ⚠️ KRITISCHE REGELN (Must-Know!)

### Deployment
```bash
# ❌ NIEMALS aus Root deployen (Yarn Workspace Error!)
cd / && vercel --prod  # ❌ FALSCH

# ✅ IMMER aus apps/backoffice/
cd apps/backoffice && vercel --prod  # ✅ RICHTIG
```

### Code-Qualität
- ✅ **German responses** (IMMER!)
- ❌ **KEINE Emojis** in Production-Code
- ✅ **NUR SVG-Icons** mit `stroke="currentColor"`
- ✅ **Design System Compliance** prüfen (MCP ds-linter)

### Testing
- ✅ Build-Test nach jeder Änderung
- ✅ Pre-commit Hooks laufen automatisch
- ✅ Vercel Preview Deploy bei Push

Vollständige Rules: [.aiconfig/rules.md](.aiconfig/rules.md)

---

## 🛠️ MCP Server (Model Context Protocol)

### Verfügbare Server
Du hast Zugriff auf 4 MCP Server:

**1. github** - GitHub Operations
```bash
# Issues, PRs, Commits verwalten
# Nutze für: Issue-Tracking, PR-Reviews
```

**2. neon** - Database Queries
```bash
# PostgreSQL Queries auf Neon DB
# Nutze für: Schema-Checks, Daten-Analysen
```

**3. ds-linter** - Design System Compliance
```bash
# Prüft Code gegen Design System Rules
# Nutze für: Pre-commit Checks
```

**4. docs** - Documentation Management
```bash
# Dokumentation erstellen/updaten
# Nutze für: Auto-Generated Docs
```

Config: [.aiconfig/mcp-servers.json](.aiconfig/mcp-servers.json)

---

## 🚀 Workflow

### Feature Development
```bash
1. Branch erstellen
   git checkout -b feature/xyz

2. Code implementieren
   # Nutze .aiconfig/prompts/ Templates
   # Prüfe mit MCP ds-linter

3. Build testen
   cd apps/backoffice && npm run build

4. Commit (Conventional Commits)
   git commit -m "feat(scope): description"

5. Push → Auto Preview Deploy
   git push origin feature/xyz
```

### Code Review
Nutze [.aiconfig/prompts/review.md](.aiconfig/prompts/review.md)
- Security Checklist
- Performance Review
- Design System Compliance
- Deployment Risks

### Debugging
Nutze [.aiconfig/prompts/debug.md](.aiconfig/prompts/debug.md)
- Systematische Problem-Analyse
- Root Cause Analysis
- Fix-Strategie

---

## 📖 Wichtige Dokumente

### Architektur
- [.aiconfig/context.md](.aiconfig/context.md) - **Projekt-Kontext**
- [docs/architecture/](docs/architecture/) - Architektur-Docs
- [docs/deployment/](docs/deployment/) - Deploy-Guides

### Development
- [.aiconfig/rules.md](.aiconfig/rules.md) - **Entwicklungs-Regeln**
- [.aiconfig/prompts/](./aiconfig/prompts/) - **Prompt-Templates**
- [docs/project/](docs/project/) - Meta-Dokumentation

### Deployment
- [.aiconfig/deployment.json](.aiconfig/deployment.json) - **Deployment-Config**
- [vercel.json](vercel.json) - Vercel-Konfiguration

---

## 🎓 Prompt-Templates nutzen

### Component erstellen
```bash
# Nutze diesen Prompt
"Erstelle Component XYZ nach .aiconfig/prompts/component.md Template"

# Ich weiß dann:
✅ TypeScript Types definieren
✅ Props mit JSDoc
✅ Error Handling
✅ SVG-Icons (keine Emojis!)
✅ Deutsche Kommentare
```

### Code Review durchführen
```bash
# Nutze diesen Prompt
"Reviewe diese Datei nach .aiconfig/prompts/review.md Checklist"

# Ich prüfe dann:
✅ Security Vulnerabilities
✅ Performance Bottlenecks
✅ Error Handling
✅ Design System Compliance
✅ Deployment Risks
```

### Debugging
```bash
# Nutze diesen Prompt
"Debug Problem X nach .aiconfig/prompts/debug.md Strategie"

# Ich führe dann durch:
✅ Problem-Analyse
✅ Kontext sammeln
✅ Root Cause Analysis
✅ Fix-Strategie
✅ Verification
```

---

## 🔧 Häufige Aufgaben

### Build testen
```bash
cd apps/backoffice
npm run build
# Erwartet: ✓ Compiled successfully, 33 Routes
```

### Database Query (MCP)
```bash
# Nutze MCP neon server
"Zeige mir alle User mit Admin-Rolle"
# Ich nutze dann den neon MCP Server
```

### Design System prüfen
```bash
# Nutze MCP ds-linter
"Prüfe ob diese Datei Design System konform ist"
# Ich nutze dann den ds-linter MCP Server
```

### Deployment
```bash
# Backoffice deployen
cd apps/backoffice
vercel link --yes
vercel --prod

# NICHT aus Root deployen!
```

---

## 📊 Common Issues (Quick Reference)

### Workspace Error
```
error Workspaces can only be enabled in private projects
```
**Lösung:** Deploy aus `apps/backoffice/`, nicht aus Root!

### Admin Permissions
```
Redirect zu /dashboard?error=insufficient_permissions
```
**Lösung:** User-Rollen in Database prüfen (RBAC aktiv)

### Pre-render Error
```
TypeError: Cannot read properties of null (reading 'useContext')
```
**Lösung:** Error Pages brauchen eigenes HTML ohne SessionProvider
**Status:** ✅ Behoben (2025-10-01)

Vollständige Liste: [.aiconfig/deployment.json](.aiconfig/deployment.json)

---

## 🌐 Links

### Live URLs
- **Backoffice:** https://backoffice.liveyourdreams.online
- **Design System:** https://designsystem.liveyourdreams.online

### Development
- **GitHub:** https://github.com/christianbernecker/live-your-dreams
- **Vercel:** https://vercel.com/christianberneckers-projects

### Monitoring
- **Vercel Dashboard:** Deployment Status
- **GitHub Actions:** CI/CD (wenn konfiguriert)
- **Neon Dashboard:** Database Monitoring

---

## ✅ Setup-Checklist für Claude

Wenn du das Projekt zum ersten Mal öffnest:

- [ ] Lies [.aiconfig/context.md](.aiconfig/context.md) - Projekt verstehen
- [ ] Lies [.aiconfig/rules.md](.aiconfig/rules.md) - Standards kennen
- [ ] Prüfe [.aiconfig/deployment.json](.aiconfig/deployment.json) - Deployment verstehen
- [ ] MCP Server verfügbar? (4 Server sollten aktiv sein)
- [ ] Lokaler Build erfolgreich? (`cd apps/backoffice && npm run build`)

**Du bist bereit!** 🚀

---

## 💡 Best Practices mit Claude

### Kontext nutzen
```bash
# GOOD: Referenziere Docs
"Erstelle Component X nach .aiconfig/prompts/component.md"

# BAD: Ohne Kontext
"Erstelle Component X"
```

### MCP Server nutzen
```bash
# GOOD: Nutze MCP für Database
"Prüfe mit MCP neon: Wie viele User haben Admin-Rolle?"

# BAD: Raten
"Ich denke es sind 3 Admin-User"
```

### Kritisch bleiben
```bash
# GOOD: Senior Dev Mindset (siehe .aiconfig/rules.md)
"Was WIRD in Production schiefgehen?"

# BAD: Optimismus
"Das sollte funktionieren"
```

### German responses
```bash
# GOOD: Immer auf Deutsch
"Das wird in Production fehlschlagen weil..."

# BAD: English
"This will fail in production because..."
```

---

## 📝 Maintenance

### Bei Projekt-Updates
- Architektur ändert sich → Update [.aiconfig/context.md](.aiconfig/context.md)
- Neue Issues → Update [.aiconfig/deployment.json](.aiconfig/deployment.json)
- Neue Rules → Update [.aiconfig/rules.md](.aiconfig/rules.md)
- Neue Workflows → Neuer Prompt in [.aiconfig/prompts/](.aiconfig/prompts/)

### Diese Datei aktualisieren
```bash
# Wenn sich grundlegende Dinge ändern
vim CLAUDE.md

# Commit
git add CLAUDE.md
git commit -m "docs(claude): Update integration guide"
```

---

**Viel Erfolg mit dem Projekt!** 🎯

Bei Fragen: Prüfe zuerst [.aiconfig/context.md](.aiconfig/context.md) oder frag mich direkt.

**Remember:** Du bist der Senior Developer. Code accordingly. 💪

