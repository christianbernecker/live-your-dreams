#!/usr/bin/env node

/**
 * Quick Visual Test - Design System Compliance Check
 * Überprüft die aktuelle Live-Version auf Design System Integration
 */

const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false }); // Für Debugging sichtbar
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Checking Live Backoffice...');
    
    // Gehe zur Live-URL
    await page.goto('https://backoffice.liveyourdreams.online/login');
    await page.waitForTimeout(3000);
    
    // Screenshot der Login-Seite
    await page.screenshot({
      path: './screenshots/current-login.png',
      fullPage: true
    });
    
    console.log('📸 Login Screenshot: ./screenshots/current-login.png');
    
    // Überprüfe Emoji Verwendung
    const emojiCheck = await page.evaluate(() => {
      const bodyText = document.body.textContent;
      const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
      const hasEmojis = emojiRegex.test(bodyText);
      
      // Design System CSS Check
      const computedStyle = getComputedStyle(document.documentElement);
      const hasDesignTokens = computedStyle.getPropertyValue('--lyd-primary').trim() !== '';
      
      return {
        hasEmojis,
        hasDesignTokens,
        lydPrimary: computedStyle.getPropertyValue('--lyd-primary').trim()
      };
    });
    
    console.log('🔍 Compliance Check:');
    console.log(`  Emojis Found: ${emojiCheck.hasEmojis ? '❌' : '✅'}`);
    console.log(`  Design Tokens: ${emojiCheck.hasDesignTokens ? '✅' : '❌'}`);
    console.log(`  LYD Primary: ${emojiCheck.lydPrimary}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();

