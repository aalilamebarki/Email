const fs = require('fs');
const path = require('path');

console.log('--- Generating 100% Rich Multilingual Homepages (All 7 Sections) ---');

// Complete language metadata
const ALL_LANGUAGES = [
  { code: 'ar', name: 'Arabic', native: 'العربية', dir: 'rtl', font: "'Cairo', sans-serif" },
  { code: 'en', name: 'English', native: 'English', dir: 'ltr', font: "'Inter', sans-serif" },
  { code: 'fr', name: 'French', native: 'Français', dir: 'ltr', font: "'Inter', sans-serif" },
  { code: 'es', name: 'Spanish', native: 'Español', dir: 'ltr', font: "'Inter', sans-serif" },
  { code: 'de', name: 'German', native: 'Deutsch', dir: 'ltr', font: "'Inter', sans-serif" },
  { code: 'pt', name: 'Portuguese', native: 'Português', dir: 'ltr', font: "'Inter', sans-serif" },
  { code: 'it', name: 'Italian', native: 'Italiano', dir: 'ltr', font: "'Inter', sans-serif" },
  { code: 'ru', name: 'Russian', native: 'Русский', dir: 'ltr', font: "'Inter', sans-serif" },
  { code: 'tr', name: 'Turkish', native: 'Türkçe', dir: 'ltr', font: "'Inter', sans-serif" },
  { code: 'zh', name: 'Chinese (Simplified)', native: '简体中文', dir: 'ltr', font: "'Noto Sans SC', sans-serif" },
  { code: 'ja', name: 'Japanese', native: '日本語', dir: 'ltr', font: "'Noto Sans JP', sans-serif" },
  { code: 'ko', name: 'Korean', native: '한국어', dir: 'ltr', font: "'Noto Sans KR', sans-serif" },
  { code: 'nl', name: 'Dutch', native: 'Nederlands', dir: 'ltr', font: "'Inter', sans-serif" },
  { code: 'pl', name: 'Polish', native: 'Polski', dir: 'ltr', font: "'Inter', sans-serif" },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia', dir: 'ltr', font: "'Inter', sans-serif" },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt', dir: 'ltr', font: "'Inter', sans-serif" },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', dir: 'ltr', font: "'Noto Sans Devanagari', sans-serif" },
  { code: 'fa', name: 'Persian', native: 'فارسی', dir: 'rtl', font: "'Vazirmatn', sans-serif" },
  { code: 'ur', name: 'Urdu', native: 'اردو', dir: 'rtl', font: "'Noto Nastaliq Urdu', serif" },
  { code: 'uk', name: 'Ukrainian', native: 'Українська', dir: 'ltr', font: "'Inter', sans-serif" },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', dir: 'ltr', font: "'Noto Sans Bengali', sans-serif" },
  { code: 'ms', name: 'Malay', native: 'Bahasa Melayu', dir: 'ltr', font: "'Inter', sans-serif" }
];

