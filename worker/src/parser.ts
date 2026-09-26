/**
 * parser.ts
 * محرك التحليل المتقدم لاستخراج أكواد المصادقة (OTP) وفك تشفير وتصفية روابط التفعيل
 * 
 * الميزات:
 * 1. دعم أكواد Google بصيغة G-XXXXXX (مثل G-892104 أو G-45129).
 * 2. دعم الأكواد المقسمة بواصلة أو مسافة (Discord / Microsoft) مثل 491-820 و 123 456.
 * 3. دعم الأكواد الأبجدية الرقمية (Alphanumeric) المسبوقة أو المتبوعة بكلمات دلالية ثنائية اللغة
 *    (code, otp, verification, verify, pin, token, confirmation, security code, رمز, تحقق, كود, تأكيد, تفعيل).
 * 4. استبعاد السنوات (2018-2030)، التواريخ، الأوقات، وألوان الـ Hex ومقاسات الـ CSS.
 * 5. فك ترميز كيانات HTML التالفة في الروابط مثل &amp; إلى &.
 * 6. استخراج الروابط من الرسائل النصية النقية (Plaintext) وتجريد علامات الترقيم والأقواس المحيطة.
 * 7. ترتيب الروابط حسب الأولوية وتصفية روابط إلغاء الاشتراك (Unsubscribe).
 * 8. حماية متقدمة من هجمات ReDoS وكفاءة الذاكرة عبر تقييد سقف النص (100KB).
 */

const MAX_SCAN_LENGTH = 100 * 1024; // 100 كيلوبايت

/**
 * الكلمات الدلالية الأساسية للتحقق بمختلف اللغات والخدمات
 */
const OTP_BASE_KEYWORDS = 
  '(?:code|otp|verification(?:\\s+code)?|verify(?:\\s+code)?|security\\s+code|confirmation(?:\\s+code)?|passcode|pin|token|access\\s+code|auth\\s+code|two-factor(?:\\s+code)?|2fa(?:\\s+code)?|one-time\\s+(?:password|code|passcode)|steam\\s+guard(?:\\s+code)?|login\\s+code|temporary\\s+password|رمز(?:\\s+التحقق|\\s+التأكيد|\\s+الأمان|\\s+الدخول)?|كود(?:\\s+التحقق|\\s+التأكيد|\\s+الأمان|\\s+الدخول)?|كلمة\\s+المرور\\s+المؤقتة|تحقق|تأكيد|تفعيل)';

/**
 * الكلمات الرابطة الشائعة بين الكلمة الدلالية والكود
 * مثل: "code is: X", "رمز التحقق الخاص بك هو: X", "verification code: X"
 */
const CONNECTING_PHRASES = 
  '(?:[\\s:=-]*(?:is|هو|is\\s+your|الخاص\\s+بك\\s+هو|الخاص\\s+بك|كالتالي)?[\\s:=-]*)';

/**
 * الكلمات الإنجليزية الشائعة التي لا تعتبر كود تحقق
 */
const STOP_WORDS = new Set([
  'THIS', 'THAT', 'CODE', 'HERE', 'FROM', 'WITH', 'YOUR', 'USER', 'HTML', 'HTTP',
  'HTTPS', 'EMAIL', 'MAILS', 'RESET', 'CLICK', 'CHECK', 'VALID', 'LOGIN', 'LOGON',
  'ENTER', 'PHONE', 'ALERT', 'ABOUT', 'TERMS', 'COUNT', 'TOTAL', 'STATE', 'LINKS',
  'PLEASE', 'THANKS', 'SECURE', 'VERIFY', 'UPDATE', 'NUMBER', 'ACTIVE', 'ONLINE'
]);

/**
 * السنوات الشائعة المطلوب استبعادها كأكواد عشوائية
 */
const COMMON_YEARS = new Set([
  '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'
]);

/**
 * تنظيف وسوم HTML واستخراج النص الصافي بكفاءة عالية
 */
function cleanHtmlContent(rawHtml: string): string {
  if (!rawHtml) return '';
  const trimmed = rawHtml.length > MAX_SCAN_LENGTH ? rawHtml.slice(0, MAX_SCAN_LENGTH) : rawHtml;
  return trimmed
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ');
}

/**
 * التحقق من صلاحية كود الـ OTP واستبعاد الأرقام والكلمات العادية
 */
