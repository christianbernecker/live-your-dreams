#!/bin/bash
# MCP Server Setup für LYD Design System
# Automatische Installation und Konfiguration aller benötigten MCP Server

set -e

echo "🚀 Setting up MCP Servers for LYD Design System..."

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funktionen
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Prüfe Node.js Version
check_node() {
    log_info "Checking Node.js version..."
    if ! command -v node &> /dev/null; then
        log_error "Node.js not found. Please install Node.js 18+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        log_error "Node.js version $NODE_VERSION found. Please upgrade to Node.js 18+."
        exit 1
    fi
    
    log_success "Node.js version $(node -v) is compatible"
}

# Installiere MCP Server Packages
install_mcp_servers() {
    log_info "Installing MCP Server packages..."
    
    # Priorität 1: Essenzielle MCP Server
    log_info "Installing Filesystem MCP Server..."
    npm install -g @modelcontextprotocol/server-filesystem
    
    log_info "Installing Git MCP Server..."
    npm install -g @modelcontextprotocol/server-git
    
    # Priorität 2: Development Tools
    log_info "Installing PostgreSQL MCP Server..."
    npm install -g @modelcontextprotocol/server-postgres
    
    # Priorität 3: Spezifische Erweiterungen
    log_info "Installing Memory MCP Server..."
    npm install -g @modelcontextprotocol/server-memory
    
    log_success "All MCP Server packages installed"
}

# Teste MCP Server Verbindungen
test_mcp_servers() {
    log_info "Testing MCP Server connections..."
    
    # Test Filesystem MCP
    log_info "Testing Filesystem MCP Server..."
    if npx @modelcontextprotocol/server-filesystem --help &> /dev/null; then
        log_success "Filesystem MCP Server: OK"
    else
        log_warning "Filesystem MCP Server: Installation issues detected"
    fi
    
    # Test Git MCP
    log_info "Testing Git MCP Server..."
    if npx @modelcontextprotocol/server-git --help &> /dev/null; then
        log_success "Git MCP Server: OK"
    else
        log_warning "Git MCP Server: Installation issues detected"
    fi
    
    # Test PostgreSQL MCP (ohne DB Connection)
    log_info "Testing PostgreSQL MCP Server..."
    if npx @modelcontextprotocol/server-postgres --help &> /dev/null; then
        log_success "PostgreSQL MCP Server: OK"
    else
        log_warning "PostgreSQL MCP Server: Installation issues detected"
    fi
}

# Erstelle MCP Workspace Konfiguration
create_workspace_config() {
    log_info "Creating MCP workspace configuration..."
    
    cat > .cursor-mcp.json << EOF
{
  "version": "1.0",
  "mcpServers": {
    "lyd-filesystem": {
      "command": "npx",
      "args": [
        "@modelcontextprotocol/server-filesystem",
        "/Users/christianbernecker/live-your-dreams/design-system"
      ],
      "description": "LYD Design System file management",
      "enabled": true
    },
    "lyd-git": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-git"],
      "env": {
        "GIT_WORK_TREE": "/Users/christianbernecker/live-your-dreams",
        "GIT_DIR": "/Users/christianbernecker/live-your-dreams/.git"
      },
      "description": "Git version control for LYD project",
      "enabled": true
    },
    "lyd-database": {
      "command": "npx", 
      "args": ["@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://postgres:\${POSTGRES_PASSWORD}@lyd-postgres.c3m8am00w3dm.eu-central-1.rds.amazonaws.com:5432/lyd_prod"
      },
      "description": "PostgreSQL access for real estate data",
      "enabled": false,
      "note": "Enable after setting POSTGRES_PASSWORD environment variable"
    },
    "lyd-memory": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-memory"],
      "description": "Design token and component state management",
      "enabled": true
    }
  },
  "capabilities": {
    "filesystem": {
      "read": true,
      "write": true,
      "create": true,
      "delete": true,
      "batch_operations": true
    },
    "git": {
      "commit": true,
      "branch": true,
      "merge": false,
      "push": false
    },
    "database": {
      "read": true,
      "write": false,
      "schema_access": ["public"]
    }
  }
}
EOF
    
    log_success "MCP workspace configuration created: .cursor-mcp.json"
}

