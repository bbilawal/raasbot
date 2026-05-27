import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/shared/PageHero";
import { MilestonesTimeline } from "@/components/about/MilestonesTimeline";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Milestones",
    description:
      "A decade of innovation — the key milestones that shaped Raasbot into a global robotics leader.",
  };
}

export default async function MilestonesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHero
        eyebrow="Our Journey"
        title="A Decade of Breakthrough Moments"
        subtitle="From a garage prototype to a global robotics platform — every milestone reflects our relentless commitment to intelligent automation."
      />
      <MilestonesTimeline />
    </>
  );
}
