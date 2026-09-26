// scripts/test-linkify.cjs
const group1 = require('./articles/group1.cjs');
const group2 = require('./articles/group2.cjs');
const group3 = require('./articles/group3.cjs');
const group4 = require('./articles/group4.cjs');

const allArticles = [...group1, ...group2, ...group3, ...group4];

const KEYWORD_RULES = {
  ar: [
    {
      slug: 'universal-verification-coverage',
      terms: ['التغطية الشاملة لرسائل التحقق', 'Universal Verification Coverage', 'أكواد Google G-', 'أكواد Steam Guard', 'فك شفرات OTP', 'فك شفرات رموز التحقق', 'محرك التغطية الشاملة']
    },
    {
      slug: 'real-time-websocket-streaming',
      terms: ['البث الحي عبر WebSocket', 'بروتوكول WebSocket', 'اتصال WebSocket', 'تقنية WebSockets', 'خوادم WebSocket', 'Server-Sent Events', 'WebSockets', 'WebSocket']
    },
    {
      slug: 'temp-mail-vs-spam-filters',
      terms: ['فلاتر البريد العشوائي', 'فلاتر السبام', 'مرشحات البريد العشوائي', 'سجلات SPF و DKIM و DMARC', 'سجلات SPF', 'سجلات DKIM', 'سجلات MX', 'بروتوكول SMTP', 'خوادم SMTP', 'سمعة النطاقات']
    },
    {
      slug: 'magic-links-vs-otp',
      terms: ['روابط التفعيل السحرية', 'روابط Magic Links', 'المصادقة عبر Magic Links', 'مقارنة Magic Links و OTP', 'Magic Links', 'روابط ماجيك']
    },
    {
      slug: 'what-happens-when-address-expires',
      terms: ['انتهاء صلاحية البريد', 'انتهاء صلاحية العنوان', 'دورة حياة البريد المؤقت', 'تفريغ الذاكرة المشفرة', 'حذف البيانات التلقائي', 'إتلاف الصندوق', 'انتهاء الصلاحية']
    },
    {
      slug: 'how-to-generate-address',
      terms: ['توليد عنوان بريد جديد', 'إنشاء بريد مؤقت جديد', 'توليد عنوان بريد', 'توليد بريد مؤقت', 'إنشاء عنوان جديد', 'تغيير عنوان البريد', 'توليد عنوان']
    },
    {
      slug: 'how-to-copy-address',
      terms: ['نسخ عنوان البريد', 'نسخ العنوان المؤقت', 'واجهة الحافظة Clipboard', 'نسخ البريد بنقرة واحدة', 'الحافظة الرقمية', 'نسخ العنوان', 'الحافظة']
    },
    {
      slug: 'how-to-receive-otp',
      terms: ['استقبال واستخراج أكواد التحقق', 'استلام كود التحقق', 'استخراج رمز التحقق', 'استقبال أكواد OTP', 'نسخ كود التحقق', 'استلام رمز OTP', 'رموز التحقق', 'أكواد التحقق', 'كود التحقق', 'رمز التحقق', 'أكواد OTP', 'رمز OTP']
    },
    {
      slug: 'how-to-open-verification-links',
      terms: ['فتح روابط التفعيل بأمان', 'معاينة الروابط الآمنة', 'فحص روابط التفعيل', 'تجريد روابط التفعيل', 'روابط التفعيل', 'رابط التفعيل', 'روابط التحقق']
    },
    {
      slug: 'how-inbox-updates-live',
      terms: ['تحديث الصندوق اللحظي', 'تحديث صندوق الوارد', 'المزامنة الفورية', 'بدون إعادة تحميل الصفحة', 'بدون تحديث الصفحة', 'تحديث الصندوق']
    },
    {
      slug: 'managing-multiple-temp-addresses',
      terms: ['إدارة عناوين بريد مؤقتة متعددة', 'فصل الهويات الرقمية', 'استخدام عناوين بريد متعددة', 'عزل الحسابات', 'عناوين بريد متعددة', 'عناوين متعددة']
    },
    {
      slug: 'pwa-desktop-mobile-guide',
      terms: ['تطبيق الويب التقدمي (PWA)', 'تطبيق PWA', 'تثبيت تطبيق PWA', 'تطبيق الويب التقدمي', 'تثبيت البريد المؤقت كتطبيق', 'تطبيق PWA']
    },
    {
      slug: 'preventing-credential-stuffing-and-data-breaches',
      terms: ['هجمات حشو الاعتماد', 'هجمات Credential Stuffing', 'تسريب البيانات', 'تسريبات البيانات', 'اختراق الحسابات', 'حشو بيانات الاعتماد', 'تسريبات قواعد البيانات', 'Credential Stuffing']
    },
    {
      slug: 'disposable-email-vs-marketing-trackers',
      terms: ['متتبعات التسويق الإعلاني', 'البريد المؤقت مقابل متتبعات التسويق', 'ملفات التعريف الإعلانية', 'شركات الإعلانات والتعقب', 'متتبعات التسويق', 'التتبع الإعلاني']
    },
    {
      slug: 'gdpr-ccpa-compliance-ephemeral-data',
      terms: ['الامتثال لمعايير GDPR و CCPA', 'معايير GDPR', 'قانون CCPA', 'لوائح حماية البيانات', 'حق النسيان والمسح الفوري', 'قوانين الخصوصية العالمية', 'معايير الخصوصية', 'GDPR', 'CCPA']
    },
    {
      slug: 'combating-marketing-trackers-and-spy-pixels',
      terms: ['بكسلات التجسس Spy Pixels', 'بكسلات التتبع الخفية', 'بكسلات التجسس', 'حجب بكسلات التجسس', 'بكسلات التتبع', 'Spy Pixels']
    },
    {
      slug: 'phishing-defense-and-safe-previews',
      terms: ['الدفاع ضد هجمات التصيد الاحتيالي', 'هجمات التصيد الاحتيالي', 'رسائل التصيد', 'المعاينة الآمنة للرسائل المشبوهة', 'مكافحة التصيد', 'هجمات التصيد']
    },
    {
      slug: 'temporary-email-for-software-testing',
      terms: ['اختبار البرمجيات', 'بيئات QA و Staging و CI/CD', 'أتمتة اختبارات التسجيل', 'اختبار تدفقات التسجيل', 'بيئات الاختبار', 'اختبارات QA', 'CI/CD']
    },
    {
      slug: 'zero-knowledge-inbox-architecture',
      terms: ['معمارية عدم المعرفة Zero-Knowledge', 'معمارية Zero-Knowledge', 'الأمان بالمعرفة الصفرية', 'المعرفة الصفرية', 'Zero-Knowledge Architecture', 'Zero-Knowledge', 'الذاكرة الحية (RAM)', 'الذاكرة الحية']
    },
    {
      slug: 'bypass-email-verification-paywalls',
      terms: ['تجاوز جدران التحقق والاشتراك الإجباري', 'جدران حجب المحتوى', 'جدران التحقق', 'المحتوى المحجوب', 'Gated Content', 'جدران التسجيل', 'المحتوى المقفل']
    },
    {
      slug: 'temp-mail-for-newsletter-safety',
      terms: ['تجربة النشرات الإخبارية بأمان', 'قوائم البريد التجريبية', 'فحص النشرات البريدية', 'النشرات البريدية', 'النشرات الإخبارية', 'نشرة بريدية']
    },
    {
      slug: 'temporary-sms-vs-temporary-email',
      terms: ['أرقام SMS المؤقتة مقابل البريد المؤقت', 'رسائل SMS المؤقتة', 'أرقام SMS المؤقتة', 'أرقام SMS', 'رسائل SMS', 'خدمات SMS المؤقتة']
    }
  ],
  en: [
    {
      slug: 'universal-verification-coverage',
      terms: ['Universal Verification Coverage', 'UVC engine', 'Google G-tokens', 'Steam Guard alphanumeric codes', 'alphanumeric OTPs', 'complex OTP extraction']
    },
    {
      slug: 'real-time-websocket-streaming',
      terms: ['real-time WebSocket streaming', 'WebSocket protocol', 'WebSocket streaming', 'WebSockets', 'Server-Sent Events (SSE)', 'Server-Sent Events', 'WebSocket connection', 'WebSocket']
    },
    {
      slug: 'temp-mail-vs-spam-filters',
      terms: ['SPF, DKIM, and DMARC standards', 'SPF, DKIM, and DMARC', 'SPF and DKIM', 'DNS MX records', 'MX records', 'SMTP protocol', 'SMTP servers', 'spam filters', 'anti-spam filters', 'Bayesian filters', 'domain reputation', 'SMTP']
    },
    {
      slug: 'magic-links-vs-otp',
      terms: ['Magic Links vs OTP verification', 'Magic Link authentication', 'passwordless magic links', 'Magic Links', 'magic links', 'Magic Link tokens']
    },
    {
      slug: 'what-happens-when-address-expires',
      terms: ['disposable mailbox lifecycle', 'address expiration purge', 'cryptographic memory purge', 'cryptographic purge', 'zero-retention lifecycle', 'address expiration', 'memory purge', 'mailbox expiration']
    },
    {
      slug: 'how-to-generate-address',
      terms: ['generating high-entropy addresses', 'generating disposable addresses', 'rotating disposable mailboxes', 'generate a new email address', 'generating fresh addresses', 'generate disposable addresses']
    },
    {
      slug: 'how-to-copy-address',
      terms: ['copying email address cleanly', 'sanitized clipboard copying', 'clipboard API', 'copying the email address', 'one-click address copying', 'clipboard']
    },
    {
      slug: 'how-to-receive-otp',
      terms: ['receiving and parsing OTP codes', 'extracting verification codes', 'receiving OTP codes', 'instant passcode capture', 'OTP extraction workflow', 'OTP verification codes', 'verification codes', 'OTP codes', 'passcodes', 'OTP']
    },
    {
      slug: 'how-to-open-verification-links',
      terms: ['opening verification links safely', 'dissecting tracking redirects', 'safe URL inspection', 'opening verification links', 'safe link inspection', 'activation links', 'verification links']
    },
    {
      slug: 'how-inbox-updates-live',
      terms: ['live inbox streaming updates', 'zero-reload mailbox sync', 'real-time polling push', 'live inbox updates', 'real-time mailbox synchronization', 'zero-reload']
    },
    {
      slug: 'managing-multiple-temp-addresses',
      terms: ['managing multiple disposable inboxes', 'identity compartmentalization', 'siloed email profiles', 'multiple disposable inboxes', 'multiple temporary addresses', 'multiple inboxes']
    },
    {
      slug: 'pwa-desktop-mobile-guide',
      terms: ['Progressive Web App installation', 'PWA standalone mode', 'Progressive Web App (PWA)', 'Progressive Web App', 'PWA installation', 'PWA']
    },
    {
      slug: 'preventing-credential-stuffing-and-data-breaches',
      terms: ['preventing credential stuffing attacks', 'credential stuffing attacks', 'credential stuffing', 'data breaches', 'database leakages', 'account takeovers']
    },
    {
      slug: 'disposable-email-vs-marketing-trackers',
      terms: ['disposable email vs marketing trackers', 'marketing trackers', 'commercial email trackers', 'behavioral advertising profiles', 'tracking networks', 'advertising networks']
    },
    {
      slug: 'gdpr-ccpa-compliance-ephemeral-data',
      terms: ['GDPR and CCPA privacy compliance', 'GDPR and CCPA compliance', 'GDPR compliance', 'CCPA compliance', 'data protection regulations', 'Right to be Forgotten', 'GDPR', 'CCPA']
    },
    {
      slug: 'combating-marketing-trackers-and-spy-pixels',
      terms: ['combating spy pixels and email telemetry', 'spy pixel neutralization', 'invisible tracking beacons', 'spy pixels', 'tracking pixels', '1x1 tracking GIFs']
    },
    {
      slug: 'phishing-defense-and-safe-previews',
      terms: ['phishing defense and safe previews', 'phishing defense', 'phishing attacks', 'spear-phishing emails', 'safe sandbox email previews', 'anti-phishing protection', 'phishing']
    },
    {
      slug: 'temporary-email-for-software-testing',
      terms: ['temporary email for software testing', 'QA and CI/CD automated testing', 'automated end-to-end testing', 'software testing', 'automated testing pipelines', 'testing pipelines', 'CI/CD']
    },
    {
      slug: 'zero-knowledge-inbox-architecture',
      terms: ['Zero-Knowledge inbox architecture', 'Zero-Knowledge architecture', 'Zero-Knowledge encryption', 'Zero-Knowledge memory', 'Zero-Knowledge security', 'Zero-Knowledge', 'volatile RAM', 'in-memory']
    },
    {
      slug: 'bypass-email-verification-paywalls',
      terms: ['bypassing email verification paywalls', 'gated content paywalls', 'verification paywalls', 'content gating paywalls', 'gated lead magnets', 'gated content']
    },
    {
      slug: 'temp-mail-for-newsletter-safety',
      terms: ['safe newsletter subscriptions', 'evaluating mailing lists safely', 'spam-free newsletters', 'testing email newsletters', 'newsletter subscriptions', 'newsletters']
    },
    {
      slug: 'temporary-sms-vs-temporary-email',
      terms: ['temporary SMS vs temporary email', 'temporary SMS', 'disposable SMS numbers', 'virtual SMS receivers', 'SMS OTP verification', 'temporary phone numbers', 'temporary SMS']
    }
  ]
};

