import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Raasbot",
    template: "%s | Raasbot",
  },
  description:
    "Raasbot delivers cutting-edge humanoid robots, AI education solutions, and smart robotics for commercial, healthcare, and logistics industries.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0A0A0A]">{children}</body>
    </html>
  );
}
