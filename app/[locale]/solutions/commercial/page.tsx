import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/shared/PageHero";
import { SolutionPageLayout } from "@/components/solutions/SolutionPageLayout";
import { Building2, ShoppingCart, Hotel, Briefcase, Utensils, Shield } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Commercial Robots",
    description:
      "Raasbot commercial service robots for enterprise — retail, hospitality, corporate, and public space automation.",
  };
}

const PRODUCTS = [
  {
    name: "Cruzr S2",
    tagline: "Enterprise Reception Robot",
    description:
      "An intelligent reception and wayfinding robot for corporate lobbies, hotels, and large commercial spaces. Handles visitor check-in, directions, and announcements.",
    category: "Service",
    badge: "Popular",
    features: ["Visitor check-in", "Multi-language support", "CRM integration"],
  },
  {
    name: "Walker C Pro",
    tagline: "Commercial Humanoid",
    description:
      "A humanoid service robot designed for commercial environments. Carries items, assists customers, and navigates dynamic store layouts autonomously.",
    category: "Humanoid",
    features: ["Autonomous navigation", "10kg carry capacity", "Customer interaction mode"],
  },
  {
    name: "CleanBot Pro",
    tagline: "Autonomous Floor Care",
    description:
      "Industrial-grade autonomous floor cleaning robot for large commercial spaces — shopping malls, airports, and corporate campuses.",
    category: "Cleaning",
    features: ["2,000 m²/hr coverage", "Wet/dry cleaning modes", "Fleet coordination"],
  },
  {
    name: "Security Patrol Robot",
    tagline: "24/7 Autonomous Security",
    description:
      "Continuous security patrol with anomaly detection, license plate recognition, and real-time alert escalation to security teams.",
    category: "Security",
    features: ["24/7 patrol scheduling", "Anomaly detection AI", "Live video streaming"],
  },
  {
    name: "DeliveryBot Indoor",
    tagline: "Last-Meter Indoor Delivery",
    description:
      "Autonomous indoor delivery robot for offices and hotels, delivering packages, meals, and items from floor to floor.",
    category: "Delivery",
    features: ["Elevator integration", "Door access control", "Multi-item payloads"],
  },
  {
    name: "Information Kiosk Robot",
    tagline: "Interactive Wayfinding",
    description:
      "A mobile interactive kiosk that navigates to customers proactively and provides real-time information, promotions, and navigation assistance.",
    category: "Service",
    features: ["Proactive engagement", "Touchscreen display", "Content management"],
  },
];

const USE_CASES = [
  {
    iconName: 'Building2',
    title: "Corporate Campuses",
    description: "Visitor management, internal delivery, and facility services across large corporate complexes.",
  },
  {
    iconName: 'ShoppingCart',
    title: "Retail Environments",
    description: "Customer assistance, product location, and inventory auditing in large retail and grocery stores.",
  },
  {
    iconName: 'Hotel',
    title: "Hotels & Hospitality",
    description: "Room service delivery, concierge assistance, and floor cleaning in hotels and resorts.",
  },
  {
    iconName: 'Briefcase',
    title: "Office Buildings",
    description: "Mail delivery, meeting room management, and visitor reception in multi-tenant office environments.",
  },
  {
    iconName: 'Utensils',
    title: "Food & Beverage",
    description: "Autonomous food delivery, bussing, and kitchen-to-table service in restaurants and canteens.",
  },
  {
    iconName: 'Shield',
    title: "Security Operations",
    description: "Perimeter patrol, anomaly detection, and integrated access control for commercial properties.",
  },
];

export default async function CommercialPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHero
        eyebrow="Solutions — Commercial"
        title="Service Robots for Enterprise"
        subtitle="Automate customer service, facility management, and security operations with intelligent robots built for the demands of commercial environments."
      />
      <SolutionPageLayout
        sectionLabel="Commercial Product Range"
        intro="Our commercial solutions cover the full spectrum of enterprise automation needs — from customer-facing service robots to behind-the-scenes operations automation."
        products={PRODUCTS}
        useCases={USE_CASES}
        ctaTitle="Automate Your Commercial Operations"
        ctaDesc="Our enterprise team will design a deployment plan tailored to your facility, workflow, and ROI targets."
      />
    </>
  );
}