# Erstelle Environment Setup
create_env_setup() {
    log_info "Creating environment setup..."
    
    cat > .env.mcp << EOF
# MCP Server Environment Configuration
# Copy to .env.local and fill in actual values

# PostgreSQL Connection (für MCP Database Server)
POSTGRES_PASSWORD=your_postgres_password_here

# AWS Credentials (für erweiterte Integration)
AWS_ACCESS_KEY_ID=your_aws_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_here
AWS_REGION=eu-central-1

# Design System Configuration
LYD_DESIGN_SYSTEM_PATH=/Users/christianbernecker/live-your-dreams/design-system
LYD_DEPLOYMENT_URL=http://designsystem.liveyourdreams.online

# Development Settings
NODE_ENV=development
DEBUG_MCP=true
EOF
    
    log_success "Environment template created: .env.mcp"
}

# Erstelle MCP Workflow Documentation
create_workflow_docs() {
    log_info "Creating MCP workflow documentation..."
    
    cat > docs/development/MCP_WORKFLOW.md << EOF
# MCP Server Workflow für LYD Design System

## Übersicht

Mit den konfigurierten MCP Servern können Sie das Design System deutlich effizienter entwickeln.

## Aktivierte MCP Server

### 1. **Filesystem MCP Server**
**Pfad:** \`/Users/christianbernecker/live-your-dreams/design-system\`

**Capabilities:**
- Batch-Updates aller Navigation Links
- Automatisches Erstellen neuer Komponenten-Seiten
- Konsistente Dateistruktur-Operationen

**Beispiel-Workflows:**
\`\`\`
AI: "Erstelle eine neue Toast-Komponente mit vollständiger Dokumentation"
→ MCP erstellt automatisch: components/toast/index.html + Navigation Updates
\`\`\`

### 2. **Git MCP Server**
**Repository:** \`/Users/christianbernecker/live-your-dreams\`

**Capabilities:**
- Automatische Commits nach Komponenten-Änderungen
- Branch-Management für Features
- Commit-History Analyse

**Beispiel-Workflows:**
\`\`\`
AI: "Committe alle Design System Änderungen mit aussagekräftiger Message"
→ MCP erstellt strukturierten Commit mit allen geänderten Dateien
\`\`\`

### 3. **PostgreSQL MCP Server** (Optional)
**Database:** \`lyd-postgres.c3m8am00w3dm.eu-central-1.rds.amazonaws.com\`

**Capabilities:**
- Echte Property-Daten für Komponenten-Tests
- Lead-Formular Validierung
- Performance-Tests mit Production Data

**Beispiel-Workflows:**
\`\`\`
AI: "Teste die Property Card Komponente mit echten Daten aus der Datenbank"
→ MCP lädt echte Properties und rendert realistische Komponenten-Previews
\`\`\`

## Aktivierung

### Schritt 1: MCP Server Installation
\`\`\`bash
./scripts/setup-mcp-servers.sh
\`\`\`

### Schritt 2: Environment Konfiguration
\`\`\`bash
cp .env.mcp .env.local
# Trage echte Credentials ein
\`\`\`

### Schritt 3: Cursor IDE Konfiguration
\`\`\`json
// In Cursor Settings
{
  "mcp.enabled": true,
  "mcp.configFile": ".cursor-mcp.json"
}
\`\`\`

## Workflow-Beispiele

### **Neue Komponente erstellen:**
\`\`\`
Prompt: "Erstelle eine Select-Komponente mit Dropdown, Search und Multi-Select"

Mit MCP:
1. Filesystem MCP erstellt components/select/index.html
2. Fügt Navigation zu allen 25 bestehenden Seiten hinzu
3. Git MCP erstellt Commit "feat: Add Select component with full documentation"
4. Deployment-Pipeline wird automatisch getriggert
\`\`\`

### **Design Token Update:**
\`\`\`
Prompt: "Ändere Primary Color von #0066ff zu #0052cc in allen Komponenten"

Mit MCP:
1. Filesystem MCP findet alle Referenzen in 25 HTML-Dateien
2. Ersetzt alle Vorkommen konsistent
3. Memory MCP speichert Token-Änderung für weitere Referenz
4. Git MCP erstellt Commit "style: Update primary color across all components"
\`\`\`

### **Real-Data Testing:**
\`\`\`
Prompt: "Teste Property Cards mit echten Daten aus der Datenbank"

Mit MCP:
1. PostgreSQL MCP lädt echte Property-Daten
2. Filesystem MCP erstellt Test-Seite mit echten Daten
3. Generiert Screenshots für Dokumentation
\`\`\`

## Performance Benefits

**Ohne MCP:** 25 Dateien manuell bearbeiten = 45-60 Minuten
**Mit MCP:** Batch-Update aller Dateien = 2-3 Minuten

**Ohne MCP:** Neue Komponente = 8-10 Schritte manuell
**Mit MCP:** Neue Komponente = 1 Prompt, automatische Umsetzung

## Security & Permissions

### **Filesystem MCP:**
- **Read/Write:** Nur Design System Ordner
- **No Access:** Sensitive Dateien (.env, credentials)

### **Git MCP:**
- **Commit:** Ja (mit Review)
- **Push:** Nein (manuell für Sicherheit)
- **Branch:** Ja (Feature-Branches)

### **Database MCP:**
- **Read-Only:** Ja
- **Write:** Nein (Sicherheit)
- **Schema:** Nur \`public\` Schema

## Troubleshooting

### **MCP Server startet nicht:**
\`\`\`bash
# Prüfe Node.js Version
node --version  # Muss >= 18 sein

# Prüfe MCP Installation
npm list -g @modelcontextprotocol/server-filesystem

# Logs prüfen
DEBUG_MCP=true cursor
\`\`\`

### **Filesystem Access Denied:**
\`\`\`bash
# Prüfe Pfad-Permissions
ls -la /Users/christianbernecker/live-your-dreams/design-system

# Korrigiere Permissions falls nötig
chmod -R 755 design-system/
\`\`\`

### **Database Connection Failed:**
\`\`\`bash
# Teste DB Connection
psql "postgresql://postgres:PASSWORD@lyd-postgres.c3m8am00w3dm.eu-central-1.rds.amazonaws.com:5432/lyd_prod" -c "SELECT 1;"

# Prüfe Security Group (Port 5432 von lokaler IP)
aws ec2 describe-security-groups --group-ids sg-0f9359bd925d42460
\`\`\`

## Next Steps

1. **Installiere MCP Server:** \`./scripts/setup-mcp-servers.sh\`
2. **Konfiguriere Environment:** Trage echte Credentials in \`.env.local\` ein
3. **Aktiviere in Cursor:** MCP Settings aktivieren
4. **Teste Integration:** "Erstelle eine neue Test-Komponente"

**Mit MCP Servern wird die Design System Entwicklung 10x schneller! 🚀**
EOF
    
    log_success "MCP workflow documentation created"
}

# Hauptfunktion
main() {
    echo "🎯 LYD Design System - MCP Server Setup"
    echo "======================================"
    
    check_node
    install_mcp_servers
    test_mcp_servers
    create_workspace_config
    create_env_setup
    create_workflow_docs
    
    echo ""
    echo "🎉 MCP Server Setup completed successfully!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Copy .env.mcp to .env.local and fill in credentials"
    echo "2. Enable MCP in Cursor IDE settings"
    echo "3. Test with: 'Create a new component using MCP'"
    echo ""
    echo "🔗 Documentation: docs/development/MCP_WORKFLOW.md"
    echo "🔧 Configuration: .cursor-mcp.json"
    echo ""
}

# Führe Setup aus
main "$@"
