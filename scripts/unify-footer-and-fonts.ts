import fs from 'node:fs';
import path from 'node:path';

/**
 * Script to enforce 100% unified 4-column footer and persistent fonts
 * across all HTML pages in the project.
 */

const MASTER_ARABIC_FOOTER = `    <!-- Master Arabic 4-Column Footer — الموحد في جميع الصفحات -->
    <footer class="border-t border-[#EAEAEA] dark:border-[#222222] bg-white dark:bg-[#0A0A0A] py-12 transition-colors mt-auto text-xs">
      <div class="max-w-4xl mx-auto px-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10 text-right">
          <!-- العمود 1: المنصة والرسالة -->
          <div>
            <div class="text-base font-bold text-black dark:text-white mb-2">بريد مؤقت</div>
            <p class="text-[#666666] dark:text-[#888888] leading-relaxed mb-3">
              خدمة بريد مؤقت مجانية ومعزولة تقنياً لحماية خصوصيتك من التتبع والرسائل المزعجة (Spam) دون الحاجة لتسجيل أي بيانات شخصية.
            </p>
            <div class="inline-flex items-center gap-2 font-mono text-[11px] text-black dark:text-[#A0A0A0] border border-[#EAEAEA] dark:border-[#222222] rounded-md px-2 py-1 bg-[#FAFAFA] dark:bg-[#141414]">
              <span class="w-1.5 h-1.5 rounded-full bg-black dark:bg-[#00FF66]"></span>
              <span>جميع خوادم الحافة تعمل بكفاءة</span>
            </div>
          </div>

          <!-- العمود 2: التنقل السريع -->
          <div>
            <div class="font-bold text-black dark:text-white mb-3 uppercase tracking-wider text-[11px]">
              التنقل السريع والاستخدام
            </div>
            <ul class="space-y-2">
              <li><a href="/ar/" class="text-[#666666] dark:text-[#888888] hover:text-black dark:hover:text-white transition-colors">الرئيسية</a></li>
              <li><a href="/ar/guide.html" class="text-[#666666] dark:text-[#888888] hover:text-black dark:hover:text-white transition-colors">دليل الاستخدام</a></li>
              <li><a href="/ar/faq.html" class="text-[#666666] dark:text-[#888888] hover:text-black dark:hover:text-white transition-colors">الأسئلة الشائعة</a></li>
              <li><a href="/ar/articles/index.html" class="text-[#666666] dark:text-[#888888] hover:text-black dark:hover:text-white transition-colors">المقالات والأدلة</a></li>
            </ul>
          </div>

          <!-- العمود 3: الشفافية والامتثال -->
          <div>
            <div class="font-bold text-black dark:text-white mb-3 uppercase tracking-wider text-[11px]">
              الشفافية والامتثال
            </div>
            <ul class="space-y-2">
              <li><a href="/ar/about.html" class="text-[#666666] dark:text-[#888888] hover:text-black dark:hover:text-white transition-colors">من نحن</a></li>
              <li><a href="/ar/privacy.html" class="text-[#666666] dark:text-[#888888] hover:text-black dark:hover:text-white transition-colors">سياسة الخصوصية</a></li>
              <li><a href="/ar/privacy.html#terms" class="text-[#666666] dark:text-[#888888] hover:text-black dark:hover:text-white transition-colors">شروط الاستخدام</a></li>
            </ul>
          </div>

          <!-- العمود 4: معايير الأمان -->
          <div>
            <div class="font-bold text-black dark:text-white mb-3 uppercase tracking-wider text-[11px]">
              معايير الأمان والتشفير
            </div>
            <ul class="space-y-2 text-[#666666] dark:text-[#888888]">
              <li class="flex items-center gap-1.5">
                <span class="text-black dark:text-white font-bold">✓</span>
                <span>إتلاف ذاتي فوري بعد 20 دقيقة</span>
              </li>
              <li class="flex items-center gap-1.5">
                <span class="text-black dark:text-white font-bold">✓</span>
                <span>عزل مشفر بحاويات O(1)</span>
              </li>
              <li class="flex items-center gap-1.5">
                <span class="text-black dark:text-white font-bold">✓</span>
                <span>بدون تسجيل بيانات شخصية أو كوكيز</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="border-t border-[#EAEAEA] dark:border-[#222222] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#666666] dark:text-[#888888]">
          <div>© 2026 بريد مؤقت. جميع الحقوق محفوظة.</div>
          <div class="flex items-center gap-4">
            <span>TLS 1.3 256-Bit</span>
            <span>•</span>
            <span>Cloudflare Edge</span>
            <span>•</span>
            <span>Zero-Logs Verified</span>
          </div>
        </div>
      </div>
    </footer>`;

