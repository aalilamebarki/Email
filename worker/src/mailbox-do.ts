/**
 * mailbox-do.ts
 * كلاس Cloudflare Durable Object (MailboxDO)
 * يحقق العزل التام O(1) لكل صندوق بريد مؤقت مع أعلى معايير الأمان:
 * - جدولة الـ Alarm فور إنشاء الصندوق لحساب وقت الانتهاء بدقة
 * - منع التجسس عبر التحقق الصارم من رمز الأمان (Secret Token) ومنح 403 لمن لا يملكه
 * - تخزين مشفر معزول مع حماية الذاكرة بحد أقصى (limit: 50, reverse: true)
 * - دعم تمديد الصلاحية (+10 دقائق) عبر /internal/extend
 * - ميزة الإتلاف والحرق الفوري الشامل (/internal/burn أو عبر WebSocket)
 * - استخراج فوري لأكواد OTP والروابط وبثها عبر WebSocket Hibernation API
 */

import { extractOtp, extractLinks } from './parser';

export interface EmailRecord {
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

export interface Env {
  MAILBOX: DurableObjectNamespace;
  DOMAIN?: string;
  EXPIRY_MINUTES?: string;
  TURNSTILE_SECRET_KEY?: string;
}

export class MailboxDO implements DurableObject {
  private state: DurableObjectState;
  private env: Env;
  private expiryMs: number;

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
    const minutes = parseInt(env.EXPIRY_MINUTES || '20', 10);
    this.expiryMs = (isNaN(minutes) ? 20 : minutes) * 60 * 1000;
  }

  /**
   * استخراج رمز الأمان (Token) من الترويسات أو من المعاملات في الرابط
   */
  private extractToken(request: Request, url: URL): string | null {
    // 1) فحص ترويسة التفويض القياسية Authorization: Bearer <token>
    const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
    if (authHeader) {
      const match = authHeader.match(/^Bearer\s+(.+)$/i);
      if (match) return match[1].trim();
      return authHeader.trim();
    }

    // 2) فحص ترويسة مخصصة X-Access-Token
    const customHeader = request.headers.get('X-Access-Token') || request.headers.get('x-access-token');
    if (customHeader) return customHeader.trim();

    // 3) فحص Query Parameter في الرابط (?token=...) وهو الأكثر ملاءمة لبروتوكول WebSocket
    const queryToken = url.searchParams.get('token');
    if (queryToken) return queryToken.trim();

    // 4) فحص بروتوكول الويب سوكيت الفرعي Sec-WebSocket-Protocol إن وجد
    const wsProtocol = request.headers.get('Sec-WebSocket-Protocol');
    if (wsProtocol && !wsProtocol.includes(',')) {
      return wsProtocol.trim();
    }

    return null;
  }

  /**
   * التحقق من مطابقة الرمز السري المخزن للصندوق
   */
  private async verifyToken(providedToken?: string | null): Promise<boolean> {
    if (!providedToken) return false;
    const storedToken = await this.state.storage.get<string>('secret_token');
    if (!storedToken) {
      return false;
    }
    return storedToken === providedToken.trim();
  }

  /**
   * ضمان جدولة الـ Alarm وتخزين expiresAt
   */
  private async ensureAlarmScheduled(): Promise<number> {
    let expiresAt = await this.state.storage.get<number>('expiresAt');
    const now = Date.now();

    if (!expiresAt || expiresAt <= now) {
      expiresAt = now + this.expiryMs;
      await this.state.storage.put('expiresAt', expiresAt);
      await this.state.storage.setAlarm(expiresAt);
    } else {
      // التأكد من أن Cloudflare لديه الـ Alarm مضبوطا فعليا
      const existingAlarm = await this.state.storage.getAlarm();
      if (existingAlarm === null) {
        await this.state.storage.setAlarm(expiresAt);
      }
    }
    return expiresAt;
  }

