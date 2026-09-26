# توثيق وسياق المشروع الشامل (PROJECT_CONTEXT.md)
**مشروع بريد مؤقت (Temp Mail) — منصة البريد الإلكتروني المؤقت المعزول والآمن**

---

## 1. وصف المشروع (Project Description)
منصة ويب متكاملة وخدمة سحابية رائدة توفر عناوين بريد إلكتروني مؤقتة وفورية مجانية بدون تسجيل أو تتبع، تهدف إلى حماية الخصوصية ومنع الرسائل المزعجة (Spam) واستقبال رسائل التفعيل وأكواد التحقق الثنائي (OTP / 2FA) والروابط المباشرة في الوقت الفعلي عبر اتصال WebSocket المباشر.

* **النطاق الأساسي للخدمة:** `freetemp.email`
* **الهوية البصرية والأسلوب:** تصميم حديث مستوحى من بساطة وأناقة منتجات Google (Clean Minimalist Google-Style Design) مع دعم الوضعين الداكن والفاتح (Dark/Light Mode) والخط المحلي المخصص (Cairo Font).
* **اللغات المدعومة:** نظام دولي يدعم أكثر من 22 لغة عالمية مع توجيه ذكي وكشف تلقائي للغة المتصفح ودعم اتجاهات الكتابة (RTL / LTR).

---

## 2. بنية الملفات (File Structure)

```text
├── .env.example
├── .gitignore
├── metadata.json
├── package.json
├── tsconfig.json
├── vite.config.ts
├── wrangler.toml
├── robots.txt
├── sitemap.xml
├── PROJECT_CONTEXT.md
├── index.html                   # صفحة البداية والموجه العام / النسخة العربية
├── blog.html                    # موجه لغة المدونة العام
├── article.html                 # موجه لغة صفحة المقال الرئيسية
├── ar/                          # قسم اللغة العربية
│   ├── index.html               # الصفحة الرئيسية العربية
│   ├── blog.html                # صفحة المدونة المجمعة
│   ├── article.html             # صفحة المقال الفردي الرئيسية (الدليل الشامل 2026)
│   ├── guide.html               # دليل التشغيل والاستخدام السريع
│   ├── faq.html                 # صفحة الأسئلة الشائعة والمركز القانوني
│   ├── about.html               # صفحة عن المنصة
│   ├── privacy.html             # سياسة الخصوصية
│   └── articles/                # مقالات المدونة العربية
│       ├── index.html
│       ├── how-to-generate-address.html
│       ├── how-to-copy-address.html
│       ├── how-inbox-updates-live.html
│       ├── how-to-receive-otp.html
│       ├── how-to-open-verification-links.html
│       ├── what-happens-when-address-expires.html
│       ├── temp-mail-vs-spam-filters.html
│       ├── universal-verification-coverage.html
│       └── magic-links-vs-otp.html
├── en/                          # قسم اللغة الإنجليزية
│   ├── index.html               # الصفحة الرئيسية الإنجليزية
│   ├── blog.html                # صفحة المدونة الإنجليزية
│   ├── article.html             # صفحة المقال الفردي الإنجليزية
│   ├── guide.html               # دليل الاستخدام بالإنجليزية
│   ├── faq.html                 # صفحة الأسئلة الشائعة بالإنجليزية
│   ├── about.html               # صفحة About بالإنجليزية
│   ├── privacy.html             # صفحة Privacy بالإنجليزية
│   └── articles/                # مقالات المدونة الإنجليزية
│       ├── index.html
│       ├── how-to-generate-address.html
│       ├── how-to-copy-address.html
│       ├── how-inbox-updates-live.html
│       ├── how-to-receive-otp.html
│       ├── how-to-open-verification-links.html
│       ├── what-happens-when-address-expires.html
│       ├── temp-mail-vs-spam-filters.html
│       ├── universal-verification-coverage.html
│       └── magic-links-vs-otp.html
├── shared/                      # الموارد البرمجية والأنماط المشتركة
│   ├── app.js                   # منطق تطبيق الواجهة والتحكم بالصندوق و WebSocket
│   ├── i18n.js                  # محرك الترجمة والقواميس للغات الـ 22
│   ├── theme.js                 # إدارة المظهر الفاتح والداكن وحفظ التفضيل
│   ├── style.css                # التنسيقات المخصصة والتحسينات البصرية
│   └── purify.min.js            # مكتبة تنقية كود HTML للرسائل لمنع ثغرات XSS
├── fonts/                       # ملفات الخطوط المحلية (Cairo Fonts)
│   ├── fonts.css
│   ├── Cairo-Regular.ttf
│   ├── Cairo-Medium.ttf
│   ├── Cairo-SemiBold.ttf
│   ├── Cairo-Bold.ttf
│   └── Cairo-ExtraBold.ttf
├── worker/                      # الكود الخلفي السحابي (Cloudflare Workers & DO)
│   └── src/
│       ├── index.ts             # نقطة الدخول، معالج Email Routing و HTTP/WebSocket
│       ├── mailbox-do.ts        # كائن Durable Object المعزول وتخزين SQLite
│       ├── parser.ts            # استخراج أكواد OTP والروابط وتنظيف الرسائل
│       └── address.ts           # توليد العناوين العشوائية المشفرة وتوليد التوكن
├── scripts/                     # سكربتات التطوير والأتمتة والسيو
│   ├── generate-sitemap.ts      # توليد خريطة الموقع sitemap.xml مع hreflang
│   ├── verify-faq-seo.ts        # تدقيق قواعد السيو والـ Schema.org
│   ├── generate-og-image.ts     # توليد صور المشاركة الاجتماعية OpenGraph
│   ├── test-parser.ts           # اختبارات دقة استخراج أكواد التحقق
│   └── capture-screenshots.js   # التقاط لقطات شاشة للتوثيق
└── public/                      # الملفات الثابتة والموزعة للإنتاج
```

