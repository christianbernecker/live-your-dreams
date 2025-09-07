import { test, expect } from '@playwright/test';

/**
 * JavaScript-Konsistenz Tests
 * Testet ob die force-consistency.js korrekt funktioniert
 */

const BASE_URL = 'http://designsystem.liveyourdreams.online';

test.describe('JavaScript-basierte Konsistenz', () => {
  
  const components = ['buttons', 'cards', 'table', 'accordion', 'typography', 'select', 'inputs', 'modal'];
  
  for (const component of components) {
    test(`${component} - JavaScript-Konsistenz`, async ({ page }) => {
      await page.goto(`${BASE_URL}/v2/components/${component}/`);
      
      // Warte auf JavaScript-Ausführung
      await page.waitForFunction(() => {
        const grid = document.querySelector('.accessibility-grid');
        return grid && window.getComputedStyle(grid).display === 'grid';
      }, { timeout: 10000 });
      
      // Console-Log für Debugging
      await page.evaluate(() => {
        console.log('🎯 Testing JavaScript consistency on', window.location.pathname);
      });
      
      // Test 1: Accessibility-Grid
      const accessibilityGrid = page.locator('.accessibility-grid').first();
      await expect(accessibilityGrid).toHaveCSS('display', 'grid');
      await expect(accessibilityGrid).toHaveCSS('grid-template-columns', /repeat\(4,\s*1fr\)/);
      await expect(accessibilityGrid).toHaveCSS('background-color', 'rgb(232, 240, 254)');
      
      // Test 2: Accessibility-Items
      const accessibilityItem = page.locator('.accessibility-item').first();
      await expect(accessibilityItem).toHaveCSS('background-color', 'rgb(255, 255, 255)');
      await expect(accessibilityItem).toHaveCSS('padding', '20px');
      
      // Test 3: Page-Title
      const pageTitle = page.locator('main h1').first();
      await expect(pageTitle).toHaveCSS('text-transform', 'uppercase');
      await expect(pageTitle).toHaveCSS('letter-spacing', '6px');
      
      console.log(`✅ ${component} - JavaScript-Konsistenz erfolgreich`);
    });
  }
  
  test('JavaScript-Loading Verifikation', async ({ page }) => {
    await page.goto(`${BASE_URL}/v2/components/buttons/`);
    
    // Prüfe ob JavaScript-Datei geladen wird
    const jsLoaded = await page.evaluate(() => {
      return new Promise(resolve => {
        const script = document.querySelector('script[src*="force-consistency.js"]');
        if (script) {
          script.addEventListener('load', () => resolve(true));
          script.addEventListener('error', () => resolve(false));
          // Falls bereits geladen
          if (script.readyState === 'complete') resolve(true);
        } else {
          resolve(false);
        }
        // Timeout nach 5 Sekunden
        setTimeout(() => resolve(false), 5000);
      });
    });
    
    expect(jsLoaded).toBe(true);
    
    // Prüfe ob Console-Log vorhanden ist
    const logs = [];
    page.on('console', msg => logs.push(msg.text()));
    
    await page.reload();
    await page.waitForTimeout(2000);
    
    const hasConsistencyLog = logs.some(log => log.includes('LYD Design System: Consistent styling applied'));
    expect(hasConsistencyLog).toBe(true);
  });
});
