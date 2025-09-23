const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  
  console.log('📸 Erstelle Screenshots für visuelle Analyse...');
  
  // 1. Neue Button-Seite
  console.log('Screenshot 1: Neue Button-Seite');
  await page.goto('http://designsystem.liveyourdreams.online/components/buttons/');
  await page.waitForTimeout(2000);
  await page.screenshot({ 
    path: 'screenshots/2025-09-22/01-buttons-new.png',
    fullPage: true 
  });
  
  // 2. Accordion-Seite (Vorlage)
  console.log('Screenshot 2: Accordion-Seite (Vorlage)');
  await page.goto('http://designsystem.liveyourdreams.online/components/accordion/');
  await page.waitForTimeout(2000);
  await page.screenshot({ 
    path: 'screenshots/2025-09-22/02-accordion-template.png',
    fullPage: true 
  });
  
  // 3. Inputs-Seite (Vergleich)
  console.log('Screenshot 3: Inputs-Seite (Vergleich)');
  await page.goto('http://designsystem.liveyourdreams.online/components/inputs/');
  await page.waitForTimeout(2000);
  await page.screenshot({ 
    path: 'screenshots/2025-09-22/03-inputs-comparison.png',
    fullPage: true 
  });
  
  // 4. Design Principles Colors (Farbreferenz)
  console.log('Screenshot 4: Design Principles Colors');
  await page.goto('http://designsystem.liveyourdreams.online/design-principles/colors/');
  await page.waitForTimeout(2000);
  await page.screenshot({ 
    path: 'screenshots/2025-09-22/04-colors-reference.png',
    fullPage: true 
  });
  
  console.log('✅ Alle Screenshots erstellt!');
  await browser.close();
})();