---

## 3. وظيفة كل ملف (Function of Each File)

| الملف | الوظيفة التفصيلية |
| :--- | :--- |
| `index.html` | نقطة الدخول الرئيسية، واجهة الصندوق التفاعلي المباشر باللغة العربية مع دعم التبديل الفوري للغات الأخرى. |
| `shared/app.js` | كود الواجهة التفاعلي: الاتصال بالـ Backend، إدارة الـ WebSocket، توليد وحفظ العنوان والتوكن في LocalStorage، نسخ الأكواد، وتمديد وحرق الصندوق. |
| `shared/i18n.js` | محرك الترجمة الفوري لـ 22 لغة، إدارة نافذة اختيار اللغة، وتطبيق النصوص ديناميكياً عبر وسوم `data-i18n`. |
| `shared/theme.js` | إدارة وتطبيق السمة (Dark/Light) دون وميض FOUC مع حفظ التفضيل ومراعاة إعدادات نظام المستخدم. |
| `shared/purify.min.js` | تنظيف محتوى الرسائل الواردة ومنع تشغيل السكربتات الخبيثة (XSS Sanitizer). |
| `worker/src/index.ts` | خادم Cloudflare Worker: يستقبل البريد عبر Email Routing، يحلل الرسائل بـ `postal-mime`، ويوجهها للـ Durable Object، ويعالج واجهات برمجة التطبيقات و WebSocket. |
| `worker/src/mailbox-do.ts` | يمثل صندوق البريد المعزول (Durable Object) بنظام تخزين محلي مستقل ومؤقت ذاتي (Alarm) للحذف التلقائي بعد 20 دقيقة. |
| `worker/src/parser.ts` | محرك التعبير النمطي (Regex) المتقدم لاكتشاف واستخراج أكواد التحقق (Google G-XXXX, Steam Guard, 4-8 Digit OTP) وروابط التفعيل داخل الأزرار. |
| `worker/src/address.ts` | توليد أسماء بريد عشوائية ذكية مع توليد رمز أمان سري (Secret Token) مشفر لكل عنوان بريد لمنع الوصول غير المصرح به. |
| `scripts/generate-sitemap.ts` | بناء وتحديث ملف `sitemap.xml` آلياً ليشمل كافة مسارات الموقع وروابط اللغات التبادلية `hreflang`. |

---

