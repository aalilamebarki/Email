// scripts/inspect-pwa-links.cjs
const g1 = require('./articles/group1.cjs');
const g2 = require('./articles/group2.cjs');
const all = [...g1, ...g2];

const pwa = all.find(x => x.slug === 'pwa-desktop-mobile-guide');
const open = all.find(x => x.slug === 'how-to-open-verification-links');

console.log('=== OPEN LINKS ===');
open.sections.forEach((s, i) => {
  console.log(`[OPEN S${i+1}] AR: ${s.content.ar}`);
});

console.log('=== PWA ===');
pwa.sections.forEach((s, i) => {
  console.log(`[PWA S${i+1}] AR: ${s.content.ar}`);
});
