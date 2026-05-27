import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/shared/PageHero";
import { SolutionPageLayout } from "@/components/solutions/SolutionPageLayout";
import {
  Factory,
  Building2,
  FlaskConical,
  Ambulance,
  ShoppingCart,
  Zap,
} from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Humanoid Robots",
    description:
      "Raasbot's humanoid robot lineup — Walker S2, S1, S series, Walker C/X, Cruzr S2, Panda Robot, and industrial platforms.",
  };
}

const PRODUCTS = [
  {
    name: "Walker S2",
    tagline: "Next-Gen Bipedal Humanoid",
    description:
      "The Walker S2 is Raasbot's flagship humanoid robot, featuring 41 degrees of freedom, 5-hour battery life, and an advanced AI vision stack for real-world deployment.",
    category: "Humanoid",
    badge: "New",
    features: [
      "41 degrees of freedom",
      "5-hour battery life",
      "30 TOPS AI processing",
    ],
  },
  {
    name: "Walker S1",
    tagline: "Professional Humanoid Platform",
    description:
      "The Walker S1 is the proven commercial humanoid robot for industrial and research applications, with a track record across 15+ countries.",
    category: "Humanoid",
    features: [
      "36 degrees of freedom",
      "4-hour battery life",
      "Research-grade APIs",
    ],
  },
  {
    name: "Walker S Series",
    tagline: "Scalable Humanoid Family",
    description:
      "The Walker S series provides a spectrum of configurations from lightweight research platforms to full industrial deployment units.",
    category: "Humanoid",
    features: ["Multiple configurations", "Unified SDK", "Shared spare parts"],
  },
  {
    name: "Walker C",
    tagline: "Commercial Service Robot",
    description:
      "Designed for commercial environments — retail, hospitality, and corporate spaces — the Walker C delivers friendly, efficient service.",
    category: "Commercial",
    features: [
      "Customer interaction mode",
      "Navigation autonomy",
      "Display screen integrated",
    ],
  },
  {
    name: "Walker X",
    tagline: "Advanced Research Platform",
    description:
      "The Walker X is a fully open platform for robotics researchers, with full joint-level API access and a simulation-ready digital twin.",
    category: "Research",
    badge: "Dev Edition",
    features: ["Full joint-level API", "Digital twin included", "ROS2 support"],
  },
  {
    name: "Cruzr S2",
    tagline: "Smart Service Robot",
    description:
      "The Cruzr S2 combines a friendly form factor with powerful navigation and interaction capabilities ideal for reception and guidance tasks.",
    category: "Service",
    features: [
      "360° lidar navigation",
      "Face recognition",
      "Multi-language support",
    ],
  },
  {
    name: "Panda Robot",
    tagline: "Collaborative Arm System",
    description:
      "A high-precision robotic arm for collaborative manufacturing and laboratory automation with intuitive drag-and-drop programming.",
    category: "Industrial",
    features: [
      "7 degrees of freedom",
      "Sub-mm repeatability",
      "Force-torque control",
    ],
  },
  {
    name: "Industrial Platform",
    tagline: "Heavy-Duty Automation",
    description:
      "Purpose-built for demanding industrial environments with IP65 rating, extended operating temperatures, and 24/7 operation capability.",
    category: "Industrial",
    features: ["IP65 rated", "24/7 operation", "-20°C to 60°C range"],
  },
];

const USE_CASES = [
  {
    iconName: 'Factory',
    title: "Manufacturing & Assembly",
    description:
      "Automate repetitive assembly tasks with precision and consistency, working safely alongside human operators.",
  },
  {
    iconName: 'Building2',
    title: "Facility Services",
    description:
      "Security patrols, cleaning coordination, and visitor guidance in office buildings and public spaces.",
  },
  {
    iconName: 'FlaskConical',
    title: "Research & Development",
    description:
      "Open platforms for robotics research, with full API access and simulation environments.",
  },
  {
    iconName: 'Ambulance',
    title: "Healthcare Support",
    description:
      "Patient interaction, medication delivery, and contactless assistance in clinical environments.",
  },
  {
    iconName: 'ShoppingCart',
    title: "Retail & Hospitality",
    description:
      "Customer greeting, product guidance, and checkout assistance for modern retail environments.",
  },
  {
    iconName: 'Zap',
    title: "Hazardous Environments",
    description:
      "Deploy robots in environments unsafe for humans — extreme temperatures, chemical exposure, radiation zones.",
  },
];

export default async function HumanoidPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHero
        eyebrow="Solutions — Humanoid"
        title="Humanoid Robots for Every Industry"
        subtitle="From research labs to factory floors — our humanoid robot lineup delivers the mobility, intelligence, and reliability that real-world deployment demands."
      />
      <SolutionPageLayout
        sectionLabel="Full Product Lineup"
        intro="Our humanoid robot family spans eight distinct models designed for different use cases, environments, and budget requirements — all sharing the same core AI platform."
        products={PRODUCTS}
        useCases={USE_CASES}
        ctaTitle="Ready to Deploy a Humanoid Robot?"
        ctaDesc="Our solutions team will match you with the right humanoid platform for your use case and guide you through deployment."
      />
    </>
  );
}
