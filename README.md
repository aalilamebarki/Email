# بريد مؤقت (Temp Mail) — Cloudflare Workers & Durable Objects

تطبيق بريد إلكتروني مؤقت فائق الأداء والسرعة، مبني على أحدث معمارية الحوسبة السحابية الطرفية (Edge Computing) باستخدام **Cloudflare Workers** و **Durable Objects** مع بث مباشر عبر **WebSocket Hibernation API**.

---

## 🌟 المعمارية التقنية ومبدأ العزل المطلق

1. **عزل حتمي O(1) لكل عنوان بريدي**:
   - لا توجد قاعدة بيانات مركزية مشتركة.
   - كل عنوان بريدي يتم توليده يرتبط برياضيات الـ Hashing بكائن **Durable Object** فريد عبر `env.MAILBOX.idFromName(fullEmail)`.
   - يستحيل اختلاط الرسائل بين المستخدمين حتى لو تزامن ملايين الزوار في نفس اللحظة.

2. **WebSocket Hibernation API**:
   - لا حاجة للـ Polling المستمر.
   - الخادم يوفر استهلاك الذاكرة عبر وضع السبات (Hibernation) ويستيقظ فقط عند وصول رسالة جديدة لبثها للعميل في أجزاء من الثانية.

3. **تحليل آمن واستخراج ذكي**:
   - مكتبة `postal-mime` لتحليل رسائل البريد الخام على الـ Edge.
   - استخراج تلقائي وفوري لأكواد التحقق **OTP** وروابط التفعيل.
   - حماية ضد هجمات XSS باستخدام `DOMPurify` داخل إطار `<iframe sandbox="allow-same-origin">` خالي من أي تصريح تشغيل سكربتات (`allow-scripts`).

4. **إتلاف ذاتي تلقائي (Self-Destruction Alarms)**:
   - استخدام `state.storage.setAlarm` لحذف كافة السجلات المخزنة وإغلاق الاتصالات فور انتهاء مدة الصلاحية (20 دقيقة).

---

## 🚀 خطوات النشر والإعداد الكامل لدومين `freetemp.email`

### 1. إعداد الـ Worker ونشره

من داخل مجلد المشروع، نفّذ الأمر التالي:

```bash
cd worker
npx wrangler deploy
```

> **ملاحظة**: تم تفعيل إعداد التخزين `new_sqlite_classes = ["MailboxDO"]` في ملف `wrangler.toml` ليتوافق مع الخطة المجانية لحسابات Cloudflare بدون أي تكلفة إضافية.

---

### 2. ربط الدومين وتفعيل استقبال البريد (Email Routing)

