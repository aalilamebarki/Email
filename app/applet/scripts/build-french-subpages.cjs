const fs = require('fs');
const path = require('path');

console.log('--- Generating Complete Native French Subpages ---');

// Helper to write to both fr/ and public/fr/
function writeFr(relPath, content) {
  const p1 = path.join(__dirname, '..', 'fr', relPath);
  const p2 = path.join(__dirname, '..', 'public', 'fr', relPath);
  fs.mkdirSync(path.dirname(p1), { recursive: true });
  fs.mkdirSync(path.dirname(p2), { recursive: true });
  fs.writeFileSync(p1, content, 'utf8');
  fs.writeFileSync(p2, content, 'utf8');
  console.log(`✓ Generated fr/${relPath} & public/fr/${relPath}`);
}

// 1. GUIDE.HTML (FR)
const frGuide = `<!doctype html>
<html lang="fr" dir="ltr">
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
    <title>Guide d'utilisation de l'e-mail temporaire — Tout ce qu'il faut savoir | FreeTemp.email</title>
    <meta
      name="description"
      content="Guide complet de l'e-mail jetable : résumé TL;DR, fonctionnement en 3 étapes simples, cas d'usage réels et normes de sécurité pour protéger votre boîte de réception contre le spam."
    />
    <link rel="canonical" href="https://freetemp.email/fr/guide.html" />
    <meta name="robots" content="index, follow" />
    
    <!-- Multilingual SEO & Hreflang -->
    <link rel="alternate" hreflang="ar" href="https://freetemp.email/ar/guide.html" />
    <link rel="alternate" hreflang="en" href="https://freetemp.email/en/guide.html" />
    <link rel="alternate" hreflang="fr" href="https://freetemp.email/fr/guide.html" />
    <link rel="alternate" hreflang="x-default" href="https://freetemp.email/en/guide.html" />

    <!-- Open Graph Tags -->
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="FreeTemp.email" />
    <meta property="og:title" content="Guide d'utilisation de l'e-mail temporaire — Tout ce qu'il faut savoir" />
    <meta property="og:description" content="Guide complet de l'e-mail jetable : fonctionnement en 3 étapes simples, cas d'usage et normes de sécurité." />
    <meta property="og:image" content="https://freetemp.email/og-image.svg" />
    <meta property="og:url" content="https://freetemp.email/fr/guide.html" />
    <meta name="twitter:card" content="summary_large_image" />

    <!-- Favicons -->
    <link rel="icon" type="image/svg+xml" href="/logo.svg" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    
    <!-- Stylesheets -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            colors: {
              brand: {
                DEFAULT: '#000000',
                dark: '#FFFFFF',
              }
            }
          }
        }
      }
    </script>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body class="bg-[#FAFAFA] dark:bg-[#0A0A0A] text-neutral-900 dark:text-neutral-100 font-sans antialiased min-h-screen flex flex-col selection:bg-neutral-200 dark:selection:bg-neutral-800 transition-colors">
    
    <!-- Header -->
    <header class="border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-[#0D0D0D]/95 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div class="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div class="flex items-center gap-6">
          <a href="/fr/" dir="ltr" class="flex items-center gap-2.5 transition-opacity hover:opacity-90">
            <img src="/logo.svg" alt="freetemp.email" class="w-8 h-8 rounded-lg shadow-sm shrink-0" width="32" height="32" />
            <span class="flex items-baseline font-sans tracking-tight">
              <span class="text-xl font-extrabold text-black dark:text-white">freetemp</span>
              <span class="text-sm font-semibold text-neutral-500 dark:text-neutral-400">.email</span>
            </span>
          </a>
          <nav class="hidden md:flex items-center gap-4 text-xs font-medium">
            <a href="/fr/" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Accueil</a>
            <a href="/fr/blog.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Blog</a>
            <a href="/fr/guide.html" class="text-black dark:text-white font-bold transition-colors">Guide</a>
            <a href="/fr/faq.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">FAQ</a>
          </nav>
        </div>
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Language Selector Button -->
          <button
            type="button"
            id="open-lang-picker"
            class="open-lang-picker min-h-[38px] px-3 py-1.5 bg-white hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 hover:border-black dark:border-neutral-800 dark:hover:border-neutral-600 rounded-lg text-xs font-semibold text-black dark:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            aria-label="Changer de langue"
          >
            <svg class="w-3.5 h-3.5 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            <span id="current-lang-label">Français</span>
            <svg class="w-3 h-3 stroke-current fill-none stroke-[2] opacity-60" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <!-- Theme Toggle -->
          <button
            type="button"
            id="theme-toggle-btn"
            class="theme-toggle-btn min-h-[38px] min-w-[38px] p-2 bg-white hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 hover:border-black dark:border-neutral-800 dark:hover:border-neutral-600 rounded-lg text-black dark:text-white transition-all flex items-center justify-center cursor-pointer active:scale-95"
            aria-label="Basculer le thème"
          >
            <svg class="theme-toggle-icon w-4 h-4 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 max-w-4xl mx-auto px-4 py-8 sm:py-12 w-full">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-6 font-mono" aria-label="Fil d'Ariane">
        <a href="/fr/" class="hover:text-black dark:hover:text-white transition-colors">Accueil</a>
        <span>/</span>
        <span class="text-black dark:text-white font-medium">Guide d'utilisation</span>
      </nav>

      <!-- Hero Header -->
      <div class="mb-10">
        <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight text-black dark:text-white mb-4 leading-tight">
          Guide d'utilisation de l'e-mail temporaire — Tout ce qu'il faut savoir
        </h1>
        <p class="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-3xl">
          Apprenez à utiliser FreeTemp.email pour sécuriser votre boîte principale, recevoir des codes OTP et éviter les traceurs publicitaires sans aucune inscription.
        </p>
      </div>

      <!-- TL;DR Summary Box -->
      <div class="bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 sm:p-6 mb-10 shadow-sm">
        <div class="flex items-center gap-2.5 mb-3">
          <span class="px-2 py-0.5 rounded bg-black dark:bg-white text-white dark:text-black text-[11px] font-mono font-bold uppercase">TL;DR</span>
          <h2 class="text-sm sm:text-base font-bold text-black dark:text-white">Résumé rapide en 30 secondes</h2>
        </div>
        <ul class="space-y-2 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
          <li class="flex items-start gap-2">
            <span class="text-emerald-500 font-bold shrink-0">✓</span>
            <span><strong>Génération automatique et instantanée :</strong> Votre adresse e-mail jetable est prête dès l'ouverture du site.</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-emerald-500 font-bold shrink-0">✓</span>
            <span><strong>Extraction intelligente des codes OTP :</strong> Les codes de vérification sont mis en avant pour une copie en 1 clic.</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-emerald-500 font-bold shrink-0">✓</span>
            <span><strong>Autodestruction garantie :</strong> Les messages et l'adresse sont supprimés définitivement après 20 minutes (zéro log).</span>
          </li>
        </ul>
      </div>

      <!-- Step-by-Step Guide -->
      <section class="mb-12">
        <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-black dark:text-white mb-6 flex items-center gap-2.5">
          <span class="w-6 h-6 rounded bg-black dark:bg-white text-white dark:text-black text-xs font-mono font-bold flex items-center justify-center shrink-0">1</span>
          Comment utiliser FreeTemp en 3 étapes simples
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Step 1 -->
          <div class="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm flex flex-col">
            <div class="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white flex items-center justify-center font-mono font-bold text-sm mb-4">
              01
            </div>
            <h3 class="font-bold text-base text-black dark:text-white mb-2">Copiez votre adresse</h3>
            <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed flex-1">
              Cliquez sur le bouton « Copier » sur la page d'accueil pour placer l'adresse temporaire dans votre presse-papiers.
            </p>
          </div>

          <!-- Step 2 -->
          <div class="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm flex flex-col">
            <div class="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white flex items-center justify-center font-mono font-bold text-sm mb-4">
              02
            </div>
            <h3 class="font-bold text-base text-black dark:text-white mb-2">Inscrivez-vous sur le service</h3>
            <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed flex-1">
              Collez l'adresse dans le formulaire du site ou de l'application nécessitant une confirmation par e-mail.
            </p>
          </div>

          <!-- Step 3 -->
          <div class="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm flex flex-col">
            <div class="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white flex items-center justify-center font-mono font-bold text-sm mb-4">
              03
            </div>
            <h3 class="font-bold text-base text-black dark:text-white mb-2">Recevez et confirmez</h3>
            <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed flex-1">
              L'e-mail apparaît en direct dans votre boîte de réception. Copiez le code OTP ou ouvrez le lien d'activation instantanément.
            </p>
          </div>
        </div>
      </section>

      <!-- Best Use Cases -->
      <section class="mb-12">
        <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-black dark:text-white mb-6 flex items-center gap-2.5">
          <span class="w-6 h-6 rounded bg-black dark:bg-white text-white dark:text-black text-xs font-mono font-bold flex items-center justify-center shrink-0">2</span>
          Principaux cas d'usage recommandés
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="p-5 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900">
            <h3 class="font-bold text-sm sm:text-base text-black dark:text-white mb-2">🛡️ Éviter le spam marketing</h3>
            <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Téléchargez des livres blancs, des ebooks ou accédez à des contenus fermés sans subir de newsletters intrusives par la suite.
            </p>
          </div>

          <div class="p-5 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900">
            <h3 class="font-bold text-sm sm:text-base text-black dark:text-white mb-2">🧪 Tests pour développeurs & QA</h3>
            <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Testez les flux d'inscription, les liens magiques et les modèles d'e-mails transactionnels sur plusieurs boîtes isolées.
            </p>
          </div>

          <div class="p-5 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900">
            <h3 class="font-bold text-sm sm:text-base text-black dark:text-white mb-2">📶 Connexion aux réseaux Wi-Fi publics</h3>
            <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Accédez aux portails captifs d'aéroports, d'hôtels et de cafés sans dévoiler votre identité ni vos coordonnées réelles.
            </p>
          </div>

          <div class="p-5 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900">
            <h3 class="font-bold text-sm sm:text-base text-black dark:text-white mb-2">🎯 Essais gratuits de logiciels</h3>
            <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Testez de nouveaux outils SaaS et applications en toute liberté sans lier votre compte de messagerie principal.
            </p>
          </div>
        </div>
      </section>

      <!-- CTA Box -->
      <div class="bg-black dark:bg-white text-white dark:text-black rounded-2xl p-6 sm:p-8 text-center my-10 shadow-lg">
        <h2 class="text-xl sm:text-2xl font-extrabold mb-3 tracking-tight">Prêt à sécuriser votre boîte de réception ?</h2>
        <p class="text-xs sm:text-sm text-neutral-300 dark:text-neutral-700 max-w-xl mx-auto mb-6 leading-relaxed">
          Générez une adresse e-mail jetable dès maintenant en un clic. Aucune inscription, 100% gratuit et totalement anonyme.
        </p>
        <a
          href="/fr/"
          class="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white dark:bg-black text-black dark:text-white text-sm font-bold shadow hover:opacity-90 active:scale-95 transition-all"
        >
          Créer un e-mail temporaire ➔
        </a>
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0A0A0A] py-12 transition-colors mt-auto text-xs">
      <div class="max-w-4xl mx-auto px-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10 text-left">
          <!-- Column 1 -->
          <div>
            <a href="/fr/" dir="ltr" class="inline-flex items-center gap-2.5 transition-opacity hover:opacity-90 mb-3">
              <img src="/logo.svg" alt="freetemp.email" class="w-7 h-7 rounded-lg shadow-sm shrink-0" width="28" height="28" />
              <span class="flex items-baseline font-sans tracking-tight">
                <span class="text-lg font-extrabold text-black dark:text-white">freetemp</span>
                <span class="text-xs font-semibold text-neutral-500 dark:text-neutral-400">.email</span>
              </span>
            </a>
            <p class="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-3">
              Service d'e-mail temporaire gratuit et sécurisé pour protéger votre vie privée contre le spam et les traceurs sans aucune inscription.
            </p>
            <div class="inline-flex items-center gap-2 font-mono text-[11px] text-black dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 rounded-md px-2 py-1 bg-neutral-50 dark:bg-neutral-900">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Tous les nœuds Edge opérationnels</span>
            </div>
          </div>

          <!-- Column 2 -->
          <div>
            <div class="font-bold text-black dark:text-white mb-3 uppercase tracking-wider text-[11px]">Navigation rapide</div>
            <ul class="space-y-2">
              <li><a href="/fr/" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Accueil</a></li>
              <li><a href="/fr/blog.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors font-semibold">Blog</a></li>
              <li><a href="/fr/guide.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Guide d'utilisation</a></li>
              <li><a href="/fr/faq.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          <!-- Column 3 -->
          <div>
            <div class="font-bold text-black dark:text-white mb-3 uppercase tracking-wider text-[11px]">Transparence & Conformité</div>
            <ul class="space-y-2">
              <li><a href="/fr/about.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">À propos</a></li>
              <li><a href="/fr/privacy.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Politique de confidentialité</a></li>
              <li><a href="/fr/privacy.html#terms" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Conditions d'utilisation</a></li>
            </ul>
          </div>

          <!-- Column 4 -->
          <div>
            <div class="font-bold text-black dark:text-white mb-3 uppercase tracking-wider text-[11px]">Sécurité & Chiffrement</div>
            <ul class="space-y-2 text-neutral-600 dark:text-neutral-400">
              <li class="flex items-center gap-2">
                <svg class="w-3.5 h-3.5 stroke-current fill-none stroke-[2] text-black dark:text-white shrink-0" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Autodestruction après 20 min</span>
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-3.5 h-3.5 stroke-current fill-none stroke-[2] text-black dark:text-white shrink-0" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Isolation mémoire chiffrée O(1)</span>
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-3.5 h-3.5 stroke-current fill-none stroke-[2] text-black dark:text-white shrink-0" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Zéro log & sans cookies tiers</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="border-t border-neutral-200 dark:border-neutral-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400">
          <div>© 2026 FreeTemp.email — E-mail temporaire gratuit. Tous droits réservés.</div>
          <div class="flex items-center gap-4">
            <span>Chiffrement TLS 1.3 256-Bit</span>
            <span>•</span>
            <span>Cloudflare Edge Ultra-Rapide</span>
            <span>•</span>
            <span>Strictement sans journaux (Zero-Logs)</span>
          </div>
        </div>
      </div>
    </footer>

    <!-- Shared App Scripts -->
    <script src="/app.js"></script>
  </body>
</html>`;