function isValidOtpCandidate(code: string): boolean {
  if (!code) return false;
  const clean = code.trim();

  // 1) كود جوجل G-XXXXXX
  if (/^G-[0-9]{4,8}$/i.test(clean)) return true;

  // 2) كود مقسم (123-456 أو 123 456)
  if (/^[0-9]{3}[- ][0-9]{3,4}$/.test(clean)) {
    const digitsOnly = clean.replace(/[^0-9]/g, '');
    return digitsOnly.length >= 6 && digitsOnly.length <= 8;
  }

  const digitsOnly = clean.replace(/[^0-9]/g, '');

  // 3) رقم مجرد
  if (digitsOnly === clean) {
    if (clean.length === 4 && COMMON_YEARS.has(clean)) {
      return false;
    }
    return clean.length >= 4 && clean.length <= 8;
  }

  // 4) كود أبجدي رقمي (Alphanumeric) من 4 إلى 8 خانات
  if (/^[A-Za-z0-9]{4,8}$/.test(clean)) {
    const upper = clean.toUpperCase();
    if (STOP_WORDS.has(upper)) return false;
    // استبعاد الكلمات التي لا تحتوي على أرقام إذا كانت أحرفا مألوفة
    const hasDigit = /[0-9]/.test(clean);
    const hasLetter = /[A-Za-z]/.test(clean);
    if (!hasDigit && !hasLetter) return false;
    // استبعاد تكرار حرف واحد مثل "AAAA"
    if (/^(.)\1+$/.test(clean)) return false;
    return true;
  }

  return false;
}

/**
 * 1) دالة استخراج كود التحقق (OTP)
 */
