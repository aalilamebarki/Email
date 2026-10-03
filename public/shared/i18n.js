/**
 * i18n.js - محرك التدويل وترجمة الواجهة الفوري لـ 22 لغة عالمية
 * freetemp.email
 */
(function () {
  var LANGUAGES = [
    { code: 'ar', name: 'Arabic', native: 'العربية', dir: 'rtl' },
    { code: 'en', name: 'English', native: 'English', dir: 'ltr' },
    { code: 'fr', name: 'French', native: 'Français', dir: 'ltr' },
    { code: 'es', name: 'Spanish', native: 'Español', dir: 'ltr' },
    { code: 'de', name: 'German', native: 'Deutsch', dir: 'ltr' },
    { code: 'pt', name: 'Portuguese', native: 'Português', dir: 'ltr' },
    { code: 'it', name: 'Italian', native: 'Italiano', dir: 'ltr' },
    { code: 'ru', name: 'Russian', native: 'Русский', dir: 'ltr' },
    { code: 'tr', name: 'Turkish', native: 'Türkçe', dir: 'ltr' },
    { code: 'zh', name: 'Chinese', native: '简体中文', dir: 'ltr' },
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
    { code: 'bn', name: 'Bengali', native: 'বাংলা', dir: 'ltr' },
    { code: 'ms', name: 'Malay', native: 'Bahasa Melayu', dir: 'ltr' }
  ];

  var DICTIONARIES = {
    ar: {
      home: 'الرئيسية',
      blog: 'المدونة',
      articles: 'المقالات',
      guide: 'دليل الاستخدام',
      faq: 'الأسئلة الشائعة',
      statusLive: 'بث حي متصل',
      statusOffline: 'غير متصل (جاري الربط...)',
      addressLabel: 'عنوان بريدك المؤقت:',
      newAddress: 'عنوان جديد',
      copyAddress: 'نسخ العنوان',
      copied: 'تم النسخ!',
      expiresIn: 'ينتهي خلال:',
      extendTime: '+10 دقائق',
      burnMailbox: 'إتلاف الصندوق',
      inboxTitle: 'صندوق الوارد المباشر',
      waitingEmails: 'بانتظار وصول الرسائل... تصلك الرسائل فور إرسالها دون الحاجة لتحديث الصفحة.',
      selectEmail: 'اختر رسالة لعرض محتواها واستخراج كود التفعيل.',
      heroTitle: 'بريد مؤقت مجاني وفوري لحماية خصوصيتك واستقبال رسائل التحقق',
      heroSubtitle: 'أنشئ عنوان بريد إلكتروني مؤقت بضغطة زر واحدة. استقبل رموز OTP ورسائل التفعيل في صندوق وارد مباشر دون الحاجة إلى إنشاء حساب أو مشاركة بياناتك الشخصية.',
      howItWorksTitle: 'كيف يعمل البريد المؤقت؟ (3 خطوات بسيطة وسريعة)',
      step1Badge: 'الخطوة 01',
      step1Title: 'إنشاء عنوان البريد المؤقت تلقائياً',
      step1Desc: 'بمجرد دخولك إلى الصفحة، يتم توليد عنوان بريد إلكتروني عشوائي فريد ومحمي فوراً وجاهز للاستخدام.',
      step2Badge: 'الخطوة 02',
      step2Title: 'استخدام العنوان في الموقع أو التطبيق المستهدف',
      step2Desc: 'انسخ العنوان واستخدمه في نموذج التسجيل في أي موقع، منتدى، أو خدمة تطلب التحقق عبر البريد الإلكتروني.',
      step3Badge: 'الخطوة 03',
      step3Title: 'استقبال الرسائل واستخراج رمز التحقق فوراً',
      step3Desc: 'تصل الرسالة فوراً وتظهر في صندوق الوارد المباشر أدناه مع استخراج تلقائي لرمز التحقق (OTP) أو روابط التفعيل.',
      feat1Title: 'خصوصية كاملة وانعدام تام للتتبع',
      feat1Desc: 'لا نطلب تسجيل حساب ولا نخزن أي ملفات تعريف ارتباط (Cookies) أو بصمات رقمية لجهازك.',
      feat2Title: 'تدمير ذاتي وحذف فوري للبيانات',
      feat2Desc: 'تُحذف جميع الرسائل والبيانات تلقائياً بعد 20 دقيقة، مع خيار الإتلاف الفوري بضغطة زر.',
      feat3Title: 'استخراج ذكي لرموز التحقق (OTP)',
      feat3Desc: 'يقوم المحرك الذكي بعزل واستخراج كود التفعيل بوضوح مع زر نسخ سريع لتوفير وقتك.',
      faqSectionTitle: 'الأسئلة الشائعة حول خدمة البريد المؤقت',
      faq1Question: 'ما هو البريد المؤقت ولماذا أحتاجه؟',
      faq1Answer: 'البريد المؤقت هو عنوان بريد إلكتروني صالح لفترة محدودة، يساعدك في التسجيل بالمواقع دون الكشف عن بريدك الشخصي، مما يحميك من الرسائل المزعجة (Spam) والتتبع.',
      faq2Question: 'كم تدوم صلاحية عنوان البريد المؤقت؟',
      faq2Answer: 'تدوم الصلاحية الافتراضية 20 دقيقة، ويمكنك تمديدها بـ 10 دقائق إضافية في أي وقت بالضغط على زر (+10 دقائق).',
      faq3Question: 'هل الخدمة مجانية تماماً وبدون تسجيل؟',
      faq3Answer: 'نعم، المنصة مجانية 100% ولا تتطلب أي تسجيل أو إدخال أي بيانات شخصية.',
      faq4Question: 'هل يستطيع أحد غيري قراءة رسائلي؟',
      faq4Answer: 'لا، يتم حماية كل صندوق برمز أمان سري (Secret Token) معزول ومشفر لا يمتلكه سوى متصفحك.',
      footerTransparency: 'الشفافية والامتثال',
      footerAbout: 'من نحن',
      footerPrivacy: 'سياسة الخصوصية',
      footerTerms: 'شروط الاستخدام',
      footerSecurity: 'معايير الأمان والتشفير',
      footerSec1: 'إتلاف ذاتي فوري بعد 20 دقيقة',
      footerSec2: 'عزل مشفر بحاويات O(1)',
      footerSec3: 'بدون تسجيل بيانات شخصية أو كوكيز',
      footerCopyright: '© 2026 FreeTemp.email — بريد مؤقت مجاني. جميع الحقوق محفوظة.',
      footerTls: 'تشفير TLS 1.3 256-Bit',
      footerEdge: 'سحابي فائق السرعة Cloudflare Edge',
      footerLogs: 'خالٍ تماماً من السجلات (Zero-Logs)',
      footerDesc: 'خدمة بريد مؤقت سريعة وآمنة لحماية خصوصيتك من الرسائل المزعجة وتفادي التتبع.',
      footerNav: 'روابط هامة',
      footerNodesStatus: 'خوادم نشطة ومحمية عالمياً',
      otpLabel: 'رمز التحقق السريع:',
      copyOtp: 'نسخ الكود',
      copiedOtp: 'تم نسخ الرمز!',
      openLink: 'فتح رابط التفعيل',
      burnConfirmTitle: 'تأكيد إتلاف الصندوق',
      burnConfirmText: 'هل أنت متأكد من رغبتك في إتلاف صندوق البريد وحذف كافة الرسائل نهائياً الآن؟',
      confirmBurn: 'نعم، إتلاف الآن',
      cancel: 'إلغاء',
      simulateEmail: 'إرسال بريد تجريبي للتجربة',
      sender: 'المرسل:',
      date: 'التاريخ:',
      subject: 'الموضوع:'
    },
    en: {
      home: 'Home',
      blog: 'Blog',
      articles: 'Articles',
      guide: 'User Guide',
      faq: 'FAQ',
      statusLive: 'Live Feed Connected',
      statusOffline: 'Disconnected (Reconnecting...)',
      addressLabel: 'Your Temporary Email Address:',
      newAddress: 'New Address',
      copyAddress: 'Copy Address',
      copied: 'Copied!',
      expiresIn: 'Expires in:',
      extendTime: '+10 Minutes',
      burnMailbox: 'Burn Mailbox',
      inboxTitle: 'Live Incoming Inbox',
      waitingEmails: 'Waiting for incoming messages... Emails appear instantly as soon as sent without refreshing the page.',
      selectEmail: 'Select an email from the list to preview content and extract OTP.',
      heroTitle: 'Free Instant Temporary Email to Protect Your Privacy and Receive Verification Codes',
      heroSubtitle: 'Generate a disposable temporary email address in one click. Receive OTP verification codes and activation links in a live inbox without registering or sharing personal data.',
      howItWorksTitle: 'How Does Temp Mail Work? (3 Fast & Easy Steps)',
      step1Badge: 'Step 01',
      step1Title: 'Generate Temporary Address Automatically',
      step1Desc: 'As soon as you visit the page, a unique, encrypted disposable email address is instantly ready for use.',
      step2Badge: 'Step 02',
      step2Title: 'Use the Address on Target Website or App',
      step2Desc: 'Copy the address and paste it into any signup form, forum, or service requiring email verification.',
      step3Badge: 'Step 03',
      step3Title: 'Receive Messages & Extract OTP Instantly',
      step3Desc: 'Incoming emails appear instantaneously in the live inbox with automatic extraction of OTP codes and links.',
      feat1Title: 'Complete Privacy & Zero Tracking',
      feat1Desc: 'We require no signup and store zero tracking cookies or digital browser fingerprints.',
      feat2Title: 'Auto Self-Destruction & Zero Logs',
      feat2Desc: 'All messages and mailboxes permanently self-destruct after 20 minutes, with instant manual burn available.',
      feat3Title: 'Smart OTP & Activation Link Extraction',
      feat3Desc: 'Our engine automatically detects and extracts 2FA codes with a one-click copy button.',
      faqSectionTitle: 'Frequently Asked Questions About Temp Mail',
      faq1Question: 'What is a temporary email and why do I need one?',
      faq1Answer: 'A temporary email is a disposable mailbox valid for a short time, keeping your real inbox safe from spam, newsletters, and data leaks.',
      faq2Question: 'How long does a temporary email address last?',
      faq2Answer: 'It lasts for 20 minutes by default. You can extend it by 10 minutes at any time by clicking (+10 Minutes).',
      faq3Question: 'Is this service 100% free with no registration required?',
      faq3Answer: 'Yes, FreeTemp.email is completely free with no signup, passwords, or personal info required.',
      faq4Question: 'Can anyone else read my private messages?',
      faq4Answer: 'No, every mailbox is protected by an isolated, cryptographically secure Secret Access Token tied solely to your browser.',
      footerTransparency: 'Transparency & Compliance',
      footerAbout: 'About Us',
      footerPrivacy: 'Privacy Policy',
      footerTerms: 'Terms of Service',
      footerSecurity: 'Security & Encryption Standards',
      footerSec1: 'Automatic self-destruction after 20 minutes',
      footerSec2: 'Encrypted isolation with O(1) containers',
      footerSec3: 'Zero personal data collection or tracking cookies',
      footerCopyright: '© 2026 FreeTemp.email — Free Temporary Email. All rights reserved.',
      footerTls: 'TLS 1.3 256-Bit Encryption',
      footerEdge: 'Ultra-Fast Cloudflare Edge',
      footerLogs: 'Strict Zero-Logs Architecture',
      footerDesc: 'Ultra-fast and secure disposable temporary email service designed to protect your privacy and shield you from spam.',
      footerNav: 'Quick Navigation',
      footerNodesStatus: 'Globally Protected & Distributed Edge Nodes',
      otpLabel: 'Quick Verification Code:',
      copyOtp: 'Copy OTP',
      copiedOtp: 'OTP Copied!',
      openLink: 'Open Activation Link',
      burnConfirmTitle: 'Confirm Mailbox Burn',
      burnConfirmText: 'Are you sure you want to permanently delete this mailbox and all stored messages now?',
      confirmBurn: 'Yes, Burn Now',
      cancel: 'Cancel',
      simulateEmail: 'Send Test Email for Verification',
      sender: 'From:',
      date: 'Date:',
      subject: 'Subject:'
    }
  };

  // Helper to generate localized dictionaries with fallback to EN
  function getDict(lang) {
    if (DICTIONARIES[lang]) return DICTIONARIES[lang];
    var base = Object.assign({}, DICTIONARIES.en);
    return base;
  }

  function getCurrentLang() {
    var path = window.location.pathname;
    var match = path.match(/^\/([a-z]{2})(?:\/|$)/i);
    if (match) {
      var code = match[1].toLowerCase();
      var exists = LANGUAGES.some(function (l) { return l.code === code; });
      if (exists) return code;
    }
    try {
      var saved = localStorage.getItem('freetemp_lang');
      if (saved) return saved;
    } catch (e) {}
    var navLang = (navigator.language || navigator.userLanguage || 'ar').slice(0, 2).toLowerCase();
    var hasNavLang = LANGUAGES.some(function (l) { return l.code === navLang; });
    return hasNavLang ? navLang : 'ar';
  }

  function setLanguage(lang) {
    try {
      localStorage.setItem('freetemp_lang', lang);
    } catch (e) {}

    var currentPath = window.location.pathname;
    var currentLangMatch = currentPath.match(/^\/([a-z]{2})(\/.*)?$/i);
    var subPath = '';

    if (currentLangMatch) {
      subPath = currentLangMatch[2] || '/';
    } else {
      subPath = currentPath;
    }

    if (!subPath || subPath === '/') {
      subPath = '';
    }

    var targetUrl = '/' + lang + (subPath.startsWith('/') ? subPath : '/' + subPath);
    if (lang === 'ar' && (subPath === '' || subPath === '/')) {
      targetUrl = '/ar/';
    }

    window.location.href = targetUrl;
  }

  function translatePage() {
    var lang = getCurrentLang();
    var dict = getDict(lang);
    var elements = document.querySelectorAll('[data-i18n]');

    elements.forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key]) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.setAttribute('placeholder', dict[key]);
        } else {
          el.textContent = dict[key];
        }
      }
    });

    var isRtl = lang === 'ar' || lang === 'fa' || lang === 'ur';
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
  }

  // إنشاء Modal اختيار اللغة في DOM
  function createLangModal() {
    if (document.getElementById('lang-modal')) return;

    var modal = document.createElement('div');
    modal.id = 'lang-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm hidden email-modal-backdrop p-4';
    
    var content = '<div class="bg-white dark:bg-[#141414] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[85vh] flex flex-col text-right">' +
      '<div class="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">' +
        '<h3 class="text-base font-bold text-black dark:text-white">اختر لغة المنصة / Select Language</h3>' +
        '<button id="close-lang-modal" class="p-1 rounded-lg text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">' +
          '<svg class="w-5 h-5 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' +
        '</button>' +
      '</div>' +
      '<div class="grid grid-cols-2 sm:grid-cols-3 gap-2 overflow-y-auto py-4">';

    LANGUAGES.forEach(function (l) {
      content += '<button data-lang="' + l.code + '" class="lang-select-btn flex flex-col p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white hover:bg-neutral-50 dark:hover:bg-neutral-900 text-right transition-all">' +
        '<span class="font-bold text-sm text-black dark:text-white">' + l.native + '</span>' +
        '<span class="text-xs text-neutral-500 font-mono">' + l.name + '</span>' +
      '</button>';
    });

    content += '</div></div>';
    modal.innerHTML = content;
    document.body.appendChild(modal);

    document.getElementById('close-lang-modal').addEventListener('click', function () {
      modal.classList.add('hidden');
    });

    modal.addEventListener('click', function (e) {
      if (e.target === modal) modal.classList.add('hidden');
    });

    var btns = modal.querySelectorAll('.lang-select-btn');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var code = btn.getAttribute('data-lang');
        if (code) {
          modal.classList.add('hidden');
          setLanguage(code);
        }
      });
    });
  }

  function openLangModal() {
    createLangModal();
    var modal = document.getElementById('lang-modal');
    if (modal) modal.classList.remove('hidden');
  }

  window.freetemp_i18n = {
    getLang: getCurrentLang,
    setLang: setLanguage,
    t: function (key) {
      var dict = getDict(getCurrentLang());
      return dict[key] || key;
    },
    translatePage: translatePage,
    openLangModal: openLangModal,
    languages: LANGUAGES
  };

  document.addEventListener('DOMContentLoaded', function () {
    translatePage();
    createLangModal();

    var langTriggers = document.querySelectorAll('#open-lang-picker, .open-lang-picker, #current-lang-label, #lang-btn, [data-action="open-lang-modal"], .lang-switch-btn');
    langTriggers.forEach(function (t) {
      t.addEventListener('click', function (e) {
        e.preventDefault();
        openLangModal();
      });
    });
  });
})();
