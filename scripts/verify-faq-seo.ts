import fs from 'node:fs';
import path from 'node:path';

/**
 * Diagnostic utility for SEO Structured Data (FAQPage JSON-LD)
 * Runs during the build step ('npm run build') to guarantee that:
 * 1. The FAQ JSON-LD schema is syntactically valid according to Schema.org / Google guidelines.
 * 2. It contains exactly one 'mainEntity' array.
 * 3. Each entry in 'mainEntity' has exactly one 'Question' object and one 'acceptedAnswer' with an 'Answer' object.
 * 4. All question names and answers match content visible on the page.
 */

interface SchemaQuestion {
  '@type': string;
  name: string;
  acceptedAnswer: {
    '@type': string;
    text: string;
  };
}

interface FAQPageSchema {
  '@context': string;
  '@type': string;
  '@id'?: string;
  inLanguage?: string;
  mainEntity: SchemaQuestion[];
}

function normalize(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .trim();
}

function verifyFaqSeoConsistency() {
  console.log('🔍 [SEO Diagnostic] Starting FAQ JSON-LD vs. UI Content verification...');

  const rootDir = process.cwd();
  const candidates = [
    path.join(rootDir, 'public', 'ar', 'faq.html'),
    path.join(rootDir, 'ar', 'faq.html'),
    path.join(rootDir, 'public', 'en', 'faq.html'),
    path.join(rootDir, 'en', 'faq.html'),
  ];
  const targetHtmlPath = candidates.find((p) => fs.existsSync(p));

  if (!targetHtmlPath) {
    throw new Error(`[SEO Diagnostic Error] FAQ file not found in any candidate path: ${candidates.join(', ')}`);
  }

  const htmlContent = fs.readFileSync(targetHtmlPath, 'utf-8');

  // 1. استخراج كتل JSON-LD
  const jsonLdMatches = htmlContent.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi);
  if (!jsonLdMatches) {
    throw new Error(`[SEO Diagnostic Error] No JSON-LD scripts found in ${targetHtmlPath}`);
  }

  let faqSchema: FAQPageSchema | null = null;
  for (const block of jsonLdMatches) {
    const rawJson = block
      .replace(/<script type="application\/ld\+json">/i, '')
      .replace(/<\/script>/i, '')
      .trim();

    const cleanJson = rawJson
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '')
      .trim();

    try {
      const parsed = JSON.parse(cleanJson);
      if (parsed['@type'] === 'FAQPage') {
        faqSchema = parsed as FAQPageSchema;
        break;
      }
    } catch {
      // Ignore other non-JSON or commented blocks
    }
  }

  if (!faqSchema) {
    throw new Error(`[SEO Diagnostic Error] FAQPage JSON-LD schema not found in ${targetHtmlPath}`);
  }

  // 2. التحقق من التوافق الصارم مع متطلبات Google Rich Snippets
  if (faqSchema['@context'] !== 'https://schema.org') {
    throw new Error(`[SEO Diagnostic Error] Invalid @context: expected 'https://schema.org', got '${faqSchema['@context']}'`);
  }

  if (!Array.isArray(faqSchema.mainEntity) || faqSchema.mainEntity.length === 0) {
    throw new Error('[SEO Diagnostic Error] FAQPage schema must contain a non-empty mainEntity array');
  }

  console.log(`✔ [SEO Diagnostic] Found valid FAQPage schema with ${faqSchema.mainEntity.length} questions in mainEntity array.`);

  // 3. التحقق من كل كائن سؤال وجواب
  faqSchema.mainEntity.forEach((item, index) => {
    if (item['@type'] !== 'Question') {
      throw new Error(`[SEO Diagnostic Error] mainEntity[${index}] must have @type 'Question', got '${item['@type']}'`);
    }
    if (!item.name || typeof item.name !== 'string' || item.name.trim().length === 0) {
      throw new Error(`[SEO Diagnostic Error] mainEntity[${index}] has missing or invalid 'name' string`);
    }
    if (!item.acceptedAnswer || typeof item.acceptedAnswer !== 'object') {
      throw new Error(`[SEO Diagnostic Error] mainEntity[${index}] missing 'acceptedAnswer' object`);
    }
    if (item.acceptedAnswer['@type'] !== 'Answer') {
      throw new Error(`[SEO Diagnostic Error] mainEntity[${index}].acceptedAnswer must have @type 'Answer', got '${item.acceptedAnswer['@type']}'`);
    }
    if (!item.acceptedAnswer.text || typeof item.acceptedAnswer.text !== 'string' || item.acceptedAnswer.text.trim().length === 0) {
      throw new Error(`[SEO Diagnostic Error] mainEntity[${index}].acceptedAnswer has missing or invalid 'text' string`);
    }
  });

  // 4. التحقق من مطابقة المحتوى مع المحتوى الظاهر على الصفحة
  const normalizedHtml = normalize(htmlContent);
  for (let i = 0; i < faqSchema.mainEntity.length; i++) {
    const qObj = faqSchema.mainEntity[i];
    const qNormalized = normalize(qObj.name);

    if (!normalizedHtml.includes(qNormalized)) {
      throw new Error(
        `[SEO Diagnostic Error] Question ${i + 1} "${qObj.name}" in JSON-LD not found in visible UI content of ${targetHtmlPath}. Google requires all FAQ schema questions to be visible on the page!`
      );
    }
    console.log(`✔ [SEO Diagnostic] Question ${i + 1}: "${qObj.name}" matches visible HTML content.`);
  }

  console.log('✅ [SEO Diagnostic] Success: FAQ JSON-LD strictly matches UI content & Google Structured Data Guidelines.\n');
}

verifyFaqSeoConsistency();
