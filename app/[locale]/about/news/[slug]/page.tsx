import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NewsArticle } from "@/components/about/NewsArticle";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { Link } from "@/i18n/navigation";

type NewsPostFull = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  published_at: string | null;
  category: string | null;
  author: string | null;
};

const PLACEHOLDER_ARTICLE: NewsPostFull = {
  id: "1",
  slug: "raasbot-launches-walker-s2-humanoid",
  title: "Raasbot Launches Walker S2 — Next-Generation Humanoid Robot",
  excerpt:
    "The Walker S2 sets a new benchmark for humanoid robotics with its advanced balance system, 41 degrees of freedom, and 5-hour battery life.",
  content: `<p>Raasbot today announced the commercial availability of the Walker S2, a next-generation humanoid robot designed for real-world deployment across industrial, healthcare, and commercial environments.</p>
<h2>Key Specifications</h2>
<p>The Walker S2 features 41 degrees of freedom, enabling natural human-like motion. With a 5-hour operational battery life and advanced real-time balance algorithms, it is ready for sustained deployment in dynamic environments.</p>
<h2>AI-Powered Vision</h2>
<p>Equipped with six cameras and a proprietary AI vision stack, the Walker S2 can recognize objects, navigate complex spaces, and interact with people safely. The onboard edge computing unit processes 30 trillion operations per second.</p>
<h2>Availability</h2>
<p>The Walker S2 is available for order through the Raasbot shop and via enterprise quote for bulk deployments. Contact our sales team at sales@raasbot.com for pricing and delivery timelines.</p>`,
  cover_image: null,
  published_at: "2025-10-15T00:00:00Z",
  category: "Product Launch",
  author: "Raasbot Communications",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("news_posts")
      .select("title, excerpt")
      .eq("slug", slug)
      .single();
    if (data) {
      return {
        title: data.title,
        description: data.excerpt ?? undefined,
      };
    }
  } catch {}

  return {
    title: PLACEHOLDER_ARTICLE.title,
    description: PLACEHOLDER_ARTICLE.excerpt ?? undefined,
  };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  let article: NewsPostFull | null = null;
  let usePlaceholder = false;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("news_posts")
      .select(
        "id, slug, title, excerpt, content, cover_image, published_at, category, author"
      )
      .eq("slug", slug)
      .eq("published", true)
      .single();
    if (data) article = data as NewsPostFull;
  } catch {}

  if (!article) {
    if (slug === PLACEHOLDER_ARTICLE.slug) {
      article = PLACEHOLDER_ARTICLE;
      usePlaceholder = true;
    } else {
      notFound();
    }
  }

  return (
    <>
      {/* Back link */}
      <div className="pt-24 pb-8 bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/about/news"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft size={14} />
            Back to News
          </Link>
        </div>
      </div>

      {usePlaceholder && (
        <div className="bg-[#0A0A0A]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="px-4 py-3 rounded-lg bg-[#0066FF]/10 border border-[#0066FF]/20 text-[#0066FF] text-sm">
              Showing a sample article. Connect Supabase to display live
              content.
            </div>
          </div>
        </div>
      )}

      <NewsArticle article={article} />
    </>
  );
}
