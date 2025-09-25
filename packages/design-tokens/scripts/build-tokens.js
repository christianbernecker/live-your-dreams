#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const tokensPath = path.join(__dirname, '../src/tokens.json');
const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));

const distDir = path.join(__dirname, '../dist');
const cssDir = path.join(__dirname, '../css');

if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
if (!fs.existsSync(cssDir)) fs.mkdirSync(cssDir, { recursive: true });

console.log('🎨 Building Design Tokens...');

function flattenTokens(obj, prefix = '') {
  const flattened = {};
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}-${key}` : key;
    if (value && typeof value === 'object' && value.value !== undefined) {
      flattened[newKey] = value.value;
    } else if (value && typeof value === 'object') {
      Object.assign(flattened, flattenTokens(value, newKey));
    }
  }
  return flattened;
}

function generateCSS(tokens) {
  const flattened = flattenTokens(tokens);
  let css = `:root {\n`;
  for (const [key, value] of Object.entries(flattened)) {
    css += `  --lyd-${key}: ${value};\n`;
  }
  css += `}\n`;
  return css;
}

const css = generateCSS(tokens);
fs.writeFileSync(path.join(cssDir, 'tokens.css'), css);
console.log('✅ Generated CSS tokens');

const types = `export const tokens = ${JSON.stringify(flattenTokens(tokens), null, 2)};`;
fs.writeFileSync(path.join(distDir, 'index.ts'), types);
console.log('✅ Generated TS types');

console.log('🎉 Design Tokens build complete!');
