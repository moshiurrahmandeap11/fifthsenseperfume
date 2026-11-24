"use client";

import { IPlatformSettings } from "@/types/system.types";
import React, { createContext, useContext, useEffect, useMemo } from "react";

const DEFAULT_LOGO =
  "https://res.cloudinary.com/rhjebh23/image/upload/v1795431915/ecombd/site-assets/fifthsenselogo.webp";

export interface BrandContextValue {
  brandName: string;
  brandSlug: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  footerDescription: string;
  supportPhone: string;
  whatsappNumber: string;
  announcementText: string;
  insideDhakaShipping: number;
  dhakaSubAreaShipping: number;
  outsideDhakaShipping: number;
  freeShippingThreshold: number;
  enabledPaymentMethods: string[];
}

const DEFAULT_BRAND: BrandContextValue = {
  brandName: "FIFTH SENSE",
  brandSlug: "fifth-sense",
  tagline: "Luxury Niche Perfumes & Haute Parfumerie",
  logoUrl: DEFAULT_LOGO,
  faviconUrl: "",
  primaryColor: "#09090b",
  secondaryColor: "#c5a059",
  accentColor: "#18181b",
  footerDescription:
    "Artisanal fragrances crafted with pure Grasse absolutes, aged Cambodian oud, and rare Mysore sandalwood.",
  supportPhone: "+880 1700-000000",
  whatsappNumber: "+880 1700-000000",
  announcementText:
    "Complimentary discovery sample included with every flacon order.",
  insideDhakaShipping: 60,
  dhakaSubAreaShipping: 100,
  outsideDhakaShipping: 120,
  freeShippingThreshold: 5000,
  enabledPaymentMethods: ["COD", "BKASH", "NAGAD", "SSLCOMMERZ"],
};

const BrandContext = createContext<BrandContextValue>(DEFAULT_BRAND);

export function BrandProvider({
  initialSettings,
  children,
}: {
  initialSettings?: IPlatformSettings | null;
  children: React.ReactNode;
}) {
  const value = useMemo<BrandContextValue>(() => {
    if (!initialSettings) return DEFAULT_BRAND;
    return {
      brandName: initialSettings.brandName || DEFAULT_BRAND.brandName,
      brandSlug: initialSettings.brandSlug || DEFAULT_BRAND.brandSlug,
      tagline: initialSettings.tagline || DEFAULT_BRAND.tagline,
      logoUrl: initialSettings.logoUrl || DEFAULT_BRAND.logoUrl,
      faviconUrl: initialSettings.faviconUrl || "",
      primaryColor: initialSettings.primaryColor || DEFAULT_BRAND.primaryColor,
      secondaryColor:
        initialSettings.secondaryColor || DEFAULT_BRAND.secondaryColor,
      accentColor: initialSettings.accentColor || DEFAULT_BRAND.accentColor,
      footerDescription:
        initialSettings.footerDescription || DEFAULT_BRAND.footerDescription,
      supportPhone: initialSettings.supportPhone || DEFAULT_BRAND.supportPhone,
      whatsappNumber:
        initialSettings.whatsappNumber || DEFAULT_BRAND.whatsappNumber,
      announcementText:
        initialSettings.announcementText || DEFAULT_BRAND.announcementText,
    };
  }, [initialSettings]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--brand-primary", value.primaryColor);
    root.style.setProperty("--brand-secondary", value.secondaryColor);
    root.style.setProperty("--brand-accent", value.accentColor);

    if (value.primaryColor && value.primaryColor !== "#09090b") {
      root.style.setProperty("--primary", value.primaryColor);
    }
  }, [value.primaryColor, value.secondaryColor, value.accentColor]);

  return (
    <BrandContext.Provider value={value}>{children}</BrandContext.Provider>
  );
}

export function useBrand() {
  return useContext(BrandContext);
}
