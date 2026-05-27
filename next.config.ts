import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: '*.supabase.co' },
      { hostname: 'images.unsplash.com' },
    ],
  },
};

export default withNextIntl(nextConfig);
