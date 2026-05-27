import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/shared/PageHero";
import { SolutionPageLayout } from "@/components/solutions/SolutionPageLayout";
import { Heart, Shield, Users, Pill, Activity, HandHeart } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Healthcare Robots",
    description:
      "Raasbot healthcare robotics — elderly care, medication delivery, clinical support, and patient companionship solutions.",
  };
}

const PRODUCTS = [
  {
    name: "Care Companion",
    tagline: "Elderly Care Robot",
    description:
      "A compassionate companion robot designed for long-term care facilities and home care. Provides medication reminders, fall detection, and social engagement for elderly residents.",
    category: "Elder Care",
    badge: "Bestseller",
    features: ["Fall detection & alert", "Medication reminders", "Family video calling"],
  },
  {
    name: "MedBot Pro",
    tagline: "Autonomous Medication Delivery",
    description:
      "Secure, autonomous medication delivery system that transports medications from pharmacy to patient room with barcode verification and access controls.",
    category: "Clinical",
    features: ["Barcode verification", "Tamper-proof storage", "Delivery audit trail"],
  },
  {
    name: "Rehab Assistant",
    tagline: "Physical Therapy Support",
    description:
      "Assists physiotherapists with repetitive rehabilitation exercises, tracks patient progress, and provides motivational feedback during sessions.",
    category: "Rehabilitation",
    features: ["Exercise guidance", "Progress tracking", "Therapist dashboard"],
  },
  {
    name: "Sanitization Robot",
    tagline: "UV-C Disinfection System",
    description:
      "Autonomous UV-C disinfection robot that systematically sanitizes patient rooms, ICUs, and surgical suites to hospital-grade standards.",
    category: "Infection Control",
    features: ["UV-C 254nm wavelength", "Room mapping protocol", "Infection control logs"],
  },
  {
    name: "Telepresence Medical",
    tagline: "Remote Clinical Presence",
    description:
      "Enables physicians to remotely conduct patient rounds and consultations via a high-fidelity mobile telepresence platform with medical-grade sensors.",
    category: "Telemedicine",
    features: ["4K video consultation", "Stethoscope integration", "EHR connectivity"],
  },
  {
    name: "Logistics Hospital",
    tagline: "Clinical Supply Chain",
    description:
      "Automates the transport of specimens, supplies, and linens within hospital corridors — freeing nursing staff for patient care.",
    category: "Logistics",
    features: ["Specimen transport", "IV/Supply delivery", "Fleet management"],
  },
];

const USE_CASES = [
  {
    iconName: 'Heart',
    title: "Elderly & Long-Term Care",
    description: "Companion robots that reduce isolation, provide safety monitoring, and support daily living activities for elderly residents.",
  },
  {
    iconName: 'Pill',
    title: "Medication Management",
    description: "Automated medication delivery and administration support that reduces dispensing errors and nursing workload.",
  },
  {
    iconName: 'Shield',
    title: "Infection Control",
    description: "Autonomous disinfection reduces hospital-acquired infections and supports stringent infection control protocols.",
  },
  {
    iconName: 'Activity',
    title: "Patient Monitoring",
    description: "Continuous vital sign monitoring with AI-powered anomaly detection and escalation to nursing staff.",
  },
  {
    iconName: 'Users',
    title: "Staff Support",
    description: "Handling routine transport tasks to free clinical staff for higher-value patient care activities.",
  },
  {
    iconName: 'HandHeart',
    title: "Palliative Care",
    description: "Compassionate robot companions for palliative patients providing comfort, entertainment, and connection to family.",
  },
];

export default async function HealthcarePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHero
        eyebrow="Solutions — Healthcare"
        title="Intelligent Robots for Better Patient Outcomes"
        subtitle="Healthcare robotics that support clinical staff, protect patients, and improve care quality across hospitals, clinics, and long-term care facilities."
      />
      <SolutionPageLayout
        sectionLabel="Healthcare Product Range"
        intro="Designed in consultation with healthcare professionals, our clinical robots meet the unique safety, hygiene, and regulatory requirements of medical environments."
        products={PRODUCTS}
        useCases={USE_CASES}
        ctaTitle="Improve Care in Your Facility"
        ctaDesc="Our healthcare specialists will assess your facility needs and design a phased deployment roadmap with measurable clinical outcomes."
      />
    </>
  );
}
