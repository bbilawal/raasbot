import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/shared/PageHero";
import { SolutionPageLayout } from "@/components/solutions/SolutionPageLayout";
import { Home, Heart, Sparkles, PawPrint, Brush, Zap } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Consumer Robots",
    description:
      "Raasbot consumer robots — Alpha series humanoids, smart robot pets, and intelligent home cleaning devices.",
  };
}

const PRODUCTS = [
  {
    name: "Alpha Mini 2",
    tagline: "Personal Humanoid Companion",
    description:
      "A compact, expressive humanoid robot for home use. Dances, tells stories, teaches kids to code, and serves as a smart home hub with natural voice control.",
    category: "Humanoid",
    badge: "Bestseller",
    features: ["Natural voice control", "Coding education mode", "Smart home integration"],
  },
  {
    name: "Alpha 2",
    tagline: "Family Companion Robot",
    description:
      "The full-sized home companion robot that helps with daily routines, entertainment, and learning. A friendly presence for the whole family.",
    category: "Humanoid",
    features: ["Daily routine assistance", "Entertainment & games", "Family accounts"],
  },
  {
    name: "Alpha S",
    tagline: "Premium Home Humanoid",
    description:
      "The premium consumer humanoid with enhanced conversational AI, a larger display, and integration with the full Raasbot smart home ecosystem.",
    category: "Humanoid",
    badge: "New",
    features: ["Enhanced LLM conversation", "10-inch display", "Full smart home hub"],
  },
  {
    name: "Buddy Bot",
    tagline: "Smart Robot Pet",
    description:
      "An expressive robot pet that responds to touch, voice, and emotions. Features animal-like movement, sounds, and a personality that develops over time.",
    category: "Smart Pet",
    features: ["Adaptive personality", "Emotion recognition", "Child-safe materials"],
  },
  {
    name: "CleanBot Home",
    tagline: "Intelligent Home Cleaning",
    description:
      "A smart multi-surface cleaning robot that maps your home, learns your preferences, and automatically maintains floor cleanliness.",
    category: "Cleaning",
    features: ["Multi-floor mapping", "Voice command control", "Self-emptying dock"],
  },
  {
    name: "Window Cleaner Pro",
    tagline: "Autonomous Window Cleaning",
    description:
      "Autonomous window cleaning robot that safely adheres to glass surfaces and systematically cleans interior and exterior windows.",
    category: "Cleaning",
    features: ["Smart suction system", "Interior & exterior", "Remote app control"],
  },
];

const USE_CASES = [
  {
    iconName: 'Home',
    title: "Smart Home Hub",
    description: "Control all your smart home devices through a single conversational interface — lights, temperature, security, and more.",
  },
  {
    iconName: 'Heart',
    title: "Family Companion",
    description: "Keep elderly relatives company, help children with homework, and keep the whole family connected.",
  },
  {
    iconName: 'Sparkles',
    title: "Entertainment",
    description: "Music, stories, games, and interactive experiences that bring joy to kids and adults alike.",
  },
  {
    iconName: 'PawPrint',
    title: "Pet-Like Interaction",
    description: "The emotional benefits of a pet with none of the feeding and grooming — perfect for apartments and allergy sufferers.",
  },
  {
    iconName: 'Brush',
    title: "Home Maintenance",
    description: "Automated floor and window cleaning keeps your home pristine without effort.",
  },
  {
    iconName: 'Zap',
    title: "Productivity Assistant",
    description: "Calendar management, reminders, shopping lists, and information lookup at your voice command.",
  },
];

export default async function ConsumerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHero
        eyebrow="Solutions — Consumer"
        title="Personal Robots for Everyday Life"
        subtitle="From expressive companions to intelligent cleaning devices — Raasbot's consumer lineup brings intelligent robotics into your home."
      />
      <SolutionPageLayout
        sectionLabel="Consumer Product Range"
        intro="Our consumer robots are designed to be approachable, safe, and genuinely useful — enhancing your daily life without getting in the way."
        products={PRODUCTS}
        useCases={USE_CASES}
        ctaTitle="Find Your Perfect Home Robot"
        ctaDesc="Browse our consumer range and find the robot that fits your lifestyle — available for purchase, rental, or monthly subscription."
      />
    </>
  );
}
