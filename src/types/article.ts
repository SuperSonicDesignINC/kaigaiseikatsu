/** DB の articles と対応（公開クエリ用の部分集合） */
export type ArticleListItem = {
  slug: string;
  title: string;
  category: string;
  excerpt: string | null;
  created_at: string;
  updated_at: string;
};

export type ArticleDetail = ArticleListItem & {
  body_markdown: string;
  seo_title: string | null;
  meta_description: string | null;
};
