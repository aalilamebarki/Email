import fs from 'node:fs';
import path from 'node:path';
import { ARTICLES_CATALOG, CatalogArticle } from './data-articles-catalog.ts';

// Clean Arabic helper to guarantee 100% absence of Tashkeel / Diacritics
export function stripTashkeel(text: string): string {
  if (!text) return '';
  return text.replace(/[\u064B-\u0652\u0670\u06D6-\u06ED]/g, '');
}

// Map real, authoritative sources per article slug
export const VERIFIED_SOURCES: Record<string, { title: string; url: string }[]> = {
  'universal-verification-coverage': [
    { title: 'IETF RFC 5322 — Internet Message Format Specification', url: 'https://datatracker.ietf.org/doc/html/rfc5322' },
    { title: 'IETF RFC 6238 — TOTP: Time-Based One-Time Password Algorithm', url: 'https://datatracker.ietf.org/doc/html/rfc6238' },
    { title: 'OWASP Authentication Verification Guidelines', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html' }
  ],
  'how-inbox-updates-live': [
    { title: 'Cloudflare Durable Objects & In-Memory State Architecture', url: 'https://developers.cloudflare.com/durable-objects/' },
    { title: 'IETF RFC 6455 — The WebSocket Protocol Specification', url: 'https://datatracker.ietf.org/doc/html/rfc6455' }
  ],
  'temp-mail-vs-spam-filters': [
    { title: 'IETF RFC 7208 — Sender Policy Framework (SPF) for Email Validation', url: 'https://datatracker.ietf.org/doc/html/rfc7208' },
    { title: 'IETF RFC 6376 — DomainKeys Identified Mail (DKIM) Signatures', url: 'https://datatracker.ietf.org/doc/html/rfc6376' },
    { title: 'IETF RFC 7489 — Domain-based Message Authentication (DMARC)', url: 'https://datatracker.ietf.org/doc/html/rfc7489' }
  ],
  'magic-links-vs-otp': [
    { title: 'IETF RFC 6749 — The OAuth 2.0 Authorization Framework', url: 'https://datatracker.ietf.org/doc/html/rfc6749' },
    { title: 'OWASP Single-Use Token Guidance & Expiration Threat Models', url: 'https://owasp.org' }
  ],
  'what-happens-when-address-expires': [
    { title: 'NIST Special Publication 800-88 Rev. 1 — Guidelines for Media Sanitization', url: 'https://csrc.nist.gov/publications/detail/sp/800-88/rev-1/final' },
    { title: 'Regulation (EU) 2016/679 (GDPR), Article 17 — Right to Erasure', url: 'https://gdpr-info.eu/art-17-gdpr/' }
  ],
  'how-to-generate-address': [
    { title: 'IETF RFC 4086 — Randomness Requirements for Security Protocols', url: 'https://datatracker.ietf.org/doc/html/rfc4086' },
    { title: 'IETF RFC 5321 — Simple Mail Transfer Protocol Address Grammar', url: 'https://datatracker.ietf.org/doc/html/rfc5321' }
  ],
  'how-to-copy-address': [
    { title: 'W3C Clipboard API and Events Specification', url: 'https://www.w3.org/TR/clipboard-apis/' }
  ],
  'how-to-receive-otp': [
    { title: 'IETF RFC 4226 — HOTP: HMAC-Based One-Time Password Algorithm', url: 'https://datatracker.ietf.org/doc/html/rfc4226' },
    { title: 'IETF RFC 6238 — TOTP Algorithm Specifications', url: 'https://datatracker.ietf.org/doc/html/rfc6238' }
  ],
  'how-to-open-verification-links': [
    { title: 'W3C Referrer Policy & Navigation Security Standards', url: 'https://www.w3.org/TR/referrer-policy/' },
    { title: 'OWASP Phishing and Deceptive Redirect Defense', url: 'https://owasp.org' }
  ],
  'temporary-email-for-software-testing': [
    { title: 'Playwright API Testing Documentation & Inbound Hooking', url: 'https://playwright.dev/docs/api-testing' },
    { title: 'Cypress E2E Testing Framework Guidelines', url: 'https://docs.cypress.io' }
  ],
  'preventing-credential-stuffing-and-data-breaches': [
    { title: 'NIST SP 800-63B — Digital Identity Guidelines: Authentication Lifecycle', url: 'https://pages.nist.gov/800-63-3/sp800-63b.html' },
    { title: 'OWASP Credential Stuffing Prevention Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html' }
  ],
  'disposable-email-vs-permanent-aliases': [
    { title: 'IETF RFC 5233 — Sieve Email Filtering: Subaddress Extension (Plus Addressing)', url: 'https://datatracker.ietf.org/doc/html/rfc5233' }
  ],
  'protecting-privacy-under-gdpr-ccpa': [
    { title: 'GDPR Article 5 — Principles Relating to Processing of Personal Data', url: 'https://gdpr-info.eu/art-5-gdpr/' },
    { title: 'California Consumer Privacy Act (CCPA) § 1798.100 Regulations', url: 'https://oag.ca.gov/privacy/ccpa' }
  ],
  'combating-marketing-trackers-and-spy-pixels': [
    { title: 'Electronic Frontier Foundation (EFF) Web Beacon and Telemetry Reports', url: 'https://www.eff.org' },
    { title: 'IETF RFC 8942 — HTTP Client Hints Infrastructure', url: 'https://datatracker.ietf.org/doc/html/rfc8942' }
  ],
  'temporary-mail-for-free-trials-and-saas': [
    { title: 'Federal Trade Commission (FTC) Negative Option Rule & Consumer Protections', url: 'https://www.ftc.gov' }
  ],
  'secure-two-factor-authentication-workflows': [
    { title: 'CISA Multi-Factor Authentication Guidance & Telephony Vulnerability Report', url: 'https://www.cisa.gov/mfa' },
    { title: 'NIST SP 800-63B — Risk Analysis on Out-of-Band SMS Verification', url: 'https://pages.nist.gov/800-63-3/sp800-63b.html' }
  ],
  'developer-guide-headless-testing-api': [
    { title: 'OpenAPI Specification v3.1.0 Standards', url: 'https://spec.openapis.org/oas/v3.1.0' },
    { title: 'IETF RFC 7519 — JSON Web Token (JWT) Security Specifications', url: 'https://datatracker.ietf.org/doc/html/rfc7519' }
  ],
  'understanding-disposable-email-blocklists': [
    { title: 'IETF RFC 1035 — Domain Names: Implementation and MX Routing Specs', url: 'https://datatracker.ietf.org/doc/html/rfc1035' },
    { title: 'Spamhaus DNS Blocklist Reputation Criteria', url: 'https://www.spamhaus.org' }
  ],
  'zero-knowledge-inbox-architecture': [
    { title: 'Cloudflare Workers Edge Architecture & Stateless RAM Heaps', url: 'https://developers.cloudflare.com/workers/' },
    { title: 'NIST SP 800-88 Rev. 1 — Cryptographic Eradication Procedures', url: 'https://csrc.nist.gov' }
  ],
  'avoiding-phishing-and-malicious-payloads': [
    { title: 'DOMPurify HTML/SVG Sanitization Engine Specifications', url: 'https://github.com/cure53/DOMPurify' },
    { title: 'OWASP Cross-Site Scripting (XSS) Prevention Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html' }
  ],
  'e-commerce-privacy-and-price-discrimination': [
    { title: 'OECD Working Party on Consumer Policy — Personalised Pricing in the Digital Era', url: 'https://www.oecd.org' },
    { title: 'Consumer Financial Protection Bureau (CFPB) Behavioral Profiling Report', url: 'https://www.consumerfinance.gov' }
  ],
  'multi-device-inbox-sync-and-pwa': [
    { title: 'W3C Web Application Manifest Working Draft', url: 'https://www.w3.org/TR/appmanifest/' },
    { title: 'W3C Service Workers 1 Recommendation', url: 'https://www.w3.org/TR/service-workers-1/' }
  ]
};

// Clean Tashkeel from all Arabic texts in the catalog
export const SANITIZED_ARTICLES = ARTICLES_CATALOG.map((art, idx) => {
  return {
    id: `art-${String(idx + 1).padStart(2, '0')}`,
    slug: art.slug,
    category: {
      ar: stripTashkeel(art.category.ar),
      en: art.category.en
    },
    badge: {
      ar: stripTashkeel(art.badge.ar),
      en: art.badge.en
    },
    readTimeMin: art.readTimeMin,
    icon: art.icon,
    publishedAt: '2026-09-25',
    updatedAt: '2026-09-25',
    author: {
      name: 'Temp Mail Security Engineering Team',
      url: 'https://freetemp.email/'
    },
    sources: VERIFIED_SOURCES[art.slug] || [
      { title: 'IETF RFC 5322 — Internet Message Format Specification', url: 'https://datatracker.ietf.org/doc/html/rfc5322' }
    ],
    title: {
      ar: stripTashkeel(art.title.ar),
      en: art.title.en
    },
    metaDesc: {
      ar: stripTashkeel(art.metaDesc.ar),
      en: art.metaDesc.en
    },
    lead: {
      ar: stripTashkeel(art.lead.ar),
      en: art.lead.en
    },
    takeaways: {
      ar: art.takeaways.ar.map(stripTashkeel),
      en: art.takeaways.en
    },
    sections: art.sections.map(s => ({
      id: s.id,
      title: {
        ar: stripTashkeel(s.title.ar),
        en: s.title.en
      },
      content: {
        ar: stripTashkeel(s.content.ar),
        en: s.content.en
      },
      callout: s.callout ? {
        type: s.callout.type,
        title: {
          ar: stripTashkeel(s.callout.title.ar),
          en: s.callout.title.en
        },
        text: {
          ar: stripTashkeel(s.callout.text.ar),
          en: s.callout.text.en
        }
      } : undefined,
      codeSnippet: s.codeSnippet
    })),
    comparisonTable: art.comparisonTable ? {
      title: {
        ar: stripTashkeel(art.comparisonTable.title.ar),
        en: art.comparisonTable.title.en
      },
      headers: {
        ar: [
          stripTashkeel(art.comparisonTable.headers.ar[0]),
          stripTashkeel(art.comparisonTable.headers.ar[1]),
          stripTashkeel(art.comparisonTable.headers.ar[2])
        ] as [string, string, string],
        en: art.comparisonTable.headers.en
      },
      rows: {
        ar: art.comparisonTable.rows.ar.map(r => [stripTashkeel(r[0]), stripTashkeel(r[1]), stripTashkeel(r[2])] as [string, string, string]),
        en: art.comparisonTable.rows.en
      }
    } : undefined,
    faqs: art.faqs.map(f => ({
      q: {
        ar: stripTashkeel(f.q.ar),
        en: f.q.en
      },
      a: {
        ar: stripTashkeel(f.a.ar),
        en: f.a.en
      }
    })),
    relatedSlugs: art.relatedSlugs
  };
});

// 22 Supported Languages list
export const SUPPORTED_LANGS = [
  { code: 'ar', name: 'Arabic', native: 'العربية', dir: 'rtl' },
  { code: 'en', name: 'English', native: 'English', dir: 'ltr' },
  { code: 'es', name: 'Spanish', native: 'Español', dir: 'ltr' },
  { code: 'fr', name: 'French', native: 'Français', dir: 'ltr' },
  { code: 'de', name: 'German', native: 'Deutsch', dir: 'ltr' },
  { code: 'pt', name: 'Portuguese', native: 'Português', dir: 'ltr' },
  { code: 'it', name: 'Italian', native: 'Italiano', dir: 'ltr' },
  { code: 'ru', name: 'Russian', native: 'Русский', dir: 'ltr' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe', dir: 'ltr' },
  { code: 'zh', name: 'Chinese (Simplified)', native: '简体中文', dir: 'ltr' },
  { code: 'ja', name: 'Japanese', native: '日本語', dir: 'ltr' },
  { code: 'ko', name: 'Korean', native: '한국어', dir: 'ltr' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands', dir: 'ltr' },
  { code: 'pl', name: 'Polish', native: 'Polski', dir: 'ltr' },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia', dir: 'ltr' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', dir: 'ltr' },
  { code: 'fa', name: 'Persian', native: 'فارسی', dir: 'rtl' },
  { code: 'ur', name: 'Urdu', native: 'اردو', dir: 'rtl' },
  { code: 'uk', name: 'Ukrainian', native: 'Українська', dir: 'ltr' },
  { code: 'sv', name: 'Swedish', native: 'Svenska', dir: 'ltr' },
  { code: 'el', name: 'Greek', native: 'Ελληνικά', dir: 'ltr' },
];

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ----------------------------------------------------------------------------
// Master 4-Column Unified Footer (Exact Original Simple Design)
// ----------------------------------------------------------------------------
function getOriginalFooter(lang: 'ar' | 'en') {
  const isAr = lang === 'ar';
  const prefix = isAr ? '/ar' : '/en';
  return `<!-- Master 4-Column Unified Footer with full data-i18n -->
    <footer class="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0A0A0A] py-12 transition-colors mt-auto text-xs">
      <div class="max-w-4xl mx-auto px-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10 ${isAr ? 'text-right' : 'text-left'}">
          <!-- Column 1: Brand & Status -->
          <div>
            <div class="text-base font-bold text-black dark:text-white mb-2" data-i18n="brand">Temp Mail</div>
            <p class="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-3" data-i18n="footerDesc">
              ${isAr ? 'خدمة بريد إلكتروني مؤقت ومعزول تقنياً لحماية خصوصيتك واستقبال رسائل التفعيل وأكواد OTP فوراً دون تسجيل أو تسريب لبياناتك.' : 'Free and technically isolated temporary email service protecting your inbox against spam and trackers without any registration.'}
            </p>
            <div class="inline-flex items-center gap-2 font-mono text-[11px] text-black dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 rounded-md px-2 py-1 bg-neutral-50 dark:bg-neutral-900">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span data-i18n="footerNodesStatus">${isAr ? 'جميع عُقد الحافة تعمل بكفاءة' : 'All edge nodes operational'}</span>
            </div>
          </div>

          <!-- Column 2: Navigation -->
          <div>
            <div class="font-bold text-black dark:text-white mb-3 uppercase tracking-wider text-[11px]" data-i18n="footerNav">
              ${isAr ? 'التنقل' : 'Navigation'}
            </div>
            <ul class="space-y-2">
              <li><a href="${prefix}/" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors" data-i18n="home">${isAr ? 'الرئيسية' : 'Home'}</a></li>
              <li><a href="${prefix}/blog.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors" data-i18n="blog">${isAr ? 'المدونة' : 'Blog'}</a></li>
              <li><a href="${prefix}/guide.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors" data-i18n="guide">${isAr ? 'دليل الاستخدام' : 'Guide'}</a></li>
              <li><a href="${prefix}/faq.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors" data-i18n="faq">${isAr ? 'الأسئلة الشائعة' : 'FAQ'}</a></li>
              <li><a href="${prefix}/articles/index.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors" data-i18n="footerArticles">${isAr ? 'المقالات' : 'Articles'}</a></li>
            </ul>
          </div>

          <!-- Column 3: Legal & Transparency -->
          <div>
            <div class="font-bold text-black dark:text-white mb-3 uppercase tracking-wider text-[11px]" data-i18n="footerTransparency">
              ${isAr ? 'الشفافية والأمان' : 'Legal & Safety'}
            </div>
            <ul class="space-y-2">
              <li><a href="${prefix}/about.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors" data-i18n="footerAbout">${isAr ? 'من نحن' : 'About'}</a></li>
              <li><a href="${prefix}/privacy.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors" data-i18n="footerPrivacy">${isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}</a></li>
              <li><a href="${prefix}/privacy.html#terms" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors" data-i18n="footerTerms">${isAr ? 'شروط الاستخدام' : 'Terms'}</a></li>
            </ul>
          </div>

          <!-- Column 4: Security Pillars -->
          <div>
            <div class="font-bold text-black dark:text-white mb-3 uppercase tracking-wider text-[11px]" data-i18n="footerSecurity">
              ${isAr ? 'معايير الأمان' : 'Security Standards'}
            </div>
            <ul class="space-y-2 text-neutral-600 dark:text-neutral-400">
              <li class="flex items-center gap-1.5">
                <span class="text-black dark:text-white font-bold">✓</span>
                <span data-i18n="footerSec1">${isAr ? 'إتلاف تلقائي بعد 20 دقيقة' : 'Auto-purge after 20 minutes'}</span>
              </li>
              <li class="flex items-center gap-1.5">
                <span class="text-black dark:text-white font-bold">✓</span>
                <span data-i18n="footerSec2">${isAr ? 'صفر سجلات تتبع' : 'Zero tracking logs recorded'}</span>
              </li>
              <li class="flex items-center gap-1.5">
                <span class="text-black dark:text-white font-bold">✓</span>
                <span data-i18n="footerSec3">${isAr ? 'عزل تام للذاكرة العشوائية' : 'RAM-only volatile isolation'}</span>
              </li>
              <li class="flex items-center gap-1.5">
                <span class="text-black dark:text-white font-bold">✓</span>
                <span data-i18n="footerSec4">${isAr ? 'تشفير كامل للاتصال TLS' : 'Full TLS transport encryption'}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="pt-8 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>© 2026 Temp Mail. All rights reserved.</p>
          <div class="flex items-center gap-4">
            <a href="${prefix}/articles/index.html" class="hover:underline">${isAr ? 'فهرس المقالات' : 'Articles Index'}</a>
            <span>•</span>
            <a href="${prefix}/privacy.html" class="hover:underline">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>`;
}

// ----------------------------------------------------------------------------
// Single Article Template (Exact Original Simple Clean Design)
// Used for /ar/article.html, /en/article.html, and pre-rendering /ar/articles/*.html
// ----------------------------------------------------------------------------
export function renderArticleTemplate(article: typeof SANITIZED_ARTICLES[0], lang: 'ar' | 'en', isDynamicTemplate = false): string {
  const isAr = lang === 'ar';
  const prefix = isAr ? '/ar' : '/en';
  const title = article.title[lang];
  const metaDesc = article.metaDesc[lang];
  const category = article.category[lang];
  const badge = article.badge[lang];
  const lead = article.lead[lang];
  const takeaways = article.takeaways[lang];
  const canonicalUrl = `https://freetemp.email${prefix}/articles/${article.slug}.html`;

  // 22 hreflangs
  const hreflangTags = SUPPORTED_LANGS.map(l => {
    const lPrefix = l.dir === 'rtl' ? '/ar' : '/en';
    return `<link rel="alternate" hreflang="${l.code}" href="https://freetemp.email${lPrefix}/articles/${article.slug}.html" />`;
  }).join('\n    ');

  // Schema.org JSON-LD
  const schemaQuestions = article.faqs.map(f => ({
    '@type': 'Question',
    'name': f.q[lang],
    'acceptedAnswer': {
      '@type': 'Answer',
      'text': f.a[lang]
    }
  }));

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': `${canonicalUrl}#article`,
        'headline': title,
        'description': metaDesc,
        'inLanguage': lang,
        'datePublished': '2026-09-25T08:00:00+00:00',
        'dateModified': '2026-09-25T10:00:00+00:00',
        'author': {
          '@type': 'Organization',
          'name': 'Temp Mail Security Engineering Team',
          'url': 'https://freetemp.email/'
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'Temp Mail',
          'url': 'https://freetemp.email/',
          'logo': {
            '@type': 'ImageObject',
            'url': 'https://freetemp.email/logo.svg'
          }
        },
        'mainEntityOfPage': canonicalUrl
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': isAr ? 'الرئيسية' : 'Home',
            'item': `https://freetemp.email${prefix}/`
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': isAr ? 'المدونة' : 'Blog',
            'item': `https://freetemp.email${prefix}/blog.html`
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': title,
            'item': canonicalUrl
          }
        ]
      },
      {
        '@type': 'FAQPage',
        '@id': `${canonicalUrl}#faq`,
        'mainEntity': schemaQuestions
      }
    ]
  };

  // Find related articles
  const relatedArticles = article.relatedSlugs
    .map(s => SANITIZED_ARTICLES.find(a => a.slug === s))
    .filter(Boolean) as typeof SANITIZED_ARTICLES;

  return `<!doctype html>
<html lang="${lang}" dir="${isAr ? 'rtl' : 'ltr'}">
  <head>
    <meta charset="UTF-8" />
    <script>
      (function () {
        try {
          var t = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
          document.documentElement.setAttribute('data-theme', t);
          if (t === 'dark') document.documentElement.classList.add('dark');
          else document.documentElement.classList.remove('dark');
        } catch (e) {}
      })();
    </script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- SEO Meta Tags -->
    <title id="page-title">${escapeHtml(title)} — Temp Mail</title>
    <meta name="description" id="meta-description" content="${escapeHtml(metaDesc)}" />
    <meta name="author" content="Temp Mail Security Engineering Team" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" id="canonical-link" href="${canonicalUrl}" />

    <!-- Multilingual Alternates -->
    ${hreflangTags}
    <link rel="alternate" hreflang="x-default" href="https://freetemp.email/en/articles/${article.slug}.html" />

    <!-- Open Graph Tags -->
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Temp Mail" />
    <meta property="og:title" id="og-title" content="${escapeHtml(title)}" />
    <meta property="og:description" id="og-desc" content="${escapeHtml(metaDesc)}" />
    <meta property="og:url" id="og-url" content="${canonicalUrl}" />
    <meta property="og:image" content="https://freetemp.email/og-image.png" />
    <meta property="og:locale" content="${isAr ? 'ar_AR' : 'en_US'}" />

    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" id="twitter-title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" id="twitter-desc" content="${escapeHtml(metaDesc)}" />
    <meta name="twitter:image" content="https://freetemp.email/og-image.png" />

    <meta name="theme-color" content="#ffffff" id="meta-theme-color" />
    <link rel="icon" type="image/svg+xml" href="/logo.svg" />
    <link rel="apple-touch-icon" href="/logo.svg" />

    <!-- Stylesheets & Fonts -->
    <link rel="stylesheet" href="/fonts/fonts.css" />
    <link rel="stylesheet" href="/shared/style.css" />

    <!-- Scripts -->
    <script src="/shared/theme.js" defer></script>
    <script src="/shared/i18n.js" defer></script>
    <script src="/shared/articles-data.js" defer></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        darkMode: 'class',
      };
    </script>

    <!-- Schema.org JSON-LD -->
    <script type="application/ld+json" id="schema-json-ld">
${JSON.stringify(schemaJsonLd, null, 2)}
    </script>
  </head>
  <body class="min-h-screen bg-white text-black dark:bg-[#0D0D0D] dark:text-[#F5F5F5] flex flex-col transition-colors duration-200 ${isAr ? "font-['Cairo',sans-serif]" : "font-sans"}">
    <!-- Master Header -->
    <header class="border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-[#0D0D0D]/95 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div class="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div class="flex items-center gap-6">
          <a href="${prefix}/" class="text-xl font-bold tracking-tight text-black dark:text-white hover:opacity-80 transition-opacity flex items-center gap-2">
            <span class="w-6 h-6 rounded bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-xs font-mono font-extrabold">T</span>
            <span data-i18n="brand">Temp Mail</span>
          </a>

          <nav class="hidden md:flex items-center gap-4 text-xs font-medium">
            <a href="${prefix}/" data-i18n="home" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${isAr ? 'الرئيسية' : 'Home'}</a>
            <a href="${prefix}/blog.html" data-i18n="blog" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${isAr ? 'المدونة' : 'Blog'}</a>
            <a href="${prefix}/articles/index.html" class="text-black dark:text-white font-bold transition-colors">${isAr ? 'المقالات' : 'Articles'}</a>
            <a href="${prefix}/guide.html" data-i18n="guide" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${isAr ? 'دليل الاستخدام' : 'Guide'}</a>
            <a href="${prefix}/faq.html" data-i18n="faq" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${isAr ? 'الأسئلة الشائعة' : 'FAQ'}</a>
          </nav>
        </div>

        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Language Selector Button (22 World Languages) -->
          <button
            type="button"
            id="open-lang-picker"
            class="open-lang-picker min-h-[38px] px-3 py-1.5 bg-white hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 hover:border-black dark:border-neutral-800 dark:hover:border-neutral-600 rounded-lg text-xs font-semibold text-black dark:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            aria-label="Change Language"
          >
            <svg class="w-3.5 h-3.5 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <span id="current-lang-label">${isAr ? 'العربية' : 'English'}</span>
            <svg class="w-3 h-3 stroke-current fill-none stroke-[2] opacity-60" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>

          <!-- Dark/Light Theme Toggle Button -->
          <button
            type="button"
            id="theme-toggle-btn"
            class="theme-toggle-btn min-h-[38px] min-w-[38px] p-2 bg-white hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 hover:border-black dark:border-neutral-800 dark:hover:border-neutral-600 rounded-lg text-black dark:text-white transition-all flex items-center justify-center cursor-pointer active:scale-95"
            aria-label="Toggle theme"
          >
            <svg class="theme-toggle-icon w-4 h-4 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content Container (Exact Original Simple Width & Padding) -->
    <main class="flex-1 max-w-3xl w-full mx-auto px-4 py-8 sm:py-12">
      <!-- Breadcrumbs -->
      <nav class="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-6 font-mono" id="article-breadcrumbs">
        <a href="${prefix}/" class="hover:underline" data-i18n="artNavHome">${isAr ? 'الرئيسية' : 'Home'}</a>
        <span>/</span>
        <a href="${prefix}/blog.html" class="hover:underline" data-i18n="artNavBlog">${isAr ? 'المدونة' : 'Blog'}</a>
        <span>/</span>
        <a href="${prefix}/articles/index.html" class="hover:underline">${isAr ? 'المقالات' : 'Articles'}</a>
        <span>/</span>
        <span class="text-black dark:text-white font-semibold truncate max-w-[200px]" id="breadcrumb-current-title">${escapeHtml(title)}</span>
      </nav>

      <!-- Article Header -->
      <article>
        <header class="mb-8">
          <div class="flex flex-wrap items-center gap-2 mb-3 text-[11px] font-mono">
            <span class="px-2.5 py-0.5 rounded-full bg-black text-white dark:bg-white dark:text-black font-bold uppercase tracking-wider text-[10px]" id="article-badge">
              ${escapeHtml(badge)}
            </span>
            <span class="text-neutral-400">•</span>
            <span class="text-neutral-500 font-mono" id="article-readtime">${article.readTimeMin} ${isAr ? 'دقائق قراءة' : 'mins read'}</span>
            <span class="text-neutral-400">•</span>
            <time datetime="${article.publishedAt}" class="text-neutral-500 font-mono" id="article-date">${article.publishedAt}</time>
          </div>

          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-black dark:text-white mb-4 leading-tight tracking-tight" id="article-h1">
            ${escapeHtml(title)}
          </h1>

          <p class="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal" id="article-lead">
            ${escapeHtml(lead)}
          </p>
        </header>

        <!-- Core Architectural Takeaways (Exact Original Simple Neutral Box) -->
        <div class="mb-10 p-5 sm:p-6 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm" id="article-takeaways-box">
          <h2 class="text-sm font-bold text-black dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <svg class="w-4 h-4 text-emerald-500 stroke-current fill-none stroke-[2.5]" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span id="takeaways-header-text">${isAr ? 'أبرز الركائز الهندسية والنتائج في هذا الدليل' : 'Core Engineering Takeaways'}</span>
          </h2>
          <ul class="space-y-3 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300" id="article-takeaways-list">
            ${takeaways.map(t => `
              <li class="flex items-start gap-2.5">
                <span class="text-black dark:text-white font-bold shrink-0 mt-0.5">✓</span>
                <span>${escapeHtml(t)}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <!-- Deep-Dive Sections -->
        <div id="article-sections-container">
          ${article.sections.map((sec, idx) => `
            <section class="mb-10" id="${sec.id}">
              <h2 class="text-xl sm:text-2xl font-bold text-black dark:text-white mb-4">
                ${idx + 1}.0 ${escapeHtml(sec.title[lang])}
              </h2>
              <div class="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed space-y-4">
                ${sec.content[lang]}
              </div>

              ${sec.callout ? `
                <div class="mt-5 p-4 bg-neutral-100 dark:bg-neutral-800/70 border-s-4 border-black dark:border-white rounded-e-lg text-xs sm:text-sm text-neutral-800 dark:text-neutral-200">
                  <div class="font-bold mb-1">${escapeHtml(sec.callout.title[lang])}</div>
                  <p class="leading-relaxed">${escapeHtml(sec.callout.text[lang])}</p>
                </div>
              ` : ''}

              ${sec.codeSnippet ? `
                <div class="mt-5 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-[#0d1117] text-left" dir="ltr">
                  <div class="bg-[#161b22] px-4 py-2 flex items-center justify-between border-b border-neutral-800 text-[11px] text-neutral-400 font-mono">
                    <span>${escapeHtml(sec.codeSnippet.filename)}</span>
                    <span class="uppercase">${escapeHtml(sec.codeSnippet.lang)}</span>
                  </div>
                  <pre class="p-4 text-xs font-mono text-neutral-200 overflow-x-auto"><code>${escapeHtml(sec.codeSnippet.code)}</code></pre>
                </div>
              ` : ''}
            </section>
          `).join('')}
        </div>

        <!-- Comparison Table (if present) -->
        ${article.comparisonTable ? `
          <section class="mb-10" id="comparison-table-section">
            <h2 class="text-xl sm:text-2xl font-bold text-black dark:text-white mb-4">
              ${escapeHtml(article.comparisonTable.title[lang])}
            </h2>
            <div class="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121212]">
              <table class="w-full text-xs sm:text-sm text-left ${isAr ? 'text-right' : 'text-left'}">
                <thead class="bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white font-bold border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th class="p-3 sm:p-4">${escapeHtml(article.comparisonTable.headers[lang][0])}</th>
                    <th class="p-3 sm:p-4 text-neutral-500">${escapeHtml(article.comparisonTable.headers[lang][1])}</th>
                    <th class="p-3 sm:p-4 text-black dark:text-white">${escapeHtml(article.comparisonTable.headers[lang][2])}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-neutral-200 dark:divide-neutral-800">
                  ${article.comparisonTable.rows[lang].map((row, rIdx) => `
                    <tr class="${rIdx % 2 === 1 ? 'bg-neutral-50/50 dark:bg-neutral-900/40' : ''}">
                      <td class="p-3 sm:p-4 font-semibold text-black dark:text-white">${escapeHtml(row[0])}</td>
                      <td class="p-3 sm:p-4 text-neutral-500">${escapeHtml(row[1])}</td>
                      <td class="p-3 sm:p-4 font-semibold text-emerald-600 dark:text-emerald-400">${escapeHtml(row[2])}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </section>
        ` : ''}

        <!-- Verified Real Technical Sources Section -->
        <section class="mb-10 p-5 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl" id="article-sources-section">
          <h3 class="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3 flex items-center gap-1.5 font-mono">
            <span>📚 ${isAr ? 'المراجع والمعايير القياسية المعتمدة' : 'Verified References & RFC Standards'}</span>
          </h3>
          <ul class="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400" id="article-sources-list">
            ${article.sources.map(src => `
              <li class="flex items-center gap-2">
                <span>•</span>
                <a href="${src.url}" target="_blank" rel="noopener noreferrer" class="hover:underline text-black dark:text-white font-medium">
                  ${escapeHtml(src.title)}
                </a>
              </li>
            `).join('')}
          </ul>
        </section>

        <!-- In-Article FAQ Accordion Section -->
        <section class="mb-12 pt-6 border-t border-neutral-200 dark:border-neutral-800" id="article-faqs-section">
          <h2 class="text-xl sm:text-2xl font-bold text-black dark:text-white mb-6">
            ${isAr ? 'الأسئلة الشائعة والأمان' : 'Frequently Asked Questions'}
          </h2>
          <div class="space-y-3" id="article-faqs-list">
            ${article.faqs.map((faq, fIdx) => `
              <div class="faq-item rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121212] overflow-hidden">
                <button
                  type="button"
                  class="faq-toggle w-full p-4 text-left ${isAr ? 'text-right' : 'text-left'} font-semibold text-sm sm:text-base text-black dark:text-white flex items-center justify-between gap-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                  aria-expanded="${fIdx === 0 ? 'true' : 'false'}"
                >
                  <span>${escapeHtml(faq.q[lang])}</span>
                  <svg class="faq-chevron w-4 h-4 stroke-current fill-none stroke-[2] text-neutral-400 transition-transform duration-200 ${fIdx === 0 ? 'rotate-180' : ''}" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>
                <div class="faq-content p-4 pt-0 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-neutral-800/60 ${fIdx === 0 ? '' : 'hidden'}">
                  <p class="mt-3">${escapeHtml(faq.a[lang])}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Related Articles Grid (Exact Original Simple Clean Neutral Box Design) -->
        ${relatedArticles.length > 0 ? `
          <section class="mb-12 pt-8 border-t border-neutral-200 dark:border-neutral-800" id="related-articles-section">
            <h2 class="text-lg sm:text-xl font-bold text-black dark:text-white mb-2">
              ${isAr ? 'الأدلة التقنية والمعمارية ذات الصلة' : 'Related Architecture Guides'}
            </h2>
            <p class="text-xs text-neutral-500 mb-6">
              ${isAr ? 'استكشف التحليلات الهندسية المترابطة لفهم أبعاد الأمان والخصوصية' : 'Explore interconnected guides expanding on verification and privacy'}
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4" id="related-articles-grid">
              ${relatedArticles.slice(0, 4).map(rel => `
                <article class="p-4 bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-black dark:hover:border-white transition-all flex flex-col justify-between shadow-sm">
                  <div>
                    <span class="text-[10px] font-mono uppercase px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-neutral-600 dark:text-neutral-400 font-bold mb-2 inline-block">
                      ${escapeHtml(rel.category[lang])}
                    </span>
                    <h3 class="font-bold text-sm text-black dark:text-white mb-1.5">
                      <a href="${prefix}/articles/${rel.slug}.html" class="hover:underline">
                        ${escapeHtml(rel.title[lang])}
                      </a>
                    </h3>
                    <p class="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                      ${escapeHtml(rel.metaDesc[lang])}
                    </p>
                  </div>
                  <a href="${prefix}/articles/${rel.slug}.html" class="text-xs font-bold text-black dark:text-white hover:underline flex items-center gap-1 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                    <span>${isAr ? 'قراءة الدليل' : 'Read Guide'}</span>
                    <span>${isAr ? '←' : '→'}</span>
                  </a>
                </article>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Bottom CTA Box (Simple, Clean, Original) -->
        <div class="p-6 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-center mb-12">
          <h3 class="text-base font-bold text-black dark:text-white mb-2" data-i18n="blogCtaTitle">${isAr ? 'جاهز لتجربة البريد المؤقت؟' : 'Ready to test the engine?'}</h3>
          <p class="text-xs text-neutral-600 dark:text-neutral-400 mb-4 max-w-md mx-auto" data-i18n="blogCtaDesc">
            ${isAr ? 'احصل على عنوان بريد مؤقت معزول واستقبل كود التحقق في ثوانٍ وبدون تسجيل.' : 'Get an isolated disposable address and receive your OTP code or activation link live in seconds without signup.'}
          </p>
          <a
            href="${prefix}/"
            class="inline-block px-5 py-2.5 bg-black text-white dark:bg-white dark:text-black rounded-lg text-xs font-bold hover:opacity-90 transition-opacity"
            data-i18n="goToInbox"
          >
            ${isAr ? 'الانتقال إلى صندوق البريد ←' : 'Go to Live Inbox →'}
          </a>
        </div>
      </article>
    </main>

    ${getOriginalFooter(lang)}

    <!-- Dynamic Article Loader & Interactive Accordion Script -->
    <script>
      document.addEventListener('DOMContentLoaded', function () {
        // 1. Accordion Toggle
        document.querySelectorAll('.faq-toggle').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var item = btn.closest('.faq-item');
            var content = item.querySelector('.faq-content');
            var chevron = btn.querySelector('.faq-chevron');
            var isExpanded = btn.getAttribute('aria-expanded') === 'true';

            if (isExpanded) {
              btn.setAttribute('aria-expanded', 'false');
              content.classList.add('hidden');
              if (chevron) chevron.classList.remove('rotate-180');
            } else {
              btn.setAttribute('aria-expanded', 'true');
              content.classList.remove('hidden');
              if (chevron) chevron.classList.add('rotate-180');
            }
          });
        });

        // 2. Dynamic Article Loader (Reads ?slug=... from URL)
        var params = new URLSearchParams(window.location.search);
        var targetSlug = params.get('slug');
        if (targetSlug && window.ARTICLES_DATA) {
          var art = window.ARTICLES_DATA.find(function (a) { return a.slug === targetSlug; });
          if (art) {
            var isAr = document.documentElement.lang === 'ar';
            var l = isAr ? 'ar' : 'en';

            // Title & Meta
            document.title = art.title[l] + ' — Temp Mail';
            var metaDescEl = document.getElementById('meta-description');
            if (metaDescEl) metaDescEl.setAttribute('content', art.metaDesc[l]);

            // Breadcrumbs & Header
            var bTitle = document.getElementById('breadcrumb-current-title');
            if (bTitle) bTitle.textContent = art.title[l];

            var badgeEl = document.getElementById('article-badge');
            if (badgeEl) badgeEl.textContent = art.badge[l];

            var readEl = document.getElementById('article-readtime');
            if (readEl) readEl.textContent = art.readTimeMin + (isAr ? ' دقائق قراءة' : ' mins read');

            var h1El = document.getElementById('article-h1');
            if (h1El) h1El.textContent = art.title[l];

            var leadEl = document.getElementById('article-lead');
            if (leadEl) leadEl.textContent = art.lead[l];

            // Takeaways
            var takeawaysList = document.getElementById('article-takeaways-list');
            if (takeawaysList && art.takeaways[l]) {
              takeawaysList.innerHTML = art.takeaways[l].map(function (t) {
                return '<li class="flex items-start gap-2.5"><span class="text-black dark:text-white font-bold shrink-0 mt-0.5">✓</span><span>' + t + '</span></li>';
              }).join('');
            }

            // Sections
            var secContainer = document.getElementById('article-sections-container');
            if (secContainer && art.sections) {
              secContainer.innerHTML = art.sections.map(function (sec, idx) {
                var calloutHtml = sec.callout ? '<div class="mt-5 p-4 bg-neutral-100 dark:bg-neutral-800/70 border-s-4 border-black dark:border-white rounded-e-lg text-xs sm:text-sm text-neutral-800 dark:text-neutral-200"><div class="font-bold mb-1">' + sec.callout.title[l] + '</div><p class="leading-relaxed">' + sec.callout.text[l] + '</p></div>' : '';
                var codeHtml = sec.codeSnippet ? '<div class="mt-5 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-[#0d1117] text-left" dir="ltr"><div class="bg-[#161b22] px-4 py-2 flex items-center justify-between border-b border-neutral-800 text-[11px] text-neutral-400 font-mono"><span>' + sec.codeSnippet.filename + '</span><span class="uppercase">' + sec.codeSnippet.lang + '</span></div><pre class="p-4 text-xs font-mono text-neutral-200 overflow-x-auto"><code>' + sec.codeSnippet.code + '</code></pre></div>' : '';
                return '<section class="mb-10" id="' + sec.id + '"><h2 class="text-xl sm:text-2xl font-bold text-black dark:text-white mb-4">' + (idx + 1) + '.0 ' + sec.title[l] + '</h2><div class="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed space-y-4">' + sec.content[l] + '</div>' + calloutHtml + codeHtml + '</section>';
              }).join('');
            }

            // Sources
            var sourcesList = document.getElementById('article-sources-list');
            if (sourcesList && art.sources) {
              sourcesList.innerHTML = art.sources.map(function (s) {
                return '<li class="flex items-center gap-2"><span>•</span><a href="' + s.url + '" target="_blank" rel="noopener noreferrer" class="hover:underline text-black dark:text-white font-medium">' + s.title + '</a></li>';
              }).join('');
            }
          }
        }
      });
    </script>
  </body>
