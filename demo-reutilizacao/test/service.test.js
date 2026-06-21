'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { spawn } = require('node:child_process');
const path = require('node:path');

test('Serviço REST /api/perfis responde perfis reutilizáveis', async () => {
  const PORT = 4599;
  const proc = spawn(process.execPath, [path.join(__dirname, '..', 'server.js')], {
    env: { ...process.env, PORT: String(PORT) },
    stdio: 'ignore',
  });

  try {
    await waitForServer(PORT, 2000);
    const res = await fetch(`http://localhost:${PORT}/api/perfis`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body.perfis));
    assert.ok(body.perfis.length >= 1);
    assert.ok(body.perfis.every((p) => p.id && p.nome));
  } finally {
    proc.kill();
  }
});

async function waitForServer(port, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      await fetch(`http://localhost:${port}/api/health`);
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 80));
    }
  }
  throw new Error('servidor não subiu a tempo');
}
