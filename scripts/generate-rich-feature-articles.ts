import fs from 'node:fs';
import path from 'node:path';
import { featureTranslations } from './feature-translations-data.ts';

// 1. Merge featureTranslations into shared/i18n.js and public/shared/i18n.js
const i18nPath = 'shared/i18n.js';
let i18nContent = fs.readFileSync(i18nPath, 'utf8');

const allLangs = Object.keys(featureTranslations);

for (const lang of allLangs) {
  const keys = featureTranslations[lang] || {};
  const langKey = `${lang}: {`;
  const idx = i18nContent.indexOf(langKey);
  if (idx !== -1) {
    let braceCount = 0;
    let endIdx = -1;
    for (let i = idx; i < i18nContent.length; i++) {
      if (i18nContent[i] === '{') braceCount++;
      else if (i18nContent[i] === '}') {
        braceCount--;
        if (braceCount === 0) {
          endIdx = i;
          break;
        }
      }
    }

    if (endIdx !== -1) {
      const block = i18nContent.slice(idx, endIdx);
      const missingEntries = Object.entries(keys).filter(([k]) => !block.includes(`${k}:`));
      if (missingEntries.length > 0) {
        const toAdd = missingEntries.map(([k, v]) => `      ${k}: ${JSON.stringify(v)},`).join('\n') + '\n';
        i18nContent = i18nContent.slice(0, endIdx) + toAdd + '    ' + i18nContent.slice(endIdx);
      }
    }
  }
}

fs.writeFileSync('shared/i18n.js', i18nContent, 'utf8');
fs.writeFileSync('public/shared/i18n.js', i18nContent, 'utf8');
console.log('✓ Successfully merged all feature keys into shared/i18n.js');

