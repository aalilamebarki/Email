// scripts/generate-static-articles.cjs
const fs = require('fs');
const path = require('path');

const group1 = require('./articles/group1.cjs');
const group2 = require('./articles/group2.cjs');
const group3 = require('./articles/group3.cjs');
const group4 = require('./articles/group4.cjs');
const group5 = require('./articles/group5.cjs');
const group6 = require('./articles/group6.cjs');
const group7 = require('./articles/group7.cjs');
const group8 = require('./articles/group8.cjs');
const group9 = require('./articles/group9.cjs');

const allArticles = [
  ...group1,
  ...group2,
  ...group3,
  ...group4,
  ...group5,
  ...group6,
  ...group7,
  ...group8,
  ...group9
];

// Normalize article structures across all groups
allArticles.forEach(art => {
  if (!art.metaDesc && art.metaDescription) {
    art.metaDesc = art.metaDescription;
  }
  if (!art.metaDesc) {
    art.metaDesc = {
      ar: art.title.ar,
      en: art.title.en
    };
  }
  if (!art.lead) {
    art.lead = {
      ar: art.metaDesc.ar,
      en: art.metaDesc.en
    };
  }
  if (!art.takeaways) {
    art.takeaways = {
      ar: [
        'حماية كاملة للخصوصية وعزل تام للهوية الرقمية.',
        'استقبال فوري لرموز التحقق وروابط التفعيل في أجزاء من الثانية.',
        'تدمير ذاتي للبيانات في الذاكرة العشوائية لضمان انعدام السجلات.'
      ],
      en: [
        'Complete digital identity isolation and zero-tracking privacy.',
        'Instantaneous sub-second delivery for verification codes and links.',
        'Cryptographic RAM erasure ensuring zero persistent data retention.'
      ]
    };
  }
  if (!art.badge) {
    art.badge = { ar: 'دليل شامل', en: 'Core Guide' };
  }
  if (!art.readTimeMin) {
    art.readTimeMin = 7;
  }
  if (!art.publishedAt) {
    art.publishedAt = art.date || '2026-03-24';
  }
  if (!art.updatedAt) {
    art.updatedAt = '2026-03-24';
  }
  if (!art.faqs && art.faq) {
    art.faqs = art.faq.map(f => ({
      q: f.question,
      a: f.answer
    }));
  }
  if (!art.relatedSlugs || art.relatedSlugs.length === 0) {
    const otherSlugs = allArticles.filter(a => a.slug !== art.slug).map(a => a.slug);
    const idx = allArticles.indexOf(art);
    art.relatedSlugs = [
      otherSlugs[(idx + 1) % otherSlugs.length],
      otherSlugs[(idx + 3) % otherSlugs.length],
      otherSlugs[(idx + 5) % otherSlugs.length]
    ];
  }
});

function getNav(lang, active) {
  if (lang === 'ar') {
    return `
            <a href="/ar/" data-i18n="home" class="${active === 'home' ? 'text-black dark:text-white font-bold' : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'} transition-colors">الرئيسية</a>
            <a href="/ar/blog.html" data-i18n="blog" class="${active === 'blog' ? 'text-black dark:text-white font-bold' : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'} transition-colors">المدونة</a>
            <a href="/ar/articles/index.html" class="${active === 'articles' ? 'text-black dark:text-white font-bold' : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'} transition-colors">المقالات</a>
            <a href="/ar/guide.html" data-i18n="guide" class="${active === 'guide' ? 'text-black dark:text-white font-bold' : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'} transition-colors">دليل الاستخدام</a>
            <a href="/ar/faq.html" data-i18n="faq" class="${active === 'faq' ? 'text-black dark:text-white font-bold' : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'} transition-colors">الأسئلة الشائعة</a>`;
  } else {
    return `
            <a href="/en/" data-i18n="home" class="${active === 'home' ? 'text-black dark:text-white font-bold' : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'} transition-colors">Home</a>
            <a href="/en/blog.html" data-i18n="blog" class="${active === 'blog' ? 'text-black dark:text-white font-bold' : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'} transition-colors">Blog</a>
            <a href="/en/articles/index.html" class="${active === 'articles' ? 'text-black dark:text-white font-bold' : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'} transition-colors">Articles</a>
            <a href="/en/guide.html" data-i18n="guide" class="${active === 'guide' ? 'text-black dark:text-white font-bold' : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'} transition-colors">Guide</a>
            <a href="/en/faq.html" data-i18n="faq" class="${active === 'faq' ? 'text-black dark:text-white font-bold' : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'} transition-colors">FAQ</a>`;
  }
}

function getBreadcrumbs(art, lang) {
  const isAr = lang === 'ar';
  return `
      <!-- Breadcrumbs -->
      <nav class="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-6 font-mono" id="article-breadcrumbs" aria-label="Breadcrumb">
        <a href="/${lang}/" class="hover:text-black dark:hover:text-white transition-colors" data-i18n="artNavHome">${isAr ? 'الرئيسية' : 'Home'}</a>
        <span class="opacity-40">/</span>
        <a href="/${lang}/blog.html" class="hover:text-black dark:hover:text-white transition-colors" data-i18n="artNavBlog">${isAr ? 'المدونة' : 'Blog'}</a>
        <span class="opacity-40">/</span>
        <a href="/${lang}/articles/index.html" class="hover:text-black dark:hover:text-white transition-colors">${isAr ? 'المقالات' : 'Articles'}</a>
        <span class="opacity-40">/</span>
        <span class="text-black dark:text-white font-medium truncate max-w-[220px]">${art.title[lang]}</span>
      </nav>`;
}

function getTableOfContents(art, lang) {
  const isAr = lang === 'ar';
  if (!art.sections || art.sections.length === 0) return '';

  const items = art.sections.map((sec, idx) => `
          <li>
            <a href="#${sec.id}" class="group flex items-start gap-2 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors text-xs sm:text-sm">
              <span class="font-mono text-neutral-400 dark:text-neutral-500 shrink-0 font-medium">${idx + 1}.0</span>
              <span class="group-hover:underline">${sec.title[lang]}</span>
            </a>
          </li>`).join('');

  return `
        <!-- Table of Contents -->
        <div class="mb-10 p-5 bg-neutral-50/80 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-xl">
          <div class="flex items-center justify-between mb-3 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-mono">
            <span class="flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
              <span>${isAr ? 'فهرس المحتويات' : 'Table of Contents'}</span>
            </span>
            <span class="text-[11px] text-neutral-400">${art.sections.length} ${isAr ? 'أقسام' : 'sections'}</span>
          </div>
          <ul class="space-y-2.5">
            ${items}
          </ul>
        </div>`;
}

function getTakeaways(art, lang) {
  const isAr = lang === 'ar';
  if (!art.takeaways || !art.takeaways[lang] || art.takeaways[lang].length === 0) return '';

  const items = art.takeaways[lang].map(t => `
              <li class="flex items-start gap-3">
                <span class="text-black dark:text-white font-bold shrink-0 mt-0.5 text-xs">✓</span>
                <span class="leading-relaxed">${t}</span>
              </li>`).join('');

  return `
        <!-- Key Takeaways Box -->
        <div class="mb-10 p-5 sm:p-6 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm" id="article-takeaways-box">
          <h2 class="text-xs sm:text-sm font-bold text-black dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2 font-mono">
            <svg class="w-4 h-4 text-emerald-500 stroke-current fill-none stroke-[2.5]" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>${isAr ? 'أبرز النقاط والنتائج في هذا الدليل' : 'Key Takeaways & Core Concepts'}</span>
          </h2>
          <ul class="space-y-3 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
            ${items}
          </ul>
        </div>`;
}

// Comprehensive dictionary of diverse contextual keywords and natural anchor phrases for high-authority SEO interlinking
const KEYWORD_LINKS = require('./keyword-rules.cjs');

// Safe Contextual Linker: replaces unlinked keyword occurrences in text blocks
function linkifyKeywords(html, currentSlug, lang, replacedSlugs) {
  const rules = KEYWORD_LINKS[lang] || KEYWORD_LINKS.en;
  let linkedHtml = html;

  // Split html by tags so we only replace in text nodes
  const segments = linkedHtml.split(/(<[^>]+>)/g);
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

    // We are inside a plain text node
    let text = seg;
    for (const rule of rules) {
      if (replacedSlugs.has(rule.slug)) continue;
      if (linksInSection >= 3) break; // keep sections balanced

      for (const term of rule.terms) {
        const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        let regex;
        if (lang === 'ar') {
          // Supports Arabic prefixes (و, ف, ب, ل, ك, ال, بال, فال, وال, كال, لل) and boundary punctuation
          const pattern = `(?:(?<=[\\s،؛:«"'\\[(]|^)(?:و|ف|ب|ل|ك|ال|بال|فال|وال|كال|لل)?)${escapedTerm}(?=[\\s،؛:»"'\\]).!?]|$)`;
          regex = new RegExp(pattern, 'u');
        } else {
          regex = new RegExp(`\\b${escapedTerm}\\b`, 'i');
        }

        if (regex.test(text)) {
          text = text.replace(regex, (match) => {
            replacedSlugs.add(rule.slug);
            linksInSection++;
            return `<a href="/${lang}/articles/${rule.slug}.html" class="text-blue-600 dark:text-blue-400 font-medium underline decoration-blue-300 dark:decoration-blue-700 underline-offset-4 hover:decoration-blue-600 hover:text-blue-800 dark:hover:text-blue-200 transition-colors" title="${match}">${match}</a>`;
          });
          break; // move to next rule once one term matched
        }
      }
    }
    segments[i] = text;
  }

  return segments.join('');
}

