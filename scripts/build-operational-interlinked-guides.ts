import fs from 'node:fs';
import path from 'node:path';

interface OperationalSpec {
  slug: string;
  categoryAr: string;
  categoryEn: string;
  titleAr: string;
  titleEn: string;
  leadAr: string;
  leadEn: string;
  readTime: string;
  datePublished: string;
  highlightsAr: string[];
  highlightsEn: string[];
  step1TitleAr: string;
  step1TitleEn: string;
  step1ContentAr: string;
  step1ContentEn: string;
  step2TitleAr: string;
  step2TitleEn: string;
  step2ContentAr: string;
  step2ContentEn: string;
  related: Array<{
    slug: string;
    titleAr: string;
    titleEn: string;
    descAr: string;
    descEn: string;
    tagAr: string;
    tagEn: string;
  }>;
  faqs: Array<{
    qAr: string;
    aAr: string;
    qEn: string;
    aEn: string;
  }>;
}

const operationalGuides: OperationalSpec[] = [
  // 1. How to Receive OTP
  {
    slug: 'how-to-receive-otp.html',
    categoryAr: 'دليل استخدام عملي',
    categoryEn: 'Operational User Guide',
    titleAr: 'كيفية استقبال رمز التحقق (OTP) ونسخه فوريا بنقرة واحدة والتأكد من صحته',
    titleEn: 'How to Receive OTP Verification Codes and Copy Them Instantly in 1-Click',
    leadAr: 'دليل عملي تفصيلي يوضح كيفية استقبال رموز التحقق الرقمية والأبجدية وتوكنات جوجل من خلال ميزة استخراج الرموز التلقائية والنسخ بنقرة واحدة إلى الحافظة.',
    leadEn: 'A detailed operational guide on receiving numeric, alphanumeric, and Google tokens with automated extraction and 1-click clipboard integration.',
    readTime: '4 mins read',
    datePublished: '2026-09-21',
    highlightsAr: [
      'استخراج تلقائي فوري لأكواد التحقق الرقمية وتوكنات Google G-XXXXXX في شريط بارز.',
      'نسخ فوري بنقرة واحدة إلى الحافظة مع مؤشر تأكيد مرئي لمدة ثانيتين.',
      'تكامل تام مع التحديث اللحظي عبر WebSocket دون الحاجة لإعادة تحميل الصفحة.',
      'حظر افتراضي للصور وبكسلات التتبع لحماية عنوان IP الخاص بك.'
    ],
    highlightsEn: [
      'Automated instant extraction of numeric passcodes and Google G-tokens into a prominent hero banner.',
      '1-click clipboard copying with visual confirmation ("Copied! ✓") for 2 seconds.',
      'Full integration with real-time WebSocket updates without manual page refreshes.',
      'Default tracking pixel blocking protecting your IP address during message inspection.'
    ],
    step1TitleAr: 'الخطوة 1: توليد العنوان وتقديمه في حقل التسجيل',
    step1TitleEn: 'Step 1: Obtain Your Address & Submit to Web Form',
    step1ContentAr: `
      <p class="mb-3">
        عند دخولك إلى الموقع، يظهر لك عنوان مؤقت نشط. اضغط على زر "نسخ" لنقله إلى حافظة جهازك كما هو مشروح في <a href="/ar/articles/how-to-copy-address.html" class="font-bold underline text-black dark:text-white">دليل نسخ عنوان البريد المؤقت</a>.
      </p>
      <p class="text-xs text-neutral-600 dark:text-neutral-400">
        الصق العنوان في موقع التسجيل المستهدف (مثل تويتر، ديسكورد، نتفلكس، أو أدوات الذكاء الاصطناعي). بفضل <a href="/ar/articles/temp-mail-vs-spam-filters.html" class="font-bold underline text-black dark:text-white">عزل الذاكرة وحظر بكسلات التتبع</a>، تظل هويتك الحقيقية في مأمن تام.
      </p>
    `,
    step1ContentEn: `
      <p class="mb-3">
        Upon visiting the application, your active temporary address is ready. Click "Copy" to place it cleanly in your clipboard as explained in our <a href="/en/articles/how-to-copy-address.html" class="font-bold underline text-black dark:text-white">Copy Address Guide</a>.
      </p>
      <p class="text-xs text-neutral-600 dark:text-neutral-400">
        Paste the address into your target registration form. With <a href="/en/articles/temp-mail-vs-spam-filters.html" class="font-bold underline text-black dark:text-white">O(1) memory isolation</a>, your real identity remains shielded from cross-site ad brokers.
      </p>
    `,
    step2TitleAr: 'الخطوة 2: استلام الكود ونسخه بضغطة زر واحدة',
    step2TitleEn: 'Step 2: Instant Code Extraction & 1-Click Copy',
    step2ContentAr: `
      <p class="mb-3">
        بمجرد إرسال الخدمة لكود التفعيل، تدفعه خوادمنا عبر <a href="/ar/articles/how-inbox-updates-live.html" class="font-bold underline text-black dark:text-white">البث اللحظي عبر WebSocket</a> في أقل من 300 ميلي ثانية دون إعادة تحميل.
      </p>
      <p class="mb-3">
        يقوم محرك <a href="/ar/articles/universal-verification-coverage.html" class="font-bold underline text-black dark:text-white">التغطية الشاملة لرسائل التحقق (UVC)</a> بمسح متن الرسالة، واستخراج الكود في مربع عالي التباين يحمل زر "نسخ الرمز". إذا كانت الرسالة تحتوي على رابط تفعيل بدلاً من كود، راجع <a href="/ar/articles/how-to-open-verification-links.html" class="font-bold underline text-black dark:text-white">دليل فتح روابط التفعيل بأمان</a>.
      </p>
    `,
    step2ContentEn: `
      <p class="mb-3">
        The instant the sender dispatches the email, our edge nodes stream the payload via <a href="/en/articles/how-inbox-updates-live.html" class="font-bold underline text-black dark:text-white">Real-Time WebSocket Streaming</a> in under 300ms without page reloads.
      </p>
      <p class="mb-3">
        Our <a href="/en/articles/universal-verification-coverage.html" class="font-bold underline text-black dark:text-white">Universal Verification Coverage Engine</a> isolates the token into a dedicated high-contrast banner with a 1-click "Copy OTP" button. If the email contains an activation link instead of a passcode, consult our <a href="/en/articles/how-to-open-verification-links.html" class="font-bold underline text-black dark:text-white">Safe Link Opening Guide</a>.
      </p>
    `,
    related: [
      {
        slug: 'universal-verification-coverage.html',
        titleAr: 'التغطية الشاملة لرسائل التحقق (UVC)',
        titleEn: 'Universal Verification Coverage (UVC)',
        descAr: 'كيف يفك محركنا شفرات أكواد جوجل وستيم جارد بدقة 100%.',
        descEn: 'How our engine decodes complex tokens with 100% accuracy.',
        tagAr: 'معمارية التحقق',
        tagEn: 'Verification Core'
      },
      {
        slug: 'how-inbox-updates-live.html',
        titleAr: 'التحديث اللحظي عبر WebSocket',
        titleEn: 'Real-Time WebSocket Streaming',
        descAr: 'كيف تصل رسائل OTP إلى شاشتك في أجزاء من الثانية.',
        descEn: 'How inbound OTP emails push to your screen within milliseconds.',
        tagAr: 'البنية التحتية',
        tagEn: 'Infrastructure'
      },
      {
        slug: 'magic-links-vs-otp.html',
        titleAr: 'الروابط السحرية مقابل رموز OTP',
        titleEn: 'Magic Links vs. OTP Verification Codes',
        descAr: 'المقايضات الأمنية بين الأكواد الرقمية وروابط الدخول السحرية.',
        descEn: 'Security trade-offs between passcodes and passwordless links.',
        tagAr: 'هندسة المصادقة',
        tagEn: 'Authentication'
      }
    ],
    faqs: [
      {
        qAr: 'أين أجد كود التحقق في الرسالة؟',
        aAr: 'يظهر كود التحقق في أعلى شاشة تفاصيل الرسالة في شريط مخصص وبارز يحمل زر "نسخ الرمز".',
        qEn: 'Where do I find the verification code inside the email view?',
        aEn: 'The extracted OTP appears in a prominent high-contrast banner at the top of the message view with a dedicated "Copy OTP" button.'
      },
      {
        qAr: 'ماذا لو كانت الرسالة تحتوي على رابط بدلاً من كود رقمي؟',
        aAr: 'يقوم محركنا باستخراج الرابط تلقائياً وعرضه في لوحة "روابط التحقق المباشرة" لفتحه أو نسخه بضغطة واحدة.',
        qEn: 'What if the email contains a confirmation link instead of a numeric code?',
        aEn: 'Our engine extracts the destination URL into a dedicated "Direct Verification Links" panel for instant 1-click launching or copying.'
      }
    ]
  },

  // 2. How to Generate Address
  {
    slug: 'how-to-generate-address.html',
    categoryAr: 'دليل استخدام عملي',
    categoryEn: 'Operational User Guide',
    titleAr: 'كيفية توليد وتغيير عنوان بريد مؤقت جديد بنقرة واحدة وبأمان',
    titleEn: 'How to Generate and Change a Disposable Email Address in 1 Click',
    leadAr: 'إرشادات عملية لتوليد وتدوير عناوين البريد المؤقت العشوائية فورياً لعزل التسجيلات وحماية خصوصيتك الرقمية.',
    leadEn: 'Operational guidelines for rotating and generating randomized ephemeral email addresses to segment online accounts cleanly.',
    readTime: '3 mins read',
    datePublished: '2026-09-20',
    highlightsAr: [
      'توليد عنوان مؤقت عشوائي وجاهز للاستخدام فورياً بمجرد فتح التطبيق.',
      'إمكانية تدوير وتغيير العنوان في أي لحظة بضغطة زر واحدة (تغيير العنوان ↻).',
      'إتلاف فوري لرسائل الصندوق السابق عند تغيير العنوان لحماية السرية.',
      'عداد تنازلي نشط لمدة 20 دقيقة مع زر تمديد إضافي +10 دقائق.'
    ],
    highlightsEn: [
      'Instant randomized temporary address generated on page load ready for immediate use.',
      'One-click address rotation to instantly discard current mailbox and provision a new one.',
      'Immediate purging of prior inbox records upon rotation for maximum hygiene.',
      'Active 20-minute session countdown with +10 minute extension capabilities.'
    ],
    step1TitleAr: 'الخطوة 1: فحص العنوان المولد والعداد التنازلي',
    step1TitleEn: 'Step 1: Inspect Generated Address & Session Timer',
    step1ContentAr: `
      <p class="mb-3">
        بمجرد زيارة الموقع، يتم حجز حاوية معزولة لك في الذاكرة الحية. يظهر العنوان في الصندوق العلوي بجوار مؤشر الصلاحية (20:00 دقيقة). يمكنك قراءة المزيد حول هذه المهلة في <a href="/ar/articles/what-happens-when-address-expires.html" class="font-bold underline text-black dark:text-white">دليل انتهاء صلاحية البريد المؤقت</a>.
      </p>
      <p class="text-xs text-neutral-600 dark:text-neutral-400">
        العنوان جاهز فورياً لاستقبال الرسائل عبر <a href="/ar/articles/how-inbox-updates-live.html" class="font-bold underline text-black dark:text-white">اتصال WebSocket اللحظي</a>.
      </p>
    `,
    step1ContentEn: `
      <p class="mb-3">
        Upon accessing the platform, an isolated in-memory container is instantiated. Your address appears in the top hero bar alongside the 20-minute countdown. Read more in <a href="/en/articles/what-happens-when-address-expires.html" class="font-bold underline text-black dark:text-white">What Happens When an Address Expires</a>.
      </p>
      <p class="text-xs text-neutral-600 dark:text-neutral-400">
        The mailbox is immediately receptive to incoming messages via <a href="/en/articles/how-inbox-updates-live.html" class="font-bold underline text-black dark:text-white">Real-Time WebSocket Streaming</a>.
      </p>
    `,
    step2TitleAr: 'الخطوة 2: النقر على "تغيير العنوان ↻" للتدوير الفوري',
    step2TitleEn: 'Step 2: Click "Change Address ↻" to Rotate',
    step2ContentAr: `
      <p class="mb-3">
        عندما ترغب في فصل تسجيلاتك بين عدة مواقع، اضغط على زر "تغيير العنوان". يتم مسح الصندوق القديم وتوليد بادئة جديدة عشوائية تماماً وخالية من أي تصادم في أقل من 100 ميلي ثانية.
      </p>
      <p class="mb-3">
        بعد التوليد، استخدم <a href="/ar/articles/how-to-copy-address.html" class="font-bold underline text-black dark:text-white">زر النسخ السريع</a> لنقل العنوان دون أخطاء إلى الموقع المطلوب.
      </p>
    `,
    step2ContentEn: `
      <p class="mb-3">
        Whenever you wish to segment accounts across services, click "Change Address". The existing container is wiped and a fresh, collision-resistant randomized prefix is generated in under 100ms.
      </p>
      <p class="mb-3">
        Following generation, consult our <a href="/en/articles/how-to-copy-address.html" class="font-bold underline text-black dark:text-white">Copy Address Guide</a> to transfer the text error-free into signup forms.
      </p>
    `,
    related: [
      {
        slug: 'how-to-copy-address.html',
        titleAr: 'دليل نسخ العنوان بنقرة واحدة',
        titleEn: 'How to Copy Address in 1-Click',
        descAr: 'كيفية نسخ العنوان للحافظة وتجنب أخطاء المسافات البيضاء.',
        descEn: 'Proper clipboard copying techniques to avoid whitespace errors.',
        tagAr: 'دليل عملي',
        tagEn: 'Practical Guide'
      },
      {
        slug: 'what-happens-when-address-expires.html',
        titleAr: 'انتهاء الصلاحية والإتلاف الذاتي',
        titleEn: 'Address Expiration & Auto-Purge',
        descAr: 'ما يحدث بعد 20 دقيقة وكيفية تمديد الوقت أو إتلاف الصندوق.',
        descEn: 'What happens after 20 minutes and how to extend session duration.',
        tagAr: 'دورة الحياة',
        tagEn: 'Lifecycle'
      },
      {
        slug: 'how-to-receive-otp.html',
        titleAr: 'استقبال أكواد OTP بنقرة واحدة',
        titleEn: 'Receive OTP Verification Codes',
        descAr: 'كيف تستقبل رسائل التحقق بعد تقديم العنوان في المواقع.',
        descEn: 'How to extract verification passcodes after submitting your address.',
        tagAr: 'دليل عملي',
        tagEn: 'Practical Guide'
      }
    ],
    faqs: [
      {
        qAr: 'هل يمكنني اختيار اسم البريد بنفسي؟',
        aAr: 'يتم توليد البادئة عشوائياً وفق معايير أمان عالية لتفادي أي تصادم أو إمكانية تخمين لبريدك من أطراف خارجية.',
        qEn: 'Can I choose a custom mailbox prefix?',
        aEn: 'Prefixes are generated cryptographically to eliminate namespace collisions and prevent third parties from guessing your inbox address.'
      },
      {
        qAr: 'كم مرة يمكنني تغيير العنوان؟',
        aAr: 'يمكنك تغيير وتوليد عنوان جديد عدد لا نهائي من المرات وبشكل مجاني وفوري.',
        qEn: 'How many times can I rotate my temporary address?',
        aEn: 'You can rotate and generate fresh addresses infinitely with zero rate-limits or hidden paywalls.'
      }
    ]
  },

  // 3. How to Copy Address
  {
    slug: 'how-to-copy-address.html',
    categoryAr: 'دليل استخدام عملي',
    categoryEn: 'Operational User Guide',
    titleAr: 'كيفية نسخ عنوان البريد المؤقت بنقرة واحدة والتأكد من صحته وتفادي الأخطاء',
    titleEn: 'How to Copy Temporary Email Address in 1-Click Without Whitespace Errors',
    leadAr: 'إرشادات عملية لنسخ عنوان البريد المؤقت بدقة إلى الحافظة وتجنب أخطاء المسافات البيضاء الشائعة في نماذج التسجيل.',
    leadEn: 'Practical instructions for copying your temporary email cleanly to the clipboard, preventing whitespace syntax errors in signup forms.',
    readTime: '2 mins read',
    datePublished: '2026-09-21',
    highlightsAr: [
      'زر نسخ مخصص بنقرة واحدة متصل بمكتبة Clipboard API الرسمية.',
      'تأكيد مرئي فوري بتغيير نص الزر إلى "تم النسخ ✓" لمدة ثانيتين.',
      'تجريد تلقائي لأي مسافات بيضاء غير مرئية قد تؤدي لرفض العنوان في المواقع.',
      'متوافق 100% مع أجهزة آيفون، أندرويد، ويندوز، وماك.'
    ],
    highlightsEn: [
      'Dedicated 1-click copy button integrated with official browser Clipboard API.',
      'Instant visual confirmation updating button text to "Copied! ✓" for 2 seconds.',
      'Automatic stripping of leading/trailing whitespace preventing syntax rejections.',
      '100% compatible across iOS, Android, macOS, and Windows browsers.'
    ],
    step1TitleAr: 'الخطوة 1: تحديد موقع زر "نسخ" المخصص',
    step1TitleEn: 'Step 1: Locate the Dedicated Copy Button',
    step1ContentAr: `
      <p class="mb-3">
        بجانب مربع العنوان في أعلى الصفحة، ستجد زراً أسود يحمل أيقونة الحافظة وكلمة "نسخ". إذا كنت بحاجة لتغيير العنوان أولاً، راجع <a href="/ar/articles/how-to-generate-address.html" class="font-bold underline text-black dark:text-white">دليل توليد عنوان جديد</a>.
      </p>
    `,
    step1ContentEn: `
      <p class="mb-3">
        Next to the address display bar, locate the black button with the clipboard icon labeled "Copy". If you need to rotate the address first, see our <a href="/en/articles/how-to-generate-address.html" class="font-bold underline text-black dark:text-white">Generate Address Guide</a>.
      </p>
    `,
    step2TitleAr: 'الخطوة 2: النقر والتأكد من ظهور رسالة "تم النسخ ✓"',
    step2TitleEn: 'Step 2: Click and Verify the Visual Confirmation',
    step2ContentAr: `
      <p class="mb-3">
        انقر على الزر مرة واحدة. يتحول الزر فوراً إلى "تم النسخ ✓"، ويتم نقل العنوان بالكامل شاملاً النطاق لحافظة جهازك. الصقه الآن في نموذج التسجيل، ثم انتظر وصول رسالتك عبر <a href="/ar/articles/how-inbox-updates-live.html" class="font-bold underline text-black dark:text-white">التحديث اللحظي عبر WebSocket</a> لتستخرج الكود كما في <a href="/ar/articles/how-to-receive-otp.html" class="font-bold underline text-black dark:text-white">دليل استقبال كود OTP</a>.
      </p>
    `,
    step2ContentEn: `
      <p class="mb-3">
        Click the button once. The text updates immediately to "Copied! ✓", transferring the full address into your clipboard. Paste it into your target form and await delivery via <a href="/en/articles/how-inbox-updates-live.html" class="font-bold underline text-black dark:text-white">Real-Time WebSocket Streaming</a>, ready for extraction as detailed in our <a href="/en/articles/how-to-receive-otp.html" class="font-bold underline text-black dark:text-white">OTP Reception Guide</a>.
      </p>
    `,
    related: [
      {
        slug: 'how-to-generate-address.html',
        titleAr: 'توليد وتغيير العنوان المؤقت',
        titleEn: 'Generate & Rotate Address',
        descAr: 'كيفية إنشاء بادئة بريد عشوائية جديدة في أي وقت.',
        descEn: 'How to provision randomized collision-resistant mailbox prefixes.',
        tagAr: 'دليل عملي',
        tagEn: 'Practical Guide'
      },
      {
        slug: 'how-to-receive-otp.html',
        titleAr: 'استقبال ونسخ كود OTP',
        titleEn: 'Receive & Copy OTP Codes',
        descAr: 'ما تفعله بعد لصق العنوان في موقع التسجيل.',
        descEn: 'Extracting verification tokens after submitting the address.',
        tagAr: 'دليل عملي',
        tagEn: 'Practical Guide'
      },
      {
        slug: 'temp-mail-vs-spam-filters.html',
        titleAr: 'عزل الذاكرة وحظر بكسلات التتبع',
        titleEn: 'Memory Isolation & Anti-Tracking',
        descAr: 'لماذا يحميك استخدام هذا العنوان من سماسرة البيانات.',
        descEn: 'Why using temporary addresses breaks cross-site correlation chains.',
        tagAr: 'هندسة الخصوصية',
        tagEn: 'Privacy Core'
      }
    ],
    faqs: [
      {
        qAr: 'هل ينسخ الزر النطاق كاملاً (مثل @domain.com)؟',
        aAr: 'نعم، ينسخ الزر العنوان الكامل والدقيق متضمناً اسم المستخدم وعلامة @ واسم النطاق دون أي نقص.',
        qEn: 'Does the copy button include the full domain (e.g., @domain.com)?',
        aEn: 'Yes. The clipboard utility writes the complete string including user prefix, @ symbol, and domain extension.'
      },
      {
        qAr: 'ماذا أفعل إذا ظهرت رسالة خطأ في موقع التسجيل؟',
        aAr: 'تأكد من عدم وجود مسافات إضافية أثناء اللصق، أو اضغط "تغيير العنوان" للحصول على بادئة أخرى.',
        qEn: 'What should I do if a third-party form rejects the address?',
        aEn: 'Ensure no trailing spaces were introduced, or click "Change Address" to rotate to a fresh randomized prefix.'
      }
    ]
  },

  // 4. How to Open Verification Links
  {
    slug: 'how-to-open-verification-links.html',
    categoryAr: 'دليل أمان الروابط',
    categoryEn: 'Link Security Guide',
    titleAr: 'كيفية فتح روابط التفعيل بأمان تام دون تسريب هويتك أو تعريض جهازك للتتبع',
    titleEn: 'How to Open Verification Links Safely Without Revealing Your Real Identity',
    leadAr: 'أفضل الممارسات الأمنية للتعامل مع روابط التفعيل المباشرة داخل رسائل التأكيد، وتجنب بكسلات التجسس، وفحص مجالات التوجيه بأمان.',
    leadEn: 'Best security practices for inspecting confirmation URLs, avoiding tracking beacons, and safely activating accounts in isolated sessions.',
    readTime: '4 mins read',
    datePublished: '2026-09-21',
    highlightsAr: [
      'استخراج تلقائي لزر التفعيل الأساسي (CTA) في لوحة "روابط التحقق المباشرة".',
      'حظر افتراضي لبكسلات التتبع داخل جسم الرسالة لحماية عنوان IP وموقعك الجغرافي.',
      'إمكانية نسخ الرابط المباشر لفتحه في متصفح خفي (Incognito) أو عبر شبكة VPN.',
      'تجنب حرق الروابط السحرية أحادية الاستخدام بفضل محرك الاستقبال السلبي.'
    ],
    highlightsEn: [
      'Automatic extraction of primary activation CTA buttons into a dedicated direct links panel.',
      'Default blocking of tracking beacons in the email body safeguarding IP and geography.',
      '1-click direct link copy capability for clean launching inside private or incognito windows.',
      'Passive parsing preventing premature invalidation of single-use magic login tokens.'
    ],
    step1TitleAr: 'الخطوة 1: فحص الرابط في لوحة الروابط المباشرة',
    step1TitleEn: 'Step 1: Inspect Extracted Links in the Dedicated Panel',
    step1ContentAr: `
      <p class="mb-3">
        عند فتح الرسالة، يقوم محرك <a href="/ar/articles/universal-verification-coverage.html" class="font-bold underline text-black dark:text-white">التغطية الشاملة لرسائل التحقق</a> بفحص شجرة HTML واستخراج رابط التفعيل في لوحة مستقلة تسمى <strong>"روابط التحقق المباشرة"</strong>.
      </p>
      <p class="text-xs text-neutral-600 dark:text-neutral-400">
        يمنع هذا الإجراء تشغيل أي أكواد جافاسكريبت أو بكسلات تجسس قد تتواجد داخل الرسالة كما هو مفصل في <a href="/ar/articles/temp-mail-vs-spam-filters.html" class="font-bold underline text-black dark:text-white">دراسة حظر بكسلات التتبع</a>.
      </p>
    `,
    step1ContentEn: `
      <p class="mb-3">
        Upon viewing an email, our <a href="/en/articles/universal-verification-coverage.html" class="font-bold underline text-black dark:text-white">Universal Verification Coverage Engine</a> scans the HTML tree and isolates the target URL into a dedicated <strong>"Direct Verification Links"</strong> panel.
      </p>
      <p class="text-xs text-neutral-600 dark:text-neutral-400">
        This prevents execution of tracking scripts embedded in message bodies, as covered in our <a href="/en/articles/temp-mail-vs-spam-filters.html" class="font-bold underline text-black dark:text-white">Tracking Pixel Blocking Analysis</a>.
      </p>
    `,
    step2TitleAr: 'الخطوة 2: النسخ أو الفتح في جلسة تصفح خاصة',
    step2TitleEn: 'Step 2: Copy or Launch in a Private Session',
    step2ContentAr: `
      <p class="mb-3">
        إذا كانت الخدمة تعتمد على رابط تسجيل دخول سحري لمرة واحدة، استخدم زر النسخ لفتح الرابط في نافذة خفية (Incognito) لتجنب ربطه بملفات تعريف الارتباط الخاصة بحساباتك الأخرى. لفهم كيفية حماية الروابط أحادية الاستخدام، اقرأ <a href="/ar/articles/magic-links-vs-otp.html" class="font-bold underline text-black dark:text-white">الروابط السحرية مقابل رموز OTP</a>.
      </p>
      <p class="text-xs text-neutral-600 dark:text-neutral-400">
        بعد إتمام التفعيل، يمكنك <a href="/ar/articles/what-happens-when-address-expires.html" class="font-bold underline text-black dark:text-white">إتلاف الصندوق فورياً</a> لضمان عدم بقاء أي أثر لبياناتك.
      </p>
    `,
    step2ContentEn: `
      <p class="mb-3">
        If the email delivers a single-use magic login token, click "Copy Link" and paste it into an incognito window to prevent correlation with your existing cookies. Learn how our engine protects single-use tokens in <a href="/en/articles/magic-links-vs-otp.html" class="font-bold underline text-black dark:text-white">Magic Links vs. OTP Codes</a>.
      </p>
      <p class="text-xs text-neutral-600 dark:text-neutral-400">
        Following activation, you can <a href="/en/articles/what-happens-when-address-expires.html" class="font-bold underline text-black dark:text-white">burn the mailbox immediately</a> to purge all session records permanently.
      </p>
    `,
    related: [
      {
        slug: 'magic-links-vs-otp.html',
        titleAr: 'الروابط السحرية مقابل رموز OTP',
        titleEn: 'Magic Links vs. OTP Verification Codes',
        descAr: 'كيف يمنع محركنا احتراق روابط تسجيل الدخول أحادية الاستخدام.',
        descEn: 'How passive ingestion prevents premature expiration of single-use tokens.',
        tagAr: 'هندسة المصادقة',
        tagEn: 'Authentication'
      },
      {
        slug: 'temp-mail-vs-spam-filters.html',
        titleAr: 'عزل الذاكرة وحظر بكسلات التتبع',
        titleEn: 'Memory Isolation & Anti-Tracking',
        descAr: 'كيف يحميك حظر الصور من تسريب موقعك الجغرافي عند فتح الرسائل.',
        descEn: 'How default image blocking protects your location during inspection.',
        tagAr: 'هندسة الخصوصية',
        tagEn: 'Privacy Core'
      },
      {
        slug: 'universal-verification-coverage.html',
        titleAr: 'التغطية الشاملة لرسائل التحقق (UVC)',
        titleEn: 'Universal Verification Coverage (UVC)',
        descAr: 'الآلية البرمجية لاستخراج روابط الأزرار المقنعة من الرسائل.',
        descEn: 'Algorithmic extraction of masked CTA buttons from inbound templates.',
        tagAr: 'معمارية التحقق',
        tagEn: 'Verification Core'
      }
    ],
    faqs: [
      {
        qAr: 'هل النقر على "فتح الرابط" آمن؟',
        aAr: 'نعم، لأن الرابط يتم استخراجه وتجريده من معلمات التتبع المزعجة، مع بقاء كافة صور وبكسلات الرسالة محظورة.',
        qEn: 'Is clicking "Open Link" safe?',
        aEn: 'Yes. The destination URL is extracted cleanly and stripped of tracking parameters, while in-body tracking pixels remain blocked.'
      },
      {
        qAr: 'كيف أفتح الرابط في متصفح خاص (Tor أو Incognito)؟',
        aAr: 'استخدم زر "نسخ الرابط" المباشر، ثم افتح نافذة تصفح خفي والصق الرابط في شريط العناوين.',
        qEn: 'How do I open the link in Tor or Incognito mode?',
        aEn: 'Use our 1-click "Copy Link" button, then open a private window and paste the URL into your address bar.'
      }
    ]
  },

  // 5. What Happens When Address Expires
  {
    slug: 'what-happens-when-address-expires.html',
    categoryAr: 'دليل الأمان ودورة الحياة',
    categoryEn: 'Lifecycle & Security Guide',
    titleAr: 'ماذا يحدث عند انتهاء صلاحية البريد المؤقت وكيف تحافظ على أمانك التام؟',
    titleEn: 'What Happens When a Temporary Email Address Expires & How to Stay Protected',
    leadAr: 'شرح معماري لدورة حياة الصندوق المؤقت المحددة بـ 20 دقيقة، وآلية التمديد (+10 دقائق)، وزر الإتلاف الفوري، والتطهير التام للذاكرة.',
    leadEn: 'An architectural explanation of the 20-minute ephemeral lifecycle, the +10 min extension mechanic, instant mailbox burning, and zero-retention memory shredding.',
    readTime: '3 mins read',
    datePublished: '2026-09-21',
    highlightsAr: [
      'مهلة نشطة لمدة 20 دقيقة تضمن وقتاً كافياً لإتمام التسجيل واستقبال الرمز.',
      'زر تمديد مرن (+10 دقائق) يمكن النقر عليه في أي وقت لتجديد العداد.',
      'زر "إتلاف الصندوق" للمسح الفوري عند الانتهاء دون انتظار انتهاء العداد.',
      'تمزيق رقمي مشفر لكافة الرسائل والملفات في الذاكرة الحية (RAM) دون أي أثر.'
    ],
    highlightsEn: [
      '20-minute active operational window providing ample time for verification workflows.',
      'Flexible +10 minute extension button allowing indefinite renewals during active sessions.',
      'Instant "Burn Mailbox" trigger to purge all records immediately without waiting for timeout.',
      'Zero-retention cryptographic RAM shredding leaving absolutely zero residual artifacts.'
    ],
    step1TitleAr: 'الخطوة 1: مراقبة العداد واستخدام زر التمديد (+10 دقائق)',
    step1TitleEn: 'Step 1: Monitor the Countdown & Use +10 Mins Extension',
    step1ContentAr: `
      <p class="mb-3">
        يبدأ العداد عند 20:00 دقيقة. إذا كانت الخدمة التي تسجل بها تتطلب وقتاً أطول، يمكنك النقر على زر <strong>"+10 دقائق"</strong> في أي لحظة لإضافة 10 دقائق جديدة.
      </p>
      <p class="text-xs text-neutral-600 dark:text-neutral-400">
        يظل <a href="/ar/articles/how-inbox-updates-live.html" class="font-bold underline text-black dark:text-white">اتصال WebSocket اللحظي</a> فعالاً ومستعداً لدفع الرسائل فور وصولها.
      </p>
    `,
    step1ContentEn: `
      <p class="mb-3">
        Your session initializes at 20:00. If your signup workflow requires extra time, click the <strong>"+10 mins"</strong> button at any moment to replenish your timer.
      </p>
      <p class="text-xs text-neutral-600 dark:text-neutral-400">
        The <a href="/en/articles/how-inbox-updates-live.html" class="font-bold underline text-black dark:text-white">Real-Time WebSocket Tunnel</a> remains active to stream incoming messages live.
      </p>
    `,
    step2TitleAr: 'الخطوة 2: انتهاء الصلاحية أو النقر على "إتلاف الصندوق"',
    step2TitleEn: 'Step 2: Timeout Expiration or 1-Click Mailbox Burning',
    step2ContentAr: `
      <p class="mb-3">
        عند وصول العداد إلى 00:00 أو عند نقرك على زر <strong>"إتلاف الصندوق"</strong>، يتم تنفيذ أمر تمزيق الذاكرة (Memory Purge). تُحذف كافة الرسائل وسجلات الجلسة نهائياً من ذاكرة خوادم الحافة.
      </p>
      <p class="text-xs text-neutral-600 dark:text-neutral-400">
        تضمن هذه الآلية تحقيق <a href="/ar/articles/temp-mail-vs-spam-filters.html" class="font-bold underline text-black dark:text-white">العزل الرياضي O(1)</a> بحيث لا يمكن لأي طرف استعادة رسائلك. لبدء جلسة جديدة، راجع <a href="/ar/articles/how-to-generate-address.html" class="font-bold underline text-black dark:text-white">دليل توليد عنوان جديد</a>.
      </p>
    `,
    step2ContentEn: `
      <p class="mb-3">
        When the clock reaches 00:00 or when you click <strong>"Burn Mailbox"</strong>, an automated memory purge executes. All message payloads and session objects are destroyed from edge RAM permanently.
      </p>
      <p class="text-xs text-neutral-600 dark:text-neutral-400">
        This enforces <a href="/en/articles/temp-mail-vs-spam-filters.html" class="font-bold underline text-black dark:text-white">Mathematical O(1) Ephemeral Isolation</a>, ensuring zero data recovery. To initiate a fresh session, visit our <a href="/en/articles/how-to-generate-address.html" class="font-bold underline text-black dark:text-white">Generate Address Guide</a>.
      </p>
    `,
    related: [
      {
        slug: 'temp-mail-vs-spam-filters.html',
        titleAr: 'عزل الذاكرة وحظر بكسلات التتبع',
        titleEn: 'Memory Isolation & Anti-Tracking',
        descAr: 'الضمانات الرياضية لعدم تخزين الرسائل في أي قواعد بيانات دائمة.',
        descEn: 'Mathematical guarantees of zero persistent database storage.',
        tagAr: 'هندسة الخصوصية',
        tagEn: 'Privacy Core'
      },
      {
        slug: 'how-to-generate-address.html',
        titleAr: 'توليد وتغيير العنوان المؤقت',
        titleEn: 'Generate & Rotate Address',
        descAr: 'كيفية إنشاء صندوق جديد فور انتهاء أو إتلاف الصندوق الحالي.',
        descEn: 'Spinning up a fresh isolated inbox after destroying your current address.',
        tagAr: 'دليل عملي',
        tagEn: 'Practical Guide'
      },
      {
        slug: 'how-inbox-updates-live.html',
        titleAr: 'التحديث اللحظي عبر WebSocket',
        titleEn: 'Real-Time WebSocket Streaming',
        descAr: 'كيف تدار جلسة الويب سوكت طوال فترة الـ 20 دقيقة.',
        descEn: 'How WebSocket connections maintain lightweight persistence during active sessions.',
        tagAr: 'البنية التحتية',
        tagEn: 'Infrastructure'
      }
    ],
    faqs: [
      {
        qAr: 'هل يمكن استعادة الرسائل بعد إتلاف الصندوق؟',
        aAr: 'مستحيل تماماً. بمجرد الإتلاف أو انتهاء الوقت، يتم مسح مفاتيح التشفير وتطهير الذاكرة الحية فورياً دون أي نسخ احتياطية.',
        qEn: 'Can emails be recovered after burning the mailbox?',
        aEn: 'Absolutely impossible. Once destroyed or expired, cryptographic keys are discarded and RAM is purged with zero cloud backups.'
      },
      {
        qAr: 'كم مرة يمكنني الضغط على زر "+10 دقائق"؟',
        aAr: 'يمكنك تمديد الجلسة عدد غير محدود من المرات طالما أن الصندوق لا يزال نشطاً ولم ينتهِ وقته.',
        qEn: 'How many times can I click the "+10 mins" extension button?',
        aEn: 'You can extend the session indefinitely as long as the countdown has not reached zero.'
      }
    ]
  }
];