writeFr('guide.html', frGuide);

// 2. FAQ.HTML (FR)
const frFaq = `<!doctype html>
<html lang="fr" dir="ltr">
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
    <title>Foire Aux Questions (FAQ) — E-mail Temporaire | FreeTemp.email</title>
    <meta
      name="description"
      content="Toutes les réponses à vos questions sur l'e-mail jetable : durée de validité, sécurité, réception des codes OTP, confidentialité et conformité RGPD."
    />
    <link rel="canonical" href="https://freetemp.email/fr/faq.html" />
    <meta name="robots" content="index, follow" />
    
    <!-- Multilingual SEO & Hreflang -->
    <link rel="alternate" hreflang="ar" href="https://freetemp.email/ar/faq.html" />
    <link rel="alternate" hreflang="en" href="https://freetemp.email/en/faq.html" />
    <link rel="alternate" hreflang="fr" href="https://freetemp.email/fr/faq.html" />
    <link rel="alternate" hreflang="x-default" href="https://freetemp.email/en/faq.html" />

    <!-- Open Graph Tags -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="FreeTemp.email" />
    <meta property="og:title" content="Foire Aux Questions (FAQ) — E-mail Temporaire | FreeTemp.email" />
    <meta property="og:description" content="Réponses claires sur la sécurité, la durée de vie et la réception des OTP sur FreeTemp.email." />
    <meta property="og:image" content="https://freetemp.email/og-image.svg" />
    <meta property="og:url" content="https://freetemp.email/fr/faq.html" />
    <meta name="twitter:card" content="summary_large_image" />

    <!-- Favicons -->
    <link rel="icon" type="image/svg+xml" href="/logo.svg" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    
    <!-- Stylesheets -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            colors: {
              brand: {
                DEFAULT: '#000000',
                dark: '#FFFFFF',
              }
            }
          }
        }
      }
    </script>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body class="bg-[#FAFAFA] dark:bg-[#0A0A0A] text-neutral-900 dark:text-neutral-100 font-sans antialiased min-h-screen flex flex-col selection:bg-neutral-200 dark:selection:bg-neutral-800 transition-colors">
    
    <!-- Header -->
    <header class="border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-[#0D0D0D]/95 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div class="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div class="flex items-center gap-6">
          <a href="/fr/" dir="ltr" class="flex items-center gap-2.5 transition-opacity hover:opacity-90">
            <img src="/logo.svg" alt="freetemp.email" class="w-8 h-8 rounded-lg shadow-sm shrink-0" width="32" height="32" />
            <span class="flex items-baseline font-sans tracking-tight">
              <span class="text-xl font-extrabold text-black dark:text-white">freetemp</span>
              <span class="text-sm font-semibold text-neutral-500 dark:text-neutral-400">.email</span>
            </span>
          </a>
          <nav class="hidden md:flex items-center gap-4 text-xs font-medium">
            <a href="/fr/" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Accueil</a>
            <a href="/fr/blog.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Blog</a>
            <a href="/fr/guide.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Guide</a>
            <a href="/fr/faq.html" class="text-black dark:text-white font-bold transition-colors">FAQ</a>
          </nav>
        </div>
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Language Selector Button -->
          <button
            type="button"
            id="open-lang-picker"
            class="open-lang-picker min-h-[38px] px-3 py-1.5 bg-white hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 hover:border-black dark:border-neutral-800 dark:hover:border-neutral-600 rounded-lg text-xs font-semibold text-black dark:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            aria-label="Changer de langue"
          >
            <svg class="w-3.5 h-3.5 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            <span id="current-lang-label">Français</span>
            <svg class="w-3 h-3 stroke-current fill-none stroke-[2] opacity-60" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <!-- Theme Toggle -->
          <button
            type="button"
            id="theme-toggle-btn"
            class="theme-toggle-btn min-h-[38px] min-w-[38px] p-2 bg-white hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 hover:border-black dark:border-neutral-800 dark:hover:border-neutral-600 rounded-lg text-black dark:text-white transition-all flex items-center justify-center cursor-pointer active:scale-95"
            aria-label="Basculer le thème"
          >
            <svg class="theme-toggle-icon w-4 h-4 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 max-w-3xl mx-auto px-4 py-8 sm:py-12 w-full">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-6 font-mono" aria-label="Fil d'Ariane">
        <a href="/fr/" class="hover:text-black dark:hover:text-white transition-colors">Accueil</a>
        <span>/</span>
        <span class="text-black dark:text-white font-medium">Foire Aux Questions</span>
      </nav>

      <!-- Hero Header -->
      <div class="mb-10 text-center">
        <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight text-black dark:text-white mb-4 leading-tight">
          Foire Aux Questions (FAQ)
        </h1>
        <p class="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-xl mx-auto">
          Retrouvez des réponses détaillées à vos interrogations sur le fonctionnement, la confidentialité et la sécurité de FreeTemp.email.
        </p>
      </div>

      <!-- FAQ Accordion / List -->
      <div class="space-y-4 mb-12">
        <!-- Q1 -->
        <div class="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 sm:p-6 shadow-sm">
          <h2 class="text-base sm:text-lg font-bold text-black dark:text-white mb-2 flex items-center gap-2">
            <span class="text-emerald-500 font-mono">Q.</span> Qu'est-ce qu'un e-mail temporaire (jetable) ?
          </h2>
          <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Un e-mail temporaire est une boîte de réception éphémère créée automatiquement sans inscription. Elle vous permet de recevoir des messages et des codes de vérification sans jamais exposer votre adresse personnelle aux spammeurs ou aux courriels indésirables.
          </p>
        </div>

        <!-- Q2 -->
        <div class="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 sm:p-6 shadow-sm">
          <h2 class="text-base sm:text-lg font-bold text-black dark:text-white mb-2 flex items-center gap-2">
            <span class="text-emerald-500 font-mono">Q.</span> Combien de temps mon adresse et mes e-mails restent-ils actifs ?
          </h2>
          <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Chaque adresse est active pendant 20 minutes par défaut. À la fin du compte à rebours, l'ensemble des messages et données associées sont détruits définitivement et purgés de la mémoire RAM des serveurs. Vous pouvez prolonger la session si nécessaire.
          </p>
        </div>

        <!-- Q3 -->
        <div class="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 sm:p-6 shadow-sm">
          <h2 class="text-base sm:text-lg font-bold text-black dark:text-white mb-2 flex items-center gap-2">
            <span class="text-emerald-500 font-mono">Q.</span> Le service est-il entièrement gratuit ?
          </h2>
          <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Oui, FreeTemp.email est 100% gratuit, sans frais cachés, sans abonnement et sans limite arbitraire sur le nombre de messages reçus.
          </p>
        </div>

        <!-- Q4 -->
        <div class="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 sm:p-6 shadow-sm">
          <h2 class="text-base sm:text-lg font-bold text-black dark:text-white mb-2 flex items-center gap-2">
            <span class="text-emerald-500 font-mono">Q.</span> Puis-je envoyer des e-mails depuis cette boîte ?
          </h2>
          <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Non. Pour prévenir tout abus, spam ou tentative de phishing, le service fonctionne exclusivement en mode réception. Vous ne pouvez pas émettre de messages.
          </p>
        </div>

        <!-- Q5 -->
        <div class="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 sm:p-6 shadow-sm">
          <h2 class="text-base sm:text-lg font-bold text-black dark:text-white mb-2 flex items-center gap-2">
            <span class="text-emerald-500 font-mono">Q.</span> Comment fonctionne l'extraction des codes OTP ?
          </h2>
          <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Notre moteur d'analyse examine le contenu du message reçu pour détecter automatiquement les codes à 4, 6 ou 8 chiffres et les liens magiques, vous permettant de les copier d'un simple clic sans chercher dans le corps du texte.
          </p>
        </div>

        <!-- Q6 -->
        <div class="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 sm:p-6 shadow-sm">
          <h2 class="text-base sm:text-lg font-bold text-black dark:text-white mb-2 flex items-center gap-2">
            <span class="text-emerald-500 font-mono">Q.</span> Conservez-vous des logs ou des données personnelles ?
          </h2>
          <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Non. Nous appliquons une politique stricte de zéro journalisation (Zero-Logs). Aucune adresse IP, en-tête d'e-mail ou métadonnée n'est stockée sur disque dur ni transmise à des tiers.
          </p>
        </div>
      </div>

      <!-- Quick Action Box -->
      <div class="bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 text-center">
        <h3 class="text-base font-bold text-black dark:text-white mb-2">Une autre question ?</h3>
        <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-4">
          Consultez notre guide d'utilisation ou commencez directement à utiliser votre boîte temporaire.
        </p>
        <div class="flex items-center justify-center gap-3">
          <a href="/fr/guide.html" class="px-4 py-2 text-xs font-semibold rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-black dark:hover:border-white transition-colors">
            Lire le guide
          </a>
          <a href="/fr/" class="px-4 py-2 text-xs font-semibold rounded-lg bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity">
            Aller à la boîte ➔
          </a>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0A0A0A] py-12 transition-colors mt-auto text-xs">
      <div class="max-w-4xl mx-auto px-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10 text-left">
          <div>
            <a href="/fr/" dir="ltr" class="inline-flex items-center gap-2.5 transition-opacity hover:opacity-90 mb-3">
              <img src="/logo.svg" alt="freetemp.email" class="w-7 h-7 rounded-lg shadow-sm shrink-0" width="28" height="28" />
              <span class="flex items-baseline font-sans tracking-tight">
                <span class="text-lg font-extrabold text-black dark:text-white">freetemp</span>
                <span class="text-xs font-semibold text-neutral-500 dark:text-neutral-400">.email</span>
              </span>
            </a>
            <p class="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-3">
              Service d'e-mail temporaire gratuit et sécurisé pour protéger votre vie privée contre le spam et les traceurs sans aucune inscription.
            </p>
            <div class="inline-flex items-center gap-2 font-mono text-[11px] text-black dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 rounded-md px-2 py-1 bg-neutral-50 dark:bg-neutral-900">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Tous les nœuds Edge opérationnels</span>
            </div>
          </div>
          <div>
            <div class="font-bold text-black dark:text-white mb-3 uppercase tracking-wider text-[11px]">Navigation rapide</div>
            <ul class="space-y-2">
              <li><a href="/fr/" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Accueil</a></li>
              <li><a href="/fr/blog.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors font-semibold">Blog</a></li>
              <li><a href="/fr/guide.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Guide d'utilisation</a></li>
              <li><a href="/fr/faq.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <div class="font-bold text-black dark:text-white mb-3 uppercase tracking-wider text-[11px]">Transparence & Conformité</div>
            <ul class="space-y-2">
              <li><a href="/fr/about.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">À propos</a></li>
              <li><a href="/fr/privacy.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Politique de confidentialité</a></li>
              <li><a href="/fr/privacy.html#terms" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Conditions d'utilisation</a></li>
            </ul>
          </div>
          <div>
            <div class="font-bold text-black dark:text-white mb-3 uppercase tracking-wider text-[11px]">Sécurité & Chiffrement</div>
            <ul class="space-y-2 text-neutral-600 dark:text-neutral-400">
              <li class="flex items-center gap-2">
                <svg class="w-3.5 h-3.5 stroke-current fill-none stroke-[2] text-black dark:text-white shrink-0" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Autodestruction après 20 min</span>
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-3.5 h-3.5 stroke-current fill-none stroke-[2] text-black dark:text-white shrink-0" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Isolation mémoire chiffrée O(1)</span>
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-3.5 h-3.5 stroke-current fill-none stroke-[2] text-black dark:text-white shrink-0" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Zéro log & sans cookies tiers</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="border-t border-neutral-200 dark:border-neutral-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400">
          <div>© 2026 FreeTemp.email — E-mail temporaire gratuit. Tous droits réservés.</div>
          <div class="flex items-center gap-4">
            <span>Chiffrement TLS 1.3 256-Bit</span>
            <span>•</span>
            <span>Cloudflare Edge Ultra-Rapide</span>
            <span>•</span>
            <span>Strictement sans journaux (Zero-Logs)</span>
          </div>
        </div>
      </div>
    </footer>
    <script src="/app.js"></script>
  </body>
</html>`;

