import fs from 'node:fs';
import path from 'node:path';
import { ARTICLES_CATALOG, CatalogArticle } from './data-articles-catalog.ts';

// 22 Supported Languages
const LANGUAGES = [
  { code: 'ar', name: 'Arabic', native: 'العربية', dir: 'rtl' },
  { code: 'en', name: 'English', native: 'English', dir: 'ltr' },
  { code: 'es', name: 'Spanish', native: 'Español', dir: 'ltr' },
  { code: 'fr', name: 'French', native: 'Français', dir: 'ltr' },
  { code: 'de', name: 'German', native: 'Deutsch', dir: 'ltr' },
  { code: 'pt', name: 'Portuguese', native: 'Português', dir: 'ltr' },
  { code: 'it', name: 'Italian', native: 'Italiano', dir: 'ltr' },
  { code: 'ru', name: 'Russian', native: 'Русский', dir: 'ltr' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe', dir: 'ltr' },
  { code: 'zh', name: 'Chinese', native: '简体中文', dir: 'ltr' },
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
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getUnifiedFooter(lang: 'ar' | 'en') {
  const isAr = lang === 'ar';
  const prefix = isAr ? '/ar' : '/en';
  return `<!-- Master 4-Column Unified Footer with full data-i18n -->
    <footer class="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0A0A0A] py-12 transition-colors mt-auto text-xs">
      <div class="max-w-5xl mx-auto px-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10 ${isAr ? 'text-right' : 'text-left'}">
          <!-- Column 1: Brand & Status -->
          <div>
            <div class="text-base font-bold text-black dark:text-white mb-2 flex items-center gap-2">
              <span class="w-5 h-5 rounded bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-[10px] font-mono font-extrabold">T</span>
              <span data-i18n="brand">Temp Mail</span>
            </div>
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
              ${isAr ? 'التنقل الرئيسي' : 'Navigation'}
            </div>
            <ul class="space-y-2">
              <li><a href="${prefix}/" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors" data-i18n="home">${isAr ? 'الرئيسية' : 'Home'}</a></li>
              <li><a href="${prefix}/blog.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors" data-i18n="blog">${isAr ? 'المدونة' : 'Blog'}</a></li>
              <li><a href="${prefix}/guide.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors" data-i18n="guide">${isAr ? 'دليل الاستخدام' : 'Guide'}</a></li>
              <li><a href="${prefix}/faq.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors" data-i18n="faq">${isAr ? 'الأسئلة الشائعة' : 'FAQ'}</a></li>
              <li><a href="${prefix}/articles/index.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors" data-i18n="footerArticles">${isAr ? 'دليل المقالات الـ 22' : 'All 22 Guides'}</a></li>
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
                <span class="text-emerald-500 font-bold">✓</span>
                <span data-i18n="footerSec1">${isAr ? 'إتلاف تلقائي بعد 20 دقيقة' : 'Auto-purge after 20 minutes'}</span>
              </li>
              <li class="flex items-center gap-1.5">
                <span class="text-emerald-500 font-bold">✓</span>
                <span data-i18n="footerSec2">${isAr ? 'صفر سجلات تتبع' : 'Zero tracking logs recorded'}</span>
              </li>
              <li class="flex items-center gap-1.5">
                <span class="text-emerald-500 font-bold">✓</span>
                <span data-i18n="footerSec3">${isAr ? 'عزل تام للذاكرة العشوائية' : 'RAM-only volatile isolation'}</span>
              </li>
              <li class="flex items-center gap-1.5">
                <span class="text-emerald-500 font-bold">✓</span>
                <span data-i18n="footerSec4">${isAr ? 'تشفير كامل للاتصال TLS' : 'Full TLS transport encryption'}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="pt-8 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>© 2026 Temp Mail. All rights reserved. Built for technical privacy & developer workflows.</p>
          <div class="flex items-center gap-4">
            <a href="${prefix}/articles/index.html" class="hover:underline text-neutral-600 dark:text-neutral-400">${isAr ? 'فهرس المقالات الـ 22' : '22-Article Directory'}</a>
            <span>•</span>
            <a href="${prefix}/privacy.html" class="hover:underline text-neutral-600 dark:text-neutral-400">GDPR / CCPA</a>
          </div>
        </div>
      </div>
    </footer>`;
}

// Generate the rich, modern, elevated HTML for an individual article
export function renderRichArticlePage(article: CatalogArticle, lang: 'ar' | 'en'): string {
  const isAr = lang === 'ar';
  const prefix = isAr ? '/ar' : '/en';
  const title = article.title[lang];
  const metaDesc = article.metaDesc[lang];
  const category = article.category[lang];
  const badge = article.badge[lang];
  const lead = article.lead[lang];
  const takeaways = article.takeaways[lang];
  const canonicalUrl = `https://freetemp.email${prefix}/articles/${article.slug}.html`;

  // Build hreflangs for all 22 languages
  const hreflangTags = LANGUAGES.map(l => {
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
        'dateModified': '2026-09-25T11:30:00+00:00',
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
            'name': isAr ? 'المقالات' : 'Articles',
            'item': `https://freetemp.email${prefix}/articles/index.html`
          },
          {
            '@type': 'ListItem',
            'position': 4,
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
    .map(s => ARTICLES_CATALOG.find(a => a.slug === s))
    .filter(Boolean) as CatalogArticle[];

  return `<!doctype html>
<html lang="${lang}" dir="${isAr ? 'rtl' : 'ltr'}" class="scroll-smooth">
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
    <title>${escapeHtml(title)} — Temp Mail</title>
    <meta name="description" content="${escapeHtml(metaDesc)}" />
    <meta name="author" content="Temp Mail Security Engineering Team" />
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    <link rel="canonical" href="${canonicalUrl}" />

    <!-- Multilingual Alternates for all 22 languages -->
    ${hreflangTags}
    <link rel="alternate" hreflang="x-default" href="https://freetemp.email/en/articles/${article.slug}.html" />

    <!-- Open Graph Tags -->
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Temp Mail" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(metaDesc)}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:image" content="https://freetemp.email/og-image.png" />
    <meta property="og:locale" content="${isAr ? 'ar_AR' : 'en_US'}" />

    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(metaDesc)}" />
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

    <!-- Schema.org JSON-LD Structured Data (TechArticle, Breadcrumbs, FAQPage) -->
    <script type="application/ld+json">
${JSON.stringify(schemaJsonLd, null, 2)}
    </script>
  </head>
  <body class="min-h-screen bg-neutral-50 dark:bg-[#0A0A0A] text-neutral-900 dark:text-neutral-100 flex flex-col transition-colors duration-200 ${isAr ? "font-['Cairo',sans-serif]" : "font-sans"} antialiased selection:bg-blue-600 selection:text-white">

    <!-- Dynamic Reading Progress Bar at the Very Top -->
    <div id="reading-progress" class="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 z-50 transform origin-left transition-all duration-75" style="width: 0%"></div>

    <!-- Master Header -->
    <header class="border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-[#0D0D0D]/95 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div class="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div class="flex items-center gap-6">
          <a href="${prefix}/" class="text-xl font-bold tracking-tight text-black dark:text-white hover:opacity-80 transition-opacity flex items-center gap-2">
            <span class="w-6 h-6 rounded bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-xs font-mono font-extrabold shadow-sm">T</span>
            <span data-i18n="brand">Temp Mail</span>
          </a>

          <nav class="hidden md:flex items-center gap-5 text-xs font-medium">
            <a href="${prefix}/" data-i18n="home" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${isAr ? 'الرئيسية' : 'Home'}</a>
            <a href="${prefix}/blog.html" data-i18n="blog" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${isAr ? 'المدونة' : 'Blog'}</a>
            <a href="${prefix}/articles/index.html" class="text-blue-600 dark:text-blue-400 font-bold hover:underline transition-colors">${isAr ? 'المقالات الـ 22' : 'All 22 Guides'}</a>
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
            class="theme-toggle-btn min-h-[38px] min-w-[38px] p-2 bg-white hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 hover:border-black dark:border-neutral-800 dark:hover:border-neutral-600 rounded-lg text-black dark:text-white transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-sm"
            aria-label="Toggle theme"
          >
            <svg class="theme-toggle-icon w-4 h-4 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Container -->
    <main class="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12">
      <!-- Breadcrumbs -->
      <nav class="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-6 font-mono overflow-x-auto whitespace-nowrap pb-1">
        <a href="${prefix}/" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors" data-i18n="artNavHome">${isAr ? 'الرئيسية' : 'Home'}</a>
        <span>/</span>
        <a href="${prefix}/blog.html" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors" data-i18n="artNavBlog">${isAr ? 'المدونة' : 'Blog'}</a>
        <span>/</span>
        <a href="${prefix}/articles/index.html" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">${isAr ? 'المقالات' : 'Articles'}</a>
        <span>/</span>
        <span class="text-neutral-800 dark:text-neutral-200 font-semibold truncate max-w-[200px] sm:max-w-xs">${escapeHtml(title)}</span>
      </nav>

      <!-- Article Header & Hero Section -->
      <header class="mb-10 pb-8 border-b border-neutral-200 dark:border-neutral-800">
        <div class="flex flex-wrap items-center gap-2 mb-4">
          <!-- Category Badge -->
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span data-i18n="artCat_${article.slug}">${escapeHtml(category)}</span>
          </span>

          <!-- Tag Badge -->
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
            <span data-i18n="artBadge_${article.slug}">${escapeHtml(badge)}</span>
          </span>

          <!-- Reading Time -->
          <span class="inline-flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-mono ms-auto">
            <svg class="w-3.5 h-3.5 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span>${article.readTimeMin} ${isAr ? 'دقائق قراءة' : 'min read'}</span>
          </span>
        </div>

        <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-[1.25] mb-5" data-i18n="artTitle_${article.slug}">
          ${escapeHtml(title)}
        </h1>

        <!-- Author, Date, and Share Bar -->
        <div class="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 text-xs">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
              TM
            </div>
            <div>
              <div class="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                <span>Temp Mail Security Team</span>
                <svg class="w-3.5 h-3.5 text-blue-500 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              </div>
              <div class="text-neutral-500 dark:text-neutral-400 font-mono text-[11px] flex items-center gap-2">
                <span>Updated Sep 25, 2026</span>
                <span>•</span>
                <span>Peer-Reviewed Guide</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              id="copy-article-url-btn"
              class="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            >
              <svg class="w-3.5 h-3.5 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              <span id="copy-url-label">${isAr ? 'نسخ الرابط' : 'Share Guide'}</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Executive Summary / Key Takeaways Box (Modern Glass Card) -->
      <section class="mb-10 p-6 rounded-2xl bg-gradient-to-br from-blue-50/60 to-indigo-50/40 dark:from-blue-950/20 dark:to-indigo-950/10 border border-blue-200/80 dark:border-blue-900/40 shadow-sm relative overflow-hidden">
        <div class="flex items-center gap-2.5 mb-3 text-blue-700 dark:text-blue-300 font-bold text-sm tracking-wide">
          <svg class="w-5 h-5 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
          <span data-i18n="featKeyHighlightsTitle">${isAr ? 'أبرز النقاط الفنية والمعمارية في هذا الدليل' : 'Key Architecture Takeaways & Highlights'}</span>
        </div>
        <p class="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4 italic" data-i18n="artLead_${article.slug}">
          ${escapeHtml(lead)}
        </p>
        <ul class="space-y-2.5 text-xs sm:text-sm text-neutral-800 dark:text-neutral-200">
          ${takeaways.map((t, idx) => `
            <li class="flex items-start gap-2.5">
              <span class="w-5 h-5 rounded-full bg-blue-600/10 dark:bg-blue-400/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">✓</span>
              <span data-i18n="artTakeaway_${article.slug}_${idx}">${escapeHtml(t)}</span>
            </li>
          `).join('')}
        </ul>
      </section>

      <!-- Table of Contents (TOC) -->
      <nav class="mb-10 p-5 rounded-xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div class="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3 flex items-center gap-2 font-mono">
          <svg class="w-4 h-4 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
          <span>${isAr ? 'فهرس محتويات الدليل' : 'Table of Contents'}</span>
        </div>
        <ul class="space-y-2 text-xs sm:text-sm font-medium">
          ${article.sections.map((sec, i) => `
            <li>
              <a href="#${sec.id}" class="text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2">
                <span class="font-mono text-neutral-400 text-xs">0${i + 1}.</span>
                <span>${escapeHtml(sec.title[lang])}</span>
              </a>
            </li>
          `).join('')}
          ${article.comparisonTable ? `
            <li>
              <a href="#comparison" class="text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2">
                <span class="font-mono text-neutral-400 text-xs">0${article.sections.length + 1}.</span>
                <span>${escapeHtml(article.comparisonTable.title[lang])}</span>
              </a>
            </li>
          ` : ''}
          <li>
            <a href="#faq" class="text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2">
              <span class="font-mono text-neutral-400 text-xs">0${article.sections.length + (article.comparisonTable ? 2 : 1)}.</span>
              <span>${isAr ? 'الأسئلة الشائعة والأمان' : 'Frequently Asked Questions'}</span>
            </a>
          </li>
        </ul>
      </nav>

      <!-- Deep-Dive Article Sections -->
      <article class="prose prose-neutral dark:prose-invert max-w-none space-y-12 leading-relaxed text-sm sm:text-base">
        ${article.sections.map((sec) => `
          <section id="${sec.id}" class="scroll-mt-24">
            <h2 class="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
              ${escapeHtml(sec.title[lang])}
            </h2>

            <div class="space-y-4 text-neutral-700 dark:text-neutral-300 leading-relaxed">
              ${sec.content[lang]}
            </div>

            ${sec.callout ? `
              <div class="mt-6 p-4 rounded-xl border ${
                sec.callout.type === 'warning'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
                  : sec.callout.type === 'tip'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                  : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-900 dark:text-indigo-200'
              }">
                <div class="font-bold text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono">
                  ${sec.callout.type === 'warning' ? '⚠️' : sec.callout.type === 'tip' ? '💡' : '🔍'}
                  <span>${escapeHtml(sec.callout.title[lang])}</span>
                </div>
                <p class="text-xs sm:text-sm leading-relaxed">${escapeHtml(sec.callout.text[lang])}</p>
              </div>
            ` : ''}

            ${sec.codeSnippet ? `
              <div class="mt-6 rounded-xl overflow-hidden border border-neutral-800 bg-[#0d1117] shadow-xl text-left" dir="ltr">
                <div class="bg-[#161b22] px-4 py-2 flex items-center justify-between border-b border-neutral-800">
                  <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full bg-[#ff5f56]"></span>
                    <span class="w-3 h-3 rounded-full bg-[#ffbd2e]"></span>
                    <span class="w-3 h-3 rounded-full bg-[#27c93f]"></span>
                    <span class="text-xs font-mono text-neutral-400 ms-2">${escapeHtml(sec.codeSnippet.filename)}</span>
                  </div>
                  <span class="text-[11px] font-mono uppercase text-neutral-500">${escapeHtml(sec.codeSnippet.lang)}</span>
                </div>
                <pre class="p-4 text-xs font-mono text-neutral-200 overflow-x-auto leading-relaxed"><code>${escapeHtml(sec.codeSnippet.code)}</code></pre>
              </div>
            ` : ''}
          </section>
        `).join('')}

        <!-- Feature Comparison Table (if present) -->
        ${article.comparisonTable ? `
          <section id="comparison" class="scroll-mt-24 pt-6">
            <h2 class="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
              ${escapeHtml(article.comparisonTable.title[lang])}
            </h2>
            <div class="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121212] shadow-sm">
              <table class="w-full text-xs sm:text-sm text-left ${isAr ? 'text-right' : 'text-left'}">
                <thead class="bg-neutral-100 dark:bg-neutral-800/60 text-neutral-900 dark:text-white font-bold border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th class="p-3 sm:p-4">${escapeHtml(article.comparisonTable.headers[lang][0])}</th>
                    <th class="p-3 sm:p-4 text-neutral-500">${escapeHtml(article.comparisonTable.headers[lang][1])}</th>
                    <th class="p-3 sm:p-4 text-blue-600 dark:text-blue-400">${escapeHtml(article.comparisonTable.headers[lang][2])}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-neutral-100 dark:divide-neutral-800">
                  ${article.comparisonTable.rows[lang].map((row: [string, string, string], idx: number) => `
                    <tr class="${idx % 2 === 1 ? 'bg-neutral-50/50 dark:bg-neutral-900/30' : ''}">
                      <td class="p-3 sm:p-4 font-semibold text-neutral-900 dark:text-white">${escapeHtml(row[0])}</td>
                      <td class="p-3 sm:p-4 text-neutral-500 dark:text-neutral-400">${escapeHtml(row[1])}</td>
                      <td class="p-3 sm:p-4 font-semibold text-emerald-600 dark:text-emerald-400">${escapeHtml(row[2])}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </section>
        ` : ''}

        <!-- Interactive In-Article FAQ Accordion Section -->
        <section id="faq" class="scroll-mt-24 pt-6">
          <h2 class="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-6 pb-2 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <span>${isAr ? 'الأسئلة الشائعة والأمان' : 'Frequently Asked Questions'}</span>
            <span class="text-xs font-mono font-normal text-neutral-500">${article.faqs.length} questions</span>
          </h2>
          <div class="space-y-3">
            ${article.faqs.map((faq, i) => `
              <div class="faq-item rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121212] overflow-hidden transition-all shadow-sm">
                <button
                  type="button"
                  class="faq-toggle w-full p-4 text-left ${isAr ? 'text-right' : 'text-left'} font-semibold text-sm sm:text-base text-neutral-900 dark:text-white flex items-center justify-between gap-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                  aria-expanded="${i === 0 ? 'true' : 'false'}"
                >
                  <span class="flex items-center gap-2">
                    <span class="w-5 h-5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-mono font-bold">?</span>
                    <span>${escapeHtml(faq.q[lang])}</span>
                  </span>
                  <svg class="faq-chevron w-4 h-4 stroke-current fill-none stroke-[2] text-neutral-400 transition-transform duration-200 ${i === 0 ? 'rotate-180' : ''}" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>
                <div class="faq-content p-4 pt-0 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-neutral-800/60 ${i === 0 ? '' : 'hidden'}">
                  <p class="mt-3">${escapeHtml(faq.a[lang])}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      </article>

      <!-- High-Impact Live CTA Banner -->
      <section class="mt-14 p-8 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-blue-950 text-white border border-neutral-800 shadow-2xl relative overflow-hidden">
        <div class="absolute -top-12 -right-12 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div class="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div class="inline-flex items-center gap-2 font-mono text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-0.5 mb-3">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Cloudflare Edge Ready</span>
            </div>
            <h3 class="text-xl sm:text-2xl font-bold mb-2">
              ${isAr ? 'جاهز لتجربة بريد مؤقت معزول وآمن؟' : 'Ready to Experience Isolated Ephemeral Mail?'}
            </h3>
            <p class="text-xs sm:text-sm text-neutral-300 max-w-xl leading-relaxed">
              ${isAr ? 'احصل على عنوان بريد مشفر وفوري لاستقبال أكواد التحقق وروابط التفعيل في ثوانٍ وبدون أي تسجيل.' : 'Generate your high-entropy disposable inbox in 1 click and receive instant OTP passcodes without signup.'}
            </p>
          </div>
          <a
            href="${prefix}/"
            class="px-6 py-3 rounded-xl bg-white text-black font-bold text-xs sm:text-sm hover:bg-neutral-100 transition-all shadow-lg active:scale-95 shrink-0"
          >
            ${isAr ? 'توليد بريد مؤقت الآن ←' : 'Launch Free Mailbox →'}
          </a>
        </div>
      </section>

      <!-- Related Guides & Next Reads (Contextual Cross-Linking) -->
      ${relatedArticles.length > 0 ? `
        <section class="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-500 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <span>${isAr ? 'أدلة هندسية مقترحة وذات صلة' : 'Recommended Next Reads in Series'}</span>
            </h3>
            <a href="${prefix}/articles/index.html" class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              ${isAr ? 'عرض كافة المقالات الـ 22 ←' : 'View all 22 guides →'}
            </a>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            ${relatedArticles.slice(0, 3).map(rel => `
              <a
                href="${prefix}/articles/${rel.slug}.html"
                class="group p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121212] hover:border-blue-500 dark:hover:border-blue-500 transition-all flex flex-col justify-between shadow-sm hover:shadow-md"
              >
                <div>
                  <div class="flex items-center justify-between text-[11px] font-mono text-neutral-500 mb-2">
                    <span class="text-blue-600 dark:text-blue-400 font-semibold">${escapeHtml(rel.category[lang])}</span>
                    <span>${rel.readTimeMin} min</span>
                  </div>
                  <h4 class="font-bold text-sm text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
                    ${escapeHtml(rel.title[lang])}
                  </h4>
                  <p class="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                    ${escapeHtml(rel.metaDesc[lang])}
                  </p>
                </div>
                <div class="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <span>${isAr ? 'قراءة الدليل' : 'Read Guide'}</span>
                  <span class="transform transition-transform group-hover:translate-x-1 ${isAr ? 'group-hover:-translate-x-1' : ''}">→</span>
                </div>
              </a>
            `).join('')}
          </div>
        </section>
      ` : ''}
    </main>

    ${getUnifiedFooter(lang)}

    <!-- Dynamic Reading Progress & FAQ Accordion Script -->
    <script>
      document.addEventListener('DOMContentLoaded', function () {
        // 1. Reading Progress Bar
        var progressEl = document.getElementById('reading-progress');
        if (progressEl) {
          window.addEventListener('scroll', function () {
            var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            if (docHeight > 0) {
              var scrollPercent = (window.scrollY / docHeight) * 100;
              progressEl.style.width = Math.min(100, Math.max(0, scrollPercent)) + '%';
            }
          });
        }

        // 2. Interactive FAQ Accordions
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

        // 3. Copy Share Link
        var copyBtn = document.getElementById('copy-article-url-btn');
        var copyLabel = document.getElementById('copy-url-label');
        if (copyBtn && copyLabel) {
          copyBtn.addEventListener('click', function () {
            var url = window.location.href;
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(url).then(function () {
                var prev = copyLabel.textContent;
                copyLabel.textContent = '${isAr ? 'تم النسخ بنجاح! ✓' : 'Copied! ✓'}';
                setTimeout(function () { copyLabel.textContent = prev; }, 2000);
              });
            }
          });
        }
      });
    </script>
  </body>
</html>`;
}

// Generate the root redirect router for /articles/<slug>.html
function renderRootArticleRouter(slug: string, title: string): string {
  return `<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)} | بريد مؤقت — Temp Mail</title>
    <link rel="canonical" href="https://freetemp.email/ar/articles/${slug}.html" />
    <link rel="alternate" hreflang="ar" href="https://freetemp.email/ar/articles/${slug}.html" />
    <link rel="alternate" hreflang="en" href="https://freetemp.email/en/articles/${slug}.html" />
    <link rel="alternate" hreflang="x-default" href="https://freetemp.email/en/articles/${slug}.html" />
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
            window.location.replace('/en/articles/${slug}.html' + window.location.search + window.location.hash);
          } else {
            window.location.replace('/ar/articles/${slug}.html' + window.location.search + window.location.hash);
          }
        } catch (e) {
          window.location.replace('/ar/articles/${slug}.html');
        }
      })();
    </script>
  </head>
  <body class="bg-white text-black dark:bg-[#0D0D0D] dark:text-[#F5F5F5] flex items-center justify-center min-h-screen font-sans">
    <div class="text-center p-6">
      <div class="w-8 h-8 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p class="text-xs text-neutral-500 font-mono">Redirecting to localized article...</p>
    </div>
  </body>
</html>`;
}

// Generate the master /articles/index.html directory page for all 22 articles
export function renderArticlesIndexPage(lang: 'ar' | 'en'): string {
  const isAr = lang === 'ar';
  const prefix = isAr ? '/ar' : '/en';
  const canonicalUrl = `https://freetemp.email${prefix}/articles/index.html`;

  const hreflangTags = LANGUAGES.map(l => {
    const lPrefix = l.dir === 'rtl' ? '/ar' : '/en';
    return `<link rel="alternate" hreflang="${l.code}" href="https://freetemp.email${lPrefix}/articles/index.html" />`;
  }).join('\n    ');

  // Categories list
  const categories = Array.from(new Set(ARTICLES_CATALOG.map(a => a.category[lang])));

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
    <title>${isAr ? 'دليل ومكتبة المقالات الهندسية (22 دليلاً تقنياً) — بريد مؤقت' : 'Engineering Guides & Technical Library (22 In-Depth Guides) — Temp Mail'}</title>
    <meta name="description" content="${isAr ? 'المكتبة الهندسية الشاملة للبريد المؤقت: 22 مقالاً ودليلاً تفصيلياً يغطي معايير الأمان، فك شفرات OTP، البث الحي عبر WebSocket، أتمتة الاختبارات، والخصوصية الرقمية.' : 'Complete technical library covering disposable temporary email: 22 deep-dive guides spanning security architecture, OTP decoding, real-time WebSockets, automated QA, and privacy laws.'}" />
    <link rel="canonical" href="${canonicalUrl}" />

    <!-- Multilingual Alternates -->
    ${hreflangTags}
    <link rel="alternate" hreflang="x-default" href="https://freetemp.email/en/articles/index.html" />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Temp Mail" />
    <meta property="og:title" content="${isAr ? 'دليل ومكتبة المقالات الهندسية (22 دليلاً تقنياً) — بريد مؤقت' : 'Engineering Guides & Technical Library (22 Guides) — Temp Mail'}" />
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
  <body class="min-h-screen bg-neutral-50 dark:bg-[#0A0A0A] text-neutral-900 dark:text-neutral-100 flex flex-col transition-colors duration-200 ${isAr ? "font-['Cairo',sans-serif]" : "font-sans"} antialiased">
    <!-- Master Header -->
    <header class="border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-[#0D0D0D]/95 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div class="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div class="flex items-center gap-6">
          <a href="${prefix}/" class="text-xl font-bold tracking-tight text-black dark:text-white hover:opacity-80 transition-opacity flex items-center gap-2">
            <span class="w-6 h-6 rounded bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-xs font-mono font-extrabold shadow-sm">T</span>
            <span data-i18n="brand">Temp Mail</span>
          </a>

          <nav class="hidden md:flex items-center gap-5 text-xs font-medium">
            <a href="${prefix}/" data-i18n="home" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${isAr ? 'الرئيسية' : 'Home'}</a>
            <a href="${prefix}/blog.html" data-i18n="blog" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${isAr ? 'المدونة' : 'Blog'}</a>
            <a href="${prefix}/articles/index.html" class="text-blue-600 dark:text-blue-400 font-bold hover:underline transition-colors">${isAr ? 'المقالات الـ 22' : 'All 22 Guides'}</a>
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
            class="theme-toggle-btn min-h-[38px] min-w-[38px] p-2 bg-white hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 hover:border-black dark:border-neutral-800 dark:hover:border-neutral-600 rounded-lg text-black dark:text-white transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-sm"
            aria-label="Toggle theme"
          >
            <svg class="theme-toggle-icon w-4 h-4 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          </button>
        </div>
      </div>
    </header>

    <main class="flex-1 max-w-5xl w-full mx-auto px-4 py-10 sm:py-14">
      <!-- Hero Header -->
      <div class="mb-10 text-center max-w-2xl mx-auto">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 mb-3">
          <span>📚 22 Comprehensive Guides</span>
        </div>
        <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-4">
          ${isAr ? 'المكتبة الهندسية والأدلة الشاملة' : 'Technical Guides & Architecture Library'}
        </h1>
        <p class="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
          ${isAr ? 'استكشف أدلتنا التقنية المعمقة (22 دليلاً متخصصاً) التي تشرح بروتوكولات البريد، فك شفرات OTP، البث الحي عبر خوادم الحافة، والخصوصية الرقمية.' : 'Explore our 22 peer-reviewed engineering guides breaking down email protocols, OTP regex parsing, volatile edge storage, and consumer privacy rights.'}
        </p>
      </div>

      <!-- Live Search & Category Filter Controls -->
      <div class="mb-10 space-y-4">
        <div class="relative max-w-md mx-auto">
          <input
            id="article-search-input"
            type="text"
            placeholder="${isAr ? 'ابحث في الـ 22 مقالاً بالكلمات المفتاحية...' : 'Search across all 22 guides...'}"
            class="w-full h-11 px-4 ps-10 rounded-xl bg-white dark:bg-[#121212] border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-blue-500 transition-colors shadow-sm"
          />
          <svg class="w-4 h-4 absolute top-3.5 ${isAr ? 'right-3.5' : 'left-3.5'} text-neutral-400 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>

        <!-- Category Pills -->
        <div class="flex flex-wrap items-center justify-center gap-2 pt-2" id="category-pills">
          <button
            type="button"
            data-cat="all"
            class="cat-pill px-3 py-1.5 rounded-lg text-xs font-semibold bg-black text-white dark:bg-white dark:text-black transition-all cursor-pointer shadow-sm"
          >
            ${isAr ? 'جميع المقالات (22)' : 'All Guides (22)'}
          </button>
          ${categories.map(c => `
            <button
              type="button"
              data-cat="${escapeHtml(c)}"
              class="cat-pill px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-black dark:hover:border-white transition-all cursor-pointer shadow-sm"
            >
              ${escapeHtml(c)}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Articles Grid (All 22 Articles) -->
      <div id="articles-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${ARTICLES_CATALOG.map((art, index) => `
          <article
            class="article-card group p-6 rounded-2xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all flex flex-col justify-between shadow-sm hover:shadow-xl relative overflow-hidden"
            data-title="${escapeHtml(art.title[lang].toLowerCase())}"
            data-desc="${escapeHtml(art.metaDesc[lang].toLowerCase())}"
            data-category="${escapeHtml(art.category[lang])}"
          >
            <div>
              <div class="flex items-center justify-between gap-2 mb-3">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  ${escapeHtml(art.category[lang])}
                </span>
                <span class="text-[11px] font-mono text-neutral-500">${art.readTimeMin} min read</span>
              </div>

              <h2 class="text-base sm:text-lg font-bold text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2.5">
                <a href="${prefix}/articles/${art.slug}.html" class="before:absolute before:inset-0">
                  ${escapeHtml(art.title[lang])}
                </a>
              </h2>

              <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed mb-4">
                ${escapeHtml(art.metaDesc[lang])}
              </p>
            </div>

            <div class="pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
              <span class="font-mono text-neutral-400">#${index + 1 < 10 ? '0' + (index + 1) : index + 1}</span>
              <span class="flex items-center gap-1">
                <span>${isAr ? 'قراءة الدليل الكامل' : 'Read Full Guide'}</span>
                <span class="transform transition-transform group-hover:translate-x-1 ${isAr ? 'group-hover:-translate-x-1' : ''}">→</span>
              </span>
            </div>
          </article>
        `).join('')}
      </div>

      <div id="no-results-msg" class="hidden text-center py-16">
        <p class="text-sm text-neutral-500 font-mono">${isAr ? 'لم يتم العثور على مقالات مطابقة لبحثك.' : 'No guides found matching your search query.'}</p>
      </div>
    </main>

    ${getUnifiedFooter(lang)}

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
              p.className = 'cat-pill px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-black dark:hover:border-white transition-all cursor-pointer shadow-sm';
            });
            pill.className = 'cat-pill px-3 py-1.5 rounded-lg text-xs font-semibold bg-black text-white dark:bg-white dark:text-black transition-all cursor-pointer shadow-sm';
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
// Execution Pipeline
// ----------------------------------------------------------------------------
async function run() {
  console.log('🚀 Running Generation Pipeline for all 22 Articles...');

  // Ensure directories exist
  const dirs = [
    'ar/articles',
    'en/articles',
    'articles',
    'public/ar/articles',
    'public/en/articles',
    'public/articles',
  ];

  dirs.forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  // 1. Generate Individual Articles (ar, en, root routers, and public mirrors)
  for (const article of ARTICLES_CATALOG) {
    const arHtml = renderRichArticlePage(article, 'ar');
    const enHtml = renderRichArticlePage(article, 'en');
    const routerHtml = renderRootArticleRouter(article.slug, article.title.ar);

    // Write to root workspace
    fs.writeFileSync(`ar/articles/${article.slug}.html`, arHtml, 'utf8');
    fs.writeFileSync(`en/articles/${article.slug}.html`, enHtml, 'utf8');
    fs.writeFileSync(`articles/${article.slug}.html`, routerHtml, 'utf8');

    // Mirror to public/
    fs.writeFileSync(`public/ar/articles/${article.slug}.html`, arHtml, 'utf8');
    fs.writeFileSync(`public/en/articles/${article.slug}.html`, enHtml, 'utf8');
    fs.writeFileSync(`public/articles/${article.slug}.html`, routerHtml, 'utf8');

    console.log(`  ✓ Generated article: ${article.slug}`);
  }

  // 2. Generate Master Articles Directory Index
  const arIndexHtml = renderArticlesIndexPage('ar');
  const enIndexHtml = renderArticlesIndexPage('en');
  const routerIndexHtml = renderRootArticleRouter('index', 'دليل المقالات الهندسية — 22 Articles');

  fs.writeFileSync('ar/articles/index.html', arIndexHtml, 'utf8');
  fs.writeFileSync('en/articles/index.html', enIndexHtml, 'utf8');
  fs.writeFileSync('articles/index.html', routerIndexHtml, 'utf8');
  fs.writeFileSync('public/ar/articles/index.html', arIndexHtml, 'utf8');
  fs.writeFileSync('public/en/articles/index.html', enIndexHtml, 'utf8');
  fs.writeFileSync('public/articles/index.html', routerIndexHtml, 'utf8');

  console.log('  ✓ Generated master articles index (ar & en)');

  // 3. Update build-routers.ts to include all 22 articles
  const routerList = [
    { name: 'faq.html', title: 'الأسئلة الشائعة — FAQ | بريد مؤقت — Temp Mail', rel: 'faq.html' },
    { name: 'guide.html', title: 'دليل الاستخدام — User Guide | بريد مؤقت — Temp Mail', rel: 'guide.html' },
    { name: 'about.html', title: 'من نحن — About Us | بريد مؤقت — Temp Mail', rel: 'about.html' },
    { name: 'privacy.html', title: 'سياسة الخصوصية — Privacy Policy | بريد مؤقت — Temp Mail', rel: 'privacy.html' },
    { name: 'blog.html', title: 'المدونة والأدلة — Blog & Guides | بريد مؤقت — Temp Mail', rel: 'blog.html' },
    { name: 'article.html', title: 'الدليل الشامل — Comprehensive Guide | بريد مؤقت — Temp Mail', rel: 'article.html' },
    { name: 'articles/index.html', title: 'فهرس المقالات الـ 22 — Articles Index | بريد مؤقت — Temp Mail', rel: 'articles/index.html' },
    ...ARTICLES_CATALOG.map(a => ({
      name: `articles/${a.slug}.html`,
      title: `${a.title.ar} | بريد مؤقت — Temp Mail`,
      rel: `articles/${a.slug}.html`
    }))
  ];

  const buildRoutersTsContent = `import fs from 'fs';
import path from 'path';

interface RouterItem {
  name: string;
  title: string;
  rel: string;
}

const routers: RouterItem[] = ${JSON.stringify(routerList, null, 2)};

function generateRouterHTML(item: RouterItem) {
  const arUrl = '/ar/' + item.rel;
  const enUrl = '/en/' + item.rel;
  return \`<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>\${item.title}</title>
    <link rel="canonical" href="https://freetemp.email\${arUrl}" />
    <link rel="alternate" hreflang="ar" href="https://freetemp.email\${arUrl}" />
    <link rel="alternate" hreflang="en" href="https://freetemp.email\${enUrl}" />
    <link rel="alternate" hreflang="x-default" href="https://freetemp.email\${enUrl}" />
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
            window.location.replace('\${enUrl}' + window.location.search + window.location.hash);
          } else {
            window.location.replace('\${arUrl}' + window.location.search + window.location.hash);
          }
        } catch (e) {
          window.location.replace('\${arUrl}');
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
</html>\`;
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

console.log(\`✓ Generated \${routers.length} localized root routers seamlessly.\`);
`;

  fs.writeFileSync('scripts/build-routers.ts', buildRoutersTsContent, 'utf8');
  console.log('  ✓ Updated scripts/build-routers.ts with all 22 articles');

  console.log('🎉 Generation Completed Successfully!');
}

run();
