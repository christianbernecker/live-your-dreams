# Live Your Dreams - Cursor Integration Guide

> **Vollständiger Kontext für Cursor IDE**

Willkommen im Live Your Dreams Projekt! Diese Datei ist dein **Einstiegspunkt** für Cursor.

---

## 🎯 Schnellstart für Cursor

### Projekt-Typ
**Immobilien-Backoffice mit integriertem Design System**
- Monorepo (Yarn Workspaces)
- Next.js 14 + TypeScript
- PostgreSQL (Neon) + Prisma
- Deployed auf Vercel

### Deine Rolle (AI)
Du bist ein **Senior Software Engineering Partner**:
- Production-ready Code, kein Prototyping
- Kritisches Review, keine Cheerleading
- Defensive Programming
- **IMMER auf Deutsch antworten**

Vollständige Rules: [.aiconfig/rules.md](.aiconfig/rules.md) (via `.cursorrules` Symlink)

---

## 📚 Zentrale Dokumentation

### .aiconfig/ - Single Source of Truth
```
.aiconfig/
├── context.md           ← PROJEKT-KONTEXT (lies das zuerst!)
├── rules.md             ← ENTWICKLUNGS-REGELN (= .cursorrules)
├── mcp-servers.json     ← MCP Server Config (= .cursor-mcp.json)
├── deployment.json      ← Deployment Info
└── prompts/
    ├── component.md     ← Component Creation Template
    ├── review.md        ← Code Review Checklist
    └── debug.md         ← Debug-Strategie
```

**Cursor nutzt:**
- `.cursorrules` → `.aiconfig/rules.md` (Symlink)
- `.cursor-mcp.json` → `.aiconfig/mcp-servers.json` (Symlink)

**Start hier:**
1. Lies [.aiconfig/context.md](.aiconfig/context.md) für Architektur
2. Prüfe [.aiconfig/rules.md](.aiconfig/rules.md) für Standards (automatisch geladen)
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
└── .aiconfig/             Tool-agnostische Config
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

Vollständige Rules: [.aiconfig/rules.md](.aiconfig/rules.md) (automatisch als `.cursorrules` geladen)

---

## ⌨️ CURSOR FEATURES

### 1. Composer (Cmd+I oder Cmd+Shift+I)
**Wann nutzen:**
- Multi-file Edits
- Größere Refactorings
- Neue Features implementieren

**Best Practice:**
```
"Erstelle neue Component XYZ nach .aiconfig/prompts/component.md Template"
```

### 2. Chat (Cmd+L)
**Wann nutzen:**
- Fragen stellen
- Code erklären lassen
- Quick fixes
- Debugging

**Best Practice:**
```
"Erkläre mir diese Funktion"
"Was macht dieser Code?"
"Warum schlägt dieser Test fehl?"
```

### 3. Inline Edit (Cmd+K)
**Wann nutzen:**
- Schnelle Änderungen
- Single-line Edits
- Refactoring einzelner Funktionen

**Best Practice:**
```
# Markiere Code, drücke Cmd+K
"Füge Error Handling hinzu"
"Refactor zu Arrow Function"
"Füge TypeScript Types hinzu"
```

### 4. Tab Autocomplete
**Automatisch aktiv:**
- Intelligente Code-Vervollständigung
- Nutzt Projekt-Kontext
- Lernt von deinem Coding-Style

### 5. AI Review
**Nutzen:**
```bash
# Rechtsklick auf Datei → "AI Review"
# Oder nutze Chat:
"Reviewe diese Datei nach .aiconfig/prompts/review.md"
```

---

## 🛠️ MCP SERVER (Model Context Protocol)

### Verfügbare Server
4 MCP Server sind konfiguriert (via `.cursor-mcp.json`):

**1. github** - GitHub Operations
```bash
# Nutze in Chat/Composer:
"Erstelle GitHub Issue für Bug XYZ"
"Zeige letzte 5 Commits"
```

**2. neon** - Database Queries
```bash
# Nutze für Database-Operationen:
"Zeige alle User mit Admin-Rolle"
"Prüfe Prisma Schema gegen DB"
```

