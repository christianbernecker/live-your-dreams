const { chromium } = require('playwright');

async function verifyComponent(component) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto(`http://designsystem.liveyourdreams.online/v2/components/${component}/`);
    await page.waitForTimeout(2000); // Warte auf Laden
    
    // 1. Page-Title Test
    const pageTitle = await page.locator('main h1').first().evaluate(el => {
      const cs = window.getComputedStyle(el);
      return {
        textTransform: cs.getPropertyValue('text-transform'),
        letterSpacing: cs.getPropertyValue('letter-spacing')
      };
    });
    
    // 2. Accessibility-Grid Test
    const accessibilityGrid = await page.locator('.accessibility-grid').first().evaluate(el => {
      const cs = window.getComputedStyle(el);
      return {
        display: cs.getPropertyValue('display'),
        gridTemplateColumns: cs.getPropertyValue('grid-template-columns'),
        backgroundColor: cs.getPropertyValue('background-color')
      };
    });
    
    const titleOK = pageTitle.textTransform === 'uppercase' && pageTitle.letterSpacing === '6px';
    const gridOK = accessibilityGrid.display === 'grid' && accessibilityGrid.gridTemplateColumns.includes('1fr');
    const bgOK = accessibilityGrid.backgroundColor === 'rgb(232, 240, 254)';
    
    console.log(`${component.toUpperCase()}:`);
    console.log(`  Page-Title: ${titleOK ? '✅' : '❌'} (${pageTitle.textTransform}, ${pageTitle.letterSpacing})`);
    console.log(`  Grid-Display: ${gridOK ? '✅' : '❌'} (${accessibilityGrid.display})`);
    console.log(`  Grid-Columns: ${gridOK ? '✅' : '❌'} (${accessibilityGrid.gridTemplateColumns})`);
    console.log(`  Background: ${bgOK ? '✅' : '❌'} (${accessibilityGrid.backgroundColor})`);
    console.log(`  GESAMT: ${titleOK && gridOK && bgOK ? '✅ KONSISTENT' : '❌ INKONSISTENT'}`);
    
    await browser.close();
    return { component, titleOK, gridOK, bgOK, overall: titleOK && gridOK && bgOK };
    
  } catch (error) {
    console.log(`${component.toUpperCase()}: ❌ ERROR - ${error.message}`);
    await browser.close();
    return { component, error: true };
  }
}

(async () => {
  console.log('=== LIVE DESIGN SYSTEM VERIFIKATION ===\n');
  
  const components = ['buttons', 'cards', 'typography'];
  const results = [];
  
  for (const component of components) {
    const result = await verifyComponent(component);
    results.push(result);
    console.log('');
  }
  
  // Zusammenfassung
  const successful = results.filter(r => r.overall).length;
  const total = results.length;
  
  console.log('=== ZUSAMMENFASSUNG ===');
  console.log(`${successful}/${total} Komponenten sind konsistent`);
  console.log(`Status: ${successful === total ? '✅ ALLE KONSISTENT' : '❌ INKONSISTENZEN VORHANDEN'}`);
})().catch(console.error);
