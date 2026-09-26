import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const outputDirs = [
  path.join(process.cwd(), 'public', 'assets', 'guide'),
  path.join(process.cwd(), 'frontend', 'assets', 'guide'),
  path.join(process.cwd(), 'public', 'assets', 'screenshots'),
];

for (const dir of outputDirs) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Load local fonts to embed inside SVGs so Sharp/librsvg and browsers render Cairo & Inter with 100% precision
const cairoBoldB64 = Buffer.from(fs.readFileSync(path.join(process.cwd(), 'public', 'fonts', 'cairo-bold.ttf'))).toString('base64');
const cairoRegB64 = Buffer.from(fs.readFileSync(path.join(process.cwd(), 'public', 'fonts', 'cairo-regular.ttf'))).toString('base64');
const interBoldB64 = Buffer.from(fs.readFileSync(path.join(process.cwd(), 'public', 'fonts', 'inter-bold.ttf'))).toString('base64');

const fontStyles = `
  @font-face {
    font-family: 'Cairo';
    font-weight: 700;
    src: url('data:font/ttf;base64,${cairoBoldB64}') format('truetype');
  }
  @font-face {
    font-family: 'Cairo';
    font-weight: 400;
    src: url('data:font/ttf;base64,${cairoRegB64}') format('truetype');
  }
  @font-face {
    font-family: 'Inter';
    font-weight: 700;
    src: url('data:font/ttf;base64,${interBoldB64}') format('truetype');
  }
  text {
    font-family: 'Cairo', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
`;

interface ImageSpec {
  filename: string;
  width: number;
  height: number;
  svg: string;
}

