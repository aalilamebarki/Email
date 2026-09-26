import fs from 'node:fs';
import path from 'node:path';
import { ARTICLES_CATALOG } from './data-articles-catalog.ts';

console.log('Preparing 22-Article Internationalization Matrix across all 22 languages...');

// Native localized names for categories across 22 languages
const CATEGORY_TRANSLATIONS: Record<string, Record<string, string>> = {
  'Security & Protocols': {
    ar: 'الأمان والبروتوكولات',
    en: 'Security & Protocols',
    es: 'Seguridad y Protocolos',
    fr: 'Sécurité et Protocoles',
    de: 'Sicherheit und Protokolle',
    pt: 'Segurança e Protocolos',
    it: 'Sicurezza e Protocolli',
    ru: 'Безопасность и Протоколы',
    tr: 'Güvenlik ve Protokoller',
    zh: '安全与协议',
    ja: 'セキュリティとプロトコル',
    ko: '보안 및 프로토콜',
    nl: 'Beveiliging en Protocollen',
    pl: 'Bezpieczeństwo i Protokoły',
    id: 'Keamanan & Protokol',
    vi: 'Bảo mật & Giao thức',
    hi: 'सुरक्षा और प्रोटोकॉल',
    fa: 'امنیت و پروتکل‌ها',
    ur: 'سیکیورٹی اور پروٹوکولز',
    uk: 'Безпека та Протоколи',
    sv: 'Säkerhet och Protokoll',
    el: 'Ασφάλεια και Πρωτόκολλα',
  },
  'Edge Architecture': {
    ar: 'بنية خوادم الحافة',
    en: 'Edge Architecture',
    es: 'Arquitectura Edge',
    fr: 'Architecture Edge',
    de: 'Edge-Architektur',
    pt: 'Arquitetura Edge',
    it: 'Architettura Edge',
    ru: 'Архитектура Edge',
    tr: 'Edge Mimarisi',
    zh: '边缘架构',
    ja: 'エッジアーキテクチャ',
    ko: '엣지 아키텍처',
    nl: 'Edge-architectuur',
    pl: 'Architektura Edge',
    id: 'Arsitektur Edge',
    vi: 'Kiến trúc Edge',
    hi: 'एज आर्किटेक्चर',
    fa: 'معماری اج',
    ur: 'ایج آرکیٹیکچر',
    uk: 'Edge-архітектура',
    sv: 'Edge-arkitektur',
    el: 'Αρχιτεκτονική Edge',
  },
  'Email Protocols': {
    ar: 'بروتوكولات البريد',
    en: 'Email Protocols',
    es: 'Protocolos de Correo',
    fr: 'Protocoles de Messagerie',
    de: 'E-Mail-Protokolle',
    pt: 'Protocolos de E-mail',
    it: 'Protocolli Email',
    ru: 'Почтовые Протоколы',
    tr: 'E-posta Protokolleri',
    zh: '邮件协议',
    ja: 'メールプロトコル',
    ko: '이메일 프로토콜',
    nl: 'E-mailprotocollen',
    pl: 'Protokoły pocztowe',
    id: 'Protokol Email',
    vi: 'Giao thức Email',
    hi: 'ईमेल प्रोटोकॉल',
    fa: 'پروتکل‌های ایمیل',
    ur: 'ای میل پروٹوکولز',
    uk: 'Поштові протоколи',
    sv: 'E-postprotokoll',
    el: 'Πρωτόκολλα Email',
  },
  'Authentication': {
    ar: 'المصادقة الرقمية',
    en: 'Authentication',
    es: 'Autenticación',
    fr: 'Authentification',
    de: 'Authentifizierung',
    pt: 'Autenticação',
    it: 'Autenticazione',
    ru: 'Аутентификация',
    tr: 'Kimlik Doğrulama',
    zh: '身份验证',
    ja: '認証システム',
    ko: '인증 시스템',
    nl: 'Authenticatie',
    pl: 'Uwierzytelnianie',
    id: 'Autentikasi',
    vi: 'Xác thực',
    hi: 'प्रमाणीकरण',
    fa: 'احراز هویت',
    ur: 'تصدیق',
    uk: 'Автентифікація',
    sv: 'Autentisering',
    el: 'Έλεγχος Ταυτότητας',
  },
  'Cryptography & Privacy': {
    ar: 'التشفير والخصوصية',
    en: 'Cryptography & Privacy',
    es: 'Criptografía y Privacidad',
    fr: 'Cryptographie et Confidentialité',
    de: 'Kryptographie und Datenschutz',
    pt: 'Criptografia e Privacidade',
    it: 'Crittografia e Privacy',
    ru: 'Криптография и Приватность',
    tr: 'Kriptografi ve Gizlilik',
    zh: '密码学与隐私',
    ja: '暗号化とプライバシー',
    ko: '암호화 및 개인정보 보호',
    nl: 'Cryptografie en Privacy',
    pl: 'Kryptografia i Prywatność',
    id: 'Kriptografi & Privasi',
    vi: 'Mật mã & Quyền riêng tư',
    hi: 'क्रिप्टोग्राफी और गोपनीयता',
    fa: 'رمزنگاری و حریم خصوصی',
    ur: 'کریپٹوگرافی اور پرائیویسی',
    uk: 'Криптографія та Конфіденційність',
    sv: 'Kryptografi och Integritet',
    el: 'Κρυπτογραφία και Απόρρητο',
  },
  'User Guides': {
    ar: 'أدلة الاستخدام',
    en: 'User Guides',
    es: 'Guías de Usuario',
    fr: 'Guides Utilisateur',
    de: 'Benutzerhandbücher',
    pt: 'Guias do Usuário',
    it: 'Guide Utente',
    ru: 'Руководства Пользователя',
    tr: 'Kullanım Kılavuzları',
    zh: '使用指南',
    ja: 'ユーザーガイド',
    ko: '사용자 가이드',
    nl: 'Gebruikershandleidingen',
    pl: 'Przewodniki Użytkownika',
    id: 'Panduan Pengguna',
    vi: 'Hướng dẫn sử dụng',
    hi: 'उपयोगकर्ता गाइड',
    fa: 'راهنمای کاربر',
    ur: 'صارف کے رہنما خطوط',
    uk: 'Посібники Користувача',
    sv: 'Användarhandböcker',
    el: 'Οδηγοί Χρήσης',
  },
  'Security & Privacy': {
    ar: 'الأمان والخصوصية',
    en: 'Security & Privacy',
    es: 'Seguridad y Privacidad',
    fr: 'Sécurité et Confidentialité',
    de: 'Sicherheit und Datenschutz',
    pt: 'Segurança e Privacidade',
    it: 'Sicurezza e Privacy',
    ru: 'Безопасность и Конфиденциальность',
    tr: 'Güvenlik ve Gizlilik',
    zh: '安全与隐私',
    ja: 'セキュリティとプライバシー',
    ko: '보안 및 개인정보',
    nl: 'Beveiliging en Privacy',
    pl: 'Bezpieczeństwo i Prywatność',
    id: 'Keamanan & Privasi',
    vi: 'Bảo mật & Quyền riêng tư',
    hi: 'सुरक्षा और गोपनीयता',
    fa: 'امنیت و حریم خصوصی',
    ur: 'سیکیورٹی اور پرائیویسی',
    uk: 'Безпека та Приватність',
    sv: 'Säkerhet och Integritet',
    el: 'Ασφάλεια και Προστασία Προσωπικών Δεδομένων',
  },
  'Software Engineering': {
    ar: 'هندسة البرمجيات',
    en: 'Software Engineering',
    es: 'Ingeniería de Software',
    fr: 'Génie Logiciel',
    de: 'Software-Engineering',
    pt: 'Engenharia de Software',
    it: 'Ingegneria del Software',
    ru: 'Инженерия ПО',
    tr: 'Yazılım Mühendisliği',
    zh: '软件工程',
    ja: 'ソフトウェアエンジニアリング',
    ko: '소프트웨어 엔지니어링',
    nl: 'Software-engineering',
    pl: 'Inżynieria Oprogramowania',
    id: 'Rekayasa Perangkat Lunak',
    vi: 'Kỹ thuật Phần mềm',
    hi: 'सॉफ्टवेयर इंजीनियरिंग',
    fa: 'مهندسی نرم‌افزار',
    ur: 'سافٹ ویئر انجینئرنگ',
    uk: 'Інженерія ПЗ',
    sv: 'Programvaruteknik',
    el: 'Μηχανική Λογισμικού',
  },
  'Cyber Security': {
    ar: 'الأمن السيبراني',
    en: 'Cyber Security',
    es: 'Ciberseguridad',
    fr: 'Cybersécurité',
    de: 'Cybersicherheit',
    pt: 'Cibersegurança',
    it: 'Sicurezza Informatica',
    ru: 'Кибербезопасность',
    tr: 'Siber Güvenlik',
    zh: '网络安全',
    ja: 'サイバーセキュリティ',
    ko: '사이버 보안',
    nl: 'Cyberbeveiliging',
    pl: 'Cyberbezpieczeństwo',
    id: 'Keamanan Siber',
    vi: 'An ninh mạng',
    hi: 'साइबर सुरक्षा',
    fa: 'امنیت سایبری',
    ur: 'سائبر سیکیورٹی',
    uk: 'Кібербезпека',
    sv: 'Cybersäkerhet',
    el: 'Κυβερνοασφάλεια',
  },
  'Privacy Architecture': {
    ar: 'معمارية الخصوصية',
    en: 'Privacy Architecture',
    es: 'Arquitectura de Privacidad',
    fr: 'Architecture de Confidentialité',
    de: 'Datenschutz-Architektur',
    pt: 'Arquitetura de Privacidade',
    it: 'Architettura della Privacy',
    ru: 'Архитектура Приватности',
    tr: 'Gizlilik Mimarisi',
    zh: '隐私架构',
    ja: 'プライバシーアーキテクチャ',
    ko: '개인정보 아키텍처',
    nl: 'Privacy-architectuur',
    pl: 'Architektura Prywatności',
    id: 'Arsitektur Privasi',
    vi: 'Kiến trúc Quyền riêng tư',
    hi: 'गोपनीयता आर्किटेक्चर',
    fa: 'معماری حریم خصوصی',
    ur: 'پرائیویسی آرکیٹیکچر',
    uk: 'Архітектура Приватності',
    sv: 'Integritetsarkitektur',
    el: 'Αρχιτεκτονική Απορρήτου',
  },
  'Compliance & Legal': {
    ar: 'الامتثال والقوانين',
    en: 'Compliance & Legal',
    es: 'Cumplimiento y Legal',
    fr: 'Conformité et Légal',
    de: 'Compliance und Recht',
    pt: 'Conformidade e Legal',
    it: 'Conformità e Normativa',
    ru: 'Соответствие и Право',
    tr: 'Uyumluluk ve Hukuk',
    zh: '合规与法律',
    ja: 'コンプライアンスと法務',
    ko: '규정 준수 및 법무',
    nl: 'Naleving en Juridisch',
    pl: 'Zgodność i Prawo',
    id: 'Kepatuhan & Hukum',
    vi: 'Tuân thủ & Pháp lý',
    hi: 'अनुपालन और कानूनी',
    fa: 'انطباق و حقوقی',
    ur: 'تعمیل اور قانونی',
    uk: 'Відповідність та Право',
    sv: 'Efterlevnad och Juridik',
    el: 'Συμμόρφωση και Νομικά',
  },
  'Consumer Privacy': {
    ar: 'خصوصية المستهلك',
    en: 'Consumer Privacy',
    es: 'Privacidad del Consumidor',
    fr: 'Confidentialité du Consommateur',
    de: 'Verbraucher-Datenschutz',
    pt: 'Privacidade do Consumidor',
    it: 'Privacy dei Consumatori',
    ru: 'Приватность Потребителей',
    tr: 'Tüketici Gizliliği',
    zh: '消费者隐私',
    ja: '消費者プライバシー',
    ko: '소비자 개인정보 보호',
    nl: 'Consumentenprivacy',
    pl: 'Prywatność Konsumenta',
    id: 'Privasi Konsumen',
    vi: 'Quyền riêng tư người tiêu dùng',
    hi: 'उपभोक्ता गोपनीयता',
    fa: 'حریم خصوصی مصرف‌کننده',
    ur: 'صارف کی پرائیویسی',
    uk: 'Приватність Споживачів',
    sv: 'Konsumentintegritet',
    el: 'Απόρρητο Καταναλωτή',
  },
  'Developer API': {
    ar: 'واجهات المطورين',
    en: 'Developer API',
    es: 'API de Desarrolladores',
    fr: 'API Développeur',
    de: 'Entwickler-API',
    pt: 'API de Desenvolvedores',
    it: 'API Sviluppatori',
    ru: 'API для Разработчиков',
    tr: 'Geliştirici API',
    zh: '开发者 API',
    ja: '開発者向け API',
    ko: '개발자 API',
    nl: 'Ontwikkelaars-API',
    pl: 'API Programistyczne',
    id: 'API Pengembang',
    vi: 'API Nhà phát triển',
    hi: 'डेवलपर API',
    fa: 'API توسعه‌دهندگان',
    ur: 'ڈیولپر API',
    uk: 'API для розробників',
    sv: 'Utvecklar-API',
    el: 'API Προγραμματιστών',
  },
  'Network Infrastructure': {
    ar: 'البنية التحتية والشبكات',
    en: 'Network Infrastructure',
    es: 'Infraestructura de Red',
    fr: 'Infrastructure Réseau',
    de: 'Netzwerkinfrastruktur',
    pt: 'Infraestrutura de Rede',
    it: 'Infrastruttura di Rete',
    ru: 'Сетевая Инфраструктура',
    tr: 'Ağ Altyapısı',
    zh: '网络基础设施',
    ja: 'ネットワークインフラ',
    ko: '네트워크 인프라',
    nl: 'Netwerkinfrastructuur',
    pl: 'Infrastruktura Sieciowa',
    id: 'Infrastruktur Jaringan',
    vi: 'Hạ tầng mạng',
    hi: 'नेटवर्क इन्फ्रास्ट्रक्चर',
    fa: 'زیرساخت شبکه',
    ur: 'نیٹ ورک کا بنیادی ڈھانچہ',
    uk: 'Мережева Інфраструктура',
    sv: 'Nätverksinfrastruktur',
    el: 'Υποδομή Δικτύου',
  },
  'Cryptography & Architecture': {
    ar: 'التشفير والمعمارية',
    en: 'Cryptography & Architecture',
    es: 'Criptografía y Arquitectura',
    fr: 'Cryptographie et Architecture',
    de: 'Kryptographie und Architektur',
    pt: 'Criptografia e Arquitetura',
    it: 'Crittografia e Architettura',
    ru: 'Криптография и Архитектура',
    tr: 'Kriptografi ve Mimari',
    zh: '密码学与架构',
    ja: '暗号化とアーキテクチャ',
    ko: '암호화 및 아키텍처',
    nl: 'Cryptografie en Architectuur',
    pl: 'Kryptografia i Architektura',
    id: 'Kriptografi & Arsitektur',
    vi: 'Mật mã & Kiến trúc',
    hi: 'क्रिप्टोग्राफी और वास्तुकला',
    fa: 'رمزنگاری و معماری',
    ur: 'کریپٹوگرافی اور فن تعمیر',
    uk: 'Криптографія та Архітектура',
    sv: 'Kryptografi och Arkitektur',
    el: 'Κρυπτογραφία και Αρχιτεκτονική',
  },
  'Threat Defense': {
    ar: 'مكافحة التهديدات',
    en: 'Threat Defense',
    es: 'Defensa contra Amenazas',
    fr: 'Défense contre les Menaces',
    de: 'Bedrohungsabwehr',
    pt: 'Defesa contra Ameaças',
    it: 'Difesa dalle Minacce',
    ru: 'Защита от Угроз',
    tr: 'Tehdit Savunması',
    zh: '威胁防御',
    ja: '脅威ディフェンス',
    ko: '위협 방어',
    nl: 'Dreigingsverdediging',
    pl: 'Obrona przed Zagrożeniami',
    id: 'Pertahanan Ancaman',
    vi: 'Phòng thủ mối đe dọa',
    hi: 'खतरे से बचाव',
    fa: 'دفاع در برابر تهدیدات',
    ur: 'خطرہ کا دفاع',
    uk: 'Захист від Загроз',
    sv: 'Hotförsvar',
    el: 'Άμυνα κατά των Απειλών',
  },
  'Consumer Protection': {
    ar: 'حماية المستهلك',
    en: 'Consumer Protection',
    es: 'Protección al Consumidor',
    fr: 'Protection du Consommateur',
    de: 'Verbraucherschutz',
    pt: 'Proteção ao Consumidor',
    it: 'Protezione dei Consumatori',
    ru: 'Защита Потребителей',
    tr: 'Tüketici Hakları',
    zh: '消费者权益保护',
    ja: '消費者保護',
    ko: '소비자 보호',
    nl: 'Consumentenbescherming',
    pl: 'Ochrona Konsumenta',
    id: 'Perlindungan Konsumen',
    vi: 'Bảo vệ người tiêu dùng',
    hi: 'उपभोक्ता संरक्षण',
    fa: 'حمایت از مصرف‌کننده',
    ur: 'صارفین کا تحفظ',
    uk: 'Захист Прав Споживачів',
    sv: 'Konsumentskydd',
    el: 'Προστασία Καταναλωτή',
  },
  'Modern Web & PWA': {
    ar: 'الويب الحديث و PWA',
    en: 'Modern Web & PWA',
    es: 'Web Moderna y PWA',
    fr: 'Web Moderne et PWA',
    de: 'Modernes Web und PWA',
    pt: 'Web Moderna e PWA',
    it: 'Web Moderno e PWA',
    ru: 'Современный Веб и PWA',
    tr: 'Modern Web ve PWA',
    zh: '现代网络与 PWA',
    ja: 'モダンウェブと PWA',
    ko: '모던 웹 및 PWA',
    nl: 'Modern Web en PWA',
    pl: 'Nowoczesny Web i PWA',
    id: 'Web Modern & PWA',
    vi: 'Web hiện đại & PWA',
    hi: 'आधुनिक वेब और PWA',
    fa: 'وب مدرن و PWA',
    ur: 'ماڈرن ویب اور PWA',
    uk: 'Сучасний Веб та PWA',
    sv: 'Moderna Webb & PWA',
    el: 'Σύγχρονο Web και PWA',
  }
};

