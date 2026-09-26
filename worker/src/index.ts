/**
 * index.ts
 * نقطة الدخول الرئيسية لـ Cloudflare Worker
 * - توجيه حتمي O(1) عبر env.MAILBOX.idFromName()
 * - معالج Email Routing لتحليل البريد الوارد بـ postal-mime مع حماية OOM ورفض الفقدان الصامت
 * - معالج HTTP Fetch للـ API وترقية اتصالات WebSocket مع تحصين التوكن وتخصيص سياسة CORS
 * - دعم تمديد الصلاحية (/api/extend) والإتلاف والحرق الفوري (/api/burn)
 */

import PostalMime from 'postal-mime';
import { MailboxDO, Env } from './mailbox-do';
import { generateRandomAddress } from './address';

// تصدير كلاس Durable Object لـ Cloudflare
export { MailboxDO };

/**
 * النطاقات المعتمدة لسياسة CORS المقيدة
 */
const ALLOWED_ORIGIN_PATTERNS = [
  /^https?:\/\/localhost(:\d+)?$/,
  /^https?:\/\/127\.0\.0\.1(:\d+)?$/,
  /^https:\/\/freetemp\.email$/,
  /^https:\/\/www\.freetemp\.email$/,
  /^https:\/\/[a-z0-9-]+\.europe-west2\.run\.app$/,
  /^https:\/\/[a-z0-9-]+\.run\.app$/,
];

/**
 * حساب ترويسات CORS المقيدة وترويسات الأمان القياسية (Standard HTTP Security Headers)
 */
export function getCorsHeaders(request: Request, env?: Env): Record<string, string> {
  const origin = request.headers.get('Origin') || '';
  let matchedOrigin = 'https://freetemp.email';

  if (origin) {
    const isAllowed = ALLOWED_ORIGIN_PATTERNS.some((pattern) => pattern.test(origin));
    if (isAllowed) {
      matchedOrigin = origin;
    }
  }

  return {
    'Access-Control-Allow-Origin': matchedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Upgrade, X-Access-Token, cf-turnstile-response',
    'Access-Control-Allow-Credentials': 'true',
    'Vary': 'Origin',
    // ركائز الأمان القياسية (Security Headers)
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Frame-Options': 'DENY',
    'Content-Security-Policy': "default-src 'self' https://freetemp.email; connect-src 'self' https://freetemp.email wss://freetemp.email https://challenges.cloudflare.com; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: https:; frame-src 'self' https://challenges.cloudflare.com;",
  };
}

/**
 * تحديد المعدل (IP Rate Limiting) على مستوى الذاكرة: 10 طلبات لكل 10 دقائق
 */
const ipRateLimitMap = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(ip: string): boolean {
  if (!ip) return true;
  const now = Date.now();
  const record = ipRateLimitMap.get(ip);
  if (!record || record.resetAt <= now) {
    ipRateLimitMap.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return true;
  }
  if (record.count >= 10) {
    return false;
  }
  record.count += 1;
  return true;
}

/**
 * استخراج رمز الأمان (Token) من الترويسات أو المعاملات
 */
function extractTokenFromRequest(request: Request, url: URL): string | null {
  const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
  if (authHeader) {
    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    if (match) return match[1].trim();
    return authHeader.trim();
  }
  const customHeader = request.headers.get('X-Access-Token') || request.headers.get('x-access-token');
  if (customHeader) return customHeader.trim();

  const queryToken = url.searchParams.get('token');
  if (queryToken) return queryToken.trim();

  return null;
}