writeFr('faq.html', frFaq);

// 3. ABOUT.HTML (FR)
const frAbout = `<!doctype html>
<html lang="fr" dir="ltr">
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
    <title>À propos de nous — Protection de la vie privée & Anti-Spam | FreeTemp.email</title>
    <meta
      name="description"
      content="Découvrez la mission de FreeTemp.email : fournir une infrastructure d'e-mails temporaires ultra-rapide, sécurisée et respectueuse de la vie privée pour protéger les utilisateurs du spam."
    />
    <link rel="canonical" href="https://freetemp.email/fr/about.html" />
    <meta name="robots" content="index, follow" />
    
    <!-- Multilingual SEO & Hreflang -->
    <link rel="alternate" hreflang="ar" href="https://freetemp.email/ar/about.html" />
    <link rel="alternate" hreflang="en" href="https://freetemp.email/en/about.html" />
    <link rel="alternate" hreflang="fr" href="https://freetemp.email/fr/about.html" />
    <link rel="alternate" hreflang="x-default" href="https://freetemp.email/en/about.html" />

    <!-- Open Graph Tags -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="FreeTemp.email" />
    <meta property="og:title" content="À propos de nous — Protection de la vie privée | FreeTemp.email" />
    <meta property="og:description" content="Découvrez notre engagement pour un web plus privé, sécurisé et débarrassé du spam." />
    <meta property="og:image" content="https://freetemp.email/og-image.svg" />
    <meta property="og:url" content="https://freetemp.email/fr/about.html" />
    <meta name="twitter:card" content="summary_large_image" />

    <!-- Favicons -->
    <link rel="icon" type="image/svg+xml" href="/logo.svg" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    
    <!-- Stylesheets -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            colors: {
              brand: {
                DEFAULT: '#000000',
                dark: '#FFFFFF',
              }
            }
          }
        }
      }
    </script>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body class="bg-[#FAFAFA] dark:bg-[#0A0A0A] text-neutral-900 dark:text-neutral-100 font-sans antialiased min-h-screen flex flex-col selection:bg-neutral-200 dark:selection:bg-neutral-800 transition-colors">
    
    <!-- Header -->
    <header class="border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-[#0D0D0D]/95 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div class="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div class="flex items-center gap-6">
          <a href="/fr/" dir="ltr" class="flex items-center gap-2.5 transition-opacity hover:opacity-90">
            <img src="/logo.svg" alt="freetemp.email" class="w-8 h-8 rounded-lg shadow-sm shrink-0" width="32" height="32" />
            <span class="flex items-baseline font-sans tracking-tight">
              <span class="text-xl font-extrabold text-black dark:text-white">freetemp</span>
              <span class="text-sm font-semibold text-neutral-500 dark:text-neutral-400">.email</span>
            </span>
          </a>
          <nav class="hidden md:flex items-center gap-4 text-xs font-medium">
            <a href="/fr/" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Accueil</a>
            <a href="/fr/blog.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Blog</a>
            <a href="/fr/guide.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Guide</a>
            <a href="/fr/faq.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">FAQ</a>
          </nav>
        </div>
        <div class="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            id="open-lang-picker"
            class="open-lang-picker min-h-[38px] px-3 py-1.5 bg-white hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 hover:border-black dark:border-neutral-800 dark:hover:border-neutral-600 rounded-lg text-xs font-semibold text-black dark:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            aria-label="Changer de langue"
          >
            <svg class="w-3.5 h-3.5 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            <span id="current-lang-label">Français</span>
            <svg class="w-3 h-3 stroke-current fill-none stroke-[2] opacity-60" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <button
            type="button"
            id="theme-toggle-btn"
            class="theme-toggle-btn min-h-[38px] min-w-[38px] p-2 bg-white hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 hover:border-black dark:border-neutral-800 dark:hover:border-neutral-600 rounded-lg text-black dark:text-white transition-all flex items-center justify-center cursor-pointer active:scale-95"
            aria-label="Basculer le thème"
          >
            <svg class="theme-toggle-icon w-4 h-4 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 max-w-3xl mx-auto px-4 py-8 sm:py-12 w-full">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-6 font-mono" aria-label="Fil d'Ariane">
        <a href="/fr/" class="hover:text-black dark:hover:text-white transition-colors">Accueil</a>
        <span>/</span>
        <span class="text-black dark:text-white font-medium">À propos</span>
      </nav>

      <div class="mb-10">
        <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight text-black dark:text-white mb-4 leading-tight">
          À propos de FreeTemp.email
        </h1>
        <p class="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
          Une infrastructure moderne conçue pour redonner le contrôle de leur vie privée et de leur boîte de réception aux utilisateurs du monde entier.
        </p>
      </div>

      <div class="space-y-8 text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
        <section class="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 class="text-lg sm:text-xl font-bold text-black dark:text-white mb-3">Notre Mission</h2>
          <p class="mb-4">
            À l'ère où chaque formulaire d'inscription en ligne exige une adresse e-mail pour ensuite l'inonder de publicités ciblées ou revendre vos données à des courtiers, <strong>FreeTemp.email</strong> a été créé avec un principe fondamental : la protection proactive et sans compromis de la vie privée.
          </p>
          <p>
            Nous offrons une solution élégante, instantanée et gratuite pour séparer vos communications privées légitimes des inscriptions éphémères du quotidien.
          </p>
        </section>

        <section class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
            <h3 class="font-bold text-black dark:text-white mb-2 text-base">⚡ Rapidité & Performance</h3>
            <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              Déployé sur le réseau mondial Cloudflare Edge pour assurer une réception des messages et une extraction des codes OTP en temps réel.
            </p>
          </div>
          <div class="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
            <h3 class="font-bold text-black dark:text-white mb-2 text-base">🔒 Confidentialité par conception</h3>
            <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              Architecture en mémoire RAM avec suppression irréversible après 20 minutes et politique stricte sans journaux (Zero-Logs).
            </p>
          </div>
        </section>
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0A0A0A] py-12 transition-colors mt-auto text-xs">
      <div class="max-w-4xl mx-auto px-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10 text-left">
          <div>
            <a href="/fr/" dir="ltr" class="inline-flex items-center gap-2.5 transition-opacity hover:opacity-90 mb-3">
              <img src="/logo.svg" alt="freetemp.email" class="w-7 h-7 rounded-lg shadow-sm shrink-0" width="28" height="28" />
              <span class="flex items-baseline font-sans tracking-tight">
                <span class="text-lg font-extrabold text-black dark:text-white">freetemp</span>
                <span class="text-xs font-semibold text-neutral-500 dark:text-neutral-400">.email</span>
              </span>
            </a>
            <p class="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-3">
              Service d'e-mail temporaire gratuit et sécurisé pour protéger votre vie privée contre le spam et les traceurs sans aucune inscription.
            </p>
            <div class="inline-flex items-center gap-2 font-mono text-[11px] text-black dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 rounded-md px-2 py-1 bg-neutral-50 dark:bg-neutral-900">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Tous les nœuds Edge opérationnels</span>
            </div>
          </div>
          <div>
            <div class="font-bold text-black dark:text-white mb-3 uppercase tracking-wider text-[11px]">Navigation rapide</div>
            <ul class="space-y-2">
              <li><a href="/fr/" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Accueil</a></li>
              <li><a href="/fr/blog.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors font-semibold">Blog</a></li>
              <li><a href="/fr/guide.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Guide d'utilisation</a></li>
              <li><a href="/fr/faq.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <div class="font-bold text-black dark:text-white mb-3 uppercase tracking-wider text-[11px]">Transparence & Conformité</div>
            <ul class="space-y-2">
              <li><a href="/fr/about.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">À propos</a></li>
              <li><a href="/fr/privacy.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Politique de confidentialité</a></li>
              <li><a href="/fr/privacy.html#terms" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Conditions d'utilisation</a></li>
            </ul>
          </div>
          <div>
            <div class="font-bold text-black dark:text-white mb-3 uppercase tracking-wider text-[11px]">Sécurité & Chiffrement</div>
            <ul class="space-y-2 text-neutral-600 dark:text-neutral-400">
              <li class="flex items-center gap-2">
                <svg class="w-3.5 h-3.5 stroke-current fill-none stroke-[2] text-black dark:text-white shrink-0" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Autodestruction après 20 min</span>
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-3.5 h-3.5 stroke-current fill-none stroke-[2] text-black dark:text-white shrink-0" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Isolation mémoire chiffrée O(1)</span>
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-3.5 h-3.5 stroke-current fill-none stroke-[2] text-black dark:text-white shrink-0" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Zéro log & sans cookies tiers</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="border-t border-neutral-200 dark:border-neutral-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400">
          <div>© 2026 FreeTemp.email — E-mail temporaire gratuit. Tous droits réservés.</div>
          <div class="flex items-center gap-4">
            <span>Chiffrement TLS 1.3 256-Bit</span>
            <span>•</span>
            <span>Cloudflare Edge Ultra-Rapide</span>
            <span>•</span>
            <span>Strictement sans journaux (Zero-Logs)</span>
          </div>
        </div>
      </div>
    </footer>
    <script src="/app.js"></script>
  </body>
</html>`;