const allLangs = [
  'ar', 'en', 'es', 'fr', 'de', 'pt', 'it', 'ru', 'tr', 'zh',
  'ja', 'ko', 'nl', 'pl', 'id', 'vi', 'hi', 'fa', 'ur', 'uk', 'sv', 'el'
];

// Read shared/i18n.js
const i18nPath = 'shared/i18n.js';
let i18nContent = fs.readFileSync(i18nPath, 'utf8');

for (const lang of allLangs) {
  const isAr = lang === 'ar';
  const isEn = lang === 'en';
  const langKey = `${lang}: {`;
  const idx = i18nContent.indexOf(langKey);

  if (idx !== -1) {
    let braceCount = 0;
    let endIdx = -1;
    for (let i = idx; i < i18nContent.length; i++) {
      if (i18nContent[i] === '{') braceCount++;
      else if (i18nContent[i] === '}') {
        braceCount--;
        if (braceCount === 0) {
          endIdx = i;
          break;
        }
      }
    }

    if (endIdx !== -1) {
      const block = i18nContent.slice(idx, endIdx);
      const entriesToAdd: string[] = [];

      for (const art of ARTICLES_CATALOG) {
        // Category
        const catName = art.category.en;
        const localizedCat = CATEGORY_TRANSLATIONS[catName]?.[lang] || (isAr ? art.category.ar : art.category.en);
        const catKey = `artCat_${art.slug}`;
        if (!block.includes(`"${catKey}":`) && !block.includes(`${catKey}:`)) {
          entriesToAdd.push(`      "${catKey}": ${JSON.stringify(localizedCat)},`);
        }

        // Badge
        const badgeKey = `artBadge_${art.slug}`;
        const localizedBadge = isAr ? art.badge.ar : art.badge.en;
        if (!block.includes(`"${badgeKey}":`) && !block.includes(`${badgeKey}:`)) {
          entriesToAdd.push(`      "${badgeKey}": ${JSON.stringify(localizedBadge)},`);
        }

        // Title
        const titleKey = `artTitle_${art.slug}`;
        const localizedTitle = isAr ? art.title.ar : art.title.en;
        if (!block.includes(`"${titleKey}":`) && !block.includes(`${titleKey}:`)) {
          entriesToAdd.push(`      "${titleKey}": ${JSON.stringify(localizedTitle)},`);
        }

        // Lead
        const leadKey = `artLead_${art.slug}`;
        const localizedLead = isAr ? art.lead.ar : art.lead.en;
        if (!block.includes(`"${leadKey}":`) && !block.includes(`${leadKey}:`)) {
          entriesToAdd.push(`      "${leadKey}": ${JSON.stringify(localizedLead)},`);
        }

        // Takeaways
        const takeawaysList = isAr ? art.takeaways.ar : art.takeaways.en;
        takeawaysList.forEach((t, i) => {
          const tKey = `artTakeaway_${art.slug}_${i}`;
          if (!block.includes(`"${tKey}":`) && !block.includes(`${tKey}:`)) {
            entriesToAdd.push(`      "${tKey}": ${JSON.stringify(t)},`);
          }
        });
      }

      if (entriesToAdd.length > 0) {
        const toAddStr = entriesToAdd.join('\n') + '\n';
        i18nContent = i18nContent.slice(0, endIdx) + toAddStr + '    ' + i18nContent.slice(endIdx);
      }
    }
  }
}

fs.writeFileSync('shared/i18n.js', i18nContent, 'utf8');
fs.writeFileSync('public/shared/i18n.js', i18nContent, 'utf8');
console.log('✓ Successfully merged all 22 article translation keys into shared/i18n.js and public/shared/i18n.js');
