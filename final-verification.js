const { chromium } = require('playwright');

async function visuallyVerifyComponent(component) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto(`http://designsystem.liveyourdreams.online/v2/components/${component}/`);
    await page.waitForTimeout(3000); // Warte auf vollständiges Laden
    
    // 1. Page-Title Test
    const pageTitle = await page.locator('main h1').first().evaluate(el => {
      const cs = window.getComputedStyle(el);
      return {
        textTransform: cs.getPropertyValue('text-transform'),
        letterSpacing: cs.getPropertyValue('letter-spacing'),
        fontSize: cs.getPropertyValue('font-size')
      };
    });
    
    // 2. Accessibility-Grid Test
    const accessibilityGrid = await page.locator('.accessibility-grid').first().evaluate(el => {
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      const gridCols = cs.getPropertyValue('grid-template-columns');
      
      // Prüfe ob es 4 Spalten sind
      const columns = gridCols.split(' ').filter(col => col.trim());
      const is4Columns = columns.length === 4;
      
      return {
        display: cs.getPropertyValue('display'),
        gridTemplateColumns: gridCols,
        backgroundColor: cs.getPropertyValue('background-color'),
        is4Columns: is4Columns,
        columnCount: columns.length
      };
    });
    
    // 3. Accessibility-Item Test
    const accessibilityItem = await page.locator('.accessibility-item').first().evaluate(el => {
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      return {
        backgroundColor: cs.getPropertyValue('background-color'),
        padding: cs.getPropertyValue('padding'),
        borderRadius: cs.getPropertyValue('border-radius')
      };
    });
    
    // 4. Checkmark Test
    const checkmarkColor = await page.locator('.accessibility-item li').first().evaluate(el => {
      if (!el) return null;
      const beforeEl = window.getComputedStyle(el, '::before');
      return beforeEl.getPropertyValue('color');
    });
    
    const titleOK = pageTitle.textTransform === 'uppercase' && pageTitle.letterSpacing === '6px';
    const gridOK = accessibilityGrid && accessibilityGrid.display === 'grid' && accessibilityGrid.is4Columns;
    const bgOK = accessibilityGrid && accessibilityGrid.backgroundColor === 'rgb(232, 240, 254)';
    const itemOK = accessibilityItem && accessibilityItem.backgroundColor === 'rgb(255, 255, 255)';
    const checkmarkOK = checkmarkColor === 'rgb(51, 102, 204)';
    
    const overall = titleOK && gridOK && bgOK && itemOK && checkmarkOK;
    
    console.log(`${component.toUpperCase()}:`);
    console.log(`  ✅ Page-Title: ${titleOK ? '✅' : '❌'} (${pageTitle.textTransform}, ${pageTitle.letterSpacing})`);
    console.log(`  ✅ Grid-Display: ${accessibilityGrid?.display === 'grid' ? '✅' : '❌'} (${accessibilityGrid?.display})`);
    console.log(`  ✅ 4-Columns: ${gridOK ? '✅' : '❌'} (${accessibilityGrid?.columnCount} cols)`);
    console.log(`  ✅ Grid-Background: ${bgOK ? '✅' : '❌'} (${accessibilityGrid?.backgroundColor})`);
    console.log(`  ✅ Item-Background: ${itemOK ? '✅' : '❌'} (${accessibilityItem?.backgroundColor})`);
    console.log(`  ✅ Blue-Checkmarks: ${checkmarkOK ? '✅' : '❌'} (${checkmarkColor})`);
    console.log(`  🎯 GESAMT: ${overall ? '✅ GOLD STANDARD ERREICHT' : '❌ INKONSISTENT'}`);
    
    await browser.close();
    return { component, overall, details: { titleOK, gridOK, bgOK, itemOK, checkmarkOK } };
    
  } catch (error) {
    console.log(`${component.toUpperCase()}: ❌ ERROR - ${error.message}`);
    await browser.close();
    return { component, error: true };
  }
}

(async () => {
  console.log('=== FINALE VISUELLE VERIFIKATION ALLER LIVE-URLS ===\n');
  
  const components = ['inputs', 'cards', 'typography', 'buttons', 'select', 'accordion', 'table', 'modal'];
  const results = [];
  
  for (const component of components) {
    const result = await visuallyVerifyComponent(component);
    results.push(result);
    console.log('');
  }
  
  // Finale Zusammenfassung
  const successful = results.filter(r => r.overall).length;
  const total = results.filter(r => !r.error).length;
  const percentage = Math.round((successful / total) * 100);
  
  console.log('=== FINALE ZUSAMMENFASSUNG ===');
  console.log(`${successful}/${total} Komponenten erreichen Gold Standard (${percentage}%)`);
  console.log(`Status: ${successful === total ? '🎉 ALLE KOMPONENTEN KONSISTENT!' : '⚠️ NOCH INKONSISTENZEN'}`);
  
  if (successful < total) {
    console.log('\n❌ Problematische Komponenten:');
    results.filter(r => !r.overall && !r.error).forEach(r => {
      const issues = [];
      if (!r.details.titleOK) issues.push('Title');
      if (!r.details.gridOK) issues.push('Grid');
      if (!r.details.bgOK) issues.push('Background');
      if (!r.details.itemOK) issues.push('Items');
      if (!r.details.checkmarkOK) issues.push('Checkmarks');
      console.log(`  - ${r.component}: ${issues.join(', ')}`);
    });
  } else {
    console.log('\n🎯 PERFEKTE KONSISTENZ ERREICHT!');
    console.log('Alle Komponenten entsprechen dem Gold Standard.');
  }
})().catch(console.error);
