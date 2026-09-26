// scripts/find-articles.cjs
const group1 = require('./articles/group1.cjs');
const group2 = require('./articles/group2.cjs');
const group3 = require('./articles/group3.cjs');
const group4 = require('./articles/group4.cjs');

const allArticles = [...group1, ...group2, ...group3, ...group4];

allArticles.forEach((a, i) => {
  console.log(`${i+1}. ${a.slug} (sections: ${a.sections ? a.sections.length : 0})`);
});