function linkifyArticleSections(art, lang) {
  const rules = KEYWORD_RULES[lang] || KEYWORD_RULES.en;
  const replacedSlugs = new Set([art.slug]);
  let totalLinksInjected = 0;

  const linkedSections = art.sections.map((sec, secIdx) => {
    let html = sec.content[lang];
    const segments = html.split(/(<[^>]+>)/g);
    let insideAnchorOrCode = false;
    let linksInSection = 0;

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      if (seg.startsWith('<')) {
        const lower = seg.toLowerCase();
        if (lower.startsWith('<a ') || lower.startsWith('<a>') || lower.startsWith('<code') || lower.startsWith('<pre') || lower.startsWith('<h1') || lower.startsWith('<h2') || lower.startsWith('<h3') || lower.startsWith('<button')) {
          insideAnchorOrCode = true;
        } else if (lower.startsWith('</a>') || lower.startsWith('</code>') || lower.startsWith('</pre>') || lower.startsWith('</h1>') || lower.startsWith('</h2>') || lower.startsWith('</h3>') || lower.startsWith('</button>')) {
          insideAnchorOrCode = false;
        }
        continue;
      }

      if (insideAnchorOrCode) continue;

      let text = seg;
      for (const rule of rules) {
        if (replacedSlugs.has(rule.slug)) continue;
        if (linksInSection >= 3) break;

        for (const term of rule.terms) {
          const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          let regex;
          if (lang === 'ar') {
            // Flexible Arabic word boundaries supporting prefixes: و, ف, ب, ل, ك, ال, كال, بال, فال, ول, لل
            const pattern = `(?:(?<=[\\s،؛:«"'\\[(]|^)(?:و|ف|ب|ل|ك|ال|بال|فال|وال|كال|لل)?)${escapedTerm}(?=[\\s،؛:»"'\\]).!?]|$)`;
            regex = new RegExp(pattern, 'u');
          } else {
            regex = new RegExp(`\\b${escapedTerm}\\b`, 'i');
          }

          if (regex.test(text)) {
            text = text.replace(regex, (match) => {
              replacedSlugs.add(rule.slug);
              linksInSection++;
              totalLinksInjected++;
              return `<a href="/${lang}/articles/${rule.slug}.html" class="text-blue-600 dark:text-blue-400 font-medium underline decoration-blue-300 dark:decoration-blue-700 underline-offset-4 hover:decoration-blue-600 hover:text-blue-800 dark:hover:text-blue-200 transition-colors" title="${match}">${match}</a>`;
            });
            break;
          }
        }
      }
      segments[i] = text;
    }

    return {
      ...sec,
      linkedContent: segments.join('')
    };
  });

  return { totalLinksInjected, linkedSections };
}

let arTotal = 0;
let enTotal = 0;

allArticles.forEach(art => {
  const arRes = linkifyArticleSections(art, 'ar');
  const enRes = linkifyArticleSections(art, 'en');
  console.log(`[${art.slug}] AR links: ${arRes.totalLinksInjected} | EN links: ${enRes.totalLinksInjected}`);
  arTotal += arRes.totalLinksInjected;
  enTotal += enRes.totalLinksInjected;
});

console.log(`\n============================`);
console.log(`Total Arabic In-Text Links: ${arTotal}`);
console.log(`Total English In-Text Links: ${enTotal}`);
