const fs = require('fs');
const path = require('path');

console.log('--- Unifying logos across scripts and HTML pages ---');

// 1. Update scripts/generate-static-articles.cjs
const genPath = path.join(__dirname, 'generate-static-articles.cjs');
if (fs.existsSync(genPath)) {
  let gen = fs.readFileSync(genPath, 'utf8');

  // Replace header brand in generate-static-articles.cjs
  const oldHeaderRegex = /<a href="\/\$\{lang\}\/" class="text-lg sm:text-xl font-bold tracking-tight text-black dark:text-white hover:opacity-90 transition-opacity flex items-center gap-2\.5">[\s\S]*?<\/a>/g;
  const newHeader = `<a href="/\${lang}/" dir="ltr" class="flex items-center gap-2.5 transition-opacity hover:opacity-90">
            <img src="/logo.svg" alt="freetemp.email" class="w-8 h-8 rounded-lg shadow-sm shrink-0" width="32" height="32" />
            <span class="flex items-baseline font-sans tracking-tight">
              <span class="text-xl font-extrabold text-black dark:text-white">freetemp</span>
              <span class="text-sm font-semibold text-neutral-500 dark:text-neutral-400">.email</span>
            </span>
          </a>`;

  gen = gen.replace(oldHeaderRegex, newHeader);

  // Replace footer FT badge
  const oldFooterBadge = /<span class="w-6 h-6 rounded bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-xs font-mono font-extrabold shadow-sm">FT<\/span>\s*<span class="font-extrabold tracking-tight text-sm text-black dark:text-white font-sans">FreeTemp<span class="text-\[10px\] font-mono font-bold px-1 py-0\.5 ml-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">\.email<\/span><\/span>/g;
  const newFooterLogo = `<img src="/logo.svg" alt="freetemp.email" class="w-6 h-6 rounded-lg shadow-sm shrink-0" width="24" height="24" />
              <span dir="ltr" class="inline-flex items-baseline"><span class="font-extrabold tracking-tight font-sans text-sm text-black dark:text-white">freetemp</span><span class="text-[10px] font-mono font-bold px-1 py-0.5 ml-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">.email</span></span>`;

  gen = gen.replace(oldFooterBadge, newFooterLogo);

  fs.writeFileSync(genPath, gen, 'utf8');
  console.log('Updated scripts/generate-static-articles.cjs');
}

// 2. Walk through all HTML files
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('dist')) {
        results = results.concat(walk(full));
      }
    } else if (file.endsWith('.html')) {
      results.push(full);
    }
  });
  return results;
}

const htmlFiles = walk(path.join(__dirname, '..'));
let updatedCount = 0;

htmlFiles.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;

  // Replace header brand anchors that use the old SVG or old classes
  // Pattern 1: Any header anchor with svg mail path
  content = content.replace(
    /<a href="([^"]*)"[^>]*>\s*<span class="w-7 h-7 rounded-lg bg-black dark:bg-white[\s\S]*?M21\.75 6\.75v10\.5a2\.25 2\.25[\s\S]*?<\/a>/g,
    (match, href) => `<a href="${href}" dir="ltr" class="flex items-center gap-2.5 transition-opacity hover:opacity-90">
            <img src="/logo.svg" alt="freetemp.email" class="w-8 h-8 rounded-lg shadow-sm shrink-0" width="32" height="32" />
            <span class="flex items-baseline font-sans tracking-tight">
              <span class="text-xl font-extrabold text-black dark:text-white">freetemp</span>
              <span class="text-sm font-semibold text-neutral-500 dark:text-neutral-400">.email</span>
            </span>
          </a>`
  );

  // Pattern 2: Text only legacy brand in privacy / terms
  content = content.replace(
    /<a href="([^"]*)" class="text-xl font-bold tracking-tight text-black hover:opacity-80 transition-opacity">\s*بريد مؤقت\s*<\/a>/g,
    (match, href) => `<a href="${href}" dir="ltr" class="flex items-center gap-2.5 transition-opacity hover:opacity-90">
        <img src="/logo.svg" alt="freetemp.email" class="w-8 h-8 rounded-lg shadow-sm shrink-0" width="32" height="32" />
        <span class="flex items-baseline font-sans tracking-tight">
          <span class="text-xl font-extrabold text-black dark:text-white">freetemp</span>
          <span class="text-sm font-semibold text-neutral-500 dark:text-neutral-400">.email</span>
        </span>
      </a>`
  );

  // Pattern 3: FT footer badges
  content = content.replace(
    /<span class="w-6 h-6 rounded bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-xs font-mono font-extrabold shadow-sm">FT<\/span>\s*<span class="font-extrabold tracking-tight text-sm text-black dark:text-white font-sans">FreeTemp<span class="text-\[10px\] font-mono font-bold px-1 py-0\.5 ml-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">\.email<\/span><\/span>/g,
    `<img src="/logo.svg" alt="freetemp.email" class="w-6 h-6 rounded-lg shadow-sm shrink-0" width="24" height="24" />
              <span dir="ltr" class="inline-flex items-baseline"><span class="font-extrabold tracking-tight font-sans text-sm text-black dark:text-white">freetemp</span><span class="text-[10px] font-mono font-bold px-1 py-0.5 ml-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">.email</span></span>`
  );

  if (content !== original) {
    fs.writeFileSync(f, content, 'utf8');
    updatedCount++;
  }
});

console.log(`Updated ${updatedCount} HTML files.`);
