import fs from 'node:fs';
import path from 'node:path';

/**
 * Automated Multilingual Sitemap Generator with Hreflang Alternates
 * 
 * Recursively scans both /ar/ and /en/ directories to discover all HTML pages,
 * computes symmetrical localized routes, and generates a standards-compliant
 * sitemap.xml with xhtml:link rel="alternate" (hreflang="ar", hreflang="en",
 * and hreflang="x-default") for every single page.
 */

export interface SitemapAlternate {
  hreflang: string;
  href: string;
}

export interface SitemapRoute {
  path: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
  lastmod: string;
  alternates: SitemapAlternate[];
}

export interface SitemapGeneratorOptions {
  baseUrl?: string;
  publicDir?: string;
  rootDir?: string;
  distDir?: string;
}

/**
 * Format date to W3C Datetime format (YYYY-MM-DD)
 */
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Recursively scans a directory and returns relative paths of all .html files
 */
function scanHtmlFilesRecursively(dir: string, baseDir: string = dir): string[] {
  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const results: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...scanHtmlFilesRecursively(fullPath, baseDir));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      const relPath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
      results.push(relPath);
    }
  }

  return results.sort();
}

/**
 * Determine priority and change frequency based on route path
 */
function getRouteMetadata(relPath: string): { priority: string; changefreq: SitemapRoute['changefreq'] } {
  const clean = relPath.replace(/^(\/|ar\/|en\/)+/, '');

  if (clean === '' || clean === 'index.html') {
    return { priority: '1.0', changefreq: 'daily' };
  }
  if (clean.includes('guide') || clean === 'article.html' || clean.includes('article')) {
    return { priority: '0.9', changefreq: 'weekly' };
  }
  if (clean.includes('faq')) {
    return { priority: '0.8', changefreq: 'weekly' };
  }
  if (clean === 'articles' || clean === 'articles/' || clean === 'articles/index.html') {
    return { priority: '0.8', changefreq: 'weekly' };
  }
  if (clean.startsWith('articles/')) {
    return { priority: '0.8', changefreq: 'monthly' };
  }
  if (clean.includes('about')) {
    return { priority: '0.7', changefreq: 'monthly' };
  }
  if (clean.includes('privacy') || clean.includes('terms')) {
    return { priority: '0.6', changefreq: 'monthly' };
  }

  return { priority: '0.7', changefreq: 'monthly' };
}

/**
 * Convert relative html path to canonical web URL path
 * Example:
 * - 'index.html' -> '/'
 * - 'articles/index.html' -> '/articles/'
 * - 'guide.html' -> '/guide.html'
 */
function toUrlPath(lang: 'ar' | 'en', relPath: string): string {
  if (relPath === 'index.html' || relPath === '') {
    return `/${lang}/`;
  }
  if (relPath.endsWith('/index.html')) {
    const parentDir = relPath.replace(/\/index\.html$/, '');
    return `/${lang}/${parentDir}/`;
  }
  return `/${lang}/${relPath}`;
}

/**
 * Automatically discovers all pages in both /ar/ and /en/ and pairs them
 */
export function discoverMultilingualRoutes(baseUrl: string, sourceDir: string): SitemapRoute[] {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const today = formatDate(new Date());

  const arDir = path.join(sourceDir, 'ar');
  const enDir = path.join(sourceDir, 'en');

  const arFiles = scanHtmlFilesRecursively(arDir);
  const enFiles = scanHtmlFilesRecursively(enDir);

  // Union of all relative paths inside the language folders
  const allRelPages = Array.from(new Set([...arFiles, ...enFiles])).sort();

  const routes: SitemapRoute[] = [];

  // 1. Root redirect route (/)
  routes.push({
    path: '/',
    changefreq: 'daily',
    priority: '1.0',
    lastmod: today,
    alternates: [
      { hreflang: 'ar', href: `${cleanBase}/ar/` },
      { hreflang: 'en', href: `${cleanBase}/en/` },
      { hreflang: 'x-default', href: `${cleanBase}/en/` },
    ],
  });

  // 2. Multilingual paired pages
  for (const relPage of allRelPages) {
    const hasAr = arFiles.includes(relPage);
    const hasEn = enFiles.includes(relPage);

    const arUrlPath = toUrlPath('ar', relPage);
    const enUrlPath = toUrlPath('en', relPage);

    // Shared hreflang alternates cluster for this page
    const alternates: SitemapAlternate[] = [];
    if (hasAr) {
      alternates.push({ hreflang: 'ar', href: `${cleanBase}${arUrlPath}` });
    }
    if (hasEn) {
      alternates.push({ hreflang: 'en', href: `${cleanBase}${enUrlPath}` });
    }
    // x-default points to en if available, otherwise ar
    alternates.push({
      hreflang: 'x-default',
      href: hasEn ? `${cleanBase}${enUrlPath}` : `${cleanBase}${arUrlPath}`,
    });

    const meta = getRouteMetadata(relPage);

    // Add Arabic page entry if present
    if (hasAr) {
      const arFilePath = path.join(arDir, relPage);
      let fileMod = today;
      try {
        fileMod = formatDate(fs.statSync(arFilePath).mtime);
      } catch {
        // fallback to today
      }

      routes.push({
        path: arUrlPath,
        changefreq: meta.changefreq,
        priority: meta.priority,
        lastmod: fileMod,
        alternates,
      });
    }

    // Add English page entry if present
    if (hasEn) {
      const enFilePath = path.join(enDir, relPage);
      let fileMod = today;
      try {
        fileMod = formatDate(fs.statSync(enFilePath).mtime);
      } catch {
        // fallback to today
      }

      routes.push({
        path: enUrlPath,
        changefreq: meta.changefreq,
        priority: meta.priority,
        lastmod: fileMod,
        alternates,
      });
    }
  }

  return routes;
}

