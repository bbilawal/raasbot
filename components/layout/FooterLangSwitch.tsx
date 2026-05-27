"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Globe } from "lucide-react";

export function FooterLangSwitch() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = () => {
    const nextLocale = locale === "en" ? "fr" : "en";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.replace(pathname as any, { locale: nextLocale });
  };

  return (
    <button
      onClick={switchLocale}
      className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors"
      aria-label={`Switch to ${locale === "en" ? "French" : "English"}`}
    >
      <Globe size={13} />
      <span className="uppercase tracking-wide">
        {locale === "en" ? "FR" : "EN"}
      </span>
    </button>
  );
}