1. افتح لوحة تحكم [Cloudflare Dashboard](https://dash.cloudflare.com).
2. اختر دومينك: **`freetemp.email`**.
3. من القائمة الجانبية، انتقل إلى **Email Routing**.
4. اضغط على **Enable Email Routing**؛ ستقوم Cloudflare بإضافة سجلات الـ DNS (سجلات MX و SPF) تلقائياً.

#### سجلات الـ DNS المطلوبة:
| النوع (Type) | الاسم (Name) | القيمة (Value) | الأولوية (Priority) |
|---|---|---|---|
| MX | `@` | `route1.mx.cloudflare.net` | 91 |
| MX | `@` | `route2.mx.cloudflare.net` | 67 |
| MX | `@` | `route3.mx.cloudflare.net` | 94 |
| TXT | `@` | `v=spf1 include:_spf.mx.cloudflare.net ~all` | - |

---

### 3. إعداد قاعدة التوجيه الشامل (Catch-all Rule)

1. في صفحة **Email Routing** للدومين، افتح تبويب **Routing rules**.
2. ابحث عن قسم **Catch-all rule** واضغط **Edit**.
3. اجعل الحالة **Active**.
4. في خانة **Action**: اختر **Send to a Worker**.
5. في خانة **Worker**: اختر الـ Worker المسمى **`temp-mail`**.
6. اضغط **Save**.

الآن، أي رسالة تُرسل لأي عنوان بصيغة `*@freetemp.email` سيتم تمريرها فوراً للـ Worker وتخزينها في الـ Durable Object وبثها إلى واجهة المتصفح المفتوحة!

---

## 🛡️ طبقات الحماية الأربع المطبقة (Security & Privacy Layers)

### 1. منع إساءة الاستخدام والسبام (Anti-Abuse & Anti-Bot)
- **Cloudflare Turnstile**: مدعوم اختيارياً عبر مسار `/api/new-address`. لإعداده:
  1. انتقل إلى Cloudflare Dashboard -> **Turnstile** -> أنشئ Widget جديد لنطاقك.
  2. أضف المفتاح السري كـ Secret للـ Worker:
     ```bash
     cd worker
     npx wrangler secret put TURNSTILE_SECRET_KEY
     ```
- **تحديد المعدل (Cloudflare WAF Rate Limiting)**:
  1. في Cloudflare Dashboard -> الدومين **freetemp.email** -> **Security** -> **WAF** -> **Rate limiting rules**.
  2. أنشئ قاعدة جديدة:
     * **Field**: URI Path
     * **Operator**: equals
     * **Value**: `/api/new-address`
     * **Rate**: 10 requests per 10 minutes per IP.
     * **Action**: Block أو Managed Challenge (Turnstile).
- **حد أقصى للرسائل لكل عنوان (Mailbox Capacity Limit)**:
  * يرفض كائن `MailboxDO` استلام أكثر من 50 رسالة لنفس الصندوق لمنع هجمات الإغراق البريدي (Email Bombing).

### 2. حماية البنية التحتية (Resource Protection)
- **حد أقصى لاتصالات WebSocket**: بحد أقصى 5 اتصالات متزامنة لكل صندوق بريد لمنع استنزاف الموارد.
- **حد أقصى لحجم الرسالة (Max Email Size)**: رفض فوري لأي رسالة تتجاوز 5 ميجابايت قبل قراءتها وتحليلها لمنع استنزاف الذاكرة.
- **مهلة زمنية صارمة للتحليل (Parsing Timeout)**: مهلة 5 ثوانٍ لتحليل الرسالة بمكتبة `postal-mime` عبر `Promise.race` لمنع تجميد أو تعليق الـ Worker.
- **ترويسات أمان HTTP قياسية**: تطبيق ترويسات `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, و `Content-Security-Policy`.

### 3. خصوصية وحماية بيانات الرسائل (Zero-Logs & Privacy Verification)
- **إتلاف كامل ومؤكد**: عند تشغيل `alarm()` أو طلب الحرق الفوري (`/api/burn`)، يتم استدعاء `state.storage.deleteAll()` لمسح كافة السجلات والمفاتيح فوراً.
- **عدم تخزين عناوين IP**: لا يتم حفظ أو ربط عنوان IP للمرسل أو الزائر بالرسائل بأي شكل.
- **بنية تحتية خاصة 100%**: لا تُستخدم أي خدمات بريد وسيطة كـ Mail.tm أو 1secmail نهائياً.
- **حجب بكسلات التتبع وعزل HTML**: تنقية صارمة بـ DOMPurify وحظر وسوم الصور والمصادر الخارجية افتراضياً لحماية عنوان IP المستخدم من التسريب.

---

## 📁 هيكلية المشروع

```
project/
├── worker/
│   ├── src/
│   │   ├── index.ts        # نقطة الدخول: fetch() + email() handlers
│   │   ├── mailbox-do.ts   # كلاس MailboxDO (WebSocket Hibernation + Alarms + Storage)
│   │   ├── parser.ts       # محرك استخراج OTP والروابط التشعبية
│   │   └── address.ts      # دالة توليد العنوان العشوائي السريع
│   └── wrangler.toml       # إعدادات Durable Objects و SQLite
├── frontend/
│   ├── index.html          # واجهة مستخدم أحادية Monochrome (أبيض وأسود) + سيو كامل
│   └── app.js              # منطق الـ WebSocket واستقبال الرسائل والنسخ
└── README.md               # دليل التشغيل والتوثيق الشامل
```

---

## 🔒 معايير الأمان والخصوصية
* صفر ملفات تعريف ارتباط (No Tracking Cookies).
* صفر إعلانات أو نصوص خارجية غير ضرورية.
* استجابة كاملة للجوال وعناصر تحكم سهلة الوصول (Touch Friendly).