**3. ds-linter** - Design System Compliance
```bash
# Automatisch in Pre-commit Hook
# Oder manuell:
"Prüfe diese Datei gegen Design System Rules"
```

**4. docs** - Documentation Management
```bash
# Nutze für Docs:
"Update README mit neuen Features"
"Generiere API Docs für diese Route"
```

Config: `.cursor-mcp.json` → [.aiconfig/mcp-servers.json](.aiconfig/mcp-servers.json)

### MCP Server aktivieren
```bash
# Cursor Einstellungen → Features → Model Context Protocol
# Sollte automatisch aktiv sein
```

---

## 🚀 WORKFLOW IN CURSOR

### Feature Development (mit Composer)
```bash
1. Branch erstellen
   Cmd+` (Terminal) → git checkout -b feature/xyz

2. Composer öffnen (Cmd+I)
   "Erstelle Component XYZ nach .aiconfig/prompts/component.md"
   
3. AI generiert Multi-file Changes
   Review → Accept/Modify
   
4. Build testen
   Terminal → cd apps/backoffice && npm run build
   
5. Commit
   Cmd+` → git add . && git commit -m "feat: XYZ"
   
6. Push
   git push origin feature/xyz
```

### Quick Fix (mit Inline Edit)
```bash
1. Markiere fehlerhafte Zeile(n)
2. Cmd+K
3. "Füge Error Handling hinzu"
4. Accept
```

### Code Review (mit Chat)
```bash
1. Öffne Datei
2. Cmd+L (Chat)
3. "Reviewe diese Datei nach .aiconfig/prompts/review.md"
4. AI prüft:
   - Security
   - Performance
   - Error Handling
   - Design System Compliance
```

### Debugging (mit Chat + Codebase)
```bash
1. Cmd+L (Chat)
2. @ (Codebase Search aktivieren)
3. "Debug: Warum schlägt User-Login fehl?"
4. AI nutzt:
   - Relevante Files
   - .aiconfig/context.md
   - .aiconfig/prompts/debug.md
```

---

## 🎨 CURSOR-SPEZIFISCHE SHORTCUTS

### Navigation
- `Cmd+P` - Quick Open File
- `Cmd+Shift+P` - Command Palette
- `Cmd+\` - Split Editor
- `Cmd+1/2/3` - Focus Editor Group

### AI Features
- `Cmd+L` - Chat öffnen
- `Cmd+I` - Composer öffnen (Normal)
- `Cmd+Shift+I` - Composer öffnen (Agent Mode)
- `Cmd+K` - Inline Edit
- `Tab` - AI Autocomplete akzeptieren

### Code
- `Cmd+/` - Toggle Comment
- `Cmd+D` - Select Next Occurrence
- `Alt+Click` - Multiple Cursors
- `Cmd+Shift+L` - Select All Occurrences

### Terminal
- `Cmd+`` - Toggle Terminal
- `Cmd+Shift+`` - New Terminal

---

## 📖 CURSOR SETTINGS

### .cursor/ Ordner-Struktur
```
.cursor/
├── mcp-settings.json    ← Legacy MCP Config (nicht mehr genutzt)
├── mcp.json             ← MCP Projects Config
└── rules/               ← Custom Rules (optional)
```

**Note:** Haupt-Config ist jetzt in `.aiconfig/` (via Symlinks)

### Rules laden
Cursor lädt automatisch:
1. `.cursorrules` (Symlink zu `.aiconfig/rules.md`)
2. Projekt-Kontext aus Codebase
3. MCP Server aus `.cursor-mcp.json`

### Custom Settings
```json
// .cursor/settings.json (optional)
{
  "cursor.chat.model": "claude-3.5-sonnet",
  "cursor.composer.model": "claude-3.5-sonnet",
  "cursor.tab.useSpaces": true,
  "cursor.tab.size": 2
}
```

---

## 🎓 PROMPT-TEMPLATES NUTZEN

### In Composer (Cmd+I)
```bash
# Component erstellen
"Erstelle Button Component nach .aiconfig/prompts/component.md Template"

