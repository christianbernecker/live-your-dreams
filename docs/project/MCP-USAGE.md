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
