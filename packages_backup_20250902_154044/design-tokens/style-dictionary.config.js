const StyleDictionary = require('style-dictionary');

// Live Your Dreams Design System v2.0
// Complete Design Token System inspired by Automotive-Grade Quality

// Custom Transform für LYD CSS Custom Properties
StyleDictionary.registerTransform({
  name: 'name/lyd/css-var',
  type: 'name',
  matcher: function(token) {
    return true;
  },
  transformer: function(token) {
    return '--lyd-' + token.path.join('-');
  }
});

// Custom Format für CSS Custom Properties
StyleDictionary.registerFormat({
  name: 'css/lyd-variables',
  formatter: function({ dictionary, options }) {
    const header = `/*
Live Your Dreams Design System v2.0
Automotive-Grade Design Tokens for Real Estate Excellence

Generated: ${new Date().toISOString()}
Total Tokens: ${dictionary.allTokens.length}
Categories: Colors, Typography, Spacing, Effects, Motion

Usage:
  .my-component {
    color: var(--lyd-color-brand-primary-600);
    padding: var(--lyd-spacing-4);
    border-radius: var(--lyd-border-radius-lg);
    transition: all var(--lyd-transition-duration-normal) var(--lyd-transition-timing-premium-out);
  }

Documentation: https://designsystem.liveyourdreams.de
Repository: https://github.com/christianbernecker/live-your-dreams
*/`;

    const variables = dictionary.allTokens
      .map(token => `  ${token.name}: ${token.value};`)
      .join('\n');

    return `${header}\n\n:root {\n${variables}\n}\n\n/* Component-specific CSS Custom Properties */\n:root {\n  /* Component Heights */\n  --lyd-component-height-xs: var(--lyd-size-component-height-xs);\n  --lyd-component-height-sm: var(--lyd-size-component-height-sm);\n  --lyd-component-height-md: var(--lyd-size-component-height-md);\n  --lyd-component-height-lg: var(--lyd-size-component-height-lg);\n  --lyd-component-height-xl: var(--lyd-size-component-height-xl);\n  --lyd-component-height-2xl: var(--lyd-size-component-height-2xl);\n  \n  /* Icon Sizes */\n  --lyd-icon-size-xs: var(--lyd-size-component-icon-xs);\n  --lyd-icon-size-sm: var(--lyd-size-component-icon-sm);\n  --lyd-icon-size-md: var(--lyd-size-component-icon-md);\n  --lyd-icon-size-lg: var(--lyd-size-component-icon-lg);\n  --lyd-icon-size-xl: var(--lyd-size-component-icon-xl);\n  --lyd-icon-size-2xl: var(--lyd-size-component-icon-2xl);\n  \n  /* Container Sizes */\n  --lyd-container-xs: var(--lyd-size-container-xs);\n  --lyd-container-sm: var(--lyd-size-container-sm);\n  --lyd-container-md: var(--lyd-size-container-md);\n  --lyd-container-lg: var(--lyd-size-container-lg);\n  --lyd-container-xl: var(--lyd-size-container-xl);\n  --lyd-container-2xl: var(--lyd-size-container-2xl);\n  --lyd-container-3xl: var(--lyd-size-container-3xl);\n  --lyd-container-4xl: var(--lyd-size-container-4xl);\n  --lyd-container-5xl: var(--lyd-size-container-5xl);\n  --lyd-container-6xl: var(--lyd-size-container-6xl);\n  --lyd-container-7xl: var(--lyd-size-container-7xl);\n}\n`;
  }
});

// SCSS Variables Format
StyleDictionary.registerFormat({
  name: 'scss/lyd-variables',
  formatter: function({ dictionary }) {
    const header = `//
// Live Your Dreams Design System v2.0 - SCSS Variables
// Generated: ${new Date().toISOString()}
//`;

    const variables = dictionary.allTokens
      .map(token => `$lyd-${token.path.join('-')}: ${token.value};`)
      .join('\n');

    return `${header}\n\n${variables}\n`;
  }
});

// JavaScript/TypeScript Export Format
StyleDictionary.registerFormat({
  name: 'javascript/lyd-tokens',
  formatter: function({ dictionary }) {
    const header = `/**
 * Live Your Dreams Design System v2.0 - Design Tokens
 * Generated: ${new Date().toISOString()}
 * 
 * @description Complete design token system for LYD applications
 * @version 2.0.0
 */`;

    const tokens = dictionary.allTokens.reduce((acc, token) => {
      const path = token.path;
      let current = acc;
      
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) {
          current[path[i]] = {};
        }
        current = current[path[i]];
      }
      
      current[path[path.length - 1]] = token.value;
      return acc;
    }, {});

    return `${header}\n\nexport const LYDTokens = ${JSON.stringify(tokens, null, 2)};\n\nexport default LYDTokens;\n`;
  }
});

// Live Your Dreams Design System Configuration
module.exports = {
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      transforms: ['name/lyd/css-var', 'attribute/cti', 'time/seconds', 'content/icon', 'size/rem', 'color/css'],
      buildPath: 'dist/css/',
      files: [
        {
          destination: 'lyd-tokens.css',
          format: 'css/lyd-variables',
          options: {
            outputReferences: true
          }
        }
      ]
    },
    
    scss: {
      transformGroup: 'scss',
      transforms: ['name/cti/kebab', 'attribute/cti', 'time/seconds', 'size/rem', 'color/css'],
      buildPath: 'dist/scss/',
      files: [
        {
          destination: '_lyd-tokens.scss',
          format: 'scss/lyd-variables',
          options: {
            outputReferences: true
          }
        }
      ]
    },
    
    js: {
      transformGroup: 'js',
      buildPath: 'dist/js/',
      files: [
        {
          destination: 'lyd-tokens.js',
          format: 'javascript/lyd-tokens'
        }
      ]
    },
    
    ts: {
      transformGroup: 'js',
      buildPath: 'dist/ts/',
      files: [
        {
          destination: 'lyd-tokens.d.ts',
          format: 'typescript/es6-declarations'
        }
      ]
    },
    
    json: {
      transformGroup: 'web',
      buildPath: 'dist/json/',
      files: [
        {
          destination: 'lyd-tokens.json',
          format: 'json/nested'
        }
      ]
    }
  }
};

console.log('🚀 Building Live Your Dreams Design System v2.0...');
console.log('🎯 Automotive-Grade Quality for Real Estate Excellence');
console.log('📦 Complete Token System with 300+ Design Tokens');