writeFr('about.html', frAbout);

// 4. PRIVACY.HTML (FR)
const frPrivacy = `<!doctype html>
<html lang="fr" dir="ltr">
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
    <title>Politique de Confidentialité & Conditions — FreeTemp.email</title>
    <meta
      name="description"
      content="Politique de confidentialité et conditions d'utilisation de FreeTemp.email : politique stricte sans journaux, autodestruction des données et conformité RGPD."
    />
    <link rel="canonical" href="https://freetemp.email/fr/privacy.html" />
    <meta name="robots" content="index, follow" />
    
    <!-- Multilingual SEO & Hreflang -->
    <link rel="alternate" hreflang="ar" href="https://freetemp.email/ar/privacy.html" />
    <link rel="alternate" hreflang="en" href="https://freetemp.email/en/privacy.html" />
    <link rel="alternate" hreflang="fr" href="https://freetemp.email/fr/privacy.html" />
    <link rel="alternate" hreflang="x-default" href="https://freetemp.email/en/privacy.html" />

    <!-- Open Graph Tags -->
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="FreeTemp.email" />
    <meta property="og:title" content="Politique de Confidentialité & Conditions — FreeTemp.email" />
    <meta property="og:description" content="Découvrez nos engagements de confidentialité totale et d'autodestruction des données." />
    <meta property="og:image" content="https://freetemp.email/og-image.svg" />
    <meta property="og:url" content="https://freetemp.email/fr/privacy.html" />
    <meta name="twitter:card" content="summary_large_image" />

    <!-- Favicons -->
    <link rel="icon" type="image/svg+xml" href="/logo.svg" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    
    <!-- Stylesheets -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            colors: {
              brand: {
                DEFAULT: '#000000',
                dark: '#FFFFFF',
              }
            }
          }
        }
      }
    </script>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body class="bg-[#FAFAFA] dark:bg-[#0A0A0A] text-neutral-900 dark:text-neutral-100 font-sans antialiased min-h-screen flex flex-col selection:bg-neutral-200 dark:selection:bg-neutral-800 transition-colors">
    
    <!-- Header -->
    <header class="border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-[#0D0D0D]/95 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div class="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div class="flex items-center gap-6">
          <a href="/fr/" dir="ltr" class="flex items-center gap-2.5 transition-opacity hover:opacity-90">
            <img src="/logo.svg" alt="freetemp.email" class="w-8 h-8 rounded-lg shadow-sm shrink-0" width="32" height="32" />
            <span class="flex items-baseline font-sans tracking-tight">
              <span class="text-xl font-extrabold text-black dark:text-white">freetemp</span>
              <span class="text-sm font-semibold text-neutral-500 dark:text-neutral-400">.email</span>
            </span>
          </a>
          <nav class="hidden md:flex items-center gap-4 text-xs font-medium">
            <a href="/fr/" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Accueil</a>
            <a href="/fr/blog.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Blog</a>
            <a href="/fr/guide.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Guide</a>
            <a href="/fr/faq.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">FAQ</a>
          </nav>
        </div>
        <div class="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            id="open-lang-picker"
            class="open-lang-picker min-h-[38px] px-3 py-1.5 bg-white hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 hover:border-black dark:border-neutral-800 dark:hover:border-neutral-600 rounded-lg text-xs font-semibold text-black dark:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            aria-label="Changer de langue"
          >
            <svg class="w-3.5 h-3.5 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            <span id="current-lang-label">Français</span>
            <svg class="w-3 h-3 stroke-current fill-none stroke-[2] opacity-60" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <button
            type="button"
            id="theme-toggle-btn"
            class="theme-toggle-btn min-h-[38px] min-w-[38px] p-2 bg-white hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 hover:border-black dark:border-neutral-800 dark:hover:border-neutral-600 rounded-lg text-black dark:text-white transition-all flex items-center justify-center cursor-pointer active:scale-95"
            aria-label="Basculer le thème"
          >
            <svg class="theme-toggle-icon w-4 h-4 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 max-w-3xl mx-auto px-4 py-8 sm:py-12 w-full">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-6 font-mono" aria-label="Fil d'Ariane">
        <a href="/fr/" class="hover:text-black dark:hover:text-white transition-colors">Accueil</a>
        <span>/</span>
        <span class="text-black dark:text-white font-medium">Politique de confidentialité</span>
      </nav>

      <div class="mb-10">
        <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight text-black dark:text-white mb-4 leading-tight">
          Politique de Confidentialité & Conditions d'Utilisation
        </h1>
        <p class="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
          Dernière mise à jour : 2026. Transparence totale sur le traitement de vos données et le fonctionnement de notre service.
        </p>
      </div>

      <div class="space-y-8 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
        <!-- 1. Zero Logs -->
        <section class="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
          <h2 class="text-base sm:text-lg font-bold text-black dark:text-white mb-3 flex items-center gap-2">
            <span>🛡️ 1. Politique Zéro-Journaux (Zero-Logs Policy)</span>
          </h2>
          <p class="mb-3">
            FreeTemp.email ne collecte, n'enregistre et ne conserve <strong>aucune donnée personnelle</strong>. Nous n'exigeons ni nom, ni mot de passe, ni numéro de téléphone, ni adresse personnelle pour utiliser la plateforme.
          </p>
          <p>
            Les adresses IP de connexion ne sont jamais associées aux boîtes de réception créées, et aucun profil utilisateur n'est généré.
          </p>
        </section>

        <!-- 2. Auto Destruction -->
        <section class="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
          <h2 class="text-base sm:text-lg font-bold text-black dark:text-white mb-3 flex items-center gap-2">
            <span>⏳ 2. Autodestruction & Rétention des Données</span>
          </h2>
          <p class="mb-3">
            Tous les e-mails reçus ainsi que les adresses temporaires sont conservés exclusivement en mémoire vive (RAM) et sont <strong>détruits de façon permanente après 20 minutes</strong>.
          </p>
          <p>
            Une fois détruites, les données sont mathématiquement et physiquement irrécupérables par quiconque, y compris par nos administrateurs.
          </p>
        </section>

        <!-- 3. Terms of service -->
        <section id="terms" class="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
          <h2 class="text-base sm:text-lg font-bold text-black dark:text-white mb-3 flex items-center gap-2">
            <span>⚖️ 3. Conditions d'Utilisation Acceptable</span>
          </h2>
          <p class="mb-3">
            Le service est mis à disposition gratuitement pour la protection de la vie privée, les tests de développement et la lutte contre le spam.
          </p>
          <p>
            Il est strictement interdit d'utiliser le service à des fins illégales, pour contourner des sanctions, tenter des piratages ou recevoir des données sensibles et bancaires.
          </p>
        </section>
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0A0A0A] py-12 transition-colors mt-auto text-xs">
      <div class="max-w-4xl mx-auto px-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10 text-left">
          <div>
            <a href="/fr/" dir="ltr" class="inline-flex items-center gap-2.5 transition-opacity hover:opacity-90 mb-3">
              <img src="/logo.svg" alt="freetemp.email" class="w-7 h-7 rounded-lg shadow-sm shrink-0" width="28" height="28" />
              <span class="flex items-baseline font-sans tracking-tight">
                <span class="text-lg font-extrabold text-black dark:text-white">freetemp</span>
                <span class="text-xs font-semibold text-neutral-500 dark:text-neutral-400">.email</span>
              </span>
            </a>
            <p class="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-3">
              Service d'e-mail temporaire gratuit et sécurisé pour protéger votre vie privée contre le spam et les traceurs sans aucune inscription.
            </p>
            <div class="inline-flex items-center gap-2 font-mono text-[11px] text-black dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 rounded-md px-2 py-1 bg-neutral-50 dark:bg-neutral-900">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Tous les nœuds Edge opérationnels</span>
            </div>
          </div>
          <div>
            <div class="font-bold text-black dark:text-white mb-3 uppercase tracking-wider text-[11px]">Navigation rapide</div>
            <ul class="space-y-2">
              <li><a href="/fr/" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Accueil</a></li>
              <li><a href="/fr/blog.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors font-semibold">Blog</a></li>
              <li><a href="/fr/guide.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Guide d'utilisation</a></li>
              <li><a href="/fr/faq.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <div class="font-bold text-black dark:text-white mb-3 uppercase tracking-wider text-[11px]">Transparence & Conformité</div>
            <ul class="space-y-2">
              <li><a href="/fr/about.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">À propos</a></li>
              <li><a href="/fr/privacy.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Politique de confidentialité</a></li>
              <li><a href="/fr/privacy.html#terms" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Conditions d'utilisation</a></li>
            </ul>
          </div>
          <div>
            <div class="font-bold text-black dark:text-white mb-3 uppercase tracking-wider text-[11px]">Sécurité & Chiffrement</div>
            <ul class="space-y-2 text-neutral-600 dark:text-neutral-400">
              <li class="flex items-center gap-2">
                <svg class="w-3.5 h-3.5 stroke-current fill-none stroke-[2] text-black dark:text-white shrink-0" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Autodestruction après 20 min</span>
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-3.5 h-3.5 stroke-current fill-none stroke-[2] text-black dark:text-white shrink-0" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Isolation mémoire chiffrée O(1)</span>
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-3.5 h-3.5 stroke-current fill-none stroke-[2] text-black dark:text-white shrink-0" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Zéro log & sans cookies tiers</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="border-t border-neutral-200 dark:border-neutral-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400">
          <div>© 2026 FreeTemp.email — E-mail temporaire gratuit. Tous droits réservés.</div>
          <div class="flex items-center gap-4">
            <span>Chiffrement TLS 1.3 256-Bit</span>
            <span>•</span>
            <span>Cloudflare Edge Ultra-Rapide</span>
            <span>•</span>
            <span>Strictement sans journaux (Zero-Logs)</span>
          </div>
        </div>
      </div>
    </footer>
    <script src="/app.js"></script>
  </body>
</html>`;

