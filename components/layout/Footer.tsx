import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FooterLangSwitch } from "./FooterLangSwitch";

const FOOTER_SOLUTIONS = [
  { labelKey: "humanoid", href: "/solutions/humanoid" },
  { labelKey: "education", href: "/solutions/education" },
  { labelKey: "commercial", href: "/solutions/commercial" },
  { labelKey: "healthcare", href: "/solutions/healthcare" },
  { labelKey: "logistics", href: "/solutions/logistics" },
  { labelKey: "consumer", href: "/solutions/consumer" },
] as const;

const FOOTER_ABOUT = [
  { labelKey: "companyProfile", href: "/about/company-profile" },
  { labelKey: "news", href: "/about/news" },
  { labelKey: "culture", href: "/about/culture" },
  { labelKey: "milestones", href: "/about/milestones" },
  { labelKey: "investorRelations", href: "/investor-relations" },
] as const;

const FOOTER_SUPPORT = [
  { labelKey: "support", href: "/support" },
  { labelKey: "contact", href: "/about/contact" },
] as const;

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://linkedin.com", icon: "in" },
  { label: "Twitter / X", href: "https://twitter.com", icon: "X" },
  { label: "YouTube", href: "https://youtube.com", icon: "YT" },
] as const;

export function Footer() {
  const t = useTranslations("nav");
  const tf = useTranslations("footer");
  const ts = useTranslations("site");

  return (
    <footer
      className="bg-[#0A0A0A] border-t border-white/5"
      aria-label="Site footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="text-2xl font-bold text-white tracking-tight hover:text-[#0066FF] transition-colors"
              aria-label="Raasbot home"
            >
              Raasbot
            </Link>
            <p className="mt-4 text-sm text-white/50 leading-relaxed max-w-xs">
              {ts("tagline")}
            </p>
            <p className="mt-4 text-xs text-white/30 leading-relaxed max-w-xs">
              {ts("company")}
              <br />
              {ts("address")}
            </p>

            {/* Social links */}
            <div className="mt-6 flex gap-3" aria-label="Social media links">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-[#0066FF]/50 hover:bg-[#0066FF]/10 transition-all text-xs font-bold"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Solutions column */}
          <div>
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-5">
              {t("solutions")}
            </h3>
            <ul className="flex flex-col gap-3" role="list">
              {FOOTER_SOLUTIONS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About column */}
          <div>
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-5">
              {t("about")}
            </h3>
            <ul className="flex flex-col gap-3" role="list">
              {FOOTER_ABOUT.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Resources column */}
          <div>
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-5">
              {t("support")}
            </h3>
            <ul className="flex flex-col gap-3" role="list">
              {FOOTER_SUPPORT.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
              <li className="pt-2 border-t border-white/5">
                <Link
                  href="/shop"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  {t("shop")}
                </Link>
              </li>
            </ul>

            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-5 mt-8">
              Resources
            </h3>
            <ul className="flex flex-col gap-3" role="list">
              <li>
                <span className="text-sm text-white/60 cursor-default">
                  {tf("downloads")}
                </span>
              </li>
              <li>
                <span className="text-sm text-white/60 cursor-default">
                  {tf("developer")}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30 text-center sm:text-left">
            &copy; 2025 {ts("company")}. {tf("rights")}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link
              href="/legal/privacy"
              className="text-xs text-white/40 hover:text-white transition-colors"
            >
              {tf("privacy")}
            </Link>
            <Link
              href="/legal/terms"
              className="text-xs text-white/40 hover:text-white transition-colors"
            >
              {tf("terms")}
            </Link>
            <Link
              href="/legal/cookies"
              className="text-xs text-white/40 hover:text-white transition-colors"
            >
              {tf("cookies")}
            </Link>
            <FooterLangSwitch />
          </div>
        </div>
      </div>
    </footer>
  );
}
