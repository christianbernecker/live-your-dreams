#!/usr/bin/env node
/**
 * Live Your Dreams - Design System TypeScript Definitions Builder
 * 
 * Generiert TypeScript Definitionen basierend auf der CSS-Struktur
 */

const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, '../dist');
const MASTER_CSS_PATH = path.join(DIST_DIR, 'master.css');

console.log('🔧 Building TypeScript definitions...');

// Read master.css to extract class names
const masterCSS = fs.readFileSync(MASTER_CSS_PATH, 'utf8');

// Extract all CSS class names
const classNames = extractClassNames(masterCSS);

// Generate TypeScript definitions
const typeDefinitions = generateTypeDefinitions(classNames);

// Write TypeScript definition file
const indexDtsPath = path.join(DIST_DIR, 'index.d.ts');
fs.writeFileSync(indexDtsPath, typeDefinitions, 'utf8');

// Generate JavaScript export file
const indexJsContent = `
/**
 * Live Your Dreams Design System - JavaScript Exports
 */

// CSS Classes
export const cssClasses = ${JSON.stringify(classNames, null, 2)};

// Component mappings
export const components = {
  button: ['lyd-button', 'primary', 'secondary', 'outline', 'ghost'],
  table: ['lyd-table', 'striped', 'bordered'],
  card: ['lyd-card', 'elevated'],
  input: ['lyd-input'],
  badge: ['table-badge', 'status-active', 'status-inactive']
};

// Export CSS path for bundler imports
export const cssPath = './master.css';
`;

const indexJsPath = path.join(DIST_DIR, 'index.js');
fs.writeFileSync(indexJsPath, indexJsContent, 'utf8');

console.log(`✅ TypeScript definitions generated!`);
console.log(`📊 Generated:`);
console.log(`   - index.d.ts with ${classNames.length} CSS classes`);
console.log(`   - index.js with JavaScript exports`);

/**
 * Extract CSS class names from CSS content
 */
function extractClassNames(css) {
  const classNamePattern = /\.([a-zA-Z][\w-]*)/g;
  const matches = [];
  let match;

  while ((match = classNamePattern.exec(css)) !== null) {
    const className = match[1];
    // Filter out pseudo-classes and states
    if (!className.includes(':') && !matches.includes(className)) {
      matches.push(className);
    }
  }

  return matches.sort();
}

/**
 * Generate TypeScript definitions
 */
function generateTypeDefinitions(classNames) {
  return `/**
 * Live Your Dreams Design System - TypeScript Definitions
 * Generated automatically from CSS classes
 */

// CSS Class Names
export type LydCSSClass = ${classNames.map(name => `'${name}'`).join(' | ')};

// Component Variants
export interface ButtonVariants {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
  size?: 'small' | 'default' | 'large' | 'icon-only';
}

export interface TableVariants {
  variant?: 'default' | 'striped' | 'bordered';
  size?: 'small' | 'default' | 'large';
}

export interface CardVariants {
  variant?: 'default' | 'elevated' | 'outlined';
}

export interface BadgeVariants {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

// Design System Exports
export declare const cssClasses: string[];
export declare const components: Record<string, string[]>;
export declare const cssPath: string;

// CSS Module Declaration
declare module '*.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// Master CSS Declaration
declare module '@lyd/design-system/css' {
  const css: string;
  export default css;
}
`;
}

