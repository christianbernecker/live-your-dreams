const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Erstelle Verzeichnis mit heutigem Datum
  const date = new Date().toISOString().split('T')[0];
  const screenshotDir = path.join(__dirname, 'screenshots', date);
  const fs = require('fs');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }
  
  // Öffne lokale Datei
  await page.goto('file://' + path.join(__dirname, 'design-system/v2/components/modal/index.html'));
  
  // Warte auf Laden
  await page.waitForTimeout(1000);
  
  // Screenshot
  await page.screenshot({ 
    path: path.join(screenshotDir, 'modal.png'),
    fullPage: true 
  });
  
  console.log(`Screenshot gespeichert: ${path.join(screenshotDir, 'modal.png')}`);
  
  await browser.close();
})();
