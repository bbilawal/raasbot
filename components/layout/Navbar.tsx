"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter, usePathname } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, ChevronDown, Globe } from "lucide-react";
import { useCart } from "@/lib/cart/CartContext";
import type { ComponentProps } from "react";

type NavHref = ComponentProps<typeof Link>["href"];

type NavItem = { labelKey: string; href: NavHref };

type MegaMenuSection = {
  key: string;
  items: NavItem[];
  directHref?: NavHref;
};

const NAV_STRUCTURE: MegaMenuSection[] = [
  {
    key: "about",
    items: [
      { labelKey: "companyProfile", href: "/about/company-profile" },
      { labelKey: "news", href: "/about/news" },
      { labelKey: "culture", href: "/about/culture" },
      { labelKey: "milestones", href: "/about/milestones" },
      { labelKey: "contact", href: "/about/contact" },
      { labelKey: "compliance", href: "/about/compliance" },
    ],
  },
  {
    key: "technology",
    items: [
      { labelKey: "coreTechnology", href: "/technology/core-technology" },
      { labelKey: "rnd", href: "/technology/research-development" },
    ],
  },
  {
    key: "solutions",
    items: [
      { labelKey: "humanoid", href: "/solutions/humanoid" },
      { labelKey: "education", href: "/solutions/education" },
      { labelKey: "commercial", href: "/solutions/commercial" },
      { labelKey: "healthcare", href: "/solutions/healthcare" },
      { labelKey: "logistics", href: "/solutions/logistics" },
      { labelKey: "consumer", href: "/solutions/consumer" },
    ],
  },
  {
    key: "shop",
    directHref: "/shop",
    items: [],
  },
  {
    key: "support",
    directHref: "/support",
    items: [],
  },
  {
    key: "investorRelations",
    directHref: "/investor-relations",
    items: [],
  },
];

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const { itemCount: cartCount, openCart } = useCart();
  const menuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleMenuEnter = (key: string) => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setOpenMenu(key);
  };

  const handleMenuLeave = () => {
    menuTimeoutRef.current = setTimeout(() => setOpenMenu(null), 150);
  };

  const switchLocale = () => {
    const nextLocale = locale === "en" ? "fr" : "en";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.replace(pathname as any, { locale: nextLocale });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/5 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex-shrink-0 text-xl font-bold text-white tracking-tight hover:text-[#0066FF] transition-colors"
          aria-label="Raasbot home"
        >
          Raasbot
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1" role="menubar">
          {NAV_STRUCTURE.map((section) => (
            <div
              key={section.key}
              className="relative"
              onMouseEnter={() =>
                section.items.length > 0
                  ? handleMenuEnter(section.key)
                  : undefined
              }
              onMouseLeave={
                section.items.length > 0 ? handleMenuLeave : undefined
              }
              role="none"
            >
              {section.items.length > 0 ? (
                <button
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors rounded-md hover:bg-white/5"
                  aria-haspopup="true"
                  aria-expanded={openMenu === section.key}
                  role="menuitem"
                >
                  {t(section.key as Parameters<typeof t>[0])}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      openMenu === section.key ? "rotate-180" : ""
                    }`}
                  />
                </button>
              ) : (
                <Link
                  href={section.directHref ?? "/"}
                  className="px-3 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors rounded-md hover:bg-white/5 block"
                  role="menuitem"
                >
                  {t(section.key as Parameters<typeof t>[0])}
                </Link>
              )}

              {/* Mega menu dropdown */}
              <AnimatePresence>
                {section.items.length > 0 && openMenu === section.key && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute top-full left-0 mt-1 w-52 bg-[#111111] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                    onMouseEnter={() => handleMenuEnter(section.key)}
                    onMouseLeave={handleMenuLeave}
                    role="menu"
                  >
                    {section.items.map((item) => (
                      <Link
                        key={String(item.href)}
                        href={item.href}
                        className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                        role="menuitem"
                        onClick={() => setOpenMenu(null)}
                      >
                        {t(item.labelKey as Parameters<typeof t>[0])}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Language switcher */}
          <button
            onClick={switchLocale}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors rounded-md hover:bg-white/5"
            aria-label={`Switch to ${locale === "en" ? "French" : "English"}`}
          >
            <Globe size={15} />
            <span className="uppercase tracking-wide text-xs">
              {locale === "en" ? "FR" : "EN"}
            </span>
          </button>

          {/* Cart icon */}
          <button
            onClick={openCart}
            className="relative p-2 text-white/70 hover:text-white transition-colors rounded-md hover:bg-white/5"
            aria-label={`Shopping cart${cartCount > 0 ? `, ${cartCount} items` : ""}`}
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-[#0066FF] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 text-white/70 hover:text-white transition-colors rounded-md hover:bg-white/5"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile slide-out menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-16 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Sheet */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-16 right-0 bottom-0 w-80 max-w-full bg-[#0A0A0A] border-l border-white/10 z-50 lg:hidden overflow-y-auto"
              role="dialog"
              aria-label="Mobile navigation"
              aria-modal="true"
            >
              <MobileNavContent
                t={t}
                locale={locale}
                switchLocale={switchLocale}
                onClose={() => setMobileOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

function MobileNavContent({
  t,
  locale,
  switchLocale,
  onClose,
}: {
  t: ReturnType<typeof useTranslations<"nav">>;
  locale: string;
  switchLocale: () => void;
  onClose: () => void;
}) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  return (
    <div className="py-4 px-4 flex flex-col h-full">
      <nav className="flex-1" aria-label="Mobile navigation">
        {NAV_STRUCTURE.map((section) => (
          <div key={section.key} className="border-b border-white/5">
            {section.items.length > 0 ? (
              <>
                <button
                  className="flex items-center justify-between w-full py-3.5 text-sm font-medium text-white/80 hover:text-white transition-colors"
                  onClick={() =>
                    setExpandedSection(
                      expandedSection === section.key ? null : section.key
                    )
                  }
                  aria-expanded={expandedSection === section.key}
                >
                  {t(section.key as Parameters<typeof t>[0])}
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      expandedSection === section.key ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {expandedSection === section.key && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 pb-2 flex flex-col gap-0.5">
                        {section.items.map((item) => (
                          <Link
                            key={String(item.href)}
                            href={item.href}
                            className="py-2.5 text-sm text-white/60 hover:text-white transition-colors"
                            onClick={onClose}
                          >
                            {t(item.labelKey as Parameters<typeof t>[0])}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <Link
                href={section.directHref ?? "/"}
                className="flex items-center py-3.5 text-sm font-medium text-white/80 hover:text-white transition-colors"
                onClick={onClose}
              >
                {t(section.key as Parameters<typeof t>[0])}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Mobile bottom actions */}
      <div className="pt-4 mt-4 border-t border-white/10 flex flex-col gap-3">
        <button
          onClick={() => {
            switchLocale();
            onClose();
          }}
          className="flex items-center gap-2 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
        >
          <Globe size={16} />
          <span>
            {locale === "en" ? "Passer en Français" : "Switch to English"}
          </span>
        </button>
        <Link
          href="/shop"
          className="flex items-center justify-center gap-2 py-3 bg-[#0066FF] hover:bg-[#0052CC] text-white text-sm font-semibold rounded-xl transition-colors"
          onClick={onClose}
        >
          <ShoppingCart size={16} />
          {t("shop" as Parameters<typeof t>[0])}
        </Link>
      </div>
    </div>
  );
}