## 4. التقنيات والمكتبات (Technologies & Libraries)
* **واجهة المستخدم (Frontend):** Vanilla JavaScript (ESNext)، Tailwind CSS v4، معالجة HTML5 دلالية ونظيفة.
* **الخادم السحابي والـ Backend:** Cloudflare Workers (TypeScript)، Cloudflare Email Routing، Cloudflare Durable Objects مع نظام SQLite التخزيني المعزول.
* **الأمان وتنقية البيانات:** DOMPurify (تنقية HTML)، Postal-Mime (تحليل البريد)، CSP Headers صارمة، عزل الصور الخارجية لحماية الـ IP.
* **أدوات البناء والسيو:** Vite 6، TypeScript 5، TSX، Playwright، Schema.org JSON-LD (WebSite, SoftwareApplication, FAQPage, BlogPosting, BreadcrumbList).

---

## 5. قاعدة البيانات والجداول (Database & Storage)
الخدمة لا تعتمد على قاعدة بيانات مركزية تقليدية لتفادي تسريب البيانات، بل تستخدم **تخزيناً معزولاً بنظام O(1) عبر Cloudflare Durable Objects مع محرك SQLite الداخلي**:
* **مفتاح الصندوق:** `address` (معرف حتمي `env.MAILBOX.idFromName(address)`).
* **الحقول المخزنة في كل كائن Durable Object:**
  * `secret_token` (String): رمز الأمان السري المطلوب للتحقق من هوية المتصفح قبل عرض أي رسالة.
  * `expiresAt` (Timestamp): وقت انتهاء صلاحية الصندوق الفعلي.
  * `messages` (Array of EmailRecord): قائمة الرسائل المستلمة (بحد أقصى 50 رسالة لكل صندوق لتفادي استهلاك الذاكرة).
* **نظام التدمير الذاتي (Alarm):** يتم جدولة Alarm لحذف كافة البيانات نهائياً ومسح الكائن من ذاكرة Cloudflare فور بلوغ `expiresAt`.

---

## 6. المتغيرات المطلوبة في `.env` و `wrangler.toml`

### في ملف `.env`:
* `APP_URL`: رابط استضافة التطبيق (يُحقن تلقائياً في بيئة Cloud Run / AI Studio).
* `GEMINI_API_KEY`: مفتاح واجهة Gemini API (في حال تفعيل ميزات الذكاء الاصطناعي المستقبلية).

### في ملف `wrangler.toml`:
* `DOMAIN`: النطاق المعتمد للبريد (`freetemp.email`).
* `EXPIRY_MINUTES`: مدة صلاحية الصندوق الافتراضية بالدقائق (`20`).
* `MAILBOX`: ربط الـ Durable Object من فئة `MailboxDO`.
* `TURNSTILE_SECRET_KEY`: مفتاح التحقق من Cloudflare Turnstile لمنع الهجمات الآلية (اختياري).

---

## 7. الـ APIs المستخدمة والمسارات (API & WebSocket Endpoints)

| المسار | الطريقة | الوظيفة |
| :--- | :--- | :--- |
| `/api/new-address` | `GET` / `POST` | توليد عنوان بريد جديد وتخصيص Durable Object وتوليد التوكن وحساب وقت الانتهاء. |
| `/api/ws?address={addr}&token={tok}` | `WebSocket` | فتح اتصال WebSocket ثنائي الاتجاه لاستقبال الرسائل وتحديثات الصندوق فورياً. |
| `/api/emails?address={addr}&token={tok}` | `GET` | جلب الرسائل المخزنة في الصندوق عبر HTTP في حال عدم توفر WebSocket. |
| `/api/extend` | `POST` | تمديد صلاحية الصندوق لمدة 10 دقائق إضافية مع التحقق من التوكن. |
| `/api/burn` | `POST` / `DELETE` | إتلاف الصندوق وحرق كافة الرسائل المخزنة فورياً ومسح التخزين. |
| `/health` | `GET` | التحقق من جاهزية وحالة خادم الـ Worker. |

---

