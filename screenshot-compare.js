const { chromium } = require('playwright');

async function captureScreenshots() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();
  
  const components = [
    // Problematische Komponenten
    'buttons',
    'inputs', 
    'select',
    'navbar',
    'tabs',
    // Vergleichskomponenten
    'accordion',
    'modal',
    'dropdown',
    'checkbox',
    'toast'
  ];
  
  const baseUrl = 'http://designsystem.liveyourdreams.online/components/';
  const screenshotDir = '/Users/christianbernecker/live-your-dreams/screenshots/2025-09-22_14-08-55/';
  
  for (const component of components) {
    const url = `${baseUrl}${component}/`;
    console.log(`📸 Screenshot: ${component}`);
    
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000); // Warte auf vollständiges Rendering
    
    // Full page screenshot
    await page.screenshot({ 
      path: `${screenshotDir}${component}-full.png`,
      fullPage: true
    });
    
    // Header/Title Bereich
    const header = await page.$('.page-header, h1');
    if (header) {
      await header.screenshot({ 
        path: `${screenshotDir}${component}-header.png`
      });
    }
    
    // Showcase/Variants Bereich
    const showcase = await page.$('.showcase-grid, .section:first-of-type');
    if (showcase) {
      await showcase.screenshot({ 
        path: `${screenshotDir}${component}-showcase.png`
      });
    }
  }
  
  console.log('✅ Alle Screenshots erstellt!');
  await browser.close();
}

captureScreenshots().catch(console.error);
