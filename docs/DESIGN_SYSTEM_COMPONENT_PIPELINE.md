# Design System Component Pipeline

**Bidirektionale Integration zwischen Design System und Anwendungen**

---

## 🎯 **Ziel: Enge Verzahnung**

Neue Komponenten sollen nahtlos zwischen Design System und Backoffice (sowie zukünftigen Anwendungen) fließen können - in beide Richtungen.

---

## 🔄 **Pipeline-Architektur**

### **1. Komponent-Entwicklung im Backoffice**

```typescript
// apps/backoffice/components/design-system/NewComponent.tsx
/**
 * Neue Komponente - Pipeline Ready für Design System Integration
 */

export interface NewComponentProps {
  // Props definition
}

export const NewComponent: React.FC<NewComponentProps> = (props) => {
  return (
    <div className="lyd-new-component">
      {/* Implementation using Design System patterns */}
    </div>
  );
};

// PIPELINE MARKER - Ready for Design System
// Type: form | interactive | feedback | layout | data
// Dependencies: LYDButton, LYDInput
// CSS Requirements: .lyd-new-component styles
// Documentation: Complete with examples
```

### **2. Automatisierte Extraktion**

```bash
# Pipeline Script: extract-to-design-system.sh
#!/bin/bash

COMPONENT_NAME=$1
COMPONENT_TYPE=$2

echo "🔄 Extrahiere Komponente: ${COMPONENT_NAME}"

# 1. TypeScript Komponente kopieren
cp "apps/backoffice/components/design-system/${COMPONENT_NAME}.tsx" \
   "design-system/v2/components/${COMPONENT_NAME,,}/react-component.tsx"

# 2. CSS Extraktion aus Komponente
echo "🎨 Extrahiere CSS Patterns..."
grep -E "(lyd-[a-z-]+)" "apps/backoffice/components/design-system/${COMPONENT_NAME}.tsx" \
   > "design-system/v2/components/${COMPONENT_NAME,,}/css-classes.txt"

# 3. HTML Demo generieren
generate_html_demo "${COMPONENT_NAME}" "${COMPONENT_TYPE}"

# 4. Dokumentation generieren
generate_component_docs "${COMPONENT_NAME}"

echo "✅ Komponente erfolgreich ins Design System integriert"
```

### **3. Design System HTML-Erstellung**

