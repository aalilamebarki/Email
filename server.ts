/**
 * server.ts - الخادم الخلفي المتكامل لمنصة freetemp.email
 * يوفر واجهات الـ API الكاملة، اتصال WebSocket الحي، ويدمج Vite middlewares
 */
import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import { extractOtp, extractLinks } from './worker/src/parser';
import { generateRandomAddress } from './worker/src/address';

interface EmailRecord {
  id: string;
  from: string;
  to: string;
  subject: string;
  date: string;
  text: string;
  html: string;
  otpCode: string | null;
  links: string[];
  receivedAt: string;
  rawSize?: number;
}

interface MailboxData {
  address: string;
  token: string;
  expiresAt: number;
  messages: EmailRecord[];
  sockets: Set<WebSocket>;
}

const mailboxes = new Map<string, MailboxData>();

// تنظيف دوري للصناديق المنتهية
setInterval(() => {
  const now = Date.now();
  for (const [addr, box] of mailboxes.entries()) {
    if (box.expiresAt <= now) {
      for (const ws of box.sockets) {
        try {
          ws.send(JSON.stringify({ type: 'burned', reason: 'expired' }));
          ws.close();
        } catch {}
      }
      mailboxes.delete(addr);
    }
  }
}, 30000);

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const wss = new WebSocketServer({ noServer: true });

  app.use(express.json());

  // ترويسات الأمان وCORS
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Access-Token');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }
    next();
  });

  // 1) فحص الصحة
  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      uptime: process.uptime(),
      activeMailboxes: mailboxes.size,
      timestamp: new Date().toISOString()
    });
  });

  // 2) إنشاء عنوان بريد جديد
  app.post('/api/new-address', (_req, res) => {
    const generated = generateRandomAddress('freetemp.email');
    const expiresAt = Date.now() + 20 * 60 * 1000;

    mailboxes.set(generated.address.toLowerCase(), {
      address: generated.address.toLowerCase(),
      token: generated.token,
      expiresAt,
      messages: [],
      sockets: new Set()
    });

    res.json({
      success: true,
      address: generated.address.toLowerCase(),
      token: generated.token,
      expiresAt,
      remainingSeconds: 1200
    });
  });

  // 3) جلب الرسائل
  app.get('/api/emails', (req, res) => {
    const addr = String(req.query.address || '').toLowerCase();
    const token = String(req.query.token || req.headers['x-access-token'] || '');

    const box = mailboxes.get(addr);
    if (!box || box.token !== token) {
      res.status(403).json({ error: '403 Forbidden: Invalid address or token' });
      return;
    }

    res.json({
      success: true,
      emails: box.messages,
      count: box.messages.length,
      expiresAt: box.expiresAt,
      remainingSeconds: Math.max(0, Math.floor((box.expiresAt - Date.now()) / 1000))
    });
  });

  // 4) تمديد صلاحية الصندوق 10 دقائق
  app.post('/api/extend', (req, res) => {
    const addr = String(req.body.address || '').toLowerCase();
    const token = String(req.body.token || req.headers['x-access-token'] || '');

    const box = mailboxes.get(addr);
    if (!box || box.token !== token) {
      res.status(403).json({ error: '403 Forbidden: Invalid address or token' });
      return;
    }

    const tenMinutesMs = 10 * 60 * 1000;
    const maxCap = Date.now() + 60 * 60 * 1000; // سقف أقصى 60 دقيقة
    box.expiresAt = Math.min(maxCap, Math.max(Date.now(), box.expiresAt) + tenMinutesMs);

    const remainingSeconds = Math.max(0, Math.floor((box.expiresAt - Date.now()) / 1000));

    // بث التحديث
    const payload = JSON.stringify({
      type: 'extended',
      expiresAt: box.expiresAt,
      remainingSeconds
    });

    for (const ws of box.sockets) {
      try { ws.send(payload); } catch {}
    }

    res.json({
      success: true,
      expiresAt: box.expiresAt,
      remainingSeconds,
      message: 'Extended by 10 minutes'
    });
  });

  // 5) إتلاف الصندوق وحذف كافة البيانات
  app.post('/api/burn', (req, res) => {
    const addr = String(req.body.address || '').toLowerCase();
    const token = String(req.body.token || req.headers['x-access-token'] || '');

    const box = mailboxes.get(addr);
    if (box) {
      if (box.token !== token) {
        res.status(403).json({ error: '403 Forbidden: Invalid address or token' });
        return;
      }

      const burnedPayload = JSON.stringify({
        type: 'burned',
        message: 'Mailbox burned by user'
      });

      for (const ws of box.sockets) {
        try {
          ws.send(burnedPayload);
          ws.close();
        } catch {}
      }

      mailboxes.delete(addr);
    }

    res.json({ success: true, message: 'Mailbox destroyed' });
  });

  // 6) محاكاة وصول رسالة تجريبية للاختبار والتحقق المباشر
  app.post('/api/simulate-email', (req, res) => {
    const addr = String(req.body.to || '').toLowerCase();
    const box = mailboxes.get(addr);

    if (!box) {
      res.status(404).json({ error: 'Mailbox not found' });
      return;
    }

    const otpCode = String(Math.floor(100000 + Math.random() * 900000));
    const verifyLink = `https://freetemp.email/verify?code=${otpCode}&email=${encodeURIComponent(addr)}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 20px; border: 1px solid #e5e5e5; border-radius: 8px;">
        <h2 style="color: #111;">Security Verification Code</h2>
        <p>Your one-time login verification code is:</p>
        <div style="font-size: 24px; font-weight: bold; font-family: monospace; letter-spacing: 2px; color: #2563eb; padding: 12px; background: #eff6ff; border-radius: 6px; text-align: center; margin: 16px 0;">
          ${otpCode}
        </div>
        <p>This code will expire in 10 minutes. If you did not request this, please ignore this message.</p>
        <p style="margin-top: 20px;">
          <a href="${verifyLink}" style="display: inline-block; padding: 10px 18px; background: #2563eb; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold;">Verify Account Online</a>
        </p>
      </div>
    `;

    const textContent = `Your verification code is: ${otpCode}\nVerify online: ${verifyLink}`;

    const record: EmailRecord = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      from: 'accounts@security-verify.org',
      to: addr,
      subject: `Your Verification Code: ${otpCode}`,
      date: new Date().toISOString(),
      text: textContent,
      html: htmlContent,
      otpCode: extractOtp(textContent, htmlContent) || otpCode,
      links: extractLinks(htmlContent, textContent),
      receivedAt: new Date().toISOString(),
      rawSize: htmlContent.length
    };

    box.messages.unshift(record);

    // بث فوري للرسالة الجديدة عبر WebSocket
    const broadcastMsg = JSON.stringify({
      type: 'new_email',
      email: record
    });

    for (const ws of box.sockets) {
      try { ws.send(broadcastMsg); } catch {}
    }

    res.json({ success: true, email: record });
  });

  // معالجة ترقية اتصال WebSocket
  server.on('upgrade', (request, socket, head) => {
    const url = new URL(request.url || '', `http://${request.headers.host}`);
    if (url.pathname === '/api/ws') {
      const addr = (url.searchParams.get('address') || '').toLowerCase();
      const token = url.searchParams.get('token') || '';

      const box = mailboxes.get(addr);
      if (!box || box.token !== token) {
        socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
        socket.destroy();
        return;
      }

      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request, box);
      });
    } else {
      socket.destroy();
    }
  });

  wss.on('connection', (ws: WebSocket, _request: http.IncomingMessage, box: MailboxData) => {
    box.sockets.add(ws);

    // إرسال الحالة الابتدائية
    ws.send(JSON.stringify({
      type: 'init',
      emails: box.messages,
      count: box.messages.length,
      expiresAt: box.expiresAt,
      remainingSeconds: Math.max(0, Math.floor((box.expiresAt - Date.now()) / 1000))
    }));

    ws.on('close', () => {
      box.sockets.delete(ws);
    });
  });

  // دمج Vite middlewares
  const isDev = process.env.NODE_ENV !== 'production';
  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  const port = 3000;
  server.listen(port, '0.0.0.0', () => {
    console.log(`Server is running smoothly on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
