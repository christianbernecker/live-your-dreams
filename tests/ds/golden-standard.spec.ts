import { test, expect } from '@playwright/test';

/**
 * Golden Standard Tests - Definiert SOLL-Zustand basierend auf Screenshots
 * Diese Tests definieren die Referenz, gegen die alle anderen verglichen werden
 */

const BASE_URL = 'http://designsystem.liveyourdreams.online';

test.describe('Golden Standard Definition', () => {
  
  test('Input-Komponente als Accessibility-Referenz', async ({ page }) => {
    await page.goto(`${BASE_URL}/v2/components/inputs/`);
    
    // 1. Page-Title SOLL-Zustand
    const pageTitle = page.locator('main h1');
    await expect(pageTitle).toHaveCSS('text-transform', 'uppercase');
    await expect(pageTitle).toHaveCSS('letter-spacing', '6px');
    await expect(pageTitle).toHaveCSS('font-size', '48px');
    
    // 2. Accessibility-Grid SOLL-Zustand  
    const accessibilityGrid = page.locator('.accessibility-grid');
    await expect(accessibilityGrid).toHaveCSS('display', 'grid');
    await expect(accessibilityGrid).toHaveCSS('grid-template-columns', 'repeat(4, 1fr)');
    await expect(accessibilityGrid).toHaveCSS('background-color', 'rgb(232, 240, 254)'); // var(--lyd-accent)
    
    // 3. Accessibility-Items SOLL-Zustand
    const accessibilityItem = page.locator('.accessibility-item').first();
    await expect(accessibilityItem).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    await expect(accessibilityItem).toHaveCSS('padding', '20px');
    await expect(accessibilityItem).toHaveCSS('border-radius', '6px');
    
    // 4. Checkmarks SOLL-Zustand
    const listItem = page.locator('.accessibility-item li').first();
    const checkmarkColor = await listItem.evaluate(el => {
      const beforeEl = window.getComputedStyle(el, '::before');
      return beforeEl.getPropertyValue('color');
    });
    expect(checkmarkColor).toBe('rgb(51, 102, 204)'); // var(--lyd-royal-blue)
  });
});

test.describe('Consistency Verification Against Golden Standard', () => {
  
  const components = ['buttons', 'cards', 'table', 'accordion', 'typography', 'select'];
  
  for (const component of components) {
    test(`${component} matches Input golden standard`, async ({ page }) => {
      await page.goto(`${BASE_URL}/v2/components/${component}/`);
      
      // Test 1: Page-Title Konsistenz
      const pageTitle = page.locator('main h1');
      await expect(pageTitle).toHaveCSS('text-transform', 'uppercase', {
        timeout: 5000
      });
      await expect(pageTitle).toHaveCSS('letter-spacing', '6px');
      
      // Test 2: Accessibility-Grid Konsistenz
      const accessibilityGrid = page.locator('.accessibility-grid');
      if (await accessibilityGrid.count() > 0) {
        await expect(accessibilityGrid).toHaveCSS('grid-template-columns', 'repeat(4, 1fr)');
        await expect(accessibilityGrid).toHaveCSS('background-color', 'rgb(232, 240, 254)');
        
        // Test 3: Accessibility-Items Konsistenz
        const accessibilityItem = accessibilityGrid.locator('.accessibility-item').first();
        await expect(accessibilityItem).toHaveCSS('background-color', 'rgb(255, 255, 255)');
        await expect(accessibilityItem).toHaveCSS('padding', '20px');
      }
    });
  }
});

test.describe('Detailed CSS Property Verification', () => {
  
  test('Extract and compare exact CSS properties', async ({ page }) => {
    const results = {};
    
    for (const component of ['inputs', 'buttons', 'cards', 'table']) {
      await page.goto(`${BASE_URL}/v2/components/${component}/`);
      
      // Extract exact CSS properties
      const pageTitle = page.locator('main h1');
      const accessibilityGrid = page.locator('.accessibility-grid');
      
      results[component] = {
        pageTitle: await pageTitle.evaluate(el => {
          const cs = window.getComputedStyle(el);
          return {
            'text-transform': cs.getPropertyValue('text-transform'),
            'letter-spacing': cs.getPropertyValue('letter-spacing'),
            'font-size': cs.getPropertyValue('font-size'),
            'color': cs.getPropertyValue('color'),
            'background-color': cs.getPropertyValue('background-color')
          };
        }),
        accessibilityGrid: await accessibilityGrid.evaluate(el => {
          if (!el) return null;
          const cs = window.getComputedStyle(el);
          return {
            'grid-template-columns': cs.getPropertyValue('grid-template-columns'),
            'background-color': cs.getPropertyValue('background-color'),
            'padding': cs.getPropertyValue('padding'),
            'border-radius': cs.getPropertyValue('border-radius')
          };
        })
      };
    }
    
    // Log für Debugging
    console.log('CSS Property Comparison:', JSON.stringify(results, null, 2));
    
    // Verify all match inputs (golden standard)
    const golden = results['inputs'];
    for (const [comp, styles] of Object.entries(results)) {
      if (comp !== 'inputs') {
        expect(styles.pageTitle['text-transform']).toBe(golden.pageTitle['text-transform']);
        expect(styles.pageTitle['letter-spacing']).toBe(golden.pageTitle['letter-spacing']);
        
        if (styles.accessibilityGrid && golden.accessibilityGrid) {
          expect(styles.accessibilityGrid['grid-template-columns']).toBe(golden.accessibilityGrid['grid-template-columns']);
          expect(styles.accessibilityGrid['background-color']).toBe(golden.accessibilityGrid['background-color']);
        }
      }
    }
  });
});
