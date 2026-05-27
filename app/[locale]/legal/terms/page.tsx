import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { PageHero } from '@/components/shared/PageHero'
import { LegalContent } from '@/components/legal/LegalContent'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Terms of Service | Raasbot',
    description: 'Terms of Service for Raasbot — 13698491 Canada Inc.',
  }
}

const sections = [
  {
    heading: '1. Acceptance of Terms',
    body: 'By accessing or using the Raasbot website and services operated by 13698491 Canada Inc ("Raasbot", "we", "us"), you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.',
  },
  {
    heading: '2. Use of Services',
    body: 'You may use our services only for lawful purposes and in accordance with these Terms. You agree not to use our services in any way that violates applicable laws or regulations, or to transmit any harmful, offensive, or disruptive content.',
  },
  {
    heading: '3. Products and Purchases',
    body: 'All product descriptions, pricing, and availability are subject to change without notice. We reserve the right to refuse or cancel orders at our discretion. Payment is processed securely through Stripe. All prices are in USD unless otherwise stated.',
  },
  {
    heading: '4. Rental Terms',
    body: 'Rental agreements are subject to additional terms provided at the time of rental. A security deposit is required for all rentals. Equipment must be returned in the same condition as received. Damage beyond normal wear will be charged against the security deposit.',
  },
  {
    heading: '5. Intellectual Property',
    body: 'All content, trademarks, logos, and intellectual property on this site are the property of 13698491 Canada Inc or its licensors. You may not reproduce, distribute, or create derivative works without our express written consent.',
  },
  {
    heading: '6. Limitation of Liability',
    body: 'To the maximum extent permitted by law, 13698491 Canada Inc shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services or products.',
  },
  {
    heading: '7. Governing Law',
    body: 'These Terms are governed by the laws of the Province of Ontario and the federal laws of Canada applicable therein, without regard to conflict of law provisions.',
  },
  {
    heading: '8. Contact',
    body: '13698491 Canada Inc\n1202 Stirling Todd Terrace\nMilton, Ontario, Canada\nEmail: legal@raasbot.com',
  },
]

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of Service" subtitle="Last updated: January 2025" />
      <LegalContent sections={sections} />
    </>
  )
}
