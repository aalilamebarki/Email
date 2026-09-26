import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <radialGradient id="glow" cx="50%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#1A1A1A" stop-opacity="1"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="1"/>
    </radialGradient>
    <pattern id="dot-grid" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.2" fill="#262626"/>
    </pattern>
    <linearGradient id="badge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#222222"/>
      <stop offset="100%" stop-color="#111111"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect width="1200" height="630" fill="url(#dot-grid)"/>

  <!-- Border Card -->
  <rect x="24" y="24" width="1152" height="582" rx="24" fill="none" stroke="#262626" stroke-width="2"/>

  <!-- Top Security Badge -->
  <g transform="translate(600, 110)">
    <rect x="-180" y="-18" width="360" height="36" rx="18" fill="url(#badge-grad)" stroke="#383838" stroke-width="1.5"/>
    <circle cx="-150" cy="0" r="4" fill="#00FF66"/>
    <text x="-135" y="5" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#EAEAEA" letter-spacing="2">
      CLOUDFLARE EDGE • 100% PRIVATE
    </text>
  </g>

  <!-- Logo Envelope Icon -->
  <g transform="translate(600, 205)">
    <rect x="-45" y="-45" width="90" height="90" rx="20" fill="#FFFFFF"/>
    <rect x="-26" y="-18" width="52" height="38" rx="5" fill="none" stroke="#000000" stroke-width="4.5"/>
    <polyline points="-24,-14 0,5 24,-14" fill="none" stroke="#000000" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  </g>

  <!-- Main Headline -->
  <text x="600" y="325" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="-1">
    TEMP MAIL — بريد مؤقت فوري
  </text>

  <!-- Subheadline -->
  <text x="600" y="380" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="500" fill="#A1A1A1" text-anchor="middle">
    إيميل وهمي مجاني وآمن لاستقبال رسائل التفعيل وأكواد OTP بدون تسجيل
  </text>

  <!-- Feature Pills -->
  <g transform="translate(600, 460)">
    <!-- Pill 1 -->
    <g transform="translate(-320, 0)">
      <rect x="-130" y="-22" width="260" height="44" rx="22" fill="#141414" stroke="#282828" stroke-width="1"/>
      <text x="0" y="6" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="600" fill="#FFFFFF" text-anchor="middle">
        ⚡ استخراج أكواد OTP فوراً
      </text>
    </g>

    <!-- Pill 2 -->
    <g transform="translate(0, 0)">
      <rect x="-130" y="-22" width="260" height="44" rx="22" fill="#141414" stroke="#282828" stroke-width="1"/>
      <text x="0" y="6" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="600" fill="#FFFFFF" text-anchor="middle">
        🛡️ حماية الخصوصية من Spam
      </text>
    </g>

    <!-- Pill 3 -->
    <g transform="translate(320, 0)">
      <rect x="-130" y="-22" width="260" height="44" rx="22" fill="#141414" stroke="#282828" stroke-width="1"/>
      <text x="0" y="6" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="600" fill="#FFFFFF" text-anchor="middle">
        🌐 8 لغات عالمية مدعومة
      </text>
    </g>
  </g>

  <!-- Footer Link -->
  <text x="600" y="555" font-family="'Courier New', Courier, monospace" font-size="16" font-weight="700" fill="#666666" text-anchor="middle" letter-spacing="1">
    HTTPS://GROWHUBTIPS.COM
  </text>
</svg>`;

async function main() {
  const publicDir = path.resolve(process.cwd(), 'public');
  const svgPath = path.join(publicDir, 'og-image.svg');
  const pngPath = path.join(publicDir, 'og-image.png');

  fs.writeFileSync(svgPath, svgContent, 'utf-8');
  console.log('✔ Created public/og-image.svg');

  await sharp(Buffer.from(svgContent))
    .resize(1200, 630)
    .png({ quality: 95, compressionLevel: 8 })
    .toFile(pngPath);

  console.log('✔ Generated high-resolution 1200x630 public/og-image.png via sharp');
}

main().catch((err) => {
  console.error('Failed to generate OG image:', err);
  process.exit(1);
});
