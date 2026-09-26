/**
 * scripts/test-parser.ts
 * سكريبت اختبارات شاملة لمحرك التحليل المتقدم في worker/src/parser.ts
 */

import { extractOtp, extractLinks, decodeHtmlEntities } from '../worker/src/parser';

interface TestCase {
  name: string;
  run: () => boolean;
}

const tests: TestCase[] = [
  // 1. Google Verification Codes
  {
    name: 'استخراج رمز Google بصيغة G-XXXXXX (مثل G-892104)',
    run: () => {
      const sample = 'Your Google verification code is G-892104. Don’t share it with anyone.';
      const otp = extractOtp(sample, null);
      return otp === 'G-892104';
    },
  },
  {
    name: 'استخراج رمز Google 5 خانات G-45129 داخل HTML',
    run: () => {
      const html = '<div style="font-size:16px"><p>رمز التحقق من Google هو: <b>G-45129</b></p></div>';
      const otp = extractOtp(null, html);
      return otp === 'G-45129';
    },
  },

  // 2. Divided Codes (Discord / Microsoft)
  {
    name: 'استخراج كود مقسم بواصلة (Discord: 491-820)',
    run: () => {
      const sample = 'Your Discord security code is 491-820. It will expire in 10 minutes.';
      const otp = extractOtp(sample, null);
      return otp === '491-820';
    },
  },
  {
    name: 'استخراج كود مقسم بمسافة (Microsoft: 123 456)',
    run: () => {
      const sample = 'Use verification code 123 456 to verify your account.';
      const otp = extractOtp(sample, null);
      return otp === '123 456';
    },
  },

  // 3. Alphanumeric Codes
  {
    name: 'استخراج كود أبجدي رقمي مسبوق بكلمة دلالية (X7K9P2)',
    run: () => {
      const sample = 'Your login confirmation code is: X7K9P2';
      const otp = extractOtp(sample, null);
      return otp === 'X7K9P2';
    },
  },
  {
    name: 'استخراج كود أبجدي رقمي بالعربية (رمز التحقق: 9AF42B)',
    run: () => {
      const sample = 'مرحباً، رمز التحقق الخاص بك هو 9AF42B لتأكيد الدخول.';
      const otp = extractOtp(sample, null);
      return otp === '9AF42B';
    },
  },

  // 4. False Positive Exclusions (Years, Times, CSS Colors)
  {
    name: 'استبعاد السنوات الشائعة كأكواد عشوائية (2025 / 2026)',
    run: () => {
      const sample = 'Copyright 2026 Temp Mail Service Inc. All rights reserved.';
      const otp = extractOtp(sample, null);
      return otp === null;
    },
  },
  {
    name: 'استبعاد أكواد ألوان الـ CSS والوقت (مثل #1A2B3C و 12:30)',
    run: () => {
      const sample = 'Sent at 12:30 with color #262626 and font size 1080px.';
      const otp = extractOtp(sample, null);
      return otp === null;
    },
  },
  {
    name: 'تفضيل كود التحقق الفعلي حتى بوجود سنة في البريد',
    run: () => {
      const sample = 'Thank you for joining in 2026. Your activation pin is 894012.';
      const otp = extractOtp(sample, null);
      return otp === '894012';
    },
  },

  // 5. HTML Entity Decoding in Links
  {
    name: 'فك تشفير كيانات HTML التالفة في روابط التفعيل (&amp; -> &)',
    run: () => {
      const html = '<a href="https://example.com/verify?token=xyz123&amp;action=activate&amp;ref=email">Click here</a>';
      const links = extractLinks(html, null);
      return links.length > 0 && links[0] === 'https://example.com/verify?token=xyz123&action=activate&ref=email';
    },
  },

  // 6. Plaintext URL Extraction with Punctuation Stripping
  {
    name: 'استخراج الروابط من رسائل نصية صرفة مع تجريد الأقواس والنقاط',
    run: () => {
      const text = 'Please verify by visiting: (https://service.org/auth/confirm?code=9988).\nThank you!';
      const links = extractLinks(null, text);
      return links.length > 0 && links[0] === 'https://service.org/auth/confirm?code=9988';
    },
  },

  // 7. Link Prioritization & Unsubscribe Filtering
  {
    name: 'ترتيب روابط التفعيل أولا وتصفية روابط إلغاء الاشتراك (Unsubscribe)',
    run: () => {
      const html = `
        <div>
          <a href="https://brand.com/newsletter/unsubscribe?id=44">Unsubscribe</a>
          <a href="https://brand.com/terms">Terms</a>
          <a href="https://brand.com/users/activate-account?token=secure789">Confirm Account</a>
        </div>
      `;
      const links = extractLinks(html, null);
      // رابط التفعيل يجب أن يكون في المقدمة، ورابط unsubscribe يجب استبعاده
      return links.length > 0 && links[0].includes('activate-account') && !links.includes('https://brand.com/newsletter/unsubscribe?id=44');
    },
  },

  // 8. Advanced Verification Coverage: Steam Guard & 2FA Codes
  {
    name: 'استخراج كود Steam Guard الأبجدي الرقمي (W4K8X)',
    run: () => {
      const sample = 'Your Steam Guard code is: W4K8X. Enter it to access your account.';
      const otp = extractOtp(sample, null);
      return otp === 'W4K8X';
    },
  },
  {
    name: 'استخراج كود Two-Factor Authentication (2FA: 719204)',
    run: () => {
      const sample = 'Your Two-Factor Authentication code is 719204. Valid for 5 minutes.';
      const otp = extractOtp(sample, null);
      return otp === '719204';
    },
  },

  // 9. Button CTA Anchor Text Recognition for Tracked URLs
  {
    name: 'التعرف على رابط التفعيل من نص الزر (Anchor Text) حتى لو كان الرابط Redirect غير مباشر',
    run: () => {
      const html = `
        <div>
          <a href="https://click.sendgrid.net/ls/click?upn=xyz789">Confirm Your Email Address</a>
          <a href="https://service.com/help">Help Center</a>
        </div>
      `;
      const links = extractLinks(html, null);
      return links.length > 0 && links[0] === 'https://click.sendgrid.net/ls/click?upn=xyz789';
    },
  },
  {
    name: 'التعرف على زر التفعيل بالعربية في الروابط المشفرة',
    run: () => {
      const html = `
        <div>
          <a href="https://track.mailer.net/r/a1b2c3d4">تأكيد وتفعيل الحساب الآن</a>
          <a href="https://track.mailer.net/privacy">الخصوصية</a>
        </div>
      `;
      const links = extractLinks(html, null);
      return links.length > 0 && links[0] === 'https://track.mailer.net/r/a1b2c3d4';
    },
  },
];

console.log('🧪 [Parser Test Suite] بدء تشغيل اختبارات محرك التحليل المتقدم...');
let passedCount = 0;

for (let i = 0; i < tests.length; i++) {
  const t = tests[i];
  try {
    const ok = t.run();
    if (ok) {
      console.log(`  ✅ [PASS] ${i + 1}. ${t.name}`);
      passedCount++;
    } else {
      console.error(`  ❌ [FAIL] ${i + 1}. ${t.name}`);
    }
  } catch (err) {
    console.error(`  ❌ [ERROR] ${i + 1}. ${t.name}:`, err);
  }
}

console.log(`\n📊 النتيجة: ${passedCount} من أصل ${tests.length} اختبارات نجحت بنسبة ${Math.round((passedCount / tests.length) * 100)}%.`);

if (passedCount !== tests.length) {
  process.exit(1);
}
