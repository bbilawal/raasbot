import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/shared/PageHero";
import { LegalContent } from "@/components/legal/LegalContent";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Privacy Policy",
    description:
      "Privacy Policy for Raasbot (13698491 Canada Inc) — how we collect, use, and protect your personal information under GDPR and PIPEDA.",
  };
}

const LAST_UPDATED = "May 1, 2025";

const SECTIONS = [
  {
    heading: "1. Introduction",
    content: `This Privacy Policy describes how 13698491 Canada Inc, operating as Raasbot ("Raasbot", "we", "us", or "our"), collects, uses, discloses, and safeguards your personal information when you visit our website at raasbot.com, purchase our products, or use our services.

We are committed to protecting your privacy and handling your personal information in an open and transparent manner, in compliance with Canada's Personal Information Protection and Electronic Documents Act (PIPEDA) and, where applicable, the European Union's General Data Protection Regulation (GDPR).

Our registered address is: 1202 Stirling Todd Terrace, Milton, Ontario, Canada.`,
  },
  {
    heading: "2. Information We Collect",
    content: `We may collect the following categories of personal information:

**Identity Information**: Name, username or similar identifier, title.

**Contact Information**: Email address, telephone number, billing and shipping address.

**Financial Information**: Payment card details (processed through our payment provider; we do not store full card numbers), purchase history, and transaction details.

**Technical Information**: IP address, browser type and version, time zone setting, browser plug-in types and versions, operating system and platform, device identifiers.

**Usage Data**: Information about how you use our website and services, including page views, search queries, and product interactions.

**Marketing and Communications Data**: Your preferences in receiving marketing from us and your communication preferences.

**Robot Usage Data**: Where you use our connected robotic products, we may collect operational data including usage patterns, environmental sensor data, and performance logs. This data is processed on-device where possible and is used solely for product improvement and safety monitoring.`,
  },
  {
    heading: "3. How We Use Your Information",
    content: `We use your personal information for the following purposes:

- **To fulfill orders and process payments**: Processing your purchases, managing returns, and communicating order status.
- **To provide customer support**: Responding to your inquiries, resolving disputes, and providing technical assistance.
- **To improve our products and services**: Analyzing usage patterns, conducting research and development, and refining our robotics technology.
- **To communicate with you**: Sending service notifications, product updates, and, where you have consented, marketing communications.
- **To comply with legal obligations**: Meeting our obligations under applicable law, including tax, customs, and export control regulations.
- **To protect our rights and prevent fraud**: Detecting and preventing fraudulent transactions and other illegal activities.

**Legal Basis for Processing (GDPR)**: For users in the European Union, we process your personal information based on: (a) contract performance, (b) legitimate interests, (c) legal obligation, or (d) your consent, as appropriate for each processing activity.`,
  },
  {
    heading: "4. Sharing Your Information",
    content: `We do not sell your personal information. We may share your information with:

**Service Providers**: Third-party companies that provide services on our behalf, including payment processors (Stripe), cloud hosting providers (Supabase/AWS), shipping carriers, and email service providers. These providers are contractually bound to use your information only as directed by us.

**Business Partners**: Where you purchase or use our products in partnership with a third-party business, we may share relevant information with that partner to facilitate service delivery.

**Legal Requirements**: We may disclose your information where required by law, court order, or regulatory authority, including to comply with PIPEDA, GDPR, or other applicable laws.

**Business Transfers**: In the event of a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.`,
  },
  {
    heading: "5. Data Retention",
    content: `We retain your personal information for as long as necessary to fulfill the purposes for which it was collected, including for legal, accounting, or reporting requirements.

- **Customer account data**: Retained for the duration of your account and for 7 years after account closure for tax and legal purposes.
- **Purchase records**: Retained for 7 years in accordance with Canadian tax legislation.
- **Marketing consent records**: Retained until consent is withdrawn and for a period thereafter to demonstrate compliance.
- **Robot usage logs**: Retained for 12 months unless extended retention is required for warranty or safety investigation purposes.`,
  },
  {
    heading: "6. Your Rights",
    content: `Depending on your jurisdiction, you may have the following rights regarding your personal information:

- **Access**: Request a copy of the personal information we hold about you.
- **Correction**: Request correction of inaccurate or incomplete personal information.
- **Deletion**: Request deletion of your personal information in certain circumstances.
- **Portability**: Receive your personal information in a structured, commonly used, machine-readable format.
- **Objection**: Object to certain processing of your personal information.
- **Withdraw Consent**: Where processing is based on consent, withdraw that consent at any time.

**Canadian Residents**: Under PIPEDA, you have the right to access and correct your personal information and to complain to the Office of the Privacy Commissioner of Canada.

**EU/EEA Residents**: Under the GDPR, you have additional rights as described above. You also have the right to lodge a complaint with your local data protection authority.

To exercise any of these rights, please contact us at privacy@raasbot.com or write to us at 1202 Stirling Todd Terrace, Milton, Ontario, Canada.`,
  },
  {
    heading: "7. Cookies and Tracking",
    content: `We use cookies and similar tracking technologies on our website. Please refer to our Cookie Policy for detailed information about the cookies we use and how you can manage your preferences.`,
  },
  {
    heading: "8. Data Security",
    content: `We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:

- Encryption of data in transit (TLS 1.2 or higher) and at rest
- Access controls limiting personnel access to personal information
- Regular security assessments and penetration testing
- Incident response procedures

However, no method of transmission over the internet or method of electronic storage is completely secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.`,
  },
  {
    heading: "9. International Data Transfers",
    content: `Raasbot is headquartered in Canada, which the European Commission has recognized as providing an adequate level of data protection for GDPR purposes. Where we transfer personal information to other countries, we ensure appropriate safeguards are in place, such as Standard Contractual Clauses approved by the European Commission.`,
  },
  {
    heading: "10. Children's Privacy",
    content: `Our website and services are not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected information from a child, please contact us immediately at privacy@raasbot.com and we will promptly delete such information.

For our education products, we work with schools and institutions who are responsible for obtaining parental consent where required under applicable law.`,
  },
  {
    heading: "11. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. We will notify you of material changes by posting the updated policy on our website with a new "Last Updated" date. Where required by law, we will seek your consent for material changes.`,
  },
  {
    heading: "12. Contact Us",
    content: `If you have questions, concerns, or requests regarding this Privacy Policy or our handling of your personal information, please contact us:

**Raasbot Privacy Team**
13698491 Canada Inc
1202 Stirling Todd Terrace
Milton, Ontario, Canada

Email: privacy@raasbot.com
Phone: +1 (800) RAASBOT

For EU/EEA inquiries, you may also contact our EU Representative at eu-privacy@raasbot.com.`,
  },
];

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle={`Effective and last updated: ${LAST_UPDATED}. Applies to 13698491 Canada Inc, operating as Raasbot.`}
      />
      <LegalContent sections={SECTIONS} lastUpdated={LAST_UPDATED} />
    </>
  );
}
