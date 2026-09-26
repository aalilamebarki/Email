import fs from 'fs';
import { translations39 } from './translations-data.ts';

const filePath = 'shared/i18n.js';
let content = fs.readFileSync(filePath, 'utf8');

// For each language in translations39, find its block in DICTIONARY and append the missing keys before the closing brace of that language
for (const [langCode, keys] of Object.entries(translations39)) {
  // Regex to match the end of the language block: e.g., for 'es':
  // Look for `es: { ... }`
  const regex = new RegExp(`(${langCode}:\\s*\\{[\\s\\S]*?)((\\n\\s*)linkText:.*?\\n)?(\\s*\\},)`, 'm');
  
  // Format keys as string
  const formattedKeys = Object.entries(keys)
    .map(([k, v]) => `      ${k}: ${JSON.stringify(v)},`)
    .join('\n');

  // Let's replace within DICTIONARY
  // Find where lang block starts
  const langKey = `${langCode}: {`;
  const idx = content.indexOf(langKey);
  if (idx !== -1) {
    // Find matching closing brace
    let braceCount = 0;
    let endIdx = -1;
    for (let i = idx; i < content.length; i++) {
      if (content[i] === '{') braceCount++;
      else if (content[i] === '}') {
        braceCount--;
        if (braceCount === 0) {
          endIdx = i;
          break;
        }
      }
    }

    if (endIdx !== -1) {
      const block = content.slice(idx, endIdx);
      // Filter keys that are not already in block
      const missingEntries = Object.entries(keys).filter(([k]) => !block.includes(`${k}:`));
      if (missingEntries.length > 0) {
        const toAdd = missingEntries.map(([k, v]) => `      ${k}: ${JSON.stringify(v)},`).join('\n') + '\n';
        content = content.slice(0, endIdx) + toAdd + '    ' + content.slice(endIdx);
        console.log(`Added ${missingEntries.length} keys to ${langCode}`);
      }
    }
  }
}

// Ensure detectLanguage handles all 22 languages and RTL vs LTR cleanly
const updatedDetectAndSet = `  /**
   * Detect current language:
   * 1. Path-based truth:
   *    If path starts with /ar, it uses Arabic / RTL languages (ar, fa, ur).
   *    If path starts with /en, it uses English or any selected LTR language.
   * 2. Stored user preference in localStorage ('preferredLang').
   * 3. Browser navigator.languages fallback.
   */
  function detectLanguage() {
    try {
      const path = window.location.pathname.toLowerCase();
      const stored = localStorage.getItem('preferredLang');

      // RTL tree (/ar/):
      if (path.startsWith('/ar/') || path === '/ar' || path === '/ar/index.html') {
        if (stored && ['ar', 'fa', 'ur'].includes(stored) && DICTIONARY[stored]) {
          return stored;
        }
        return 'ar';
      }

      // LTR tree (/en/):
      if (path.startsWith('/en/') || path === '/en' || path === '/en/index.html') {
        if (stored && stored !== 'ar' && stored !== 'fa' && stored !== 'ur' && DICTIONARY[stored]) {
          return stored;
        }
        return 'en';
      }

      // Root path (/ or /index.html):
      if (stored && DICTIONARY[stored]) return stored;

      const navLangs = navigator.languages || [navigator.language || navigator.userLanguage || ''];
      for (const raw of navLangs) {
        if (!raw) continue;
        const code = raw.toLowerCase().split('-')[0];
        if (DICTIONARY[code]) return code;
      }
    } catch (e) {}
    return 'ar';
  }

  let currentLang = detectLanguage();

  function getLanguage() {
    return currentLang;
  }

  function getLanguageMeta(code = currentLang) {
    return LANGUAGES.find((l) => l.code === code) || LANGUAGES[0];
  }

  function getStrings(code = currentLang) {
    const base = DICTIONARY['en'] || {};
    const target = DICTIONARY[code] || {};
    return Object.assign({}, base, target);
  }

  function setLanguage(code) {
    if (!DICTIONARY[code]) code = 'en';
    try {
      localStorage.setItem('preferredLang', code);
    } catch (e) {}

    const meta = getLanguageMeta(code);
    const pathname = window.location.pathname;

    // Direct routing based on text direction (RTL vs LTR):
    if (meta.dir === 'rtl') {
      if (pathname.startsWith('/en/')) {
        const newPath = pathname.replace(/^\\/en\\//, '/ar/');
        window.location.href = newPath + window.location.search + window.location.hash;
        return;
      } else if (pathname === '/en' || pathname === '/en/index.html' || pathname === '/' || pathname === '/index.html') {
        window.location.href = '/ar/' + window.location.search + window.location.hash;
        return;
      } else if (!pathname.startsWith('/ar/')) {
        const clean = pathname.startsWith('/') ? pathname : '/' + pathname;
        window.location.href = '/ar' + clean + window.location.search + window.location.hash;
        return;
      }
    } else {
      if (pathname.startsWith('/ar/')) {
        const newPath = pathname.replace(/^\\/ar\\//, '/en/');
        window.location.href = newPath + window.location.search + window.location.hash;
        return;
      } else if (pathname === '/ar' || pathname === '/ar/index.html' || pathname === '/' || pathname === '/index.html') {
        window.location.href = '/en/' + window.location.search + window.location.hash;
        return;
      } else if (!pathname.startsWith('/en/')) {
        const clean = pathname.startsWith('/') ? pathname : '/' + pathname;
        window.location.href = '/en' + clean + window.location.search + window.location.hash;
        return;
      }
    }

    currentLang = code;
    document.documentElement.lang = currentLang;
    document.documentElement.dir = meta.dir;

    applyTranslationsToDOM();

    // Trigger custom event for app logic
    window.dispatchEvent(new CustomEvent('langChanged', { detail: { lang: currentLang, dir: meta.dir } }));
  }`;

// Replace detectLanguage and setLanguage block
const startMarker = '  /**\n   * Detect current language:';
const endMarker = '  function applyTranslationsToDOM() {';
const startIdx = content.indexOf(startMarker);
const endIdx = content.indexOf(endMarker);

if (startIdx !== -1 && endIdx !== -1) {
  content = content.slice(0, startIdx) + updatedDetectAndSet + '\n\n' + content.slice(endIdx);
  console.log('Successfully updated detectLanguage and setLanguage logic');
}

// Write to shared/i18n.js and public/shared/i18n.js
fs.writeFileSync('shared/i18n.js', content);
fs.writeFileSync('public/shared/i18n.js', content);
console.log('Successfully saved to shared/i18n.js and public/shared/i18n.js');
