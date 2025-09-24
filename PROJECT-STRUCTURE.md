# Live Your Dreams - Projekt Struktur

## 📁 Root-Ebene (Clean & Essential)

```
live-your-dreams/
├── apps/                    # Anwendungen
│   └── backoffice/         # Next.js Backoffice
├── design-system/          # Design System V1 & V2
│   ├── v2/                 # Aktuelle Version (Live)
│   └── ...                 # Legacy & Build
├── deployment/             # Docker & ECS Konfiguration
├── docs/                   # Dokumentation
├── infra/                  # Infrastructure as Code
├── packages/               # Shared Packages
├── scripts/                # Development Scripts
├── tools/                  # Utilities & Tools
├── tests/                  # Test Suites
├── package.json           # Root Dependencies (Playwright)
├── README.md              # Projekt-Übersicht
└── PROJECT-STRUCTURE.md   # Diese Datei
```

## 🎯 Saubere Root-Prinzipien

### ✅ Erlaubt in Root:
- **Konfigurationsdateien:** package.json, README.md, .gitignore
- **Wesentliche Ordner:** apps/, design-system/, deployment/, docs/
- **Infrastruktur:** infra/, packages/

### ❌ Nicht in Root:
- **Temporäre Scripts:** → tools/scripts/
- **Screenshots:** → tools/screenshots/ oder screenshots/archive/
- **Backup-Dateien:** → archive/
- **Test-Outputs:** → tests/ oder tools/testing/
- **Build-Artefakte:** → dist/, build/ (gitignored)

## 📋 Ordner-Zwecke

### `/apps/`
Alle Anwendungen (Next.js, React, etc.)

### `/design-system/`
- **v2/**: Aktuelle Live-Version
- **Legacy**: V1 und Migrations-Code

### `/deployment/`
Docker, ECS, AWS Deployment-Konfiguration

### `/docs/`
Projektdokumentation, Briefings, CI/CD

### `/tools/`
- **screenshots/**: Screenshot-Tools
- **scripts/**: Utility-Scripts
- **analysis/**: Analyse-Tools

### `/tests/`
Test-Suites und Test-Daten

### `/infra/`
Infrastructure as Code (Terraform, Docker Compose)

## 🔄 Wartung

### Automatische Bereinigung:
- **.gitignore**: Verhindert temporäre Dateien in Root
- **ECR Lifecycle Policy**: Automatische Image-Bereinigung
- **Archive-Strategie**: Alte Dateien in `/archive/`

### Manuelle Reviews:
- **Monatlich**: Root-Ebene auf Sauberkeit prüfen
- **Vor Releases**: Struktur-Konsistenz verifizieren
- **Bei Refactoring**: Ordner-Zwecke überprüfen

## 🎯 Ziel
**Saubere, navigierbare Projekt-Struktur mit klaren Verantwortlichkeiten pro Ordner.**
