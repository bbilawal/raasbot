import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/shared/PageHero";
import { CultureContent } from "@/components/about/CultureContent";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Culture & Values",
    description:
      "Discover the values and culture that drive Raasbot — innovation, excellence, integrity, and collaboration.",
  };
}

export default async function CulturePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHero
        eyebrow="Our Culture"
        title="Driven by Purpose, United by Values"
        subtitle="At Raasbot, our culture is the foundation of everything we build. We believe great products come from great teams guided by shared principles."
      />
      <CultureContent />
    </>
  );
}
