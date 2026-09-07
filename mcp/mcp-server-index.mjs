#!/usr/bin/env node

/**
 * MCP Server for Claude Anti-Slop
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const { memorySearch } = await import('../cli/lib/memory.mjs');
const { codeQualityCheck } = await import('../cli/lib/quality.mjs');

const TOOLS = [
  { name: 'memory-search', description: 'Search memory with fuzzy matching', inputSchema: { type: 'object', properties: { query: { type: 'string' }, category: { type: 'string', enum: ['all', 'standards', 'patterns', 'anti-patterns', 'insights', 'reviews'], default: 'all' }, limit: { type: 'number', default: 5 }, useFuzzy: { type: 'boolean', default: true } }, required: ['query'] } },
  { name: 'memory-write', description: 'Write to memory with append/create modes', inputSchema: { type: 'object', properties: { category: { type: 'string', enum: ['standards', 'patterns', 'anti-patterns', 'insights', 'reviews'], default: 'standards' }, filename: { type: 'string' }, content: { type: 'string' }, append: { type: 'boolean', default: false } }, required: ['filename', 'content'] } },
  { name: 'code-quality-check', description: 'Run ESLint, TypeScript, and Prettier checks', inputSchema: { type: 'object', properties: { code: { type: 'string' }, language: { type: 'string', enum: ['javascript', 'typescript'], default: 'typescript' }, checks: { type: 'array', items: { type: 'string', enum: ['lint', 'typecheck', 'prettier'] }, default: ['lint', 'typecheck', 'prettier'] } }, required: ['code'] } },
  { name: 'scan-repo', description: 'Scan repository and generate templates', inputSchema: { type: 'object', properties: { repo: { type: 'string' }, output: { type: 'string' }, verbose: { type: 'boolean', default: false } } } },
  { name: 'learn-from-git', description: 'Learn from git history', inputSchema: { type: 'object', properties: { repo: { type: 'string' }, recent: { type: 'string', default: '30d' } } } }
];

const server = new Server({ name: 'claude-antislop', version: '1.0.0' }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  try {
    switch (name) {
      case 'memory-search': return { content: [{ type: 'text', text: JSON.stringify(await memorySearch(args), null, 2) }] };
      case 'memory-write': { const { memoryWrite } = await import('../cli/lib/memory.mjs'); return { content: [{ type: 'text', text: JSON.stringify(await memoryWrite(args), null, 2) }] }; }
      case 'code-quality-check': return { content: [{ type: 'text', text: JSON.stringify(await codeQualityCheck(args), null, 2) }] };
      case 'scan-repo': { const { scan } = await import('../cli/lib/scan.mjs'); return { content: [{ type: 'text', text: JSON.stringify(await scan(args), null, 2) }] }; }
      case 'learn-from-git': { const { learn } = await import('../cli/lib/learn.mjs'); return { content: [{ type: 'text', text: JSON.stringify(await learn(args), null, 2) }] }; }
      default: throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) { return { content: [{ type: 'text', text: JSON.stringify({ success: false, error: error.message }, null, 2) }] }; }
});

async function startServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Claude Anti-Slop MCP server running on stdio');
}

if (process.argv[1] && process.argv[1].includes('mcp-server-index.mjs')) startServer();
export { startServer };