// Modern Quick Technical Specs Component (High information density, clean aesthetic)
function getQuickSpecs(art, lang) {
  const isAr = lang === 'ar';
  return `
        <!-- Modern Quick Technical Specs Strip -->
        <div class="my-6 grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-neutral-50 dark:bg-neutral-900/70 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-mono">
          <div class="p-2 bg-white dark:bg-neutral-800/60 rounded-lg border border-neutral-100 dark:border-neutral-800 flex flex-col">
            <span class="text-neutral-400 text-[10px] uppercase">${isAr ? 'بيئة التخزين' : 'Storage Tier'}</span>
            <span class="font-bold text-black dark:text-white truncate">In-Memory RAM</span>
          </div>
          <div class="p-2 bg-white dark:bg-neutral-800/60 rounded-lg border border-neutral-100 dark:border-neutral-800 flex flex-col">
            <span class="text-neutral-400 text-[10px] uppercase">${isAr ? 'بروتوكول النقل' : 'Protocol'}</span>
            <span class="font-bold text-black dark:text-white truncate">TLS 1.3 / RFC 5322</span>
          </div>
          <div class="p-2 bg-white dark:bg-neutral-800/60 rounded-lg border border-neutral-100 dark:border-neutral-800 flex flex-col">
            <span class="text-neutral-400 text-[10px] uppercase">${isAr ? 'زمن المعالجة' : 'Latency'}</span>
            <span class="font-bold text-emerald-600 dark:text-emerald-400">&lt; 500ms Instant</span>
          </div>
          <div class="p-2 bg-white dark:bg-neutral-800/60 rounded-lg border border-neutral-100 dark:border-neutral-800 flex flex-col">
            <span class="text-neutral-400 text-[10px] uppercase">${isAr ? 'سياسة البيانات' : 'Data Policy'}</span>
            <span class="font-bold text-blue-600 dark:text-blue-400">Zero Retention</span>
          </div>
        </div>`;
}

// Contextual Deep-Dive Exploration Card (Smart Hub-and-Spoke Interlinking)
function getDeepDiveCallout(art, lang) {
  const isAr = lang === 'ar';
  const relatedSlugs = art.relatedSlugs || [];
  if (relatedSlugs.length === 0) return '';
  const firstRelated = allArticles.find(a => a.slug === relatedSlugs[0]);
  if (!firstRelated) return '';

  return `
              <div class="my-6 p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div class="flex items-center gap-2.5">
                  <span class="px-2 py-0.5 rounded bg-blue-600 text-white font-mono text-[10px] font-bold shrink-0">DEEP DIVE</span>
                  <div class="text-neutral-700 dark:text-neutral-300">
                    <span class="font-bold text-black dark:text-white">${isAr ? 'استكشاف هندسي متقدم:' : 'Recommended Deep Dive:'}</span>
                    <span class="font-medium text-neutral-600 dark:text-neutral-300">${firstRelated.title[lang]}</span>
                  </div>
                </div>
                <a href="/${lang}/articles/${firstRelated.slug}.html" class="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold hover:underline shrink-0">
                  <span>${isAr ? 'متابعة القراءة' : 'Read Guide'}</span>
                  <span>${isAr ? '←' : '→'}</span>
                </a>
              </div>`;
}

function getSectionsHtml(art, lang) {
  if (!art.sections) return '';
  const replacedSlugs = new Set([art.slug]); // persistent set across all sections of this article
  return art.sections.map((sec, idx) => {
    let calloutHtml = '';
    if (sec.callout && sec.callout.title && sec.callout.text) {
      calloutHtml = `
              <div class="my-6 p-4 sm:p-5 bg-blue-50/50 dark:bg-blue-950/20 border-s-4 border-blue-600 dark:border-blue-400 rounded-e-xl text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 shadow-sm">
                <div class="font-bold mb-1.5 flex items-center gap-2 text-blue-900 dark:text-blue-300">
                  <svg class="w-4 h-4 text-blue-600 dark:text-blue-400 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                  <span>${sec.callout.title[lang]}</span>
                </div>
                <p class="leading-relaxed text-neutral-700 dark:text-neutral-300">${sec.callout.text[lang]}</p>
              </div>`;
    }

    let codeHtml = '';
    if (sec.codeSnippet && sec.codeSnippet.code) {
      const escapedCode = sec.codeSnippet.code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      codeHtml = `
              <div class="my-6 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-[#0d1117] text-left shadow-sm" dir="ltr">
                <div class="bg-[#161b22] px-4 py-2.5 flex items-center justify-between border-b border-neutral-800 text-[11px] text-neutral-400 font-mono">
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                    <span class="text-neutral-300 font-medium">${sec.codeSnippet.filename}</span>
                  </div>
                  <button type="button" class="copy-code-btn hover:text-white text-neutral-400 transition-colors flex items-center gap-1.5 text-[11px] font-mono cursor-pointer px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700" onclick="navigator.clipboard.writeText(this.closest('.rounded-xl').querySelector('code').innerText); this.querySelector('span').textContent='Copied!'; setTimeout(()=>this.querySelector('span').textContent='Copy', 1500);">
                    <svg class="w-3 h-3 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    <span>Copy</span>
                  </button>
                </div>
                <pre class="p-4 text-xs font-mono text-neutral-200 overflow-x-auto leading-relaxed"><code>${escapedCode}</code></pre>
              </div>`;
    }

    const linkedContent = linkifyKeywords(sec.content[lang], art.slug, lang, replacedSlugs);

    return `
          <section class="mb-10 pt-2" id="${sec.id}">
            <h2 class="text-xl sm:text-2xl font-bold text-black dark:text-white mb-4 leading-snug flex items-baseline gap-2.5">
              <span class="font-mono text-xs sm:text-sm px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-semibold shrink-0">${idx + 1}.0</span>
              <span>${sec.title[lang]}</span>
            </h2>
            <div class="text-[15px] sm:text-[16px] text-neutral-700 dark:text-neutral-300 leading-[1.9] space-y-4">
              ${linkedContent}
            </div>
            ${calloutHtml}
            ${codeHtml}
          </section>`;
  }).join('');
}

function getTableHtml(art, lang) {
  if (!art.comparisonTable) return '';
  const isAr = lang === 'ar';
  const table = art.comparisonTable;
  const rows = table.rows.map((r, i) => `
                  <tr class="${i % 2 === 1 ? 'bg-neutral-50/50 dark:bg-neutral-900/40' : ''}">
                    <td class="p-3.5 sm:p-4 font-semibold text-black dark:text-white">${r.feature[lang]}</td>
                    <td class="p-3.5 sm:p-4 text-neutral-500">${r.legacy[lang]}</td>
                    <td class="p-3.5 sm:p-4 font-semibold text-emerald-600 dark:text-emerald-400">${r.advanced[lang]}</td>
                  </tr>`).join('');

  return `
        <!-- Comparison Table -->
        <section class="mb-10" id="comparison-table-section">
          <h2 class="text-xl sm:text-2xl font-bold text-black dark:text-white mb-4">
            ${table.title[lang]}
          </h2>
          <div class="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121212]">
            <table class="w-full text-xs sm:text-sm ${isAr ? 'text-right' : 'text-left'}">
              <thead class="bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white font-bold border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th class="p-3.5 sm:p-4">${table.headers[0][lang]}</th>
                  <th class="p-3.5 sm:p-4 text-neutral-500">${table.headers[1][lang]}</th>
                  <th class="p-3.5 sm:p-4 text-black dark:text-white">${table.headers[2][lang]}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-neutral-200 dark:divide-neutral-800">
                ${rows}
              </tbody>
            </table>
          </div>
        </section>`;
}

function getSourcesHtml(art, lang) {
  const isAr = lang === 'ar';
  if (!art.sources || art.sources.length === 0) return '';
  const list = art.sources.map(s => `
            <li class="flex items-center gap-2">
              <span class="text-neutral-400">•</span>
              <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="hover:underline text-black dark:text-white font-medium flex items-center gap-1.5">
                <span>${s.title}</span>
                <svg class="w-3 h-3 opacity-60 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </a>
            </li>`).join('');

  return `
        <!-- Verified Sources & Citations -->
        <section class="mb-10 p-5 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl" id="article-sources-section">
          <h3 class="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3 flex items-center gap-1.5 font-mono">
            <svg class="w-3.5 h-3.5 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            <span>${isAr ? 'المراجع والمعايير القياسية المعتمدة' : 'Verified Standards & Citations'}</span>
          </h3>
          <ul class="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
            ${list}
          </ul>
        </section>`;
}

