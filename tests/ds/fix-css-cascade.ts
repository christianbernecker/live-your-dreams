import { chromium } from 'playwright';

/**
 * Automatische CSS-Cascade-Probleme-Erkennung und -Behebung
 */

const BASE_URL = 'http://designsystem.liveyourdreams.online';
const components = ['inputs', 'buttons', 'cards', 'table', 'accordion', 'typography', 'select'];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('=== CSS-CASCADE-ANALYSE ===');
  
  for (const component of components) {
    await page.goto(`${BASE_URL}/v2/components/${component}/`);
    
    console.log(`\n${component.toUpperCase()}:`);
    
    // Prüfe CSS-Quellen für accessibility-grid
    const cssRules = await page.evaluate(() => {
      const element = document.querySelector('.accessibility-grid');
      if (!element) return { found: false };
      
      const computedStyle = window.getComputedStyle(element);
      const rules = [];
      
      // Finde alle CSS-Regeln die dieses Element betreffen
      for (let sheet of document.styleSheets) {
        try {
          for (let rule of sheet.cssRules) {
            if (rule.type === CSSRule.STYLE_RULE) {
              const styleRule = rule as CSSStyleRule;
              if (styleRule.selectorText && styleRule.selectorText.includes('accessibility-grid')) {
                rules.push({
                  selector: styleRule.selectorText,
                  source: sheet.href || 'inline',
                  cssText: styleRule.cssText
                });
              }
            }
          }
        } catch (e) {
          // Skip CORS-blocked stylesheets
        }
      }
      
      return {
        found: true,
        computedDisplay: computedStyle.getPropertyValue('display'),
        computedGridColumns: computedStyle.getPropertyValue('grid-template-columns'),
        computedBackground: computedStyle.getPropertyValue('background-color'),
        rules: rules
      };
    });
    
    if (cssRules.found) {
      console.log(`  Display: ${cssRules.computedDisplay}`);
      console.log(`  Grid-Columns: ${cssRules.computedGridColumns}`);
      console.log(`  Background: ${cssRules.computedBackground}`);
      console.log(`  CSS-Regeln gefunden: ${cssRules.rules.length}`);
      
      cssRules.rules.forEach((rule, i) => {
        console.log(`    ${i+1}. ${rule.selector} (${rule.source})`);
      });
    } else {
      console.log('  ❌ Accessibility-Grid nicht gefunden');
    }
  }
  
  await browser.close();
  console.log('\n=== ANALYSE ABGESCHLOSSEN ===');
})().catch(console.error);
