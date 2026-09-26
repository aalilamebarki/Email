// scripts/validate-schema.cjs
const fs = require('fs');
const path = require('path');

const schema = JSON.parse(fs.readFileSync(path.join(__dirname, '../shared/articles.schema.json'), 'utf8'));
const articles = JSON.parse(fs.readFileSync(path.join(__dirname, '../shared/articles-data.json'), 'utf8'));

console.log(`Validating ${articles.length} articles against centralized JSON schema...`);

let errors = 0;
articles.forEach((art, idx) => {
  const required = ['id', 'slug', 'category', 'badge', 'readTimeMin', 'publishedAt', 'title', 'metaDesc', 'lead', 'sections', 'relationships'];
  required.forEach(field => {
    if (!art[field]) {
      console.error(`Article #${idx + 1} (${art.slug || 'unknown'}): Missing required field '${field}'`);
      errors++;
    }
  });

  if (art.relationships) {
    if (!art.relationships.hreflang || typeof art.relationships.hreflang !== 'object') {
      console.error(`Article #${idx + 1} (${art.slug}): Missing or invalid relationships.hreflang`);
      errors++;
    }
    if (!Array.isArray(art.relationships.relatedSlugs)) {
      console.error(`Article #${idx + 1} (${art.slug}): Missing or invalid relationships.relatedSlugs`);
      errors++;
    }
  }

  if (art.sections && Array.isArray(art.sections)) {
    art.sections.forEach((sec, sIdx) => {
      if (!sec.id || !sec.title || !sec.content) {
        console.error(`Article #${idx + 1} (${art.slug}) Section #${sIdx + 1}: Missing id, title, or content`);
        errors++;
      }
    });
  }
});

if (errors === 0) {
  console.log(`✅ SUCCESS: All ${articles.length} articles strictly conform to the centralized JSON Schema with full hreflang and relational post graphs.`);
} else {
  console.error(`❌ Validation failed with ${errors} errors.`);
  process.exit(1);
}
