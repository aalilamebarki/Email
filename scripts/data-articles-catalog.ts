import { ARTICLES_PART1 } from './articles-part1.ts';
import { ARTICLES_PART2 } from './articles-part2.ts';
import { ARTICLES_PART3 } from './articles-part3.ts';

export interface CatalogArticle {
  slug: string;
  category: { ar: string; en: string };
  badge: { ar: string; en: string };
  readTimeMin: number;
  icon: string;
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

export const ARTICLES_CATALOG: CatalogArticle[] = [
  ...ARTICLES_PART1,
  ...ARTICLES_PART2,
  ...ARTICLES_PART3
];

console.log(`✓ Assembled master catalog with ${ARTICLES_CATALOG.length} comprehensive articles.`);
