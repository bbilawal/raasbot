import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { PageHero } from '@/components/shared/PageHero'
import { LegalContent } from '@/components/legal/LegalContent'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Cookie Policy | Raasbot',
    description: 'Cookie Policy for Raasbot — 13698491 Canada Inc.',
  }
}

const sections = [
  {
    heading: '1. What Are Cookies',
    body: 'Cookies are small text files stored on your device when you visit our website. They help us provide a better experience by remembering your preferences and understanding how you use our site.',
  },
  {
    heading: '2. Cookies We Use',
    body: 'Essential cookies: Required for the site to function (authentication, cart, language preference).\n\nAnalytics cookies: Help us understand traffic and usage patterns (e.g. page views, session duration).\n\nMarketing cookies: Used to deliver relevant advertisements. These are only set with your consent.',
  },
  {
    heading: '3. Third-Party Cookies',
    body: 'We use Stripe for payment processing, which may set its own cookies. We may also use analytics services. These third parties have their own privacy policies governing cookie use.',
  },
  {
    heading: '4. Managing Cookies',
    body: 'You can control cookies through your browser settings. Disabling essential cookies may affect site functionality. To opt out of analytics, you can use browser extensions or adjust your preferences in our cookie consent banner.',
  },
  {
    heading: '5. Contact',
    body: '13698491 Canada Inc\n1202 Stirling Todd Terrace\nMilton, Ontario, Canada\nEmail: privacy@raasbot.com',
  },
]

export default async function CookiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <PageHero eyebrow="Legal" title="Cookie Policy" subtitle="Last updated: January 2025" />
      <LegalContent sections={sections} />
    </>
  )
}
