import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  pathnames: {
    '/': '/',
    '/about/company-profile': '/about/company-profile',
    '/about/news': '/about/news',
    '/about/culture': '/about/culture',
    '/about/milestones': '/about/milestones',
    '/about/contact': '/about/contact',
    '/about/compliance': '/about/compliance',
    '/technology/core-technology': '/technology/core-technology',
    '/technology/research-development': '/technology/research-development',
    '/investor-relations': '/investor-relations',
    '/solutions/humanoid': '/solutions/humanoid',
    '/solutions/education': '/solutions/education',
    '/solutions/commercial': '/solutions/commercial',
    '/solutions/healthcare': '/solutions/healthcare',
    '/solutions/logistics': '/solutions/logistics',
    '/solutions/consumer': '/solutions/consumer',
    '/shop': '/shop',
    '/shop/[slug]': '/shop/[slug]',
    '/checkout': '/checkout',
    '/checkout/success': '/checkout/success',
    '/checkout/cancel': '/checkout/cancel',
    '/support': '/support',
    '/legal/privacy': '/legal/privacy',
    '/legal/terms': '/legal/terms',
    '/legal/cookies': '/legal/cookies',
  }
});

export type Locale = (typeof routing.locales)[number];
