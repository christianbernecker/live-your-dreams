# LYD Design System - Verifikationsstrategie

## 🎯 **Problem-Analyse:**
Der bisherige Ansatz "alles ist 100%" war unzureichend. Screenshots zeigen konkrete Abweichungen.

## 📋 **Neue systematische Verifikation:**

### **1. Page-Title-Konsistenz:**
**Soll-Zustand (Screenshot):**
```
BUTTON (blaues Uppercase mit Gradient)
```

**Verifikation:**
- [ ] Alle Komponenten haben blaue Uppercase-Titles
- [ ] Gradient: Royal Blue → Deep Blue
- [ ] Letter-spacing: 6px
- [ ] Font-weight: normal

### **2. Accessibility-Layout-Konsistenz:**
**Soll-Zustand (Input-Screenshot):**
```
ACCESSIBILITY & BEST PRACTICES (blaue Uppercase-Headline)

┌─────────────────────────────────────────────────────────────┐
│  [Grauer Hintergrund mit 4-Spalten-Grid]                   │
│                                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
│  │Keyboard Nav │ │Screen Reader│ │Visual Access│ │Form Val │ │
│  │✓ Item 1     │ │✓ Item 1     │ │✓ Item 1     │ │✓ Item 1 │ │
│  │✓ Item 2     │ │✓ Item 2     │ │✓ Item 2     │ │✓ Item 2 │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Verifikation:**
- [ ] 4-Spalten-Grid (Desktop)
- [ ] Grauer Hintergrund (var(--lyd-accent))
- [ ] Weiße Cards mit Schatten
- [ ] Blaue Checkmarks (var(--lyd-royal-blue))

### **3. Komponenten-spezifische Tests:**
- [ ] Buttons: Page-Title + 4-Spalten-Accessibility
- [ ] Cards: Page-Title + 4-Spalten-Accessibility  
- [ ] Table: Page-Title + 4-Spalten-Accessibility
- [ ] Inputs: Referenz-Implementierung ✓
- [ ] Select: Page-Title + 4-Spalten-Accessibility
- [ ] Typography: Page-Title + 4-Spalten-Accessibility
- [ ] Accordion: Page-Title + 4-Spalten-Accessibility

### **4. Live-URL-Tests:**
```bash
# Test Page-Title Styling
curl -s URL | grep -o "page-title.*uppercase"

# Test Accessibility-Grid
curl -s URL | grep -A 5 "accessibility-grid"

# Test 4-Spalten-Layout
curl -s URL | grep -o "repeat(4, 1fr)"
```

## 🔄 **Iterative Korrektur:**
1. **Identifiziere Abweichung** - Screenshot vs. Live
2. **Korrigiere zentrale CSS** - Ein Update für alle
3. **Teste lokal** - Grep-basierte Verifikation  
4. **Deploye** - Einmal für alle Komponenten
5. **Verifiziere live** - Stichproben-Tests
6. **Dokumentiere** - Was wurde geändert

## ✅ **Qualitätssicherung:**
- Screenshots als Referenz verwenden
- Jede Abweichung dokumentieren
- Systematische Tests vor "100%"-Claims
- Live-Verifikation nach jedem Deployment