// Helper to generate unified footer
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

function generateOperationalPage(spec: OperationalSpec, lang: 'ar' | 'en') {
  const isAr = lang === 'ar';
  const prefix = isAr ? '/ar' : '/en';
  const dir = isAr ? 'rtl' : 'ltr';
  const font = isAr ? "font-['Cairo',sans-serif]" : "font-['Inter',sans-serif]";
  const arrow = isAr ? '←' : '→';

  const title = isAr ? spec.titleAr : spec.titleEn;
  const lead = isAr ? spec.leadAr : spec.leadEn;
  const category = isAr ? spec.categoryAr : spec.categoryEn;
  const highlights = isAr ? spec.highlightsAr : spec.highlightsEn;

  // Schema.org JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HowTo",
        "@id": `https://freetemp.email${prefix}/articles/${spec.slug}#howto`,
        "name": title,
        "description": lead,
        "inLanguage": lang,
        "datePublished": `${spec.datePublished}T08:00:00+00:00`,
        "dateModified": "2026-09-25T10:00:00+00:00",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": isAr ? spec.step1TitleAr : spec.step1TitleEn,
            "text": isAr ? spec.step1TitleAr : spec.step1TitleEn
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": isAr ? spec.step2TitleAr : spec.step2TitleEn,
            "text": isAr ? spec.step2TitleAr : spec.step2TitleEn
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": `https://freetemp.email${prefix}/articles/${spec.slug}#breadcrumb`,
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
            "item": `https://freetemp.email${prefix}/articles/${spec.slug}`
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `https://freetemp.email${prefix}/articles/${spec.slug}#faq`,
        "mainEntity": spec.faqs.map(f => ({
          "@type": "Question",
          "name": isAr ? f.qAr : f.qEn,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": isAr ? f.aAr : f.aEn
          }
        }))
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
    <meta name="author" content="Temp Mail Operations & Engineering Team" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://freetemp.email${prefix}/articles/${spec.slug}" />

    <!-- Multilingual Alternates -->
    <link rel="alternate" hreflang="ar" href="https://freetemp.email/ar/articles/${spec.slug}" />
    <link rel="alternate" hreflang="en" href="https://freetemp.email/en/articles/${spec.slug}" />
    <link rel="alternate" hreflang="x-default" href="https://freetemp.email/en/articles/${spec.slug}" />

    <!-- Open Graph Tags -->
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Temp Mail" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${lead}" />
    <meta property="og:url" content="https://freetemp.email${prefix}/articles/${spec.slug}" />
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
        <span class="text-black dark:text-white font-semibold">${category}</span>
      </nav>

      <!-- Article Main Container -->
      <article>
        <!-- Header -->
        <header class="mb-8">
          <div class="flex flex-wrap items-center gap-2 mb-3 text-[11px] font-mono">
            <span class="px-2.5 py-0.5 rounded-full bg-black text-white dark:bg-white dark:text-black font-bold uppercase tracking-wider text-[10px]">
              ${category}
            </span>
            <span class="text-neutral-400">•</span>
            <span class="text-neutral-500 font-mono">${spec.readTime}</span>
            <span class="text-neutral-400">•</span>
            <time datetime="${spec.datePublished}" class="text-neutral-500 font-mono">${spec.datePublished}</time>
          </div>

          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-black dark:text-white mb-4 leading-tight tracking-tight">
            ${title}
          </h1>

          <p class="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
            ${lead}
          </p>
        </header>

        <!-- Key Takeaways Box -->
        <div class="mb-10 p-5 sm:p-6 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm">
          <h2 class="text-sm font-bold text-black dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <svg class="w-4 h-4 text-emerald-500 stroke-current fill-none stroke-[2.5]" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
            ${isAr ? 'أبرز النقاط العملية في هذا الدليل' : 'Operational Key Highlights'}
          </h2>
          <ul class="space-y-3 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
            ${highlights.map(h => `
              <li class="flex items-start gap-2.5">
                <span class="text-black dark:text-white font-bold shrink-0 mt-0.5">✓</span>
                <span>${h}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <!-- Step-by-Step Instructions with In-Content Links -->
        <div class="space-y-8 mb-12">
          <section class="border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 bg-white dark:bg-[#121212] shadow-sm">
            <h2 class="text-lg sm:text-xl font-bold text-black dark:text-white mb-3">
              ${isAr ? spec.step1TitleAr : spec.step1TitleEn}
            </h2>
            <div class="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed space-y-3">
              ${isAr ? spec.step1ContentAr : spec.step1ContentEn}
            </div>
          </section>

          <section class="border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 bg-white dark:bg-[#121212] shadow-sm">
            <h2 class="text-lg sm:text-xl font-bold text-black dark:text-white mb-3">
              ${isAr ? spec.step2TitleAr : spec.step2TitleEn}
            </h2>
            <div class="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed space-y-3">
              ${isAr ? spec.step2ContentAr : spec.step2ContentEn}
            </div>
          </section>
        </div>

        <!-- In-Article FAQ -->
        <section class="mb-12">
          <h2 class="text-xl sm:text-2xl font-bold text-black dark:text-white mb-6">
            ${isAr ? 'أسئلة شائعة وإجابات سريعة' : 'Frequently Asked Questions'}
          </h2>
          <div class="space-y-4">
            ${spec.faqs.map(f => `
              <details class="group p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl transition-all cursor-pointer">
                <summary class="font-bold text-sm text-black dark:text-white flex items-center justify-between gap-4 list-none select-none">
                  <span>${isAr ? f.qAr : f.qEn}</span>
                  <span class="text-xs transition-transform duration-200 group-open:rotate-180 font-mono">▼</span>
                </summary>
                <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-3 leading-relaxed border-t border-neutral-200 dark:border-neutral-800 pt-3">
                  ${isAr ? f.aAr : f.aEn}
                </p>
              </details>
            `).join('')}
          </div>
        </section>

        <!-- Related Guides Grid (3 Curated Contextual Links) -->
        <section class="mb-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-lg sm:text-xl font-bold text-black dark:text-white">
                ${isAr ? 'أدلة ومعمارية ذات صلة بالموضوع' : 'Related Architectural & Practical Guides'}
              </h2>
              <p class="text-xs text-neutral-500">
                ${isAr ? 'استكشف المزيد من الأبحاث والشروحات العملية المتصلة بهذه الميزة' : 'Explore contextual guides on verification, performance, and security'}
              </p>
            </div>
            <a href="${prefix}/blog.html" class="text-xs font-bold underline text-black dark:text-white hidden sm:block">
              ${isAr ? 'عرض كافة المقالات ←' : 'Browse All Articles →'}
            </a>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${spec.related.map(r => `
              <article class="p-4 bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-black dark:hover:border-white transition-all flex flex-col justify-between shadow-sm">
                <div>
                  <span class="text-[10px] font-mono uppercase px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-neutral-600 dark:text-neutral-400 font-bold mb-2 inline-block">
                    ${isAr ? r.tagAr : r.tagEn}
                  </span>
                  <h3 class="font-bold text-xs sm:text-sm text-black dark:text-white mb-2 leading-snug">
                    <a href="${prefix}/articles/${r.slug}" class="hover:underline">
                      ${isAr ? r.titleAr : r.titleEn}
                    </a>
                  </h3>
                  <p class="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                    ${isAr ? r.descAr : r.descEn}
                  </p>
                </div>
                <a href="${prefix}/articles/${r.slug}" class="text-xs font-bold text-black dark:text-white hover:underline flex items-center gap-1 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <span>${isAr ? 'قراءة الدليل' : 'Read Guide'}</span>
                  <span>${arrow}</span>
                </a>
              </article>
            `).join('')}
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

// Generate the operational guides for ar and en
operationalGuides.forEach(spec => {
  const arHtml = generateOperationalPage(spec, 'ar');
  const enHtml = generateOperationalPage(spec, 'en');

  fs.writeFileSync(path.join('ar', 'articles', spec.slug), arHtml, 'utf8');
  fs.writeFileSync(path.join('public', 'ar', 'articles', spec.slug), arHtml, 'utf8');

  fs.writeFileSync(path.join('en', 'articles', spec.slug), enHtml, 'utf8');
  fs.writeFileSync(path.join('public', 'en', 'articles', spec.slug), enHtml, 'utf8');

  console.log(`✓ Generated operational interlinked guide: ${spec.slug} (ar & en)`);
});

console.log('✓ All operational guides enhanced with Google/Microsoft documentation style and contextual 3-way cross linking!');
