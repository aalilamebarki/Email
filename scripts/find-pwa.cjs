// scripts/find-pwa.cjs
const g1 = require('./articles/group1.cjs');
const g2 = require('./articles/group2.cjs');
const g3 = require('./articles/group3.cjs');
const g4 = require('./articles/group4.cjs');
const all = [...g1, ...g2, ...g3, ...g4];

const a1 = all.find(x => x.slug === 'pwa-desktop-mobile-guide');
const a2 = all.find(x => x.slug === 'preventing-credential-stuffing-and-data-breaches');

console.log('PWA found:', !!a1, a1 ? a1.sections.length : 0);
if (a1) {
  a1.sections.forEach((s, i) => {
    console.log(`PWA S${i+1} AR:`, s.content.ar);
    console.log(`PWA S${i+1} EN:`, s.content.en);
  });
}

console.log('Breach found:', !!a2, a2 ? a2.sections.length : 0);
if (a2) {
  a2.sections.forEach((s, i) => {
    console.log(`Breach S${i+1} AR:`, s.content.ar);
    console.log(`Breach S${i+1} EN:`, s.content.en);
  });
}