/**
 * Builds the complete sitemap.xml string with XML declarations and hreflang tags
 */
export function generateSitemapXml(routes: SitemapRoute[], baseUrl: string): string {
  const cleanBase = baseUrl.replace(/\/+$/, '');

  const xmlEntries = routes.map((route) => {
    const loc = route.path === '/' ? `${cleanBase}/` : `${cleanBase}${route.path}`;

    const alternateLines = (route.alternates || [])
      .map(
        (alt) =>
          `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}" />`
      )
      .join('\n');

    return [
      '  <url>',
      `    <loc>${loc}</loc>`,
      alternateLines ? alternateLines : null,
      `    <lastmod>${route.lastmod}</lastmod>`,
      `    <changefreq>${route.changefreq}</changefreq>`,
      `    <priority>${route.priority}</priority>`,
      '  </url>',
    ]
      .filter((line) => line !== null)
      .join('\n');
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    xmlEntries.join('\n\n'),
    '</urlset>',
    '',
  ].join('\n');
}

/**
 * Main execution runner
 */
export function runGenerator(options: SitemapGeneratorOptions = {}): string {
  const baseUrl = options.baseUrl || process.env.BASE_URL || 'https://freetemp.email';
  const rootDir = options.rootDir || process.cwd();
  const publicDir = options.publicDir || path.resolve(rootDir, 'public');
  const distDir = options.distDir || path.resolve(rootDir, 'dist');

  // Determine source of html pages (prefer public/ar and public/en, fallback to ar and en)
  let sourceDir = publicDir;
  if (!fs.existsSync(path.join(publicDir, 'ar')) || !fs.existsSync(path.join(publicDir, 'en'))) {
    if (fs.existsSync(path.join(rootDir, 'ar')) && fs.existsSync(path.join(rootDir, 'en'))) {
      sourceDir = rootDir;
    }
  }

  console.log(`🚀 [Sitemap Generator] Generating automated multilingual sitemap...`);
  console.log(`   🌐 Base URL: ${baseUrl}`);
  console.log(`   📁 Source Directory: ${sourceDir}`);

  const routes = discoverMultilingualRoutes(baseUrl, sourceDir);

  const totalAlternates = routes.reduce((acc, r) => acc + (r.alternates ? r.alternates.length : 0), 0);

  console.log(`📋 [Sitemap Generator] Discovered ${routes.length} URL entries with ${totalAlternates} total hreflang links:`);
  
  routes.forEach((r) => {
    const altLangs = r.alternates.map((a) => a.hreflang).join(', ');
    console.log(`   • ${r.path} [${r.priority} | ${r.changefreq}] -> alternates: [${altLangs}]`);
  });

  const xml = generateSitemapXml(routes, baseUrl);

  // 1. Write to public/sitemap.xml
  const publicSitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(publicSitemapPath, xml, 'utf-8');
  console.log(`✔ [Sitemap Generator] Successfully saved: ${publicSitemapPath}`);

  // 2. Write to root sitemap.xml
  const rootSitemapPath = path.resolve(rootDir, 'sitemap.xml');
  fs.writeFileSync(rootSitemapPath, xml, 'utf-8');
  console.log(`✔ [Sitemap Generator] Successfully saved: ${rootSitemapPath}`);

  // 3. Write to dist/sitemap.xml if dist exists
  if (fs.existsSync(distDir)) {
    const distSitemapPath = path.join(distDir, 'sitemap.xml');
    fs.writeFileSync(distSitemapPath, xml, 'utf-8');
    console.log(`✔ [Sitemap Generator] Successfully updated build artifact: ${distSitemapPath}`);
  }

  console.log(`✅ [Sitemap Generator] Automated sitemap generation completed with 100% multilingual hreflang coverage.`);
  return xml;
}

// Execute when run directly via CLI (tsx scripts/generate-sitemap.ts)
if (process.argv[1] && (process.argv[1].endsWith('generate-sitemap.ts') || process.argv[1].includes('generate-sitemap'))) {
  try {
    runGenerator();
  } catch (error) {
    console.error('❌ [Sitemap Generator Error]:', error);
    process.exit(1);
  }
}
