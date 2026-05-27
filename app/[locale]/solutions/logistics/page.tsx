import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/shared/PageHero";
import { SolutionPageLayout } from "@/components/solutions/SolutionPageLayout";
import { Package, Truck, BarChart3, Warehouse, Route, ScanLine } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Logistics Robots",
    description:
      "Raasbot smart delivery and warehouse automation products — autonomous mobile robots, sorting systems, and last-mile delivery platforms.",
  };
}

const PRODUCTS = [
  {
    name: "AMR Carry 300",
    tagline: "Autonomous Mobile Robot",
    description:
      "A 300kg payload autonomous mobile robot for warehouse floor transport. Integrates with WMS systems and works safely alongside human operators.",
    category: "Warehouse",
    badge: "New",
    features: ["300kg payload", "WMS integration", "Human-safe operation"],
  },
  {
    name: "Sorter Bot",
    tagline: "High-Speed Parcel Sorting",
    description:
      "AI-powered parcel sorting robot that reads labels, identifies destinations, and routes packages at up to 2,000 items per hour.",
    category: "Sorting",
    features: ["2,000 parcels/hr", "AI label recognition", "Multi-destination routing"],
  },
  {
    name: "Inventory Scout",
    tagline: "Automated Inventory Counting",
    description:
      "Autonomous shelf-scanning robot that counts inventory, identifies misplacements, and generates real-time stock reports for warehouse managers.",
    category: "Inventory",
    features: ["RFID + barcode scanning", "3D shelf mapping", "ERP-ready reports"],
  },
  {
    name: "Last-Mile Delivery Bot",
    tagline: "Autonomous Outdoor Delivery",
    description:
      "A weatherproof autonomous delivery robot for campus, suburban, and pedestrian-zone last-mile delivery up to 5km per charge.",
    category: "Delivery",
    features: ["5km delivery range", "IP67 weatherproof", "Smart locker integration"],
  },
  {
    name: "Cold Chain Bot",
    tagline: "Temperature-Controlled Transport",
    description:
      "Autonomous cold chain transport for pharmaceutical, food, and laboratory specimen delivery with continuous temperature logging.",
    category: "Cold Chain",
    features: ["2°C–8°C zone", "Temperature logging", "Chain-of-custody tracking"],
  },
  {
    name: "Fleet Manager",
    tagline: "Central Logistics Intelligence",
    description:
      "Cloud-based fleet management platform that orchestrates multiple robot types, optimizes routing, and provides real-time operational analytics.",
    category: "Platform",
    features: ["Multi-robot orchestration", "Route optimization AI", "Real-time analytics"],
  },
];

const USE_CASES = [
  {
    iconName: 'Warehouse',
    title: "Warehouse Automation",
    description: "End-to-end warehouse automation from receiving to outbound, reducing labor costs and increasing throughput.",
  },
  {
    iconName: 'Package',
    title: "E-commerce Fulfillment",
    description: "High-speed order picking, sorting, and packing for e-commerce fulfillment centers.",
  },
  {
    iconName: 'Truck',
    title: "Last-Mile Delivery",
    description: "Autonomous outdoor delivery for campuses, urban zones, and suburban neighborhoods.",
  },
  {
    iconName: 'BarChart3',
    title: "Inventory Management",
    description: "Continuous automated inventory counting and cycle counting to eliminate shrinkage and out-of-stocks.",
  },
  {
    iconName: 'Route',
    title: "Cross-Docking",
    description: "Rapid transfer of inbound shipments to outbound vehicles with minimal handling time.",
  },
  {
    iconName: 'ScanLine',
    title: "Quality Inspection",
    description: "Automated visual quality inspection of incoming goods using AI-powered camera systems.",
  },
];

export default async function LogisticsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHero
        eyebrow="Solutions — Logistics"
        title="Smart Delivery and Warehouse Automation"
        subtitle="Reduce operational costs and increase throughput with autonomous mobile robots and intelligent logistics platforms designed for real-world supply chains."
      />
      <SolutionPageLayout
        sectionLabel="Logistics Product Range"
        intro="Our logistics solutions span the full supply chain — from warehouse floor automation to last-mile outdoor delivery — all managed through a unified fleet intelligence platform."
        products={PRODUCTS}
        useCases={USE_CASES}
        ctaTitle="Transform Your Supply Chain"
        ctaDesc="Our logistics specialists will audit your current operations and design an automation roadmap with a clear ROI model."
      />
    </>
  );
}
