const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('Navigiere zu Buttons-Komponente...');
  await page.goto('http://designsystem.liveyourdreams.online/components/buttons/', { 
    waitUntil: 'networkidle' 
  });
  
  // Warte auf API Reference Section
  await page.waitForSelector('h2:has-text("API Reference")', { timeout: 10000 });
  
  // Scrolle zur API Reference
  await page.locator('h2:has-text("API Reference")').scrollIntoViewIfNeeded();
  
  // Screenshot der gesamten Seite
  await page.screenshot({ 
    path: 'buttons-full-page.png',
    fullPage: true 
  });
  
  // Screenshot nur der API Reference Section
  const apiSection = page.locator('section:has(h2:has-text("API Reference"))');
  await apiSection.screenshot({ 
    path: 'buttons-api-reference.png' 
  });
  
  console.log('Screenshots erstellt:');
  console.log('- buttons-full-page.png (Gesamte Seite)');
  console.log('- buttons-api-reference.png (Nur API Reference)');
  
  await browser.close();
})();
