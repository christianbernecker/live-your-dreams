#!/usr/bin/env node
import { StdioServer, Tool } from '@modelcontextprotocol/sdk/server/stdio.js';
import { err, ok } from '@modelcontextprotocol/sdk/shared/protocol.js';
import fetch from 'node-fetch';

const API_KEY = process.env.NEON_API_KEY;
const PROJECT_ID = process.env.NEON_PROJECT_ID;
const DB_NAME = process.env.NEON_DATABASE_NAME;
const ROLE = process.env.NEON_DEFAULT_ROLE || process.env.NEON_DEFAULT_USER; // kompatibel
const USER = process.env.NEON_DEFAULT_USER;
const PASSWORD = process.env.NEON_DEFAULT_PASSWORD;

if (!API_KEY || !PROJECT_ID || !DB_NAME || !USER || !PASSWORD) {
  console.error('Set NEON_API_KEY, NEON_PROJECT_ID, NEON_DATABASE_NAME, NEON_DEFAULT_USER, NEON_DEFAULT_PASSWORD');
  process.exit(1);
}

const BASE = `https://api.neon.tech/v2/projects/${PROJECT_ID}`;

async function neon(path, init = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      ...(init.headers || {})
    }
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`);
  return res.json();
}

function buildConnUrl({ host }) {
  // SSL erzwingen; USER/PASS aus ENV; DB aus ENV
  return `postgresql://${encodeURIComponent(USER)}:${encodeURIComponent(PASSWORD)}@${host}/${DB_NAME}?sslmode=require&channel_binding=require`;
}

const server = new StdioServer({ name: 'neon-mcp', version: '0.1.0' });

/**
 * createBranch({ name, parentId? })
 * - name: z.B. "pr-123"
 * - parentId: optional; wenn leer, nimmt Neon default
 */
server.tool(
  new Tool(
    'createBranch',
    'Erzeugt einen Neon DB-Branch',
    {
      type: 'object',
      properties: {
        name: { type: 'string' },
        parentId: { type: 'string' }
      },
      required: ['name']
    },
    async ({ name, parentId }) => {
      try {
        // POST /branches
        const body = { branch: { name, parent_id: parentId } };
        const data = await neon(`/branches`, { method: 'POST', body: JSON.stringify(body) });
        // host liegt auf "endpoints" – wir erzeugen getrennt einen Endpoint, falls nicht vorhanden:
        const branchId = data.branch.id;

        // Create endpoint for branch (read-write)
        const ep = await neon(`/endpoints`, {
          method: 'POST',
          body: JSON.stringify({
            endpoint: {
              branch_id: branchId,
              type: 'read_write',
              name: `ep-${name}`
            }
          })
        });

        const host = ep.endpoint?.host || ep.endpoints?.[0]?.host;
        const url = buildConnUrl({ host });
        return ok(JSON.stringify({ branchId, host, connectionUrl: url }, null, 2));
      } catch (error) {
        return err(error.message);
      }
    }
  )
);

/**
 * getConnectionUrl({ branchName })
 * - Liefert (oder baut) einen Endpoint und gibt die URL zurück
 */
server.tool(
  new Tool(
    'getConnectionUrl',
    'Gibt den Postgres Connection-String für einen Branch zurück',
    {
      type: 'object',
      properties: {
        branchName: { type: 'string' }
      },
      required: ['branchName']
    },
    async ({ branchName }) => {
      try {
        // Suche Branch
        const q = await neon(`/branches`);
        const branch = (q.branches || []).find(b => b.name === branchName);
        if (!branch) return err(`Branch not found: ${branchName}`);

        // Endpoints abfragen
        const eps = await neon(`/endpoints?branch_id=${branch.id}`);
        let host = eps.endpoints?.[0]?.host;

        // Falls kein Endpoint existiert: erzeugen
        if (!host) {
          const ep = await neon(`/endpoints`, {
            method: 'POST',
            body: JSON.stringify({
              endpoint: {
                branch_id: branch.id,
                type: 'read_write',
                name: `ep-${branchName}`
              }
            })
          });
          host = ep.endpoint?.host;
        }

        const url = buildConnUrl({ host });
        return ok(JSON.stringify({ branchId: branch.id, host, connectionUrl: url }, null, 2));
      } catch (error) {
        return err(error.message);
      }
    }
  )
);

/**
 * dropBranch({ id })
 */
server.tool(
  new Tool(
    'dropBranch',
    'Löscht einen Neon DB-Branch (und seine Endpoints)',
    {
      type: 'object',
      properties: {
        id: { type: 'string' }
      },
      required: ['id']
    },
    async ({ id }) => {
      try {
        // Endpoints des Branches löschen
        const eps = await neon(`/endpoints?branch_id=${id}`);
        for (const e of eps.endpoints || []) {
          await neon(`/endpoints/${e.id}`, { method: 'DELETE' });
        }
        // Branch löschen
        await neon(`/branches/${id}`, { method: 'DELETE' });
        return ok(`Deleted branch ${id}`);
      } catch (error) {
        return err(error.message);
      }
    }
  )
);

server.tool(
  new Tool(
    'listBranches',
    'Listet alle Branches auf',
    {
      type: 'object',
      properties: {}
    },
    async ({}) => {
      try {
        const data = await neon(`/branches`);
        return ok(JSON.stringify(data.branches.map(b => ({
          id: b.id,
          name: b.name,
          created_at: b.created_at,
          parent_id: b.parent_id
        })), null, 2));
      } catch (error) {
        return err(error.message);
      }
    }
  )
);

server.run();

