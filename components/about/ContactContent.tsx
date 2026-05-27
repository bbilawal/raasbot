"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { MapPin, Mail, Phone, Send, CheckCircle, AlertCircle } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

type FormState = "idle" | "loading" | "success" | "error";

export function ContactContent() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const [formState, setFormState] = useState<FormState>("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormState("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setFormState("error");
      }
    } catch {
      setFormState("error");
    }
  };

  return (
    <section className="py-20 bg-[#0A0A0A]">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Office info */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
            className="lg:col-span-2 flex flex-col gap-8"
          >
            <div>
              <span className="text-xs font-semibold text-[#0066FF] uppercase tracking-widest">
                Our Office
              </span>
              <h2 className="mt-3 text-2xl font-bold text-white tracking-tight mb-6">
                Headquarters
              </h2>

              <div className="flex flex-col gap-5">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0066FF]/10 flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-[#0066FF]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white mb-1">
                      Address
                    </div>
                    <div className="text-sm text-white/50 leading-relaxed">
                      1202 Stirling Todd Terrace
                      <br />
                      Milton, Ontario, Canada
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0066FF]/10 flex items-center justify-center flex-shrink-0">
                    <Mail size={18} className="text-[#0066FF]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white mb-1">
                      Email
                    </div>
                    <a
                      href="mailto:info@raasbot.com"
                      className="text-sm text-white/50 hover:text-[#0066FF] transition-colors"
                    >
                      info@raasbot.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0066FF]/10 flex items-center justify-center flex-shrink-0">
                    <Phone size={18} className="text-[#0066FF]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white mb-1">
                      Phone
                    </div>
                    <a
                      href="tel:+1-800-RAASBOT"
                      className="text-sm text-white/50 hover:text-[#0066FF] transition-colors"
                    >
                      +1 (800) RAASBOT
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="rounded-2xl border border-white/8 bg-[#111111] h-64 relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-[0.05]"
                style={{
                  backgroundImage: `linear-gradient(#0066FF 1px, transparent 1px), linear-gradient(90deg, #0066FF 1px, transparent 1px)`,
                  backgroundSize: "30px 30px",
                }}
                aria-hidden="true"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={32} className="text-[#0066FF]/40 mx-auto mb-2" />
                  <p className="text-white/30 text-sm">
                    Milton, Ontario, Canada
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="lg:col-span-3"
          >
            <span className="text-xs font-semibold text-[#0066FF] uppercase tracking-widest">
              Send a Message
            </span>
            <h2 className="mt-3 text-2xl font-bold text-white tracking-tight mb-8">
              How Can We Help?
            </h2>

            {formState === "success" ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle size={32} className="text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Message Sent!</h3>
                <p className="text-white/50 max-w-sm">
                  Thank you for reaching out. Our team will respond within 1-2
                  business days.
                </p>
                <button
                  onClick={() => setFormState("idle")}
                  className="mt-4 text-[#0066FF] text-sm font-semibold hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-white/70 mb-2"
                    >
                      Name <span className="text-[#0066FF]">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-[#111111] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#0066FF]/50 focus:ring-1 focus:ring-[#0066FF]/30 transition-all text-sm"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-white/70 mb-2"
                    >
                      Email <span className="text-[#0066FF]">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-[#111111] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#0066FF]/50 focus:ring-1 focus:ring-[#0066FF]/30 transition-all text-sm"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-white/70 mb-2"
                  >
                    Subject <span className="text-[#0066FF]">*</span>
                  </label>
                  <input
                    id="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-[#111111] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#0066FF]/50 focus:ring-1 focus:ring-[#0066FF]/30 transition-all text-sm"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-white/70 mb-2"
                  >
                    Message <span className="text-[#0066FF]">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-[#111111] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#0066FF]/50 focus:ring-1 focus:ring-[#0066FF]/30 transition-all text-sm resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                {formState === "error" && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle size={14} />
                    Something went wrong. Please try again or email us directly.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={formState === "loading"}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0066FF] hover:bg-[#0052CC] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#0066FF]/20 self-start"
                >
                  {formState === "loading" ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
