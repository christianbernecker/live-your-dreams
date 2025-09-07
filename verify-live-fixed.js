const { chromium } = require('playwright');

async function verifyComponent(component) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto(`http://designsystem.liveyourdreams.online/v2/components/${component}/`);
    await page.waitForTimeout(2000);
    
    // 1. Page-Title Test
    const pageTitle = await page.locator('main h1').first().evaluate(el => {
      const cs = window.getComputedStyle(el);
      return {
        textTransform: cs.getPropertyValue('text-transform'),
        letterSpacing: cs.getPropertyValue('letter-spacing')
      };
    });
    
    // 2. Accessibility-Grid Test (korrigiert)
    const accessibilityGrid = await page.locator('.accessibility-grid').first().evaluate(el => {
      const cs = window.getComputedStyle(el);
      const gridCols = cs.getPropertyValue('grid-template-columns');
      
      // Prüfe ob es 4 gleiche Spalten sind (egal ob px oder fr)
      const columns = gridCols.split(' ').filter(col => col.trim());
      const is4Columns = columns.length === 4;
      const areEqual = columns.every(col => Math.abs(parseFloat(col) - parseFloat(columns[0])) < 5);
      
      return {
        display: cs.getPropertyValue('display'),
        gridTemplateColumns: gridCols,
        backgroundColor: cs.getPropertyValue('background-color'),
        is4EqualColumns: is4Columns && areEqual,
        columnCount: columns.length
      };
    });
    
    const titleOK = pageTitle.textTransform === 'uppercase' && pageTitle.letterSpacing === '6px';
    const gridOK = accessibilityGrid.display === 'grid' && accessibilityGrid.is4EqualColumns;
    const bgOK = accessibilityGrid.backgroundColor === 'rgb(232, 240, 254)';
    
    console.log(`${component.toUpperCase()}:`);
    console.log(`  Page-Title: ${titleOK ? '✅' : '❌'} (${pageTitle.textTransform}, ${pageTitle.letterSpacing})`);
    console.log(`  Grid-Display: ${accessibilityGrid.display === 'grid' ? '✅' : '❌'} (${accessibilityGrid.display})`);
    console.log(`  4-Equal-Columns: ${gridOK ? '✅' : '❌'} (${accessibilityGrid.columnCount} cols)`);
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
  console.log('=== KORRIGIERTE LIVE VERIFIKATION ===\n');
  
  const components = ['inputs', 'buttons', 'cards', 'typography', 'table'];
  const results = [];
  
  for (const component of components) {
    const result = await verifyComponent(component);
    results.push(result);
    console.log('');
  }
  
  // Zusammenfassung
  const successful = results.filter(r => r.overall).length;
  const total = results.filter(r => !r.error).length;
  
  console.log('=== FINALE ZUSAMMENFASSUNG ===');
  console.log(`${successful}/${total} Komponenten sind vollständig konsistent`);
  console.log(`Status: ${successful === total ? '✅ PERFEKTE KONSISTENZ' : '❌ VERBESSERUNGEN NÖTIG'}`);
  
  if (successful < total) {
    console.log('\nProblematische Komponenten:');
    results.filter(r => !r.overall && !r.error).forEach(r => {
      console.log(`  - ${r.component}: ${!r.titleOK ? 'Title' : ''} ${!r.gridOK ? 'Grid' : ''} ${!r.bgOK ? 'Background' : ''}`);
    });
  }
})().catch(console.error);
