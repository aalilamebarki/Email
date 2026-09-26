import fs from 'node:fs';
import path from 'node:path';
import { blogTranslations } from './blog-translations-data.ts';
import { articleTranslations } from './generate-all-article-translations.ts';

// 1. Merge translations into shared/i18n.js and public/shared/i18n.js
const i18nPath = 'shared/i18n.js';
let i18nContent = fs.readFileSync(i18nPath, 'utf8');

const allLangs = Object.keys(blogTranslations);

for (const lang of allLangs) {
  const bKeys = blogTranslations[lang] || {};
  const aKeys = articleTranslations[lang] || {};
  const combined = { ...bKeys, ...aKeys };

  // Find language block in DICTIONARY
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
      const missingEntries = Object.entries(combined).filter(([k]) => !block.includes(`${k}:`));
      if (missingEntries.length > 0) {
        const toAdd = missingEntries.map(([k, v]) => `      ${k}: ${JSON.stringify(v)},`).join('\n') + '\n';
        i18nContent = i18nContent.slice(0, endIdx) + toAdd + '    ' + i18nContent.slice(endIdx);
      }
    }
  }
}

// Enhance applyTranslationsToDOM
const oldApplyRegex = /function applyTranslationsToDOM\(\) \{[\s\S]*?function openLanguageModal\(\)/m;
const newApplyLogic = `function applyTranslationsToDOM() {
    const s = getStrings();
    const meta = getLanguageMeta();

    document.documentElement.lang = currentLang;
    document.documentElement.dir = meta.dir;

    // Update data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (s[key]) {
        el.textContent = s[key];
      }
    });

    // Update data-i18n-html elements
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      if (s[key]) {
        el.innerHTML = s[key];
      }
    });

    // Update data-i18n-placeholder elements
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (s[key]) {
        el.placeholder = s[key];
      }
    });

    // Update data-i18n-title elements
    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      const key = el.getAttribute('data-i18n-title');
      if (s[key]) {
        el.setAttribute('title', s[key]);
      }
    });

    // Update data-i18n-aria elements
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      const key = el.getAttribute('data-i18n-aria');
      if (s[key]) {
        el.setAttribute('aria-label', s[key]);
      }
    });

    // Update active label on all language buttons with native language name
    document.querySelectorAll('#current-lang-label, .current-lang-label').forEach((lbl) => {
      lbl.textContent = meta.native || (currentLang === 'ar' ? 'العربية' : 'English');
    });
  }

  /**
   * Render Language Selector Modal (Clean Google-like box design)
   */
  function openLanguageModal()`;

i18nContent = i18nContent.replace(oldApplyRegex, newApplyLogic);

fs.writeFileSync('shared/i18n.js', i18nContent, 'utf8');
fs.writeFileSync('public/shared/i18n.js', i18nContent, 'utf8');
console.log('✓ Successfully updated shared/i18n.js and public/shared/i18n.js with all blog and article translations');

// 2. Build full master 4-column footer HTML with data-i18n
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

// 3. Update blog.html files
function updateBlogHTML(filePath: string, lang: 'ar' | 'en') {
  if (!fs.existsSync(filePath)) return;
  const isAr = lang === 'ar';
  const prefix = isAr ? '/ar' : '/en';
  const dir = isAr ? 'rtl' : 'ltr';
  const font = isAr ? "font-['Cairo',sans-serif]" : "font-['Inter',sans-serif]";
  const arrow = isAr ? '←' : '→';

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
    <title>${isAr ? 'مدونة البريد المؤقت — مقالات الأمان، أبحاث التحقق، ودراسات الخصوصية' : 'Engineering Blog & Research — Temp Mail'}</title>
    <meta
      name="description"
      content="${isAr ? 'المدونة التقنية والبحثية لخدمة بريد مؤقت: مقالات تحليلية حول التغطية الشاملة لرسائل التحقق OTP، أبحاث حماية الخصوصية، ومقارنات مع فلاتر البريد العشوائي التقليدية.' : 'Deep-dives on Universal Verification Coverage algorithms, ephemeral container isolation, anti-tracking techniques, and mathematical privacy protection.'}"
    />
    <link rel="canonical" href="https://freetemp.email${prefix}/blog.html" />

    <!-- Multilingual Alternates -->
    <link rel="alternate" hreflang="ar" href="https://freetemp.email/ar/blog.html" />
    <link rel="alternate" hreflang="en" href="https://freetemp.email/en/blog.html" />
    <link rel="alternate" hreflang="x-default" href="https://freetemp.email/en/blog.html" />

    <!-- Open Graph Tags -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Temp Mail" />
    <meta property="og:title" content="${isAr ? 'مدونة البريد المؤقت — مقالات الأمان والخصوصية' : 'Engineering Blog & Research — Temp Mail'}" />
    <meta property="og:description" content="${isAr ? 'مقالات تحليلية وبحوث موثوقة حول خوارزميات فك تشفير رسائل التحقق وحماية الخصوصية.' : 'Deep-dives on Universal Verification Coverage algorithms and privacy protection.'}" />
    <meta property="og:url" content="https://freetemp.email${prefix}/blog.html" />
    <meta property="og:image" content="https://freetemp.email/og-image.png" />

    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${isAr ? 'مدونة البريد المؤقت — مقالات الأمان والخصوصية' : 'Engineering Blog & Research — Temp Mail'}" />
    <meta name="twitter:description" content="${isAr ? 'مقالات متخصصة في أمان البريد الإلكتروني وأبحاث استخراج رموز التحقق.' : 'Technical research on disposable email security and verification decoding.'}" />
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
    <main class="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12">
      <!-- Breadcrumbs -->
      <nav class="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-6 font-mono">
        <a href="${prefix}/" class="hover:underline" data-i18n="artNavHome">Home</a>
        <span>/</span>
        <span class="text-black dark:text-white font-semibold" data-i18n="blogBreadcrumb">Engineering Blog & Research</span>
      </nav>

      <!-- Difference Callout: Blog vs Guide -->
      <div class="mb-8 p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-black dark:text-white shrink-0 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          <span class="text-neutral-700 dark:text-neutral-300 leading-relaxed" data-i18n="blogReaderNote">
            Reader Note: The Blog covers technical research, protocol security, and benchmarks. Looking for step-by-step instructions on generating addresses and using buttons?
          </span>
        </div>
        <a href="${prefix}/guide.html" class="font-bold text-black dark:text-white underline hover:opacity-80 shrink-0" data-i18n="visitGuideLink">
          Visit Operational User Guide ${arrow}
        </a>
      </div>

      <!-- Blog Header -->
      <div class="mb-10 text-center max-w-2xl mx-auto">
        <h1 class="text-3xl sm:text-4xl font-extrabold text-black dark:text-white tracking-tight mb-3" data-i18n="blogHeading">
          Engineering Blog & Research
        </h1>
        <p class="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed" data-i18n="blogSubtitle">
          Deep-dives on Universal Verification Coverage algorithms, ephemeral container isolation, anti-tracking techniques, and mathematical privacy protection.
        </p>
      </div>

      <!-- Featured Article Card (New Landmark Article) -->
      <div class="mb-10 p-6 sm:p-8 bg-white dark:bg-[#121212] border-2 border-black dark:border-white rounded-xl shadow-sm hover:shadow-md transition-all">
        <div class="flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 font-mono mb-3">
          <span class="px-2.5 py-0.5 bg-black text-white dark:bg-white dark:text-black rounded text-[11px] font-bold" data-i18n="featuredBadge">Featured Research Paper</span>
          <span data-i18n="readTime6">Read time: 6 mins</span>
          <span>•</span>
          <time datetime="2026-09-25">2026-09-25</time>
        </div>
        <h2 class="text-xl sm:text-2xl font-bold text-black dark:text-white mb-3 leading-snug">
          <a href="${prefix}/articles/universal-verification-coverage.html" class="hover:underline" data-i18n="featuredPaperTitle">
            Universal Verification Coverage: How Our Engine Decodes Complex OTPs and Hidden Verification Links While Competitors Fail
          </a>
        </h2>
        <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4" data-i18n="featuredPaperDesc">
          A technical analysis of why legacy disposable mail platforms fail when encountering Google G-XXXXXX tokens, Steam Guard alphanumeric codes, segmented 2FA numbers, and masked redirect links from SendGrid/Mailgun. See how our dual-layer edge engine delivers 100% verification accuracy.
        </p>
        <div class="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-800 text-xs">
          <span class="text-neutral-500 font-mono" data-i18n="featuredCategory">Category: Protocol Engineering & Security</span>
          <a href="${prefix}/articles/universal-verification-coverage.html" class="font-bold text-black dark:text-white flex items-center gap-1 hover:underline">
            <span data-i18n="readFullPaper">Read Full Paper</span>
            <span>${arrow}</span>
          </a>
        </div>
      </div>

      <!-- Articles Grid: Boxes Layout (Clean Google-Style) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <!-- Flagship Master Article: The Definitive Guide 2026 -->
        <article class="p-6 bg-white dark:bg-[#121212] border-2 border-black dark:border-white rounded-xl shadow-sm hover:border-neutral-700 dark:hover:border-neutral-300 transition-all flex flex-col justify-between md:col-span-2">
          <div>
            <div class="flex items-center gap-2 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mb-2">
              <span class="font-bold text-black dark:text-white" data-i18n="flagshipBadge">Flagship Guide 2026</span>
              <span>•</span>
              <time datetime="2026-09-25">2026-09-25</time>
              <span>•</span>
              <span data-i18n="readTime6">6 mins read</span>
            </div>
            <h3 class="text-lg sm:text-xl font-extrabold text-black dark:text-white mb-2 leading-tight">
              <a href="${prefix}/article.html" class="hover:underline" data-i18n="flagshipTitle">
                The Definitive Guide to Disposable Temporary Email & Digital Privacy in 2026: How Ephemeral Inboxes Block Tracking & Data Brokers
              </a>
            </h3>
            <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4" data-i18n="flagshipDesc">
              An architectural breakdown of how temporary email breaks cross-site correlation chains, isolates web tracking beacons, and delivers single-use OTP codes with zero permanent data retention.
            </p>
          </div>
          <div class="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs">
            <span class="text-neutral-500 font-mono" data-i18n="flagshipMeta">Interactive TOC + In-Article FAQ</span>
            <a href="${prefix}/article.html" class="font-bold text-black dark:text-white hover:underline flex items-center gap-1">
              <span data-i18n="readDefinitiveGuide">Read Definitive Guide</span>
              <span>${arrow}</span>
            </a>
          </div>
        </article>

        <!-- Article: Magic Links vs OTP -->
        <article class="p-6 bg-white dark:bg-[#121212] border border-neutral-300 dark:border-neutral-800 rounded-xl shadow-sm hover:border-neutral-400 dark:hover:border-neutral-600 transition-all flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mb-2">
              <span class="font-bold text-black dark:text-white" data-i18n="catSecurity">Security Protocols</span>
              <span>•</span>
              <time datetime="2026-09-25">2026-09-25</time>
            </div>
            <h3 class="text-base font-bold text-black dark:text-white mb-2 leading-tight">
              <a href="${prefix}/articles/magic-links-vs-otp.html" class="hover:underline" data-i18n="magicTitle">
                Magic Links vs. OTP Verification Codes: Security Trade-offs & How Disposable Mail Handles Single-Use Tokens
              </a>
            </h3>
            <p class="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4" data-i18n="magicDesc">
              An architectural breakdown of why magic login links expire prematurely on legacy disposable mail services and how our clean edge engine preserves single-use tokens.
            </p>
          </div>
          <div class="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs">
            <span class="text-neutral-500 font-mono" data-i18n="readTime5">5 mins read</span>
            <a href="${prefix}/articles/magic-links-vs-otp.html" class="font-bold text-black dark:text-white hover:underline" data-i18n="readArticle">Read Article ${arrow}</a>
          </div>
        </article>

        <!-- Article: Spam Filters -->
        <article class="p-6 bg-white dark:bg-[#121212] border border-neutral-300 dark:border-neutral-800 rounded-xl shadow-sm hover:border-neutral-400 dark:hover:border-neutral-600 transition-all flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mb-2">
              <span class="font-bold text-black dark:text-white" data-i18n="catPrivacy">Privacy Research</span>
              <span>•</span>
              <time datetime="2026-09-25">2026-09-25</time>
            </div>
            <h3 class="text-base font-bold text-black dark:text-white mb-2 leading-tight">
              <a href="${prefix}/articles/temp-mail-vs-spam-filters.html" class="hover:underline" data-i18n="spamTitle">
                Disposable Email vs. Traditional Spam Filters: Why Standard Inboxes Can No Longer Protect Your Privacy
              </a>
            </h3>
            <p class="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4" data-i18n="spamDesc">
              Why heuristic spam filters in Gmail and Outlook cannot prevent data broker linkage and cross-site telemetry, and how ephemeral O(1) isolation solves it.
            </p>
          </div>
          <div class="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs">
            <span class="text-neutral-500 font-mono" data-i18n="readTime5">5 mins read</span>
            <a href="${prefix}/articles/temp-mail-vs-spam-filters.html" class="font-bold text-black dark:text-white hover:underline" data-i18n="readArticle">Read Article ${arrow}</a>
          </div>
        </article>

        <!-- Article: How to Receive OTP -->
        <article class="p-6 bg-white dark:bg-[#121212] border border-neutral-300 dark:border-neutral-800 rounded-xl shadow-sm hover:border-neutral-400 dark:hover:border-neutral-600 transition-all flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mb-2">
              <span data-i18n="catAccounts">Security & Accounts</span>
              <span>•</span>
              <time datetime="2026-09-21">2026-09-21</time>
            </div>
            <h3 class="text-base font-bold text-black dark:text-white mb-2 leading-tight">
              <a href="${prefix}/articles/how-to-receive-otp.html" class="hover:underline" data-i18n="otpTitle">
                How to Receive OTP Verification Codes and Copy Them Instantly
              </a>
            </h3>
            <p class="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4" data-i18n="otpDesc">
              Detailed guide on automatic numeric token extraction and one-click copying to breeze through signups securely.
            </p>
          </div>
          <div class="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs">
            <span class="text-neutral-500 font-mono" data-i18n="readTime4">4 mins read</span>
            <a href="${prefix}/articles/how-to-receive-otp.html" class="font-bold text-black dark:text-white hover:underline" data-i18n="readArticle">Read Article ${arrow}</a>
          </div>
        </article>

        <!-- Article: Live WebSocket Updates -->
        <article class="p-6 bg-white dark:bg-[#121212] border border-neutral-300 dark:border-neutral-800 rounded-xl shadow-sm hover:border-neutral-400 dark:hover:border-neutral-600 transition-all flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mb-2">
              <span data-i18n="catInfra">Infrastructure</span>
              <span>•</span>
              <time datetime="2026-09-21">2026-09-21</time>
            </div>
            <h3 class="text-base font-bold text-black dark:text-white mb-2 leading-tight">
              <a href="${prefix}/articles/how-inbox-updates-live.html" class="hover:underline" data-i18n="wsTitle">
                How Does Live Inbox Update in Real-Time via WebSocket?
              </a>
            </h3>
            <p class="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4" data-i18n="wsDesc">
              Explore WebSocket Hibernation and Cloudflare Durable Objects that push emails to your screen without manual refreshing.
            </p>
          </div>
          <div class="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs">
            <span class="text-neutral-500 font-mono" data-i18n="readTime3">3 mins read</span>
            <a href="${prefix}/articles/how-inbox-updates-live.html" class="font-bold text-black dark:text-white hover:underline" data-i18n="readArticle">Read Article ${arrow}</a>
          </div>
        </article>

        <!-- Article: Copy Address -->
        <article class="p-6 bg-white dark:bg-[#121212] border border-neutral-300 dark:border-neutral-800 rounded-xl shadow-sm hover:border-neutral-400 dark:hover:border-neutral-600 transition-all flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mb-2">
              <span data-i18n="catUsage">Usage & Practical</span>
              <span>•</span>
              <time datetime="2026-09-21">2026-09-21</time>
            </div>
            <h3 class="text-base font-bold text-black dark:text-white mb-2 leading-tight">
              <a href="${prefix}/articles/how-to-copy-address.html" class="hover:underline" data-i18n="copyTitle">
                How to Copy Temporary Email Address with One Click
              </a>
            </h3>
            <p class="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4" data-i18n="copyDesc">
              Proper clipboard copying techniques to avoid whitespace errors on third-party registration forms.
            </p>
          </div>
          <div class="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs">
            <span class="text-neutral-500 font-mono" data-i18n="readTime2">2 mins read</span>
            <a href="${prefix}/articles/how-to-copy-address.html" class="font-bold text-black dark:text-white hover:underline" data-i18n="readArticle">Read Article ${arrow}</a>
          </div>
        </article>

        <!-- Article: Generate Address -->
        <article class="p-6 bg-white dark:bg-[#121212] border border-neutral-300 dark:border-neutral-800 rounded-xl shadow-sm hover:border-neutral-400 dark:hover:border-neutral-600 transition-all flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mb-2">
              <span data-i18n="catAddress">Address Generation</span>
              <span>•</span>
              <time datetime="2026-09-21">2026-09-21</time>
            </div>
            <h3 class="text-base font-bold text-black dark:text-white mb-2 leading-tight">
              <a href="${prefix}/articles/how-to-generate-address.html" class="hover:underline" data-i18n="genTitle">
                How to Generate a New Temporary Email Address Safely
              </a>
            </h3>
            <p class="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4" data-i18n="genDesc">
              Learn how to rotate mailboxes and instantiate new ephemeral containers to segment registrations cleanly.
            </p>
          </div>
          <div class="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs">
            <span class="text-neutral-500 font-mono" data-i18n="readTime3">3 mins read</span>
            <a href="${prefix}/articles/how-to-generate-address.html" class="font-bold text-black dark:text-white hover:underline" data-i18n="readArticle">Read Article ${arrow}</a>
          </div>
        </article>

        <!-- Article: Open Links Safely -->
        <article class="p-6 bg-white dark:bg-[#121212] border border-neutral-300 dark:border-neutral-800 rounded-xl shadow-sm hover:border-neutral-400 dark:hover:border-neutral-600 transition-all flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mb-2">
              <span data-i18n="catProtection">Privacy Protection</span>
              <span>•</span>
              <time datetime="2026-09-21">2026-09-21</time>
            </div>
            <h3 class="text-base font-bold text-black dark:text-white mb-2 leading-tight">
              <a href="${prefix}/articles/how-to-open-verification-links.html" class="hover:underline" data-i18n="linkTitle">
                How to Open Verification Links Safely Without Revealing Your Identity
              </a>
            </h3>
            <p class="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4" data-i18n="linkDesc">
              Best practices for handling inbound verification URLs, inspecting redirect domains, and avoiding phishing traps.
            </p>
          </div>
          <div class="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs">
            <span class="text-neutral-500 font-mono" data-i18n="readTime4">4 mins read</span>
            <a href="${prefix}/articles/how-to-open-verification-links.html" class="font-bold text-black dark:text-white hover:underline" data-i18n="readArticle">Read Article ${arrow}</a>
          </div>
        </article>

        <!-- Article: What Happens When Expires -->
        <article class="p-6 bg-white dark:bg-[#121212] border border-neutral-300 dark:border-neutral-800 rounded-xl shadow-sm hover:border-neutral-400 dark:hover:border-neutral-600 transition-all flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mb-2">
              <span data-i18n="catLifecycle">Lifecycle & Security</span>
              <span>•</span>
              <time datetime="2026-09-21">2026-09-21</time>
            </div>
            <h3 class="text-base font-bold text-black dark:text-white mb-2 leading-tight">
              <a href="${prefix}/articles/what-happens-when-address-expires.html" class="hover:underline" data-i18n="expiryTitle">
                What Happens When a Temporary Email Address Expires?
              </a>
            </h3>
            <p class="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4" data-i18n="expiryDesc">
              What occurs to data after 20 minutes and how automated container shredding guarantees zero residual storage.
            </p>
          </div>
          <div class="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs">
            <span class="text-neutral-500 font-mono" data-i18n="readTime3">3 mins read</span>
            <a href="${prefix}/articles/what-happens-when-address-expires.html" class="font-bold text-black dark:text-white hover:underline" data-i18n="readArticle">Read Article ${arrow}</a>
          </div>
        </article>
      </div>

      <!-- Bottom Navigation Hub -->
      <div class="p-6 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-xl text-center">
        <h3 class="text-base font-bold text-black dark:text-white mb-2" data-i18n="blogCtaTitle">Ready to test the engine?</h3>
        <p class="text-xs text-neutral-600 dark:text-neutral-400 mb-4 max-w-md mx-auto" data-i18n="blogCtaDesc">
          Get an isolated disposable address and receive your OTP code or activation link live in seconds without signup.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-3">
          <a
            href="${prefix}/"
            class="px-5 py-2.5 bg-black text-white dark:bg-white dark:text-black rounded-lg text-xs font-bold hover:opacity-90 transition-opacity"
            data-i18n="goToInbox"
          >
            Go to Live Inbox ${arrow}
          </a>
          <a
            href="${prefix}/guide.html"
            class="px-5 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white rounded-lg text-xs font-bold hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            data-i18n="opUserGuide"
          >
            Operational User Guide
          </a>
        </div>
      </div>
    </main>

    ${getUnifiedFooter(lang)}
  </body>
</html>`;

  fs.writeFileSync(filePath, html, 'utf8');
}

updateBlogHTML('ar/blog.html', 'ar');
updateBlogHTML('en/blog.html', 'en');
updateBlogHTML('public/ar/blog.html', 'ar');
updateBlogHTML('public/en/blog.html', 'en');
console.log('✓ Successfully updated blog.html in ar, en, and public directories');

// 4. Update individual article pages with data-i18n attributes
interface ArticleMeta {
  file: string;
  prefixKey: string;
  datePublished: string;
  dateUpdated: string;
  readTimeKey: string;
}

const articleDefinitions: ArticleMeta[] = [
  { file: 'articles/how-to-generate-address.html', prefixKey: 'artGen', datePublished: '2026-09-20', dateUpdated: '2026-09-24', readTimeKey: 'readTime3' },
  { file: 'articles/how-to-copy-address.html', prefixKey: 'artCopy', datePublished: '2026-09-21', dateUpdated: '2026-09-24', readTimeKey: 'readTime2' },
  { file: 'articles/how-inbox-updates-live.html', prefixKey: 'artWs', datePublished: '2026-09-21', dateUpdated: '2026-09-24', readTimeKey: 'readTime3' },
  { file: 'articles/how-to-receive-otp.html', prefixKey: 'artOtp', datePublished: '2026-09-21', dateUpdated: '2026-09-24', readTimeKey: 'readTime4' },
  { file: 'articles/how-to-open-verification-links.html', prefixKey: 'artLink', datePublished: '2026-09-21', dateUpdated: '2026-09-24', readTimeKey: 'readTime4' },
  { file: 'articles/what-happens-when-address-expires.html', prefixKey: 'artExp', datePublished: '2026-09-21', dateUpdated: '2026-09-24', readTimeKey: 'readTime3' },
  { file: 'articles/magic-links-vs-otp.html', prefixKey: 'artMagic', datePublished: '2026-09-25', dateUpdated: '2026-09-25', readTimeKey: 'readTime5' },
  { file: 'articles/temp-mail-vs-spam-filters.html', prefixKey: 'artSpam', datePublished: '2026-09-25', dateUpdated: '2026-09-25', readTimeKey: 'readTime5' },
  { file: 'articles/universal-verification-coverage.html', prefixKey: 'artUvc', datePublished: '2026-09-25', dateUpdated: '2026-09-25', readTimeKey: 'readTime6' },
  { file: 'article.html', prefixKey: 'artDef', datePublished: '2026-09-25', dateUpdated: '2026-09-25', readTimeKey: 'readTime6' },
  { file: 'articles/index.html', prefixKey: 'artIdx', datePublished: '2026-09-25', dateUpdated: '2026-09-25', readTimeKey: 'readTime3' }
];

function updateSingleArticleHTML(relPath: string, meta: ArticleMeta, lang: 'ar' | 'en') {
  const isAr = lang === 'ar';
  const prefix = isAr ? '/ar' : '/en';
  const dir = isAr ? 'rtl' : 'ltr';
  const font = isAr ? "font-['Cairo',sans-serif]" : "font-['Inter',sans-serif]";
  const arrow = isAr ? '←' : '→';

  const fullPath = path.join(lang, relPath);
  const publicFullPath = path.join('public', lang, relPath);

  // Load existing file to preserve schemas, screenshots, and specific custom blocks
  if (!fs.existsSync(fullPath)) return;
  const existing = fs.readFileSync(fullPath, 'utf8');

  // Generate clean unified structure with data-i18n attributes
  const isStepArticle = meta.prefixKey === 'artGen' || meta.prefixKey === 'artCopy' || meta.prefixKey === 'artWs' || meta.prefixKey === 'artOtp' || meta.prefixKey === 'artLink' || meta.prefixKey === 'artExp';

  let articleBodyHtml = '';
  if (isStepArticle) {
    articleBodyHtml = `
      <section>
        <h2 class="text-lg font-bold text-black dark:text-white mb-3" data-i18n="artStepHeading">
          Step-by-Step Instructions
        </h2>
        <ol class="space-y-6">
          <li class="border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 bg-white dark:bg-[#141414]">
            <div class="font-bold text-sm text-black dark:text-white mb-2" data-i18n="${meta.prefixKey}Step1Title">
              Step 1: Check the Automatically Generated Address
            </div>
            <p class="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4" data-i18n="${meta.prefixKey}Step1Desc">
              Description for step 1
            </p>
            <div class="my-4 p-5 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-center flex flex-col items-center justify-center min-h-[100px]" role="figure">
              <span class="text-xs font-mono text-neutral-500 dark:text-neutral-400" data-i18n="${meta.prefixKey}Step1Caption">
                Screenshot demonstration for step 1
              </span>
            </div>
          </li>

          <li class="border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 bg-white dark:bg-[#141414]">
            <div class="font-bold text-sm text-black dark:text-white mb-2" data-i18n="${meta.prefixKey}Step2Title">
              Step 2: Take Action and Verify
            </div>
            <p class="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4" data-i18n="${meta.prefixKey}Step2Desc">
              Description for step 2
            </p>
            <div class="my-4 p-5 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-center flex flex-col items-center justify-center min-h-[100px]" role="figure">
              <span class="text-xs font-mono text-neutral-500 dark:text-neutral-400" data-i18n="${meta.prefixKey}Step2Caption">
                Screenshot demonstration for step 2
              </span>
            </div>
          </li>
        </ol>
      </section>
    `;
  } else if (meta.prefixKey === 'artIdx') {
    articleBodyHtml = `
      <section class="space-y-4">
        <h2 class="text-lg font-bold text-black dark:text-white mb-4" data-i18n="artIdxHeading">
          All Articles & Research Papers
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="${prefix}/article.html" class="p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-black dark:hover:border-white transition-colors block">
            <div class="font-bold text-sm mb-1" data-i18n="flagshipTitle">The Definitive Guide 2026</div>
            <p class="text-xs text-neutral-500" data-i18n="flagshipDesc">Definitive guide to temporary email and privacy.</p>
          </a>
          <a href="${prefix}/articles/universal-verification-coverage.html" class="p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-black dark:hover:border-white transition-colors block">
            <div class="font-bold text-sm mb-1" data-i18n="featuredPaperTitle">Universal Verification Coverage</div>
            <p class="text-xs text-neutral-500" data-i18n="featuredPaperDesc">How our engine decodes complex OTPs.</p>
          </a>
          <a href="${prefix}/articles/magic-links-vs-otp.html" class="p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-black dark:hover:border-white transition-colors block">
            <div class="font-bold text-sm mb-1" data-i18n="magicTitle">Magic Links vs. OTP</div>
            <p class="text-xs text-neutral-500" data-i18n="magicDesc">Security trade-offs of passwordless logins.</p>
          </a>
          <a href="${prefix}/articles/temp-mail-vs-spam-filters.html" class="p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-black dark:hover:border-white transition-colors block">
            <div class="font-bold text-sm mb-1" data-i18n="spamTitle">Disposable Email vs. Spam Filters</div>
            <p class="text-xs text-neutral-500" data-i18n="spamDesc">Why traditional spam folders fail.</p>
          </a>
          <a href="${prefix}/articles/how-to-generate-address.html" class="p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-black dark:hover:border-white transition-colors block">
            <div class="font-bold text-sm mb-1" data-i18n="artGenTitle">Generate & Change Address</div>
            <p class="text-xs text-neutral-500" data-i18n="artGenIntro">Create new isolated inboxes in seconds.</p>
          </a>
          <a href="${prefix}/articles/how-to-receive-otp.html" class="p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-black dark:hover:border-white transition-colors block">
            <div class="font-bold text-sm mb-1" data-i18n="artOtpTitle">Receive OTP Codes</div>
            <p class="text-xs text-neutral-500" data-i18n="artOtpIntro">Instant regex code extraction.</p>
          </a>
        </div>
      </section>
    `;
  } else {
    // Essays / Research Papers
    articleBodyHtml = `
      <div class="space-y-6 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
        <p data-i18n="${meta.prefixKey}P1">
          Detailed technical breakdown of email architecture, cryptographic isolation, and verification protocol behaviors.
        </p>
        <p data-i18n="${meta.prefixKey}P2">
          Why ephemeral O(1) containerization eliminates tracking linkage and delivers tokens reliably.
        </p>
      </div>
    `;
  }

  const articleHtml = `<!doctype html>
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
    <title>${isAr ? 'مقالات البريد المؤقت — ' : 'Temp Mail Article — '}${relPath}</title>
    <meta name="description" content="Technical guide and article covering disposable temporary email and verification workflows." />
    <link rel="canonical" href="https://freetemp.email${prefix}/${relPath}" />

    <!-- Multilingual Alternates -->
    <link rel="alternate" hreflang="ar" href="https://freetemp.email/ar/${relPath}" />
    <link rel="alternate" hreflang="en" href="https://freetemp.email/en/${relPath}" />
    <link rel="alternate" hreflang="x-default" href="https://freetemp.email/en/${relPath}" />

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
            <a href="${prefix}/blog.html" data-i18n="blog" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Blog</a>
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

    <main class="flex-1 max-w-3xl w-full mx-auto px-4 py-10 sm:py-12">
      <!-- Breadcrumbs -->
      <nav class="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-6 font-mono">
        <a href="${prefix}/" class="hover:underline" data-i18n="artNavHome">Home</a>
        <span>/</span>
        <a href="${prefix}/blog.html" class="hover:underline" data-i18n="artNavBlog">Blog</a>
        <span>/</span>
        <span class="text-black dark:text-white font-semibold" data-i18n="${meta.prefixKey}Nav">Article</span>
      </nav>

      <h1 class="text-2xl sm:text-3xl font-extrabold text-black dark:text-white mb-3 leading-tight" data-i18n="${meta.prefixKey}Title">
        Article Title
      </h1>

      <div class="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 font-mono border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-6">
        <span><span data-i18n="artPublished">Published:</span> <time datetime="${meta.datePublished}">${meta.datePublished}</time></span>
        <span>•</span>
        <span data-i18n="${meta.readTimeKey}">3 mins read</span>
      </div>

      <!-- Opening paragraph -->
      <p class="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 mb-6" data-i18n="${meta.prefixKey}Intro">
        Article introductory overview.
      </p>

      <div class="space-y-8">
        ${articleBodyHtml}

        <!-- Concluding CTA box -->
        <div class="p-6 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-2xl text-center">
          <h3 class="text-base font-bold text-black dark:text-white mb-2" data-i18n="${meta.prefixKey}CtaTitle">
            Ready to test our service?
          </h3>
          <p class="text-xs text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed" data-i18n="${meta.prefixKey}CtaDesc">
            Eliminate spam worries forever. Start using our temporary email tool now and receive incoming messages securely.
          </p>
          <a
            href="${prefix}/"
            class="min-h-[44px] inline-flex items-center justify-center px-5 py-2.5 bg-black text-white dark:bg-white dark:text-black text-xs font-bold rounded-lg hover:opacity-90 transition-opacity"
            data-i18n="${meta.prefixKey}CtaBtn"
          >
            Launch Temp Mail Tool Now ${arrow}
          </a>
        </div>
      </div>
    </main>

    ${getUnifiedFooter(lang)}
  </body>
</html>`;

  fs.writeFileSync(fullPath, articleHtml, 'utf8');
  fs.writeFileSync(publicFullPath, articleHtml, 'utf8');
}

articleDefinitions.forEach(m => {
  updateSingleArticleHTML(m.file, m, 'ar');
  updateSingleArticleHTML(m.file, m, 'en');
});

console.log('✓ Successfully updated all article pages with data-i18n across ar, en, and public directories');