writeFr('privacy.html', frPrivacy);

// 5. BLOG.HTML (FR)
// Read en/blog.html as base, adjust canonical, language label, title, hero text, and footer
if (fs.existsSync(path.join(__dirname, '../en/blog.html'))) {
  let frBlogContent = fs.readFileSync(path.join(__dirname, '../en/blog.html'), 'utf8');
  
  // Update lang & title & canonical
  frBlogContent = frBlogContent.replace(/<html lang="[^"]*"/, '<html lang="fr"');
  frBlogContent = frBlogContent.replace(/<title>[\s\S]*?<\/title>/, "<title>Archives du Blog & Guides d'Ingénierie — FreeTemp.email</title>");
  frBlogContent = frBlogContent.replace(/<link rel="canonical" href="[^"]*"/, '<link rel="canonical" href="https://freetemp.email/fr/blog.html"');
  
  // Replace language label in header
  frBlogContent = frBlogContent.replace(/<span id="current-lang-label">[^<]*<\/span>/, '<span id="current-lang-label">Français</span>');
  
  // Translate Hero
  frBlogContent = frBlogContent.replace(
    /<h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-black dark:text-white mb-3 font-sans">[\s\S]*?<\/h1>/,
    '<h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-black dark:text-white mb-3 font-sans">Archives du Blog & Guides d\'Ingénierie</h1>'
  );
  frBlogContent = frBlogContent.replace(
    /<p class="text-neutral-600 dark:text-neutral-400 text-sm max-w-xl">[\s\S]*?<\/p>/,
    '<p class="text-neutral-600 dark:text-neutral-400 text-sm max-w-xl">Explorez nos analyses techniques sur la confidentialité des e-mails, l\'infrastructure éphémère et les protocoles de sécurité.</p>'
  );
  
  // Navigation in header
  frBlogContent = frBlogContent.replace(
    /<nav class="hidden md:flex items-center gap-4 text-xs font-medium">[\s\S]*?<\/nav>/,
    `<nav class="hidden md:flex items-center gap-4 text-xs font-medium">
            <a href="/fr/" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Accueil</a>
            <a href="/fr/blog.html" class="text-black dark:text-white font-bold transition-colors">Blog</a>
            <a href="/fr/guide.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Guide</a>
            <a href="/fr/faq.html" class="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">FAQ</a>
          </nav>`
  );

  writeFr('blog.html', frBlogContent);
}

console.log('All French pages created and synced successfully!');
