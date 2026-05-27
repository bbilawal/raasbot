import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/shared/PageHero";
import { IRContent } from "@/components/investor/IRContent";
import { createClient } from "@/lib/supabase/server";

export type InvestorDoc = {
  id: string;
  title: string;
  description: string | null;
  file_url: string | null;
  doc_type: string | null;
  published_at: string | null;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Investor Relations",
    description:
      "Investor relations for Raasbot (13698491 Canada Inc) — financial highlights, governance, and investor documents.",
  };
}

export default async function InvestorRelationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  let docs: InvestorDoc[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("investor_docs")
      .select("id, title, description, file_url, doc_type, published_at")
      .order("published_at", { ascending: false });
    if (data) docs = data as InvestorDoc[];
  } catch {
    // Supabase not configured — show placeholder docs
  }

  return (
    <>
      <PageHero
        eyebrow="Investor Relations"
        title="Transparency, Growth, and Long-Term Value"
        subtitle="Information for current and prospective investors in 13698491 Canada Inc — the parent company of Raasbot."
      />
      <IRContent docs={docs} />
    </>
  );
}