// Rich content definitions
const CONTENT = {
  ar: {
    nav: { home: 'الرئيسية', blog: 'المدونة', guide: 'دليل الاستخدام', faq: 'الأسئلة الشائعة' },
    heroTitle: 'بريد مؤقت مجاني وفوري لحماية خصوصيتك واستقبال رسائل التحقق',
    heroSub: 'أنشئ عنوان بريد إلكتروني مؤقت بضغطة زر واحدة. استقبل رموز OTP ورسائل التفعيل في صندوق وارد مباشر دون الحاجة إلى إنشاء حساب أو مشاركة بياناتك الشخصية.',
    sec1: 'يوفر لك موقع freetemp.email حلاً مجانياً وعملياً للحفاظ على خصوصيتك الرقمية عبر تزويدك بـ بريد مؤقت وهمي يمكن التخلص منه في ثوانٍ معدودة. استمتع بتصفح الإنترنت بحرية وأمان كاملين دون الخوف من تسريب بياناتك أو ملء بريدك الأساسي بالرسائل المزعجة (Spam).',
    sec2Title: 'ما هو البريد المؤقت ولماذا يحتاجه كل مستخدم للإنترنت؟',
    sec2P1: 'البريد المؤقت (المعروف أيضاً باسم البريد الوهمي أو الإيميل المؤقت أو Disposable Email) هو عنوان بريد إلكتروني صالح لفترة زمنية محددة يتم إنشاؤه تلقائياً دون الحاجة إلى تسجيل حساب أو إدخال أي معلومات شخصية مثل اسمك أو رقم هاتفك أو بريدك الإلكتروني الحقيقي.',
    sec2P2: 'تكمن الفائدة الكبرى للبريد المؤقت في قدرته على حمايتك من البريد المزعج (Spam)، ورسائل التسويق المتكررة، ومخاطر تسريب البيانات عند التسجيل في المواقع غير الموثوقة أو تحميل الملفات أو تجربة التطبيقات عبر الإنترنت. بمجرد انتهاء حاجتك من العنوان، يتم حذفه تلقائياً مع كافة الرسائل الواردة إليه نهائياً وبدون أي أثر.',
    sec3Title: 'كيف يعمل البريد المؤقت؟ (3 خطوات بسيطة وسريعة)',
    sec3Steps: [
      { num: '01', title: 'إنشاء عنوان البريد المؤقت تلقائياً', desc: 'بمجرد دخولك إلى الصفحة، يتم توليد عنوان بريد إلكتروني عشوائي فريد ومحمي فوراً وجاهز للاستخدام.' },
      { num: '02', title: 'استخدام العنوان في الموقع أو التطبيق المستهدف', desc: 'انسخ العنوان واستخدمه في نموذج التسجيل في أي موقع، منتدى، أو خدمة تطلب التحقق عبر البريد الإلكتروني.' },
      { num: '03', title: 'استقبال الرسائل واستخراج رمز التحقق فوراً', desc: 'تصل الرسالة فوراً وتظهر في صندوق الوارد المباشر أدناه مع استخراج تلقائي لرمز التحقق (OTP) أو روابط التفعيل.' }
    ],
    sec4Title: 'لماذا تختار freetemp.email؟ ميزات حقيقية مبنية لأجلك',
    sec4Sub: 'نحن لا نقدم مجرد بريد مؤقت عادي، بل منصة متكاملة مصممة بأحدث تقنيات الويب فائقة السرعة والأمان:',
    sec4Feats: [
      { title: 'بث حي وفوري عبر WebSocket', desc: 'تصلك الرسائل بشكل لحظي دون الحاجة إلى تحديث الصفحة يدوياً أو الانتظار، بفضل تقنية الاتصال المباشر.' },
      { title: 'استخراج تلقائي فوري لأكواد OTP', desc: 'يقوم نظامنا الذكي بقراءة الرسالة واستخراج رموز التحقق وأكواد OTP تلقائياً لتتمكن من نسخها بضغطة زر واحدة.' },
      { title: 'صلاحية مرنة مع خيار التمديد والحرق', desc: 'يبدأ العداد من 20 دقيقة، مع إمكانية التمديد لـ +10 دقائق إضافية كلما أردت، أو حرق الصندوق فوراً بضغطة زر.' },
      { title: 'عزل تام بدون تسجيل أو تتبع', desc: 'لا نطلب تسجيل دخول، ولا نجمع أي بيانات تعريفية أو عناوين IP، وتُحذف الرسائل نهائياً عند انتهاء الوقت.' }
    ],
    sec5Title: 'متى يجب عليك استخدام البريد المؤقت؟',
    sec5Sub: 'البريد المؤقت أداة فعالة في العديد من المواقف اليومية على شبكة الإنترنت:',
    sec5Cases: [
      { num: '01', title: 'التسجيل في المواقع والمنتديات غير المعروفة', desc: 'عندما ترغب في الوصول إلى محتوى موقع جديد دون المخاطرة بتسريب عنوانك الحقيقي لشركات التسويق.' },
      { num: '02', title: 'استقبال رسائل التفعيل وأكواد التحقق لمرة واحدة', desc: 'لتفعيل الحسابات التجريبية أو تنزيل المواد التعليمية والكتب الإلكترونية التي تشترط إدخال بريد إلكتروني.' },
      { num: '03', title: 'اختبار البرمجيات وتطبيقات الويب (QA Testing)', desc: 'يساعد المطورين ومختبري الجودة في اختبار تدفقات التسجيل المتعددة دون الحاجة لإنشاء حسابات بريد حقيقية معقدة.' },
      { num: '04', title: 'الحفاظ على صندوق بريدك الأساسي نظيفاً وخالياً من الرسائل الإعلانية', desc: 'تجنب الوقوع في فخ النشرات البريدية الإجبارية التي تصعب عملية إلغاء الاشتراك منها لاحقاً.' },
      { num: '05', title: 'الاستخدامات المؤقتة والاستفسارات العابرة', desc: 'طرح استفسار أو طلب عرض سعر من منصة تجارية لا تنوي التعامل الدائم معها في المستقبل.' }
    ],
    sec6Title: 'الخصوصية والحدود الهامة: ما يجب أن تعرفه قبل الاستخدام',
    sec6P1: 'نحن نلتزم بالشفافية الكاملة مع مستخدمينا؛ خدمة freetemp.email مصممة ومخصصة حصرياً للاستخدامات العادية وغير الحساسة. يتم حذف الرسائل والصناديق تلقائياً وبشكل نهائي بعد انتهاء مؤقت الجلسة (20 دقيقة أو بعد التمديد)، ولا يمكن استرجاع الرسائل المحذوفة تحت أي ظرف، نظراً لأننا لا نحتفظ بأي سجلات أو نسخ احتياطية للمراسلات في قواعد بيانات دائمة.',
    sec6P2: 'لذلك، نحذر بشدة من استخدام البريد المؤقت في المعاملات المالية، أو ربطه بحساباتك البنكية، أو استخدامه في منصات التواصل الاجتماعي الأساسية، أو الاشتراكات المدفوعة، أو استلام وثائق حكومية وقانونية وسرية. إذا فقدت الوصول إلى هذا العنوان فلن تتمكن من إعادة تعيين كلمة المرور لحسابك في تلك المواقع. استخدم الخدمة بحكمة كأداة لحماية الخصوصية للمهام المؤقتة فقط.',
    sec7Title: 'الأسئلة الشائعة والإجابات',
    sec7Faqs: [
      { q: 'هل خدمة freetemp.email مجانية حقاً وهل تتطلب التسجيل؟', a: 'نعم، الخدمة مجانية 100% تماماً وبدون أي رسوم خفية أو باقات مدفوعة. يمكنك البدء في استخدام بريدك المؤقت فور فتح الصفحة دون الحاجة لإنشاء حساب أو إدخال أي بيانات شخصية.' },
      { q: 'كم تبلغ مدة بقاء صندوق البريد المؤقت نشطاً؟', a: 'يبقى الصندوق نشطاً لمدة 20 دقيقة بشكل افتراضي. يمكنك تمديد الوقت بـ 10 دقائق إضافية كلما أردت عبر النقر على زر &quot;+10 دقائق&quot;، كما يمكنك حرق الصندوق وحذفه فوراً متى شئت.' },
      { q: 'هل يمكنني استقبال أكواد التفعيل OTP والروابط عبر هذا البريد؟', a: 'بالتأكيد، تم تحسين نظامنا خصيصاً لاستقبال رسائل التحقق وأكواد OTP الرقمية ورموز Google بسرعة فائقة، مع إمكانية نسخ الرمز أو النقر على رابط التفعيل بضغطة زر واحدة.' },
      { q: 'ماذا يحدث لرسائلي بعد انتهاء الوقت المحدد؟', a: 'بمجرد انتهاء مؤقت العداد التنازلي، يقوم النظام تلقائياً بمسح الصندوق وحذف جميع الرسائل نهائياً من الذاكرة المؤقتة لمنع أي وصول غير مصرح به إليها مستقبلاً.' },
      { q: 'هل يمكنني إرسال رسائل بريد إلكتروني من هذا العنوان المؤقت؟', a: 'لا، الخدمة مخصصة لاستقبال الرسائل فقط (Inbound Only) لحماية الخوادم من سوء الاستخدام ومنع إرسال الرسائل المزعجة (Spam) عبر الإنترنت.' },
      { q: 'هل يمكن لأي شخص آخر الدخول إلى صندوق البريد الخاص بي؟', a: 'يتم تأمين كل عنوان بريد مؤقت برمز وصول سري مشفر وفريد في متصفحك. لا يمكن لأي مستخدم آخر فتح صندوقك أثناء نشاط الجلسة، وبعد الحذف يتم إتلاف الصندوق كلياً.' }
    ]
  },
  en: {
    nav: { home: 'Home', blog: 'Blog', guide: 'Guide', faq: 'FAQ' },
    heroTitle: 'Free & Instant Disposable Temporary Email to Protect Your Privacy',
    heroSub: 'Generate a secure temporary email address in one click. Receive OTP verification codes and activation links in a live real-time inbox without account registration or personal data leakage.',
    sec1: 'FreeTemp.email provides a free, practical solution to safeguard your digital privacy with disposable inboxes ready in seconds. Browse the internet freely without fearing data brokers, tracking cookies, or having your primary inbox flooded with unwanted spam.',
    sec2Title: 'What is Disposable Email and Why Does Every Internet User Need It?',
    sec2P1: 'A disposable temporary email (also known as temp mail, fake email, or throwaway inbox) is a fully functional email address valid for a limited session. It is generated automatically without requiring signup, personal names, phone numbers, or credit cards.',
    sec2P2: 'The primary advantage of temp mail is absolute protection against spam, aggressive marketing newsletters, and credential leaks when signing up for unverified websites, downloading gated whitepapers, or testing applications. When your task is finished, the inbox and all its contents are permanently eradicated with zero trace.',
    sec3Title: 'How Does Temporary Email Work? (3 Fast & Easy Steps)',
    sec3Steps: [
      { num: '01', title: 'Instant Automatic Address Provisioning', desc: 'The moment you open the page, a unique, secure, and isolated temporary address is provisioned and ready for use.' },
      { num: '02', title: 'Use Address on Target Website or App', desc: 'Copy the address and paste it into registration forms, downloads, or trials requiring email verification.' },
      { num: '03', title: 'Receive Emails & Extract OTP Instantly', desc: 'Incoming emails appear instantly in your live inbox below with automated OTP passcode and activation link parsing.' }
    ],
    sec4Title: 'Why Choose FreeTemp.email? Real Features Built For You',
    sec4Sub: 'We do not just provide basic disposable email — we deliver a high-performance privacy platform powered by modern edge architecture:',
    sec4Feats: [
      { title: 'Live Real-Time WebSocket Streaming', desc: 'Emails stream instantly into your inbox the millisecond they arrive without manual page refreshes or polling lag.' },
      { title: 'Smart Instant OTP Extraction', desc: 'Our intelligent server engine parses incoming messages to pinpoint verification codes and magic links for 1-click copying.' },
      { title: 'Flexible TTL with Extend & Burn Options', desc: 'Sessions run for 20 minutes with free +10 min extensions anytime, or instant 1-click mailbox burning and destruction.' },
      { title: 'Zero Registration & Zero Tracking Isolation', desc: 'No login required, no IP logs stored, and all data is permanently purged from server RAM once the timer finishes.' }
    ],
    sec5Title: 'When Should You Use Temporary Email?',
    sec5Sub: 'Disposable email is an indispensable privacy shield in everyday online scenarios:',
    sec5Cases: [
      { num: '01', title: 'Signing Up for Unfamiliar Websites & Forums', desc: 'Access forums, niche communities, and new web tools without risking spam or data resale to advertising networks.' },
      { num: '02', title: 'Receiving One-Time Verification Codes (OTP)', desc: 'Activate software trials, download ebooks, or verify accounts requiring immediate one-off email confirmation.' },
      { num: '03', title: 'Software Engineering & QA Workflow Testing', desc: 'Enables developers and QA engineers to test multi-user onboarding and transactional email flows with isolated inboxes.' },
      { num: '04', title: 'Keeping Your Primary Inbox Clean & Spam-Free', desc: 'Avoid compulsory marketing newsletter traps where opting out or unsubscribing is tedious or ignored.' },
      { num: '05', title: 'Transient Inquiries & Price Quote Requests', desc: 'Request quotes or ask single product questions from vendors without inviting endless automated follow-up sequences.' }
    ],
    sec6Title: 'Privacy & Important Limitations: What You Must Know',
    sec6P1: 'We believe in 100% transparency: FreeTemp.email is engineered strictly for transient, non-sensitive activities. Inboxes and messages are permanently wiped from RAM after 20 minutes (or upon manual burn), and cannot be recovered under any circumstances because we maintain no persistent backups or database logs.',
    sec6P2: 'Therefore, we strongly advise against using temporary email for banking, financial transactions, primary social media accounts, paid long-term subscriptions, or receiving confidential government/legal records. If you lose access to a transient address, you cannot reset account passwords later. Use FreeTemp wisely as a dedicated privacy tool for temporary tasks.',
    sec7Title: 'Frequently Asked Questions & Answers',
    sec7Faqs: [
      { q: 'Is FreeTemp.email completely free to use and does it require signup?', a: 'Yes, our service is 100% free with no hidden charges, premium tiers, or registration requirements. You can use your disposable inbox immediately upon opening the page.' },
      { q: 'How long does a temporary inbox remain active?', a: 'Inboxes remain active for 20 minutes by default. You can add +10 minutes as often as needed using the &quot;+10 min&quot; button, or burn and delete the inbox instantly at any moment.' },
      { q: 'Can I receive OTP codes and verification links?', a: 'Yes! Our system is optimized for fast delivery of verification emails, Google codes, and OTP PINs with automatic highlighting and 1-click copy functionality.' },
      { q: 'What happens to my emails after the timer expires?', a: 'Once the timer reaches zero, the server automatically scrubs the inbox and purges all message contents permanently from memory with zero data retention.' },
      { q: 'Can I send outgoing emails from this temporary address?', a: 'No. FreeTemp.email operates strictly in inbound-only mode to prevent spam abuse, phishing attempts, and unauthorized bulk mailing.' },
      { q: 'Can anyone else access my temporary inbox?', a: 'Each temporary inbox is protected by a unique cryptographic session token in your browser. Other users cannot view your active messages, and once burned, the inbox is destroyed.' }
    ]
  },
  fr: {
    nav: { home: 'Accueil', blog: 'Blog', guide: 'Guide', faq: 'FAQ' },
    heroTitle: 'E-mail Temporaire Gratuit et Jetable pour Protéger Votre Vie Privée',
    heroSub: 'Générez une adresse e-mail temporaire et sécurisée en un clic. Recevez vos codes OTP et liens de confirmation dans une boîte en direct sans inscription ni divulgation de vos données.',
    sec1: 'FreeTemp.email vous offre une solution gratuite et pratique pour préserver votre vie privée en ligne grâce à une boîte jetable prête en quelques secondes. Naviguez librement sans craindre les traceurs publicitaires, le vol de données ou le spam sur votre boîte principale.',
    sec2Title: 'Qu’est-ce qu’un e-mail jetable et pourquoi en avez-vous besoin ?',
    sec2P1: 'Un e-mail temporaire (ou adresse jetable, fausse adresse, disposable email) est une boîte de réception éphémère active pour une session définie. Elle est générée automatiquement sans inscription, sans nom, sans numéro de téléphone et sans mot de passe.',
    sec2P2: 'L’atout majeur de l’e-mail jetable est de vous immuniser contre le spam, les newsletters intrusives et la revente de vos coordonnées lors de vos inscriptions sur des sites non vérifiés. Dès que vous avez terminé, la boîte et son contenu sont définitivement détruits sans laisser de trace.',
    sec3Title: 'Comment fonctionne l’e-mail temporaire ? (3 étapes simples)',
    sec3Steps: [
      { num: '01', title: 'Génération automatique et instantanée', desc: 'Dès votre arrivée sur le site, une adresse unique, sécurisée et anonyme est immédiatement prête à l’emploi.' },
      { num: '02', title: 'Utilisation sur le site ou l’application cible', desc: 'Copiez l’adresse et collez-la dans le formulaire d’inscription ou de téléchargement nécessitant une vérification.' },
      { num: '03', title: 'Réception en direct & extraction du code OTP', desc: 'Le message s’affiche instantanément dans votre boîte ci-dessous avec extraction automatique du code OTP et des liens d’activation.' }
    ],
    sec4Title: 'Pourquoi choisir FreeTemp.email ? Des atouts conçus pour vous',
    sec4Sub: 'Nous ne proposons pas un simple e-mail jetable, mais une infrastructure de pointe alliant rapidité, sécurité et anonymat absolu :',
    sec4Feats: [
      { title: 'Diffusion en direct via WebSocket', desc: 'Vos messages apparaissent instantanément dès leur réception sans aucun rechargement manuel de page.' },
      { title: 'Extraction intelligente des codes OTP', desc: 'Notre moteur analyse le contenu des courriels pour repérer les codes à chiffres et vous permettre de les copier en 1 clic.' },
      { title: 'Durée flexible avec options Prolongation & Destruction', desc: 'Le compte à rebours démarre à 20 minutes avec possibilité d’ajouter +10 minutes ou de détruire la boîte immédiatement.' },
      { title: 'Zéro inscription et politique stricte sans journaux (Zero-Logs)', desc: 'Aucune donnée personnelle ni adresse IP n’est enregistrée sur disque dur, et tout est purgé de la RAM à la fin de session.' }
    ],
    sec5Title: 'Quand devez-vous utiliser un e-mail temporaire ?',
    sec5Sub: 'L’adresse jetable est un outil indispensable dans de nombreuses situations en ligne :',
    sec5Cases: [
      { num: '01', title: 'Inscription sur des sites et forums inconnus', desc: 'Accédez à des contenus fermés ou des communautés sans risquer de voir votre boîte personnelle spammée par des tiers.' },
      { num: '02', title: 'Réception de codes d’activation OTP uniques', desc: 'Activez des comptes d’essai ou téléchargez des ebooks nécessitant une validation par courriel unique.' },
      { num: '03', title: 'Tests de logiciels et de flux web (QA Testing)', desc: 'Idéal pour les développeurs et testeurs QA pour valider les parcours d’inscription sans créer des comptes manuellement.' },
      { num: '04', title: 'Garder votre boîte principale propre et sans spam', desc: 'Évitez les newsletters obligatoires dont le désabonnement s’avère complexe ou inefficace.' },
      { num: '05', title: 'Demandes de devis et questions ponctuelles', desc: 'Posez une question à un marchand en ligne sans recevoir d’e-mails de relance commerciale permanents.' }
    ],
    sec6Title: 'Confidentialité et limites importantes : ce qu’il faut savoir',
    sec6P1: 'Nous privilégions une transparence totale : FreeTemp.email est strictement conçu pour des usages temporaires et non sensibles. Les messages et adresses sont détruits définitivement après 20 minutes (ou après destruction manuelle) et ne peuvent jamais être récupérés, car nous ne conservons aucune sauvegarde ni base de données.',
    sec6P2: 'Par conséquent, nous vous déconseillons formellement d’utiliser ce service pour vos comptes bancaires, transactions financières, réseaux sociaux principaux ou abonnements payants. En cas de perte d’accès, vous ne pourrez pas réinitialiser votre mot de passe. Utilisez FreeTemp comme un bouclier pour vos tâches éphémères.',
    sec7Title: 'Foire Aux Questions (FAQ)',
    sec7Faqs: [
      { q: 'Le service FreeTemp.email est-il gratuit et sans inscription ?', a: 'Oui, le service est 100% gratuit, sans frais cachés, sans abonnement et sans obligation de créer un compte.' },
      { q: 'Combien de temps l’adresse temporaire reste-t-elle active ?', a: 'La boîte reste active pendant 20 minutes par défaut. Vous pouvez ajouter +10 minutes à tout moment ou détruire la boîte immédiatement en un clic.' },
      { q: 'Puis-je recevoir des codes OTP et des liens de validation ?', a: 'Absolument. Notre système extrait automatiquement les codes OTP et liens de confirmation pour une copie instantanée en 1 clic.' },
      { q: 'Que deviennent mes messages une fois le délai écoulé ?', a: 'Dès que le compte à rebours s’achève, le serveur supprime immédiatement la boîte et purge tous les messages de la mémoire vive sans rétention.' },
      { q: 'Puis-je envoyer des courriels depuis cette boîte ?', a: 'Non. Le service fonctionne uniquement en réception pour empêcher tout spam, phishing ou abus malveillant.' },
      { q: 'Quelqu’un d’autre peut-il accéder à ma boîte temporaire ?', a: 'Chaque boîte est protégée par une clé de session unique dans votre navigateur. Aucun autre utilisateur ne peut y accéder durant son activité.' }
    ]
  }
};

