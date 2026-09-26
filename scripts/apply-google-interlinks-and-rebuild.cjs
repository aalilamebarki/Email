// scripts/apply-google-interlinks-and-rebuild.cjs
const fs = require('fs');
const path = require('path');

const g1 = require('./articles/group1.cjs');
const g2 = require('./articles/group2.cjs');
const g3 = require('./articles/group3.cjs');
const g4 = require('./articles/group4.cjs');

const allGroups = [
  { name: 'group1.cjs', articles: g1 },
  { name: 'group2.cjs', articles: g2 },
  { name: 'group3.cjs', articles: g3 },
  { name: 'group4.cjs', articles: g4 }
];

const keywordLinksAr = [
  { term: 'محرك التغطية الشاملة (UVC)', slug: 'universal-verification-coverage', label: 'محرك التغطية الشاملة (UVC)' },
  { term: 'محرك التغطية الشاملة', slug: 'universal-verification-coverage', label: 'محرك التغطية الشاملة' },
  { term: 'قناة WebSocket', slug: 'real-time-websocket-streaming', label: 'قناة WebSocket اللحظية' },
  { term: 'اتصالات WebSocket', slug: 'real-time-websocket-streaming', label: 'اتصالات WebSocket' },
  { term: 'بروتوكولات SPF و DKIM و DMARC', slug: 'temp-mail-vs-spam-filters', label: 'بروتوكولات SPF و DKIM و DMARC' },
  { term: 'سجلات SPF و DKIM', slug: 'temp-mail-vs-spam-filters', label: 'سجلات SPF و DKIM' },
  { term: 'الروابط السحرية (Magic Links)', slug: 'magic-links-vs-otp', label: 'الروابط السحرية (Magic Links)' },
  { term: 'الروابط السحرية', slug: 'magic-links-vs-otp', label: 'الروابط السحرية' },
  { term: 'دورة حياة البريد المؤقت', slug: 'what-happens-when-address-expires', label: 'دورة حياة البريد المؤقت' },
  { term: 'انتهاء الصلاحية', slug: 'what-happens-when-address-expires', label: 'انتهاء صلاحية الصندوق' },
  { term: 'توليد عنوان بريد مؤقت', slug: 'how-to-generate-address', label: 'توليد عنوان بريد مؤقت جديد' },
  { term: 'توليد عنوان جديد', slug: 'how-to-generate-address', label: 'توليد عنوان جديد' },
  { term: 'نسخ عنوان البريد المؤقت', slug: 'how-to-copy-address', label: 'نسخ عنوان البريد المؤقت بدقة' },
  { term: 'زر النسخ', slug: 'how-to-copy-address', label: 'زر النسخ المباشر' },
  { term: 'أكواد التحقق (OTP)', slug: 'how-to-receive-otp', label: 'أكواد التحقق (OTP)' },
  { term: 'كود التحقق', slug: 'how-to-receive-otp', label: 'كود التحقق' },
  { term: 'روابط التفعيل والتأكيد', slug: 'how-to-open-verification-links', label: 'روابط التفعيل والتأكيد' },
  { term: 'مشرح الروابط الآمنة', slug: 'how-to-open-verification-links', label: 'مشرح الروابط الآمنة' },
  { term: 'التحديث اللحظي', slug: 'how-inbox-updates-live', label: 'التحديث اللحظي التفاعلي' },
  { term: 'عناوين بريد مؤقتة متعددة', slug: 'managing-multiple-temp-addresses', label: 'عناوين بريد مؤقتة متعددة' },
  { term: 'تطبيق الويب التقدمي (PWA)', slug: 'pwa-desktop-mobile-guide', label: 'تطبيق الويب التقدمي (PWA)' },
  { term: 'تطبيق PWA', slug: 'pwa-desktop-mobile-guide', label: 'تطبيق PWA' },
  { term: 'حشو بيانات الاعتماد (Credential Stuffing)', slug: 'preventing-credential-stuffing-and-data-breaches', label: 'حشو بيانات الاعتماد (Credential Stuffing)' },
  { term: 'حشو بيانات الاعتماد', slug: 'preventing-credential-stuffing-and-data-breaches', label: 'هجمات حشو بيانات الاعتماد' },
  { term: 'وسطاء البيانات (Data Brokers)', slug: 'disposable-email-vs-marketing-trackers', label: 'وسطاء البيانات (Data Brokers)' },
  { term: 'وسطاء البيانات', slug: 'disposable-email-vs-marketing-trackers', label: 'وسطاء البيانات' },
  { term: 'معايير GDPR و CCPA', slug: 'gdpr-ccpa-compliance-ephemeral-data', label: 'معايير GDPR و CCPA' },
  { term: 'الحق في النسيان', slug: 'gdpr-ccpa-compliance-ephemeral-data', label: 'الحق في النسيان (Right to Erasure)' },
  { term: 'بكسلات التجسس (Spy Pixels)', slug: 'combating-marketing-trackers-and-spy-pixels', label: 'بكسلات التجسس (Spy Pixels)' },
  { term: 'بكسلات التجسس', slug: 'combating-marketing-trackers-and-spy-pixels', label: 'بكسلات التجسس' },
  { term: 'التصيد الاحتيالي (Phishing)', slug: 'phishing-defense-and-safe-previews', label: 'التصيد الاحتيالي (Phishing)' },
  { term: 'التصيد الاحتيالي', slug: 'phishing-defense-and-safe-previews', label: 'هجمات التصيد الاحتيالي' },
  { term: 'اختبار البرمجيات والتحقق الآلي', slug: 'temporary-email-for-software-testing', label: 'اختبار البرمجيات والتحقق الآلي' },
  { term: 'أتمتة الاختبار', slug: 'temporary-email-for-software-testing', label: 'أتمتة اختبارات الويب' },
  { term: 'المعرفة الصفرية (Zero-Knowledge)', slug: 'zero-knowledge-inbox-architecture', label: 'معمارية عدم المعرفة (Zero-Knowledge)' },
  { term: 'الذاكرة العشوائية المتطايرة', slug: 'zero-knowledge-inbox-architecture', label: 'الذاكرة العشوائية المتطايرة (RAM)' },
  { term: 'المحتوى المحجوب بالبريد (Gated Content)', slug: 'bypass-email-verification-paywalls', label: 'المحتوى المحجوب بالبريد (Gated Content)' },
  { term: 'المحتوى المحجوب', slug: 'bypass-email-verification-paywalls', label: 'المحتوى المحجوب' },
  { term: 'النشرات الإخبارية (Newsletters)', slug: 'temp-mail-for-newsletter-safety', label: 'النشرات الإخبارية (Newsletters)' },
  { term: 'النشرات الإخبارية', slug: 'temp-mail-for-newsletter-safety', label: 'النشرات الإخبارية' },
  { term: 'أرقام SMS المؤقتة', slug: 'temporary-sms-vs-temporary-email', label: 'أرقام SMS المؤقتة' }
];