const MASTER_ENGLISH_FOOTER = `    <!-- Master English 4-Column Footer — Unified across all pages -->
    <footer class="border-t border-[#EAEAEA] dark:border-[#222222] bg-white dark:bg-[#0A0A0A] py-12 transition-colors mt-auto text-xs">
      <div class="max-w-4xl mx-auto px-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10 text-left">
          <!-- Column 1: Brand & Status -->
          <div>
            <div class="text-base font-bold text-black dark:text-white mb-2">Temp Mail</div>
            <p class="text-[#666666] dark:text-[#888888] leading-relaxed mb-3">
              Free and technically isolated temporary email service protecting your inbox against spam and trackers without any registration.
            </p>
            <div class="inline-flex items-center gap-2 font-mono text-[11px] text-black dark:text-[#A0A0A0] border border-[#EAEAEA] dark:border-[#222222] rounded-md px-2 py-1 bg-[#FAFAFA] dark:bg-[#141414]">
              <span class="w-1.5 h-1.5 rounded-full bg-black dark:bg-[#00FF66]"></span>
              <span>All edge nodes operational</span>
            </div>
          </div>

          <!-- Column 2: Quick Navigation -->
          <div>
            <div class="font-bold text-black dark:text-white mb-3 uppercase tracking-wider text-[11px]">
              Quick Navigation
            </div>
            <ul class="space-y-2">
              <li><a href="/en/" class="text-[#666666] dark:text-[#888888] hover:text-black dark:hover:text-white transition-colors">Home</a></li>
              <li><a href="/en/guide.html" class="text-[#666666] dark:text-[#888888] hover:text-black dark:hover:text-white transition-colors">User Guide</a></li>
              <li><a href="/en/faq.html" class="text-[#666666] dark:text-[#888888] hover:text-black dark:hover:text-white transition-colors">FAQ</a></li>
              <li><a href="/en/articles/index.html" class="text-[#666666] dark:text-[#888888] hover:text-black dark:hover:text-white transition-colors">Articles & Guides</a></li>
            </ul>
          </div>

          <!-- Column 3: Transparency & Legal -->
          <div>
            <div class="font-bold text-black dark:text-white mb-3 uppercase tracking-wider text-[11px]">
              Transparency & Legal
            </div>
            <ul class="space-y-2">
              <li><a href="/en/about.html" class="text-[#666666] dark:text-[#888888] hover:text-black dark:hover:text-white transition-colors">About Us</a></li>
              <li><a href="/en/privacy.html" class="text-[#666666] dark:text-[#888888] hover:text-black dark:hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/en/privacy.html#terms" class="text-[#666666] dark:text-[#888888] hover:text-black dark:hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <!-- Column 4: Security Standards -->
          <div>
            <div class="font-bold text-black dark:text-white mb-3 uppercase tracking-wider text-[11px]">
              Security & Compliance
            </div>
            <ul class="space-y-2 text-[#666666] dark:text-[#888888]">
              <li class="flex items-center gap-1.5">
                <span class="text-black dark:text-white font-bold">✓</span>
                <span>Auto-purge after 20 minutes</span>
              </li>
              <li class="flex items-center gap-1.5">
                <span class="text-black dark:text-white font-bold">✓</span>
                <span>Encrypted O(1) isolation</span>
              </li>
              <li class="flex items-center gap-1.5">
                <span class="text-black dark:text-white font-bold">✓</span>
                <span>Zero personal logs & cookies</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="border-t border-[#EAEAEA] dark:border-[#222222] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#666666] dark:text-[#888888]">
          <div>© 2026 Temp Mail. All rights reserved.</div>
          <div class="flex items-center gap-4">
            <span>TLS 1.3 256-Bit</span>
            <span>•</span>
            <span>Cloudflare Edge</span>
            <span>•</span>
            <span>Zero-Logs Verified</span>
          </div>
        </div>
      </div>
    </footer>`;

