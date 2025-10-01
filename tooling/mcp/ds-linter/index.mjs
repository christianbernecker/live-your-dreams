#!/usr/bin/env node
import { StdioServer, Tool } from '@modelcontextprotocol/sdk/server/stdio.js';
import { err, ok } from '@modelcontextprotocol/sdk/shared/protocol.js';
import { existsSync, readFileSync } from 'fs';
import { glob } from 'glob';

const server = new StdioServer({ name: 'ds-linter-mcp', version: '0.1.0' });

// Design System Violations Detection
const DS_VIOLATIONS = {
  hardcodedColors: /(?:color|background(?:-color)?|border(?:-color)?)\s*:\s*(?:#[0-9a-f]{3,6}|rgb|rgba|hsl|hsla)/gi,
  hardcodedSizes: /(?:width|height|padding|margin|font-size|gap|border-radius)\s*:\s*\d+(?:px|rem|em)/gi,
  inlineStyles: /style\s*=\s*["'][^"']*["']/gi,
  nativeElements: /<(?:button|input|select|textarea|table|form)(?!\s+className=["'][^"']*lyd-)/gi,
  nonDSClasses: /className\s*=\s*["'](?![^"']*lyd-)[^"']+["']/gi,
  hardcodedBoxShadow: /box-shadow\s*:\s*[^;]+/gi
};

function checkFile(content, filePath) {
  const violations = [];
  
  for (const [type, regex] of Object.entries(DS_VIOLATIONS)) {
    const matches = [...content.matchAll(regex)];
    for (const match of matches) {
      const lines = content.substring(0, match.index).split('\n');
      const line = lines.length;
      const column = lines[lines.length - 1].length + 1;
      
      violations.push({
        type,
        line,
        column,
        text: match[0],
        file: filePath
      });
    }
  }
  
  return violations;
}

server.tool(
  new Tool(
    'scanDesignSystemViolations',
    'Scannt das Projekt nach Design System Verstößen',
    {
      type: 'object',
      properties: {
        paths: { 
          type: 'array', 
          items: { type: 'string' },
          default: ['apps/backoffice/**/*.{tsx,ts,jsx,js}', '!**/node_modules/**']
        },
        severity: { type: 'string', enum: ['error', 'warning', 'info'], default: 'error' }
      }
    },
    async ({ paths = ['apps/backoffice/**/*.{tsx,ts,jsx,js}'], severity = 'error' }) => {
      try {
        const allViolations = [];
        
        for (const pattern of paths) {
          if (pattern.startsWith('!')) continue; // skip negated patterns
          
          const files = glob.sync(pattern, { 
            ignore: ['**/node_modules/**', '**/.next/**', '**/dist/**']
          });
          
          for (const file of files) {
            if (existsSync(file)) {
              const content = readFileSync(file, 'utf8');
              const violations = checkFile(content, file);
              allViolations.push(...violations);
            }
          }
        }
        
        const report = {
          summary: {
            totalFiles: new Set(allViolations.map(v => v.file)).size,
            totalViolations: allViolations.length,
            violationTypes: Object.keys(
              allViolations.reduce((acc, v) => ({ ...acc, [v.type]: true }), {})
            )
          },
          violations: allViolations,
          severity
        };
        
        return ok(JSON.stringify(report, null, 2));
      } catch (error) {
        return err(error.message);
      }
    }
  )
);

server.tool(
  new Tool(
    'checkSingleFile',
    'Prüft eine einzelne Datei auf DS-Verstöße',
    {
      type: 'object',
      properties: {
        filePath: { type: 'string' }
      },
      required: ['filePath']
    },
    async ({ filePath }) => {
      try {
        if (!existsSync(filePath)) {
          return err(`File not found: ${filePath}`);
        }
        
        const content = readFileSync(filePath, 'utf8');
        const violations = checkFile(content, filePath);
        
        return ok(JSON.stringify({
          file: filePath,
          violationCount: violations.length,
          violations
        }, null, 2));
      } catch (error) {
        return err(error.message);
      }
    }
  )
);

server.tool(
  new Tool(
    'generateFixSuggestions',
    'Generiert Korrekturvorschläge für DS-Verstöße',
    {
      type: 'object',
      properties: {
        violationType: { 
          type: 'string', 
          enum: ['hardcodedColors', 'hardcodedSizes', 'inlineStyles', 'nativeElements', 'nonDSClasses', 'hardcodedBoxShadow']
        }
      },
      required: ['violationType']
    },
    async ({ violationType }) => {
      const suggestions = {
        hardcodedColors: [
          'Verwende CSS-Variablen: var(--lyd-primary), var(--lyd-secondary)',
          'Nutze DS-Farbklassen: .lyd-text-primary, .lyd-bg-secondary'
        ],
        hardcodedSizes: [
          'Verwende DS-Spacing: var(--spacing-sm), var(--spacing-md)',
          'Nutze DS-Größenklassen: .lyd-p-4, .lyd-text-lg'
        ],
        inlineStyles: [
          'Ersetze durch DS-Klassen oder CSS-Module',
          'Nutze styled-components mit DS-Tokens'
        ],
        nativeElements: [
          'Ersetze <button> durch <Button> Wrapper',
          'Nutze DS-Komponenten: Input, Select, Textarea'
        ],
        nonDSClasses: [
          'Verwende nur lyd-* Klassen',
          'Prüfe Design System Dokumentation für passende Klassen'
        ],
        hardcodedBoxShadow: [
          'Verwende DS-Schatten: var(--shadow-sm), var(--shadow-lg)',
          'Nutze DS-Elevation-Klassen: .lyd-elevated, .lyd-shadow'
        ]
      };
      
      return ok(JSON.stringify({
        type: violationType,
        suggestions: suggestions[violationType] || ['Prüfe Design System Dokumentation']
      }, null, 2));
    }
  )
);

server.run();

