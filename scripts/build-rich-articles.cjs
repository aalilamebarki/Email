// scripts/build-rich-articles.cjs
const fs = require('fs');
const path = require('path');

const group1 = require('./articles/group1.cjs');
const group2 = require('./articles/group2.cjs');
const group3 = require('./articles/group3.cjs');
const group4 = require('./articles/group4.cjs');

const allArticles = [...group1, ...group2, ...group3, ...group4];

console.log(`Total rich articles gathered: ${allArticles.length}`);

// Write shared/articles-data.js
const targetPath = path.join(__dirname, '../shared/articles-data.js');
const fileContent = `/**
 * Shared Articles Data Module
 * Clean, structured, highly educational, in-depth multi-section articles with robust metadata
 */
(function (root, factory) {
  var exp = factory();
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = exp;
  }
  if (typeof define === 'function' && define.amd) {
    define([], function () { return exp; });
  }
  root.ARTICLES_DATA = exp.ARTICLES_DATA;
  root.getArticleBySlug = exp.getArticleBySlug;
  root.getArticlesByCategory = exp.getArticlesByCategory;
  root.getFeaturedArticles = exp.getFeaturedArticles;
}(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this), function () {
  'use strict';

  var ARTICLES_DATA = ${JSON.stringify(allArticles, null, 2)};

  function getArticleBySlug(slug) {
    if (!slug) return null;
    return ARTICLES_DATA.find(function (a) { return a.slug === slug; }) || null;
  }

  function getArticlesByCategory(categoryKey, lang) {
    lang = lang || 'ar';
    return ARTICLES_DATA.filter(function (a) {
      return a.category && a.category[lang] === categoryKey;
    });
  }

  function getFeaturedArticles(limit) {
    limit = limit || 6;
    return ARTICLES_DATA.slice(0, limit);
  }

  return {
    ARTICLES_DATA: ARTICLES_DATA,
    getArticleBySlug: getArticleBySlug,
    getArticlesByCategory: getArticlesByCategory,
    getFeaturedArticles: getFeaturedArticles
  };
}));
`;

fs.writeFileSync(targetPath, fileContent, 'utf8');

const publicSharedPath = path.join(__dirname, '../public/shared/articles-data.js');
const publicSharedDir = path.dirname(publicSharedPath);
if (!fs.existsSync(publicSharedDir)) {
  fs.mkdirSync(publicSharedDir, { recursive: true });
}
fs.writeFileSync(publicSharedPath, fileContent, 'utf8');

console.log(`Successfully written shared/articles-data.js and public/shared/articles-data.js with ${allArticles.length} deep multi-section articles.`);