function getLangData(code) {
  return CONTENT[code] || CONTENT['en'];
}

function generateRichPage(langMeta) {
  const code = langMeta.code;
  const isRtl = langMeta.dir === 'rtl';
  const data = getLangData(code);
  const isAr = code === 'ar';
  const isFr = code === 'fr';

  const hreflangs = ALL_LANGUAGES.map(l => 
    '    <link rel="alternate" hreflang="' + l.code + '" href="https://freetemp.email/' + l.code + '/" />'
  ).join('\n');

  const stepsHtml = data.sec3Steps.map(s => `
          <div class="p-6 bg-white dark:bg-[#121212] border border-neutral-300 dark:border-neutral-800 rounded-xl shadow-sm flex flex-col items-start">
            <span class="w-8 h-8 rounded-lg bg-black text-white dark:bg-white dark:text-black font-mono font-bold text-xs flex items-center justify-center mb-4 shadow-sm shrink-0">
              ${s.num}
            </span>
            <h3 class="text-base font-bold text-black dark:text-white mb-2">
              ${s.title}
            </h3>
            <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              ${s.desc}
            </p>
          </div>`).join('\n');

  const featsHtml = data.sec4Feats.map(f => `
          <div class="p-6 bg-white dark:bg-[#121212] border border-neutral-300 dark:border-neutral-800 rounded-xl shadow-sm">
            <div class="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white flex items-center justify-center mb-4 border border-neutral-200 dark:border-neutral-700">
              <svg class="w-5 h-5 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-base font-bold text-black dark:text-white mb-2">${f.title}</h3>
            <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">${f.desc}</p>
          </div>`).join('\n');

  const casesHtml = data.sec5Cases.map(c => `
          <div class="p-5 bg-white dark:bg-[#121212] border border-neutral-300 dark:border-neutral-800 rounded-xl shadow-sm flex items-start gap-4">
            <span class="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-neutral-200 dark:border-neutral-700">${c.num}</span>
            <div>
              <h3 class="text-sm sm:text-base font-bold text-black dark:text-white mb-1">${c.title}</h3>
              <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">${c.desc}</p>
            </div>
          </div>`).join('\n');

  const faqsHtml = data.sec7Faqs.map(f => `
          <details class="group p-5 bg-white dark:bg-[#121212] border border-neutral-300 dark:border-neutral-800 rounded-xl shadow-sm cursor-pointer transition-all hover:border-neutral-400 dark:hover:border-neutral-600">
            <summary class="font-bold text-sm sm:text-base text-black dark:text-white list-none flex items-center justify-between gap-4">
              <span>${f.q}</span>
              <svg class="w-4 h-4 stroke-current fill-none stroke-[2] transition-transform duration-200 group-open:rotate-180 text-neutral-400 shrink-0" viewBox="0 0 24 24" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </summary>
            <p class="mt-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">${f.a}</p>
          </details>`).join('\n');

  return `<!doctype html>
<html lang="${code}" dir="${langMeta.dir}">
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
    <title>${data.heroTitle} | freetemp.email</title>
    <meta name="description" content="${data.heroSub}" />
    <link rel="canonical" href="https://freetemp.email/${code}/" />
    <meta name="robots" content="index, follow" />

    <!-- Multilingual Hreflang Tags -->
${hreflangs}
    <link rel="alternate" hreflang="x-default" href="https://freetemp.email/en/" />

    <!-- Open Graph Tags -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="FreeTemp.email" />
    <meta property="og:title" content="${data.heroTitle} | freetemp.email" />
    <meta property="og:description" content="${data.heroSub}" />
    <meta property="og:image" content="https://freetemp.email/og-image.svg" />
    <meta property="og:url" content="https://freetemp.email/${code}/" />
    <meta name="twitter:card" content="summary_large_image" />

    <!-- Favicons -->
    <link rel="icon" type="image/svg+xml" href="/logo.svg" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            colors: {
              brand: {
                DEFAULT: '#000000',
                dark: '#FFFFFF'
              }
            }
          }
        }
      };
    </script>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body class="min-h-screen bg-white text-black dark:bg-[#0D0D0D] dark:text-[#F5F5F5] flex flex-col transition-colors duration-200 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black" style="font-family: ${langMeta.font};">
    
    <!-- Header -->
    <header class="border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-[#0D0D0D]/95 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div class="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div class="flex items-center gap-6">
          <a href="/${code}/" dir="ltr" class="flex items-center gap-2.5 transition-opacity hover:opacity-90">
            <img src="/logo.svg" alt="freetemp.email" class="w-8 h-8 rounded-lg shadow-sm shrink-0" width="32" height="32" />
            <span class="flex items-baseline font-sans tracking-tight">
              <span class="text-xl font-extrabold text-black dark:text-white">freetemp</span>
              <span class="text-sm font-semibold text-neutral-500 dark:text-neutral-400">.email</span>
            </span>
          </a>

          <nav class="hidden md:flex items-center gap-4 text-xs font-medium">
            <a href="/${code}/" class="text-black dark:text-white font-bold transition-colors">${data.nav.home}</a>
            <a href="/${code}/blog.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${data.nav.blog}</a>
            <a href="/${code}/guide.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${data.nav.guide}</a>
            <a href="/${code}/faq.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${data.nav.faq}</a>
          </nav>
        </div>

        <div class="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            id="open-lang-picker"
            class="open-lang-picker min-h-[38px] px-3 py-1.5 bg-white hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 hover:border-black dark:border-neutral-800 dark:hover:border-neutral-600 rounded-lg text-xs font-semibold text-black dark:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            aria-label="Select Language"
          >
            <svg class="w-3.5 h-3.5 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            <span id="current-lang-label">${langMeta.native}</span>
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

    <!-- Main Content -->
    <main class="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12">
      <!-- Hero Section & Headline -->
      <div class="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <h1 class="text-3xl sm:text-4xl font-extrabold text-black dark:text-white mb-3 tracking-tight">
          ${data.heroTitle}
        </h1>
        <p class="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
          ${data.heroSub}
        </p>
      </div>

      <!-- Main Tool Box -->
      <div class="bg-white dark:bg-[#121212] border border-neutral-300 dark:border-neutral-800 rounded-xl shadow-sm overflow-hidden mb-12">
        <!-- Address Bar Card Header -->
        <div class="p-4 sm:p-6 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/60">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <label for="address-input" class="text-xs font-bold text-black dark:text-white uppercase tracking-wider">
              ${isAr ? 'عنوان بريدك المؤقت:' : (isFr ? 'Adresse e-mail temporaire :' : 'Temporary Email Address:')}
            </label>
            <div id="status-bar" class="flex items-center gap-2">
              <span id="status-dot" class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span id="status-text" class="text-xs font-mono text-black dark:text-white">${isAr ? 'بث حي متصل' : (isFr ? 'En direct connecté' : 'Live Connected')}</span>
            </div>
          </div>

          <!-- Input + Action Buttons -->
          <div class="flex flex-col sm:flex-row items-stretch gap-2.5">
            <div class="relative flex-1">
              <input
                id="address-input"
                type="text"
                readonly
                value="${isAr ? 'جاري توليد العنوان...' : (isFr ? 'Génération de l\'adresse...' : 'Generating address...')}"
                class="w-full h-12 px-4 bg-white dark:bg-[#0D0D0D] border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm sm:text-base font-mono font-bold text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white select-all transition-all shadow-inner"
              />
            </div>
            <button
              type="button"
              id="copy-address-btn"
              class="h-12 px-5 bg-black text-white dark:bg-white dark:text-black rounded-lg text-xs font-bold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-sm active:scale-95"
            >
              <svg class="w-4 h-4 stroke-current fill-none stroke-[2] shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span id="copy-btn-text">${isAr ? 'نسخ العنوان' : (isFr ? 'Copier l\'adresse' : 'Copy Address')}</span>
            </button>
            <button
              type="button"
              id="refresh-address-btn"
              class="h-12 px-4 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-sm active:scale-95"
              title="${isAr ? 'عنوان جديد' : (isFr ? 'Nouvelle adresse' : 'New Address')}"
            >
              <svg class="w-4 h-4 stroke-current fill-none stroke-[2] shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"></path>
              </svg>
              <span>${isAr ? 'عنوان جديد' : (isFr ? 'Nouvelle adresse' : 'New Address')}</span>
            </button>
          </div>

          <!-- Timer & Actions -->
          <div class="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div id="timer-container" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#0D0D0D] font-mono transition-all shadow-sm">
              <svg class="w-3.5 h-3.5 stroke-current fill-none stroke-[2] text-neutral-500 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span class="text-neutral-500 dark:text-neutral-400">${isAr ? 'ينتهي خلال:' : (isFr ? 'Expire dans :' : 'Expires in:')}</span>
              <span id="timer-display" class="font-bold text-black dark:text-white tracking-wider">20:00</span>
            </div>

            <div class="flex items-center gap-2">
              <button
                type="button"
                id="extend-btn"
                class="px-3 py-1.5 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <svg class="w-3.5 h-3.5 stroke-current fill-none stroke-[2] shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                <span>${isAr ? '+10 دقائق' : (isFr ? '+10 min' : '+10 min')}</span>
              </button>

              <button
                type="button"
                id="burn-btn"
                class="px-3 py-1.5 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-900 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <svg class="w-3.5 h-3.5 stroke-current fill-none stroke-[2] shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                <span>${isAr ? 'إتلاف الصندوق' : (isFr ? 'Détruire la boîte' : 'Burn Mailbox')}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Inbox Container -->
        <div class="grid grid-cols-1 md:grid-cols-12 min-h-[380px]">
          <!-- Sidebar: List of Emails -->
          <div class="md:col-span-5 border-b md:border-b-0 ${isRtl ? 'md:border-l' : 'md:border-r'} border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121212]">
            <div class="p-3 sm:p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/30">
              <span class="text-xs font-bold text-black dark:text-white uppercase tracking-wider flex items-center gap-2">
                <svg class="w-4 h-4 stroke-current fill-none stroke-[2]\" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>${isAr ? 'الرسائل المستلمة' : (isFr ? 'Messages reçus' : 'Received Messages')}</span>
              </span>
              <span id="unread-count-badge" class="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                0
              </span>
            </div>

            <!-- Email List -->
            <div id="emails-list" class="divide-y divide-neutral-200 dark:divide-neutral-800 overflow-y-auto max-h-[460px]">
              <!-- Empty State -->
              <div class="p-8 text-center">
                <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400 flex items-center justify-center animate-pulse">
                  <svg class="w-6 h-6 stroke-current fill-none stroke-[1.5]" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22 12h-6l-2 3h-4l-2-3H2"></path>
                    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                  </svg>
                </div>
                <p class="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-[200px] mx-auto">
                  ${isAr ? 'في انتظار الرسائل الواردة... ستظهر هنا فور إرسالها دون الحاجة لتحديث الصفحة.' : (isFr ? 'En attente de messages... ils apparaîtront en direct sans recharger la page.' : 'Waiting for incoming emails... they will stream in real time without refreshing.')}
                </p>
              </div>
            </div>
          </div>

          <!-- Email Detail Pane -->
          <div id="email-detail" class="md:col-span-7 p-4 sm:p-6 bg-white dark:bg-[#0D0D0D] flex flex-col justify-center items-center text-center">
            <div class="w-12 h-12 mb-3 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400 flex items-center justify-center">
              <svg class="w-6 h-6 stroke-current fill-none stroke-[1.5]" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <p class="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs leading-relaxed">
              ${isAr ? 'اختر رسالة من القائمة الجانبية لقراءة محتواها واستخراج كود التحقق.' : (isFr ? 'Sélectionnez un message dans la liste pour lire son contenu et copier le code OTP.' : 'Select an email from the list to view its contents and extract verification codes.')}
            </p>
          </div>
        </div>
      </div>

      <!-- 1. Intro Callout Box -->
      <section class="mb-12 bg-white dark:bg-[#121212] border border-neutral-300 dark:border-neutral-800 rounded-xl p-6 sm:p-8 shadow-sm">
        <p class="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed font-normal">
          ${data.sec1}
        </p>
      </section>

      <!-- 2. What is Disposable Email & Why You Need It -->
      <section class="mb-12 border-t border-neutral-200 dark:border-neutral-800 pt-10">
        <h2 class="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-6">
          ${data.sec2Title}
        </h2>
        <div class="space-y-4 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
          <p>${data.sec2P1}</p>
          <p>${data.sec2P2}</p>
        </div>
      </section>

      <!-- 3. How Temporary Email Works (3 Steps) -->
      <section class="mb-12 border-t border-neutral-200 dark:border-neutral-800 pt-10">
        <h2 class="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-6">
          ${data.sec3Title}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
${stepsHtml}
        </div>
      </section>

      <!-- 4. Why Choose freetemp.email? Real Features -->
      <section class="mb-12 border-t border-neutral-200 dark:border-neutral-800 pt-10">
        <h2 class="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-3">
          ${data.sec4Title}
        </h2>
        <p class="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
          ${data.sec4Sub}
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
${featsHtml}
        </div>
      </section>

      <!-- 5. When to Use Temporary Email? (5 Cases) -->
      <section class="mb-12 border-t border-neutral-200 dark:border-neutral-800 pt-10">
        <h2 class="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-3">
          ${data.sec5Title}
        </h2>
        <p class="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
          ${data.sec5Sub}
        </p>
        <div class="space-y-3">
${casesHtml}
        </div>
      </section>

      <!-- 6. Privacy & Important Limitations -->
      <section class="mb-12 border border-neutral-300 dark:border-neutral-800 rounded-xl p-6 sm:p-8 bg-neutral-50/70 dark:bg-neutral-900/60 shadow-sm">
        <h2 class="text-xl sm:text-2xl font-bold text-black dark:text-white mb-4 flex items-center gap-2.5">
          <svg class="w-6 h-6 stroke-current fill-none stroke-[2] text-amber-500 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <span>${data.sec6Title}</span>
        </h2>
        <div class="space-y-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          <p>${data.sec6P1}</p>
          <p class="font-medium text-black dark:text-neutral-200">${data.sec6P2}</p>
        </div>
      </section>

      <!-- 7. Localized FAQ Accordion -->
      <section class="mb-12 border-t border-neutral-200 dark:border-neutral-800 pt-10">
        <h2 class="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-6">
          ${data.sec7Title}
        </h2>
        <div class="space-y-3">
${faqsHtml}
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0A0A0A] py-12 transition-colors mt-auto text-xs">
      <div class="max-w-4xl mx-auto px-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10 text-start">
          <div>
            <a href="/${code}/" dir="ltr" class="inline-flex items-center gap-2.5 transition-opacity hover:opacity-90 mb-3">
              <img src="/logo.svg" alt="freetemp.email" class="w-7 h-7 rounded-lg shadow-sm shrink-0" width="28" height="28" />
              <span class="flex items-baseline font-sans tracking-tight">
                <span class="text-lg font-extrabold text-black dark:text-white">freetemp</span>
                <span class="text-xs font-semibold text-neutral-500 dark:text-neutral-400">.email</span>
              </span>
            </a>
            <p class="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-3">
              ${isAr ? 'خدمة بريد مؤقت مجاني وفوري لحماية خصوصيتك الرقمية ومكافحة الرسائل المزعجة بدون تسجيل.' : (isFr ? 'Service d\'e-mail temporaire gratuit et sécurisé pour protéger votre vie privée sans inscription.' : 'Free and instant temporary disposable email service to protect your privacy and fight spam without registration.')}
            </p>
            <div class="inline-flex items-center gap-2 font-mono text-[11px] text-black dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 rounded-md px-2 py-1 bg-neutral-50 dark:bg-neutral-900">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>${isAr ? 'جميع العقد الطرفية تعمل بكفاءة' : (isFr ? 'Tous les nœuds Edge opérationnels' : 'All Edge Nodes Operational')}</span>
            </div>
          </div>

          <div>
            <div class="font-bold text-black dark:text-white mb-3 uppercase tracking-wider text-[11px]">${isAr ? 'روابط سريعة' : (isFr ? 'Navigation rapide' : 'Quick Navigation')}</div>
            <ul class="space-y-2">
              <li><a href="/${code}/" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${data.nav.home}</a></li>
              <li><a href="/${code}/blog.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors font-semibold">${data.nav.blog}</a></li>
              <li><a href="/${code}/guide.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${data.nav.guide}</a></li>
              <li><a href="/${code}/faq.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${data.nav.faq}</a></li>
            </ul>
          </div>

          <div>
            <div class="font-bold text-black dark:text-white mb-3 uppercase tracking-wider text-[11px]">${isAr ? 'الشفافية والامتثال' : (isFr ? 'Transparence & Conformité' : 'Transparency & Compliance')}</div>
            <ul class="space-y-2">
              <li><a href="/${code}/about.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${isAr ? 'من نحن' : (isFr ? 'À propos' : 'About Us')}</a></li>
              <li><a href="/${code}/privacy.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${isAr ? 'سياسة الخصوصية' : (isFr ? 'Politique de confidentialité' : 'Privacy Policy')}</a></li>
              <li><a href="/${code}/privacy.html#terms" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">${isAr ? 'شروط الاستخدام' : (isFr ? 'Conditions d\'utilisation' : 'Terms of Service')}</a></li>
            </ul>
          </div>

          <div>
            <div class="font-bold text-black dark:text-white mb-3 uppercase tracking-wider text-[11px]">${isAr ? 'معايير الأمان والتشفير' : (isFr ? 'Sécurité & Chiffrement' : 'Security & Encryption')}</div>
            <ul class="space-y-2 text-neutral-600 dark:text-neutral-400">
              <li class="flex items-center gap-2">
                <svg class="w-3.5 h-3.5 stroke-current fill-none stroke-[2] text-black dark:text-white shrink-0" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>${isAr ? 'حذف تلقائي بعد 20 دقيقة' : (isFr ? 'Autodestruction après 20 min' : 'Auto-delete after 20 mins')}</span>
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-3.5 h-3.5 stroke-current fill-none stroke-[2] text-black dark:text-white shrink-0" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>${isAr ? 'عزل أمني تام O(1)' : (isFr ? 'Isolation mémoire O(1)' : 'Encrypted O(1) Memory')}</span>
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-3.5 h-3.5 stroke-current fill-none stroke-[2] text-black dark:text-white shrink-0" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>${isAr ? 'عدم تسجيل أي بيانات (Zero-Logs)' : (isFr ? 'Zéro log & sans cookies tiers' : 'Zero logs & no trackers')}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="border-t border-neutral-200 dark:border-neutral-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400">
          <div>© 2026 FreeTemp.email — ${isAr ? 'بريد مؤقت مجاني. جميع الحقوق محفوظة.' : (isFr ? 'E-mail temporaire gratuit. Tous droits réservés.' : 'Free Temporary Email. All rights reserved.')}</div>
          <div class="flex items-center gap-4">
            <span>TLS 1.3 256-Bit</span>
            <span>•</span>
            <span>Cloudflare Edge</span>
            <span>•</span>
            <span>Zero-Logs Policy</span>
          </div>
        </div>
      </div>
    </footer>

    <!-- Shared Scripts -->
    <script src="/shared/purify.min.js"></script>
    <script src="/shared/theme.js"></script>
    <script src="/shared/i18n.js"></script>
    <script src="/shared/app.js"></script>
  </body>
</html>`;
}

// Generate for all 22 languages!
ALL_LANGUAGES.forEach(l => {
  const html = generateRichPage(l);
  const dir = path.join(__dirname, '..', l.code);
  const pubDir = path.join(__dirname, '..', 'public', l.code);
  fs.mkdirSync(dir, { recursive: true });
  fs.mkdirSync(pubDir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  fs.writeFileSync(path.join(pubDir, 'index.html'), html, 'utf8');
  console.log('✓ Generated rich homepage for:', l.code, '(' + l.native + ')');
});

// Update root index.html and public/index.html with the rich Arabic version!
const arMeta = ALL_LANGUAGES.find(l => l.code === 'ar');
const rootHtml = generateRichPage(arMeta);
fs.writeFileSync(path.join(__dirname, '..', 'index.html'), rootHtml, 'utf8');
fs.writeFileSync(path.join(__dirname, '..', 'public', 'index.html'), rootHtml, 'utf8');
console.log('✓ Updated root index.html and public/index.html with full rich structure!');
