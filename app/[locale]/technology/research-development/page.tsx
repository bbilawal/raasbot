import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/shared/PageHero";
import { RDContent } from "@/components/technology/RDContent";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Research & Development",
    description:
      "Inside Raasbot's R&D labs — our research areas, academic partnerships, and publication record driving the next generation of intelligent robotics.",
  };
}

export default async function ResearchDevelopmentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHero
        eyebrow="Research & Development"
        title="Where the Next Generation of Robotics is Born"
        subtitle="Our R&D division drives the science and engineering behind Raasbot products — from foundational AI research to applied systems engineering."
      />
      <RDContent />
    </>
  );
}