function getFaqsHtml(art, lang) {
  const isAr = lang === 'ar';
  if (!art.faqs || art.faqs.length === 0) return '';
  const items = art.faqs.map(faq => `
            <div class="faq-item rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121212] overflow-hidden">
              <button
                type="button"
                class="faq-toggle w-full p-4 ${isAr ? 'text-right' : 'text-left'} font-semibold text-sm sm:text-base text-black dark:text-white flex items-center justify-between gap-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                aria-expanded="true"
              >
                <span>${faq.q[lang]}</span>
                <svg class="faq-chevron w-4 h-4 stroke-current fill-none stroke-[2] text-neutral-400 transition-transform duration-200 rotate-180" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              <div class="faq-content p-4 pt-0 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-neutral-800/60 ">
                <p class="mt-3">${faq.a[lang]}</p>
              </div>
            </div>`).join('');

  return `
        <!-- FAQ Accordion -->
        <section class="mb-12 pt-6 border-t border-neutral-200 dark:border-neutral-800" id="article-faqs-section">
          <h2 class="text-xl sm:text-2xl font-bold text-black dark:text-white mb-6">
            ${isAr ? 'الأسئلة الشائعة والأمان' : 'Frequently Asked Questions'}
          </h2>
          <div class="space-y-3">
            ${items}
          </div>
        </section>`;
}

function getPaginationHtml(art, lang) {
  const isAr = lang === 'ar';
  const currentIndex = allArticles.findIndex(a => a.slug === art.slug);
  const prevArt = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextArt = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

  if (!prevArt && !nextArt) return '';

  return `
        <!-- Previous & Next Article Navigation (Google Tech Blog Style) -->
        <nav class="my-10 pt-6 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono" aria-label="Articles Navigation">
          ${prevArt ? `
            <a href="/${lang}/articles/${prevArt.slug}.html" class="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white bg-neutral-50/50 dark:bg-neutral-900/40 transition-all flex flex-col group text-start">
              <span class="text-neutral-400 dark:text-neutral-500 mb-1 flex items-center gap-1 font-semibold">
                <span>${isAr ? '→ المقال السابق' : '← Previous Guide'}</span>
              </span>
              <span class="font-bold text-sm text-black dark:text-white group-hover:underline line-clamp-1 font-sans">${prevArt.title[lang]}</span>
            </a>` : `<div class="hidden sm:block"></div>`}
          ${nextArt ? `
            <a href="/${lang}/articles/${nextArt.slug}.html" class="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white bg-neutral-50/50 dark:bg-neutral-900/40 transition-all flex flex-col group ${isAr ? 'sm:text-left text-start' : 'sm:text-right text-start'}">
              <span class="text-neutral-400 dark:text-neutral-500 mb-1 flex items-center ${isAr ? 'sm:justify-start justify-start' : 'sm:justify-end justify-start'} gap-1 font-semibold">
                <span>${isAr ? 'المقال التالي ←' : 'Next Guide →'}</span>
              </span>
              <span class="font-bold text-sm text-black dark:text-white group-hover:underline line-clamp-1 font-sans">${nextArt.title[lang]}</span>
            </a>` : `<div class="hidden sm:block"></div>`}
        </nav>`;
}

function getRelatedHtml(art, lang) {
  const isAr = lang === 'ar';
  const relatedList = (art.relatedSlugs || []).map(rSlug => allArticles.find(a => a.slug === rSlug)).filter(Boolean);
  if (relatedList.length === 0) return '';

  const cards = relatedList.map(r => `
              <article class="p-4 bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-black dark:hover:border-white transition-all flex flex-col justify-between shadow-sm">
                <div>
                  <span class="text-[10px] font-mono uppercase px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-neutral-600 dark:text-neutral-400 font-bold mb-2 inline-block">
                    ${r.category[lang]}
                  </span>
                  <h3 class="font-bold text-sm text-black dark:text-white mb-1.5 line-clamp-2">
                    <a href="/${lang}/articles/${r.slug}.html" class="hover:underline">
                      ${r.title[lang]}
                    </a>
                  </h3>
                  <p class="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4 line-clamp-2">
                    ${r.metaDesc[lang]}
                  </p>
                </div>
                <a href="/${lang}/articles/${r.slug}.html" class="text-xs font-bold text-black dark:text-white hover:underline flex items-center gap-1 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <span>${isAr ? 'قراءة الدليل' : 'Read Guide'}</span>
                  <span>${isAr ? '←' : '→'}</span>
                </a>
              </article>`).join('');

  return `
        <!-- Related Articles -->
        <section class="mb-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg sm:text-xl font-bold text-black dark:text-white">
              ${isAr ? 'أدلة ومقالات هندسية ذات صلة' : 'Related Architecture Guides'}
            </h2>
            <a href="/${lang}/articles/index.html" class="text-xs font-bold text-neutral-500 hover:text-black dark:hover:text-white flex items-center gap-1">
              <span>${isAr ? 'عرض كافة المقالات' : 'View All Articles'}</span>
              <span>${isAr ? '←' : '→'}</span>
            </a>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            ${cards}
          </div>
        </section>`;
}

