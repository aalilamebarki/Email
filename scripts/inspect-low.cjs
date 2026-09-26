// scripts/inspect-low.cjs
const group1 = require('./articles/group1.cjs');
const group2 = require('./articles/group2.cjs');
const group3 = require('./articles/group3.cjs');
const group4 = require('./articles/group4.cjs');
const allArticles = [...group1, ...group2, ...group3, ...group4];

const lowSlugs = [
  'how-to-copy-address',
  'how-to-open-verification-links',
  'pwa-desktop-mobile-guide',
  'preventing-credential-stuffing-and-data-breaches',
  'disposable-email-vs-marketing-trackers',
  'gdpr-ccpa-compliance-ephemeral-data',
  'combating-marketing-trackers-and-spy-pixels'
];

lowSlugs.forEach(slug => {
  const art = allArticles.find(a => a.slug === slug);
  console.log(`\n============================ ${slug} ============================`);
  art.sections.forEach((s, idx) => {
    console.log(`\n-- [Sec ${idx + 1}] (${s.id})`);
    console.log(`AR: ${s.content.ar}`);
    console.log(`EN: ${s.content.en}`);
  });
});
