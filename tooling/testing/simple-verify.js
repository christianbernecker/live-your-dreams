const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('=== LIVE-VERIFIKATION ===');
  
  // Test Buttons-Komponente
  await page.goto('http://designsystem.liveyourdreams.online/v2/components/buttons/');
  
  // Warte 3 Sekunden für JavaScript-Ausführung
  await page.waitForTimeout(3000);
  
  // 1. Teste Page-Title
  const pageTitle = await page.locator('main h1').first().evaluate(el => {
    const cs = window.getComputedStyle(el);
    return {
      textTransform: cs.getPropertyValue('text-transform'),
      letterSpacing: cs.getPropertyValue('letter-spacing'),
      fontSize: cs.getPropertyValue('font-size')
    };
  });
  
  console.log('Page-Title Styling:');
  console.log(`  text-transform: ${pageTitle.textTransform}`);
  console.log(`  letter-spacing: ${pageTitle.letterSpacing}`);
  console.log(`  font-size: ${pageTitle.fontSize}`);
  
  // 2. Teste Accessibility-Grid
  const accessibilityGrid = await page.locator('.accessibility-grid').first().evaluate(el => {
    const cs = window.getComputedStyle(el);
    return {
      display: cs.getPropertyValue('display'),
      gridTemplateColumns: cs.getPropertyValue('grid-template-columns'),
      backgroundColor: cs.getPropertyValue('background-color')
    };
  });
  
  console.log('\nAccessibility-Grid Styling:');
  console.log(`  display: ${accessibilityGrid.display}`);
  console.log(`  grid-template-columns: ${accessibilityGrid.gridTemplateColumns}`);
  console.log(`  background-color: ${accessibilityGrid.backgroundColor}`);
  
  // 3. Console-Logs prüfen
  const logs = [];
  page.on('console', msg => logs.push(msg.text()));
  
  await page.reload();
  await page.waitForTimeout(2000);
  
  console.log('\nJavaScript Console-Logs:');
  logs.forEach(log => {
    if (log.includes('LYD Design System')) {
      console.log(`  ${log}`);
    }
  });
  
  await browser.close();
  
  // Bewertung
  console.log('\n=== BEWERTUNG ===');
  const titleOK = pageTitle.textTransform === 'uppercase' && pageTitle.letterSpacing === '6px';
  const gridOK = accessibilityGrid.display === 'grid' && accessibilityGrid.gridTemplateColumns.includes('1fr');
  
  console.log(`Page-Title: ${titleOK ? '✅' : '❌'}`);
  console.log(`Accessibility-Grid: ${gridOK ? '✅' : '❌'}`);
  console.log(`Overall: ${titleOK && gridOK ? '✅ KONSISTENT' : '❌ INKONSISTENT'}`);
})().catch(console.error);
