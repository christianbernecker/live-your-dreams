#!/usr/bin/env node

/**
 * PIXEL-PERFECT SYSTEM - Autonome Verifikation mit automatischer Korrektur
 * Integriert mit Playwright für echte Browser-basierte Vergleiche
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PixelPerfectSystem {
    constructor() {
        this.browser = null;
        this.baseUrl = 'http://designsystem.liveyourdreams.online';
        this.screenshotsDir = path.join(__dirname, '../screenshots');
        this.diffsDir = path.join(__dirname, '../diffs');
        
        // Erstelle Verzeichnisse
        [this.screenshotsDir, this.diffsDir].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }

    async initialize() {
        console.log('🔍 Initialisiere Pixel-Perfect System...');
        this.browser = await chromium.launch({ 
            headless: true,
            args: ['--no-sandbox', '--disable-dev-shm-usage']
        });
    }

    async shutdown() {
        if (this.browser) {
            await this.browser.close();
        }
    }

    /**
     * HAUPTFUNKTION: Vergleiche Komponente mit Gold Standard
     */
    async verifyComponent(componentName, goldStandard = 'inputs') {
        console.log(`🎯 Pixel-Perfect Verifikation: ${componentName} vs ${goldStandard}`);
        
        try {
            await this.initialize();
            
            const componentUrl = `${this.baseUrl}/v2/components/${componentName}/`;
            const goldUrl = `${this.baseUrl}/v2/components/${goldStandard}/`;
            
            // 1. Screenshots aufnehmen
            const screenshots = await this.takeComparativeScreenshots(componentUrl, goldUrl, componentName, goldStandard);
            
            // 2. CSS-Properties vergleichen
            const cssComparison = await this.compareCSSProperties(componentUrl, goldUrl);
            
            // 3. Visuelle Unterschiede analysieren
            const visualDiff = await this.analyzeVisualDifferences(screenshots);
            
            // 4. Auto-Fix-Vorschläge generieren
            const fixes = await this.generateAutoFixes(cssComparison, visualDiff);
            
            // 5. Gesamtbewertung
            const accuracy = this.calculateAccuracy(cssComparison, visualDiff);
            const passed = accuracy > 0.99; // 99% Genauigkeit erforderlich
            
            const result = {
                passed,
                accuracy,
                componentName,
                goldStandard,
                screenshots,
                cssComparison,
                visualDiff,
                fixes,
                timestamp: new Date().toISOString()
            };
            
            // 6. Report speichern
            await this.saveVerificationReport(result);
            
            console.log(`📊 Verifikation abgeschlossen: ${(accuracy * 100).toFixed(2)}% Genauigkeit`);
            
            return result;
            
        } finally {
            await this.shutdown();
        }
    }

    /**
     * Screenshots für Vergleich aufnehmen
     */
    async takeComparativeScreenshots(componentUrl, goldUrl, componentName, goldStandard) {
        console.log('📸 Nehme vergleichende Screenshots auf...');
        
        const context = await this.browser.newContext({
            viewport: { width: 1200, height: 800 }
        });
        
        const screenshots = {};
        
        for (const [name, url] of [
            [componentName, componentUrl],
            [goldStandard, goldUrl]
        ]) {
            const page = await context.newPage();
            
            try {
                await page.goto(url, { waitUntil: 'networkidle' });
                
                // Warte auf vollständiges Laden der Styles
                await page.waitForTimeout(2000);
                
                // Vollbild-Screenshot
                const screenshotPath = path.join(this.screenshotsDir, `${name}-full.png`);
                await page.screenshot({ 
                    path: screenshotPath, 
                    fullPage: true 
                });
                
                // Implementation Guide Screenshot
                const implGuideSelector = '.section:has(.section-title:text("Implementation Guide"))';
                try {
                    await page.waitForSelector(implGuideSelector, { timeout: 5000 });
                    const implGuidePath = path.join(this.screenshotsDir, `${name}-impl-guide.png`);
                    await page.locator(implGuideSelector).screenshot({ path: implGuidePath });
                    
                    screenshots[`${name}_implementation`] = implGuidePath;
                } catch (e) {
                    console.log(`⚠️  Implementation Guide nicht gefunden für ${name}`);
                }
                
                screenshots[`${name}_full`] = screenshotPath;
                
            } catch (error) {
                console.error(`❌ Screenshot-Fehler für ${name}: ${error.message}`);
            } finally {
                await page.close();
            }
        }
        
        await context.close();
        return screenshots;
    }

    /**
     * CSS-Properties zwischen Komponenten vergleichen
     */
    async compareCSSProperties(componentUrl, goldUrl) {
        console.log('🎨 Vergleiche CSS-Properties...');
        
        const context = await this.browser.newContext();
        const cssComparison = {
            matches: [],
            deviations: [],
            critical: []
        };
        
        // Wichtige Selektoren für Vergleich
        const criticalSelectors = [
            '.section-title',
            '.section-subtitle', 
            '.implementation-section',
            '.accessibility-grid',
            '.lyd-button',
            '.nav-item.active'
        ];
        
        const criticalProperties = [
            'font-family',
            'font-size',
            'font-weight',
            'color',
            'background',
            'margin',
            'padding',
            'border-radius',
            'letter-spacing'
        ];
        
        for (const [name, url] of [
            ['component', componentUrl],
            ['gold', goldUrl]
        ]) {
            const page = await context.newPage();
            
            try {
                await page.goto(url, { waitUntil: 'networkidle' });
                
                for (const selector of criticalSelectors) {
                    try {
                        const element = await page.locator(selector).first();
                        
                        if (await element.count() > 0) {
                            const styles = {};
                            
                            for (const prop of criticalProperties) {
                                const value = await element.evaluate((el, property) => {
                                    return window.getComputedStyle(el)[property];
                                }, prop);
                                styles[prop] = value;
                            }
                            
                            cssComparison[name] = cssComparison[name] || {};
                            cssComparison[name][selector] = styles;
                        }
                        
                    } catch (e) {
                        console.log(`⚠️  Selektor ${selector} nicht gefunden in ${name}`);
                    }
                }
                
            } catch (error) {
                console.error(`❌ CSS-Analyse-Fehler für ${name}: ${error.message}`);
            } finally {
                await page.close();
            }
        }
        
        // Vergleiche CSS-Properties
        if (cssComparison.component && cssComparison.gold) {
            for (const selector of criticalSelectors) {
                if (cssComparison.component[selector] && cssComparison.gold[selector]) {
                    const compStyles = cssComparison.component[selector];
                    const goldStyles = cssComparison.gold[selector];
                    
                    for (const prop of criticalProperties) {
                        if (compStyles[prop] === goldStyles[prop]) {
                            cssComparison.matches.push({ selector, property: prop, value: compStyles[prop] });
                        } else {
                            const deviation = {
                                selector,
                                property: prop,
                                component: compStyles[prop],
                                gold: goldStyles[prop],
                                critical: this.isCriticalProperty(selector, prop)
                            };
                            
                            cssComparison.deviations.push(deviation);
                            
                            if (deviation.critical) {
                                cssComparison.critical.push(deviation);
                            }
                        }
                    }
                }
            }
        }
        
        await context.close();
        return cssComparison;
    }

    /**
     * Generiere automatische Fixes basierend auf Abweichungen
     */
    async generateAutoFixes(cssComparison, visualDiff) {
        console.log('🔧 Generiere Auto-Fixes...');
        
        const fixes = [];
        
        // CSS-basierte Fixes
        for (const deviation of cssComparison.critical || []) {
            const fix = {
                type: 'css',
                selector: deviation.selector,
                property: deviation.property,
                currentValue: deviation.component,
                targetValue: deviation.gold,
                cssRule: `${deviation.selector} { ${deviation.property}: ${deviation.gold} !important; }`,
                priority: this.getFixPriority(deviation)
            };
            
            fixes.push(fix);
        }
        
        // Spezielle Fixes für häufige Probleme
        const specialFixes = this.generateSpecialFixes(cssComparison);
        fixes.push(...specialFixes);
        
        // Sortiere nach Priorität
        fixes.sort((a, b) => b.priority - a.priority);
        
        return fixes;
    }

    generateSpecialFixes(cssComparison) {
        const specialFixes = [];
        
        // Implementation Guide Button Fix
        const buttonDeviations = cssComparison.deviations?.filter(d => d.selector.includes('lyd-button')) || [];
        if (buttonDeviations.length > 0) {
            specialFixes.push({
                type: 'template',
                description: 'Implementation Guide verwendet nicht-standard Button-Klassen',
                fix: 'Ersetze inline Button-Styles mit .lyd-button Klassen',
                cssRule: `/* Force Standard Button Styles */
.lyd-button { 
    font-family: var(--font-family-primary) !important;
    font-weight: 600 !important;
    padding: 12px 24px !important;
}`,
                priority: 9
            });
        }
        
        // Section Title Gradient Fix
        const titleDeviations = cssComparison.deviations?.filter(d => 
            d.selector === '.section-title' && d.property === 'background'
        ) || [];
        
        if (titleDeviations.length > 0) {
            specialFixes.push({
                type: 'css',
                description: 'Section Title fehlt Premium-Gradient',
                cssRule: `.section-title { 
    background: linear-gradient(180deg, #3366CC 0%, #000066 100%) !important;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
}`,
                priority: 8
            });
        }
        
        return specialFixes;
    }

    /**
     * Berechne Gesamtgenauigkeit
     */
    calculateAccuracy(cssComparison, visualDiff) {
        const totalProperties = cssComparison.matches.length + cssComparison.deviations.length;
        const matchingProperties = cssComparison.matches.length;
        
        if (totalProperties === 0) return 0.5; // Unbekannt
        
        const cssAccuracy = matchingProperties / totalProperties;
        
        // Gewichte kritische Abweichungen stärker
        const criticalPenalty = cssComparison.critical.length * 0.1;
        
        return Math.max(0, cssAccuracy - criticalPenalty);
    }

    isCriticalProperty(selector, property) {
        const criticalCombinations = [
            { selector: '.section-title', properties: ['font-weight', 'background', 'letter-spacing'] },
            { selector: '.lyd-button', properties: ['font-family', 'padding', 'font-weight'] },
            { selector: '.accessibility-grid', properties: ['grid-template-columns'] }
        ];
        
        return criticalCombinations.some(combo => 
            selector.includes(combo.selector) && combo.properties.includes(property)
        );
    }

    getFixPriority(deviation) {
        if (deviation.critical) return 10;
        if (deviation.selector === '.section-title') return 8;
        if (deviation.selector === '.lyd-button') return 7;
        return 5;
    }

    async analyzeVisualDifferences(screenshots) {
        // Placeholder für echte visuelle Diff-Analyse
        // In der echten Implementation würde hier pixelmatch verwendet
        return {
            pixelDifferences: 0,
            percentageDiff: 0.01,
            significantChanges: []
        };
    }

    async saveVerificationReport(result) {
        const reportPath = path.join(this.diffsDir, `verification-${result.componentName}-${Date.now()}.json`);
        fs.writeFileSync(reportPath, JSON.stringify(result, null, 2));
        
        console.log(`📄 Verifikationsreport gespeichert: ${reportPath}`);
        return reportPath;
    }
}

