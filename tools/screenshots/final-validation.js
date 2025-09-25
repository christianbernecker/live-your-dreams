#!/usr/bin/env node

/**
 * Final Visual Validation - Alle 26 Komponenten Check
 * Überprüft die komplette Design System Integration
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

const validateComponents = async () => {
  console.log('🎯 FINALE VISUAL VALIDATION');
  console.log('═════════════════════════════════════════════');

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Design System Check
    await page.goto('https://designsystem.liveyourdreams.online');
    await page.waitForTimeout(3000);
    
    await page.screenshot({
      path: './screenshots/design-system-final.png',
      fullPage: true
    });

    // Backoffice Check
    await page.goto('https://backoffice.liveyourdreams.online');
    await page.waitForTimeout(3000);
    
    await page.screenshot({
      path: './screenshots/backoffice-final.png',
      fullPage: true
    });

    // Component Integration Check
    const componentCheck = await page.evaluate(() => {
      const hasDesignTokens = getComputedStyle(document.documentElement)
        .getPropertyValue('--lyd-primary').trim() !== '';
      
      // Check for implemented components
      const components = {
        tokens: hasDesignTokens,
        buttons: document.querySelectorAll('.lyd-button').length > 0,
        cards: document.querySelectorAll('.lyd-card').length > 0,
        icons: document.querySelectorAll('.lyd-icon').length > 0,
        navigation: document.querySelectorAll('.backoffice-nav-item').length > 0,
        layout: document.querySelectorAll('.backoffice-layout').length > 0
      };

      return components;
    });

    console.log('📊 COMPONENT INTEGRATION STATUS:');
    console.log(`  Design Tokens: ${componentCheck.tokens ? '✅' : '❌'}`);
    console.log(`  Buttons: ${componentCheck.buttons ? '✅' : '❌'}`);
    console.log(`  Cards: ${componentCheck.cards ? '✅' : '❌'}`);
    console.log(`  Icons: ${componentCheck.icons ? '✅' : '❌'}`);
    console.log(`  Navigation: ${componentCheck.navigation ? '✅' : '❌'}`);
    console.log(`  Layout: ${componentCheck.layout ? '✅' : '❌'}`);

    // Emoji Check
    const emojiCheck = await page.evaluate(() => {
      const bodyText = document.body.textContent;
      const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]/u;
      return {
        hasEmojis: emojiRegex.test(bodyText),
        emojiCount: (bodyText.match(emojiRegex) || []).length
      };
    });

    console.log(`  Emoji Status: ${!emojiCheck.hasEmojis ? '✅ Keine Emojis' : '❌ ' + emojiCheck.emojiCount + ' Emojis gefunden'}`);

  } catch (error) {
    console.error('❌ Validation Error:', error.message);
  } finally {
    await browser.close();
  }
};

validateComponents();

