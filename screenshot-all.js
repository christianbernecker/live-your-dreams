const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Erstelle Verzeichnis mit heutigem Datum
  const date = new Date().toISOString().split('T')[0];
  const screenshotDir = path.join(__dirname, 'screenshots', date);
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }
  
  // Liste der migrierten Komponenten
  const components = ['accordion', 'modal', 'dropdown'];
  
  for (const component of components) {
    const filePath = path.join(__dirname, 'design-system/v2/components', component, 'index.html');
    
    // Öffne lokale Datei
    await page.goto('file://' + filePath);
    
    // Warte auf Laden
    await page.waitForTimeout(1000);
    
    // Screenshot
    await page.screenshot({ 
      path: path.join(screenshotDir, `${component}-migrated.png`),
      fullPage: true 
    });
    
    console.log(`Screenshot gespeichert: ${component}-migrated.png`);
  }
  
  await browser.close();
})();
