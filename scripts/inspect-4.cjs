// scripts/inspect-4.cjs
const group1 = require('./articles/group1.cjs');
const group2 = require('./articles/group2.cjs');
const group3 = require('./articles/group3.cjs');
const all = [...group1, ...group2, ...group3];

['pwa-desktop-mobile-guide', 'preventing-credential-stuffing-and-data-breaches', 'how-to-open-verification-links', 'disposable-email-vs-marketing-trackers', 'how-to-copy-address'].forEach(slug => {
  const art = all.find(a => a.slug === slug);
  console.log(`\n=== ${slug} ===`);
  art.sections.forEach((s, idx) => {
    console.log(`[S${idx+1}] ${s.content.ar}`);
  });
});
