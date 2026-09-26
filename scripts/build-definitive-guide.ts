import fs from 'node:fs';
import path from 'node:path';

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

function generateFlagshipGuide(lang: 'ar' | 'en') {
  const isAr = lang === 'ar';
  const prefix = isAr ? '/ar' : '/en';
  const dir = isAr ? 'rtl' : 'ltr';
  const font = isAr ? "font-['Cairo',sans-serif]" : "font-['Inter',sans-serif]";
  const arrow = isAr ? '←' : '→';

  const title = isAr
    ? 'الدليل الشامل للبريد الإلكتروني المؤقت وحماية الخصوصية الرقمية في 2026'
    : 'The Definitive Guide to Disposable Temporary Email & Digital Privacy in 2026';

  const lead = isAr
    ? 'تحليل معماري وهندسي تفصيلي لكيفية كسر سلاسل الارتباط بين المواقع، عزل بكسلات التتبع، واستقبال رموز OTP لمرة واحدة مع ضمانات تامة بعدم تخزين أي بيانات.'
    : 'An architectural breakdown of how temporary email breaks cross-site correlation chains, isolates web tracking beacons, and delivers single-use OTP codes with zero permanent data retention.';

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": `https://freetemp.email${prefix}/article.html#article`,
        "headline": title,
        "description": lead,
        "inLanguage": lang,
        "datePublished": "2026-09-25T08:00:00+00:00",
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
        "mainEntityOfPage": `https://freetemp.email${prefix}/article.html`
      },
      {
        "@type": "BreadcrumbList",
        "@id": `https://freetemp.email${prefix}/article.html#breadcrumb`,
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
            "item": `https://freetemp.email${prefix}/article.html`
          }
        ]
      }
    ]
  };

  return `<!doctype html>
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
    <meta name="description" content="${lead}" />
    <meta name="author" content="Temp Mail Security Engineering Team" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://freetemp.email${prefix}/article.html" />

    <!-- Multilingual Alternates -->
    <link rel="alternate" hreflang="ar" href="https://freetemp.email/ar/article.html" />
    <link rel="alternate" hreflang="en" href="https://freetemp.email/en/article.html" />
    <link rel="alternate" hreflang="x-default" href="https://freetemp.email/en/article.html" />

    <!-- Open Graph Tags -->
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Temp Mail" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${lead}" />
    <meta property="og:url" content="https://freetemp.email${prefix}/article.html" />
    <meta property="og:image" content="https://freetemp.email/og-image.png" />
    <meta property="og:locale" content="${isAr ? 'ar_AR' : 'en_US'}" />

    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${lead}" />
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

    <!-- Schema.org JSON-LD -->
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
        <span class="text-black dark:text-white font-semibold">${isAr ? 'الدليل الشامل 2026' : 'Flagship Guide 2026'}</span>
      </nav>

      <!-- Article Header -->
      <article>
        <header class="mb-8">
          <div class="flex flex-wrap items-center gap-2 mb-3 text-[11px] font-mono">
            <span class="px-2.5 py-0.5 rounded-full bg-black text-white dark:bg-white dark:text-black font-bold uppercase tracking-wider text-[10px]">
              ${isAr ? 'الدليل المرجعي لعام 2026' : 'Flagship Guide 2026'}
            </span>
            <span class="text-neutral-400">•</span>
            <span class="text-neutral-500 font-mono">8 mins read</span>
            <span class="text-neutral-400">•</span>
            <time datetime="2026-09-25" class="text-neutral-500 font-mono">2026-09-25</time>
          </div>

          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-black dark:text-white mb-4 leading-tight tracking-tight">
            ${title}
          </h1>

          <p class="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
            ${lead}
          </p>
        </header>

        <!-- Core Architectural Takeaways -->
        <div class="mb-10 p-5 sm:p-6 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm">
          <h2 class="text-sm font-bold text-black dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <svg class="w-4 h-4 text-emerald-500 stroke-current fill-none stroke-[2.5]" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
            ${isAr ? 'الركائز الهندسية الأساسية لمنصة البريد المؤقت' : 'Core Architectural Pillars of Ephemeral Email'}
          </h2>
          <ul class="space-y-3 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
            <li class="flex items-start gap-2.5">
              <span class="text-black dark:text-white font-bold shrink-0 mt-0.5">✓</span>
              <span>${isAr ? 'عزل الذاكرة O(1): فصل فيزيائي مشفر لكل صندوق بريد دون قاعدة بيانات مركزية مشتركة.' : 'Deterministic O(1) in-memory isolation ensuring zero cross-tenant data leakage.'}</span>
            </li>
            <li class="flex items-start gap-2.5">
              <span class="text-black dark:text-white font-bold shrink-0 mt-0.5">✓</span>
              <span>${isAr ? 'البث اللحظي عبر WebSocket: وصول الرسائل للشاشة في أقل من 300 ميلي ثانية وبدون إعادة تحميل.' : 'Sub-300ms live email delivery pushed via persistent WebSocket hibernation.'}</span>
            </li>
            <li class="flex items-start gap-2.5">
              <span class="text-black dark:text-white font-bold shrink-0 mt-0.5">✓</span>
              <span>${isAr ? 'التغطية الشاملة لرسائل التحقق: فك شفرات رموز جوجل وستيم جارد وتجاوز مصيدة السنة (2026).' : '100% verification accuracy extracting Google tokens, Steam Guard, and avoiding year traps.'}</span>
            </li>
            <li class="flex items-start gap-2.5">
              <span class="text-black dark:text-white font-bold shrink-0 mt-0.5">✓</span>
              <span>${isAr ? 'حفظ الروابط السحرية: معالجة سلبية تمنع روبوتات الفحص المسبق من إفساد الروابط أحادية الاستخدام.' : 'Passive link parsing preventing pre-fetch crawlers from burning single-use magic login tokens.'}</span>
            </li>
          </ul>
        </div>

        <!-- Section 1 -->
        <section class="mb-10">
          <h2 class="text-xl sm:text-2xl font-bold text-black dark:text-white mb-4">
            ${isAr ? '1.0 أزمة الخصوصية الرقمية وسماسرة البيانات في 2026' : '1.0 The 2026 Digital Privacy & Data Broker Crisis'}
          </h2>
          <div class="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed space-y-4">
            <p>
              ${isAr
                ? 'في المشهد الرقمي المعاصر لعام 2026، لم يعد البريد الإلكتروني مجرد أداة مراسلة، بل تحول إلى <strong>المعرف الرقمي الأساسي (Universal Digital ID)</strong> الذي تستخدمه شركات الإعلانات وسماسرة البيانات لربط سلوكك عبر مئات المواقع. يؤدي تقديم بريدك الحقيقي لمرة واحدة إلى إضافتك لقوائم الاستهداف الإعلاني الدائم.'
                : 'In 2026, email is no longer a messaging protocol—it has evolved into the primary <strong>Universal Digital Identifier</strong> used by data brokers and advertising syndicates to correlate user activity across disparate services. Giving your primary address away once binds your real identity to corporate profiling indefinitely.'}
            </p>
            <p>
              ${isAr
                ? 'تفشل صناديق البريد العادية في مواجهة هذا التهديد؛ لأن فلاترها تحتفظ ببياناتك للأبد. لمعرفة المزيد حول هذا الفشل، راجع مقالنا حول <a href="/ar/articles/temp-mail-vs-spam-filters.html" class="font-bold underline text-black dark:text-white">عزل الذاكرة O(1) مقابل فلاتر البريد التقليدية</a>.'
                : 'Standard webmail fails against this threat because folder-based filters retain telemetry permanently. For an architectural deep-dive, see our guide on <a href="/en/articles/temp-mail-vs-spam-filters.html" class="font-bold underline text-black dark:text-white">O(1) Ephemeral Isolation vs. Traditional Spam Filters</a>.'}
            </p>
          </div>
        </section>

        <!-- Section 2 -->
        <section class="mb-10">
          <h2 class="text-xl sm:text-2xl font-bold text-black dark:text-white mb-4">
            ${isAr ? '2.0 ثورة التحقق اللحظي ودقة استخراج رموز OTP' : '2.0 Real-Time Verification Accuracy & Token Extraction'}
          </h2>
          <div class="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed space-y-4">
            <p>
              ${isAr
                ? 'تعتمد منصتنا على تقنية <a href="/ar/articles/universal-verification-coverage.html" class="font-bold underline text-black dark:text-white">التغطية الشاملة لرسائل التحقق (UVC)</a> التي تفك شفرات الرموز الأكثر تعقيداً فور وصولها عبر <a href="/ar/articles/how-inbox-updates-live.html" class="font-bold underline text-black dark:text-white">البث المباشر بتقنية WebSocket</a>.'
                : 'Our platform pairs our <a href="/en/articles/universal-verification-coverage.html" class="font-bold underline text-black dark:text-white">Universal Verification Coverage Engine</a> with <a href="/en/articles/how-inbox-updates-live.html" class="font-bold underline text-black dark:text-white">Real-Time WebSocket Streaming</a> to extract complex passcodes without polling delays.'}
            </p>
            <p>
              ${isAr
                ? 'سواء كنت تتعامل مع أكواد رقمية أو روابط تسجيل دخول بدون كلمة مرور، نضمن لك حماية التوكنات كما نوضح في <a href="/ar/articles/magic-links-vs-otp.html" class="font-bold underline text-black dark:text-white">دراسة الروابط السحرية مقابل رموز OTP</a>.'
                : 'Whether receiving alphanumeric tokens or passwordless URLs, our passive pipeline preserves single-use tokens, as detailed in our guide on <a href="/en/articles/magic-links-vs-otp.html" class="font-bold underline text-black dark:text-white">Magic Links vs. OTP Verification</a>.'}
            </p>
          </div>
        </section>

        <!-- 4 Curated Related Feature Cards Grid -->
        <section class="mb-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
          <h2 class="text-lg sm:text-xl font-bold text-black dark:text-white mb-2">
            ${isAr ? 'الأدلة التقنية والمعمارية التفصيلية' : 'Explore Our Core Feature Deep-Dives'}
          </h2>
          <p class="text-xs text-neutral-500 mb-6">
            ${isAr ? 'اقرأ التحليلات الهندسية الشاملة لكافة ميزات المنصة الحصرية' : 'Read in-depth engineering breakdowns for each of our proprietary features'}
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <article class="p-4 bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-black dark:hover:border-white transition-all flex flex-col justify-between shadow-sm">
              <div>
                <span class="text-[10px] font-mono uppercase px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-neutral-600 dark:text-neutral-400 font-bold mb-2 inline-block">
                  ${isAr ? 'معمارية التحقق' : 'Verification Core'}
                </span>
                <h3 class="font-bold text-sm text-black dark:text-white mb-1.5">
                  <a href="${prefix}/articles/universal-verification-coverage.html" class="hover:underline">
                    ${isAr ? 'التغطية الشاملة لرسائل التحقق (UVC)' : 'Universal Verification Coverage (UVC)'}
                  </a>
                </h3>
                <p class="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                  ${isAr ? 'كيف يتفوق محركنا في فك شفرات OTP وأكواد جوجل وتجاوز فخاخ التواريخ.' : 'How our engine decodes complex OTPs and extracts hidden verification links.'}
                </p>
              </div>
              <a href="${prefix}/articles/universal-verification-coverage.html" class="text-xs font-bold text-black dark:text-white hover:underline flex items-center gap-1 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <span>${isAr ? 'قراءة التحليل الفني' : 'Read Technical Analysis'}</span>
                <span>${arrow}</span>
              </a>
            </article>

            <article class="p-4 bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-black dark:hover:border-white transition-all flex flex-col justify-between shadow-sm">
              <div>
                <span class="text-[10px] font-mono uppercase px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-neutral-600 dark:text-neutral-400 font-bold mb-2 inline-block">
                  ${isAr ? 'البنية التحتية' : 'Infrastructure'}
                </span>
                <h3 class="font-bold text-sm text-black dark:text-white mb-1.5">
                  <a href="${prefix}/articles/how-inbox-updates-live.html" class="hover:underline">
                    ${isAr ? 'التحديث اللحظي عبر WebSocket' : 'Real-Time WebSocket Streaming'}
                  </a>
                </h3>
                <p class="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                  ${isAr ? 'كيف تصل الرسائل إلى شاشتك في أقل من 300 ميلي ثانية بدون إعادة تحميل.' : 'How inbound emails push to your screen in milliseconds without refreshing.'}
                </p>
              </div>
              <a href="${prefix}/articles/how-inbox-updates-live.html" class="text-xs font-bold text-black dark:text-white hover:underline flex items-center gap-1 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <span>${isAr ? 'قراءة التحليل الفني' : 'Read Technical Analysis'}</span>
                <span>${arrow}</span>
              </a>
            </article>

            <article class="p-4 bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-black dark:hover:border-white transition-all flex flex-col justify-between shadow-sm">
              <div>
                <span class="text-[10px] font-mono uppercase px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-neutral-600 dark:text-neutral-400 font-bold mb-2 inline-block">
                  ${isAr ? 'هندسة الخصوصية' : 'Privacy Core'}
                </span>
                <h3 class="font-bold text-sm text-black dark:text-white mb-1.5">
                  <a href="${prefix}/articles/temp-mail-vs-spam-filters.html" class="hover:underline">
                    ${isAr ? 'عزل الذاكرة O(1) وحظر بكسلات التتبع' : 'O(1) Ephemeral Memory Isolation'}
                  </a>
                </h3>
                <p class="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                  ${isAr ? 'لماذا يفشل بريدك العادي في حمايتك وكيف تكسر الحاويات سلاسل التتبع.' : 'Why standard spam filters fail and how memory isolation shields your IP.'}
                </p>
              </div>
              <a href="${prefix}/articles/temp-mail-vs-spam-filters.html" class="text-xs font-bold text-black dark:text-white hover:underline flex items-center gap-1 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <span>${isAr ? 'قراءة التحليل الفني' : 'Read Technical Analysis'}</span>
                <span>${arrow}</span>
              </a>
            </article>

            <article class="p-4 bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-black dark:hover:border-white transition-all flex flex-col justify-between shadow-sm">
              <div>
                <span class="text-[10px] font-mono uppercase px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-neutral-600 dark:text-neutral-400 font-bold mb-2 inline-block">
                  ${isAr ? 'هندسة المصادقة' : 'Authentication'}
                </span>
                <h3 class="font-bold text-sm text-black dark:text-white mb-1.5">
                  <a href="${prefix}/articles/magic-links-vs-otp.html" class="hover:underline">
                    ${isAr ? 'الروابط السحرية مقابل رموز OTP' : 'Magic Links vs. OTP Verification'}
                  </a>
                </h3>
                <p class="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                  ${isAr ? 'كيف يحمي محركنا الروابط أحادية الاستخدام من الاحتراق المبكر.' : 'How passive ingestion prevents premature expiration of single-use tokens.'}
                </p>
              </div>
              <a href="${prefix}/articles/magic-links-vs-otp.html" class="text-xs font-bold text-black dark:text-white hover:underline flex items-center gap-1 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <span>${isAr ? 'قراءة التحليل الفني' : 'Read Technical Analysis'}</span>
                <span>${arrow}</span>
              </a>
            </article>
          </div>
        </section>

        <!-- Bottom Action CTA Hub -->
        <div class="p-8 bg-neutral-50 dark:bg-neutral-900 border-2 border-black dark:border-white rounded-2xl text-center shadow-sm">
          <h3 class="text-lg sm:text-xl font-extrabold text-black dark:text-white mb-2" data-i18n="blogCtaTitle">
            ${isAr ? 'هل أنت مستعد لاختبار المحرك بنفسك؟' : 'Ready to test our engine?'}
          </h3>
          <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-6 max-w-lg mx-auto leading-relaxed" data-i18n="blogCtaDesc">
            ${isAr ? 'احصل على عنوان مؤقت معزول واستقبل كود التفعيل أو رابط التحقق لحظياً خلال ثوانٍ وبدون تسجيل.' : 'Get an isolated disposable address and receive your OTP code or activation link live in seconds without signup.'}
          </p>
          <div class="flex flex-wrap items-center justify-center gap-4">
            <a
              href="${prefix}/"
              class="px-6 py-3 bg-black text-white dark:bg-white dark:text-black rounded-lg text-xs sm:text-sm font-bold hover:opacity-90 transition-opacity"
              data-i18n="goToInbox"
            >
              ${isAr ? 'الانتقال إلى صندوق الوارد المباشر ←' : 'Go to Live Inbox →'}
            </a>
            <a
              href="${prefix}/guide.html"
              class="px-6 py-3 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white rounded-lg text-xs sm:text-sm font-bold hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              data-i18n="opUserGuide"
            >
              ${isAr ? 'دليل الاستخدام العملي' : 'Operational User Guide'}
            </a>
          </div>
        </div>
      </article>
    </main>

    ${getUnifiedFooter(lang)}
  </body>
</html>`;
}

// Generate for ar, en and public
const arHtml = generateFlagshipGuide('ar');
const enHtml = generateFlagshipGuide('en');

fs.writeFileSync('ar/article.html', arHtml, 'utf8');
fs.writeFileSync('public/ar/article.html', arHtml, 'utf8');

fs.writeFileSync('en/article.html', enHtml, 'utf8');
fs.writeFileSync('public/en/article.html', enHtml, 'utf8');

console.log('✓ Successfully generated authoritative flagship guide: article.html (ar & en)');
