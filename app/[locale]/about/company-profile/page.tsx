import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/shared/PageHero";
import { CompanyProfileContent } from "@/components/about/CompanyProfileContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "fr" ? "Profil de l'entreprise" : "Company Profile",
    description:
      "Learn about Raasbot's mission, vision, and founding story as a global leader in intelligent robotics.",
  };
}

export default async function CompanyProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHero
        eyebrow="About Raasbot"
        title="Building the Future of Intelligent Robotics"
        subtitle="We are 13698491 Canada Inc — a team of engineers, researchers, and visionaries dedicated to making robotics accessible and transformative for every industry."
      />
      <CompanyProfileContent />
    </>
  );
}