function renderFullHtml(art, lang) {
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const langLabel = isAr ? 'العربية' : 'English';
  const fontClass = isAr ? "font-['Cairo',sans-serif]" : "font-sans";

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
    <title>${art.title[lang]} — FreeTemp.email</title>
    <meta name="description" content="${art.metaDesc[lang]}" id="meta-description" />
    <meta name="keywords" content="${art.keywords && art.keywords[lang] ? art.keywords[lang] : ''}" />
    <link rel="canonical" href="https://freetemp.email/${lang}/articles/${art.slug}.html" />

    <!-- Multilingual Alternates -->
    <link rel="alternate" hreflang="ar" href="https://freetemp.email/ar/articles/${art.slug}.html" />
    <link rel="alternate" hreflang="en" href="https://freetemp.email/en/articles/${art.slug}.html" />
    <link rel="alternate" hreflang="es" href="https://freetemp.email/en/articles/${art.slug}.html" />
    <link rel="alternate" hreflang="fr" href="https://freetemp.email/en/articles/${art.slug}.html" />
    <link rel="alternate" hreflang="de" href="https://freetemp.email/en/articles/${art.slug}.html" />
    <link rel="alternate" hreflang="pt" href="https://freetemp.email/en/articles/${art.slug}.html" />
    <link rel="alternate" hreflang="it" href="https://freetemp.email/en/articles/${art.slug}.html" />
    <link rel="alternate" hreflang="ru" href="https://freetemp.email/en/articles/${art.slug}.html" />
    <link rel="alternate" hreflang="tr" href="https://freetemp.email/en/articles/${art.slug}.html" />
    <link rel="alternate" hreflang="zh" href="https://freetemp.email/en/articles/${art.slug}.html" />
    <link rel="alternate" hreflang="ja" href="https://freetemp.email/en/articles/${art.slug}.html" />
    <link rel="alternate" hreflang="ko" href="https://freetemp.email/en/articles/${art.slug}.html" />
    <link rel="alternate" hreflang="nl" href="https://freetemp.email/en/articles/${art.slug}.html" />
    <link rel="alternate" hreflang="pl" href="https://freetemp.email/en/articles/${art.slug}.html" />
    <link rel="alternate" hreflang="id" href="https://freetemp.email/en/articles/${art.slug}.html" />
    <link rel="alternate" hreflang="vi" href="https://freetemp.email/en/articles/${art.slug}.html" />
    <link rel="alternate" hreflang="hi" href="https://freetemp.email/en/articles/${art.slug}.html" />
    <link rel="alternate" hreflang="fa" href="https://freetemp.email/ar/articles/${art.slug}.html" />
    <link rel="alternate" hreflang="ur" href="https://freetemp.email/ar/articles/${art.slug}.html" />
    <link rel="alternate" hreflang="uk" href="https://freetemp.email/en/articles/${art.slug}.html" />
    <link rel="alternate" hreflang="sv" href="https://freetemp.email/en/articles/${art.slug}.html" />
    <link rel="alternate" hreflang="el" href="https://freetemp.email/en/articles/${art.slug}.html" />
    <link rel="alternate" hreflang="x-default" href="https://freetemp.email/en/articles/${art.slug}.html" />

    <!-- Open Graph -->
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="FreeTemp.email" />
    <meta property="og:title" content="${art.title[lang]} — FreeTemp.email" />
    <meta property="og:description" content="${art.metaDesc[lang]}" />
    <meta property="og:url" content="https://freetemp.email/${lang}/articles/${art.slug}.html" />
    <meta property="og:image" content="https://freetemp.email/og-image.png" />
    <meta property="article:published_time" content="${art.publishedAt}T00:00:00Z" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${art.title[lang]} — FreeTemp.email" />
    <meta name="twitter:description" content="${art.metaDesc[lang]}" />
    <meta name="twitter:image" content="https://freetemp.email/og-image.png" />

    <meta name="theme-color" content="#ffffff" id="meta-theme-color" />
    <link rel="icon" type="image/svg+xml" href="/logo.svg" />
    <link rel="apple-touch-icon" href="/logo.svg" />

    <!-- Stylesheets & Fonts -->
    <link rel="stylesheet" href="/fonts/fonts.css" />
    <link rel="stylesheet" href="/shared/style.css" />

    <!-- Structured Data (JSON-LD) -->
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": "${art.title[lang].replace(/"/g, '\\"')}",
        "description": "${art.metaDesc[lang].replace(/"/g, '\\"')}",
        "inLanguage": "${lang}",
        "author": {
          "@type": "Organization",
          "name": "FreeTemp.email Security Engineering Team",
          "url": "https://freetemp.email"
        },
        "publisher": {
          "@type": "Organization",
          "name": "FreeTemp.email",
          "logo": {
            "@type": "ImageObject",
            "url": "https://freetemp.email/logo.svg"
          }
        },
        "datePublished": "${art.publishedAt}",
        "dateModified": "${art.publishedAt}",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://freetemp.email/${lang}/articles/${art.slug}.html"
        }
      }
    </script>

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
    <!-- Reading Progress Bar -->
    <div
      id="reading-progress"
      class="fixed top-0 left-0 right-0 h-[2px] bg-black dark:bg-white z-50 origin-left scale-x-0 transition-transform duration-75 pointer-events-none"
    ></div>

    <!-- Master Header -->
    <header class="border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-[#0D0D0D]/95 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div class="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div class="flex items-center gap-6">
          <a href="/${lang}/" class="text-lg sm:text-xl font-bold tracking-tight text-black dark:text-white hover:opacity-90 transition-opacity flex items-center gap-2.5">
            <span class="w-7 h-7 rounded-lg bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-xs font-mono font-extrabold shadow-sm shrink-0">
              <svg class="w-4 h-4 fill-none stroke-current" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
            </span>
            <span class="flex items-center gap-1 font-sans">
              <span class="font-extrabold tracking-tight">FreeTemp</span><span class="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">.email</span>
            </span>
            <span class="hidden md:inline-flex items-center text-xs text-neutral-400 dark:text-neutral-500 font-normal mr-1">
              <span class="mx-1.5 opacity-40">|</span>
              <span data-i18n="brand">${isAr ? "بريد مؤقت" : "Temp Mail"}</span>
            </span>
          </a>

          <nav class="hidden md:flex items-center gap-4 text-xs font-medium">
            ${getNav(lang, 'articles')}
          </nav>
        </div>

        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Language Selector Button (22 Languages) -->
          <button
            type="button"
            id="open-lang-picker"
            class="open-lang-picker min-h-[38px] px-3 py-1.5 bg-white hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 hover:border-black dark:border-neutral-800 dark:hover:border-neutral-600 rounded-lg text-xs font-semibold text-black dark:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            aria-label="Change Language"
          >
            <svg class="w-3.5 h-3.5 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            <span id="current-lang-label">${langLabel}</span>
            <svg class="w-3 h-3 stroke-current fill-none stroke-[2] opacity-60" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>

          <!-- Dark/Light Theme Toggle Button -->
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

    <!-- Main Content Container -->
    <main class="flex-1 max-w-3xl w-full mx-auto px-4 py-8 sm:py-12">
      ${getBreadcrumbs(art, lang)}

      <article>
        <!-- Header & Meta Area (Google Blog / Security Engineering Style) -->
        <header class="mb-10 pb-8 border-b border-neutral-200 dark:border-neutral-800">
          <div class="flex items-center gap-2 mb-4">
            <span class="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase tracking-wide bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
              ${art.category[lang]}
            </span>
            <span class="text-xs text-neutral-400 font-mono">•</span>
            <span class="text-xs text-neutral-500 dark:text-neutral-400 font-mono">${art.badge[lang]}</span>
          </div>

          <h1 class="text-2xl sm:text-3xl lg:text-[2.35rem] font-extrabold text-black dark:text-white mb-5 leading-tight tracking-tight">
            ${art.title[lang]}
          </h1>

          <!-- Author Byline & Meta Info -->
          <div class="flex flex-wrap items-center justify-between gap-4 py-3.5 px-4 bg-neutral-50 dark:bg-neutral-900/60 rounded-xl border border-neutral-200 dark:border-neutral-800 mb-6">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
                TM
              </div>
              <div>
                <div class="font-bold text-xs sm:text-sm text-black dark:text-white flex items-center gap-1.5">
                  <span>${isAr ? 'فريق أبحاث الأمان والشبكات' : 'Security & Architecture Team'}</span>
                  <svg class="w-3.5 h-3.5 text-blue-500 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                </div>
                <div class="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">FreeTemp Engineering Group</div>
              </div>
            </div>

            <div class="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
              <div class="flex items-center gap-1">
                <svg class="w-3.5 h-3.5 text-neutral-400 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <span>${art.readTimeMin} ${isAr ? 'دقائق قراءة' : 'min read'}</span>
              </div>
              <span>•</span>
              <time datetime="${art.publishedAt}">${art.publishedAt}</time>
            </div>
          </div>

          <!-- Share Toolbar -->
          <div class="flex items-center justify-between py-2.5 border-y border-neutral-100 dark:border-neutral-800/80 mb-6 text-xs text-neutral-600 dark:text-neutral-400">
            <span class="font-mono text-[11px] font-medium">${isAr ? 'مشاركة هذا الدليل:' : 'Share this guide:'}</span>
            <div class="flex items-center gap-2">
              <!-- Copy Link -->
              <button
                type="button"
                onclick="navigator.clipboard.writeText(window.location.href); const label = this.querySelector('span'); label.textContent='${isAr ? 'تم النسخ ✓' : 'Copied ✓'}'; setTimeout(() => label.textContent='${isAr ? 'نسخ الرابط' : 'Copy Link'}', 1800);"
                class="px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-black dark:text-white transition-colors cursor-pointer flex items-center gap-1.5 font-mono text-[11px]"
                title="${isAr ? 'نسخ الرابط' : 'Copy Link'}"
              >
                <svg class="w-3.5 h-3.5 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                <span>${isAr ? 'نسخ الرابط' : 'Copy Link'}</span>
              </button>

              <!-- Twitter / X -->
              <a
                href="https://twitter.com/intent/tweet?text=${encodeURIComponent(art.title[lang])}&url=${encodeURIComponent('https://freetemp.email/' + lang + '/articles/' + art.slug + '.html')}"
                target="_blank"
                rel="noopener noreferrer"
                class="p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
                title="Share on X"
              >
                <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>

              <!-- LinkedIn -->
              <a
                href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://freetemp.email/' + lang + '/articles/' + art.slug + '.html')}"
                target="_blank"
                rel="noopener noreferrer"
                class="p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
                title="Share on LinkedIn"
              >
                <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
              </a>

              <!-- WhatsApp -->
              <a
                href="https://api.whatsapp.com/send?text=${encodeURIComponent(art.title[lang] + ' ' + 'https://freetemp.email/' + lang + '/articles/' + art.slug + '.html')}"
                target="_blank"
                rel="noopener noreferrer"
                class="p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
                title="Share on WhatsApp"
              >
                <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.32C9.36 7.32 9.09 7.38 8.87 7.63C8.65 7.87 8.03 8.45 8.03 9.63C8.03 10.81 8.89 11.95 9.01 12.11C9.13 12.28 10.7 14.7 13.1 15.74C13.68 15.98 14.12 16.13 14.48 16.24C15.05 16.43 15.58 16.4 16 16.34C16.46 16.27 17.42 15.76 17.62 15.2C17.82 14.63 17.82 14.15 17.76 14.05C17.7 13.95 17.54 13.89 17.3 13.78C17.06 13.66 15.86 13.07 15.64 12.99C15.42 12.9 15.25 12.86 15.09 13.11C14.93 13.35 14.46 13.89 14.32 14.05C14.18 14.21 14.04 14.24 13.8 14.12C13.56 14 12.56 13.67 11.37 12.61C10.45 11.79 9.83 10.77 9.65 10.47C9.47 10.17 9.63 10.01 9.75 9.89C9.86 9.78 10 9.59 10.12 9.45C10.24 9.31 10.28 9.21 10.36 9.05C10.44 8.89 10.4 8.75 10.34 8.63C10.28 8.5 9.8 7.34 9.53 7.32Z"/></svg>
              </a>
            </div>
          </div>

          <p class="text-base sm:text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed font-normal">
            ${art.lead[lang]}
          </p>

          <!-- Modern Quick Specs Indicator Strip -->
          ${getQuickSpecs(art, lang)}
        </header>

        <!-- Table of Contents -->
        ${getTableOfContents(art, lang)}

        <!-- Key Takeaways -->
        ${getTakeaways(art, lang)}

        <!-- Body Sections -->
        <div id="article-sections-container">
          ${getSectionsHtml(art, lang)}
        </div>

        <!-- In-Content Contextual Deep Dive Box -->
        ${getDeepDiveCallout(art, lang)}

        <!-- Comparison Table (if present) -->
        ${getTableHtml(art, lang)}

        <!-- Verified Standards & Sources -->
        ${getSourcesHtml(art, lang)}

        <!-- FAQs -->
        ${getFaqsHtml(art, lang)}

        <!-- Prev & Next Pagination -->
        ${getPaginationHtml(art, lang)}

        <!-- Related Technical Guides -->
        ${getRelatedHtml(art, lang)}

        <!-- Bottom Simple CTA -->
        <div class="p-6 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-center mb-12 shadow-sm">
          <h3 class="text-base font-bold text-black dark:text-white mb-2" data-i18n="blogCtaTitle">
            ${isAr ? 'جاهز لتجربة البريد المؤقت؟' : 'Ready to use Disposable Temp Mail?'}
          </h3>
          <p class="text-xs text-neutral-600 dark:text-neutral-400 mb-4 max-w-md mx-auto" data-i18n="blogCtaDesc">
            ${isAr ? 'احصل على عنوان بريد مؤقت معزول واستقبل كود التحقق في ثوانٍ وبدون تسجيل.' : 'Get a fresh volatile temporary inbox and receive OTP codes instantly without signup.'}
          </p>
          <a
            href="/${lang}/"
            class="inline-block px-5 py-2.5 bg-black text-white dark:bg-white dark:text-black rounded-lg text-xs font-bold hover:opacity-90 transition-opacity"
            data-i18n="goToInbox"
          >
            ${isAr ? 'الانتقال إلى صندوق البريد ←' : 'Go to Temporary Inbox →'}
          </a>
        </div>
      </article>
    </main>

    <!-- Master Footer -->
    <footer class="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0D0D0D] py-12 text-xs transition-colors">
      <div class="max-w-4xl mx-auto px-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div class="sm:col-span-2 md:col-span-1">
            <div class="flex items-center gap-2 mb-3">
              <span class="w-6 h-6 rounded bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-xs font-mono font-extrabold shadow-sm">FT</span>
              <span class="font-extrabold tracking-tight text-sm text-black dark:text-white font-sans">FreeTemp<span class="text-[10px] font-mono font-bold px-1 py-0.5 ml-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">.email</span></span>
            </div>
            <p class="text-neutral-500 leading-relaxed text-[11px] mb-4">
              ${isAr ? 'منصة بريد مؤقت سريعة وفورية توفر حماية استباقية للخصوصية واستخراجاً ذكياً لأكواد التحقق.' : 'Fast, secure ephemeral email service for instant verification codes and spam-free privacy.'}
            </p>
            <div class="flex items-center gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <span class="text-[10px] text-neutral-500 font-mono">100% In-Memory RAM Engine</span>
            </div>
          </div>

          <div>
            <div class="font-bold text-black dark:text-white mb-3 uppercase tracking-wider text-[11px]">
              ${isAr ? 'التنقل' : 'Navigation'}
            </div>
            <ul class="space-y-2">
              <li><a href="/${lang}/" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${isAr ? 'الرئيسية' : 'Home'}</a></li>
              <li><a href="/${lang}/blog.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${isAr ? 'المدونة' : 'Blog'}</a></li>
              <li><a href="/${lang}/guide.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${isAr ? 'دليل الاستخدام' : 'Guide'}</a></li>
              <li><a href="/${lang}/faq.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${isAr ? 'الأسئلة الشائعة' : 'FAQ'}</a></li>
              <li><a href="/${lang}/articles/index.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${isAr ? 'المقالات' : 'Articles'}</a></li>
            </ul>
          </div>

          <div>
            <div class="font-bold text-black dark:text-white mb-3 uppercase tracking-wider text-[11px]">
              ${isAr ? 'الشفافية والأمان' : 'Transparency'}
            </div>
            <ul class="space-y-2">
              <li><a href="/${lang}/about.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${isAr ? 'من نحن' : 'About'}</a></li>
              <li><a href="/${lang}/privacy.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}</a></li>
              <li><a href="/${lang}/privacy.html#terms" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${isAr ? 'شروط الاستخدام' : 'Terms'}</a></li>
            </ul>
          </div>

          <div>
            <div class="font-bold text-black dark:text-white mb-3 uppercase tracking-wider text-[11px]">
              ${isAr ? 'معايير الأمان' : 'Security Standards'}
            </div>
            <ul class="space-y-2 text-neutral-600 dark:text-neutral-400">
              <li class="flex items-center gap-1.5"><span class="text-black dark:text-white font-bold">✓</span><span>${isAr ? 'إتلاف تلقائي بعد 20 دقيقة' : 'Auto-purge after 20 mins'}</span></li>
              <li class="flex items-center gap-1.5"><span class="text-black dark:text-white font-bold">✓</span><span>${isAr ? 'صفر سجلات تتبع' : 'Zero activity tracking'}</span></li>
              <li class="flex items-center gap-1.5"><span class="text-black dark:text-white font-bold">✓</span><span>${isAr ? 'عزل تام للذاكرة العشوائية' : 'Volatile RAM isolation'}</span></li>
              <li class="flex items-center gap-1.5"><span class="text-black dark:text-white font-bold">✓</span><span>${isAr ? 'تشفير كامل للاتصال TLS' : 'TLS 1.3 Transport Security'}</span></li>
            </ul>
          </div>
        </div>

        <div class="pt-8 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>© 2026 FreeTemp.email. All rights reserved.</p>
          <div class="flex items-center gap-4">
            <a href="/${lang}/articles/index.html" class="hover:underline">${isAr ? 'فهرس المقالات' : 'Articles Index'}</a>
            <span>•</span>
            <a href="/${lang}/privacy.html" class="hover:underline">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>

    <!-- Interactive Scripts: Reading Progress & Accordion -->
    <script>
      document.addEventListener('DOMContentLoaded', function () {
        // 1. Reading Progress Bar
        var progressBar = document.getElementById('reading-progress');
        if (progressBar) {
          window.addEventListener('scroll', function () {
            var totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (totalHeight > 0) {
              var progress = window.scrollY / totalHeight;
              progressBar.style.transform = 'scaleX(' + Math.min(Math.max(progress, 0), 1) + ')';
            }
          }, { passive: true });
        }

        // 2. Accordion Toggle
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
      });
    </script>
  </body>