# Ich weiß dann:
✅ TypeScript Types definieren
✅ Props mit JSDoc
✅ Error Handling
✅ SVG-Icons (keine Emojis!)
✅ Deutsche Kommentare
✅ Build testen
```

### In Chat (Cmd+L)
```bash
# Code Review
"Reviewe diese Datei nach .aiconfig/prompts/review.md Checklist"

# Debugging
"Debug nach .aiconfig/prompts/debug.md Strategie"
```

### Mit @ Mentions
```bash
# Codebase Context
"@Codebase Wie funktioniert User-Authentication?"

# Docs Context
"@docs/architecture Erkläre Deployment-Struktur"

# Web Search
"@Web Wie nutze ich Prisma Transactions?"
```

---

## 🔧 HÄUFIGE AUFGABEN IN CURSOR

### 1. Neue Component erstellen
```bash
# Composer (Cmd+I)
"Erstelle UserCard Component in apps/backoffice/components/
Nach .aiconfig/prompts/component.md Template
Mit Props: user (User Type), onClick Handler"

# AI erstellt:
✅ Component File
✅ TypeScript Types
✅ Export in index.ts
✅ Basis-Styling
```

### 2. Build testen
```bash
# Terminal (Cmd+`)
cd apps/backoffice && npm run build

# Bei Errors:
# Chat (Cmd+L)
"Analysiere Build-Errors und schlage Fixes vor"
```

### 3. Code Review vor Commit
```bash
# Chat (Cmd+L) mit geöffneter Datei
"Reviewe nach .aiconfig/prompts/review.md"

# AI prüft:
✅ Security
✅ Performance
✅ Error Handling
✅ Design System
✅ TypeScript Types
```

### 4. Refactoring
```bash
# Markiere Funktion
# Cmd+K
"Refactor zu async/await mit Error Handling"

# Oder Composer (Cmd+I) für Multi-file
"Refactor User-Authentication zu separatem Service
Betrifft: /app/api/auth/, /lib/auth.ts"
```

### 5. Debugging mit MCP
```bash
# Chat (Cmd+L)
"Nutze MCP neon: Zeige alle User ohne Rollen"

# AI nutzt neon MCP Server
# Führt Query aus
# Zeigt Ergebnisse
```

---

## 📊 COMMON ISSUES (QUICK REFERENCE)

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
```bash
# Chat mit MCP neon
"Zeige Rollen für User mit Email xyz@example.com"
```

### Pre-render Error
```
TypeError: Cannot read properties of null (reading 'useContext')
```
**Status:** ✅ Behoben (2025-10-01)
**Lösung:** Custom Error Pages ohne SessionProvider

Vollständige Liste: [.aiconfig/deployment.json](.aiconfig/deployment.json)

---

## 🌐 LINKS

### Live URLs
- **Backoffice:** https://backoffice.liveyourdreams.online
- **Design System:** https://designsystem.liveyourdreams.online

### Development
- **GitHub:** https://github.com/christianbernecker/live-your-dreams
- **Vercel:** https://vercel.com/christianberneckers-projects

### Monitoring
- **Vercel Dashboard:** Deployment Status
- **Neon Dashboard:** Database Monitoring

---

## ✅ SETUP-CHECKLIST FÜR CURSOR

Wenn du das Projekt zum ersten Mal öffnest:

- [ ] `.cursorrules` wird automatisch geladen
- [ ] MCP Server sind aktiv (4 Server sollten verfügbar sein)
- [ ] Lies [.aiconfig/context.md](.aiconfig/context.md) via Chat
- [ ] Prüfe [.aiconfig/deployment.json](.aiconfig/deployment.json) für Common Issues
- [ ] Test: Öffne Chat (Cmd+L) → "Erkläre Projekt-Architektur"
- [ ] Test: Lokaler Build (`cd apps/backoffice && npm run build`)

**Du bist bereit!** 🚀

---

## 💡 BEST PRACTICES MIT CURSOR

### 1. Composer vs. Chat wählen
```bash
# Composer (Cmd+I) für:
✅ Multi-file Changes
✅ Neue Features
✅ Große Refactorings
✅ Component Creation