const keywordLinksEn = [
  { term: 'Universal Verification Coverage (UVC)', slug: 'universal-verification-coverage', label: 'Universal Verification Coverage (UVC)' },
  { term: 'Universal Verification Coverage', slug: 'universal-verification-coverage', label: 'Universal Verification Coverage engine' },
  { term: 'WebSocket (WSS)', slug: 'real-time-websocket-streaming', label: 'persistent WebSocket (WSS) streaming' },
  { term: 'WebSocket channel', slug: 'real-time-websocket-streaming', label: 'WebSocket channel' },
  { term: 'SPF, DKIM, and DMARC', slug: 'temp-mail-vs-spam-filters', label: 'SPF, DKIM, and DMARC authentication' },
  { term: 'SPF and DKIM', slug: 'temp-mail-vs-spam-filters', label: 'SPF and DKIM protocols' },
  { term: 'Magic Links', slug: 'magic-links-vs-otp', label: 'passwordless Magic Links' },
  { term: 'One-Time Passcodes (OTP)', slug: 'how-to-receive-otp', label: 'One-Time Passcodes (OTP)' },
  { term: 'One-Time Passwords', slug: 'how-to-receive-otp', label: 'One-Time Passwords (OTP)' },
  { term: 'OTP codes', slug: 'how-to-receive-otp', label: 'OTP passcodes' },
  { term: 'mailbox expiration', slug: 'what-happens-when-address-expires', label: 'ephemeral mailbox expiration' },
  { term: 'address generation', slug: 'how-to-generate-address', label: 'cryptographic address generation' },
  { term: 'generating disposable email addresses', slug: 'how-to-generate-address', label: 'generating disposable email addresses' },
  { term: 'copy button', slug: 'how-to-copy-address', label: 'one-click clean copy engine' },
  { term: 'clipboard copy', slug: 'how-to-copy-address', label: 'clean clipboard copy' },
  { term: 'activation links', slug: 'how-to-open-verification-links', label: 'Call-to-Action activation links' },
  { term: 'safe link verification', slug: 'how-to-open-verification-links', label: 'safe link inspection' },
  { term: 'real-time reactive DOM', slug: 'how-inbox-updates-live', label: 'real-time reactive DOM architecture' },
  { term: 'multiple concurrent ephemeral inboxes', slug: 'managing-multiple-temp-addresses', label: 'multiple concurrent ephemeral inboxes' },
  { term: 'Progressive Web App (PWA)', slug: 'pwa-desktop-mobile-guide', label: 'Progressive Web App (PWA)' },
  { term: 'PWA architecture', slug: 'pwa-desktop-mobile-guide', label: 'PWA architecture' },
  { term: 'Credential Stuffing', slug: 'preventing-credential-stuffing-and-data-breaches', label: 'automated Credential Stuffing' },
  { term: 'credential stuffing attacks', slug: 'preventing-credential-stuffing-and-data-breaches', label: 'credential stuffing attacks' },
  { term: 'commercial data brokers', slug: 'disposable-email-vs-marketing-trackers', label: 'commercial data brokers' },
  { term: 'Identity Graphs', slug: 'disposable-email-vs-marketing-trackers', label: 'commercial Identity Graphs' },
  { term: 'GDPR Article 17', slug: 'gdpr-ccpa-compliance-ephemeral-data', label: 'GDPR Article 17 (Right to Erasure)' },
  { term: 'Right to Erasure', slug: 'gdpr-ccpa-compliance-ephemeral-data', label: 'statutory Right to Erasure' },
  { term: 'Spy Pixels', slug: 'combating-marketing-trackers-and-spy-pixels', label: 'invisible Spy Pixels' },
  { term: 'tracking pixels', slug: 'combating-marketing-trackers-and-spy-pixels', label: 'telemetry tracking pixels' },
  { term: 'phishing and social engineering', slug: 'phishing-defense-and-safe-previews', label: 'phishing and social engineering' },
  { term: 'spear-phishing', slug: 'phishing-defense-and-safe-previews', label: 'targeted spear-phishing' },
  { term: 'QA automation engineers', slug: 'temporary-email-for-software-testing', label: 'QA automation engineers' },
  { term: 'Playwright', slug: 'temporary-email-for-software-testing', label: 'Playwright test automation' },
  { term: 'Zero-Knowledge Architecture', slug: 'zero-knowledge-inbox-architecture', label: 'Zero-Knowledge Architecture' },
  { term: 'volatile RAM buffers', slug: 'zero-knowledge-inbox-architecture', label: 'volatile in-memory RAM buffers' },
  { term: 'Gated Content', slug: 'bypass-email-verification-paywalls', label: 'email-gated content' },
  { term: 'curated newsletters', slug: 'temp-mail-for-newsletter-safety', label: 'curated email newsletters' },
  { term: 'temporary SMS numbers', slug: 'temporary-sms-vs-temporary-email', label: 'public temporary SMS numbers' }
];

