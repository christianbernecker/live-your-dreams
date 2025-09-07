# 🎯 LYD Design System - Component Development Guide

## 📋 Inhaltsverzeichnis
1. [Kritische Checkliste](#kritische-checkliste)
2. [Komponenten-Struktur](#komponenten-struktur)
3. [Logo-Integration](#logo-integration)
4. [Navigation-Standards](#navigation-standards)
5. [Premium Component Standards](#premium-component-standards)
6. [Deployment-Prozess](#deployment-prozess)
7. [Qualitätssicherung](#qualitätssicherung)

---

## ✅ Kritische Checkliste

**JEDE Komponente MUSS diese Anforderungen erfüllen:**

### 1. Navigation & Struktur
- [ ] **Identische Sidebar auf ALLEN Seiten**
- [ ] **Alle Navigation-Links funktionieren**
- [ ] **Aktiver Zustand korrekt gesetzt**
- [ ] **Mobile-responsive Navigation**

### 2. Logo-Verwendung
- [ ] **IMMER das offizielle Logo verwenden: `/docs/CI/exports/Live_Your_Dreams_Perfect.svg`**
- [ ] **Logo-Größe: 48px x 38px in der Sidebar**
- [ ] **Logo verlinkt zur Hauptseite**

### 3. Seitenstruktur
- [ ] **Einheitlicher Aufbau: Header → Sidebar → Main Content**
- [ ] **Konsistente Spacing: 48px Sections, 24px Subsections**
- [ ] **Scrollbare Sektionen ohne Tabs**

### 4. Premium-Qualität
- [ ] **Micro-Animationen auf ALLEN interaktiven Elementen**
- [ ] **Glassmorphism und Gradient-Effekte**
- [ ] **Mindestens Porsche/HeroUI Qualitätsniveau**
- [ ] **Barrierefreiheit: WCAG 2.1 AA**

---

## 🏗️ Komponenten-Struktur

### Standard HTML-Template

```html
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Component Name] - LYD Design System</title>
    
    <!-- Global Styles -->
    <style>
        /* Reset & Base */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
            display: flex;
        }
        
        /* Sidebar Navigation */
        .sidebar {
            width: 260px;
            background: white;
            border-right: 1px solid #e5e7eb;
            height: 100vh;
            position: fixed;
            overflow-y: auto;
            z-index: 100;
        }
        
        .sidebar-header {
            padding: 24px;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .sidebar-logo {
            width: 48px;
            height: 38px;
        }
        
        /* Main Content */
        .main-content {
            flex: 1;
            margin-left: 260px;
            padding: 48px;
            max-width: 1400px;
        }
        
        /* Component Specific Styles */
        {{COMPONENT_STYLES}}
    </style>
</head>
<body>
    <!-- Sidebar Navigation -->
    <nav class="sidebar">
        <div class="sidebar-header">
            <img src="/docs/CI/exports/Live_Your_Dreams_Perfect.svg" 
                 alt="LYD Logo" 
                 class="sidebar-logo">
        </div>
        
        <!-- Navigation Sections -->
        <div class="nav-section">
            <div class="nav-section-title">Designing</div>
            <a href="/designing/principles/" class="nav-item">Design Principles</a>
            <a href="/designing/colors/" class="nav-item">Colors & Themes</a>
            <a href="/designing/typography/" class="nav-item">Typography</a>
            <a href="/designing/spacing/" class="nav-item">Spacing System</a>
        </div>
        
        <div class="nav-section">
            <div class="nav-section-title">Developing</div>
            <a href="/developing/setup/" class="nav-item">Setup Guide</a>
            <a href="/developing/architecture/" class="nav-item">Architecture</a>
            <a href="/developing/api/" class="nav-item">API Reference</a>
            <a href="/developing/testing/" class="nav-item">Testing</a>
        </div>
        
        <div class="nav-section">
            <div class="nav-section-title">Components</div>
            <a href="/components/buttons/" class="nav-item">Buttons</a>
            <a href="/components/cards/" class="nav-item">Cards</a>
            <a href="/components/modal/" class="nav-item">Modal</a>
            <a href="/components/select/" class="nav-item">Select</a>
            <a href="/components/inputs/" class="nav-item">Inputs</a>
            <a href="/components/table/" class="nav-item">Table</a>
            <a href="/components/accordion/" class="nav-item">Accordion</a>
            <a href="/components/tabs/" class="nav-item">Tabs</a>
            <a href="/components/toast/" class="nav-item">Toast</a>
            <a href="/components/dropdown/" class="nav-item">Dropdown</a>
        </div>
        
        <div class="nav-section">
            <div class="nav-section-title">Styles</div>
            <a href="/styles/animations/" class="nav-item">Animations</a>
            <a href="/styles/effects/" class="nav-item">Effects</a>
            <a href="/styles/gradients/" class="nav-item">Gradients</a>
        </div>
        
        <div class="nav-section">
            <div class="nav-section-title">Patterns</div>
            <a href="/patterns/property-cards/" class="nav-item">Property Cards</a>
            <a href="/patterns/dashboards/" class="nav-item">Dashboards</a>
            <a href="/patterns/forms/" class="nav-item">Forms</a>
        </div>
    </nav>
    
    <!-- Main Content -->
    <main class="main-content">
        {{COMPONENT_CONTENT}}
    </main>
    
    <!-- JavaScript -->
    <script>
        // Set active navigation
        document.addEventListener('DOMContentLoaded', function() {
            const currentPath = window.location.pathname;
            document.querySelectorAll('.nav-item').forEach(item => {
                if (item.getAttribute('href') === currentPath) {
                    item.classList.add('active');
                }
            });
        });
        
        {{COMPONENT_JAVASCRIPT}}
    </script>
</body>
</html>
```

---

## 🎨 Logo-Integration

### Korrektes Logo-File
**WICHTIG:** Verwende IMMER das offizielle Logo:
```
/Users/christianbernecker/live-your-dreams/docs/CI/exports/Live_Your_Dreams_Perfect.svg
```

### Integration-Optionen

#### Option 1: Als IMG-Tag (Empfohlen)
```html
<img src="/docs/CI/exports/Live_Your_Dreams_Perfect.svg" 
     alt="LYD Logo" 
     class="sidebar-logo">
```

#### Option 2: Als Background-Image
```css
.sidebar-logo {
    background-image: url('/docs/CI/exports/Live_Your_Dreams_Perfect.svg');
    background-size: contain;
    background-repeat: no-repeat;
    width: 48px;
    height: 38px;
}
```

---

## 🧭 Navigation-Standards

### Struktur-Hierarchie
```
Designing/
├── Design Principles
├── Colors & Themes
├── Typography
└── Spacing System

Developing/
├── Setup Guide
├── Architecture
├── API Reference
└── Testing

Components/
├── Buttons
├── Cards
├── Modal
├── Select
├── Inputs
├── Table
├── Accordion
├── Tabs
├── Toast
└── Dropdown

Styles/
├── Animations
├── Effects
└── Gradients

Patterns/
├── Property Cards
├── Dashboards
└── Forms
```

### Navigation-CSS
```css
.nav-item {
    display: block;
    padding: 10px 24px;
    color: #4b5563;
    text-decoration: none;
    transition: all 0.2s ease;
    position: relative;
}

.nav-item:hover {
    color: #0066ff;
    background: linear-gradient(90deg, transparent, rgba(0, 102, 255, 0.05));
}

.nav-item.active {
    color: #0066ff;
    background: linear-gradient(90deg, rgba(0, 102, 255, 0.1), transparent);
}

.nav-item.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(180deg, #0066ff, #0052cc);
}
```

---

## 💎 Premium Component Standards

### Minimum-Anforderungen

#### 1. Micro-Animationen
```css
/* Hover-Effekte */
.component:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0, 102, 255, 0.2);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Click-Ripple */
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

/* Loading-States */
@keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
}
```

#### 2. Glassmorphism
```css
.glass-component {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

#### 3. Premium Gradients
```css
.gradient-border {
    background: linear-gradient(#fff, #fff) padding-box,
                linear-gradient(135deg, #667eea, #764ba2, #f093fb) border-box;
    border: 2px solid transparent;
}
```

### Benchmark-Vergleich

| Feature | Porsche Design | HeroUI | **LYD Minimum** |
|---------|---------------|---------|-----------------|
| Micro-Animationen | ✓ | ✓ | **✓ Required** |
| Glassmorphism | - | ✓ | **✓ Required** |
| Gradient Borders | - | ✓ | **✓ Required** |
| Loading States | ✓ | ✓ | **✓ Required** |
| Dark Mode | ✓ | ✓ | **✓ Required** |
| A11y WCAG 2.1 | AA | AA | **AA Required** |
| Touch Gestures | ✓ | - | **✓ Required** |
| 3D Transforms | - | - | **✓ Premium** |

---

## 🚀 Deployment-Prozess

### 1. Lokaler Test
```bash
# Component testen
cd design-system/components/[component]
python3 -m http.server 8080
# Browser: http://localhost:8080
```

### 2. Docker Build
```bash
docker build -t lyd-design-system:v[VERSION]-[component] \
  -f deployment/docker/Dockerfile.designsystem . \
  --platform linux/amd64
```

### 3. AWS ECR Push
```bash
# Login
aws ecr get-login-password --region eu-central-1 | \
  docker login --username AWS --password-stdin \
  835474150597.dkr.ecr.eu-central-1.amazonaws.com

# Tag & Push
docker tag lyd-design-system:v[VERSION] \
  835474150597.dkr.ecr.eu-central-1.amazonaws.com/lyd-design-system:v[VERSION]

docker push \
  835474150597.dkr.ecr.eu-central-1.amazonaws.com/lyd-design-system:v[VERSION]
```

### 4. ECS Update
```bash
# Task Definition aktualisieren
aws ecs register-task-definition \
  --cli-input-json file://deployment/ecs/ecs-designsystem-task.json \
  --region eu-central-1

# Service neu deployen
aws ecs update-service \
  --cluster lyd-cluster \
  --service lyd-design-system \
  --task-definition lyd-design-system:[REVISION] \
  --force-new-deployment \
  --region eu-central-1
```

### 5. Verifikation
```bash
# Live-URL testen
curl -I http://designsystem.liveyourdreams.online/components/[component]/

# Visueller Check
open http://designsystem.liveyourdreams.online/components/[component]/
```

---

## 🔍 Qualitätssicherung

### Automatische Validierung

```python
#!/usr/bin/env python3
"""
Component Validation Script
"""

import os
from pathlib import Path
from urllib.request import urlopen

def validate_component(component_path):
    """Validiert eine Komponente gegen alle Standards"""
    
    checks = {
        "logo": False,
        "navigation": False,
        "structure": False,
        "animations": False,
        "accessibility": False
    }
    
    with open(component_path, 'r') as f:
        content = f.read()
    
    # Check 1: Korrektes Logo
    checks["logo"] = "Live_Your_Dreams_Perfect.svg" in content
    
    # Check 2: Navigation vorhanden
    checks["navigation"] = all([
        '<nav class="sidebar">' in content,
        'nav-section-title' in content,
        'nav-item' in content
    ])
    
    # Check 3: Struktur
    checks["structure"] = all([
        'main-content' in content,
        'section-title' in content
    ])
    
    # Check 4: Animationen
    checks["animations"] = any([
        '@keyframes' in content,
        'transition:' in content,
        'animation:' in content
    ])
    
    # Check 5: Accessibility
    checks["accessibility"] = all([
        'aria-' in content or 'role=' in content,
        'alt=' in content,
        ':focus' in content
    ])
    
    return checks

# Alle Komponenten validieren
for component_dir in Path("design-system/components").iterdir():
    if component_dir.is_dir():
        index_file = component_dir / "index.html"
        if index_file.exists():
            results = validate_component(index_file)
            print(f"\n{component_dir.name}:")
            for check, passed in results.items():
                status = "✅" if passed else "❌"
                print(f"  {status} {check}")
```

### Manuelle Checkliste

#### Vor jedem Deployment:
- [ ] Alle Links in der Navigation funktionieren
- [ ] Logo wird korrekt angezeigt
- [ ] Komponente hat mindestens 3 Micro-Animationen
- [ ] Responsive Design getestet (Mobile, Tablet, Desktop)
- [ ] Keyboard-Navigation funktioniert
- [ ] Screen-Reader getestet
- [ ] Performance: Ladezeit < 2s
- [ ] Keine JavaScript-Fehler in Console

### Live-URL Monitoring

```bash
#!/bin/bash
# Monitor Script für Live-URLs

COMPONENTS=(
    "buttons"
    "cards"
    "modal"
    "select"
    "inputs"
    "table"
    "accordion"
    "tabs"
    "toast"
    "dropdown"
)

BASE_URL="http://designsystem.liveyourdreams.online/components"

for comp in "${COMPONENTS[@]}"; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/$comp/")
    if [ "$STATUS" -eq 200 ]; then
        echo "✅ $comp: OK"
    else
        echo "❌ $comp: ERROR ($STATUS)"
    fi
done
```

---

## 📊 Komponenten-Status Dashboard

| Komponente | Logo | Navigation | Premium Styles | Animationen | Deploy Status |
|------------|------|------------|----------------|-------------|---------------|
| Buttons | ⚠️ Inline SVG | ✅ | ✅ | ✅ | ✅ Live |
| Cards | ⚠️ Inline SVG | ✅ | ⏳ | ⏳ | ✅ Live |
| Modal | ⚠️ Inline SVG | ✅ | ⏳ | ⏳ | ✅ Live |
| Select | ⚠️ Inline SVG | ✅ | ⏳ | ⏳ | ✅ Live |
| Inputs | ⚠️ Inline SVG | ✅ | ⏳ | ⏳ | ✅ Live |
| Table | ⚠️ Inline SVG | ❓ | ⏳ | ⏳ | ✅ Live |
| Accordion | ⚠️ Inline SVG | ❓ | ⏳ | ⏳ | ✅ Live |
| Tabs | ⚠️ Inline SVG | ❓ | ⏳ | ⏳ | ✅ Live |
| Toast | ⚠️ Inline SVG | ❓ | ⏳ | ⏳ | ✅ Live |
| Dropdown | ⚠️ Inline SVG | ❓ | ⏳ | ⏳ | ✅ Live |

**Legende:**
- ✅ Vollständig implementiert
- ⏳ In Arbeit / Teilweise implementiert
- ❓ Ungeprüft
- ❌ Fehlt / Fehlerhaft
- ⚠️ Funktioniert, aber nicht optimal

---

## 🎯 Nächste Schritte

### Priorität 1: Logo-Migration
Alle Komponenten müssen das offizielle Logo verwenden:
```bash
# Script für Logo-Migration
for file in design-system/components/*/index.html; do
    # Ersetze inline SVG mit IMG-Tag
    sed -i 's|<svg class="sidebar-logo".*</svg>|<img src="/docs/CI/exports/Live_Your_Dreams_Perfect.svg" alt="LYD Logo" class="sidebar-logo">|' "$file"
done
```

### Priorität 2: Premium-Upgrade
Jede Komponente auf Luxury-Standard bringen:
1. Buttons ✅ (Fertig)
2. Cards (Nächste)
3. Modal
4. Select
5. Inputs
6. ...

### Priorität 3: Konsistenz-Check
Wöchentlicher Audit aller Komponenten:
- Montag: Navigation-Test
- Mittwoch: Style-Review
- Freitag: Performance-Check

---

## 📞 Support & Kontakt

Bei Fragen oder Problemen:
1. Prüfe diese Anleitung
2. Führe das Validierungs-Script aus
3. Teste lokal bevor du deployest
4. Dokumentiere alle Änderungen

---

**Letzte Aktualisierung:** Januar 2025
**Version:** 2.0
**Autor:** LYD Design System Team