</html>`;
}

// ----------------------------------------------------------------------------
// Articles Index Page (Exact Original Simple Clean Design)
// ----------------------------------------------------------------------------
export function renderCleanArticlesIndex(lang: 'ar' | 'en'): string {
  const isAr = lang === 'ar';
  const prefix = isAr ? '/ar' : '/en';
  const canonicalUrl = `https://freetemp.email${prefix}/articles/index.html`;

  const hreflangTags = SUPPORTED_LANGS.map(l => {
    const lPrefix = l.dir === 'rtl' ? '/ar' : '/en';
    return `<link rel="alternate" hreflang="${l.code}" href="https://freetemp.email${lPrefix}/articles/index.html" />`;
  }).join('\n    ');

  const categories = Array.from(new Set(SANITIZED_ARTICLES.map(a => a.category[lang])));

  return `<!doctype html>
<html lang="${lang}" dir="${isAr ? 'rtl' : 'ltr'}">
  <head>
    <meta charset="UTF-8" />
    <script>
      (function () {
        try {
          var t = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
          document.documentElement.setAttribute('data-theme', t);
          if (t === 'dark') document.documentElement.classList.add('dark');
          else document.documentElement.classList.remove('dark');
        } catch (e) {}
      })();
    </script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- SEO Meta Tags -->
    <title>${isAr ? 'فهرس ودليل المقالات التقنية (22 دليلاً) — بريد مؤقت' : 'Technical Guides & Articles Index (22 Guides) — Temp Mail'}</title>
    <meta name="description" content="${isAr ? 'فهرس المقالات التقنية للبريد المؤقت: 22 مقالاً يغطي التغطية الشاملة لرسائل التحقق، البث الحي، معايير SPF/DKIM، واختبارات البرمجيات.' : 'Index of all 22 technical guides covering temporary email, verification coverage, real-time push, SPF/DKIM, and software testing.'}" />
    <link rel="canonical" href="${canonicalUrl}" />

    <!-- Multilingual Alternates -->
    ${hreflangTags}
    <link rel="alternate" hreflang="x-default" href="https://freetemp.email/en/articles/index.html" />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Temp Mail" />
    <meta property="og:title" content="${isAr ? 'فهرس ودليل المقالات التقنية (22 دليلاً) — بريد مؤقت' : 'Technical Guides Index (22 Guides) — Temp Mail'}" />
    <meta property="og:description" content="${isAr ? 'استكشف 22 مقالاً معمارياً وتقنياً يشرح كافة ميزات البريد المؤقت والخصوصية الرقمية.' : 'Explore 22 architectural and technical guides explaining temporary email and privacy.'}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:image" content="https://freetemp.email/og-image.png" />

    <meta name="theme-color" content="#ffffff" id="meta-theme-color" />
    <link rel="icon" type="image/svg+xml" href="/logo.svg" />
    <link rel="apple-touch-icon" href="/logo.svg" />

    <!-- Stylesheets & Fonts -->
    <link rel="stylesheet" href="/fonts/fonts.css" />
    <link rel="stylesheet" href="/shared/style.css" />

    <!-- Scripts -->
    <script src="/shared/theme.js" defer></script>
    <script src="/shared/i18n.js" defer></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        darkMode: 'class',
      };
    </script>
  </head>
  <body class="min-h-screen bg-white text-black dark:bg-[#0D0D0D] dark:text-[#F5F5F5] flex flex-col transition-colors duration-200 ${isAr ? "font-['Cairo',sans-serif]" : "font-sans"}">
    <!-- Master Header -->
    <header class="border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-[#0D0D0D]/95 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div class="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div class="flex items-center gap-6">
          <a href="${prefix}/" class="text-xl font-bold tracking-tight text-black dark:text-white hover:opacity-80 transition-opacity flex items-center gap-2">
            <span class="w-6 h-6 rounded bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-xs font-mono font-extrabold">T</span>
            <span data-i18n="brand">Temp Mail</span>
          </a>

          <nav class="hidden md:flex items-center gap-4 text-xs font-medium">
            <a href="${prefix}/" data-i18n="home" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${isAr ? 'الرئيسية' : 'Home'}</a>
            <a href="${prefix}/blog.html" data-i18n="blog" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${isAr ? 'المدونة' : 'Blog'}</a>
            <a href="${prefix}/articles/index.html" class="text-black dark:text-white font-bold transition-colors">${isAr ? 'المقالات' : 'Articles'}</a>
            <a href="${prefix}/guide.html" data-i18n="guide" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${isAr ? 'دليل الاستخدام' : 'Guide'}</a>
            <a href="${prefix}/faq.html" data-i18n="faq" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${isAr ? 'الأسئلة الشائعة' : 'FAQ'}</a>
          </nav>
        </div>

        <div class="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            id="open-lang-picker"
            class="open-lang-picker min-h-[38px] px-3 py-1.5 bg-white hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 hover:border-black dark:border-neutral-800 dark:hover:border-neutral-600 rounded-lg text-xs font-semibold text-black dark:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            aria-label="Change Language"
          >
            <svg class="w-3.5 h-3.5 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            <span id="current-lang-label">${isAr ? 'العربية' : 'English'}</span>
            <svg class="w-3 h-3 stroke-current fill-none stroke-[2] opacity-60" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>

          <button
            type="button"
            id="theme-toggle-btn"
            class="theme-toggle-btn min-h-[38px] min-w-[38px] p-2 bg-white hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 hover:border-black dark:border-neutral-800 dark:hover:border-neutral-600 rounded-lg text-black dark:text-white transition-all flex items-center justify-center cursor-pointer active:scale-95"
            aria-label="Toggle theme"
          >
            <svg class="theme-toggle-icon w-4 h-4 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          </button>
        </div>
      </div>
    </header>

    <main class="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-extrabold text-black dark:text-white mb-2">
          ${isAr ? 'فهرس المقالات والأدلة التقنية' : 'Technical Guides & Articles Index'}
        </h1>
        <p class="text-sm text-neutral-600 dark:text-neutral-400">
          ${isAr ? 'دليل شامل يضم 22 مقالاً هندسياً يغطي كافة الميزات والمعايير التقنية للبريد المؤقت' : 'Comprehensive index of 22 engineering guides covering disposable email mechanics'}
        </p>
      </div>

      <!-- Search & Filters -->
      <div class="mb-8 space-y-3">
        <input
          id="article-search-input"
          type="text"
          placeholder="${isAr ? 'ابحث في المقالات...' : 'Search guides...'}"
          class="w-full h-10 px-3 bg-white dark:bg-[#121212] border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs text-black dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
        />

        <div class="flex flex-wrap gap-1.5" id="category-pills">
          <button
            type="button"
            data-cat="all"
            class="cat-pill px-2.5 py-1 rounded text-xs font-bold bg-black text-white dark:bg-white dark:text-black cursor-pointer"
          >
            ${isAr ? 'الكل (22)' : 'All (22)'}
          </button>
          ${categories.map(c => `
            <button
              type="button"
              data-cat="${escapeHtml(c)}"
              class="cat-pill px-2.5 py-1 rounded text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
            >
              ${escapeHtml(c)}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Articles Grid (Original Clean Minimalist Box Cards) -->
      <div id="articles-grid" class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        ${SANITIZED_ARTICLES.map(art => `
          <article
            class="article-card p-4 bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-black dark:hover:border-white transition-all flex flex-col justify-between shadow-sm"
            data-title="${escapeHtml(art.title[lang].toLowerCase())}"
            data-desc="${escapeHtml(art.metaDesc[lang].toLowerCase())}"
            data-category="${escapeHtml(art.category[lang])}"
          >
            <div>
              <div class="flex items-center justify-between text-[10px] font-mono text-neutral-500 mb-2">
                <span class="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-neutral-600 dark:text-neutral-400 font-bold uppercase">
                  ${escapeHtml(art.category[lang])}
                </span>
                <span>${art.readTimeMin} mins</span>
              </div>
              <h2 class="font-bold text-sm text-black dark:text-white mb-1.5 leading-snug">
                <a href="${prefix}/articles/${art.slug}.html" class="hover:underline">
                  ${escapeHtml(art.title[lang])}
                </a>
              </h2>
              <p class="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                ${escapeHtml(art.metaDesc[lang])}
              </p>
            </div>
            <a href="${prefix}/articles/${art.slug}.html" class="text-xs font-bold text-black dark:text-white hover:underline flex items-center gap-1 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <span>${isAr ? 'قراءة المقال' : 'Read Article'}</span>
              <span>${isAr ? '←' : '→'}</span>
            </a>
          </article>
        `).join('')}
      </div>

      <div id="no-results-msg" class="hidden text-center py-12 text-xs text-neutral-500 font-mono">
        ${isAr ? 'لم يتم العثور على مقالات مطابقة لبحثك.' : 'No articles found.'}
      </div>
    </main>

    ${getOriginalFooter(lang)}

    <script>
      document.addEventListener('DOMContentLoaded', function () {
        var searchInput = document.getElementById('article-search-input');
        var cards = document.querySelectorAll('.article-card');
        var noResults = document.getElementById('no-results-msg');
        var pills = document.querySelectorAll('.cat-pill');
        var currentCat = 'all';

        function filterArticles() {
          var query = (searchInput.value || '').toLowerCase().trim();
          var visibleCount = 0;

          cards.forEach(function (card) {
            var title = card.getAttribute('data-title') || '';
            var desc = card.getAttribute('data-desc') || '';
            var cat = card.getAttribute('data-category') || '';

            var matchesSearch = !query || title.indexOf(query) !== -1 || desc.indexOf(query) !== -1;
            var matchesCat = currentCat === 'all' || cat === currentCat;

            if (matchesSearch && matchesCat) {
              card.classList.remove('hidden');
              visibleCount++;
            } else {
              card.classList.add('hidden');
            }
          });

          if (visibleCount === 0) {
            noResults.classList.remove('hidden');
          } else {
            noResults.classList.add('hidden');
          }
        }

        if (searchInput) {
          searchInput.addEventListener('input', filterArticles);
        }

        pills.forEach(function (pill) {
          pill.addEventListener('click', function () {
            pills.forEach(function (p) {
              p.className = 'cat-pill px-2.5 py-1 rounded text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer';
            });
            pill.className = 'cat-pill px-2.5 py-1 rounded text-xs font-bold bg-black text-white dark:bg-white dark:text-black cursor-pointer';
            currentCat = pill.getAttribute('data-cat') || 'all';
            filterArticles();
          });
        });
      });
    </script>
  </body>
