import fs from 'node:fs';
import path from 'node:path';

export interface ArticleFaq {
  q: string;
  a: string;
}

export interface ArticleSection {
  id: string;
  title: string;
  contentHtml: string;
  callout?: {
    type: 'tip' | 'warning' | 'insight';
    title: string;
    text: string;
  };
  codeSnippet?: {
    lang: string;
    filename: string;
    code: string;
  };
}

export interface ArticleComparison {
  title: string;
  headers: [string, string, string];
  rows: [string, string, string][];
}

export interface ArticleDef {
  slug: string;
  category: string;
  badgeTag: string;
  readTimeMin: number;
  iconName: string;
  publishedDate: string;
  modifiedDate: string;
  relatedSlugs: string[];
  translations: Record<string, {
    title: string;
    metaDesc: string;
    categoryLabel: string;
    badgeLabel: string;
    readTimeLabel: string;
    leadSummary: string;
    keyTakeaways: string[];
    sections: ArticleSection[];
    comparisonTable?: ArticleComparison;
    faqs: ArticleFaq[];
    ctaTitle: string;
    ctaDesc: string;
    ctaBtn: string;
  }>;
}
