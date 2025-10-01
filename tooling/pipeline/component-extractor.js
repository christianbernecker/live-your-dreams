#!/usr/bin/env node

/**
 * Design System Component Pipeline - Extractor
 * Automatische Extraktion neuer Komponenten aus Backoffice ins Design System
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

class ComponentExtractor {
  constructor() {
    this.backofficeComponentsPath = 'apps/backoffice/components/design-system';
    this.designSystemPath = 'design-system/v2/components';
    this.masterCSSPath = 'design-system/v2/shared/master.css';
  }

  // Scanne nach neuen Komponenten
  scanForNewComponents() {
    console.log('🔍 Scanne nach neuen Komponenten...');
    
    const backofficeComponents = glob.sync(`${this.backofficeComponentsPath}/LYD*.tsx`);
    const existingComponents = glob.sync(`${this.designSystemPath}/*/index.html`);
    
    const existingNames = existingComponents.map(comp => {
      const match = comp.match(/components\/([^\/]+)\/index\.html/);
      return match ? match[1] : null;
    }).filter(Boolean);

    const newComponents = backofficeComponents.filter(comp => {
      const componentName = path.basename(comp, '.tsx')
        .replace('LYD', '')
        .toLowerCase();
      
      return !existingNames.includes(componentName);
    });

    console.log(`✅ Gefunden: ${newComponents.length} neue Komponenten`);
    return newComponents;
  }

  // Extrahiere CSS Klassen aus TypeScript Komponente
  extractCSSClasses(componentPath) {
    const content = fs.readFileSync(componentPath, 'utf8');
    
    // Suche nach className Properties mit lyd- Präfix
    const classMatches = content.match(/className=["'][^"']*lyd-[^"']*["']/g) || [];
    const classes = new Set();
    
    classMatches.forEach(match => {
      const classString = match.replace(/className=["']/, '').replace(/["']$/, '');
      const lydClasses = classString.split(' ').filter(cls => cls.startsWith('lyd-'));
      lydClasses.forEach(cls => classes.add(cls));
    });

    return Array.from(classes);
  }

  // Analysiere TypeScript Props Interface
  analyzePropsInterface(componentPath) {
    const content = fs.readFileSync(componentPath, 'utf8');
    
    // Suche nach Props Interface
    const interfaceMatch = content.match(/export interface (\w+Props)\s*{([^}]+)}/s);
    if (!interfaceMatch) return {};

    const propsString = interfaceMatch[2];
    const props = {};
    
    // Einfache Prop-Erkennung (vereinfacht)
    const propLines = propsString.split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('//'));

    propLines.forEach(line => {
      const match = line.match(/(\w+)\??:\s*([^;]+);?/);
      if (match) {
        props[match[1]] = match[2].trim();
      }
    });

    return props;
  }

  // Generiere HTML Demo
  generateHTMLDemo(componentName, cssClasses, props) {
    const componentNameLower = componentName.replace('LYD', '').toLowerCase();
    
    const template = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${componentName.replace('LYD', '')} - LYD Design System V2</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- ZENTRALES CSS SYSTEM -->
    <link rel="stylesheet" href="/shared/master.css">
    
    <!-- ZENTRALE JAVASCRIPT INTERAKTIONEN -->
    <script src="/shared/interactions.js"></script>
</head>

<body>
    <!-- Navigation Template -->
    <div class="layout">
        <nav class="sidebar">
            <div class="sidebar-header">
                <img src="/shared/lyd-logo.svg" alt="LYD" class="lyd-logo" />
                <div class="logo-subtitle">Design System V2</div>
            </div>
            
            <div class="nav-section">
                <div class="nav-section-title">Components</div>
                <a href="/components/overview/" class="nav-item">Overview</a>
                <!-- Auto-generated navigation will be inserted here -->
            </div>
        </nav>
        
        <main class="main-content">
            <h1>${componentName.replace('LYD', '')}</h1>
            <p>Auto-generated component from backoffice integration pipeline.</p>
            
            <!-- Basic Examples -->
            <section class="section">
                <h2 class="section-title">Basic Usage</h2>
                <div class="component-grid">
                    <div class="component-card">
                        <h3>Default ${componentName.replace('LYD', '')}</h3>
                        <div class="component-preview">
                            <!-- Auto-generated examples based on CSS classes -->
                            ${this.generateBasicExamples(componentNameLower, cssClasses)}
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- CSS Classes Documentation -->
            <section class="section">
                <h2 class="section-title">CSS Classes</h2>
                <div class="code-block">
                    <pre><code>${cssClasses.map(cls => `.${cls}`).join('\n')}</code></pre>
                </div>
            </section>
            
            <!-- Props Documentation -->
            <section class="section">
                <h2 class="section-title">TypeScript Interface</h2>
                <div class="code-block">
                    <pre><code>${this.generatePropsDocumentation(props)}</code></pre>
                </div>
            </section>
            
            <!-- React Implementation -->
            <section class="section">
                <h2 class="section-title">React Implementation</h2>
                <div class="code-block">
                    <pre><code>import { ${componentName} } from '@/components/design-system/${componentName}';

// Basic usage
&lt;${componentName} /&gt;

// With props
&lt;${componentName} ${Object.keys(props).slice(0, 3).map(prop => `${prop}="value"`).join(' ')} /&gt;</code></pre>
                </div>
            </section>
        </main>
    </div>
</body>
</html>`;

    return template;
  }

  // Generiere einfache Beispiele basierend auf CSS Klassen
  generateBasicExamples(componentName, cssClasses) {
    const baseClass = cssClasses.find(cls => cls === `lyd-${componentName}`) || cssClasses[0];
    
    if (!baseClass) {
      return `<div class="placeholder">No CSS classes found for ${componentName}</div>`;
    }

    // Generiere Varianten basierend auf gefundenen Klassen
    let examples = `<div class="${baseClass}">Default ${componentName}</div>\n`;
    
    // Suche nach Varianten (primary, secondary, etc.)
    const variants = cssClasses.filter(cls => 
      cls.includes('primary') || cls.includes('secondary') || 
      cls.includes('small') || cls.includes('large')
    );
    
    variants.forEach(variant => {
      const variantName = variant.replace(`lyd-${componentName}-`, '').replace('lyd-', '');
      examples += `            <div class="${baseClass} ${variant}">${variantName} ${componentName}</div>\n`;
    });

    return examples;
  }

  // Generiere Props Dokumentation
  generatePropsDocumentation(props) {
    if (Object.keys(props).length === 0) {
      return 'No props interface found';
    }

    let doc = 'interface ComponentProps {\n';
    Object.entries(props).forEach(([name, type]) => {
      doc += `  ${name}: ${type};\n`;
    });
    doc += '}';
    
    return doc;
  }

  // Extrahiere Komponente ins Design System
  async extractComponent(componentPath) {
    const componentName = path.basename(componentPath, '.tsx');
    const componentNameLower = componentName.replace('LYD', '').toLowerCase();
    
    console.log(`🔄 Extrahiere: ${componentName}`);

    // 1. CSS Klassen extrahieren
    const cssClasses = this.extractCSSClasses(componentPath);
    console.log(`  📝 CSS Classes: ${cssClasses.length} gefunden`);

    // 2. Props analysieren
    const props = this.analyzePropsInterface(componentPath);
    console.log(`  🔧 Props: ${Object.keys(props).length} erkannt`);

    // 3. Design System Ordner erstellen
    const targetDir = path.join(this.designSystemPath, componentNameLower);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // 4. HTML Demo generieren
    const htmlDemo = this.generateHTMLDemo(componentName, cssClasses, props);
    fs.writeFileSync(path.join(targetDir, 'index.html'), htmlDemo);

    // 5. React Komponente kopieren
    const reactComponent = fs.readFileSync(componentPath, 'utf8');
    fs.writeFileSync(path.join(targetDir, 'react-component.tsx'), reactComponent);

    // 6. Metadaten speichern
    const metadata = {
      name: componentName,
      extractedAt: new Date().toISOString(),
      cssClasses,
      props,
      source: componentPath
    };
    fs.writeFileSync(path.join(targetDir, 'metadata.json'), JSON.stringify(metadata, null, 2));

    console.log(`  ✅ ${componentName} erfolgreich extrahiert`);
    return {
      name: componentName,
      directory: targetDir,
      cssClasses,
      props
    };
  }

  // Führe komplette Pipeline aus
  async runPipeline() {
    console.log('🚀 Design System Component Pipeline startet...');
    console.log('═════════════════════════════════════════════');

    const newComponents = this.scanForNewComponents();
    
    if (newComponents.length === 0) {
      console.log('✅ Keine neuen Komponenten gefunden');
      return;
    }

    const extractedComponents = [];
    
    for (const componentPath of newComponents) {
      try {
        const result = await this.extractComponent(componentPath);
        extractedComponents.push(result);
      } catch (error) {
        console.error(`❌ Fehler bei ${componentPath}:`, error.message);
      }
    }

    console.log('');
    console.log('🎯 PIPELINE ABGESCHLOSSEN');
    console.log('═════════════════════════════════════════════');
    console.log(`✅ ${extractedComponents.length} Komponenten erfolgreich extrahiert`);
    
    extractedComponents.forEach(comp => {
      console.log(`  • ${comp.name}: ${comp.cssClasses.length} CSS classes, ${Object.keys(comp.props).length} props`);
    });

    return extractedComponents;
  }
}

// CLI Usage
if (require.main === module) {
  const extractor = new ComponentExtractor();
  extractor.runPipeline().catch(console.error);
}

module.exports = ComponentExtractor;

