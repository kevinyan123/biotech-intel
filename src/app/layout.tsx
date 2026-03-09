import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Newsreader } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import { AuthProvider } from "@/components/providers/AuthProvider";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["700", "800"],
});

export const metadata: Metadata = {
  title: "KBY Biotech Index — Biotech Investment Research",
  description: "600+ biotech companies, drug pipelines, clinical trials, and catalyst calendar for investment research.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${dmSans.variable} ${jetbrainsMono.variable} ${newsreader.variable} font-sans antialiased`}>
        <AuthProvider>
          <Navbar />
          <main className="max-w-[1280px] mx-auto p-3">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
