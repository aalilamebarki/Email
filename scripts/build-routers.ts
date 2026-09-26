import fs from 'fs';
import path from 'path';

interface RouterItem {
  name: string;
  title: string;
  rel: string;
}

const routers: RouterItem[] = [
  {
    "name": "faq.html",
    "title": "الأسئلة الشائعة — FAQ | بريد مؤقت — Temp Mail",
    "rel": "faq.html"
  },
  {
    "name": "guide.html",
    "title": "دليل الاستخدام — User Guide | بريد مؤقت — Temp Mail",
    "rel": "guide.html"
  },
  {
    "name": "about.html",
    "title": "من نحن — About Us | بريد مؤقت — Temp Mail",
    "rel": "about.html"
  },
  {
    "name": "privacy.html",
    "title": "سياسة الخصوصية — Privacy Policy | بريد مؤقت — Temp Mail",
    "rel": "privacy.html"
  },
  {
    "name": "blog.html",
    "title": "المدونة والأدلة — Blog & Guides | بريد مؤقت — Temp Mail",
    "rel": "blog.html"
  },
  {
    "name": "article.html",
    "title": "الدليل الشامل — Comprehensive Guide | بريد مؤقت — Temp Mail",
    "rel": "article.html"
  },
  {
    "name": "articles/index.html",
    "title": "فهرس المقالات الـ 22 — Articles Index | بريد مؤقت — Temp Mail",
    "rel": "articles/index.html"
  },
  {
    "name": "articles/universal-verification-coverage.html",
    "title": "التغطية الشاملة لرسائل التحقق (Universal Verification Coverage): فك شفرات OTP والروابط الخفية بدقة 100% | بريد مؤقت — Temp Mail",
    "rel": "articles/universal-verification-coverage.html"
  },
  {
    "name": "articles/how-inbox-updates-live.html",
    "title": "التحديث اللحظي عبر WebSocket: كيف تصل الرسائل إلى شاشتك خلال ميلي ثانية بدون إعادة تحميل؟ | بريد مؤقت — Temp Mail",
    "rel": "articles/how-inbox-updates-live.html"
  },
  {
    "name": "articles/temp-mail-vs-spam-filters.html",
    "title": "البريد المؤقت وفلاتر السبام: معايير SPF و DKIM و DMARC وكيف نتجاوز الحجب الصارم؟ | بريد مؤقت — Temp Mail",
    "rel": "articles/temp-mail-vs-spam-filters.html"
  },
  {
    "name": "articles/magic-links-vs-otp.html",
    "title": "روابط التفعيل السحرية (Magic Links) مقابل رموز OTP: أيهما أكثر أماناً وتوافقاً مع البريد المؤقت؟ | بريد مؤقت — Temp Mail",
    "rel": "articles/magic-links-vs-otp.html"
  },
  {
    "name": "articles/what-happens-when-address-expires.html",
    "title": "ماذا يحدث عند انتهاء صلاحية البريد المؤقت؟ دورة التلف المشفر ومسح الذاكرة الحية 100% | بريد مؤقت — Temp Mail",
    "rel": "articles/what-happens-when-address-expires.html"
  },
  {
    "name": "articles/how-to-generate-address.html",
    "title": "كيفية توليد عنوان بريد مؤقت جديد عالي العشوائية وتغييره بنقرة واحدة | بريد مؤقت — Temp Mail",
    "rel": "articles/how-to-generate-address.html"
  },
  {
    "name": "articles/how-to-copy-address.html",
    "title": "نسخ عنوان البريد المؤقت بدقة وبدون مسافات خفية: تجنب أخطاء استمارات التسجيل | بريد مؤقت — Temp Mail",
    "rel": "articles/how-to-copy-address.html"
  },
  {
    "name": "articles/how-to-receive-otp.html",
    "title": "كيفية استقبال واستخراج أكواد التحقق (OTP) بنقرة واحدة وتفادي انتهاء مهلة الرمز | بريد مؤقت — Temp Mail",
    "rel": "articles/how-to-receive-otp.html"
  },
  {
    "name": "articles/how-to-open-verification-links.html",
    "title": "كيفية فتح روابط التحقق بأمان وحجب بكسلات التتبع وإعادة التوجيه الملغومة | بريد مؤقت — Temp Mail",
    "rel": "articles/how-to-open-verification-links.html"
  },
  {
    "name": "articles/temporary-email-for-software-testing.html",
    "title": "استخدام البريد المؤقت في اختبارات البرمجيات المؤتمتة (QA & E2E) عبر Playwright و Cypress | بريد مؤقت — Temp Mail",
    "rel": "articles/temporary-email-for-software-testing.html"
  },
  {
    "name": "articles/preventing-credential-stuffing-and-data-breaches.html",
    "title": "منع تسريب البيانات وهجمات حشو بيانات الاعتماد (Credential Stuffing) عبر البريد المؤقت | بريد مؤقت — Temp Mail",
    "rel": "articles/preventing-credential-stuffing-and-data-breaches.html"
  },
  {
    "name": "articles/disposable-email-vs-permanent-aliases.html",
    "title": "البريد المؤقت السريع مقابل الأسماء المستعارة الدائمة (Aliases): متى تستخدم كلاً منهما؟ | بريد مؤقت — Temp Mail",
    "rel": "articles/disposable-email-vs-permanent-aliases.html"
  },
  {
    "name": "articles/protecting-privacy-under-gdpr-ccpa.html",
    "title": "حماية الخصوصية الرقمية والحق في النسيان: الامتثال العملي لقوانين GDPR و CCPA عبر البريد المؤقت | بريد مؤقت — Temp Mail",
    "rel": "articles/protecting-privacy-under-gdpr-ccpa.html"
  },
  {
    "name": "articles/combating-marketing-trackers-and-spy-pixels.html",
    "title": "كشف بكسلات التجسس وحجب تعقب فتح رسائل البريد الإلكتروني: كيف تحمي خوادمنا الحافة هويتك؟ | بريد مؤقت — Temp Mail",
    "rel": "articles/combating-marketing-trackers-and-spy-pixels.html"
  },
  {
    "name": "articles/temporary-mail-for-free-trials-and-saas.html",
    "title": "كيفية تجربة خدمات SaaS والفترات المجانية بأمان دون فخاخ التجديد ورسائل الترويج المزعجة | بريد مؤقت — Temp Mail",
    "rel": "articles/temporary-mail-for-free-trials-and-saas.html"
  },
  {
    "name": "articles/secure-two-factor-authentication-workflows.html",
    "title": "المصادقة الثنائية 2FA: مقارنة أمان الرسائل القصيرة SMS مقابل البريد المؤقت ونموذج التهديد | بريد مؤقت — Temp Mail",
    "rel": "articles/secure-two-factor-authentication-workflows.html"
  },
  {
    "name": "articles/developer-guide-headless-testing-api.html",
    "title": "دليل المطورين: الربط البرمجي واستقبال الرسائل عبر Webhooks و REST API في بيئات الاختبار | بريد مؤقت — Temp Mail",
    "rel": "articles/developer-guide-headless-testing-api.html"
  },
  {
    "name": "articles/understanding-disposable-email-blocklists.html",
    "title": "القوائم السوداء للبريد المؤقت: كيف تصنف الخدمات العناوين وما استراتيجيتنا لضمان القبول؟ | بريد مؤقت — Temp Mail",
    "rel": "articles/understanding-disposable-email-blocklists.html"
  },
  {
    "name": "articles/zero-knowledge-inbox-architecture.html",
    "title": "معمارية المعرفة الصفرية (Zero-Knowledge): تخزين متطاير في الذاكرة الحية بدون أقراص صلبة | بريد مؤقت — Temp Mail",
    "rel": "articles/zero-knowledge-inbox-architecture.html"
  },
  {
    "name": "articles/avoiding-phishing-and-malicious-payloads.html",
    "title": "تعقيم محتوى البريد الإلكتروني وحماية المتصفح من حمولات التصيد الخبيثة والأكواد الملغومة | بريد مؤقت — Temp Mail",
    "rel": "articles/avoiding-phishing-and-malicious-payloads.html"
  },
  {
    "name": "articles/e-commerce-privacy-and-price-discrimination.html",
    "title": "التمييز في أسعار المتاجر الإلكترونية وحماية الخصوصية المالية: كيف يحميك البريد المؤقت من رفع الأسعار؟ | بريد مؤقت — Temp Mail",
    "rel": "articles/e-commerce-privacy-and-price-discrimination.html"
  },
  {
    "name": "articles/multi-device-inbox-sync-and-pwa.html",
    "title": "المزامنة المؤقتة متعددة الأجهزة وتطبيقات الويب التقدمية (PWA): خصوصية فورية على الهاتف والكمبيوتر | بريد مؤقت — Temp Mail",
    "rel": "articles/multi-device-inbox-sync-and-pwa.html"
  }
];

