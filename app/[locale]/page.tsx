import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsBar } from "@/components/home/StatsBar";
import { SolutionsGrid } from "@/components/home/SolutionsGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });
  const th = await getTranslations({ locale, namespace: "home" });

  return {
    title: t("name"),
    description: t("description"),
    openGraph: {
      title: `${t("name")} — ${t("tagline")}`,
      description: t("description"),
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "home" });
  const tn = await getTranslations({ locale, namespace: "nav" });
  const tp = await getTranslations({ locale, namespace: "products" });

  const stats = [
    { value: "500+", label: t("statsPatents") },
    { value: "30+", label: t("statsCountries") },
    { value: "50+", label: t("statsProducts") },
    { value: "10+", label: t("statsYears") },
  ];

  const solutionCards = [
    {
      key: "humanoid",
      label: tn("humanoid"),
      description:
        "Next-generation humanoid robots for industrial, commercial, and research environments.",
      href: "/solutions/humanoid" as const,
      icon: "🤖",
    },
    {
      key: "education",
      label: tn("education"),
      description:
        "AI-powered educational robots that make STEM learning engaging and accessible for all ages.",
      href: "/solutions/education" as const,
      icon: "🎓",
    },
    {
      key: "commercial",
      label: tn("commercial"),
      description:
        "Smart automation solutions for retail, hospitality, and commercial operations.",
      href: "/solutions/commercial" as const,
      icon: "🏢",
    },
    {
      key: "healthcare",
      label: tn("healthcare"),
      description:
        "Precision robotics assisting medical professionals in diagnostics, surgery, and patient care.",
      href: "/solutions/healthcare" as const,
      icon: "🏥",
    },
    {
      key: "logistics",
      label: tn("logistics"),
      description:
        "Autonomous warehouse and last-mile delivery robots that optimize your supply chain.",
      href: "/solutions/logistics" as const,
      icon: "📦",
    },
    {
      key: "consumer",
      label: tn("consumer"),
      description:
        "Personal companion robots that enhance everyday life at home and on the go.",
      href: "/solutions/consumer" as const,
      icon: "🏠",
    },
  ];

  return (
    <>
      <HeroSection
        title={t("heroTitle")}
        subtitle={t("heroSubtitle")}
        ctaExplore={t("heroCta")}
        ctaShop={t("heroCtaShop")}
      />

      <StatsBar stats={stats} />

      <SolutionsGrid title={t("solutionsTitle")} cards={solutionCards} />

      <FeaturedProducts
        title={t("featuredProductsTitle")}
        buyNow={tp("buyNow")}
        getQuote={tp("getQuote")}
      />
    </>
  );
}
