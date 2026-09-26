import fs from 'node:fs';
import path from 'node:path';

// Clean Arabic helper to guarantee 100% absence of Tashkeel / Diacritics
export function stripTashkeel(text: string): string {
  return text.replace(/[\u064B-\u0652\u0670\u06D6-\u06ED]/g, '');
}

export interface ArticleSource {
  title: string;
  url: string;
}

export interface UnifiedArticle {
  id: string;
  slug: string;
  category: { ar: string; en: string };
  badge: { ar: string; en: string };
  readTimeMin: number;
  icon: string;
  publishedAt: string;
  updatedAt: string;
  author: {
    name: string;
    url: string;
  };
  sources: ArticleSource[];
  title: { ar: string; en: string };
  metaDesc: { ar: string; en: string };
  lead: { ar: string; en: string };
  takeaways: { ar: string[]; en: string[] };
  sections: {
    id: string;
    title: { ar: string; en: string };
    content: { ar: string; en: string };
    callout?: {
      type: 'tip' | 'warning' | 'insight';
      title: { ar: string; en: string };
      text: { ar: string; en: string };
    };
    codeSnippet?: {
      lang: string;
      filename: string;
      code: string;
    };
  }[];
  comparisonTable?: {
    title: { ar: string; en: string };
    headers: { ar: [string, string, string]; en: [string, string, string] };
    rows: { ar: [string, string, string][]; en: [string, string, string][] };
  };
  faqs: {
    q: { ar: string; en: string };
    a: { ar: string; en: string };
  }[];
  relatedSlugs: string[];
}
