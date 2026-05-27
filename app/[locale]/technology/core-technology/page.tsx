import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/shared/PageHero";
import { CoreTechContent } from "@/components/technology/CoreTechContent";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Core Technology",
    description:
      "The six technology pillars powering Raasbot's intelligent robotics platform: AI Vision, Motion Control, Natural Language, Edge Computing, Cloud Integration, and Safety Systems.",
  };
}

export default async function CoreTechnologyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHero
        eyebrow="Core Technology"
        title="The Intelligence Behind Every Robot"
        subtitle="Six foundational technology pillars engineered to work in harmony — delivering reliable, safe, and capable robots for real-world deployment."
      />
      <CoreTechContent />
    </>
  );
}