## 8. ما تم إنجازه (Accomplishments)
1. **هندسة العزل والأمان:** بناء محرك Durable Objects المعزول O(1) مع حماية البريد من الفقدان الصامت، وحماية الذاكرة من الانهيار (OOM Protection) بسقف 5MB لكل رسالة.
2. **محرك استخراج رموز التحقق (OTP):** دعم كافة صيغ الأكواد العالمية (Google G-Token, Steam Guard, 4-8 Digits, Hyphenated codes) مع زر النسخ السريع بضغطة واحدة.
3. **تصميم المقال الفردي (Article Page):** إنشاء صفحة مقال رئيسية احترافية (`ar/article.html` و `en/article.html`) بمعايير سيو عالمية تشمل مؤشر القراءة، جدول المحتويات، الروابط الداخلية، والـ Schema.org الغنية.
4. **السيو الدولي المتكامل:** تهيئة وسوم Canonical و Hreflang لجميع الصفحات والمقالات وتحديث الـ Sitemap التلقائي.
5. **الخطوط المحلية النظيفة:** اعتماد خط Cairo المحلي لسرعة التحميل، مع إزالة التشكيل بنسبة 100% لضمان مظهر رقمي عصري.

---

## 9. المشاكل الحالية والملاحظات (Current Issues & Observations)
1. **مشكلة تبديل اللغة الجزئي (Language Mixing Bug):** عند الانتقال من العربية إلى لغات أخرى على الصفحة الرئيسية أو بعض الصفحات الداخلية، تظهر بعض النصوص باللغة الإنجليزية وبعضها بالعربية بسبب نقص وسوم `data-i18n` لبعض النصوص الثابتة، أو عدم اكتمال قواميس بعض اللغات في `shared/i18n.js`.
2. **ترجمة مقالات المدونة إلى باقي اللغات:** حالياً المقالات التفصيلية مكتوبة بالعربية والإنجليزية فقط، بينما الموقع يعرض دعماً لأكثر من 20 لغة، والمطلوب توفير ترجمات شاملة أو توجيه محكم لكافة اللغات المدعومة.
3. **خطة الربط الداخلي للكلمات المفتاحية (Internal Anchor Linking):** الحاجة إلى تعزيز الروابط النصية (Anchor Links) بين المقالات المختلفة داخل المدونة وصفحة الأداة الرئيسية ودليل الاستخدام.

---

## 10. آخر شيء كان يعمل عليه (Latest Work in Progress)
* تطوير وتدقيق صفحة المقال الفردي الرئيسية (`article.html` / `ar/article.html` / `en/article.html`) وإدراجها في خطة السيو والشبكة الداخلية للروابط.
* حل مشكلة التبديل الفوري للغات وضمان خلو الصفحة الرئيسية من أي نصوص عربية مختلطة عند اختيار لغة أجنبية والعكس.
* توسيع مقالات المدونة بخطة محتوى متماسكة تربط بين أدلة الاستخدام، حماية الخصوصية، الفروقات بين OTP والروابط السحرية، وتخطي فلاتر الرسائل المزعجة.

---

## 11. التعليمات والشروط الصارمة التي يجب عدم تغييرها (Critical Rules & Constraints)
1. **بيئة التشغيل:** خادم التطوير يجب أن يعمل دائماً على المنفذ `3000` (`--port=3000 --host=0.0.0.0`).
2. **النصوص العربية:** الحفاظ الصارم على **عدم وضع أي تشكيل (حركات/تنوين)** على الكلمات العربية في كافة صفحات الموقع والمقالات لضمان الهوية البصرية النظيفة.
3. **الخطوط:** الاعتماد حصراً على الخط المحلي `Cairo` في `public/fonts` دون تحميل خطوط خارجية من Google Fonts لمنع تعقب المستخدمين وتسريع التحميل.
4. **الأمان والخصوصية:** منع تحميل الصور الخارجية في الرسائل تلقائياً؛ يجب حجبها افتراضياً لحماية عنوان IP الخاص بالزائر، مع توفير زر يدوي لإظهار الصور.
5. **حظر النوافذ المزعجة:** عدم استخدام `window.alert` أو `window.open` والاعتماد على نوافذ المودال الداخلية وبطاقات الإشعار المدمجة.
6. **سيو وروابط الصفحات:** يجب أن يتطابق أي تعديل في الصفحات مع تحديث `sitemap.xml` ووسوم `hreflang` و `canonical` للحفاظ على تصنيف محركات البحث.
