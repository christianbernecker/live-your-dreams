#!/usr/bin/env node
import { StdioServer, Tool } from '@modelcontextprotocol/sdk/server/stdio.js';
import { err, ok } from '@modelcontextprotocol/sdk/shared/protocol.js';
import { existsSync, readFileSync } from 'fs';
import { glob } from 'glob';
import path from 'path';

const server = new StdioServer({ name: 'docs-mcp', version: '0.1.0' });

// Simple markdown parser for search
function parseMarkdown(content) {
  const sections = [];
  const lines = content.split('\n');
  let currentSection = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Headers
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headerMatch) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        level: headerMatch[1].length,
        title: headerMatch[2],
        content: '',
        lineStart: i + 1
      };
      continue;
    }
    
    // Content
    if (currentSection) {
      currentSection.content += line + '\n';
    }
  }
  
  if (currentSection) {
    sections.push(currentSection);
  }
  
  return sections;
}

function searchInContent(content, query) {
  const queryLower = query.toLowerCase();
  const sections = parseMarkdown(content);
  const matches = [];
  
  for (const section of sections) {
    const titleMatch = section.title.toLowerCase().includes(queryLower);
    const contentMatch = section.content.toLowerCase().includes(queryLower);
    
    if (titleMatch || contentMatch) {
      // Find exact line matches
      const lines = section.content.split('\n');
      const matchingLines = lines
        .map((line, idx) => ({ line, number: section.lineStart + idx }))
        .filter(({ line }) => line.toLowerCase().includes(queryLower));
      
      matches.push({
        section: section.title,
        level: section.level,
        titleMatch,
        matchingLines: matchingLines.slice(0, 3), // limit results
        excerpt: section.content.substring(0, 200) + '...'
      });
    }
  }
  
  return matches;
}

server.tool(
  new Tool(
    'searchDocs',
    'Durchsucht die Dokumentation nach einem Begriff',
    {
      type: 'object',
      properties: {
        query: { type: 'string' },
        paths: { 
          type: 'array', 
          items: { type: 'string' },
          default: ['docs/**/*.md', 'README.md', '**/README.md']
        }
      },
      required: ['query']
    },
    async ({ query, paths = ['docs/**/*.md', 'README.md', '**/README.md'] }) => {
      try {
        const results = [];
        
        for (const pattern of paths) {
          const files = glob.sync(pattern, { 
            ignore: ['**/node_modules/**', '**/.git/**']
          });
          
          for (const file of files) {
            if (existsSync(file)) {
              const content = readFileSync(file, 'utf8');
              const matches = searchInContent(content, query);
              
              if (matches.length > 0) {
                results.push({
                  file,
                  matches
                });
              }
            }
          }
        }
        
        return ok(JSON.stringify({
          query,
          totalFiles: results.length,
          totalMatches: results.reduce((sum, r) => sum + r.matches.length, 0),
          results
        }, null, 2));
      } catch (error) {
        return err(error.message);
      }
    }
  )
);

server.tool(
  new Tool(
    'getDoc',
    'Holt den vollständigen Inhalt einer Dokumentationsdatei',
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
        const sections = parseMarkdown(content);
        
        return ok(JSON.stringify({
          file: filePath,
          content,
          sections: sections.map(s => ({
            level: s.level,
            title: s.title,
            lineStart: s.lineStart
          }))
        }, null, 2));
      } catch (error) {
        return err(error.message);
      }
    }
  )
);

server.tool(
  new Tool(
    'listDocs',
    'Listet alle verfügbaren Dokumentationsdateien auf',
    {
      type: 'object',
      properties: {
        paths: { 
          type: 'array', 
          items: { type: 'string' },
          default: ['docs/**/*.md', 'README.md', '**/README.md']
        }
      }
    },
    async ({ paths = ['docs/**/*.md', 'README.md', '**/README.md'] }) => {
      try {
        const allFiles = [];
        
        for (const pattern of paths) {
          const files = glob.sync(pattern, { 
            ignore: ['**/node_modules/**', '**/.git/**']
          });
          
          for (const file of files) {
            if (existsSync(file)) {
              const content = readFileSync(file, 'utf8');
              const firstLine = content.split('\n')[0];
              const title = firstLine.startsWith('#') 
                ? firstLine.replace(/^#+\s*/, '') 
                : path.basename(file, '.md');
              
              allFiles.push({
                path: file,
                title,
                size: content.length
              });
            }
          }
        }
        
        return ok(JSON.stringify({
          totalFiles: allFiles.length,
          files: allFiles.sort((a, b) => a.path.localeCompare(b.path))
        }, null, 2));
      } catch (error) {
        return err(error.message);
      }
    }
  )
);

server.run();

