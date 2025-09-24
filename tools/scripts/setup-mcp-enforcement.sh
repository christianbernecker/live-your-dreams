#!/bin/bash

# MCP Server Enforcement Setup
# Stellt sicher, dass MCP Server Regeln immer beachtet werden

echo "🔧 MCP Server Enforcement Setup"
echo "================================"

# 1. MCP Server Installation prüfen
echo "1. MCP Server Dependencies..."
if ! command -v npx &> /dev/null; then
    echo "❌ npx nicht gefunden - Node.js installieren"
    exit 1
fi

if ! npx @modelcontextprotocol/server-filesystem --help &> /dev/null; then
    echo "📦 MCP Filesystem Server installieren..."
    npm install -g @modelcontextprotocol/server-filesystem
else
    echo "✅ MCP Filesystem Server verfügbar"
fi

# 2. Git Hooks für MCP Compliance einrichten
echo "2. Git Hooks für MCP Compliance..."
mkdir -p .git/hooks

# Pre-commit Hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# Pre-commit Hook: MCP Compliance Check

echo "🔍 MCP Compliance Check..."

# Design System Compliance
if git diff --cached --name-only | grep -q "apps/"; then
    echo "📱 Apps-Änderungen erkannt - Design System Compliance prüfen..."
    
    # Prüfe CSS Custom Properties
    if git diff --cached | grep -q "color:" && ! git diff --cached | grep -q "var(--lyd-"; then
        echo "❌ Hardcoded colors gefunden - verwende CSS Custom Properties (--lyd-*)"
        echo "Beispiel: color: var(--lyd-primary) statt color: #000066"
        exit 1
    fi
    
    # Prüfe master.css Integration
    if git diff --cached --name-only | grep -q "\.css$" && ! git diff --cached | grep -q "master\.css"; then
        echo "⚠️  CSS-Änderungen ohne master.css Referenz - Design System Integration prüfen"
    fi
fi

# TypeScript Compliance für Apps
if git diff --cached --name-only | grep -q "apps/.*\.(ts|tsx)$"; then
    echo "📝 TypeScript-Dateien erkannt - Compliance prüfen..."
    
    # JSDoc Check (vereinfacht)
    if git diff --cached | grep -q "function\|const.*=" && ! git diff --cached | grep -q "\/\*\*"; then
        echo "⚠️  Neue Funktionen ohne JSDoc-Kommentare erkannt"
        echo "Empfehlung: JSDoc für alle öffentlichen Funktionen hinzufügen"
    fi
fi

echo "✅ MCP Compliance Check abgeschlossen"
EOF

chmod +x .git/hooks/pre-commit

# 3. VS Code/Cursor Settings für MCP
echo "3. Editor-Integration..."
mkdir -p .vscode
cat > .vscode/settings.json << 'EOF'
{
  "mcp.servers": [
    {
      "name": "filesystem-design",
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "./design-system"],
      "description": "Design System development"
    },
    {
      "name": "filesystem-apps", 
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "./apps"],
      "description": "Apps development"
    }
  ],
  "files.watcherExclude": {
    "**/node_modules/**": true,
    "**/screenshots/**": true,
    "**/archive/**": true
  },
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "typescript.preferences.includePackageJsonAutoImports": "on"
}
EOF

# 4. README für MCP Usage erstellen
echo "4. MCP Usage Documentation..."
cat > MCP-USAGE.md << 'EOF'
# MCP Server Usage Guide

## 🚀 Verfügbare MCP Server

### 1. filesystem-design
**Pfad:** `/design-system/`
**Zweck:** Design System Komponenten-Entwicklung
**Verwendung:**
- Neue Komponenten erstellen
- Navigation updates
- CSS Token-Updates

### 2. filesystem-apps  
**Pfad:** `/apps/`
**Zweck:** Backoffice und App-Entwicklung
**Verwendung:**
- Neue Features entwickeln
- Design System integrieren
- TypeScript-Entwicklung

### 3. filesystem-root
**Pfad:** `/` (komplettes Projekt)
**Zweck:** Deployment und Infrastructure
**Verwendung:**
- Deployment-Konfiguration
- Dokumentation updates
- Cross-App Änderungen

## 📋 Enforcement-Regeln

### Design System Compliance:
- ✅ Verwende `master.css` in allen Apps
- ✅ Nutze CSS Custom Properties (`--lyd-*`)
- ✅ Folge LYD Typography-Standards
- ✅ Verwende LYD Spacing-Scale

### Code Quality:
- ✅ TypeScript strict mode
- ✅ JSDoc für alle Funktionen
- ✅ Error Boundaries für Komponenten
- ✅ Proper error handling

### Deployment:
- ✅ Conventional commits
- ✅ Lokale Tests vor Deploy
- ✅ Live-URL Verifikation
- ✅ Rollback-Fähigkeit

## 🎯 Workflow-Beispiele

### Neue Backoffice-Feature:
```bash
# MCP Alias verwenden
@backoffice-feature "User Management Dashboard"
```

### Design System Update:
```bash
# Design System ändern
@update-colors "Update primary color"
# In alle Apps integrieren  
@integrate-design-system
```

### Neue App erstellen:
```bash
@new-app "Property Management App"
```
EOF

echo "✅ MCP Server Enforcement Setup abgeschlossen!"
echo ""
echo "📋 Nächste Schritte:"
echo "1. Cursor/VS Code neu starten"
echo "2. MCP Server in Editor aktivieren"  
echo "3. Aliases verwenden (@backoffice-feature, @new-app, etc.)"
echo "4. Git Hooks testen mit einem Commit"
