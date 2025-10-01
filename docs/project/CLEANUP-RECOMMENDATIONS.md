# 🧹 CLEANUP EMPFEHLUNGEN

## ❌ SICHER LÖSCHBAR (Veraltete/Doppelte Dateien)

### 1. Backup-Dateien (22 Dateien)
```bash
# Alle .backup-* Dateien von 22.09.2025
rm design-system/v2/components/*/*.backup-20250922-*
rm design-system/templates/*.backup-fix
rm design-system/*.backup-fix
rm tooling/deployment/*.backup
```
**Grund:** Aktueller Code ist funktional, Backups nicht mehr benötigt

### 2. Veraltete Fix-Scripts (12 Dateien)
```bash
# Select-Component Fix Scripts (ersetzt durch finale Version)
rm scripts/fix-select-*.py
rm scripts/fix-all-component-*.py

# Rebuild Scripts (Komponenten sind fertig)
rm scripts/rebuild-*.py
```
**Grund:** Komponenten sind fertig entwickelt, Fix-Scripts obsolet

### 3. Veraltete Strategy-Dokumente (15 Dateien)
```bash
# Alte Strategie-Dokumente (ersetzt durch finale Implementierung)
rm design-system/v2/STRATEGY-*.md
rm design-system/v2/PROBLEM-ANALYSE-*.md
rm design-system/v2/ROBUST-*.md
rm design-system/v2/HOLISTIC-*.md
rm design-system/v2/TEMPLATE-BASIS-*.md
```
**Grund:** Strategien sind implementiert, Dokumente veraltet

### 4. Veraltete Build-Artefakte
```bash
# Design System V1 Build-Outputs (ersetzt durch V2)
rm -rf design-system/dist/
rm -rf design-system/node_modules/
```
**Grund:** V2 ist live, V1 Build-Outputs nicht mehr benötigt

## ⚠️ PRÜFEN ERFORDERLICH

### 1. Legacy Scripts (Eventuell noch nützlich)
- `scripts/design-system-builder.py` - Möglicherweise für zukünftige Komponenten
- `scripts/heroui-inspired-builder.py` - Template-Generator
- `scripts/generate-components.py` - Komponenten-Generator

### 2. Test-Daten
- `tests/ds/` (59 Dateien) - Prüfen ob Tests noch laufen
- `tooling/testing/` - Aktuelle Test-Tools?

### 3. Archive-Ordner
- `archive/design-system-v1/` - Historischer Wert vs. Speicherplatz
- `archive/packages_backup_*` - Backup-Relevanz prüfen

## ✅ BEHALTEN (Essentiell)

### Root-Struktur:
- `apps/` - Aktive Anwendungen
- `design-system/v2/` - Live Design System
- `deployment/` - AWS Deployment
- `docs/` - Projektdokumentation
- `infra/` - Infrastructure Code
- `packages/` - Shared Libraries
- `tools/` - Organisierte Utilities

### Konfiguration:
- `package.json` - Playwright Dependencies
- `README.md` - Projekt-Übersicht
- `.gitignore` - Git-Konfiguration

## 💾 GESCHÄTZTE SPEICHER-ERSPARNIS

### Sicher löschbar:
- **Backup-Dateien:** ~50MB
- **Fix-Scripts:** ~5MB  
- **Strategy-Docs:** ~2MB
- **Build-Artefakte:** ~200MB

### **Gesamt:** ~250MB lokaler Speicher

## 🎯 EMPFOHLENES VORGEHEN

1. **Backup-Dateien löschen** (sicher)
2. **Fix-Scripts löschen** (Komponenten sind fertig)
3. **Strategy-Docs archivieren** (in docs/archive/)
4. **Build-Artefakte löschen** (V1 nicht mehr benötigt)
5. **Tests/Legacy prüfen** (Fall-für-Fall Entscheidung)

**Soll ich mit der sicheren Löschung beginnen?**
