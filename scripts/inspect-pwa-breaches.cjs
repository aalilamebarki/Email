// scripts/inspect-pwa-breaches.cjs
const group2 = require('./articles/group2.cjs');
const group3 = require('./articles/group3.cjs');

const pwa = group2.find(a => a.slug === 'pwa-desktop-mobile-guide');
const breach = group3.find(a => a.slug === 'preventing-credential-stuffing-and-data-breaches');

console.log('=== PWA ===');
pwa.sections.forEach((s, i) => {
  console.log(`PWA S${i+1} AR:`, s.content.ar);
  console.log(`PWA S${i+1} EN:`, s.content.en);
});

console.log('=== BREACH ===');
breach.sections.forEach((s, i) => {
  console.log(`BREACH S${i+1} AR:`, s.content.ar);
  console.log(`BREACH S${i+1} EN:`, s.content.en);
});
