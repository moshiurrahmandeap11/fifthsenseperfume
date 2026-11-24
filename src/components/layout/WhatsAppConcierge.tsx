"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { useBrand } from "@/providers/BrandProvider";

export default function WhatsAppConcierge() {
  const brand = useBrand();

  if (!brand.whatsappNumber) return null;

  const cleanNumber = brand.whatsappNumber.replace(/[^0-9]/g, "");
  if (!cleanNumber) return null;

  return (
    <aside
      aria-label="WhatsApp Concierge"
      className="fixed bottom-6 right-6 z-40 group"
    >
      <a
        href={`https://wa.me/${cleanNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Concierge on WhatsApp"
        className="flex items-center gap-2 px-3.5 py-2.5 bg-[#09090b]/90 hover:bg-[#09090b] text-[#c5a059] border border-[#c5a059]/40 hover:border-[#c5a059] rounded-full shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <MessageCircle className="size-4 text-[#25D366] fill-[#25D366]/20 shrink-0" />
        <span className="text-xs font-sans font-medium text-neutral-200 tracking-wide pr-1">
          Concierge
        </span>
      </a>
    </aside>
  );
}
