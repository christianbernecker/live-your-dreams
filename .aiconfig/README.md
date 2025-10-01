# .aiconfig - Zentrale AI-Tool Konfiguration

## Übersicht
Dieser Ordner enthält die **zentrale, tool-agnostische Konfiguration** für AI-gestützte Entwicklung.

Beide Tools (Cursor & Claude Code) nutzen dieselben Konfigurationsdateien.

## Struktur

```
.aiconfig/
├── README.md              # Diese Datei
├── rules.md               # Entwicklungs-Regeln (Senior Dev Persona)
├── context.md             # Projekt-Kontext & Architektur
├── mcp-servers.json       # MCP Server Konfiguration
├── deployment.json        # Deployment-Informationen
└── prompts/               # Wiederverwendbare Prompts
    ├── component.md       # Component Creation
    ├── review.md          # Code Review Checklist
    └── debug.md           # Debug-Strategie
```

## Verwendung

### In Cursor
Symlink: `.cursorrules` → `.aiconfig/rules.md`
Symlink: `.cursor-mcp.json` → `.aiconfig/mcp-servers.json`

### In Claude Code
Symlink: `.clauderules` → `.aiconfig/rules.md`
Symlink: `.claude-mcp.json` → `.aiconfig/mcp-servers.json`

## Vorteile

### Single Source of Truth
- ✅ Eine Änderung → beide Tools profitieren
- ✅ Keine Duplikation
- ✅ Keine Inkonsistenzen

### Versionskontrolle
- ✅ Git-tracked (History nachvollziehbar)
- ✅ Merge-fähig (Team-Arbeit)
- ✅ Rollback möglich

### Tool-Agnostisch
- ✅ Markdown = universell lesbar
- ✅ Keine Vendor Lock-in
- ✅ Einfach neue Tools hinzufügen

## Dateien

### rules.md
**Senior Software Engineering Partner Persona**
- Code Review Mindset
- Production-ready Standards
- Security & Performance Checklist
- German Language Responses

### context.md
**Projekt-Kontext für AI-Tools**
- Architektur-Übersicht
- Tech Stack
- Deployment-Struktur
- Common Issues & Solutions
- Kritische Regeln

### mcp-servers.json
**Model Context Protocol Server**
- GitHub Integration
- Neon Database Queries
- Design System Linter
- Documentation Management

Pfade sind auf `tooling/mcp/*` angepasst (nach Phase 2 Cleanup).

### deployment.json
**Deployment-Konfigurationen**
- Backoffice Vercel Setup
- Design System Vercel Setup
- Common Issues & Solutions
- Environment Variables

### prompts/
**Wiederverwendbare Prompt-Templates**
- `component.md`: React Component erstellen
- `review.md`: Code Review durchführen
- `debug.md`: Systematisches Debugging

## Änderungen vornehmen

### Regel-Update
```bash
# Editiere zentrale Datei
vim .aiconfig/rules.md

# Änderung wird automatisch in beiden Tools aktiv
# (via Symlinks)
```

### MCP Server hinzufügen
```json
// .aiconfig/mcp-servers.json
{
  "mcpServers": {
    "new-server": {
      "command": "node",
      "args": ["./tooling/mcp/new-server/index.mjs"],
      "description": "..."
    }
  }
}
```

### Neuen Prompt hinzufügen
```bash
# Erstelle neue Prompt-Datei
cat > .aiconfig/prompts/api-route.md << 'EOF'
# API Route Creation Prompt
...
EOF
```

## Best Practices

### Dokumentation aktualisieren
Wenn sich Architektur ändert:
1. `context.md` updaten
2. `deployment.json` bei Deploy-Änderungen updaten
3. Commit mit aussagekräftiger Message

### MCP Pfade
- ✅ Verwende relative Pfade (`./tooling/mcp/...`)
- ✅ Nutze `${env.VAR}` für Secrets
- ❌ Keine absolute Pfade
- ❌ Keine hardcoded Secrets

### Prompts erweitern
- Klare Struktur (Ziel → Checklist → Template → Post-Actions)
- Praktische Beispiele
- Deutsche Texte wo User-facing
- Code-Examples in Englisch

## Troubleshooting

### Symlinks kaputt?
```bash
# Neu erstellen (siehe unten)
rm .cursorrules .clauderules
ln -s .aiconfig/rules.md .cursorrules
ln -s .aiconfig/rules.md .clauderules
```

### MCP Server startet nicht?
```bash
# Pfad prüfen
ls -la tooling/mcp/github/index.mjs

# Permissions prüfen
chmod +x tooling/mcp/*/index.mjs
```

### Änderungen werden nicht erkannt?
```bash
# Tools neustarten
# Cursor: Reload Window (Cmd+R)
# Claude Code: Restart
```

## Maintenance

### Regelmäßig prüfen
- [ ] MCP-Pfade korrekt nach Refactorings
- [ ] Deployment-URLs aktuell
- [ ] Context-Docs aktuell (nach großen Changes)
- [ ] Prompts noch relevant

### Bei Projekt-Updates
- Architektur-Änderungen → `context.md`
- Neue Common Issues → `deployment.json`
- Neue Best Practices → `rules.md`
- Neue Workflows → `prompts/`

## Links
- **GitHub:** https://github.com/christianbernecker/live-your-dreams
- **Cursor Docs:** https://cursor.sh/docs
- **Claude Code:** https://claude.ai/code
- **MCP Spec:** https://modelcontextprotocol.io

