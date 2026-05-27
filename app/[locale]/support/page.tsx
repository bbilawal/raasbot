import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/shared/PageHero";
import { SupportContent } from "@/components/support/SupportContent";
import { createClient } from "@/lib/supabase/server";

export type SupportDownload = {
  id: string;
  title: string;
  description: string | null;
  file_url: string | null;
  category: string | null;
  product: string | null;
  file_type: string | null;
  version: string | null;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Support & Downloads",
    description:
      "Raasbot support center — download manuals, firmware, SDKs, and access the developer portal for API documentation.",
  };
}

export default async function SupportPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  let downloads: SupportDownload[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("support_downloads")
      .select(
        "id, title, description, file_url, category, product, file_type, version"
      )
      .order("created_at", { ascending: false });
    if (data) downloads = data as SupportDownload[];
  } catch {
    // Supabase not configured — show placeholder
  }

  return (
    <>
      <PageHero
        eyebrow="Support"
        title="Everything You Need to Succeed"
        subtitle="Downloads, documentation, SDKs, and direct access to our support team — everything in one place."
      />
      <SupportContent downloads={downloads} />
    </>
  );
}