  /**
   * معالج الطلبات الموجهة لهذا الـ Durable Object
   */
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // =========================================================================
    // أ) تهيئة الصندوق وحفظ التوكن وجدولة الـ Alarm فور الإنشاء (/internal/init)
    // =========================================================================
    if (url.pathname === '/internal/init' && request.method === 'POST') {
      try {
        const body: any = await request.json();
        const incomingToken = body.token;
        if (incomingToken) {
          const currentToken = await this.state.storage.get<string>('secret_token');
          if (!currentToken) {
            await this.state.storage.put('secret_token', incomingToken.trim());
          }
        }

        const expiresAt = await this.ensureAlarmScheduled();
        return new Response(
          JSON.stringify({
            success: true,
            expiresAt,
            remainingSeconds: Math.max(0, Math.floor((expiresAt - Date.now()) / 1000)),
          }),
          { headers: { 'Content-Type': 'application/json' }, status: 200 }
        );
      } catch (err: any) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // =========================================================================
    // ب) ترقية الاتصال إلى WebSocket باستخدام Hibernation API مع التحقق من التوكن
    // =========================================================================
    if (request.headers.get('Upgrade')?.toLowerCase() === 'websocket') {
      const clientToken = this.extractToken(request, url);
      const isAuthorized = await this.verifyToken(clientToken);

      if (!isAuthorized) {
        return new Response('403 Forbidden: Invalid or missing secret access token.', {
          status: 403,
          headers: { 'Content-Type': 'text/plain' },
        });
      }

      // حماية البنية التحتية: تقييد اتصالات WebSocket المتزامنة لكل صندوق (حد أقصى 5 اتصالات)
      const currentSockets = this.state.getWebSockets();
      if (currentSockets.length >= 5) {
        return new Response(
          JSON.stringify({
            error: '429 Too Many Requests',
            message: 'تم تجاوز الحد الأقصى لاتصالات WebSocket المتزامنة لهذا الصندوق (حد أقصى 5 اتصالات).',
          }),
          {
            status: 429,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      // جدولة وتأكيد الـ Alarm ومزامنة وقت الانتهاء
      const expiresAt = await this.ensureAlarmScheduled();

      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);

      // تفعيل وضع الـ Hibernation لحفظ الموارد
      this.state.acceptWebSocket(server);

      // جلب الرسائل الأخيرة المخزنة بحماية الذاكرة (بحد أقصى 50 رسالة)
      const stored = await this.getAllStoredMessages();
      server.send(
        JSON.stringify({
          type: 'init',
          emails: stored,
          count: stored.length,
          expiresAt,
          remainingSeconds: Math.max(0, Math.floor((expiresAt - Date.now()) / 1000)),
          timestamp: new Date().toISOString(),
        })
      );

      return new Response(null, {
        status: 101,
        webSocket: client,
      });
    }

    // =========================================================================
    // ج) تسليم رسالة بريد إلكتروني واردة (/internal/deliver)
    // =========================================================================
    if (url.pathname === '/internal/deliver' && request.method === 'POST') {
      try {
        const payload: any = await request.json();

        const fromAddress = payload.from || 'مجهول';
        const toAddress = payload.to || '';

        // منع الإغراق البريدي (Email Bombing): حد أقصى 50 رسالة لكل صندوق
        const currentMessages = await this.getAllStoredMessages();
        if (currentMessages.length >= 50) {
          console.warn(`Mailbox ${toAddress} reached maximum capacity of 50 emails. Rejecting.`);
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Mailbox capacity reached (maximum 50 emails allowed)',
            }),
            {
              status: 429,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }

        const subject = payload.subject || '(بدون موضوع)';
        const textContent = payload.text || '';
        const htmlContent = payload.html || '';
        const rawDate = payload.date || new Date().toISOString();

        // استخراج كود OTP الذكي والروابط
        const otpCode = extractOtp(textContent, htmlContent);
        const links = extractLinks(htmlContent, textContent);

        const emailRecord: EmailRecord = {
          id: payload.id || crypto.randomUUID(),
          from: fromAddress,
          to: toAddress,
          subject,
          date: rawDate,
          text: textContent,
          html: htmlContent,
          otpCode,
          links,
          receivedAt: new Date().toISOString(),
          rawSize: payload.rawSize,
        };

        // تخزين الرسالة مع بادئة زمنية لترتيب طبيعي O(1)
        const storageKey = `msg:${Date.now()}_${emailRecord.id}`;
        await this.state.storage.put(storageKey, emailRecord);

        // التأكد من جدولة الـ Alarm لضمان دورة حياة الصندوق
        const expiresAt = await this.ensureAlarmScheduled();

        // بث الرسالة فورا عبر WebSocket لجميع الاتصالات المعتمدة النشطة
        const broadcastPayload = JSON.stringify({
          type: 'new_email',
          email: emailRecord,
          expiresAt,
          remainingSeconds: Math.max(0, Math.floor((expiresAt - Date.now()) / 1000)),
        });

        const activeSockets = this.state.getWebSockets();
        for (const ws of activeSockets) {
          try {
            ws.send(broadcastPayload);
          } catch (e) {
            // تجاهل الاتصالات المغلقة
          }
        }

        return new Response(
          JSON.stringify({ success: true, id: emailRecord.id, otpCode }),
          {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
          }
        );
      } catch (err: any) {
        return new Response(
          JSON.stringify({ success: false, error: err.message }),
          {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
          }
        );
      }
    }

    // =========================================================================
    // د) تمديد صلاحية الصندوق 10 دقائق (/internal/extend أو /api/extend)
    // =========================================================================
    if (url.pathname.endsWith('/extend') && request.method === 'POST') {
      // إذا كان الطلب قادما من مسار خارجي، نتحقق من التوكن
      if (!url.pathname.startsWith('/internal')) {
        const token = this.extractToken(request, url);
        if (!await this.verifyToken(token)) {
          return new Response(
            JSON.stringify({ error: '403 Forbidden: Invalid access token' }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }

      const currentExpiresAt = (await this.state.storage.get<number>('expiresAt')) || Date.now();
      const tenMinutesMs = 10 * 60 * 1000;
      // إضافة 10 دقائق من تاريخ الانتهاء الحالي أو من اللحظة الحالية (أيهما أكبر)
      const newExpiresAt = Math.max(Date.now(), currentExpiresAt) + tenMinutesMs;

      await this.state.storage.put('expiresAt', newExpiresAt);
      await this.state.storage.setAlarm(newExpiresAt);

      const remainingSeconds = Math.max(0, Math.floor((newExpiresAt - Date.now()) / 1000));

      // بث تحديث التمديد لكافة الاتصالات الحية
      const broadcastPayload = JSON.stringify({
        type: 'extended',
        expiresAt: newExpiresAt,
        remainingSeconds,
      });

      for (const ws of this.state.getWebSockets()) {
        try {
          ws.send(broadcastPayload);
        } catch {}
      }

      return new Response(
        JSON.stringify({
          success: true,
          expiresAt: newExpiresAt,
          remainingSeconds,
          message: 'تم تمديد صلاحية الصندوق 10 دقائق إضافية بنجاح.',
        }),
        { headers: { 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // =========================================================================
    // هـ) إتلاف وحرق الصندوق فوريا (/internal/burn أو /api/burn)
    // =========================================================================
    if (url.pathname.endsWith('/burn') && (request.method === 'POST' || request.method === 'DELETE')) {
      if (!url.pathname.startsWith('/internal')) {
        const token = this.extractToken(request, url);
        if (!await this.verifyToken(token)) {
          return new Response(
            JSON.stringify({ error: '403 Forbidden: Invalid access token' }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }

      await this.burnAndDestroy();
      return new Response(
        JSON.stringify({
          success: true,
          message: 'تم حرق وإتلاف كافة بيانات الصندوق وإغلاق الاتصالات فوريا.',
        }),
        { headers: { 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // =========================================================================
    // و) مسار استرجاع الرسائل المخزنة عبر HTTP GET (/api/messages أو /emails)
    // مع التحقق الصارم من التوكن
    // =========================================================================
    if (url.pathname.endsWith('/messages') || url.pathname.endsWith('/emails')) {
      const clientToken = this.extractToken(request, url);
      const isAuthorized = await this.verifyToken(clientToken);

      if (!isAuthorized) {
        return new Response(
          JSON.stringify({
            error: '403 Forbidden',
            message: 'ممنوع الوصول: رمز الأمان غير صحيح أو مفقود. لا يمكن الاطلاع على الرسائل بدون تصريح.',
          }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const expiresAt = await this.ensureAlarmScheduled();
      const messages = await this.getAllStoredMessages();

      return new Response(
        JSON.stringify({
          emails: messages,
          count: messages.length,
          expiresAt,
          remainingSeconds: Math.max(0, Math.floor((expiresAt - Date.now()) / 1000)),
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    return new Response('Not Found', { status: 404 });
  }

  /**
   * جلب أحدث الرسائل المخزنة بحماية الذاكرة ومنع الانهيار
   * استخدام limit: 50 و reverse: true لمنع تحميل آلاف الرسائل دفعة واحدة
   */
  private async getAllStoredMessages(): Promise<EmailRecord[]> {
    const list = await this.state.storage.list<EmailRecord>({
      prefix: 'msg:',
      limit: 50,
      reverse: true,
    });
    const records = Array.from(list.values());
    // ترتيب تنازلي حسب وقت الاستلام
    records.sort(
      (a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
    );
    return records;
  }

  /**
   * إتلاف وحرق الصندوق فوريا ومسح الذاكرة بالكامل
   */
  private async burnAndDestroy(): Promise<void> {
    const sockets = this.state.getWebSockets();
    const burnedPayload = JSON.stringify({
      type: 'burned',
      message: 'تم إتلاف ومسح صندوق البريد المؤقت بناء على طلبك.',
    });

    for (const ws of sockets) {
      try {
        ws.send(burnedPayload);
        ws.close(1000, 'Mailbox burned by user');
      } catch {
        // تجاهل
      }
    }

    try {
      await this.state.storage.deleteAlarm();
    } catch {
      // في حال لم يكن الـ Alarm موجودا
    }

    // مسح كافة السجلات من التخزين المعزول
    await this.state.storage.deleteAll();
  }

  /**
   * معالج رسائل الـ WebSocket الواردة من العميل (Hibernation API)
   */
  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer): Promise<void> {
    try {
      const parsed = typeof message === 'string' ? JSON.parse(message) : {};
      
      // دعم فحص الاتصال (Heartbeat Ping)
      if (parsed.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong', time: Date.now() }));
        return;
      }

      // دعم طلب الحرق الفوري عبر رسالة WebSocket
      if (parsed.type === 'burn') {
        await this.burnAndDestroy();
        return;
      }

      // دعم طلب تمديد الصلاحية عبر رسالة WebSocket
      if (parsed.type === 'extend') {
        const currentExpiresAt = (await this.state.storage.get<number>('expiresAt')) || Date.now();
        const newExpiresAt = Math.max(Date.now(), currentExpiresAt) + 10 * 60 * 1000;
        await this.state.storage.put('expiresAt', newExpiresAt);
        await this.state.storage.setAlarm(newExpiresAt);

        const remainingSeconds = Math.max(0, Math.floor((newExpiresAt - Date.now()) / 1000));
        const payload = JSON.stringify({
          type: 'extended',
          expiresAt: newExpiresAt,
          remainingSeconds,
        });

        for (const sock of this.state.getWebSockets()) {
          try {
            sock.send(payload);
          } catch {}
        }
        return;
      }
    } catch {
      // تجاهل الرسائل غير المطابقة
    }
  }

  /**
   * معالج إغلاق اتصال WebSocket (Hibernation API)
   */
  async webSocketClose(
    _ws: WebSocket,
    _code: number,
    _reason: string,
    _wasClean: boolean
  ): Promise<void> {
    // Hibernation API يدير التنظيف تلقائيا في الخلفية
  }

  /**
   * دالة الـ Alarm: تستدعى تلقائيا بواسطة Cloudflare عند انتهاء الصلاحية
   * تمسح كل البيانات وتغلق اتصالات الـ WebSocket
   */
  async alarm(): Promise<void> {
    const sockets = this.state.getWebSockets();
    const expiredPayload = JSON.stringify({
      type: 'expired',
      message: 'انتهت صلاحية صندوق البريد المؤقت وتم إتلاف البيانات بالكامل بنجاح.',
    });

    for (const ws of sockets) {
      try {
        ws.send(expiredPayload);
        ws.close(1000, 'Session expired');
      } catch {
        // تجاهل
      }
    }

    // حذف كافة السجلات والرسائل لضمان الخصوصية التامة
    await this.state.storage.deleteAll();
  }
}
