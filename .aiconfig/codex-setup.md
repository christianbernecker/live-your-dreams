# Codex CLI Setup

## Installation

**Datum:** 2025-10-02  
**Version:** 0.42.0  
**Methode:** Homebrew

```bash
brew install codex
```

## Status

✅ **Installiert:** codex-cli 0.42.0  
✅ **Login:** Logged in using ChatGPT  
✅ **Ready to use**

## Verfügbare Commands

### Interaktive Session
```bash
codex [PROMPT]
```

### Non-Interactive Execution
```bash
codex exec [PROMPT]
```

### MCP Server (Experimental)
```bash
codex mcp
```

### Apply Latest Diff
```bash
codex apply
```

### Resume Session
```bash
codex resume
codex resume --last
```

## Sandbox-Modi

1. **read-only** - Nur Lesezugriff
2. **workspace-write** - Schreibzugriff im Workspace
3. **danger-full-access** - Voller Zugriff (VORSICHT!)

## Auto-Execution

**Full Auto Mode:**
```bash
codex --full-auto [PROMPT]
```
- Entspricht: `-a on-failure --sandbox workspace-write`
- Low-friction sandboxed execution

**Dangerous Bypass (nur für externe Sandboxes):**
```bash
codex --dangerously-bypass-approvals-and-sandbox
```

## Konfiguration

**Config Location:** `~/.codex/config.toml`

**Override via CLI:**
```bash
codex -c model="o3" [PROMPT]
codex -c 'sandbox_permissions=["disk-full-read-access"]'
```

## Features

- ✅ Web Search (--search flag)
- ✅ Image Attachments (-i flag)
- ✅ Custom Models (-m flag)
- ✅ Working Directory (-C flag)
- ✅ Shell Completions (codex completion)
- ✅ MCP Server Support

## Nutzung im Projekt

Codex kann für folgende Tasks eingesetzt werden:

1. **Code Generation** - Neue Features implementieren
2. **Refactoring** - Code optimieren und umstrukturieren
3. **Debugging** - Fehler analysieren und beheben
4. **Testing** - Tests generieren und ausführen
5. **Documentation** - Code dokumentieren

## Integration mit Claude Code

Beide Tools können parallel genutzt werden:
- **Claude Code** - VSCode Extension für kontinuierliche Entwicklung
- **Codex CLI** - Terminal-basiert für schnelle Tasks

## Status: ✅ BEREIT
