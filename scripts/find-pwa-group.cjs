// scripts/find-pwa-group.cjs
const g1 = require('./articles/group1.cjs');
const g2 = require('./articles/group2.cjs');
const g3 = require('./articles/group3.cjs');
const g4 = require('./articles/group4.cjs');

console.log('in g1:', g1.some(a => a.slug === 'pwa-desktop-mobile-guide'));
console.log('in g2:', g2.some(a => a.slug === 'pwa-desktop-mobile-guide'));
console.log('in g3:', g3.some(a => a.slug === 'pwa-desktop-mobile-guide'));
console.log('in g4:', g4.some(a => a.slug === 'pwa-desktop-mobile-guide'));
const pwa = [...g1, ...g2, ...g3, ...g4].find(a => a.slug === 'pwa-desktop-mobile-guide');
if (pwa) {
  pwa.sections.forEach((s, i) => console.log(`[PWA S${i+1}] ${s.content.ar}`));
}