</html>`;
}

function renderArticlesIndexHtml(lang) {
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const langLabel = isAr ? 'العربية' : 'English';
  const fontClass = isAr ? "font-['Cairo',sans-serif]" : "font-sans";

  // Gather unique categories
  const categories = Array.from(new Set(allArticles.map(a => a.category[lang]))).filter(Boolean);

  const pillsHtml = `
          <button
            type="button"
            data-cat="all"
            class="cat-pill px-3 py-1 rounded text-xs font-bold bg-black text-white dark:bg-white dark:text-black cursor-pointer shadow-sm"
          >
            ${isAr ? 'الكل' : 'All'} (${allArticles.length})
          </button>
          ` + categories.map(cat => `
          <button
            type="button"
            data-cat="${cat}"
            class="cat-pill px-3 py-1 rounded text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            ${cat}
          </button>`).join('');

  const cardsHtml = allArticles.map((art, idx) => `
        <!-- Article Card ${idx + 1}: ${art.slug} -->
        <article
          class="article-card p-5 sm:p-6 bg-white dark:bg-[#121212] border border-neutral-300 dark:border-neutral-800 rounded-xl shadow-sm hover:border-neutral-400 dark:hover:border-neutral-600 transition-all flex flex-col justify-between"
          data-title="${art.title[lang].toLowerCase().replace(/"/g, '')}"
          data-desc="${art.metaDesc[lang].toLowerCase().replace(/"/g, '')}"
          data-category="${art.category[lang]}"
        >
          <div>
            <div class="flex items-center gap-2 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mb-2.5">
              <span class="font-bold text-black dark:text-white px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-[10px] uppercase">${art.category[lang]}</span>
              <span>•</span>
              <time datetime="${art.publishedAt}">${art.publishedAt}</time>
            </div>
            <h2 class="text-base font-bold text-black dark:text-white mb-2 leading-snug">
              <a href="/${lang}/articles/${art.slug}.html" class="hover:underline">
                ${art.title[lang]}
              </a>
            </h2>
            <p class="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
              ${art.metaDesc[lang]}
            </p>
          </div>
          <div class="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs">
            <span class="text-neutral-500 font-mono text-[11px]">${art.readTimeMin} ${isAr ? 'دقائق قراءة' : 'mins read'}</span>
            <a href="/${lang}/articles/${art.slug}.html" class="font-bold text-black dark:text-white hover:underline flex items-center gap-1">
              <span>${isAr ? 'قراءة المقال' : 'Read Guide'}</span>
              <span>${isAr ? '←' : '→'}</span>
            </a>
          </div>
        </article>`).join('');

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
    <title>${isAr ? 'فهرس ودليل المقالات التقنية (22 دليلاً) — FreeTemp.email' : 'Technical Articles Index (22 Guides) — FreeTemp.email'}</title>
    <meta name="description" content="${isAr ? 'فهرس المقالات التقنية للبريد المؤقت: 22 مقالاً يغطي التغطية الشاملة لرسائل التحقق، البث الحي، معايير SPF/DKIM، واختبارات البرمجيات.' : 'Comprehensive index of 22 technical articles covering OTP parsing, WebSocket live streaming, email protocols, and privacy architecture.'}" />
    <link rel="canonical" href="https://freetemp.email/${lang}/articles/index.html" />

    <!-- Multilingual Alternates -->
    <link rel="alternate" hreflang="ar" href="https://freetemp.email/ar/articles/index.html" />
    <link rel="alternate" hreflang="en" href="https://freetemp.email/en/articles/index.html" />
    <link rel="alternate" hreflang="x-default" href="https://freetemp.email/en/articles/index.html" />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="FreeTemp.email" />
    <meta property="og:title" content="${isAr ? 'فهرس ودليل المقالات التقنية (22 دليلاً) — FreeTemp.email' : 'Technical Articles Index (22 Guides) — FreeTemp.email'}" />
    <meta property="og:description" content="${isAr ? 'استكشف 22 مقالاً معمارياً وتقنياً يشرح كافة ميزات البريد المؤقت والخصوصية الرقمية.' : 'Explore 22 technical architecture articles explaining temp mail features, OTP heuristics, and privacy.'}" />
    <meta property="og:url" content="https://freetemp.email/${lang}/articles/index.html" />
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
  <body class="min-h-screen bg-white text-black dark:bg-[#0D0D0D] dark:text-[#F5F5F5] flex flex-col transition-colors duration-200 ${fontClass}">
    <!-- Master Header -->
    <header class="border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-[#0D0D0D]/95 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div class="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div class="flex items-center gap-6">
          <a href="/${lang}/" class="text-lg sm:text-xl font-bold tracking-tight text-black dark:text-white hover:opacity-90 transition-opacity flex items-center gap-2.5">
            <span class="w-7 h-7 rounded-lg bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-xs font-mono font-extrabold shadow-sm shrink-0">
              <svg class="w-4 h-4 fill-none stroke-current" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
            </span>
            <span class="flex items-center gap-1 font-sans">
              <span class="font-extrabold tracking-tight">FreeTemp</span><span class="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">.email</span>
            </span>
            <span class="hidden md:inline-flex items-center text-xs text-neutral-400 dark:text-neutral-500 font-normal mr-1">
              <span class="mx-1.5 opacity-40">|</span>
              <span data-i18n="brand">${isAr ? "بريد مؤقت" : "Temp Mail"}</span>
            </span>
          </a>

          <nav class="hidden md:flex items-center gap-4 text-xs font-medium">
            ${getNav(lang, 'articles')}
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
            <span id="current-lang-label">${langLabel}</span>
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
          ${isAr ? 'فهرس المقالات والأدلة التقنية' : 'Technical Guides & Architecture Index'}
        </h1>
        <p class="text-sm text-neutral-600 dark:text-neutral-400">
          ${isAr ? `دليل شامل يضم ${allArticles.length} مقالاً هندسياً يغطي كافة الميزات والمعايير التقنية للبريد المؤقت` : `Comprehensive knowledge base of ${allArticles.length} architecture guides on ephemeral inboxes and security.`}
        </p>
      </div>

      <!-- Search & Filters -->
      <div class="mb-8 space-y-3">
        <input
          id="article-search-input"
          type="text"
          placeholder="${isAr ? 'ابحث في المقالات...' : 'Search articles and guides...'}"
          class="w-full h-10 px-3 bg-white dark:bg-[#121212] border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs text-black dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
        />

        <div class="flex flex-wrap gap-1.5" id="category-pills">
          ${pillsHtml}
        </div>
      </div>

      <!-- Grid -->
      <div id="articles-grid" class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
        ${cardsHtml}
      </div>
    </main>

    <!-- Master Footer -->
    <footer class="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0D0D0D] py-12 text-xs transition-colors">
      <div class="max-w-4xl mx-auto px-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div class="sm:col-span-2 md:col-span-1">
            <div class="flex items-center gap-2 mb-3">
              <span class="w-6 h-6 rounded bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-xs font-mono font-extrabold shadow-sm">FT</span>
              <span class="font-extrabold tracking-tight text-sm text-black dark:text-white font-sans">FreeTemp<span class="text-[10px] font-mono font-bold px-1 py-0.5 ml-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">.email</span></span>
            </div>
            <p class="text-neutral-500 leading-relaxed text-[11px] mb-4">
              ${isAr ? 'منصة بريد مؤقت سريعة وفورية توفر حماية استباقية للخصوصية واستخراجاً ذكياً لأكواد التحقق.' : 'Fast, secure ephemeral email service for instant verification codes and spam-free privacy.'}
            </p>
          </div>

          <div>
            <div class="font-bold text-black dark:text-white mb-3 uppercase tracking-wider text-[11px]">
              ${isAr ? 'التنقل' : 'Navigation'}
            </div>
            <ul class="space-y-2">
              <li><a href="/${lang}/" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${isAr ? 'الرئيسية' : 'Home'}</a></li>
              <li><a href="/${lang}/blog.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${isAr ? 'المدونة' : 'Blog'}</a></li>
              <li><a href="/${lang}/guide.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${isAr ? 'دليل الاستخدام' : 'Guide'}</a></li>
              <li><a href="/${lang}/faq.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${isAr ? 'الأسئلة الشائعة' : 'FAQ'}</a></li>
              <li><a href="/${lang}/articles/index.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${isAr ? 'المقالات' : 'Articles'}</a></li>
            </ul>
          </div>

          <div>
            <div class="font-bold text-black dark:text-white mb-3 uppercase tracking-wider text-[11px]">
              ${isAr ? 'الشفافية والأمان' : 'Transparency'}
            </div>
            <ul class="space-y-2">
              <li><a href="/${lang}/about.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${isAr ? 'من نحن' : 'About'}</a></li>
              <li><a href="/${lang}/privacy.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}</a></li>
              <li><a href="/${lang}/privacy.html#terms" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${isAr ? 'شروط الاستخدام' : 'Terms'}</a></li>
            </ul>
          </div>

          <div>
            <div class="font-bold text-black dark:text-white mb-3 uppercase tracking-wider text-[11px]">
              ${isAr ? 'معايير الأمان' : 'Security Standards'}
            </div>
            <ul class="space-y-2 text-neutral-600 dark:text-neutral-400">
              <li class="flex items-center gap-1.5"><span class="text-black dark:text-white font-bold">✓</span><span>${isAr ? 'إتلاف تلقائي بعد 20 دقيقة' : 'Auto-purge after 20 mins'}</span></li>
              <li class="flex items-center gap-1.5"><span class="text-black dark:text-white font-bold">✓</span><span>${isAr ? 'صفر سجلات تتبع' : 'Zero activity tracking'}</span></li>
              <li class="flex items-center gap-1.5"><span class="text-black dark:text-white font-bold">✓</span><span>${isAr ? 'عزل تام للذاكرة العشوائية' : 'Volatile RAM isolation'}</span></li>
              <li class="flex items-center gap-1.5"><span class="text-black dark:text-white font-bold">✓</span><span>${isAr ? 'تشفير كامل للاتصال TLS' : 'TLS 1.3 Transport Security'}</span></li>
            </ul>
          </div>
        </div>

        <div class="pt-8 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>© 2026 FreeTemp.email. All rights reserved.</p>
          <div class="flex items-center gap-4">
            <a href="/${lang}/articles/index.html" class="hover:underline">${isAr ? 'فهرس المقالات' : 'Articles Index'}</a>
            <span>•</span>
            <a href="/${lang}/privacy.html" class="hover:underline">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>

    <!-- Interactive Filter & Search Script -->
    <script>
      document.addEventListener('DOMContentLoaded', function () {
        var searchInput = document.getElementById('article-search-input');
        var pills = document.querySelectorAll('.cat-pill');
        var cards = document.querySelectorAll('.article-card');
        var currentCategory = 'all';

        function filterArticles() {
          var query = (searchInput ? searchInput.value : '').toLowerCase().trim();

          cards.forEach(function (card) {
            var title = card.getAttribute('data-title') || '';
            var desc = card.getAttribute('data-desc') || '';
            var cat = card.getAttribute('data-category') || '';

            var matchesCategory = currentCategory === 'all' || cat === currentCategory;
            var matchesSearch = !query || title.indexOf(query) !== -1 || desc.indexOf(query) !== -1 || cat.toLowerCase().indexOf(query) !== -1;

            if (matchesCategory && matchesSearch) {
              card.style.display = 'flex';
            } else {
              card.style.display = 'none';
            }
          });
        }

        if (searchInput) {
          searchInput.addEventListener('input', filterArticles);
        }

        pills.forEach(function (btn) {
          btn.addEventListener('click', function () {
            pills.forEach(function (p) {
              p.classList.remove('bg-black', 'text-white', 'dark:bg-white', 'dark:text-black', 'font-bold');
              p.classList.add('bg-neutral-100', 'dark:bg-neutral-800', 'text-neutral-700', 'dark:text-neutral-300', 'font-semibold');
            });
            btn.classList.remove('bg-neutral-100', 'dark:bg-neutral-800', 'text-neutral-700', 'dark:text-neutral-300', 'font-semibold');
            btn.classList.add('bg-black', 'text-white', 'dark:bg-white', 'dark:text-black', 'font-bold');

            currentCategory = btn.getAttribute('data-cat') || 'all';
            filterArticles();
          });
        });
      });
    </script>
  </body>
</html>`;
}