// 2. Master Unified 4-Column Footer
function getUnifiedFooter(lang: 'ar' | 'en') {
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
              Free and technically isolated temporary email service protecting your inbox against spam and trackers without any registration.
            </p>
            <div class="inline-flex items-center gap-2 font-mono text-[11px] text-black dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 rounded-md px-2 py-1 bg-neutral-50 dark:bg-neutral-900">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span data-i18n="footerNodesStatus">All edge nodes operational</span>
            </div>
          </div>

          <!-- Column 2: Navigation -->
          <div>
            <div class="font-bold text-black dark:text-white mb-3 uppercase tracking-wider text-[11px]" data-i18n="footerNav">
              Navigation
            </div>
            <ul class="space-y-2">
              <li><a href="${prefix}/" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors" data-i18n="home">Home</a></li>
              <li><a href="${prefix}/blog.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors" data-i18n="blog">Blog</a></li>
              <li><a href="${prefix}/guide.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors" data-i18n="guide">Guide</a></li>
              <li><a href="${prefix}/faq.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors" data-i18n="faq">FAQ</a></li>
              <li><a href="${prefix}/articles/index.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors" data-i18n="footerArticles">Articles</a></li>
            </ul>
          </div>

          <!-- Column 3: Legal & Transparency -->
          <div>
            <div class="font-bold text-black dark:text-white mb-3 uppercase tracking-wider text-[11px]" data-i18n="footerTransparency">
              Legal & Safety
            </div>
            <ul class="space-y-2">
              <li><a href="${prefix}/about.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors" data-i18n="footerAbout">About</a></li>
              <li><a href="${prefix}/privacy.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors" data-i18n="footerPrivacy">Privacy Policy</a></li>
              <li><a href="${prefix}/privacy.html#terms" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors" data-i18n="footerTerms">Terms</a></li>
            </ul>
          </div>

          <!-- Column 4: Security Pillars -->
          <div>
            <div class="font-bold text-black dark:text-white mb-3 uppercase tracking-wider text-[11px]" data-i18n="footerSecurity">
              Security Standards
            </div>
            <ul class="space-y-2 text-neutral-600 dark:text-neutral-400">
              <li class="flex items-center gap-1.5">
                <span class="text-black dark:text-white font-bold">✓</span>
                <span data-i18n="footerSec1">Auto-purge after 20 minutes</span>
              </li>
              <li class="flex items-center gap-1.5">
                <span class="text-black dark:text-white font-bold">✓</span>
                <span data-i18n="footerSec2">Encrypted O(1) isolation</span>
              </li>
              <li class="flex items-center gap-1.5">
                <span class="text-black dark:text-white font-bold">✓</span>
                <span data-i18n="footerSec3">Zero personal logs and cookies</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="border-t border-neutral-200 dark:border-neutral-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div data-i18n="footerCopyright">© 2026 Temp Mail. All rights reserved.</div>
          <div class="flex items-center gap-4 font-mono text-[11px]">
            <span>TLS 1.3 256-Bit</span>
            <span>•</span>
            <span>Cloudflare Edge</span>
            <span>•</span>
            <span>Zero-Logs Verified</span>
          </div>
        </div>
      </div>
    </footer>`;
}

// 3. Feature Article Definition
interface FeatureArticleConfig {
  slug: string;
  prefix: 'uvc' | 'ws' | 'iso' | 'ml';
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  readTime: string;
  datePublished: string;
  faqItems: Array<{ qAr: string; aAr: string; qEn: string; aEn: string; qKey: string; aKey: string }>;
}

const features: FeatureArticleConfig[] = [
  {
    slug: 'universal-verification-coverage.html',
    prefix: 'uvc',
    titleAr: 'التغطية الشاملة لرسائل التحقق: فك شفرات OTP والروابط الخفية بدقة 100%',
    titleEn: 'Universal Verification Coverage: How Our Engine Decodes Complex OTPs and Hidden Links',
    descAr: 'تحليل هندسي مفصل لكيفية تفوق محركنا في استخراج رموز Google G-tokens وأكواد Steam Guard وروابط التفعيل المقنعة.',
    descEn: 'An in-depth engineering breakdown of how our dual-layer edge engine extracts Google G-tokens, Steam Guard pins, and masked CTA links.',
    readTime: '6 mins read',
    datePublished: '2026-09-25',
    faqItems: [
      { qAr: 'لماذا يفشل البريد المؤقت التقليدي في قراءة رسائل جوجل؟', aAr: 'لأن جوجل ترسل الرمز مسبوقاً بالحرف G وفاصلة (مثل G-123456)، والفلاتر التقليدية تبحث عن أرقام فقط فتتجاهل الحرف أو تفصل الكود.', qEn: 'Why do legacy temporary mail platforms fail on Google security emails?', aEn: 'Because Google prepends the letter "G-" to verification passcodes. Naive numeric parsers treat the hyphen as punctuation and ignore the authentic token.', qKey: 'uvcFaq1Q', aKey: 'uvcFaq1A' },
      { qAr: 'هل يقوم محرككم بتشغيل روابط التفعيل تلقائياً؟', aAr: 'كلا، نحن لا ننقر على الرابط تلقائياً حتى لا نحرق الروابط أحادية الاستخدام، بل نستخرجه بأمان ونقدمه لك لتفتحه بنقرة واحدة.', qEn: 'Does your engine click verification links automatically?', aEn: 'No. Automated pre-fetching would prematurely invalidate single-use security links. We extract the URL safely and let you click or copy it intentionally.', qKey: 'uvcFaq2Q', aKey: 'uvcFaq2A' },
      { qAr: 'هل تدعمون رموز التحقق بلغات غير الإنجليزية؟', aAr: 'نعم، يدعم محركنا الكلمات المفتاحية وسياقات التحقق في جميع اللغات الـ 22 المدعومة في الموقع.', qEn: 'Are non-English verification emails supported?', aEn: 'Yes. Our semantic analyzer recognizes verification keywords across all 22 supported languages on the platform.', qKey: 'uvcFaq3Q', aKey: 'uvcFaq3A' }
    ]
  },
  {
    slug: 'how-inbox-updates-live.html',
    prefix: 'ws',
    titleAr: 'التحديث اللحظي عبر WebSocket: كيف تصل الرسائل خلال ميلي ثانية بدون إعادة تحميل؟',
    titleEn: 'Real-Time WebSocket Streaming: How Inbound Emails Arrive in Milliseconds Without Refreshing',
    descAr: 'نظرة متعمقة على تقنية Cloudflare Durable Objects و WebSocket Hibernation التي تمكن صندوقك من استقبال الرسائل لحظياً.',
    descEn: 'An architectural exploration of Cloudflare Durable Objects and WebSocket Hibernation pushing emails to your browser live with zero battery drain.',
    readTime: '4 mins read',
    datePublished: '2026-09-21',
    faqItems: [
      { qAr: 'هل يعمل التحديث اللحظي على الهواتف المحمولة والمتصفحات الضعيفة؟', aAr: 'نعم، تقنية WebSocket مدعومة بنسبة 99.8% في جميع المتصفحات الحديثة وتعمل بكفاءة استثنائية على شبكات 4G و 5G و Wi-Fi.', qEn: 'Does live WebSocket streaming work on mobile browsers?', aEn: 'Yes. WebSockets are universally supported across all modern mobile browsers and work reliably on 4G, 5G, and Wi-Fi networks.', qKey: 'wsFaq1Q', aKey: 'wsFaq1A' },
      { qAr: 'ماذا يحدث إذا انقطع اتصال الإنترنت لبضع ثوانٍ؟', aAr: 'يقوم العميل المدمج لدينا بمحاولة إعادة الاتصال تلقائياً فور عودة الشبكة وجلب أي رسائل وردت خلال فترة الانقطاع.', qEn: 'What happens if my connection drops briefly?', aEn: 'Our client automatically reconnects the instant network access returns, querying for any messages received during the brief disconnection.', qKey: 'wsFaq2Q', aKey: 'wsFaq2A' },
      { qAr: 'هل يمكنني إبقاء الصندوق مفتوحاً أثناء انتظار الرسالة؟', aAr: 'بالتأكيد، سيبقى الصندوق حياً ويستقبل الرسائل دون أن تحتاج للتحقق اليدوي.', qEn: 'Can I keep the tab in the background while waiting for an email?', aEn: 'Yes. The WebSocket connection remains active in the background, receiving messages without requiring tab focus.', qKey: 'wsFaq3Q', aKey: 'wsFaq3A' }
    ]
  },
  {
    slug: 'temp-mail-vs-spam-filters.html',
    prefix: 'iso',
    titleAr: 'عزل الذاكرة O(1) وحظر بكسلات التتبع: لماذا يتفوق البريد المؤقت على فلاتر Spam التقليدية؟',
    titleEn: 'O(1) Ephemeral Memory Isolation & Pixel Blocking: Why Temporary Email Beats Spam Filters',
    descAr: 'دراسة أمنية توضح كيف تكسر الحاويات المؤقتة سلاسل التتبع بين المواقع وتحظر بكسلات التجسس وتضمن حماية الهوية الرقمية.',
    descEn: 'How ephemeral containers sever cross-site correlation chains, block hidden surveillance pixels, and protect your digital identity from data broker dossiers.',
    readTime: '5 mins read',
    datePublished: '2026-09-25',
    faqItems: [
      { qAr: 'كيف يحميني حظر الصور من تسريب موقعي الجغرافي؟', aAr: 'بكسلات التتبع هي صور شفافة صغيرة جداً يتم تحميلها من خادم المعلن. عندما يحظرها محركنا، لا يتصل متصفحك بخادم المعلن فلا يعرف عنوان IP الخاص بك إطلاقاً.', qEn: 'How does blocking images safeguard my location and identity?', aEn: 'Tracking pixels are microscopic images hosted on marketing servers. When your browser requests that image, the server logs your IP address and physical location. Blocking the request prevents this surveillance entirely.', qKey: 'isoFaq1Q', aKey: 'isoFaq1A' },
      { qAr: 'هل يمكن استعادة الرسائل بعد انتهاء مدة الـ 20 دقيقة؟', aAr: 'مستحيل تماماً. بعد انتهاء الوقت يتم مسح مفاتيح التشفير وإتلاف الحاوية من ذاكرة الخادم فورياً وبشكل نهائي.', qEn: 'Can emails be recovered after the 20-minute countdown ends?', aEn: 'No. Once the timer reaches zero or you click Burn Mailbox, all container keys are discarded and memory is permanently cleared.', qKey: 'isoFaq2Q', aKey: 'isoFaq2A' },
      { qAr: 'هل تسجلون عنوان IP الخاص بي أثناء استخدام الموقع؟', aAr: 'كلا، نحن نطبق سياسة صارمة خالية من السجلات (Zero-Logs Policy) ولا نستخدم أي ملفات تعريف ارتباط شخصية (Cookies).', qEn: 'Do you log my IP address or set tracking cookies?', aEn: 'No. We operate under a strict zero-logs policy and use no marketing, analytical, or profiling cookies whatsoever.', qKey: 'isoFaq3Q', aKey: 'isoFaq3A' }
    ]
  },
  {
    slug: 'magic-links-vs-otp.html',
    prefix: 'ml',
    titleAr: 'الروابط السحرية مقابل رموز OTP: كيف يمنع محركنا احتراق الروابط أحادية الاستخدام؟',
    titleEn: 'Magic Links vs. OTP Verification Codes: How Our Passive Engine Preserves Single-Use Tokens',
    descAr: 'تحليل معماري لكيفية تعامل محركنا مع روابط تسجيل الدخول أحادية الاستخدام وحمايتها من بوتات الفحص المسبق.',
    descEn: 'An architectural breakdown of why passwordless login links burn prematurely on legacy disposable mail platforms and how our passive ingestion engine preserves tokens intact.',
    readTime: '5 mins read',
    datePublished: '2026-09-25',
    faqItems: [
      { qAr: 'ما هو الرابط السحري (Magic Link)؟', aAr: 'هو رابط تسجيل دخول بدون كلمة مرور يحتوي على رمز مشفر يُرسل لبريدك، وبمجرد النقر عليه يتم توثيق حسابك فوراً.', qEn: 'What is a magic link?', aEn: 'A magic link is a passwordless authentication URL containing an encrypted, single-use token that logs you in immediately upon clicking.', qKey: 'mlFaq1Q', aKey: 'mlFaq1A' },
      { qAr: 'لماذا كان الرابط يعطيني خطأ "Link Expired" في المواقع المنافسة؟', aAr: 'لأن برمجيات الفحص المسبق في تلك المواقع كانت تفتح الرابط تلقائياً قبل أن تفتحه أنت، مما يبطل مفعوله أحادي الاستخدام.', qEn: 'Why do magic links expire on other temporary email platforms?', aEn: 'Because their backend systems run automated security scanners that visit the link before you do, consuming the single-use token.', qKey: 'mlFaq2Q', aKey: 'mlFaq2A' },
      { qAr: 'هل يمكنني نسخ الرابط واستخدامه في متصفح خفي (Incognito)؟', aAr: 'نعم بكل تأكيد، زر نسخ الرابط المباشر يتيح لك لصقه في أي نافذة أو متصفح تريده بأمان تام.', qEn: 'Can I copy the extracted link and use it in a different browser window?', aEn: 'Yes. Our 1-click copy button allows you to paste the URL directly into an incognito or private browsing window.', qKey: 'mlFaq3Q', aKey: 'mlFaq3A' }
    ]
  }
];

function generateArticlePage(cfg: FeatureArticleConfig, lang: 'ar' | 'en') {
  const isAr = lang === 'ar';
  const prefix = isAr ? '/ar' : '/en';
  const dir = isAr ? 'rtl' : 'ltr';
  const font = isAr ? "font-['Cairo',sans-serif]" : "font-['Inter',sans-serif]";
  const arrow = isAr ? '←' : '→';

  const title = isAr ? cfg.titleAr : cfg.titleEn;
  const desc = isAr ? cfg.descAr : cfg.descEn;
  const p = cfg.prefix;

  // Schema.org JSON-LD (TechArticle + FAQPage + BreadcrumbList)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": `https://freetemp.email${prefix}/articles/${cfg.slug}#article`,
        "headline": title,
        "description": desc,
        "inLanguage": lang,
        "datePublished": `${cfg.datePublished}T08:00:00+00:00`,
        "dateModified": "2026-09-25T10:00:00+00:00",
        "author": {
          "@type": "Organization",
          "name": "Temp Mail Security Engineering Team",
          "url": "https://freetemp.email/"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Temp Mail",
          "url": "https://freetemp.email/",
          "logo": {
            "@type": "ImageObject",
            "url": "https://freetemp.email/logo.svg"
          }
        },
        "mainEntityOfPage": `https://freetemp.email${prefix}/articles/${cfg.slug}`
      },
      {
        "@type": "BreadcrumbList",
        "@id": `https://freetemp.email${prefix}/articles/${cfg.slug}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": isAr ? "الرئيسية" : "Home",
            "item": `https://freetemp.email${prefix}/`
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": isAr ? "المدونة" : "Blog",
            "item": `https://freetemp.email${prefix}/blog.html`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": title,
            "item": `https://freetemp.email${prefix}/articles/${cfg.slug}`
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `https://freetemp.email${prefix}/articles/${cfg.slug}#faq`,
        "mainEntity": cfg.faqItems.map(item => ({
          "@type": "Question",
          "name": isAr ? item.qAr : item.qEn,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": isAr ? item.aAr : item.aEn
          }
        }))
      }
    ]
  };

  const html = `<!doctype html>
<html lang="${lang}" dir="${dir}">
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
    <title>${title} — Temp Mail</title>
    <meta name="description" content="${desc}" />
    <meta name="author" content="Temp Mail Security Engineering Team" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://freetemp.email${prefix}/articles/${cfg.slug}" />

    <!-- Multilingual Alternates -->
    <link rel="alternate" hreflang="ar" href="https://freetemp.email/ar/articles/${cfg.slug}" />
    <link rel="alternate" hreflang="en" href="https://freetemp.email/en/articles/${cfg.slug}" />
    <link rel="alternate" hreflang="x-default" href="https://freetemp.email/en/articles/${cfg.slug}" />

    <!-- Open Graph Tags -->
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Temp Mail" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:url" content="https://freetemp.email${prefix}/articles/${cfg.slug}" />
    <meta property="og:image" content="https://freetemp.email/og-image.png" />
    <meta property="og:locale" content="${isAr ? 'ar_AR' : 'en_US'}" />

    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${desc}" />
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
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        darkMode: 'class',
      };
    </script>

    <!-- Schema.org JSON-LD (TechArticle + FAQPage + BreadcrumbList) -->
    <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
    </script>
  </head>
  <body class="min-h-screen bg-white text-black dark:bg-[#0D0D0D] dark:text-[#F5F5F5] flex flex-col transition-colors duration-200 ${font}">
    <!-- Master Header -->
    <header class="border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-[#0D0D0D]/95 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div class="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div class="flex items-center gap-6">
          <a href="${prefix}/" class="text-xl font-bold tracking-tight text-black dark:text-white hover:opacity-80 transition-opacity flex items-center gap-2">
            <span class="w-6 h-6 rounded bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-xs font-mono font-extrabold">T</span>
            <span data-i18n="brand">Temp Mail</span>
          </a>

          <nav class="hidden md:flex items-center gap-4 text-xs font-medium">
            <a href="${prefix}/" data-i18n="home" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Home</a>
            <a href="${prefix}/blog.html" data-i18n="blog" class="text-black dark:text-white font-bold transition-colors">Blog</a>
            <a href="${prefix}/guide.html" data-i18n="guide" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Guide</a>
            <a href="${prefix}/faq.html" data-i18n="faq" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">FAQ</a>
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

    <!-- Main Content Container -->
    <main class="flex-1 max-w-3xl w-full mx-auto px-4 py-8 sm:py-12">
      <!-- Breadcrumbs -->
      <nav class="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-6 font-mono">
        <a href="${prefix}/" class="hover:underline" data-i18n="artNavHome">Home</a>
        <span>/</span>
        <a href="${prefix}/blog.html" class="hover:underline" data-i18n="artNavBlog">Blog</a>
        <span>/</span>
        <span class="text-black dark:text-white font-semibold" data-i18n="${p}Badge">${isAr ? cfg.titleAr : cfg.titleEn}</span>
      </nav>

      <!-- Article Header -->
      <article>
        <header class="mb-8">
          <div class="flex flex-wrap items-center gap-2 mb-3 text-[11px] font-mono">
            <span class="px-2.5 py-0.5 rounded-full bg-black text-white dark:bg-white dark:text-black font-bold uppercase tracking-wider text-[10px]" data-i18n="${p}Badge">
              ${isAr ? 'ميزة حصرية' : 'Core Architecture'}
            </span>
            <span class="text-neutral-400">•</span>
            <span class="text-neutral-500 font-mono" data-i18n="featBadgeTech">Technical Deep-Dive</span>
            <span class="text-neutral-400">•</span>
            <span class="text-neutral-500 font-mono">${cfg.readTime}</span>
            <span class="text-neutral-400">•</span>
            <time datetime="${cfg.datePublished}" class="text-neutral-500 font-mono">${cfg.datePublished}</time>
          </div>

          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-black dark:text-white mb-4 leading-tight tracking-tight" data-i18n="${p}Title">
            ${title}
          </h1>

          <p class="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed" data-i18n="${p}Subtitle">
            ${desc}
          </p>
        </header>

        <!-- Key Highlights Box -->
        <div class="mb-10 p-5 sm:p-6 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm">
          <h2 class="text-sm font-bold text-black dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2" data-i18n="featKeyHighlightsTitle">
            <svg class="w-4 h-4 text-emerald-500 stroke-current fill-none stroke-[2.5]" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Key Technical Highlights in this Guide
          </h2>
          <ul class="space-y-3 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
            <li class="flex items-start gap-2.5">
              <span class="text-black dark:text-white font-bold shrink-0 mt-0.5">✓</span>
              <span data-i18n="${p}Highlight1">${isAr ? 'ميزة تقنية 1' : 'Highlight 1'}</span>
            </li>
            <li class="flex items-start gap-2.5">
              <span class="text-black dark:text-white font-bold shrink-0 mt-0.5">✓</span>
              <span data-i18n="${p}Highlight2">${isAr ? 'ميزة تقنية 2' : 'Highlight 2'}</span>
            </li>
            <li class="flex items-start gap-2.5">
              <span class="text-black dark:text-white font-bold shrink-0 mt-0.5">✓</span>
              <span data-i18n="${p}Highlight3">${isAr ? 'ميزة تقنية 3' : 'Highlight 3'}</span>
            </li>
            <li class="flex items-start gap-2.5">
              <span class="text-black dark:text-white font-bold shrink-0 mt-0.5">✓</span>
              <span data-i18n="${p}Highlight4">${isAr ? 'ميزة تقنية 4' : 'Highlight 4'}</span>
            </li>
          </ul>
        </div>

        <!-- Section 1: Problem in Legacy Services -->
        <section class="mb-10">
          <h2 class="text-xl sm:text-2xl font-bold text-black dark:text-white mb-4 leading-snug" data-i18n="${p}Sec1Title">
            ${isAr ? 'المشكلة في المنصات القديمة' : 'The Problem with Legacy Services'}
          </h2>
          <div class="space-y-4 text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
            <p data-i18n="${p}Sec1P1">
              Detailed technical description of legacy problems.
            </p>
            <p data-i18n="${p}Sec1P2">
              Detailed architectural analysis.
            </p>
          </div>
        </section>

        <!-- Section 2: Our Architecture Solution -->
        <section class="mb-10">
          <h2 class="text-xl sm:text-2xl font-bold text-black dark:text-white mb-4 leading-snug" data-i18n="${p}Sec2Title">
            ${isAr ? 'الحل المعماري ومحركنا المتطور' : 'Our Advanced Edge Engine Architecture'}
          </h2>
          <div class="space-y-4 text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
            <p data-i18n="${p}Sec2P1">
              Description of how our engine handles ingestion.
            </p>
            <p data-i18n="${p}Sec2P2">
              Layer 1 breakdown.
            </p>
            ${cfg.prefix === 'uvc' ? `<p data-i18n="uvcSec2P3">Layer 2 breakdown.</p>` : ''}
          </div>
        </section>

        <!-- Section 3: Performance Comparison Matrix (Clean Google Table) -->
        <section class="mb-12">
          <h2 class="text-lg sm:text-xl font-bold text-black dark:text-white mb-4" data-i18n="featComparisonTitle">
            Performance Benchmark: Our Engine vs. Legacy Disposable Mail
          </h2>
          <div class="overflow-x-auto border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm">
            <table class="w-full text-left text-xs sm:text-sm">
              <thead class="bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 font-mono">
                <tr>
                  <th class="p-3 sm:p-4 font-bold" data-i18n="featCompColFeature">Technical Capability</th>
                  <th class="p-3 sm:p-4 font-bold" data-i18n="featCompColLegacy">Legacy Disposable Services</th>
                  <th class="p-3 sm:p-4 font-bold text-black dark:text-white" data-i18n="featCompColOurEngine">Our Edge Engine</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-neutral-200 dark:divide-neutral-800 bg-white dark:bg-[#121212]">
                <tr>
                  <td class="p-3 sm:p-4 font-semibold text-black dark:text-white" data-i18n="${p}CompRow1Feat">Feature Row 1</td>
                  <td class="p-3 sm:p-4 text-neutral-500" data-i18n="${p}CompRow1Legacy">Legacy Row 1</td>
                  <td class="p-3 sm:p-4 font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5" data-i18n="${p}CompRow1Our">✓ Our Row 1</td>
                </tr>
                <tr>
                  <td class="p-3 sm:p-4 font-semibold text-black dark:text-white" data-i18n="${p}CompRow2Feat">Feature Row 2</td>
                  <td class="p-3 sm:p-4 text-neutral-500" data-i18n="${p}CompRow2Legacy">Legacy Row 2</td>
                  <td class="p-3 sm:p-4 font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5" data-i18n="${p}CompRow2Our">✓ Our Row 2</td>
                </tr>
                <tr>
                  <td class="p-3 sm:p-4 font-semibold text-black dark:text-white" data-i18n="${p}CompRow3Feat">Feature Row 3</td>
                  <td class="p-3 sm:p-4 text-neutral-500" data-i18n="${p}CompRow3Legacy">Legacy Row 3</td>
                  <td class="p-3 sm:p-4 font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5" data-i18n="${p}CompRow3Our">✓ Our Row 3</td>
                </tr>
                <tr>
                  <td class="p-3 sm:p-4 font-semibold text-black dark:text-white" data-i18n="${p}CompRow4Feat">Feature Row 4</td>
                  <td class="p-3 sm:p-4 text-neutral-500" data-i18n="${p}CompRow4Legacy">Legacy Row 4</td>
                  <td class="p-3 sm:p-4 font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5" data-i18n="${p}CompRow4Our">✓ Our Row 4</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Section 4: Interactive FAQ Accordion -->
        <section class="mb-12">
          <h2 class="text-xl sm:text-2xl font-bold text-black dark:text-white mb-6" data-i18n="featFaqHeading">
            Frequently Asked Questions About This Feature
          </h2>
          <div class="space-y-4">
            ${cfg.faqItems.map((item, idx) => `
            <details class="group p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl transition-all cursor-pointer">
              <summary class="font-bold text-sm text-black dark:text-white flex items-center justify-between gap-4 list-none select-none">
                <span data-i18n="${item.qKey}">${isAr ? item.qAr : item.qEn}</span>
                <span class="text-xs transition-transform duration-200 group-open:rotate-180 font-mono">▼</span>
              </summary>
              <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-3 leading-relaxed border-t border-neutral-200 dark:border-neutral-800 pt-3" data-i18n="${item.aKey}">
                ${isAr ? item.aAr : item.aEn}
              </p>
            </details>
            `).join('')}
          </div>
        </section>

        <!-- Section 5: High-Impact Bottom Call to Action -->
        <div class="p-8 bg-neutral-50 dark:bg-neutral-900 border-2 border-black dark:border-white rounded-2xl text-center shadow-sm">
          <h3 class="text-lg sm:text-xl font-extrabold text-black dark:text-white mb-2" data-i18n="blogCtaTitle">
            Ready to test our engine?
          </h3>
          <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-6 max-w-lg mx-auto leading-relaxed" data-i18n="blogCtaDesc">
            Get an isolated disposable address and receive your OTP code or activation link live in seconds without signup.
          </p>
          <div class="flex flex-wrap items-center justify-center gap-4">
            <a
              href="${prefix}/"
              class="px-6 py-3 bg-black text-white dark:bg-white dark:text-black rounded-lg text-xs sm:text-sm font-bold hover:opacity-90 transition-opacity"
              data-i18n="goToInbox"
            >
              Go to Live Inbox ${arrow}
            </a>
            <a
              href="${prefix}/blog.html"
              class="px-6 py-3 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white rounded-lg text-xs sm:text-sm font-bold hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              data-i18n="blog"
            >
              More Research Articles
            </a>
          </div>
        </div>
      </article>
    </main>

    ${getUnifiedFooter(lang)}
  </body>
</html>`;

  const targetPath = path.join(lang, 'articles', cfg.slug);
  const publicPath = path.join('public', lang, 'articles', cfg.slug);

  fs.writeFileSync(targetPath, html, 'utf8');
  fs.writeFileSync(publicPath, html, 'utf8');
  console.log(`✓ Generated ${targetPath} and ${publicPath}`);
}

features.forEach(cfg => {
  generateArticlePage(cfg, 'ar');
  generateArticlePage(cfg, 'en');
});

console.log('✓ All feature articles generated successfully with responsive design, SEO Schema, and 22-language translation support!');
