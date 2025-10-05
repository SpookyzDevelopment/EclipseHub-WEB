import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, 'dist');
const INDEX_HTML_PATH = path.join(DIST_DIR, 'index.html');

const app = express();

const HOST = '0.0.0.0';
const PORT = Number(process.env.SERVER_PORT || process.env.PORT || 40006);

app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Debug logger
app.use((req, _res, next) => {
  console.log(`[REQ] ${req.method} ${req.url}`);
  next();
});

// Serve static files from dist
app.use(
  express.static(DIST_DIR, {
    index: false,
    maxAge: '1y',
  })
);

// Healthcheck
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Example API
app.get('/api/hello', (req, res) => res.json({ message: 'Hello from ALXNE!' }));

// ✅ React Router Fallback
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(INDEX_HTML_PATH, (err) => {
    if (err) {
      console.error('Error sending index.html:', err);
      res.status(500).send('Server error');
    }
  });
});

const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 ALXNE Server running at http://${HOST}:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
});

server.on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
});