function renderBlogPageHtml(lang) {
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const langLabel = isAr ? 'العربية' : 'English';
  const fontClass = isAr ? "font-['Cairo',sans-serif]" : "font-sans";

  // Gather unique categories
  const categories = Array.from(new Set(allArticles.map(a => a.category[lang]))).filter(Boolean);

  const pillsHtml = `
          <button
            type="button"
            data-cat="all"
            class="cat-pill px-3 py-1 rounded text-xs font-bold bg-black text-white dark:bg-white dark:text-black cursor-pointer shadow-sm"
          >
            ${isAr ? 'الكل' : 'All'} (${allArticles.length})
          </button>
          ` + categories.map(cat => `
          <button
            type="button"
            data-cat="${cat}"
            class="cat-pill px-3 py-1 rounded text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            ${cat}
          </button>`).join('');

  const cardsHtml = allArticles.map((art, idx) => `
        <!-- Article Card ${idx + 1}: ${art.slug} -->
        <article
          class="article-card p-5 sm:p-6 bg-white dark:bg-[#121212] border border-neutral-300 dark:border-neutral-800 rounded-xl shadow-sm hover:border-neutral-400 dark:hover:border-neutral-600 transition-all flex flex-col justify-between"
          data-title="${art.title[lang].toLowerCase().replace(/"/g, '')}"
          data-desc="${art.metaDesc[lang].toLowerCase().replace(/"/g, '')}"
          data-category="${art.category[lang]}"
        >
          <div>
            <div class="flex items-center gap-2 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mb-2.5">
              <span class="font-bold text-black dark:text-white px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-[10px] uppercase">${art.category[lang]}</span>
              <span>•</span>
              <time datetime="${art.publishedAt}">${art.publishedAt}</time>
            </div>
            <h2 class="text-base font-bold text-black dark:text-white mb-2 leading-snug">
              <a href="/${lang}/articles/${art.slug}.html" class="hover:underline">
                ${art.title[lang]}
              </a>
            </h2>
            <p class="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
              ${art.metaDesc[lang]}
            </p>
          </div>
          <div class="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs">
            <span class="text-neutral-500 font-mono text-[11px]">${art.readTimeMin} ${isAr ? 'دقائق قراءة' : 'mins read'}</span>
            <a href="/${lang}/articles/${art.slug}.html" class="font-bold text-black dark:text-white hover:underline flex items-center gap-1">
              <span>${isAr ? 'قراءة المقال' : 'Read Guide'}</span>
              <span>${isAr ? '←' : '→'}</span>
            </a>
          </div>
        </article>`).join('');

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
    <title>${isAr ? 'أرشيف المدونة والأدلة الهندسية (22 مقالاً) — FreeTemp.email' : 'Blog Archive & Engineering Guides (22 Articles) — FreeTemp.email'}</title>
    <meta name="description" content="${isAr ? 'استكشف كافة المقالات والأبحاث المعمارية الـ 22 حول أمان البريد المؤقت وتجاوز حجب أكواد التحقق.' : 'Explore all 22 technical and architectural guides on temporary email security, OTP parsing, and privacy.'}" />
    <link rel="canonical" href="https://freetemp.email/${lang}/blog.html" />

    <!-- Multilingual Alternates -->
    <link rel="alternate" hreflang="ar" href="https://freetemp.email/ar/blog.html" />
    <link rel="alternate" hreflang="en" href="https://freetemp.email/en/blog.html" />
    <link rel="alternate" hreflang="x-default" href="https://freetemp.email/en/blog.html" />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="FreeTemp.email" />
    <meta property="og:title" content="${isAr ? 'أرشيف المدونة والأدلة الهندسية — FreeTemp.email' : 'Blog Archive & Engineering Guides — FreeTemp.email'}" />
    <meta property="og:description" content="${isAr ? 'استكشف كافة المقالات والأبحاث المعمارية الـ 22 حول أمان البريد المؤقت وتجاوز حجب أكواد التحقق.' : 'Explore all 22 technical guides on disposable email security and OTP parsing.'}" />
    <meta property="og:url" content="https://freetemp.email/${lang}/blog.html" />
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
  <body class="min-h-screen bg-white text-black dark:bg-[#0D0D0D] dark:text-[#F5F5F5] flex flex-col transition-colors duration-200 ${fontClass}">
    <!-- Master Header -->
    <header class="border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-[#0D0D0D]/95 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div class="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div class="flex items-center gap-6">
          <a href="/${lang}/" class="text-lg sm:text-xl font-bold tracking-tight text-black dark:text-white hover:opacity-90 transition-opacity flex items-center gap-2.5">
            <span class="w-7 h-7 rounded-lg bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-xs font-mono font-extrabold shadow-sm shrink-0">
              <svg class="w-4 h-4 fill-none stroke-current" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
            </span>
            <span class="flex items-center gap-1 font-sans">
              <span class="font-extrabold tracking-tight">FreeTemp</span><span class="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">.email</span>
            </span>
            <span class="hidden md:inline-flex items-center text-xs text-neutral-400 dark:text-neutral-500 font-normal mr-1">
              <span class="mx-1.5 opacity-40">|</span>
              <span data-i18n="brand">${isAr ? "بريد مؤقت" : "Temp Mail"}</span>
            </span>
          </a>

          <nav class="hidden md:flex items-center gap-4 text-xs font-medium">
            ${getNav(lang, 'blog')}
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
            <span id="current-lang-label">${langLabel}</span>
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

    <!-- Main Content Container -->
    <main class="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12">
      <!-- Breadcrumbs -->
      <nav class="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-6 font-mono">
        <a href="/${lang}/" class="hover:underline" data-i18n="home">${isAr ? 'الرئيسية' : 'Home'}</a>
        <span>/</span>
        <span class="text-black dark:text-white font-semibold" data-i18n="blog">${isAr ? 'المدونة والأرشيف' : 'Blog Archive'}</span>
      </nav>

      <!-- Difference Callout: Blog vs Guide -->
      <div class="mb-8 p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-black dark:text-white shrink-0 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          <span class="text-neutral-700 dark:text-neutral-300 leading-relaxed">
            ${isAr ? `تحتوي المدونة على كافة الأبحاث المعمارية والبروتوكولات (${allArticles.length} دليلاً). هل تبحث عن دليل الاستخدام التشغيلي؟` : `Explore our full series of ${allArticles.length} architecture and security guides. Looking for the quick operational guide?`}
          </span>
        </div>
        <a href="/${lang}/guide.html" class="font-bold text-black dark:text-white underline hover:opacity-80 shrink-0">
          ${isAr ? 'زيارة دليل الاستخدام ←' : 'Go to User Guide →'}
        </a>
      </div>

      <!-- Blog Header -->
      <div class="mb-8 text-center max-w-2xl mx-auto">
        <h1 class="text-3xl sm:text-4xl font-extrabold text-black dark:text-white tracking-tight mb-3">
          ${isAr ? 'أرشيف المدونة والأبحاث الهندسية' : 'Blog Archive & Engineering Insights'}
        </h1>
        <p class="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
          ${isAr ? 'أدلة معمارية وأبحاث متخصصة تغطي خوارزميات التغطية الشاملة لرسائل التحقق، البث الحي عبر WebSocket، والتشفير وعزل الحاويات.' : 'Deep-dive architectural articles covering OTP parsing heuristics, WebSocket streaming, RAM-only execution, and privacy compliance.'}
        </p>
      </div>

      <!-- Search & Filters Bar -->
      <div class="mb-8 space-y-3">
        <div class="relative">
          <input
            id="article-search-input"
            type="text"
            placeholder="${isAr ? `ابحث في كافة المقالات والأبحاث (${allArticles.length} مقالاً)...` : `Search all ${allArticles.length} technical guides...`}"
            class="w-full h-11 px-4 bg-white dark:bg-[#121212] border border-neutral-300 dark:border-neutral-700 rounded-xl text-xs sm:text-sm text-black dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors shadow-sm"
          />
        </div>

        <!-- Category Filter Pills -->
        <div class="flex flex-wrap gap-1.5" id="category-pills">
          ${pillsHtml}
        </div>
      </div>

      <!-- All Articles Grid -->
      <div id="articles-grid" class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
        ${cardsHtml}
      </div>
    </main>

    <!-- Master Footer -->
    <footer class="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0D0D0D] py-12 text-xs transition-colors">
      <div class="max-w-4xl mx-auto px-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div class="sm:col-span-2 md:col-span-1">
            <div class="flex items-center gap-2 mb-3">
              <span class="w-6 h-6 rounded bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-xs font-mono font-extrabold shadow-sm">FT</span>
              <span class="font-extrabold tracking-tight text-sm text-black dark:text-white font-sans">FreeTemp<span class="text-[10px] font-mono font-bold px-1 py-0.5 ml-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">.email</span></span>
            </div>
            <p class="text-neutral-500 leading-relaxed text-[11px] mb-4">
              ${isAr ? 'منصة بريد مؤقت سريعة وفورية توفر حماية استباقية للخصوصية واستخراجاً ذكياً لأكواد التحقق.' : 'Fast, secure ephemeral email service for instant verification codes and spam-free privacy.'}
            </p>
          </div>

          <div>
            <div class="font-bold text-black dark:text-white mb-3 uppercase tracking-wider text-[11px]">
              ${isAr ? 'التنقل' : 'Navigation'}
            </div>
            <ul class="space-y-2">
              <li><a href="/${lang}/" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${isAr ? 'الرئيسية' : 'Home'}</a></li>
              <li><a href="/${lang}/blog.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${isAr ? 'المدونة' : 'Blog'}</a></li>
              <li><a href="/${lang}/guide.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${isAr ? 'دليل الاستخدام' : 'Guide'}</a></li>
              <li><a href="/${lang}/faq.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${isAr ? 'الأسئلة الشائعة' : 'FAQ'}</a></li>
              <li><a href="/${lang}/articles/index.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${isAr ? 'المقالات' : 'Articles'}</a></li>
            </ul>
          </div>

          <div>
            <div class="font-bold text-black dark:text-white mb-3 uppercase tracking-wider text-[11px]">
              ${isAr ? 'الشفافية والأمان' : 'Transparency'}
            </div>
            <ul class="space-y-2">
              <li><a href="/${lang}/about.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${isAr ? 'من نحن' : 'About'}</a></li>
              <li><a href="/${lang}/privacy.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}</a></li>
              <li><a href="/${lang}/privacy.html#terms" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${isAr ? 'شروط الاستخدام' : 'Terms'}</a></li>
            </ul>
          </div>

          <div>
            <div class="font-bold text-black dark:text-white mb-3 uppercase tracking-wider text-[11px]">
              ${isAr ? 'معايير الأمان' : 'Security Standards'}
            </div>
            <ul class="space-y-2 text-neutral-600 dark:text-neutral-400">
              <li class="flex items-center gap-1.5"><span class="text-black dark:text-white font-bold">✓</span><span>${isAr ? 'إتلاف تلقائي بعد 20 دقيقة' : 'Auto-purge after 20 mins'}</span></li>
              <li class="flex items-center gap-1.5"><span class="text-black dark:text-white font-bold">✓</span><span>${isAr ? 'صفر سجلات تتبع' : 'Zero activity tracking'}</span></li>
              <li class="flex items-center gap-1.5"><span class="text-black dark:text-white font-bold">✓</span><span>${isAr ? 'عزل تام للذاكرة العشوائية' : 'Volatile RAM isolation'}</span></li>
              <li class="flex items-center gap-1.5"><span class="text-black dark:text-white font-bold">✓</span><span>${isAr ? 'تشفير كامل للاتصال TLS' : 'TLS 1.3 Transport Security'}</span></li>
            </ul>
          </div>
        </div>

        <div class="pt-8 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>© 2026 FreeTemp.email. All rights reserved.</p>
          <div class="flex items-center gap-4">
            <a href="/${lang}/articles/index.html" class="hover:underline">${isAr ? 'فهرس المقالات' : 'Articles Index'}</a>
            <span>•</span>
            <a href="/${lang}/privacy.html" class="hover:underline">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>

    <!-- Interactive Filter & Search Script -->
    <script>
      document.addEventListener('DOMContentLoaded', function () {
        var searchInput = document.getElementById('article-search-input');
        var pills = document.querySelectorAll('.cat-pill');
        var cards = document.querySelectorAll('.article-card');
        var currentCategory = 'all';

        function filterArticles() {
          var query = (searchInput ? searchInput.value : '').toLowerCase().trim();

          cards.forEach(function (card) {
            var title = card.getAttribute('data-title') || '';
            var desc = card.getAttribute('data-desc') || '';
            var cat = card.getAttribute('data-category') || '';

            var matchesCategory = currentCategory === 'all' || cat === currentCategory;
            var matchesSearch = !query || title.indexOf(query) !== -1 || desc.indexOf(query) !== -1 || cat.toLowerCase().indexOf(query) !== -1;

            if (matchesCategory && matchesSearch) {
              card.style.display = 'flex';
            } else {
              card.style.display = 'none';
            }
          });
        }

        if (searchInput) {
          searchInput.addEventListener('input', filterArticles);
        }

        pills.forEach(function (btn) {
          btn.addEventListener('click', function () {
            pills.forEach(function (p) {
              p.classList.remove('bg-black', 'text-white', 'dark:bg-white', 'dark:text-black', 'font-bold');
              p.classList.add('bg-neutral-100', 'dark:bg-neutral-800', 'text-neutral-700', 'dark:text-neutral-300', 'font-semibold');
            });
            btn.classList.remove('bg-neutral-100', 'dark:bg-neutral-800', 'text-neutral-700', 'dark:text-neutral-300', 'font-semibold');
            btn.classList.add('bg-black', 'text-white', 'dark:bg-white', 'dark:text-black', 'font-bold');

            currentCategory = btn.getAttribute('data-cat') || 'all';
            filterArticles();
          });
        });
      });
    </script>
  </body>
</html>`;
}

// Generate all files
const dirsToEnsure = [
  path.join(__dirname, '../ar/articles'),
  path.join(__dirname, '../en/articles'),
  path.join(__dirname, '../public/ar/articles'),
  path.join(__dirname, '../public/en/articles')
];

dirsToEnsure.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// 0. Enrich each article with centralized schema relationships (hreflang mappings for all 22 languages & post graphs)
const SUPPORTED_LANGS = ['ar', 'en', 'es', 'fr', 'de', 'pt', 'it', 'ru', 'tr', 'zh', 'ja', 'ko', 'nl', 'pl', 'id', 'vi', 'hi', 'fa', 'ur', 'uk', 'sv', 'el'];

allArticles.forEach((art, idx) => {
  const hreflangMap = {};
  SUPPORTED_LANGS.forEach(l => {
    hreflangMap[l] = `https://freetemp.email/${l}/articles/${art.slug}.html`;
  });

  art.relationships = {
    hreflang: hreflangMap,
    relatedSlugs: art.relatedSlugs || [],
    topicCluster: art.category?.en || 'Security & Architecture',
    seriesOrder: idx + 1,
    prevSlug: idx > 0 ? allArticles[idx - 1].slug : null,
    nextSlug: idx < allArticles.length - 1 ? allArticles[idx + 1].slug : null
  };
});

