#!/usr/bin/env node

/**
 * Prisma MCP Server
 * 
 * Provides Prisma CLI operations via Model Context Protocol
 * - Schema management
 * - Migrations
 * - Database operations
 * - Type generation
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const BACKOFFICE_DIR = join(__dirname, '../../../apps/backoffice');

/**
 * Execute Prisma command in backoffice directory
 */
async function executePrismaCommand(command, args = []) {
  try {
    const fullCommand = `cd ${BACKOFFICE_DIR} && npx prisma ${command} ${args.join(' ')}`;
    const { stdout, stderr } = await execAsync(fullCommand, {
      env: { ...process.env }
    });
    
    return {
      success: true,
      stdout,
      stderr,
      command: fullCommand
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      stdout: error.stdout,
      stderr: error.stderr,
      command: `cd ${BACKOFFICE_DIR} && npx prisma ${command} ${args.join(' ')}`
    };
  }
}

/**
 * Parse Prisma output for user-friendly response
 */
function formatPrismaOutput(result) {
  if (!result.success) {
    return `[ERROR] ${result.error}\n\nStderr: ${result.stderr}`;
  }
  
  return `[SUCCESS]\n\nOutput:\n${result.stdout}`;
}

// Initialize MCP Server
const server = new Server(
  {
    name: 'prisma-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'prisma_generate',
        description: 'Generate Prisma Client based on schema',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'prisma_migrate_dev',
        description: 'Create and apply migration in development',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Migration name',
            },
          },
          required: ['name'],
        },
      },
      {
        name: 'prisma_migrate_status',
        description: 'Check migration status',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'prisma_db_push',
        description: 'Push schema to database (no migration)',
        inputSchema: {
          type: 'object',
          properties: {
            accept_data_loss: {
              type: 'boolean',
              description: 'Accept potential data loss',
              default: false,
            },
          },
        },
      },
      {
        name: 'prisma_db_pull',
        description: 'Pull schema from database (introspect)',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'prisma_studio',
        description: 'Get Prisma Studio URL (runs on port 5555)',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'prisma_format',
        description: 'Format Prisma schema file',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'prisma_validate',
        description: 'Validate Prisma schema',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'prisma_generate': {
        const result = await executePrismaCommand('generate');
        return {
          content: [
            {
              type: 'text',
              text: formatPrismaOutput(result),
            },
          ],
        };
      }

      case 'prisma_migrate_dev': {
        const migrationName = args.name;
        const result = await executePrismaCommand('migrate', [
          'dev',
          '--name',
          migrationName,
        ]);
        return {
          content: [
            {
              type: 'text',
              text: formatPrismaOutput(result),
            },
          ],
        };
      }

      case 'prisma_migrate_status': {
        const result = await executePrismaCommand('migrate', ['status']);
        return {
          content: [
            {
              type: 'text',
              text: formatPrismaOutput(result),
            },
          ],
        };
      }

      case 'prisma_db_push': {
        const acceptDataLoss = args.accept_data_loss || false;
        const pushArgs = ['push'];
        if (acceptDataLoss) {
          pushArgs.push('--accept-data-loss');
        }
        const result = await executePrismaCommand('db', pushArgs);
        return {
          content: [
            {
              type: 'text',
              text: formatPrismaOutput(result),
            },
          ],
        };
      }

      case 'prisma_db_pull': {
        const result = await executePrismaCommand('db', ['pull']);
        return {
          content: [
            {
              type: 'text',
              text: formatPrismaOutput(result),
            },
          ],
        };
      }

      case 'prisma_studio': {
        // Prisma Studio runs as separate process, just return info
        return {
          content: [
            {
              type: 'text',
              text: `To start Prisma Studio, run:\n\ncd apps/backoffice && npx prisma studio\n\nStudio will be available at: http://localhost:5555`,
            },
          ],
        };
      }

      case 'prisma_format': {
        const result = await executePrismaCommand('format');
        return {
          content: [
            {
              type: 'text',
              text: formatPrismaOutput(result),
            },
          ],
        };
      }

      case 'prisma_validate': {
        const result = await executePrismaCommand('validate');
        return {
          content: [
            {
              type: 'text',
              text: formatPrismaOutput(result),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error executing ${name}: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Prisma MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});



