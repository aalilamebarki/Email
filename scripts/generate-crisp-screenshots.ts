import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const outputDirs = [
  path.join(process.cwd(), 'frontend', 'assets', 'screenshots'),
  path.join(process.cwd(), 'public', 'assets', 'screenshots'),
];

for (const dir of outputDirs) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

interface ScreenshotDef {
  filename: string;
  width: number;
  height: number;
  svg: string;
}

const screenshots: ScreenshotDef[] = [
  // 1. Copy button confirmation
  {
    filename: 'copy-button-confirmation.webp',
    width: 800,
    height: 420,
    svg: `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="420" viewBox="0 0 800 420" style="background:#F9F9F9;font-family:'Cairo',Arial,sans-serif;">
      <!-- Window container -->
      <rect x="30" y="30" width="740" height="360" rx="16" fill="#FFFFFF" stroke="#000000" stroke-width="2"/>
      
      <!-- Window header dots -->
      <circle cx="65" cy="65" r="6" fill="#000000" opacity="0.2"/>
      <circle cx="85" cy="65" r="6" fill="#000000" opacity="0.2"/>
      <circle cx="105" cy="65" r="6" fill="#000000" opacity="0.2"/>
      
      <text x="710" y="70" text-anchor="end" font-size="13" font-weight="bold" fill="#666666">نافذة البريد المؤقت الفوري</text>
      <line x1="30" y1="95" x2="770" y2="95" stroke="#EAEAEA" stroke-width="1"/>

      <!-- Timer & Label -->
      <text x="710" y="140" text-anchor="end" font-size="14" font-weight="600" fill="#666666">عنوان بريدك المؤقت الجاهز للاستخدام</text>
      <rect x="70" y="122" width="130" height="28" rx="14" fill="#F0F0F0"/>
      <circle cx="86" cy="136" r="4" fill="#000000"/>
      <text x="145" y="141" text-anchor="middle" font-size="13" font-family="monospace" font-weight="bold" fill="#000000">19:45 متبقي</text>

      <!-- Address Box -->
      <rect x="70" y="165" width="660" height="90" rx="12" fill="#FAFAFA" stroke="#EAEAEA" stroke-width="1.5"/>
      <text x="700" y="218" text-anchor="end" font-size="22" font-family="monospace" font-weight="bold" fill="#000000">k9x4m7v@freetemp.email</text>

      <!-- Copy Button (Active Copied State) -->
      <g transform="translate(90, 185)">
        <rect width="180" height="50" rx="8" fill="#000000"/>
        <!-- Checkmark icon -->
        <polyline points="30,26 40,36 58,16" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="110" y="32" text-anchor="middle" font-size="15" font-weight="bold" fill="#FFFFFF">تم النسخ ✓</text>
      </g>

      <!-- Explanatory note -->
      <rect x="70" y="280" width="660" height="70" rx="10" fill="#F5F5F5" stroke="#EAEAEA" stroke-width="1"/>
      <text x="700" y="312" text-anchor="end" font-size="13" font-weight="bold" fill="#000000">💡 تم نسخ العنوان إلى الحافظة بنجاح</text>
      <text x="700" y="334" text-anchor="end" font-size="12" fill="#666666">يمكنك الآن لصقه مباشرة في أي موقع يطلب بريداً إلكترونياً للتسجيل أو التحقق.</text>
    </svg>`,
  },

  // 2. OTP Code Display
  {
    filename: 'otp-code-display.webp',
    width: 800,
    height: 420,
    svg: `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="420" viewBox="0 0 800 420" style="background:#F9F9F9;font-family:'Cairo',Arial,sans-serif;">
      <rect x="30" y="30" width="740" height="360" rx="16" fill="#FFFFFF" stroke="#000000" stroke-width="2"/>
      
      <!-- Card header -->
      <rect x="55" y="60" width="690" height="70" rx="10" fill="#FAFAFA" stroke="#EAEAEA" stroke-width="1"/>
      <text x="720" y="92" text-anchor="end" font-size="16" font-weight="bold" fill="#000000">رمز التحقق لتأكيد حسابك (Verification Code)</text>
      <text x="720" y="115" text-anchor="end" font-size="12" fill="#666666">المرسل: <tspan font-family="monospace" font-weight="bold" fill="#000000">noreply@security-service.com</tspan></text>
      <text x="80" y="95" font-size="12" font-family="monospace" fill="#888888">الآن (10:14)</text>

      <!-- Prominent OTP Callout Box -->
      <rect x="55" y="150" width="690" height="135" rx="12" fill="#000000" stroke="#000000" stroke-width="1.5"/>
      <text x="715" y="188" text-anchor="end" font-size="13" font-weight="bold" fill="#A0A0A0">رمز التحقق السريع (OTP):</text>
      
      <!-- Big Digits -->
      <g transform="translate(420, 205)">
        <rect x="0" y="0" width="50" height="60" rx="8" fill="#1E1E1E"/>
        <text x="25" y="42" text-anchor="middle" font-size="32" font-family="monospace" font-weight="900" fill="#FFFFFF">8</text>
        <rect x="56" y="0" width="50" height="60" rx="8" fill="#1E1E1E"/>
        <text x="81" y="42" text-anchor="middle" font-size="32" font-family="monospace" font-weight="900" fill="#FFFFFF">4</text>
        <rect x="112" y="0" width="50" height="60" rx="8" fill="#1E1E1E"/>
        <text x="137" y="42" text-anchor="middle" font-size="32" font-family="monospace" font-weight="900" fill="#FFFFFF">9</text>
        <rect x="168" y="0" width="50" height="60" rx="8" fill="#1E1E1E"/>
        <text x="193" y="42" text-anchor="middle" font-size="32" font-family="monospace" font-weight="900" fill="#FFFFFF">2</text>
        <rect x="224" y="0" width="50" height="60" rx="8" fill="#1E1E1E"/>
        <text x="249" y="42" text-anchor="middle" font-size="32" font-family="monospace" font-weight="900" fill="#FFFFFF">0</text>
        <rect x="280" y="0" width="50" height="60" rx="8" fill="#1E1E1E"/>
        <text x="305" y="42" text-anchor="middle" font-size="32" font-family="monospace" font-weight="900" fill="#FFFFFF">1</text>
      </g>

      <!-- Copy OTP Button -->
      <g transform="translate(85, 210)">
        <rect width="170" height="48" rx="8" fill="#FFFFFF"/>
        <text x="85" y="30" text-anchor="middle" font-size="14" font-weight="bold" fill="#000000">نسخ الكود 📋</text>
      </g>

      <!-- Feature hint footer -->
      <text x="720" y="325" text-anchor="end" font-size="13" font-weight="bold" fill="#000000">⚡ استخراج تلقائي وفوري:</text>
      <text x="720" y="350" text-anchor="end" font-size="12" fill="#666666">يقوم نظامنا باكتشاف رموز OTP من نص الرسالة تلقائياً وعرضها بهذا الشكل البارز دون الحاجة لفتح الرسالة كاملة.</text>
    </svg>`,
  },

  // 3. Inbox Live Incoming Message
  {
    filename: 'inbox-live-message.webp',
    width: 800,
    height: 420,
    svg: `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="420" viewBox="0 0 800 420" style="background:#F9F9F9;font-family:'Cairo',Arial,sans-serif;">
      <rect x="30" y="30" width="740" height="360" rx="16" fill="#FFFFFF" stroke="#000000" stroke-width="2"/>
      
      <!-- Section Title -->
      <text x="720" y="75" text-anchor="end" font-size="18" font-weight="bold" fill="#000000">صندوق الوارد (1 رسالة جديدة)</text>
      <circle cx="730" cy="70" r="5" fill="#00CC66"/>
      <line x1="50" y1="95" x2="750" y2="95" stroke="#EAEAEA" stroke-width="1.5"/>

      <!-- Message Card Item -->
      <rect x="50" y="115" width="700" height="155" rx="12" fill="#FFFFFF" stroke="#000000" stroke-width="1.5"/>
      
      <!-- Badge -->
      <rect x="670" y="132" width="60" height="24" rx="12" fill="#000000"/>
      <text x="700" y="148" text-anchor="middle" font-size="11" font-weight="bold" fill="#FFFFFF">جديد</text>
      
      <text x="655" y="150" text-anchor="end" font-size="15" font-weight="bold" fill="#000000">تأكيد تسجيل حسابك في المنصة</text>
      <text x="80" y="150" font-size="12" font-family="monospace" fill="#666666">منذ 5 ثوانٍ</text>

      <!-- Sender Info -->
      <text x="720" y="185" text-anchor="end" font-size="13" fill="#666666">المرسل: <tspan font-family="monospace" font-weight="bold" fill="#000000">support@verification-hub.io</tspan></text>
      
      <!-- Actions inside Card -->
      <rect x="550" y="210" width="170" height="38" rx="8" fill="#000000"/>
      <text x="635" y="234" text-anchor="middle" font-size="12" font-weight="bold" fill="#FFFFFF">عرض الرسالة كاملة ↗</text>

      <rect x="360" y="210" width="175" height="38" rx="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.2"/>
      <text x="447" y="234" text-anchor="middle" font-size="12" font-weight="bold" fill="#000000">تأكيد الرابط السريع 🔗</text>

      <!-- WebSocket Live Connection Indicator -->
      <rect x="50" y="295" width="700" height="65" rx="10" fill="#FAFAFA" stroke="#EAEAEA" stroke-width="1"/>
      <circle cx="715" cy="328" r="6" fill="#00CC66"/>
      <text x="695" y="333" text-anchor="end" font-size="13" font-weight="bold" fill="#000000">اتصال بث مباشر (Live WebSocket):</text>
      <text x="695" y="350" text-anchor="end" font-size="12" fill="#666666">تظهر الرسائل فور وصولها لخوادمنا خلال ثوانٍ دون الحاجة للضغط على زر التحديث إطلاقاً.</text>
    </svg>`,
  },

  // 4. Generate New Address
  {
    filename: 'generate-new-address.webp',
    width: 800,
    height: 420,
    svg: `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="420" viewBox="0 0 800 420" style="background:#F9F9F9;font-family:'Cairo',Arial,sans-serif;">
      <rect x="30" y="30" width="740" height="360" rx="16" fill="#FFFFFF" stroke="#000000" stroke-width="2"/>
      
      <text x="720" y="75" text-anchor="end" font-size="18" font-weight="bold" fill="#000000">توليد عنوان بريد مؤقت جديد</text>
      <line x1="50" y1="95" x2="750" y2="95" stroke="#EAEAEA" stroke-width="1.5"/>

      <!-- Old Address Crossed -->
      <rect x="60" y="120" width="680" height="55" rx="8" fill="#FAFAFA" stroke="#EAEAEA" stroke-width="1"/>
      <text x="700" y="153" text-anchor="end" font-size="14" fill="#888888">العنوان السابق: <tspan font-family="monospace" text-decoration="line-through">old_user71@freetemp.email</tspan></text>
      <text x="90" y="153" font-size="12" fill="#999999">تم حذفه وإتلافه نهائياً</text>

      <!-- New Address with Focus on Refresh Button -->
      <rect x="60" y="195" width="680" height="80" rx="10" fill="#FFFFFF" stroke="#000000" stroke-width="2"/>
      <text x="700" y="242" text-anchor="end" font-size="20" font-family="monospace" font-weight="bold" fill="#000000">fresh_box84@freetemp.email</text>

      <!-- Refresh Button Highlighted -->
      <g transform="translate(85, 208)">
        <rect width="180" height="54" rx="8" fill="#000000"/>
        <!-- Refresh arrows icon -->
        <path d="M 28 27 A 10 10 0 1 1 38 37" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
        <polyline points="38,32 38,38 32,38" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
        <text x="105" y="34" text-anchor="middle" font-size="14" font-weight="bold" fill="#FFFFFF">تغيير العنوان ↻</text>
      </g>

      <!-- Explanation note -->
      <rect x="60" y="295" width="680" height="65" rx="8" fill="#F5F5F5"/>
      <text x="700" y="325" text-anchor="end" font-size="13" font-weight="bold" fill="#000000">🔄 إمكانية التبديل في أي لحظة:</text>
      <text x="700" y="345" text-anchor="end" font-size="12" fill="#666666">تستطيع بنقرة واحدة إتلاف العنوان الحالي والحصول على عنوان جديد تماماً بصندوق وارد مستقل.</text>
    </svg>`,
  },

  // 5. Verification Links Action
  {
    filename: 'verification-links-action.webp',
    width: 800,
    height: 420,
    svg: `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="420" viewBox="0 0 800 420" style="background:#F9F9F9;font-family:'Cairo',Arial,sans-serif;">
      <rect x="30" y="30" width="740" height="360" rx="16" fill="#FFFFFF" stroke="#000000" stroke-width="2"/>
      
      <text x="720" y="75" text-anchor="end" font-size="18" font-weight="bold" fill="#000000">التعامل مع روابط تفعيل الحسابات المباشرة</text>
      <line x1="50" y1="95" x2="750" y2="95" stroke="#EAEAEA" stroke-width="1.5"/>

      <!-- Message preview box -->
      <rect x="60" y="115" width="680" height="150" rx="12" fill="#FAFAFA" stroke="#EAEAEA" stroke-width="1.5"/>
      <text x="700" y="150" text-anchor="end" font-size="15" font-weight="bold" fill="#000000">تفعيل حسابك في مجتمع المطورين</text>
      <text x="700" y="175" text-anchor="end" font-size="12" fill="#666666">أهلاً بك! انقر على زر التفعيل أدناه لتأكيد بريدك الإلكتروني والبدء في استخدام الحساب فوراً.</text>

      <!-- Action Button for Direct Link -->
      <g transform="translate(460, 200)">
        <rect width="240" height="45" rx="8" fill="#000000"/>
        <text x="120" y="28" text-anchor="middle" font-size="14" font-weight="bold" fill="#FFFFFF">فتح الرابط #1 (تفعيل الحساب) ↗</text>
      </g>

      <g transform="translate(230, 200)">
        <rect width="210" height="45" rx="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.5"/>
        <text x="105" y="28" text-anchor="middle" font-size="13" font-weight="bold" fill="#000000">عرض الرسالة كاملة</text>
      </g>

      <!-- Safety guarantee note -->
      <rect x="60" y="285" width="680" height="75" rx="10" fill="#FFFFFF" stroke="#000000" stroke-width="1.5"/>
      <text x="700" y="318" text-anchor="end" font-size="13" font-weight="bold" fill="#000000">🛡️ بيئة معزولة وآمنة (Sandboxed Preview):</text>
      <text x="700" y="340" text-anchor="end" font-size="12" fill="#666666">تُستخرج الروابط تلقائياً لحمايتك من أي نصوص برمجية ضارة، مع إمكانية فتحها مباشرة في نافذة آمنة.</text>
    </svg>`,
  },

  // 6. FAQ Accordion Expanded
  {
    filename: 'faq-accordion-expanded.webp',
    width: 800,
    height: 420,
    svg: `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="420" viewBox="0 0 800 420" style="background:#F9F9F9;font-family:'Cairo',Arial,sans-serif;">
      <rect x="30" y="30" width="740" height="360" rx="16" fill="#FFFFFF" stroke="#000000" stroke-width="2"/>
      
      <text x="720" y="75" text-anchor="end" font-size="18" font-weight="bold" fill="#000000">الأسئلة الشائعة (FAQ Accordion)</text>
      <line x1="50" y1="95" x2="750" y2="95" stroke="#EAEAEA" stroke-width="1.5"/>

      <!-- Question 1: Open state -->
      <rect x="60" y="115" width="680" height="150" rx="12" fill="#FFFFFF" stroke="#000000" stroke-width="2"/>
      <text x="690" y="148" text-anchor="end" font-size="15" font-weight="bold" fill="#000000">هل البريد المؤقت آمن للاستخدام؟</text>
      <!-- Arrow Up indicator -->
      <g transform="translate(85, 140)">
        <polygon points="0,5 12,5 6,-2" fill="#000000"/>
      </g>
      <line x1="80" y1="165" x2="700" y2="165" stroke="#EAEAEA" stroke-width="1"/>
      <text x="690" y="195" text-anchor="end" font-size="13" fill="#444444">نعم للاستخدامات المؤقتة وغير الحساسة، مثل التسجيل في المواقع أو استقبال رموز التحقق.</text>
      <text x="690" y="218" text-anchor="end" font-size="13" fill="#444444">لا يُنصح باستخدامه لحسابات دائمة كالحسابات البنكية، لأن الرسائل تُتلف ذاتياً بعد انتهاء المدة.</text>

      <!-- Question 2: Closed state -->
      <rect x="60" y="280" width="680" height="60" rx="10" fill="#FAFAFA" stroke="#EAEAEA" stroke-width="1"/>
      <text x="690" y="316" text-anchor="end" font-size="14" font-weight="bold" fill="#000000">كم من الوقت تبقى الرسائل قبل الحذف؟</text>
      <g transform="translate(85, 312)">
        <polygon points="0,-2 12,-2 6,5" fill="#666666"/>
      </g>
    </svg>`,
  },

  // 7. Timer Expiration Notice
  {
    filename: 'timer-expiration-notice.webp',
    width: 800,
    height: 420,
    svg: `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="420" viewBox="0 0 800 420" style="background:#F9F9F9;font-family:'Cairo',Arial,sans-serif;">
      <rect x="30" y="30" width="740" height="360" rx="16" fill="#FFFFFF" stroke="#000000" stroke-width="2"/>
      
      <text x="720" y="75" text-anchor="end" font-size="18" font-weight="bold" fill="#000000">إشعار انتهاء الصلاحية والإتلاف التلقائي</text>
      <line x1="50" y1="95" x2="750" y2="95" stroke="#EAEAEA" stroke-width="1.5"/>

      <!-- Timer at 00:00 -->
      <rect x="290" y="115" width="220" height="50" rx="10" fill="#F0F0F0" stroke="#000000" stroke-width="1"/>
      <text x="400" y="148" text-anchor="middle" font-size="20" font-family="monospace" font-weight="900" fill="#000000">00:00 انتهى الوقت</text>

      <!-- Expired Banner -->
      <rect x="60" y="180" width="680" height="90" rx="12" fill="#FAFAFA" stroke="#000000" stroke-width="1.8"/>
      <text x="690" y="218" text-anchor="end" font-size="15" font-weight="bold" fill="#000000">⏳ انتهت صلاحية عنوان البريد المؤقت</text>
      <text x="690" y="242" text-anchor="end" font-size="13" fill="#666666">تم حذف وتدمير كافة الرسائل الواردة نهائياً من الذاكرة لضمان عدم تسريب أي أثر رقمي لنشاطك.</text>

      <!-- Action: Generate Fresh Inbox -->
      <g transform="translate(100, 202)">
        <rect width="180" height="45" rx="8" fill="#000000"/>
        <text x="90" y="28" text-anchor="middle" font-size="13" font-weight="bold" fill="#FFFFFF">توليد عنوان جديد الآن</text>
      </g>

      <!-- Privacy rule reminder -->
      <text x="690" y="320" text-anchor="end" font-size="13" font-weight="bold" fill="#000000">🔒 سياسة الاحتفاظ الصفري (Zero Retention):</text>
      <text x="690" y="342" text-anchor="end" font-size="12" fill="#666666">نحن لا نحتفظ بأي سجلات أو نسخ احتياطية للمراسلات بعد انتهاء الصلاحية مطلقاً.</text>
    </svg>`,
  },
];

async function generateAll() {
  console.log('🚀 [Screenshots Generator] Generating crisp WebP UI screenshots...');
  for (const item of screenshots) {
    const svgBuffer = Buffer.from(item.svg);
    for (const outDir of outputDirs) {
      const targetFile = path.join(outDir, item.filename);
      await sharp(svgBuffer)
        .resize(item.width, item.height)
        .webp({ quality: 80 })
        .toFile(targetFile);
      console.log(`✔ Generated: ${targetFile}`);
    }
  }
  console.log('✅ All WebP screenshots generated successfully with crisp quality & proper dimensions!');
}

generateAll().catch(err => {
  console.error('Error generating screenshots:', err);
  process.exit(1);
});