function generateRouterHTML(item: RouterItem) {
  const arUrl = '/ar/' + item.rel;
  const enUrl = '/en/' + item.rel;
  return `<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${item.title}</title>
    <link rel="canonical" href="https://freetemp.email${arUrl}" />
    <link rel="alternate" hreflang="ar" href="https://freetemp.email${arUrl}" />
    <link rel="alternate" hreflang="en" href="https://freetemp.email${enUrl}" />
    <link rel="alternate" hreflang="x-default" href="https://freetemp.email${enUrl}" />
    <script>
      (function () {
        try {
          var t = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
          document.documentElement.setAttribute('data-theme', t);
          if (t === 'dark') document.documentElement.classList.add('dark');
          else document.documentElement.classList.remove('dark');

          var p = localStorage.getItem('preferredLang');
          var userLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
          if (p === 'en' || (p && p !== 'ar') || (!p && !userLang.startsWith('ar'))) {
            window.location.replace('${enUrl}' + window.location.search + window.location.hash);
          } else {
            window.location.replace('${arUrl}' + window.location.search + window.location.hash);
          }
        } catch (e) {
          window.location.replace('${arUrl}');
        }
      })();
    </script>
  </head>
  <body class="bg-white text-black dark:bg-[#0D0D0D] dark:text-[#F5F5F5] flex items-center justify-center min-h-screen font-sans">
    <div class="text-center p-6">
      <div class="w-8 h-8 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p class="text-xs text-neutral-500 font-mono">Redirecting...</p>
    </div>
  </body>
</html>`;
}

for (const item of routers) {
  const targetPath = path.join(process.cwd(), item.name);
  const targetDir = path.dirname(targetPath);
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(targetPath, generateRouterHTML(item), 'utf8');

  const publicTargetPath = path.join(process.cwd(), 'public', item.name);
  const publicTargetDir = path.dirname(publicTargetPath);
  if (!fs.existsSync(publicTargetDir)) fs.mkdirSync(publicTargetDir, { recursive: true });
  fs.writeFileSync(publicTargetPath, generateRouterHTML(item), 'utf8');
}

console.log(`✓ Generated ${routers.length} localized root routers seamlessly.`);
