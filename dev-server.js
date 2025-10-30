#!/usr/bin/env node

/**
 * Simple local development server for testing remote config
 * Serves remote-config.json with proper CORS headers
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3001;
const CONFIG_FILE = path.join(__dirname, 'remote-config.json');

const server = http.createServer((req, res) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  // CORS headers for extension
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/remote-config.json' || req.url === '/') {
    fs.readFile(CONFIG_FILE, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading config file:', err);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Failed to read config file' }));
        return;
      }

      try {
        // Validate JSON
        const config = JSON.parse(data);
        console.log(`✓ Serving config version: ${config.version}`);
        res.writeHead(200);
        res.end(data);
      } catch (parseErr) {
        console.error('Invalid JSON in config file:', parseErr);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Invalid JSON in config file' }));
      }
    });
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

// Watch for config file changes
fs.watch(CONFIG_FILE, (eventType) => {
  if (eventType === 'change') {
    console.log(`\n🔄 Config file changed - reload extension to test changes\n`);
  }
});

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║  🚀 Tranquilize Dev Config Server                         ║
╠═══════════════════════════════════════════════════════════╣
║  Serving: ${CONFIG_FILE.padEnd(43)}║
║  URL:     http://localhost:${PORT}/remote-config.json${' '.repeat(12)}║
║                                                           ║
║  👉 Set VITE_USE_DEV_CONFIG=true in .env                 ║
║  📝 Edit remote-config.json and reload extension         ║
║  🛑 Press Ctrl+C to stop                                 ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use. Please close other applications or change the PORT.\n`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});

