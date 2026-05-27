import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/shared/PageHero";
import { ComplianceContent } from "@/components/about/ComplianceContent";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Compliance & Certifications",
    description:
      "Raasbot's regulatory compliance, safety certifications, and standards adherence for intelligent robotics products.",
  };
}

export default async function CompliancePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHero
        eyebrow="Compliance"
        title="Built to the Highest Standards"
        subtitle="Our products meet and exceed international safety, security, and regulatory requirements across every market we serve."
      />
      <ComplianceContent />
    </>
  );
}
