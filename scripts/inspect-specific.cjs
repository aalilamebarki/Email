// scripts/inspect-specific.cjs
const group1 = require('./articles/group1.cjs');
const group2 = require('./articles/group2.cjs');
const group3 = require('./articles/group3.cjs');
const group4 = require('./articles/group4.cjs');

const allArticles = [...group1, ...group2, ...group3, ...group4];

const targets = [
  'how-to-copy-address',
  'how-to-open-verification-links',
  'pwa-desktop-mobile-guide',
  'preventing-credential-stuffing-and-data-breaches',
  'disposable-email-vs-marketing-trackers',
  'gdpr-ccpa-compliance-ephemeral-data',
  'combating-marketing-trackers-and-spy-pixels',
  'phishing-defense-and-safe-previews',
  'bypass-email-verification-paywalls'
];

targets.forEach(slug => {
  const art = allArticles.find(a => a.slug === slug);
  if (!art) return;
  console.log(`\n=================== ${slug} ===================`);
  art.sections.forEach((sec, idx) => {
    console.log(`[Sec ${idx + 1}] AR: ${sec.content.ar}`);
    console.log(`[Sec ${idx + 1}] EN: ${sec.content.en}`);
  });
});