// 1. Generate individual articles
allArticles.forEach(art => {
  const arHtml = renderFullHtml(art, 'ar');
  const enHtml = renderFullHtml(art, 'en');

  fs.writeFileSync(path.join(__dirname, `../ar/articles/${art.slug}.html`), arHtml, 'utf8');
  fs.writeFileSync(path.join(__dirname, `../en/articles/${art.slug}.html`), enHtml, 'utf8');
  fs.writeFileSync(path.join(__dirname, `../public/ar/articles/${art.slug}.html`), arHtml, 'utf8');
  fs.writeFileSync(path.join(__dirname, `../public/en/articles/${art.slug}.html`), enHtml, 'utf8');
});

// 2. Generate articles/index.html
const arArticlesIndex = renderArticlesIndexHtml('ar');
const enArticlesIndex = renderArticlesIndexHtml('en');
fs.writeFileSync(path.join(__dirname, '../ar/articles/index.html'), arArticlesIndex, 'utf8');
fs.writeFileSync(path.join(__dirname, '../en/articles/index.html'), enArticlesIndex, 'utf8');
fs.writeFileSync(path.join(__dirname, '../public/ar/articles/index.html'), arArticlesIndex, 'utf8');
fs.writeFileSync(path.join(__dirname, '../public/en/articles/index.html'), enArticlesIndex, 'utf8');

