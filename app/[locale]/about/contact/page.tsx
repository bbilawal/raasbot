import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/shared/PageHero";
import { ContactContent } from "@/components/about/ContactContent";
import { QuoteForm } from "@/components/shared/QuoteForm";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Contact Us",
    description:
      "Get in touch with Raasbot. Reach our team in Milton, Ontario for sales, support, partnerships, and general inquiries.",
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in Touch"
        subtitle="Whether you have a product question, partnership inquiry, or just want to learn more — our team is ready to help."
      />
      <ContactContent />

      {/* Quote / RFQ section */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <QuoteForm />
        </div>
      </section>
    </>
  );
}