export default {
  /**
   * 1) معالج طلبات HTTP و WebSocket
   */
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const corsHeaders = getCorsHeaders(request, env);

    // معالجة طلبات Preflight لـ CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders, status: 204 });
    }

    // =========================================================================
    // أ) توليد عنوان بريد عشوائي جديد وتأمين الصندوق برمز سري وجدولة الـ Alarm
    // المسار: /api/new-address
    // =========================================================================
    if (url.pathname === '/api/new-address') {
      const clientIp = request.headers.get('CF-Connecting-IP') || request.headers.get('x-real-ip') || '';

      // 1. فحص تحديد المعدل (Rate Limiting) لمنع الإغراق وسحب العناوين الآلي
      if (clientIp && !checkRateLimit(clientIp)) {
        return new Response(
          JSON.stringify({
            error: '429 Too Many Requests',
            message: 'تم تجاوز الحد المسموح لتوليد العناوين (حد أقصى 10 عناوين كل 10 دقائق). يرجى الانتظار قليلا.',
          }),
          {
            status: 429,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          }
        );
      }

      // 2. التحقق من كود Cloudflare Turnstile لمنع البوتات (إن تم ضبط المفتاح السري)
      if (env.TURNSTILE_SECRET_KEY) {
        let turnstileToken = request.headers.get('cf-turnstile-response') || url.searchParams.get('turnstileToken');
        if (!turnstileToken && request.method === 'POST') {
          try {
            const body: any = await request.clone().json();
            turnstileToken = body?.turnstileToken || body?.['cf-turnstile-response'];
          } catch {}
        }

        if (!turnstileToken) {
          return new Response(
            JSON.stringify({
              error: '403 Forbidden',
              message: 'فشل التحقق الأمني: رمز Turnstile مطلوب لتوليد عنوان بريد.',
            }),
            {
              status: 403,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            }
          );
        }

        try {
          const verifyData = new FormData();
          verifyData.append('secret', env.TURNSTILE_SECRET_KEY);
          verifyData.append('response', turnstileToken);
          if (clientIp) verifyData.append('remoteip', clientIp);

          const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            body: verifyData,
          });
          const turnstileResult: any = await turnstileRes.json();
          if (!turnstileResult.success) {
            return new Response(
              JSON.stringify({
                error: '403 Forbidden',
                message: 'فشل التحقق الأمني من كود Turnstile.',
              }),
              {
                status: 403,
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
              }
            );
          }
        } catch (e) {
          console.error('Turnstile verification request failed:', e);
        }
      }

      const targetDomain = env.DOMAIN || 'freetemp.email';
      const addressData = generateRandomAddress(targetDomain);
      const expiryMinutes = parseInt(env.EXPIRY_MINUTES || '20', 10);

      // ربط العنوان بالـ Durable Object فوريا
      const doId = env.MAILBOX.idFromName(addressData.address);
      const stub = env.MAILBOX.get(doId);

      // تهيئة الصندوق وحفظ التوكن وتفعيل الـ Alarm مباشرة دون انتظار استقبال رسالة
      let expiresAt = Date.now() + expiryMinutes * 60 * 1000;
      try {
        const initRes = await stub.fetch(
          new Request('https://mailbox/internal/init', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              token: addressData.token,
              expiryMinutes,
            }),
          })
        );
        if (initRes.ok) {
          const initData: any = await initRes.json();
          if (initData.expiresAt) {
            expiresAt = initData.expiresAt;
          }
        }
      } catch (err) {
        console.error('Failed to initialize Durable Object on address generation:', err);
      }

      return new Response(
        JSON.stringify({
          address: addressData.address,
          localPart: addressData.localPart,
          domain: addressData.domain,
          token: addressData.token,
          expiresAt,
          expiryMinutes,
          message: 'تم توليد العنوان وتحصين الصندوق بنجاح',
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // =========================================================================
    // ب) ترقية اتصال WebSocket إلى الـ Durable Object مع فحص رمز الأمان
    // المسارات المدعومة: /api/ws/{address} أو /api/ws?address={address}
    // =========================================================================
    if (url.pathname.startsWith('/api/ws')) {
      const pathParts = url.pathname.split('/').filter(Boolean);
      let targetAddress = pathParts[2] || url.searchParams.get('address');

      if (!targetAddress) {
        return new Response('يجب تحديد عنوان البريد المطلوب للاتصال', {
          status: 400,
          headers: { 'Content-Type': 'text/plain', ...corsHeaders },
        });
      }

      targetAddress = targetAddress.trim().toLowerCase();
      const token = extractTokenFromRequest(request, url);

      if (!token) {
        return new Response(
          JSON.stringify({
            error: '403 Forbidden',
            message: 'ممنوع الوصول: رمز الأمان غير مرفق لفتح قناة WebSocket.',
          }),
          {
            status: 403,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          }
        );
      }

      // حساب معرف الـ Durable Object الحتمي O(1)
      const doId = env.MAILBOX.idFromName(targetAddress);
      const stub = env.MAILBOX.get(doId);

      // تمرير طلب الترقية إلى الـ Durable Object للتحقق الداخلي من التوكن وتفعيل الـ Hibernation
      return stub.fetch(request);
    }

    // =========================================================================
    // ج) جلب الرسائل المخزنة لعنوان معين عبر HTTP مع فحص رمز الأمان
    // المسار: /api/emails/{address} أو /api/emails?address={address}
    // =========================================================================
    if (url.pathname.startsWith('/api/emails')) {
      const pathParts = url.pathname.split('/').filter(Boolean);
      let targetAddress = pathParts[2] || url.searchParams.get('address');

      if (!targetAddress) {
        return new Response('عنوان البريد مفقود', {
          status: 400,
          headers: { 'Content-Type': 'text/plain', ...corsHeaders },
        });
      }

      targetAddress = targetAddress.trim().toLowerCase();
      const token = extractTokenFromRequest(request, url);

      if (!token) {
        return new Response(
          JSON.stringify({
            error: '403 Forbidden',
            message: 'ممنوع الوصول: رمز الأمان (Token) مفقود. يرجى توفير التوكن في ترويسة Authorization أو عبر ?token=.',
          }),
          {
            status: 403,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          }
        );
      }

      const doId = env.MAILBOX.idFromName(targetAddress);
      const stub = env.MAILBOX.get(doId);

      // تمرير التوكن داخل الطلب للـ Durable Object
      const fetchUrl = `https://mailbox/api/messages?token=${encodeURIComponent(token)}`;
      const response = await stub.fetch(
        new Request(fetchUrl, {
          method: 'GET',
          headers: request.headers,
        })
      );

      const body = await response.text();
      return new Response(body, {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    // =========================================================================
    // د) تمديد صلاحية الصندوق 10 دقائق إضافية (/api/extend)
    // المسار: /api/extend/{address} أو POST /api/extend مع body: { address, token }
    // =========================================================================
    if (url.pathname.startsWith('/api/extend')) {
      const pathParts = url.pathname.split('/').filter(Boolean);
      let targetAddress = pathParts[2] || url.searchParams.get('address');
      let token = extractTokenFromRequest(request, url);

      if (!targetAddress && request.method === 'POST') {
        try {
          const body: any = await request.clone().json();
          targetAddress = body.address;
          if (!token && body.token) token = body.token;
        } catch {}
      }

      if (!targetAddress) {
        return new Response(JSON.stringify({ error: 'Missing address' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      targetAddress = targetAddress.trim().toLowerCase();
      if (!token) {
        return new Response(JSON.stringify({ error: '403 Forbidden: Missing token' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      const doId = env.MAILBOX.idFromName(targetAddress);
      const stub = env.MAILBOX.get(doId);

      const extendRes = await stub.fetch(
        new Request(`https://mailbox/internal/extend?token=${encodeURIComponent(token)}`, {
          method: 'POST',
          headers: request.headers,
        })
      );

      const resBody = await extendRes.text();
      return new Response(resBody, {
        status: extendRes.status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // =========================================================================
    // هـ) إتلاف وحرق الصندوق فوريا (/api/burn)
    // المسار: /api/burn/{address} أو POST /api/burn مع body: { address, token }
    // =========================================================================
    if (url.pathname.startsWith('/api/burn')) {
      const pathParts = url.pathname.split('/').filter(Boolean);
      let targetAddress = pathParts[2] || url.searchParams.get('address');
      let token = extractTokenFromRequest(request, url);

      if (!targetAddress && (request.method === 'POST' || request.method === 'DELETE')) {
        try {
          const body: any = await request.clone().json();
          targetAddress = body.address;
          if (!token && body.token) token = body.token;
        } catch {}
      }

      if (!targetAddress) {
        return new Response(JSON.stringify({ error: 'Missing address' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      targetAddress = targetAddress.trim().toLowerCase();
      if (!token) {
        return new Response(JSON.stringify({ error: '403 Forbidden: Missing token' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      const doId = env.MAILBOX.idFromName(targetAddress);
      const stub = env.MAILBOX.get(doId);

      const burnRes = await stub.fetch(
        new Request(`https://mailbox/internal/burn?token=${encodeURIComponent(token)}`, {
          method: 'POST',
          headers: request.headers,
        })
      );

      const resBody = await burnRes.text();
      return new Response(resBody, {
        status: burnRes.status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // =========================================================================
    // و) فحص صحة الخادم
    // =========================================================================
    if (url.pathname === '/health' || url.pathname === '/api/health') {
      return new Response(
        JSON.stringify({
          status: 'ok',
          service: 'temp-mail-worker',
          domain: env.DOMAIN || 'freetemp.email',
          timestamp: new Date().toISOString(),
        }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    return new Response('Temp Mail Cloudflare Worker is running.', {
      status: 200,
      headers: { 'Content-Type': 'text/plain', ...corsHeaders },
    });
  },

  /**
   * 2) معالج Cloudflare Email Routing لاستقبال الرسائل الحقيقية الواردة
   * مع حماية OOM Crash وتقييد الحجم الأقصى إلى 5 ميجابايت
   * وTimeout صريح مدته 5 ثوان على التحليل بـ postal-mime
   * ومنع الفقدان الصامت للرسائل عبر message.setReject
   */
  async email(message: any, env: Env, ctx: ExecutionContext): Promise<void> {
    const MAX_EMAIL_SIZE_BYTES = 5 * 1024 * 1024; // حد أقصى 5 ميجابايت لحماية وقت المعالجة والذاكرة

    try {
      const toAddress = (message.to || '').trim().toLowerCase();
      const fromAddress = message.from || 'sender@unknown.com';

      if (!toAddress) {
        console.error('Email rejected: Missing recipient address.');
        message.setReject('Missing recipient address');
        return;
      }

      // =======================================================================
      // حماية سقف الذاكرة ومنع انهيار الخادم (OOM Crash Protection)
      // إذا تجاوز حجم الرسالة الخام 5 ميجابايت، يتم رفضها فورا قبل التحليل بـ postal-mime
      // =======================================================================
      if (typeof message.rawSize === 'number' && message.rawSize > MAX_EMAIL_SIZE_BYTES) {
        console.warn(
          `Email to ${toAddress} exceeded size limit (${message.rawSize} bytes > ${MAX_EMAIL_SIZE_BYTES} bytes). Rejecting.`
        );
        message.setReject('Email exceeds size limit (5MB)');
        return;
      }

      // 1. قراءة محتوى الرسالة الخام
      const rawStream = message.raw;
      const rawResponse = new Response(rawStream);
      const rawArrayBuffer = await rawResponse.arrayBuffer();

      // فحص إضافي لحجم الـ ArrayBuffer في حال لم يكن rawSize محددا
      if (rawArrayBuffer.byteLength > MAX_EMAIL_SIZE_BYTES) {
        console.warn(`Buffer size (${rawArrayBuffer.byteLength} bytes) exceeds limit. Rejecting.`);
        message.setReject('Email exceeds size limit (5MB)');
        return;
      }

      // 2. تحليل الرسالة بحد أقصى للوقت (Explicit 5s Timeout) لمنع تعليق معالجة Worker
      const parser = new PostalMime();
      const parseTimeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Postal-mime parsing timeout exceeded (5s)')), 5000)
      );

      let parsedEmail: any;
      try {
        parsedEmail = await Promise.race([parser.parse(rawArrayBuffer), parseTimeout]);
      } catch (parseErr) {
        console.warn('Parsing timed out or hit an error. Falling back to safe summary:', parseErr);
        // توليد نسخة ملخصة آمنة عند تجاوز الـ Timeout
        parsedEmail = {
          subject: '(تعذر إتمام التحليل الكامل للرسالة - تجاوز الوقت)',
          text: 'تم استلام الرسالة ولكنها استغرقت وقتا طويلا في التحليل أو احتوت على مرفقات معقدة.',
          html: '<p>تم استلام الرسالة ولكنها استغرقت وقتا طويلا في التحليل أو احتوت على مرفقات معقدة.</p>',
          date: new Date().toISOString(),
        };
      }

      // استخراج الحقول الضرورية
      const subject = parsedEmail.subject || '(بدون عنوان)';
      const textContent = parsedEmail.text || '';
      const htmlContent = parsedEmail.html || '';
      const date = parsedEmail.date || new Date().toISOString();

      // 3. التوجيه الحتمي O(1) إلى الـ Durable Object المطابق تماما للعنوان المستقبل
      const doId = env.MAILBOX.idFromName(toAddress);
      const stub = env.MAILBOX.get(doId);

      // 4. تسليم الرسالة للـ Durable Object المعزول
      const deliverPayload = {
        id: crypto.randomUUID(),
        to: toAddress,
        from: fromAddress,
        subject,
        text: textContent,
        html: htmlContent,
        date,
        rawSize: rawArrayBuffer.byteLength,
      };

      const deliverRequest = new Request('https://mailbox/internal/deliver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deliverPayload),
      });

      // انتظار تسليم الرسالة
      ctx.waitUntil(stub.fetch(deliverRequest));
    } catch (error) {
      // =======================================================================
      // منع الفقدان الصامت للرسائل (Silent Email Drops Protection)
      // إشعار خادم الإرسال SMTP بالمحاولة مجددا عبر setReject وعدم فقدان البريد بصمت
      // =======================================================================
      console.error('Error handling incoming email in Worker:', error);
      try {
        message.setReject('Internal temporary delivery failure');
      } catch (rejectErr) {
        console.error('Failed to invoke message.setReject:', rejectErr);
      }
    }
  },
};
