# MCP Servers für Live Your Dreams

Model Context Protocol (MCP) Server Implementierungen für erweiterte Tool-Integration in Cursor.

## Verfügbare Server

### 1. Prisma MCP Server (`prisma/`)

**Funktionen:**
- Schema Management und Validierung
- Database Migrations (dev, deploy, status)
- Database Push/Pull (Introspection)
- Prisma Client Generation
- Schema Formatierung

**Konfiguration in `.aiconfig/mcp-servers.json`:**
```json
{
  "prisma": {
    "command": "node",
    "args": ["./tooling/mcp/prisma/index.mjs"],
    "env": {
      "DATABASE_URL": "${env.DATABASE_URL}"
    }
  }
}
```

**Environment Variable:**
```bash
# Muss in Shell/System gesetzt sein
export DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
```

**Test:**
```bash
cd tooling/mcp/prisma
DATABASE_URL="..." node test-server.mjs
```

**Verfügbare Tools:**
- `prisma_generate` - Generiert Prisma Client
- `prisma_migrate_dev` - Erstellt und wendet Migration an
- `prisma_migrate_status` - Zeigt Migration Status
- `prisma_db_push` - Pusht Schema ohne Migration
- `prisma_db_pull` - Introspiziert Datenbank
- `prisma_format` - Formatiert Schema
- `prisma_validate` - Validiert Schema

### 2. Neon MCP Server (`neon/`)

**Funktionen:**
- Neon API Integration
- Database Queries über Connection Pooler
- Branch Management
- Performance Monitoring

**Konfiguration:**
```json
{
  "neon": {
    "command": "node",
    "args": ["./tooling/mcp/neon/index.mjs"],
    "env": {
      "NEON_API_KEY": "${env.NEON_API_KEY}",
      "NEON_PROJECT_ID": "${env.NEON_PROJECT_ID}",
      "NEON_DATABASE_NAME": "${env.NEON_DATABASE_NAME}"
    }
  }
}
```

### 3. GitHub MCP Server (`github/`)

**Funktionen:**
- Issues, PRs, Commits Management
- Repository Operations
- Branch und Tag Handling

**Konfiguration:**
```json
{
  "github": {
    "command": "node",
    "args": ["./tooling/mcp/github/index.mjs"],
    "env": {
      "GITHUB_TOKEN": "${env.GITHUB_TOKEN}",
      "GITHUB_REPOSITORY": "christianbernecker/live-your-dreams"
    }
  }
}
```

### 4. Design System Linter (`ds-linter/`)

**Funktionen:**
- Design System Compliance Checks
- Logo und Navigation Konsistenz
- Web Component Validierung

### 5. Documentation Manager (`docs/`)

**Funktionen:**
- Documentation Updates
- Markdown Management
- Changelog Generation

## Setup & Installation

### 1. Dependencies installieren

```bash
cd tooling/mcp
npm install
```

### 2. Environment Variables setzen

**Erstelle `~/.zshrc` oder `~/.bashrc` Einträge:**

```bash
# Neon Database
export DATABASE_URL="postgresql://neondb_owner:PASSWORD@HOST/neondb?sslmode=require"

# Neon API (optional)
export NEON_API_KEY="your_api_key"
export NEON_PROJECT_ID="your_project_id"
export NEON_DATABASE_NAME="neondb"

# GitHub API
export GITHUB_TOKEN="ghp_your_token"
```

**Reload Shell:**
```bash
source ~/.zshrc
```

### 3. Server testen

```bash
# Prisma Server
cd prisma && node test-server.mjs

# Alle Server
npm run test:all
```

### 4. Cursor Neustart

Nach Änderungen an `.aiconfig/mcp-servers.json`:
1. Cursor komplett beenden
2. Cursor neu starten
3. Server werden automatisch geladen

## Troubleshooting

### Server startet nicht

**Problem:** `DATABASE_URL nicht gesetzt`

**Lösung:**
```bash
# Check Environment
echo $DATABASE_URL

# Setzen (temporär für aktuelle Session)
export DATABASE_URL="postgresql://..."

# Permanent in ~/.zshrc
echo 'export DATABASE_URL="..."' >> ~/.zshrc
source ~/.zshrc
```

### Prisma Client fehlt

**Problem:** `@prisma/client not found`

**Lösung:**
```bash
cd apps/backoffice
npx prisma generate
```

### MCP SDK fehlt

**Problem:** `Cannot find @modelcontextprotocol/sdk`

**Lösung:**
```bash
cd tooling/mcp
npm install
```

### Server in Cursor nicht verfügbar

**Problem:** Tools erscheinen nicht in Cursor

**Lösung:**
1. Prüfe `.aiconfig/mcp-servers.json` Syntax
2. Prüfe Environment Variables mit `echo $VAR`
3. Cursor komplett neu starten (nicht nur Reload)
4. Check Console für Fehler: `View > Output > MCP`

## Architektur

```
tooling/mcp/
├── package.json           # Gemeinsame Dependencies
├── README.md             # Diese Datei
├── prisma/
│   ├── index.mjs         # MCP Server Implementierung
│   └── test-server.mjs   # Test Script
├── neon/
│   └── index.mjs
├── github/
│   └── index.mjs
├── ds-linter/
│   └── index.mjs
└── docs/
    └── index.mjs
```

**MCP Server Lifecycle:**

1. Cursor startet → Liest `.aiconfig/mcp-servers.json`
2. Spawned Server Prozesse mit `node` Command
3. Server initialisieren MCP Protocol (stdio Transport)
4. Cursor kommuniziert via JSON-RPC über stdin/stdout
5. Server bleiben während Cursor Session aktiv

## Entwicklung

### Neuen MCP Server erstellen

**Template:**
```javascript
#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const server = new Server(
  {
    name: 'mein-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tools registrieren
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'mein_tool',
        description: 'Tool Beschreibung',
        inputSchema: {
          type: 'object',
          properties: {
            param: { type: 'string' }
          },
          required: ['param']
        },
      }
    ],
  };
});

// Tool Handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  if (name === 'mein_tool') {
    return {
      content: [
        {
          type: 'text',
          text: `Ergebnis: ${args.param}`,
        },
      ],
    };
  }
  
  throw new Error(`Unknown tool: ${name}`);
});

// Server starten
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Server running');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
```

### Best Practices

1. **Fehlerbehandlung:** Immer try/catch in Tool Handlers
2. **Logging:** `console.error()` für Logs (stdout ist für MCP Protocol)
3. **Environment:** Validiere Environment Variables beim Start
4. **Testing:** Schreibe Test-Scripts wie `test-server.mjs`
5. **Dependencies:** Minimale Dependencies für schnelle Startzeiten

## Production Checklist

- [ ] Environment Variables dokumentiert
- [ ] Test Script erstellt und getestet
- [ ] Server in `.aiconfig/mcp-servers.json` eingetragen
- [ ] README aktualisiert
- [ ] Fehlerbehandlung implementiert
- [ ] In Cursor getestet

## Ressourcen

- [MCP Specification](https://spec.modelcontextprotocol.io/)
- [MCP SDK Docs](https://github.com/modelcontextprotocol/sdk)
- [Cursor MCP Integration](https://docs.cursor.com/advanced/mcp)

---

**Status:** Production Ready  
**Maintainer:** Christian Bernecker  
**Last Updated:** Oktober 2025

