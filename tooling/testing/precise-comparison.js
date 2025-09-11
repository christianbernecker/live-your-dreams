const { chromium } = require('playwright');

async function compareComponents(comp1, comp2) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log(`=== PRÄZISER VERGLEICH: ${comp1.toUpperCase()} vs ${comp2.toUpperCase()} ===\n`);
  
  const results = {};
  
  for (const component of [comp1, comp2]) {
    await page.goto(`http://designsystem.liveyourdreams.online/v2/components/${component}/`);
    await page.waitForTimeout(2000);
    
    // 1. Page-Title Analyse
    const pageTitle = await page.locator('main h1').first().evaluate(el => {
      const cs = window.getComputedStyle(el);
      return {
        text: el.textContent,
        textTransform: cs.getPropertyValue('text-transform'),
        letterSpacing: cs.getPropertyValue('letter-spacing'),
        fontSize: cs.getPropertyValue('font-size'),
        fontWeight: cs.getPropertyValue('font-weight'),
        color: cs.getPropertyValue('color'),
        background: cs.getPropertyValue('background')
      };
    });
    
    // 2. Section-Title Analyse (erste Premium-Section)
    const sectionTitle = await page.locator('h2.section-title.premium').first().evaluate(el => {
      const cs = window.getComputedStyle(el);
      return {
        text: el.textContent,
        textTransform: cs.getPropertyValue('text-transform'),
        letterSpacing: cs.getPropertyValue('letter-spacing'),
        fontSize: cs.getPropertyValue('font-size'),
        fontWeight: cs.getPropertyValue('font-weight'),
        color: cs.getPropertyValue('color'),
        background: cs.getPropertyValue('background')
      };
    });
    
    // 3. Logo-Analyse
    const logo = await page.evaluate(() => {
      const logoSvg = document.querySelector('.lyd-logo');
      const designSystemText = document.querySelector('.sidebar-header').textContent;
      return {
        width: logoSvg ? window.getComputedStyle(logoSvg).getPropertyValue('width') : null,
        height: logoSvg ? window.getComputedStyle(logoSvg).getPropertyValue('height') : null,
        hasDesignSystemText: designSystemText.includes('Design System V2')
      };
    });
    
    results[component] = { pageTitle, sectionTitle, logo };
  }
  
  // Vergleich ausgeben
  console.log('PAGE-TITLE VERGLEICH:');
  console.log('=====================');
  for (const [comp, data] of Object.entries(results)) {
    console.log(`${comp.toUpperCase()}:`);
    console.log(`  Text: "${data.pageTitle.text}"`);
    console.log(`  Transform: ${data.pageTitle.textTransform}`);
    console.log(`  Letter-Spacing: ${data.pageTitle.letterSpacing}`);
    console.log(`  Font-Size: ${data.pageTitle.fontSize}`);
    console.log(`  Color: ${data.pageTitle.color}`);
    console.log('');
  }
  
  console.log('SECTION-TITLE VERGLEICH:');
  console.log('========================');
  for (const [comp, data] of Object.entries(results)) {
    console.log(`${comp.toUpperCase()}:`);
    console.log(`  Text: "${data.sectionTitle.text}"`);
    console.log(`  Transform: ${data.sectionTitle.textTransform}`);
    console.log(`  Letter-Spacing: ${data.sectionTitle.letterSpacing}`);
    console.log(`  Background: ${data.sectionTitle.background}`);
    console.log('');
  }
  
  console.log('LOGO VERGLEICH:');
  console.log('===============');
  for (const [comp, data] of Object.entries(results)) {
    console.log(`${comp.toUpperCase()}:`);
    console.log(`  Width: ${data.logo.width}`);
    console.log(`  Height: ${data.logo.height}`);
    console.log(`  Design System Text: ${data.logo.hasDesignSystemText ? '✅' : '❌'}`);
    console.log('');
  }
  
  // Unterschiede identifizieren
  const [comp1Data, comp2Data] = Object.values(results);
  const differences = [];
  
  if (comp1Data.pageTitle.textTransform !== comp2Data.pageTitle.textTransform) {
    differences.push(`Page-Title Transform: ${comp1} (${comp1Data.pageTitle.textTransform}) vs ${comp2} (${comp2Data.pageTitle.textTransform})`);
  }
  
  if (comp1Data.sectionTitle.textTransform !== comp2Data.sectionTitle.textTransform) {
    differences.push(`Section-Title Transform: ${comp1} (${comp1Data.sectionTitle.textTransform}) vs ${comp2} (${comp2Data.sectionTitle.textTransform})`);
  }
  
  if (comp1Data.logo.hasDesignSystemText !== comp2Data.logo.hasDesignSystemText) {
    differences.push(`Design System Text: ${comp1} (${comp1Data.logo.hasDesignSystemText}) vs ${comp2} (${comp2Data.logo.hasDesignSystemText})`);
  }
  
  if (differences.length > 0) {
    console.log('🚨 UNTERSCHIEDE GEFUNDEN:');
    console.log('=========================');
    differences.forEach(diff => console.log(`❌ ${diff}`));
  } else {
    console.log('✅ KEINE UNTERSCHIEDE - PERFEKTE KONSISTENZ!');
  }
  
  await browser.close();
}

(async () => {
  await compareComponents('select', 'modal');
})().catch(console.error);