const FONT_HEAD_TAGS = `    <!-- Local Fonts and Shared Stylesheet -->
    <link rel="stylesheet" href="/fonts/fonts.css" />
    <link rel="stylesheet" href="/shared/style.css" />`;

function getHtmlFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const results: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.git') {
        results.push(...getHtmlFiles(fullPath));
      }
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      results.push(fullPath);
    }
  }

  return results;
}

export function unifyFile(filePath: string): boolean {
  // Skip React root index.html files where React mounts into #root
  const relPath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
  if (
    relPath === 'index.html' ||
    relPath === 'public/index.html' ||
    relPath === 'ar/index.html' ||
    relPath === 'public/ar/index.html' ||
    relPath === 'en/index.html' ||
    relPath === 'public/en/index.html'
  ) {
    // For React root mount files, ensure font tags in head are pristine
    let content = fs.readFileSync(filePath, 'utf-8');
    let changed = false;
    if (!content.includes('href="/fonts/fonts.css"')) {
      content = content.replace(
        /<\/head>/i,
        `    <link rel="stylesheet" href="/fonts/fonts.css" />\n  </head>`
      );
      changed = true;
    }
    if (!content.includes('/shared/style.css')) {
      content = content.replace(
        /<\/head>/i,
        `${FONT_HEAD_TAGS}\n  </head>`
      );
      changed = true;
    }
    if (changed) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`[Font Fix on SPA Mount] Updated: ${relPath}`);
    }
    return changed;
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;

  const isEnglish = relPath.includes('/en/') || relPath.startsWith('en/');
  const masterFooter = isEnglish ? MASTER_ENGLISH_FOOTER : MASTER_ARABIC_FOOTER;

  // 1. Ensure fonts are loaded in <head>
  if (!content.includes('/shared/style.css') || !content.includes('/fonts/fonts.css')) {
    // Remove individual partial font links if any to prevent duplicates
    content = content.replace(/<link[^>]*fonts\.googleapis\.com[^>]*>\s*/gi, '');
    content = content.replace(/<link[^>]*fonts\.gstatic\.com[^>]*>\s*/gi, '');
    content = content.replace(/<link[^>]*href="[^"]*cairo[^"]*"[^>]*>\s*/gi, '');
    content = content.replace(/<link[^>]*href="[^"]*\/fonts\/fonts\.css"[^>]*>\s*/gi, '');
    content = content.replace(/<link[^>]*href="[^"]*\/shared\/style\.css"[^>]*>\s*/gi, '');

    // Insert canonical FONT_HEAD_TAGS before </head>
    content = content.replace(/<\/head>/i, `${FONT_HEAD_TAGS}\n  </head>`);
  }

  // 2. Ensure font family class on <body>
  const fontClass = isEnglish ? "font-['Inter',sans-serif]" : "font-['Cairo',sans-serif]";
  if (!content.includes(fontClass)) {
    content = content.replace(/<body([^>]*)class="([^"]*)"/i, (match, prefix, cls) => {
      if (cls.includes("font-['Cairo") || cls.includes("font-['Inter")) {
        return match;
      }
      return `<body${prefix}class="${cls} ${fontClass}"`;
    });
  }

  // 3. Replace or inject footer
  if (/<footer[\s\S]*?<\/footer>/i.test(content)) {
    content = content.replace(/<footer[\s\S]*?<\/footer>/i, masterFooter);
  } else {
    // If no footer, insert before </body>
    content = content.replace(/<\/body>/i, `${masterFooter}\n  </body>`);
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✔ [Unified Footer & Fonts] Updated: ${relPath} (${isEnglish ? 'EN' : 'AR'})`);
    return true;
  }

  return false;
}

export function runUnification() {
  const rootDir = process.cwd();
  const allHtmlFiles = getHtmlFiles(rootDir);
  console.log(`🚀 Found ${allHtmlFiles.length} HTML files across the project.`);

  let updatedCount = 0;
  for (const file of allHtmlFiles) {
    if (unifyFile(file)) {
      updatedCount++;
    }
  }

  console.log(`✅ Unification complete: ${updatedCount} files updated with unified footer and persistent fonts.`);
}

if (process.argv[1] && process.argv[1].includes('unify-footer-and-fonts')) {
  runUnification();
}
