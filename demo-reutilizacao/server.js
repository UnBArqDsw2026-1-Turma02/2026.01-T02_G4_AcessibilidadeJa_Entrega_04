'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
};

const PERFIS = [
  { id: 'baixa-visao', nome: 'Baixa visão', efeito: 'contrast-dark', fonte: 130 },
  { id: 'dislexia', nome: 'Dislexia', efeito: 'readable-font', fonte: 115 },
  { id: 'idoso', nome: 'Leitura ampliada', efeito: null, fonte: 140 },
];

function send(res, status, type, body) {
  res.writeHead(status, {
    'Content-Type': type,
    'Access-Control-Allow-Origin': '*',
  });
  res.end(body);
}

function serveStatic(res, urlPath) {
  let rel = urlPath === '/' ? '/public/index.html' : urlPath;
  if (rel.startsWith('/patterns/')) rel = '/src' + rel;
  else if (!rel.startsWith('/public') && !rel.startsWith('/widget') && !rel.startsWith('/src')) {
    rel = '/public' + rel;
  }

  const filePath = path.join(ROOT, path.normalize(rel));
  if (!filePath.startsWith(ROOT)) return send(res, 403, 'text/plain', 'Forbidden');

  fs.readFile(filePath, (err, data) => {
    if (err) return send(res, 404, 'text/plain', 'Não encontrado: ' + urlPath);
    const ext = path.extname(filePath);
    send(res, 200, MIME[ext] || 'application/octet-stream', data);
  });
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);

  if (urlPath === '/api/perfis') {
    return send(res, 200, MIME['.json'], JSON.stringify({ perfis: PERFIS }, null, 2));
  }
  if (urlPath === '/api/health') {
    return send(res, 200, MIME['.json'], JSON.stringify({ status: 'ok' }));
  }

  return serveStatic(res, urlPath);
});

server.listen(PORT, () => {
  console.log('');
  console.log('  AcessibilidadeJá — Demo de Reutilização de Software');
  console.log('  Back + Front rodando em: http://localhost:' + PORT);
  console.log('  Serviço REST reutilizável: http://localhost:' + PORT + '/api/perfis');
  console.log('');
});
