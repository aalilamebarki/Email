import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ARTICLES_CATALOG, CatalogArticle } from './data-articles-catalog.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

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
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function generateBlogHtml(lang: 'ar' | 'en'): string {
  const isAr = lang === 'ar';
  const prefix = isAr ? '/ar' : '/en';
  const fontClass = isAr ? "font-['Cairo',sans-serif]" : "font-sans";

  // Collect unique categories
  const categoriesMap = new Map<string, string>();
  for (const art of ARTICLES_CATALOG) {
    const catName = isAr ? art.category.ar : art.category.en;
    categoriesMap.set(catName, catName);
  }
  const categories = Array.from(categoriesMap.keys());

  // Hreflang alternates
  const hreflangs = LANGUAGES.map(l => {
    const p = (l.code === 'ar' || l.code === 'fa' || l.code === 'ur') ? '/ar/blog.html' : '/en/blog.html';
    return `    <link rel="alternate" hreflang="${l.code}" href="https://freetemp.email${p}" />`;
  }).join('\n');

  const pageTitle = isAr
    ? 'أرشيف المدونة والأدلة الهندسية — بريد مؤقت'
    : 'Engineering Blog & Technical Research Archive — Temp Mail';

  const pageDesc = isAr
    ? 'أرشيف المقالات والبحوث الهندسية لخدمة بريد مؤقت: 22 مقالاً ودليلاً يغطي التغطية الشاملة لرسائل التحقق OTP، أمان الخصوصية، والبث الحي عبر WebSocket.'
    : 'Engineering and research archive for Temp Mail: 22 in-depth guides covering Universal Verification Coverage, OTP extraction, real-time WebSocket streaming, and privacy protocols.';

  const ogTitle = isAr
    ? 'أرشيف المدونة والأدلة الهندسية — بريد مؤقت'
    : 'Engineering Blog & Technical Research Archive — Temp Mail';

  const ogDesc = isAr
    ? 'استكشف كافة المقالات والأبحاث المعمارية الـ 22 حول أمان البريد المؤقت وتجاوز حجب أكواد التحقق.'
    : 'Explore all 22 technical research guides on disposable mail architecture, OTP decoding, and privacy protocols.';

  // Build article cards HTML
  const cardsHtml = ARTICLES_CATALOG.map((art, idx) => {
    const title = isAr ? art.title.ar : art.title.en;
    const desc = isAr ? art.metaDesc.ar : art.metaDesc.en;
    const cat = isAr ? art.category.ar : art.category.en;
    const readTime = isAr ? `${art.readTimeMin} دقائق قراءة` : `${art.readTimeMin} min read`;
    const artUrl = `${prefix}/articles/${art.slug}.html`;
    const readBtnText = isAr ? 'قراءة المقال ←' : 'Read Article →';
    const dateStr = '2026-09-25';

    return `        <!-- Article Card ${idx + 1}: ${art.slug} -->
        <article
          class="article-card p-5 sm:p-6 bg-white dark:bg-[#121212] border border-neutral-300 dark:border-neutral-800 rounded-xl shadow-sm hover:border-neutral-400 dark:hover:border-neutral-600 transition-all flex flex-col justify-between"
          data-title="${escapeHtml(title.toLowerCase())}"
          data-desc="${escapeHtml(desc.toLowerCase())}"
          data-category="${escapeHtml(cat)}"
        >
          <div>
            <div class="flex items-center gap-2 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mb-2.5">
              <span class="font-bold text-black dark:text-white px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-[10px] uppercase">${escapeHtml(cat)}</span>
              <span>•</span>
              <time datetime="${dateStr}">${dateStr}</time>
            </div>
            <h2 class="text-base font-bold text-black dark:text-white mb-2 leading-snug">
              <a href="${artUrl}" class="hover:underline">
                ${escapeHtml(title)}
              </a>
            </h2>
            <p class="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
              ${escapeHtml(desc)}
            </p>
          </div>
          <div class="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs">
            <span class="text-neutral-500 font-mono text-[11px]">${readTime}</span>
            <a href="${artUrl}" class="font-bold text-black dark:text-white hover:underline">
              ${readBtnText}
            </a>
          </div>
        </article>`;
  }).join('\n\n');

  // Category filter pills
  const filterPillsHtml = categories.map(cat => {
    return `          <button
            type="button"
            data-cat="${escapeHtml(cat)}"
            class="cat-pill px-3 py-1 rounded text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            ${escapeHtml(cat)}
          </button>`;
  }).join('\n');

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
    <title>${escapeHtml(pageTitle)}</title>
    <meta name="description" content="${escapeHtml(pageDesc)}" />
    <link rel="canonical" href="https://freetemp.email${prefix}/blog.html" />

    <!-- Multilingual Alternates -->
${hreflangs}
    <link rel="alternate" hreflang="x-default" href="https://freetemp.email/en/blog.html" />

    <!-- Open Graph Tags -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Temp Mail" />
    <meta property="og:title" content="${escapeHtml(ogTitle)}" />
    <meta property="og:description" content="${escapeHtml(ogDesc)}" />
    <meta property="og:url" content="https://freetemp.email${prefix}/blog.html" />
    <meta property="og:image" content="https://freetemp.email/og-image.png" />

    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(ogTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(ogDesc)}" />
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
  <body class="min-h-screen bg-white text-black dark:bg-[#0D0D0D] dark:text-[#F5F5F5] flex flex-col transition-colors duration-200 ${fontClass}">
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
            <a href="${prefix}/blog.html" data-i18n="blog" class="text-black dark:text-white font-bold transition-colors">${isAr ? 'المدونة' : 'Blog'}</a>
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

    <!-- Main Content Container -->
    <main class="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12">
      <!-- Breadcrumbs -->
      <nav class="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-6 font-mono">
        <a href="${prefix}/" class="hover:underline" data-i18n="home">${isAr ? 'الرئيسية' : 'Home'}</a>
        <span>/</span>
        <span class="text-black dark:text-white font-semibold" data-i18n="blog">${isAr ? 'المدونة والأرشيف' : 'Blog & Archive'}</span>
      </nav>

      <!-- Difference Callout: Blog vs Guide -->
      <div class="mb-8 p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-black dark:text-white shrink-0 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          <span class="text-neutral-700 dark:text-neutral-300 leading-relaxed">
            ${isAr ? 'ملاحظة للقارئ: تحتوي المدونة على كافة الأبحاث المعمارية والبروتوكولات (22 دليلاً). هل تبحث عن دليل الاستخدام التشغيلي والخطوات السريعة؟' : 'Reader Note: The Blog archive contains all technical research papers and protocol guides (22 guides). Looking for step-by-step instructions on mailbox generation?'}
          </span>
        </div>
        <a href="${prefix}/guide.html" class="font-bold text-black dark:text-white underline hover:opacity-80 shrink-0">
          ${isAr ? 'زيارة دليل الاستخدام ←' : 'Visit Operational User Guide →'}
        </a>
      </div>

      <!-- Blog Header -->
      <div class="mb-8 text-center max-w-2xl mx-auto">
        <h1 class="text-3xl sm:text-4xl font-extrabold text-black dark:text-white tracking-tight mb-3">
          ${isAr ? 'أرشيف المدونة والأبحاث الهندسية' : 'Engineering Blog & Technical Archive'}
        </h1>
        <p class="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
          ${isAr ? 'أدلة معمارية وأبحاث متخصصة تغطي خوارزميات التغطية الشاملة لرسائل التحقق، البث الحي عبر WebSocket، والتشفير وعزل الحاويات.' : 'Architectural deep-dives on Universal Verification Coverage algorithms, ephemeral container isolation, real-time WebSocket streaming, and privacy protocols.'}
        </p>
      </div>

      <!-- Search & Filters Bar -->
      <div class="mb-8 space-y-3">
        <div class="relative">
          <input
            id="article-search-input"
            type="text"
            placeholder="${isAr ? 'ابحث في كافة المقالات والأبحاث (22 مقالاً)...' : 'Search all articles and research papers (22 guides)...'}"
            class="w-full h-11 px-4 bg-white dark:bg-[#121212] border border-neutral-300 dark:border-neutral-700 rounded-xl text-xs sm:text-sm text-black dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors shadow-sm"
          />
        </div>

        <!-- Category Filter Pills -->
        <div class="flex flex-wrap gap-1.5" id="category-pills">
          <button
            type="button"
            data-cat="all"
            class="cat-pill px-3 py-1 rounded text-xs font-bold bg-black text-white dark:bg-white dark:text-black cursor-pointer shadow-sm"
          >
            ${isAr ? `الكل (${ARTICLES_CATALOG.length})` : `All (${ARTICLES_CATALOG.length})`}
          </button>
${filterPillsHtml}
        </div>
      </div>

      <!-- All Articles Grid (Clean 2-Column Boxes Layout) -->
      <div id="articles-grid" class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
${cardsHtml}
      </div>

      <!-- Empty Search Result State -->
      <div id="no-articles-found" class="hidden text-center py-12 p-8 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl mb-12">
        <p class="text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">
          ${isAr ? 'لم يتم العثور على مقالات تطابق بحثك' : 'No articles matched your search query'}
        </p>
        <p class="text-xs text-neutral-500 font-mono">
          ${isAr ? 'يرجى تجربة كلمات بحث أخرى أو اختيار تصنيف مختلف.' : 'Please try different keywords or reset category filters.'}
        </p>
      </div>

      <!-- Bottom Navigation Hub -->
      <div class="p-6 sm:p-8 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-xl text-center">
        <h3 class="text-base sm:text-lg font-bold text-black dark:text-white mb-2">
          ${isAr ? 'جاهز لتجربة محرك البريد المؤقت؟' : 'Ready to test the disposable mail engine?'}
        </h3>
        <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-5 max-w-md mx-auto leading-relaxed">
          ${isAr ? 'احصل على عنوان بريد إلكتروني مؤقت ومعزول لاستقبال أكواد OTP وروابط التفعيل مباشرة دون تسجيل.' : 'Get an isolated disposable address and receive your OTP code or activation link live in seconds without registration.'}
        </p>
        <div class="flex flex-wrap items-center justify-center gap-3">
          <a
            href="${prefix}/"
            class="px-6 py-2.5 bg-black text-white dark:bg-white dark:text-black rounded-lg text-xs sm:text-sm font-bold hover:opacity-90 transition-opacity shadow-sm"
          >
            ${isAr ? 'الانتقال إلى الصندوق المباشر ←' : 'Go to Live Inbox →'}
          </a>
          <a
            href="${prefix}/guide.html"
            class="px-6 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white rounded-lg text-xs sm:text-sm font-bold hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors shadow-sm"
          >
            ${isAr ? 'دليل الاستخدام التشغيلي' : 'Operational User Guide'}
          </a>
        </div>
      </div>
    </main>

    <!-- Master 4-Column Unified Footer -->
    <footer class="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0A0A0A] py-12 transition-colors mt-auto text-xs">
      <div class="max-w-4xl mx-auto px-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10 ${isAr ? 'text-right' : 'text-left'}">
          <!-- Column 1: Brand & Status -->
          <div>
            <div class="text-base font-bold text-black dark:text-white mb-2" data-i18n="brand">Temp Mail</div>
            <p class="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-3" data-i18n="footerDesc">
              ${isAr ? 'خدمة بريد مؤقت مجانية ومعزولة تقنياً لحماية خصوصيتك من التتبع والرسائل المزعجة (Spam) دون الحاجة لتسجيل أي بيانات شخصية.' : 'Free and technically isolated temporary email service protecting your inbox against spam and trackers without any registration.'}
            </p>
            <div class="inline-flex items-center gap-2 font-mono text-[11px] text-black dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 rounded-md px-2 py-1 bg-neutral-50 dark:bg-neutral-900">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span data-i18n="footerNodesStatus">${isAr ? 'جميع عُقد الحافة تعمل بكفاءة' : 'All edge nodes operational'}</span>
            </div>
          </div>

          <!-- Column 2: Navigation -->
          <div>
            <div class="font-bold text-black dark:text-white mb-3 uppercase tracking-wider text-[11px]" data-i18n="footerNav">
              ${isAr ? 'التنقل السريع' : 'Navigation'}
            </div>
            <ul class="space-y-2">
              <li><a href="${prefix}/" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors" data-i18n="home">${isAr ? 'الرئيسية' : 'Home'}</a></li>
              <li><a href="${prefix}/blog.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors" data-i18n="blog">${isAr ? 'المدونة والأرشيف' : 'Blog & Archive'}</a></li>
              <li><a href="${prefix}/guide.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors" data-i18n="guide">${isAr ? 'دليل الاستخدام' : 'Guide'}</a></li>
              <li><a href="${prefix}/faq.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors" data-i18n="faq">${isAr ? 'الأسئلة الشائعة' : 'FAQ'}</a></li>
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
              ${isAr ? 'معايير الأمان والتشفير' : 'Security Standards'}
            </div>
            <ul class="space-y-2 text-neutral-600 dark:text-neutral-400">
              <li class="flex items-center gap-1.5">
                <span class="text-black dark:text-white font-bold">✓</span>
                <span data-i18n="footerSec1">${isAr ? 'إتلاف تلقائي بعد 20 دقيقة' : 'Auto-purge after 20 minutes'}</span>
              </li>
              <li class="flex items-center gap-1.5">
                <span class="text-black dark:text-white font-bold">✓</span>
                <span data-i18n="footerSec2">${isAr ? 'عزل مشفر بحاويات O(1)' : 'Encrypted O(1) isolation'}</span>
              </li>
              <li class="flex items-center gap-1.5">
                <span class="text-black dark:text-white font-bold">✓</span>
                <span data-i18n="footerSec3">${isAr ? 'بدون تسجيل بيانات شخصية أو كوكيز' : 'Zero personal logs and cookies'}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="border-t border-neutral-200 dark:border-neutral-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div data-i18n="footerCopyright">${isAr ? '© 2026 بريد مؤقت — Temp Mail. جميع الحقوق محفوظة.' : '© 2026 Temp Mail. All rights reserved.'}</div>
          <div class="flex items-center gap-4 font-mono text-[11px]">
            <span>TLS 1.3 256-Bit</span>
            <span>•</span>
            <span>Cloudflare Edge</span>
            <span>•</span>
            <span>Zero-Logs Verified</span>
          </div>
        </div>
      </div>
    </footer>

    <!-- Search & Filter Script -->
    <script>
      document.addEventListener('DOMContentLoaded', function () {
        const searchInput = document.getElementById('article-search-input');
        const catButtons = document.querySelectorAll('.cat-pill');
        const cards = document.querySelectorAll('.article-card');
        const noResults = document.getElementById('no-articles-found');
        let currentCategory = 'all';

        function filterArticles() {
          const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
          let visibleCount = 0;

          cards.forEach(card => {
            const title = card.getAttribute('data-title') || '';
            const desc = card.getAttribute('data-desc') || '';
            const cat = card.getAttribute('data-category') || '';

            const matchesSearch = !query || title.includes(query) || desc.includes(query);
            const matchesCat = currentCategory === 'all' || cat === currentCategory;

            if (matchesSearch && matchesCat) {
              card.classList.remove('hidden');
              visibleCount++;
            } else {
              card.classList.add('hidden');
            }
          });

          if (noResults) {
            if (visibleCount === 0) {
              noResults.classList.remove('hidden');
            } else {
              noResults.classList.add('hidden');
            }
          }
        }

        if (searchInput) {
          searchInput.addEventListener('input', filterArticles);
        }

        catButtons.forEach(btn => {
          btn.addEventListener('click', function () {
            catButtons.forEach(b => {
              b.classList.remove('bg-black', 'text-white', 'dark:bg-white', 'dark:text-black', 'font-bold');
              b.classList.add('bg-neutral-100', 'dark:bg-neutral-800', 'text-neutral-700', 'dark:text-neutral-300', 'font-semibold');
            });
            btn.classList.add('bg-black', 'text-white', 'dark:bg-white', 'dark:text-black', 'font-bold');
            btn.classList.remove('bg-neutral-100', 'dark:bg-neutral-800', 'text-neutral-700', 'dark:text-neutral-300', 'font-semibold');

            currentCategory = btn.getAttribute('data-cat') || 'all';
            filterArticles();
          });
        });
      });
    </script>
  </body>
</html>`;
}

// Generate ar/blog.html and en/blog.html
const arBlog = generateBlogHtml('ar');
fs.writeFileSync(path.join(rootDir, 'ar', 'blog.html'), arBlog, 'utf8');
console.log('✓ Generated pristine ar/blog.html with all 22 articles archive.');

const enBlog = generateBlogHtml('en');
fs.writeFileSync(path.join(rootDir, 'en', 'blog.html'), enBlog, 'utf8');
console.log('✓ Generated pristine en/blog.html with all 22 articles archive.');

// Also mirror to public if present
if (fs.existsSync(path.join(rootDir, 'public', 'ar'))) {
  fs.writeFileSync(path.join(rootDir, 'public', 'ar', 'blog.html'), arBlog, 'utf8');
}
if (fs.existsSync(path.join(rootDir, 'public', 'en'))) {
  fs.writeFileSync(path.join(rootDir, 'public', 'en', 'blog.html'), enBlog, 'utf8');
}