# Chat (Cmd+L) für:
✅ Fragen
✅ Code Review
✅ Debugging
✅ Erklärungen
```

### 2. @ Mentions nutzen
```bash
# Mehr Kontext = Bessere Antworten
"@.aiconfig/context.md Erkläre Deployment-Struktur"
"@apps/backoffice/app/api Wie funktioniert User-API?"
```

### 3. Incremental Development
```bash
# Klein anfangen, iterieren
"Erstelle Basis-Component"
→ Review → Accept

"Füge Error Handling hinzu"
→ Review → Accept

"Füge Loading State hinzu"
→ Review → Accept
```

### 4. MCP Server proaktiv nutzen
```bash
# Database Queries vor Code-Änderungen
"MCP neon: Zeige aktuelles User Schema"

# GitHub Context
"MCP github: Zeige related Issues zu Authentication"
```

### 5. German Responses durchsetzen
```bash
# Falls AI auf Englisch antwortet:
"WICHTIG: Antworte auf Deutsch (siehe .cursorrules)"

# Sollte automatisch funktionieren via .cursorrules
```

---

## 🔍 TROUBLESHOOTING

### AI antwortet auf Englisch
**Problem:** `.cursorrules` nicht geladen?
**Lösung:**
```bash
# Prüfe Symlink
ls -la .cursorrules
# Sollte: .cursorrules -> .aiconfig/rules.md

# Cursor neu laden
Cmd+Shift+P → "Developer: Reload Window"
```

### MCP Server nicht verfügbar
**Problem:** MCP Config nicht geladen?
**Lösung:**
```bash
# Prüfe Symlink
ls -la .cursor-mcp.json
# Sollte: .cursor-mcp.json -> .aiconfig/mcp-servers.json

# Prüfe MCP Pfade
cat .aiconfig/mcp-servers.json
# Alle Pfade sollten auf tooling/mcp/* zeigen

# Cursor Settings → Features → Model Context Protocol
# Ensure enabled
```

### Codebase Search funktioniert nicht
**Problem:** Projekt-Index nicht aktuell?
**Lösung:**
```bash
Cmd+Shift+P → "Cursor: Reindex"
```

### Tab Autocomplete zu aggressiv
**Problem:** Ständige Suggestions?
**Lösung:**
```bash
# Settings
Cmd+, → "cursor.tab"
# Adjust "cursor.tab.acceptSuggestionOnEnter"
```

---

## 📝 MAINTENANCE

### Bei Projekt-Updates
- Architektur ändert sich → Update [.aiconfig/context.md](.aiconfig/context.md)
- Neue Rules → Update [.aiconfig/rules.md](.aiconfig/rules.md)
- MCP Server ändern → Update [.aiconfig/mcp-servers.json](.aiconfig/mcp-servers.json)
- Neue Workflows → Neuer Prompt in [.aiconfig/prompts/](.aiconfig/prompts/)

### Diese Datei aktualisieren
```bash
# Wenn sich Cursor-Features ändern
vim CURSOR.md

# Commit
git add CURSOR.md
git commit -m "docs(cursor): Update integration guide"
```

---

## 🎯 ADVANCED FEATURES

### Agent Mode (Cmd+Shift+I)
**Experimentell:** AI führt Tasks autonom aus
```bash
"Implementiere User-Export Feature:
- API Route erstellen
- Frontend Button hinzufügen
- CSV Export
- Tests"

# AI arbeitet selbstständig ab
```

### Apply from Chat
```bash
# In Chat (Cmd+L)
"Hier ist der Code für XYZ: ..."

# "Apply" Button nutzen
# Code wird automatisch eingefügt
```

### Terminal Integration
```bash
# Terminal Commands aus Chat
"Führe Build-Test aus"

# AI schlägt vor:
cd apps/backoffice && npm run build

# "Run" Button → Command ausführen
```

---

**Viel Erfolg mit Cursor!** 🎯

Bei Fragen: Nutze Chat (Cmd+L) mit `@.aiconfig/context.md` für Kontext.

**Remember:** Du bist der Senior Developer. Code accordingly. 💪