const images: ImageSpec[] = [
  // 1. توليد ونسخ العنوان المؤقت
  {
    filename: 'step-1-generate-address',
    width: 900,
    height: 480,
    svg: `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="480" viewBox="0 0 900 480" direction="rtl">
      <defs>
        <style>${fontStyles}</style>
        <filter id="shadow1" x="-10%" y="-10%" width="120%" height="125%">
          <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#000000" flood-opacity="0.08"/>
        </filter>
        <linearGradient id="copiedGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#000000"/>
          <stop offset="100%" stop-color="#1A1A1A"/>
        </linearGradient>
      </defs>

      <!-- Background Canvas -->
      <rect width="900" height="480" fill="#F8F9FA"/>
      <rect x="25" y="25" width="850" height="430" rx="20" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="1.5" filter="url(#shadow1)"/>

      <!-- Window Header Bar -->
      <path d="M 25 45 Q 25 25 45 25 L 855 25 Q 875 25 875 45 L 875 75 L 25 75 Z" fill="#F3F4F6"/>
      <line x1="25" y1="75" x2="875" y2="75" stroke="#E5E7EB" stroke-width="1"/>

      <!-- Window Controls -->
      <circle cx="55" cy="50" r="6" fill="#EF4444"/>
      <circle cx="75" cy="50" r="6" fill="#F59E0B"/>
      <circle cx="95" cy="50" r="6" fill="#10B981"/>

      <text x="840" y="55" text-anchor="end" font-size="14" font-weight="700" fill="#111827">الخطوة 1: توليد ونسخ العنوان المؤقت</text>

      <!-- Main Tool Container Box -->
      <rect x="60" y="105" width="780" height="235" rx="16" fill="#FFFFFF" stroke="#111827" stroke-width="2"/>

      <!-- Subheader: Label & Live Countdown Timer -->
      <text x="810" y="142" text-anchor="end" font-size="14" font-weight="700" fill="#6B7280">عنوان بريدك المؤقت الجاهز للاستخدام</text>
      
      <!-- Timer Capsule -->
      <rect x="90" y="122" width="140" height="32" rx="16" fill="#F3F4F6" stroke="#E5E7EB" stroke-width="1"/>
      <circle cx="110" cy="138" r="5" fill="#10B981"/>
      <text x="175" y="143" text-anchor="middle" font-family="'Inter', monospace" font-size="14" font-weight="700" fill="#111827">19:58 متبقي</text>

      <!-- Address Display Box -->
      <rect x="90" y="170" width="720" height="85" rx="12" fill="#F9FAFB" stroke="#E5E7EB" stroke-width="1.5"/>

      <!-- Address Text -->
      <text x="780" y="222" text-anchor="end" font-family="'Inter', monospace" font-size="24" font-weight="700" fill="#111827">alex94@freetemp.email</text>

      <!-- Copy Button (Active Success State) -->
      <g transform="translate(110, 185)">
        <rect width="180" height="54" rx="10" fill="url(#copiedGrad)"/>
        <!-- White Checkmark -->
        <polyline points="32,28 42,38 60,18" fill="none" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="115" y="34" text-anchor="middle" font-size="15" font-weight="700" fill="#FFFFFF">تم النسخ بنجاح ✓</text>
      </g>

      <!-- Change Domain & Refresh Controls -->
      <rect x="90" y="272" width="220" height="42" rx="8" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="1"/>
      <text x="200" y="298" text-anchor="middle" font-size="13" font-weight="700" fill="#374151">تغيير العنوان ⟳</text>

      <rect x="320" y="272" width="240" height="42" rx="8" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="1"/>
      <text x="440" y="298" text-anchor="middle" font-size="13" font-weight="700" fill="#374151">اختيار نطاق مخصص ▾</text>

      <!-- Real-world Explanation Callout -->
      <rect x="60" y="360" width="780" height="75" rx="12" fill="#F0FDF4" stroke="#86EFAC" stroke-width="1"/>
      <circle cx="810" cy="397" r="14" fill="#22C55E"/>
      <polyline points="805,397 809,401 815,393" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
      <text x="780" y="392" text-anchor="end" font-size="14" font-weight="700" fill="#166534">العنوان منسوخ وجاهز في الحافظة</text>
      <text x="780" y="415" text-anchor="end" font-size="12" font-weight="400" fill="#15803D">تم حفظ العنوان في ذاكرة جهازك. يمكنك الآن الانتقال لأي موقع ولصقه مباشرة (Ctrl + V أو لصق).</text>
    </svg>`,
  },

  // 2. لصق العنوان في نموذج التسجيل الخارجي
  {
    filename: 'step-2-paste-in-form',
    width: 900,
    height: 480,
    svg: `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="480" viewBox="0 0 900 480" direction="rtl">
      <defs>
        <style>${fontStyles}</style>
        <filter id="shadow2" x="-10%" y="-10%" width="120%" height="125%">
          <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#000000" flood-opacity="0.08"/>
        </filter>
      </defs>

      <rect width="900" height="480" fill="#F8F9FA"/>
      <rect x="25" y="25" width="850" height="430" rx="20" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="1.5" filter="url(#shadow2)"/>

      <!-- Window Header Bar -->
      <path d="M 25 45 Q 25 25 45 25 L 855 25 Q 875 25 875 45 L 875 75 L 25 75 Z" fill="#F3F4F6"/>
      <line x1="25" y1="75" x2="875" y2="75" stroke="#E5E7EB" stroke-width="1"/>
      <circle cx="55" cy="50" r="6" fill="#EF4444"/>
      <circle cx="75" cy="50" r="6" fill="#F59E0B"/>
      <circle cx="95" cy="50" r="6" fill="#10B981"/>
      <text x="840" y="55" text-anchor="end" font-size="14" font-weight="700" fill="#111827">الخطوة 2: لصق العنوان في موقع التسجيل الخارجي</text>

      <!-- Simulated Registration Form Card -->
      <rect x="180" y="95" width="540" height="340" rx="16" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="1.5"/>

      <text x="680" y="135" text-anchor="end" font-size="18" font-weight="700" fill="#111827">إنشاء حساب جديد (Sign Up)</text>
      <text x="680" y="160" text-anchor="end" font-size="12" fill="#6B7280">أدخل بياناتك لتأكيد التسجيل واستلام كود التفعيل</text>

      <!-- Username Field -->
      <text x="680" y="195" text-anchor="end" font-size="12" font-weight="700" fill="#374151">الاسم الكامل / اسم المستخدم</text>
      <rect x="220" y="205" width="460" height="42" rx="8" fill="#F9FAFB" stroke="#D1D5DB" stroke-width="1"/>
      <text x="660" y="231" text-anchor="end" font-size="13" fill="#111827">Sami Ahmed</text>

      <!-- Email Field (Highlighted as Pasted) -->
      <text x="680" y="272" text-anchor="end" font-size="12" font-weight="700" fill="#111827">البريد الإلكتروني (تم لصق البريد المؤقت)</text>
      <rect x="220" y="282" width="460" height="46" rx="8" fill="#F0FDF4" stroke="#16A34A" stroke-width="2"/>
      <text x="660" y="311" text-anchor="end" font-family="'Inter', monospace" font-size="14" font-weight="700" fill="#15803D">alex94@freetemp.email</text>
      <rect x="235" y="291" width="90" height="28" rx="6" fill="#DCFCE7"/>
      <text x="280" y="310" text-anchor="middle" font-size="11" font-weight="700" fill="#166534">تم اللصق 📋</text>

      <!-- Submit Button -->
      <rect x="220" y="350" width="460" height="48" rx="8" fill="#111827"/>
      <text x="450" y="380" text-anchor="middle" font-size="15" font-weight="700" fill="#FFFFFF">متابعة وإرسال رمز التحقق ⬅</text>

      <text x="450" y="420" text-anchor="middle" font-size="11" fill="#9CA3AF">لن يتم كشف بريدك الشخصي ولن تصلك رسائل مزعجة إطلاقاً</text>
    </svg>`,
  },

  // 3. استقبال الرسالة واستخراج كود OTP تلقائياً
  {
    filename: 'step-3-receive-live-otp',
    width: 900,
    height: 480,
    svg: `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="480" viewBox="0 0 900 480" direction="rtl">
      <defs>
        <style>${fontStyles}</style>
        <filter id="shadow3" x="-10%" y="-10%" width="120%" height="125%">
          <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#000000" flood-opacity="0.08"/>
        </filter>
      </defs>

      <rect width="900" height="480" fill="#F8F9FA"/>
      <rect x="25" y="25" width="850" height="430" rx="20" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="1.5" filter="url(#shadow3)"/>

      <path d="M 25 45 Q 25 25 45 25 L 855 25 Q 875 25 875 45 L 875 75 L 25 75 Z" fill="#F3F4F6"/>
      <line x1="25" y1="75" x2="875" y2="75" stroke="#E5E7EB" stroke-width="1"/>
      <circle cx="55" cy="50" r="6" fill="#EF4444"/>
      <circle cx="75" cy="50" r="6" fill="#F59E0B"/>
      <circle cx="95" cy="50" r="6" fill="#10B981"/>
      <text x="840" y="55" text-anchor="end" font-size="14" font-weight="700" fill="#111827">الخطوة 3: استقبال بريد التحقق واستخراج كود OTP المباشر</text>

      <!-- Inbox Message Card -->
      <rect x="60" y="95" width="780" height="335" rx="16" fill="#FFFFFF" stroke="#111827" stroke-width="2"/>

      <!-- Message Header -->
      <rect x="80" y="115" width="740" height="60" rx="10" fill="#F9FAFB" stroke="#E5E7EB" stroke-width="1"/>
      <text x="795" y="145" text-anchor="end" font-size="15" font-weight="700" fill="#111827">تأكيد الحساب: رمز التحقق السريع لمرة واحدة</text>
      <text x="795" y="165" text-anchor="end" font-size="12" fill="#6B7280">المرسل: <tspan font-family="'Inter', monospace" font-weight="700" fill="#111827">verify@auth-service.com</tspan></text>
      
      <rect x="100" y="130" width="85" height="28" rx="14" fill="#DCFCE7"/>
      <text x="142" y="148" text-anchor="middle" font-size="11" font-weight="700" fill="#166534">جديدة الآن ⚡</text>

      <!-- Highlighted OTP Banner Callout -->
      <rect x="80" y="195" width="740" height="135" rx="12" fill="#111827"/>
      <text x="790" y="230" text-anchor="end" font-size="14" font-weight="700" fill="#9CA3AF">كود التحقق المستخرج تلقائياً (OTP Code):</text>

      <!-- Big Digits Display -->
      <g transform="translate(460, 245)">
        <rect x="0" y="0" width="50" height="62" rx="8" fill="#1F2937"/>
        <text x="25" y="44" text-anchor="middle" font-family="'Inter', monospace" font-size="34" font-weight="900" fill="#FFFFFF">7</text>
        <rect x="56" y="0" width="50" height="62" rx="8" fill="#1F2937"/>
        <text x="81" y="44" text-anchor="middle" font-family="'Inter', monospace" font-size="34" font-weight="900" fill="#FFFFFF">8</text>
        <rect x="112" y="0" width="50" height="62" rx="8" fill="#1F2937"/>
        <text x="137" y="44" text-anchor="middle" font-family="'Inter', monospace" font-size="34" font-weight="900" fill="#FFFFFF">3</text>
        <rect x="168" y="0" width="50" height="62" rx="8" fill="#1F2937"/>
        <text x="193" y="44" text-anchor="middle" font-family="'Inter', monospace" font-size="34" font-weight="900" fill="#FFFFFF">2</text>
        <rect x="224" y="0" width="50" height="62" rx="8" fill="#1F2937"/>
        <text x="249" y="44" text-anchor="middle" font-family="'Inter', monospace" font-size="34" font-weight="900" fill="#FFFFFF">9</text>
        <rect x="280" y="0" width="50" height="62" rx="8" fill="#1F2937"/>
        <text x="305" y="44" text-anchor="middle" font-family="'Inter', monospace" font-size="34" font-weight="900" fill="#FFFFFF">1</text>
      </g>

      <!-- Copy OTP Button -->
      <g transform="translate(100, 250)">
        <rect width="190" height="52" rx="8" fill="#FFFFFF"/>
        <text x="95" y="32" text-anchor="middle" font-size="14" font-weight="700" fill="#111827">نسخ رمز OTP بضغطة 📋</text>
      </g>

      <!-- Bottom Tip -->
      <text x="795" y="375" text-anchor="end" font-size="13" font-weight="700" fill="#111827">✓ تم استلام الرسالة بدون الحاجة لتحديث الصفحة بفضل البث المباشر (Server-Sent Events).</text>
      <text x="795" y="400" text-anchor="end" font-size="12" fill="#6B7280">يمكنك نسخ الكود واستخدامه في صفحة التسجيل لإنهاء العملية خلال ثوانٍ معدودة.</text>
    </svg>`,
  },

  // 4. قراءة محتوى الرسالة وروابط التفعيل
  {
    filename: 'step-4-preview-message',
    width: 900,
    height: 480,
    svg: `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="480" viewBox="0 0 900 480" direction="rtl">
      <defs>
        <style>${fontStyles}</style>
        <filter id="shadow4" x="-10%" y="-10%" width="120%" height="125%">
          <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#000000" flood-opacity="0.08"/>
        </filter>
      </defs>

      <rect width="900" height="480" fill="#F8F9FA"/>
      <rect x="25" y="25" width="850" height="430" rx="20" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="1.5" filter="url(#shadow4)"/>

      <path d="M 25 45 Q 25 25 45 25 L 855 25 Q 875 25 875 45 L 875 75 L 25 75 Z" fill="#F3F4F6"/>
      <line x1="25" y1="75" x2="875" y2="75" stroke="#E5E7EB" stroke-width="1"/>
      <circle cx="55" cy="50" r="6" fill="#EF4444"/>
      <circle cx="75" cy="50" r="6" fill="#F59E0B"/>
      <circle cx="95" cy="50" r="6" fill="#10B981"/>
      <text x="840" y="55" text-anchor="end" font-size="14" font-weight="700" fill="#111827">الخطوة 4: معاينة محتوى البريد والضغط على روابط التفعيل بأمان</text>

      <!-- Modal Preview Box -->
      <rect x="70" y="95" width="760" height="330" rx="14" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="1.5"/>

      <!-- Modal Titlebar -->
      <rect x="70" y="95" width="760" height="50" rx="14" fill="#F9FAFB"/>
      <text x="800" y="127" text-anchor="end" font-size="14" font-weight="700" fill="#111827">معاينة الرسالة الأصلية الآمنة (HTML Sandbox)</text>
      <circle cx="100" cy="120" r="12" fill="#E5E7EB"/>
      <text x="100" y="125" text-anchor="middle" font-size="13" font-weight="700" fill="#374151">✕</text>

      <!-- Message Content Sandbox Simulation -->
      <rect x="100" y="165" width="700" height="235" rx="10" fill="#FAFAFA" stroke="#E5E7EB" stroke-width="1"/>

      <text x="770" y="200" text-anchor="end" font-size="15" font-weight="700" fill="#111827">مرحباً بك! شكراً لانضمامك إلى منصتنا</text>
      <text x="770" y="230" text-anchor="end" font-size="13" fill="#4B5563">لإتمام إنشاء حسابك وتأكيد بريدك الإلكتروني، يرجى الضغط على زر التفعيل أدناه:</text>

      <!-- Activation CTA Button inside email -->
      <rect x="490" y="260" width="280" height="50" rx="10" fill="#111827"/>
      <text x="630" y="291" text-anchor="middle" font-size="15" font-weight="700" fill="#FFFFFF">تفعيل الحساب الآن (Verify Account) 🔗</text>

      <!-- Security Notice -->
      <rect x="130" y="335" width="640" height="48" rx="8" fill="#FEF3C7" stroke="#FDE68A" stroke-width="1"/>
      <text x="745" y="364" text-anchor="end" font-size="12" font-weight="700" fill="#92400E">🛡 فحص الأمان: الروابط مفحوصة ومعزولة داخل بيئة آمنة تمنع البرمجيات الضارة والتتبع.</text>
    </svg>`,
  },

  // 5. التدمير الذاتي التلقائي بعد انتهاء الصلاحية
  {
    filename: 'step-5-auto-expiration',
    width: 900,
    height: 480,
    svg: `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="480" viewBox="0 0 900 480" direction="rtl">
      <defs>
        <style>${fontStyles}</style>
        <filter id="shadow5" x="-10%" y="-10%" width="120%" height="125%">
          <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#000000" flood-opacity="0.08"/>
        </filter>
      </defs>

      <rect width="900" height="480" fill="#F8F9FA"/>
      <rect x="25" y="25" width="850" height="430" rx="20" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="1.5" filter="url(#shadow5)"/>

      <path d="M 25 45 Q 25 25 45 25 L 855 25 Q 875 25 875 45 L 875 75 L 25 75 Z" fill="#F3F4F6"/>
      <line x1="25" y1="75" x2="875" y2="75" stroke="#E5E7EB" stroke-width="1"/>
      <circle cx="55" cy="50" r="6" fill="#EF4444"/>
      <circle cx="75" cy="50" r="6" fill="#F59E0B"/>
      <circle cx="95" cy="50" r="6" fill="#10B981"/>
      <text x="840" y="55" text-anchor="end" font-size="14" font-weight="700" fill="#111827">الخطوة 5: بروتوكول التدمير الذاتي التلقائي وحذف البيانات</text>

      <!-- Expired State Box -->
      <rect x="70" y="105" width="760" height="315" rx="16" fill="#FFFFFF" stroke="#DC2626" stroke-width="1.5"/>

      <circle cx="760" cy="155" r="22" fill="#FEE2E2"/>
      <text x="760" y="162" text-anchor="middle" font-size="22" fill="#DC2626">🗑</text>

      <text x="720" y="150" text-anchor="end" font-size="18" font-weight="700" fill="#991B1B">انتهت مدة صلاحية العنوان (تم الإتلاف الكامل)</text>
      <text x="720" y="175" text-anchor="end" font-size="13" fill="#6B7280">تم مسح صندوق البريد وكافة الرسائل الواردة بشكل نهائي وغير قابل للاسترجاع.</text>

      <!-- Security Audit Stats -->
      <g transform="translate(95, 205)">
        <rect width="710" height="110" rx="10" fill="#F9FAFB" stroke="#E5E7EB" stroke-width="1"/>
        
        <rect x="20" y="20" width="200" height="70" rx="8" fill="#FFFFFF" stroke="#E5E7EB"/>
        <text x="120" y="48" text-anchor="middle" font-size="12" fill="#6B7280">حالة صندوق الوارد</text>
        <text x="120" y="72" text-anchor="middle" font-size="15" font-weight="700" fill="#DC2626">تم المسح من الذاكرة</text>

        <rect x="250" y="20" width="200" height="70" rx="8" fill="#FFFFFF" stroke="#E5E7EB"/>
        <text x="350" y="48" text-anchor="middle" font-size="12" fill="#6B7280">سجلات الخادم (Logs)</text>
        <text x="350" y="72" text-anchor="middle" font-size="15" font-weight="700" fill="#16A34A">صفر أثر رقمي (0 logs)</text>

        <rect x="480" y="20" width="210" height="70" rx="8" fill="#FFFFFF" stroke="#E5E7EB"/>
        <text x="585" y="48" text-anchor="middle" font-size="12" fill="#6B7280">تجديد أو توليد جديد</text>
        <text x="585" y="72" text-anchor="middle" font-size="15" font-weight="700" fill="#111827">فوري بضغطة زر</text>
      </g>

      <!-- Generate Fresh Button -->
      <rect x="290" y="345" width="320" height="50" rx="10" fill="#111827"/>
      <text x="450" y="376" text-anchor="middle" font-size="15" font-weight="700" fill="#FFFFFF">توليد عنوان بريد جديد فوراً ⟳</text>
    </svg>`,
  },
];

async function generate() {
  console.log(`🖼 Generating ${images.length} realistic guide images with embedded local fonts...`);

  for (const item of images) {
    const svgBuffer = Buffer.from(item.svg);

    for (const dir of outputDirs) {
      // 1. Save crisp SVG
      const svgPath = path.join(dir, `${item.filename}.svg`);
      fs.writeFileSync(svgPath, item.svg, 'utf-8');

      // 2. Save WebP at 2x density for retina displays
      const webpPath = path.join(dir, `${item.filename}.webp`);
      await sharp(svgBuffer, { density: 192 })
        .webp({ quality: 95 })
        .toFile(webpPath);
      
      console.log(`  ✔ Generated: ${item.filename}.webp & .svg in ${path.relative(process.cwd(), dir)}`);
    }
  }

  console.log(`✅ All realistic guide images generated successfully!`);
}

generate().catch(err => {
  console.error('❌ Error generating guide images:', err);
  process.exit(1);
});
