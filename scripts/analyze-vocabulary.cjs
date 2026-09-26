// scripts/analyze-vocabulary.cjs
const group1 = require('./articles/group1.cjs');
const group2 = require('./articles/group2.cjs');
const group3 = require('./articles/group3.cjs');
const group4 = require('./articles/group4.cjs');

const allArticles = [...group1, ...group2, ...group3, ...group4];

allArticles.forEach(art => {
  console.log(`\n=== ARTICLE: ${art.slug} ===`);
  art.sections.forEach((sec, idx) => {
    console.log(`-- Sec ${idx + 1}: ${sec.title.ar} | ${sec.title.en}`);
    // Print snippet of text
    const cleanAr = sec.content.ar.replace(/<[^>]+>/g, ' ').slice(0, 160);
    const cleanEn = sec.content.en.replace(/<[^>]+>/g, ' ').slice(0, 160);
    console.log(`   AR: ${cleanAr}...`);
    console.log(`   EN: ${cleanEn}...`);
  });
});