// 3. Generate blog.html
const arBlog = renderBlogPageHtml('ar');
const enBlog = renderBlogPageHtml('en');
fs.writeFileSync(path.join(__dirname, '../ar/blog.html'), arBlog, 'utf8');
fs.writeFileSync(path.join(__dirname, '../en/blog.html'), enBlog, 'utf8');
fs.writeFileSync(path.join(__dirname, '../public/ar/blog.html'), arBlog, 'utf8');
fs.writeFileSync(path.join(__dirname, '../public/en/blog.html'), enBlog, 'utf8');

// 4. Generate shared/articles-data.js, shared/articles-data.json, and public mirrors
const sharedJsContent = `(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    var exp = factory();
    root.ARTICLES_DATA = exp.ARTICLES_DATA;
    root.getArticleBySlug = exp.getArticleBySlug;
    root.getArticlesByCategory = exp.getArticlesByCategory;
    root.getRecentArticles = exp.getRecentArticles;
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var ARTICLES_DATA = ${JSON.stringify(allArticles, null, 2)};

  return {
    ARTICLES_DATA: ARTICLES_DATA,
    getArticleBySlug: function (slug) {
      return ARTICLES_DATA.find(function (a) { return a.slug === slug; }) || null;
    },
    getArticlesByCategory: function (category, lang) {
      lang = lang || 'en';
      return ARTICLES_DATA.filter(function (a) {
        if (!a.category) return false;
        return a.category[lang] === category || a.category.en === category || a.category.ar === category;
      });
    },
    getRecentArticles: function (limit) {
      limit = limit || 6;
      return ARTICLES_DATA.slice(0, limit);
    }
  };
});
`;

const sharedJsonContent = JSON.stringify(allArticles, null, 2);

if (!fs.existsSync(path.join(__dirname, '../shared'))) fs.mkdirSync(path.join(__dirname, '../shared'), { recursive: true });
if (!fs.existsSync(path.join(__dirname, '../public/shared'))) fs.mkdirSync(path.join(__dirname, '../public/shared'), { recursive: true });

fs.writeFileSync(path.join(__dirname, '../shared/articles-data.js'), sharedJsContent, 'utf8');
fs.writeFileSync(path.join(__dirname, '../public/shared/articles-data.js'), sharedJsContent, 'utf8');
fs.writeFileSync(path.join(__dirname, '../shared/articles-data.json'), sharedJsonContent, 'utf8');
fs.writeFileSync(path.join(__dirname, '../public/shared/articles-data.json'), sharedJsonContent, 'utf8');

console.log(`Successfully generated all ${allArticles.length * 2} article pages, articles indexes, blog archives, and centralized JSON/JS data.`);