```javascript
// tools/generate-html-demo.js
function generateHTMLDemo(componentName, componentType) {
  const template = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${componentName} - LYD Design System V2</title>
    <link rel="stylesheet" href="/shared/master.css">
</head>
<body>
    <!-- Navigation einbetten -->
    <script src="/shared/embed-navigation.js"></script>
    
    <main class="main-content">
        <h1>${componentName}</h1>
        <p>Auto-generierte Komponente aus Backoffice Integration</p>
        
        <!-- Auto-generierte Beispiele basierend auf TypeScript Props -->
        <section class="section">
            <h2 class="section-title">Variants</h2>
            <div class="component-grid">
                ${generateVariantExamples(componentName)}
            </div>
        </section>
        
        <!-- CSS Klassen Dokumentation -->
        <section class="section">
            <h2 class="section-title">CSS Classes</h2>
            <div class="code-block">
                <pre><code>${generateCSSDocumentation(componentName)}</code></pre>
            </div>
        </section>
    </main>
</body>
</html>
  `;
  
  return template;
}
```

---

## 📋 **Workflow-Schritte**

### **Phase 1: Komponent-Entwicklung**
1. **Entwicklung im Backoffice** - Neue Komponente mit Design System Patterns
2. **Pipeline Marker** - Kennzeichnung für automatische Extraktion
3. **Testing** - Funktionalität und Design im Backoffice validieren

### **Phase 2: Extraktion**
4. **Automatische Erkennung** - CI/CD Pipeline erkennt neue Komponenten
5. **Code Extraktion** - TypeScript Komponente + CSS Klassen
6. **HTML Demo Generation** - Automatische Erstellung der Design System Seite

### **Phase 3: Integration**
7. **Design System Update** - Neue Komponente in Navigation einbinden  
8. **CSS Master Integration** - Neue Klassen in master.css
9. **Documentation** - Auto-generierte Docs mit Beispielen

### **Phase 4: Rückfluss**
10. **Design System → Andere Apps** - Neue Komponente für weitere Projekte verfügbar
11. **Version Control** - Semantic Versioning für Komponenten-Updates
12. **Cross-App Sync** - Automatische Updates in allen Anwendungen

---

## 🛠️ **Pipeline Tools**

### **1. Component Scanner**
```javascript
// tools/component-scanner.js
const scanForNewComponents = () => {
  const backofficeComponents = glob.sync('apps/backoffice/components/design-system/*.tsx');
  const designSystemComponents = glob.sync('design-system/v2/components/*/react-component.tsx');
  
  // Finde neue Komponenten
  const newComponents = backofficeComponents.filter(component => {
    const componentName = path.basename(component, '.tsx');
    return !designSystemComponents.some(ds => ds.includes(componentName.toLowerCase()));
  });
  
  return newComponents;
};
```

### **2. CSS Class Extractor**
```javascript
// tools/css-extractor.js
const extractCSSClasses = (componentPath) => {
  const content = fs.readFileSync(componentPath, 'utf8');
  const classMatches = content.match(/className=["'](lyd-[^"']+)["']/g);
  
  return classMatches?.map(match => 
    match.replace(/className=["']/, '').replace(/["']$/, '')
  ) || [];
};
```

### **3. Auto Documentation Generator**
```javascript
// tools/doc-generator.js
const generateComponentDoc = (componentName, props, cssClasses) => {
  return {
    title: componentName,
    description: `Auto-generated from backoffice integration`,
    props: analyzeTypeScriptProps(props),
    cssClasses: cssClasses,
    examples: generateCodeExamples(componentName, props),
    htmlImplementation: generateHTMLImplementation(componentName, cssClasses)
  };
};
```

---

## 🔧 **Integration Commands**

### **Neue Komponente ins Design System**
```bash
# Manuelle Integration
npm run ds:integrate ComponentName form

# Automatische Erkennung
npm run ds:scan

# Bulk Migration aller neuen Komponenten
npm run ds:migrate-all
```

### **Design System → Backoffice Sync**
```bash
# Updated Komponente aus Design System holen
npm run ds:sync ComponentName

# Alle Komponenten synchronisieren
npm run ds:sync-all
```

### **Cross-Application Update**
```bash
# Design System Version bump
npm run ds:version-bump minor

# Alle Apps über Updates informieren
npm run ds:notify-apps
```

---

## 📊 **Pipeline Monitoring**

### **Dashboard Metriken**
- ✅ **Neue Komponenten erkannt**: 3 diese Woche
- ✅ **Erfolgreiche Integrationen**: 26/26 Komponenten  
- ✅ **Cross-App Sync Status**: Alle Apps aktuell
- ✅ **CSS Konsistenz**: 100% Design System konform

### **Automated Testing**
- **Visual Regression Tests** - Screenshots vor/nach Integration
- **CSS Validation** - Alle Klassen existieren in master.css  
- **TypeScript Compilation** - Komponenten kompilieren fehlerfrei
- **Accessibility Tests** - WCAG 2.1 Compliance

---

## 🎯 **Ergebnis: Nahtlose Integration**

**Diese Pipeline stellt sicher:**

1. **Neue Komponenten** entstehen natürlich im Entwicklungskontext (Backoffice)
2. **Automatische Extraktion** macht sie sofort für das Design System verfügbar
3. **HTML-Demos** dokumentieren die Nutzung für andere Entwickler
4. **CSS Integration** hält das Design System konsistent
5. **Rückfluss** macht Komponenten für alle zukünftigen Apps verfügbar

**Das Design System wird zum lebenden, sich selbst erweiternden System!**

