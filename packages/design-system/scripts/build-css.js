#!/usr/bin/env node
/**
 * Live Your Dreams - Design System CSS Builder
 * 
 * Verarbeitet und optimiert die lokale master.css für Production
 */

const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, '../dist');
const MASTER_CSS_PATH = path.join(DIST_DIR, 'master.css');

console.log('🔧 Building Design System CSS...');

// Ensure dist directory exists
if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

// Check if master.css exists
if (!fs.existsSync(MASTER_CSS_PATH)) {
  console.error('❌ master.css not found! Run "npm run update:master" first.');
  process.exit(1);
}

// Read master.css
const masterCSS = fs.readFileSync(MASTER_CSS_PATH, 'utf8');

// Basic CSS processing (can be extended)
let processedCSS = masterCSS
  // Add build timestamp
  .replace(
    '/* ========================================',
    `/* ========================================
   BUILD INFO: Generated on ${new Date().toISOString()}
   SOURCE: designsystem.liveyourdreams.online
   ======================================== */

/* ========================================`
  );

// Write processed CSS back
fs.writeFileSync(MASTER_CSS_PATH, processedCSS, 'utf8');

// Generate additional CSS files for modular imports
const componentSections = extractComponentSections(masterCSS);

// Write component-specific CSS files
Object.entries(componentSections).forEach(([componentName, css]) => {
  const componentPath = path.join(DIST_DIR, `${componentName}.css`);
  fs.writeFileSync(componentPath, css, 'utf8');
});

console.log(`✅ CSS Build completed!`);
console.log(`📊 Files generated:`);
console.log(`   - master.css (${Math.round(fs.statSync(MASTER_CSS_PATH).size / 1024)}KB)`);
console.log(`   - ${Object.keys(componentSections).length} component CSS files`);

/**
 * Extract component-specific CSS sections
 */
function extractComponentSections(css) {
  const sections = {};
  
  // Define component patterns to extract
  const componentPatterns = {
    'buttons': /\/\* BUTTONS[\s\S]*?(?=\/\* [A-Z]|\s*$)/i,
    'tables': /\/\* TABLES[\s\S]*?(?=\/\* [A-Z]|\s*$)/i,
    'forms': /\/\* FORMS[\s\S]*?(?=\/\* [A-Z]|\s*$)/i,
    'cards': /\/\* CARDS[\s\S]*?(?=\/\* [A-Z]|\s*$)/i,
    'variables': /:root\s*{[\s\S]*?}/g
  };

  Object.entries(componentPatterns).forEach(([name, pattern]) => {
    const matches = css.match(pattern);
    if (matches) {
      sections[name] = matches[0];
    }
  });

  return sections;
}

