import express from 'express';
import path from 'path';
import { spawn } from 'child_process';
import { createServer as createViteServer } from 'vite';

interface PresenceUser {
  id: string;
  name: string;
  color: string;
  flag: string;
  country: string;
  xRatio: number;
  yRatio: number;
  x: number;
  y: number;
  page: string;
  lastActive: number;
  clicking: boolean;
  emoji?: string;
  connectedAt: number;
}

const activeClients = new Map<string, { user: PresenceUser; res?: express.Response }>();

function broadcast(event: string, data: unknown, excludeId?: string) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const [id, client] of activeClients.entries()) {
    if (excludeId && id === excludeId) continue;
    if (client.res && !client.res.writableEnded) {
      try {
        client.res.write(payload);
      } catch {
        // handled on close
      }
    }
  }
}

// Run python_engine.py (or an inline fixed script) with JSON on stdin
function runPython(args: string[], stdinData: string, timeoutMs = 30000): Promise<string> {
  const candidates = process.platform === 'win32' ? ['python', 'py', 'python3'] : ['python3', 'python'];
  return new Promise((resolve, reject) => {
    const tryNext = (i: number) => {
      if (i >= candidates.length) {
        reject(new Error('Python is not installed on this server'));
        return;
      }
      const proc = spawn(candidates[i], args);
      let out = '';
      let err = '';
      let settled = false;
      const timer = setTimeout(() => {
        if (!settled) {
          settled = true;
          proc.kill('SIGKILL');
          reject(new Error('Python timed out (it is the worst, after all)'));
        }
      }, timeoutMs);

      proc.on('error', (e: NodeJS.ErrnoException) => {
        clearTimeout(timer);
        if (settled) return;
        if (e.code === 'ENOENT') {
          tryNext(i + 1);
        } else {
          settled = true;
          reject(e);
        }
      });
      proc.stdout.on('data', (d) => (out += d.toString()));
      proc.stderr.on('data', (d) => (err += d.toString()));
      proc.on('close', (code) => {
        clearTimeout(timer);
        if (settled) return;
        settled = true;
        if (code === 0) resolve(out);
        else reject(new Error(err || `Python exited with code ${code}`));
      });

      proc.stdin.write(stdinData);
      proc.stdin.end();
    };
    tryNext(0);
  });
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Canvas RGBA payloads are large — default 100kb would 413
  app.use(express.json({ limit: '25mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', liveUsers: activeClients.size });
  });

  // ---------- PYTHON HALFTONE ENGINE ----------
  app.post('/api/python/process', async (req, res) => {
    const { width, height } = req.body || {};
    if (typeof width !== 'number' || typeof height !== 'number' || width * height > 1200 * 1200) {
      res.status(400).json({ status: 'error', message: 'Invalid or too large image (max 1200x1200)' });
      return;
    }
    try {
      const enginePath = path.join(process.cwd(), 'python_engine.py');
      const raw = await runPython([enginePath], JSON.stringify(req.body), 60000);
      const result = JSON.parse(raw.trim().split('\n').pop() || '{}');
      if (result.status === 'error') {
        res.status(500).json(result);
        return;
      }
      res.json(result);
    } catch (e) {
      res.status(500).json({ status: 'error', message: (e as Error).message });
    }
  });

  // ---------- POLYGLOT: real Python, fixed script only (no user code = no RCE) ----------
  const PY_JOKE = `
import sys, random, json
excuses = [
  "Indentation error on line 0",
  "Python refuses: it is Friday",
  "GIL acquired. GIL not released. Ever.",
  "Successfully computed 2 + 2 = 22 (string concatenation, obviously)",
]
print(json.dumps({"version": sys.version.split()[0], "output": random.choice(excuses), "real": str(2+2)}))
`;
  app.get('/api/polyglot/python', async (_req, res) => {
    try {
      const raw = await runPython(['-c', PY_JOKE], '', 8000);
      res.json(JSON.parse(raw.trim()));
    } catch (e) {
      res.status(500).json({ output: (e as Error).message, version: 'missing', real: '?' });
    }
  });

  // ---------- PRESENCE (SSE) ----------
  app.get('/api/presence/stream', (req, res) => {
    const userId =
      (req.query.userId as string) || `guest-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const name = (req.query.name as string) || `Visitor #${userId.slice(-4)}`;
    const color = (req.query.color as string) || '#FACC15';
    const country = (req.query.country as string) || 'Bangladesh';
    const flag = (req.query.flag as string) || '🇧🇩';
    const page = (req.query.page as string) || 'home';

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders?.();

    const newUser: PresenceUser = {
      id: userId,
      name: String(name).slice(0, 30),
      color,
      flag,
      country,
      xRatio: 0.5,
      yRatio: 0.5,
      x: 0,
      y: 0,
      page,
      lastActive: Date.now(),
      clicking: false,
      connectedAt: Date.now(),
    };

    activeClients.set(userId, { user: newUser, res });

    const otherUsers = Array.from(activeClients.values())
      .filter((c) => c.user.id !== userId)
      .map((c) => c.user);

    res.write(
      `event: init\ndata: ${JSON.stringify({ selfId: userId, users: otherUsers, count: activeClients.size })}\n\n`
    );
    broadcast('user_joined', { user: newUser, count: activeClients.size }, userId);

    const keepAliveTimer = setInterval(() => {
      if (res.writableEnded) {
        clearInterval(keepAliveTimer);
        return;
      }
      res.write(': keepalive\n\n');
      const c = activeClients.get(userId);
      if (c) c.user.lastActive = Date.now();
    }, 15000);

    req.on('close', () => {
      clearInterval(keepAliveTimer);
      activeClients.delete(userId);
      broadcast('user_left', { userId, count: activeClients.size });
    });
  });

  app.post('/api/presence/cursor', (req, res) => {
    const { userId, xRatio, yRatio, x, y, page, clicking, emoji } = req.body;
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }
    const client = activeClients.get(userId);
    if (client) {
      client.user.xRatio = typeof xRatio === 'number' ? xRatio : client.user.xRatio;
      client.user.yRatio = typeof yRatio === 'number' ? yRatio : client.user.yRatio;
      client.user.x = typeof x === 'number' ? x : client.user.x;
      client.user.y = typeof y === 'number' ? y : client.user.y;
      if (page) client.user.page = page;
      client.user.clicking = Boolean(clicking);
      if (emoji !== undefined) client.user.emoji = emoji;
      client.user.lastActive = Date.now();

      broadcast(
        'cursor_update',
        {
          userId,
          xRatio: client.user.xRatio,
          yRatio: client.user.yRatio,
          x: client.user.x,
          y: client.user.y,
          page: client.user.page,
          clicking: client.user.clicking,
          emoji,
        },
        userId
      );
    }
    res.json({ ok: true });
  });

  app.post('/api/presence/profile', (req, res) => {
    const { userId, name, color } = req.body;
    const client = activeClients.get(userId);
    if (client) {
      if (name) client.user.name = String(name).slice(0, 30);
      if (color) client.user.color = String(color).slice(0, 20);
      broadcast('profile_updated', { userId, name: client.user.name, color: client.user.color }, userId);
    }
    res.json({ ok: true });
  });

  app.get('/api/presence/users', (_req, res) => {
    const now = Date.now();
    for (const [id, c] of activeClients.entries()) {
      if (now - c.user.lastActive > 45000 || c.res?.writableEnded) {
        activeClients.delete(id);
        broadcast('user_left', { userId: id, count: activeClients.size });
      }
    }
    const users = Array.from(activeClients.values()).map((c) => c.user);
    res.json({ count: users.length, users });
  });

  // ---------- FRONTEND ----------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Worst Server running on http://localhost:${PORT}`);
  });
}

startServer();