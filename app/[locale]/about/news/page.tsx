import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/shared/PageHero";
import { NewsGrid } from "@/components/about/NewsGrid";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  return {
    title: "News & Press",
    description:
      "Stay up to date with the latest news, press releases, and announcements from Raasbot.",
  };
}

export type NewsPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
  published_at: string | null;
  category: string | null;
};

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  let posts: NewsPost[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("news_posts")
      .select("id, slug, title, excerpt, cover_image, published_at, category")
      .eq("published", true)
      .order("published_at", { ascending: false });
    if (data) posts = data as NewsPost[];
  } catch {
    // Supabase not configured — show placeholder
  }

  return (
    <>
      <PageHero
        eyebrow="News & Press"
        title="Latest from Raasbot"
        subtitle="Press releases, product launches, partnerships, and industry insights from the world of intelligent robotics."
      />
      <NewsGrid posts={posts} />
    </>
  );
}