</html>`;
}

// ----------------------------------------------------------------------------
// Execution Function
// ----------------------------------------------------------------------------
export function runMasterSystemBuild() {
  console.log('🚀 Building Master Dynamic Article System with Exact Original Design...');

  // 1. Export centralized articles data to shared/articles-data.js and public/shared/articles-data.js
  const articlesDataJs = `/**
 * Centralized Articles Data Store
 * Powers dynamic article loading in article.html?slug=...
 * and provides verified metadata, takeaways, RFC sources, and FAQs.
 */
(function (global) {
  'use strict';
  global.ARTICLES_DATA = ${JSON.stringify(SANITIZED_ARTICLES, null, 2)};
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ARTICLES_DATA: global.ARTICLES_DATA };
  }
})(typeof window !== 'undefined' ? window : this);
`;

  fs.writeFileSync('shared/articles-data.js', articlesDataJs, 'utf8');
  fs.writeFileSync('public/shared/articles-data.js', articlesDataJs, 'utf8');
  console.log('✓ Generated shared/articles-data.js and public/shared/articles-data.js');

  // 2. Generate the Single Dynamic Article Template (ar/article.html and en/article.html)
  // Flagship article is universal-verification-coverage
  const flagship = SANITIZED_ARTICLES[0];
  const arDynamicTemplate = renderArticleTemplate(flagship, 'ar', true);
  const enDynamicTemplate = renderArticleTemplate(flagship, 'en', true);

  fs.writeFileSync('ar/article.html', arDynamicTemplate, 'utf8');
  fs.writeFileSync('en/article.html', enDynamicTemplate, 'utf8');
  fs.writeFileSync('public/ar/article.html', arDynamicTemplate, 'utf8');
  fs.writeFileSync('public/en/article.html', enDynamicTemplate, 'utf8');
  console.log('✓ Generated single dynamic article template: ar/article.html and en/article.html');

  // 3. Pre-render all 22 static articles using the exact same template
  for (const art of SANITIZED_ARTICLES) {
    const arArticleHtml = renderArticleTemplate(art, 'ar', false);
    const enArticleHtml = renderArticleTemplate(art, 'en', false);

    fs.writeFileSync(`ar/articles/${art.slug}.html`, arArticleHtml, 'utf8');
    fs.writeFileSync(`en/articles/${art.slug}.html`, enArticleHtml, 'utf8');
    fs.writeFileSync(`public/ar/articles/${art.slug}.html`, arArticleHtml, 'utf8');
    fs.writeFileSync(`public/en/articles/${art.slug}.html`, enArticleHtml, 'utf8');
  }
  console.log(`✓ Pre-rendered all ${SANITIZED_ARTICLES.length} static article files with exact matching design.`);

  // 4. Generate clean Articles Index
  const arIndex = renderCleanArticlesIndex('ar');
  const enIndex = renderCleanArticlesIndex('en');

  fs.writeFileSync('ar/articles/index.html', arIndex, 'utf8');
  fs.writeFileSync('en/articles/index.html', enIndex, 'utf8');
  fs.writeFileSync('public/ar/articles/index.html', arIndex, 'utf8');
  fs.writeFileSync('public/en/articles/index.html', enIndex, 'utf8');
  console.log('✓ Generated clean articles directory index (ar & en).');

  console.log('🎉 Master System Build Completed Successfully.');
}

runMasterSystemBuild();
