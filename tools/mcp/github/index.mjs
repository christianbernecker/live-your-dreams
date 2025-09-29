#!/usr/bin/env node
import { StdioServer, Tool } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ok } from '@modelcontextprotocol/sdk/shared/protocol.js';
import { Octokit } from 'octokit';

const TOKEN = process.env.GITHUB_TOKEN;
const REPO_FULL = process.env.GITHUB_REPOSITORY; // owner/repo
if (!TOKEN || !REPO_FULL) {
  console.error('Set GITHUB_TOKEN and GITHUB_REPOSITORY (owner/repo).');
  process.exit(1);
}
const [owner, repo] = REPO_FULL.split('/');

const octokit = new Octokit({ auth: TOKEN });
const server = new StdioServer({ name: 'github-mcp', version: '0.1.0' });

server.tool(
  new Tool(
    'listPullRequests',
    'Listet Pull Requests auf',
    {
      type: 'object',
      properties: {
        state: { type: 'string', enum: ['open', 'closed', 'all'], default: 'open' },
        base: { type: 'string', default: 'main' }
      }
    },
    async ({ state = 'open', base = 'main' }) => {
      const { data } = await octokit.rest.pulls.list({ owner, repo, state, base, per_page: 50 });
      return ok(JSON.stringify(data.map(pr => ({
        number: pr.number,
        title: pr.title,
        state: pr.state,
        head: pr.head.ref,
        base: pr.base.ref,
        url: pr.html_url,
        checks_url: pr.statuses_url
      })), null, 2));
    }
  )
);

server.tool(
  new Tool(
    'createPullRequest',
    'Erstellt einen Pull Request',
    {
      type: 'object',
      properties: {
        title: { type: 'string' },
        head: { type: 'string' },
        base: { type: 'string', default: 'main' },
        body: { type: 'string' }
      },
      required: ['title', 'head']
    },
    async ({ title, head, base = 'main', body = '' }) => {
      const { data } = await octokit.rest.pulls.create({ owner, repo, title, head, base, body });
      return ok(JSON.stringify({ number: data.number, url: data.html_url }, null, 2));
    }
  )
);

server.tool(
  new Tool(
    'commentOnPullRequest',
    'Kommentiert in einem Pull Request',
    {
      type: 'object',
      properties: {
        number: { type: 'number' },
        body: { type: 'string' }
      },
      required: ['number', 'body']
    },
    async ({ number, body }) => {
      const { data } = await octokit.rest.issues.createComment({ owner, repo, issue_number: number, body });
      return ok(JSON.stringify({ id: data.id, url: data.html_url }, null, 2));
    }
  )
);

server.tool(
  new Tool(
    'getPullRequestChecks',
    'Holt CI-Status für einen PR',
    {
      type: 'object',
      properties: {
        number: { type: 'number' }
      },
      required: ['number']
    },
    async ({ number }) => {
      const { data: pr } = await octokit.rest.pulls.get({ owner, repo, pull_number: number });
      const { data: checks } = await octokit.rest.checks.listForRef({ owner, repo, ref: pr.head.sha });
      
      return ok(JSON.stringify({
        sha: pr.head.sha,
        checks: checks.check_runs.map(c => ({
          name: c.name,
          status: c.status,
          conclusion: c.conclusion,
          url: c.html_url
        }))
      }, null, 2));
    }
  )
);

server.run();

