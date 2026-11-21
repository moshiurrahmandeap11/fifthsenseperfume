import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";

// Body Font: Clean, modern sans-serif from Figma
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Primary Heading & Luxury Serif: Cormorant Garamond from Figma
const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// Elegant Script / Handwritten Calligraphy Accent: Brittany Signature from /public/fonts
const brittanySignature = localFont({
  src: "../../public/fonts/BrittanySignature.ttf",
  variable: "--font-script",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FIFTH SENSE | Luxury Niche Perfumes & Haute Parfumerie",
  description:
    "Artisanal fragrances crafted with pure Grasse absolutes, aged Cambodian oud, and rare Mysore sandalwood.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        inter.variable,
        cormorantGaramond.variable,
        brittanySignature.variable,
        geistMono.variable,
        "font-sans"
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <QueryProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#1e293b",
                color: "#f8fafc",
                fontSize: "14px",
                borderRadius: "8px",
              },
              success: {
                iconTheme: {
                  primary: "#10b981",
                  secondary: "#ffffff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#ffffff",
                },
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