export function extractOtp(text?: string | null, html?: string | null): string | null {
  const safeText = text ? (text.length > MAX_SCAN_LENGTH ? text.slice(0, MAX_SCAN_LENGTH) : text) : '';
  const cleanedHtml = html ? cleanHtmlContent(html) : '';
  const combined = `${safeText}\n${cleanedHtml}`;

  if (!combined.trim()) return null;

  // ---------------------------------------------------------------------------
  // أ) فحص رموز Google المباشرة: G-XXXXXX (أولوية عليا)
  // ---------------------------------------------------------------------------
  const googleRegex = /\b(G-[0-9]{4,8})\b/i;
  const googleMatch = combined.match(googleRegex);
  if (googleMatch && googleMatch[1]) {
    return googleMatch[1].toUpperCase().trim();
  }

  // ---------------------------------------------------------------------------
  // ب) فحص الكود بعد كلمات دلالية مباشرة (مع دعم الكلمات الرابطة مثل is: أو هو:)
  // ---------------------------------------------------------------------------
  const forwardRegex = new RegExp(
    `${OTP_BASE_KEYWORDS}${CONNECTING_PHRASES}([A-Za-z0-9]{3}[- ][A-Za-z0-9]{3,4}|[A-Za-z0-9]{4,8})\\b`,
    'iu'
  );
  const forwardMatch = combined.match(forwardRegex);
  if (forwardMatch && forwardMatch[1]) {
    const candidate = forwardMatch[1].trim();
    if (isValidOtpCandidate(candidate)) {
      return candidate;
    }
  }

  // ---------------------------------------------------------------------------
  // ج) فحص الكود متبوعا بكلمة دلالية (Backward / Reverse Matching)
  // مثال: "491820 هو رمز التحقق الخاص بك" أو "940212 is your verification code"
  // ---------------------------------------------------------------------------
  const backwardRegex = new RegExp(
    `\\b([A-Za-z0-9]{3}[- ][A-Za-z0-9]{3,4}|[A-Za-z0-9]{4,8})[\\s:=-]+(?:is your (?:code|otp|verification|pin|security code|passcode)|هو (?:رمز|كود))`,
    'iu'
  );
  const backwardMatch = combined.match(backwardRegex);
  if (backwardMatch && backwardMatch[1]) {
    const candidate = backwardMatch[1].trim();
    if (isValidOtpCandidate(candidate)) {
      return candidate;
    }
  }

  // ---------------------------------------------------------------------------
  // د) فحص الأكواد المقسمة المنعزلة (مثل 491-820 أو 821-394)
  // ---------------------------------------------------------------------------
  const dividedRegex = /\b([0-9]{3}-[0-9]{3,4})\b/g;
  let divMatch: RegExpExecArray | null;
  while ((divMatch = dividedRegex.exec(combined)) !== null) {
    const cand = divMatch[1];
    if (isValidOtpCandidate(cand)) {
      return cand;
    }
  }

  // ---------------------------------------------------------------------------
  // هـ) البحث عن متتالية أرقام منفصلة من 4 إلى 8 خانات (مع فلترة التواريخ والألوان)
  // ---------------------------------------------------------------------------
  // استبعاد ألوان CSS مثل #123456 أو #abcdef
  const noColorsCombined = combined.replace(/#[0-9a-fA-F]{3,8}\b/g, ' ');
  // استبعاد الأوقات مثل 12:30:45 أو 10:25
  const noTimesCombined = noColorsCombined.replace(/\b[0-9]{1,2}:[0-9]{2}(?::[0-9]{2})?\b/g, ' ');
  // استبعاد أحجام الملفات والوحدات مثل 2048KB, 1080px, 100%
  const noUnitsCombined = noTimesCombined.replace(/\b[0-9]+(?:px|kb|mb|gb|%|ms|s)\b/gi, ' ');

  const standaloneRegex = /(?:^|\s|\(|\[|"|')([0-9]{4,8})(?:\s|\)|\]|"|'|$)/gm;
  let match: RegExpExecArray | null;
  while ((match = standaloneRegex.exec(noUnitsCombined)) !== null) {
    const num = match[1].trim();
    if (isValidOtpCandidate(num)) {
      return num;
    }
  }

  return null;
}

/**
 * فك تشفير كيانات HTML التالفة في الروابط
 */
export function decodeHtmlEntities(url: string): string {
  if (!url) return '';
  return url
    .replace(/&amp;/gi, '&')
    .replace(/&#39;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#x2F;/gi, '/')
    .replace(/&#47;/gi, '/')
    .replace(/&nbsp;/gi, ' ')
    .trim();
}

/**
 * تنظيف الرابط من علامات الترقيم والأقواس المحيطة به في النصوص
 */
function sanitizeUrl(rawUrl: string): string | null {
  if (!rawUrl) return null;
  let url = decodeHtmlEntities(rawUrl).trim();

  // تكرار تنظيف علامات الترقيم والأقواس غير المغلقة حتى يصبح الرابط نظيفا
  let prev = '';
  while (prev !== url) {
    prev = url;
    // تجريد علامات الاقتباس والأقواس المحيطة
    url = url.replace(/^[("'«“‘<]+|[)"'»”’>]+$/g, '');
    // تجريد علامات الترقيم في نهاية الرابط
    url = url.replace(/[.,:;!?]+$/, '');

    // معالجة الأقواس غير المتطابقة
    if (url.endsWith(')') && !url.includes('(')) {
      url = url.slice(0, -1);
    }
    if (url.endsWith(']') && !url.includes('[')) {
      url = url.slice(0, -1);
    }
    if (url.endsWith('}') && !url.includes('{')) {
      url = url.slice(0, -1);
    }
  }

  // التحقق من صلاحية الرابط وأنه يبدأ بـ http:// أو https://
  if (!/^https?:\/\/[a-z0-9.-]+\.[a-z]{2,}/i.test(url)) {
    return null;
  }

  return url;
}

/**
 * تقييم أهمية الرابط لتصنيفه في المقدمة استناداً إلى عنوان الـ URL ونص الزر/الرابط (Anchor Text)
 */
function getLinkPriority(url: string, anchorText: string = ''): number {
  const lowerUrl = url.toLowerCase();
  const lowerAnchor = anchorText.toLowerCase();

  // روابط إلغاء الاشتراك والروابط غير المفيدة
  if (
    lowerUrl.includes('unsubscribe') ||
    lowerUrl.includes('optout') ||
    lowerUrl.includes('opt-out') ||
    lowerUrl.includes('list-unsubscribe') ||
    lowerUrl.includes('privacy') ||
    lowerUrl.includes('terms') ||
    lowerUrl.includes('cookie') ||
    lowerAnchor.includes('unsubscribe') ||
    lowerAnchor.includes('إلغاء الاشتراك')
  ) {
    return -1;
  }

  let score = 0;

  // 1) فحص نص الزر أو الرابط (الأولوية القصوى لأزرار ورسائل التفعيل المباشرة)
  if (
    /verify|verification|activate|activation|confirm|confirmation|complete registration|validate/i.test(lowerAnchor) ||
    /تأكيد|تفعيل|تأكيد الحساب|تفعيل البريد|إتمام التسجيل/i.test(lowerAnchor)
  ) {
    score += 15;
  } else if (
    /login|sign in|signin|magic link|log in|reset password/i.test(lowerAnchor) ||
    /تسجيل الدخول|دخول|رابط الدخول|إعادة تعيين كلمة المرور/i.test(lowerAnchor)
  ) {
    score += 10;
  } else if (/click here|اضغط هنا|open link/i.test(lowerAnchor)) {
    score += 5;
  }

  // 2) فحص نص الـ URL
  if (/verify|verification|activate|activation|confirm|confirmation|auth|validate|token=|code=/i.test(lowerUrl)) {
    score += 10;
  }
  if (/login|signin|magic-link|password|reset/i.test(lowerUrl)) {
    score += 5;
  }

  return score;
}

/**
 * 2) دالة استخراج روابط التفعيل والتأكيد
 */
export function extractLinks(html?: string | null, text?: string | null): string[] {
  const foundSet = new Set<string>();
  const priorityMap = new Map<string, number>();

  // أ) استخراج الروابط مع نص الزر/الرابط من وسوم <a> في الـ HTML
  if (html && typeof html === 'string') {
    const safeHtml = html.length > MAX_SCAN_LENGTH ? html.slice(0, MAX_SCAN_LENGTH) : html;
    const anchorRegex = /<a\s+[^>]*href=["']([^"'>]+)["'][^>]*>([\s\S]*?)<\/a>/gi;
    let aMatch: RegExpExecArray | null;
    while ((aMatch = anchorRegex.exec(safeHtml)) !== null) {
      const cleanedUrl = sanitizeUrl(aMatch[1]);
      if (cleanedUrl) {
        foundSet.add(cleanedUrl);
        const anchorText = aMatch[2].replace(/<[^>]+>/g, ' ').trim();
        const prio = getLinkPriority(cleanedUrl, anchorText);
        const currentPrio = priorityMap.get(cleanedUrl) || 0;
        if (prio > currentPrio || !priorityMap.has(cleanedUrl)) {
          priorityMap.set(cleanedUrl, prio);
        }
      }
    }

    // استخراج أي href إضافي لم يلتقطه وسم <a> كامل
    const hrefRegex = /href\s*=\s*["']([^"'>]+)["']/gi;
    let match: RegExpExecArray | null;
    while ((match = hrefRegex.exec(safeHtml)) !== null) {
      const cleaned = sanitizeUrl(match[1]);
      if (cleaned && !foundSet.has(cleaned)) {
        foundSet.add(cleaned);
        priorityMap.set(cleaned, getLinkPriority(cleaned, ''));
      }
    }
  }

  // ب) استخراج الروابط الصريحة من النص الصافي (Plaintext)
  const textSource = text || (html ? html.replace(/<[^>]+>/g, ' ') : '');
  if (textSource && typeof textSource === 'string') {
    const safeText = textSource.length > MAX_SCAN_LENGTH ? textSource.slice(0, MAX_SCAN_LENGTH) : textSource;
    const plainUrlRegex = /(https?:\/\/[^\s<>"'{}|\\^`[\]]+)/gi;
    let textMatch: RegExpExecArray | null;
    while ((textMatch = plainUrlRegex.exec(safeText)) !== null) {
      const cleaned = sanitizeUrl(textMatch[1]);
      if (cleaned && !foundSet.has(cleaned)) {
        foundSet.add(cleaned);
        priorityMap.set(cleaned, getLinkPriority(cleaned, ''));
      }
    }
  }

  const allUrls = Array.from(foundSet);
  for (const u of allUrls) {
    if (!priorityMap.has(u)) {
      priorityMap.set(u, getLinkPriority(u, ''));
    }
  }

  const validActionLinks = allUrls.filter((u) => (priorityMap.get(u) || 0) > 0);
  const neutralLinks = allUrls.filter((u) => (priorityMap.get(u) || 0) === 0);
  const lowPriorityLinks = allUrls.filter((u) => (priorityMap.get(u) || 0) < 0);

  // إعادة روابط التفعيل أولا ثم الروابط المحايدة، واستبعاد الروابط غير المفيدة
  if (validActionLinks.length > 0) {
    validActionLinks.sort((a, b) => (priorityMap.get(b) || 0) - (priorityMap.get(a) || 0));
    return [...validActionLinks, ...neutralLinks];
  }

  return [...neutralLinks, ...lowPriorityLinks];
}
