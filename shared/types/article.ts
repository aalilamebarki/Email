// shared/types/article.ts

export type SupportedLanguage =
  | 'ar'
  | 'en'
  | 'es'
  | 'fr'
  | 'de'
  | 'pt'
  | 'it'
  | 'ru'
  | 'tr'
  | 'zh'
  | 'ja'
  | 'ko'
  | 'nl'
  | 'pl'
  | 'id'
  | 'vi'
  | 'hi'
  | 'fa'
  | 'ur'
  | 'uk'
  | 'sv'
  | 'el';

export type LocalizedString = Record<SupportedLanguage | string, string>;

export type LocalizedStringArray = Record<SupportedLanguage | string, string[]>;

export interface ArticleAuthor {
  name: string;
  url: string;
  role?: string;
  avatar?: string;
}

export interface SourceCitation {
  title: string;
  url: string;
  standard?: string;
}

export interface CodeSnippet {
  language?: string;
  filename?: string;
  code: string;
}

export interface Callout {
  type?: 'info' | 'warning' | 'success' | 'security' | 'tip';
  title: LocalizedString;
  text: LocalizedString;
}

export interface ArticleSection {
  id: string;
  title: LocalizedString;
  content: LocalizedString;
  callout?: Callout;
  codeSnippet?: CodeSnippet;
}

export interface ComparisonRow {
  feature: LocalizedString;
  legacy: LocalizedString;
  advanced: LocalizedString;
}

export interface ComparisonTable {
  title: LocalizedString;
  headers: [LocalizedString, LocalizedString, LocalizedString];
  rows: ComparisonRow[];
}

export interface FAQItem {
  id?: string;
  q: LocalizedString;
  a: LocalizedString;
}

export type HreflangMapping = Record<string, string>;

export interface ArticleRelationships {
  hreflang?: HreflangMapping;
  relatedSlugs: string[];
  topicCluster?: string;
  seriesOrder?: number;
  prevSlug?: string | null;
  nextSlug?: string | null;
}

export interface QuickSpecs {
  storageTier?: LocalizedString;
  protocol?: LocalizedString;
  latency?: LocalizedString;
  retentionPolicy?: LocalizedString;
}

export interface Article {
  id: string;
  slug: string;
  schemaType?: 'TechArticle' | 'Article' | 'HowTo' | 'BlogPosting';
  category: LocalizedString;
  badge: LocalizedString;
  readTimeMin: number;
  icon?: string;
  publishedAt: string;
  updatedAt?: string;
  author?: ArticleAuthor;
  title: LocalizedString;
  metaDesc: LocalizedString;
  lead: LocalizedString;
  takeaways?: LocalizedStringArray;
  quickSpecs?: QuickSpecs;
  sections: ArticleSection[];
  comparisonTable?: ComparisonTable;
  sources?: SourceCitation[];
  faqs?: FAQItem[];
  relatedSlugs?: string[];
  relationships?: ArticleRelationships;
}