function injectLinks(html, currentSlug, lang) {
  let res = html;
  const linkList = lang === 'ar' ? keywordLinksAr : keywordLinksEn;
  const linkedSlugs = new Set([currentSlug]);

  for (const item of linkList) {
    if (linkedSlugs.has(item.slug)) continue;
    
    // We replace only the first occurrence outside an HTML tag
    const escapedTerm = item.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?<!<[^>]*)\\b(${escapedTerm})\\b(?![^<]*>)`, 'i');
    
    if (regex.test(res)) {
      const linkTag = `<a href="/${lang}/articles/${item.slug}.html" class="text-blue-600 dark:text-blue-400 font-semibold underline hover:opacity-80 transition-opacity">${item.label}</a>`;
      res = res.replace(regex, linkTag);
      linkedSlugs.add(item.slug);
    }
  }
  return res;
}

// Process all groups
allGroups.forEach(grp => {
  grp.articles.forEach(art => {
    if (art.sections) {
      art.sections.forEach(sec => {
        if (sec.content && sec.content.ar) {
          sec.content.ar = injectLinks(sec.content.ar, art.slug, 'ar');
        }
        if (sec.content && sec.content.en) {
          sec.content.en = injectLinks(sec.content.en, art.slug, 'en');
        }
      });
    }
  });

  const filePath = path.join(__dirname, 'articles', grp.name);
  fs.writeFileSync(filePath, `// scripts/articles/${grp.name}\nmodule.exports = ${JSON.stringify(grp.articles, null, 2)};\n`, 'utf8');
  console.log(`Injected Google Blog internal keyword links into ${grp.name}`);
});

console.log("All articles now have rich Google-style internal keyword hyperlinks!");