// CLI Interface
if (import.meta.url === `file://${process.argv[1]}`) {
    const [,, componentName, goldStandard] = process.argv;
    
    if (!componentName) {
        console.log(`
🔍 PIXEL-PERFECT SYSTEM - Usage:

  node pixel-perfect-system.js <component> [goldStandard]

Beispiele:
  node pixel-perfect-system.js modal inputs
  node pixel-perfect-system.js dropdown select
  node pixel-perfect-system.js checkbox inputs
        `);
        process.exit(1);
    }
    
    const system = new PixelPerfectSystem();
    
    system.verifyComponent(componentName, goldStandard)
        .then(result => {
            console.log('\n📊 VERIFIKATION ABGESCHLOSSEN:');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`🎯 Komponente: ${result.componentName}`);
            console.log(`📊 Genauigkeit: ${(result.accuracy * 100).toFixed(2)}%`);
            console.log(`✅ Bestanden: ${result.passed ? 'JA' : 'NEIN'}`);
            console.log(`🔧 Auto-Fixes: ${result.fixes.length}`);
            
            if (result.fixes.length > 0) {
                console.log('\n🔧 EMPFOHLENE FIXES:');
                result.fixes.slice(0, 3).forEach((fix, i) => {
                    console.log(`${i + 1}. ${fix.description || fix.selector + ' ' + fix.property}`);
                    if (fix.cssRule) {
                        console.log(`   CSS: ${fix.cssRule.substring(0, 60)}...`);
                    }
                });
            }
            
            process.exit(result.passed ? 0 : 1);
        })
        .catch(error => {
            console.error('❌ Verifikation fehlgeschlagen:', error.message);
            process.exit(1);
        });
}

export default PixelPerfectSystem;
