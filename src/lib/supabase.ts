import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { ArticleDetail, ArticleListItem } from "@/types/article";

function requireEnv(name: keyof ImportMetaEnv): string {
  const v = import.meta.env[name];
  if (!v) {
    throw new Error(
      `環境変数 ${String(name)} が未設定です。.env に PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY を設定してください。`,
    );
  }
  return v;
}

let _client: SupabaseClient | undefined;

export function getSupabaseAnon(): SupabaseClient {
  if (!_client) {
    _client = createClient(
      requireEnv("PUBLIC_SUPABASE_URL"),
      requireEnv("PUBLIC_SUPABASE_ANON_KEY"),
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    );
  }
  return _client;
}

/** 公開済みの記事一覧のみ取得 */
export async function fetchPublishedArticles(): Promise<ArticleListItem[]> {
  const supabase = getSupabaseAnon();

  const { data, error } = await supabase
    .from("articles")
    .select("slug, title, category, excerpt, created_at, updated_at, published")
    .eq("published", true)
    .not("slug", "is", null)
    .not("title", "is", null)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`記事一覧の取得に失敗しました: ${error.message}`);
  }

  return (data ?? []).map((article) => ({
    slug: article.slug,
    title: article.title,
    category: article.category,
    excerpt: article.excerpt,
    created_at: article.created_at,
    updated_at: article.updated_at,
  })) as ArticleListItem[];
}

/** slug 指定で公開済みの記事のみ取得 */
export async function fetchPublishedArticleBySlug(
  slug: string,
): Promise<ArticleDetail | null> {
  const supabase = getSupabaseAnon();

  const { data, error } = await supabase
    .from("articles")
    .select(
      "slug, title, category, excerpt, body_markdown, seo_title, meta_description, created_at, updated_at, published",
    )
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    throw new Error(`記事の取得に失敗しました: ${error.message}`);
  }

  if (!data) return null;

  return {
    slug: data.slug,
    title: data.title,
    category: data.category,
    excerpt: data.excerpt,
    body_markdown: data.body_markdown,
    seo_title: data.seo_title,
    meta_description: data.meta_description,
    created_at: data.created_at,
    updated_at: data.updated_at,
  } as ArticleDetail;
}