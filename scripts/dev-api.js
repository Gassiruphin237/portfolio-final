/**
 * Serveur de développement local — simule api/gallery.js
 * Lance avec : node scripts/dev-api.js
 * Vite proxy /api → http://localhost:3000
 */

import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Charger les variables depuis .env.local
function loadEnv() {
  try {
    const envPath = resolve(__dirname, '../.env.local');
    const content = readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex === -1) continue;
      const key = trimmed.slice(0, eqIndex).trim();
      const value = trimmed.slice(eqIndex + 1).trim().replace(/^['"]|['"]$/g, '');
      process.env[key] = value;
    }
  } catch {
    console.error('Impossible de lire .env.local');
  }
}

loadEnv();

const PORT = 3000;
const UPLOADTHING_TOKEN = process.env.UPLOADTHING_TOKEN;

if (!UPLOADTHING_TOKEN) {
  console.error('❌  UPLOADTHING_TOKEN manquant dans .env.local');
  process.exit(1);
}

// Décoder le token pour extraire l'appId et l'apiKey
function parseToken(token) {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    return { appId: decoded.appId, apiKey: decoded.apiKey };
  } catch {
    throw new Error('UPLOADTHING_TOKEN invalide.');
  }
}

async function fetchGalleryImages() {
  const { appId, apiKey } = parseToken(UPLOADTHING_TOKEN);

  const response = await fetch('https://api.uploadthing.com/v6/listFiles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-uploadthing-api-key': apiKey,
    },
    body: JSON.stringify({ limit: 50, offset: 0 }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`UploadThing API error ${response.status}: ${text}`);
  }

  const data = await response.json();
  const files = data.files ?? data ?? [];

  return files
    .filter((f) => f.status === 'Uploaded' || !f.status)
    .map((f) => ({
      id: f.key ?? f.id,
      url: `https://utfs.io/f/${f.key ?? f.id}`,
      alt: (f.name ?? '').replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ') || `Photo ${f.key}`,
      caption: '',
    }));
}

const server = createServer(async (req, res) => {
  // CORS pour Vite dev server
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (req.method === 'GET' && url.pathname === '/api/gallery') {
    try {
      const images = await fetchGalleryImages();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(images));
    } catch (error) {
      console.error('Erreur galerie :', error.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(PORT, () => {
  console.log(`✅  API dev server lancé sur http://localhost:${PORT}`);
  console.log(`    → GET http://localhost:${PORT}/api/gallery`);
});
