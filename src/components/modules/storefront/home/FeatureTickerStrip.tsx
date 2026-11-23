import React from "react";
import Image from "next/image";

interface FeatureItem {
  icon: string;
  alt: string;
  text: string;
}

const FEATURE_ITEMS: FeatureItem[] = [
  {
    icon: "https://res.cloudinary.com/rhjebh23/image/upload/v1795431911/ecombd/site-assets/perfume-2.svg",
    alt: "Long Lasting Perfume",
    text: "LONG LASTING",
  },
  {
    icon: "https://res.cloudinary.com/rhjebh23/image/upload/v1795431909/ecombd/site-assets/leaf.svg",
    alt: "Natural Scents Leaf",
    text: "NATURAL SCENTS",
  },
  {
    icon: "https://res.cloudinary.com/rhjebh23/image/upload/v1795431896/ecombd/site-assets/diamond.svg",
    alt: "Luxury Perfumes Diamond",
    text: "LUXURY PERFUMES",
  },
  {
    icon: "/hero/experty.svg",
    alt: "Expertly Crafted Seal",
    text: "EXPERTLY CRAFTED",
  },
];

// Duplicate items for continuous seamless loop
const TICKER_ITEMS = [
  ...FEATURE_ITEMS,
  ...FEATURE_ITEMS,
  ...FEATURE_ITEMS,
  ...FEATURE_ITEMS,
];

export default function FeatureTickerStrip() {
  return (
    <aside
      aria-label="Brand Features"
      className="w-full bg-[#121212] text-white overflow-hidden py-5 sm:py-6 lg:py-7 select-none border-y border-neutral-800 rounded-none relative"
    >
      {/* Infinite Smooth Scrolling Track */}
      <div className="flex w-max animate-marquee items-center gap-12 sm:gap-16 lg:gap-20">
        {TICKER_ITEMS.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 sm:gap-4 shrink-0"
          >
            {/* Larger Prominent Icon */}
            <div className="relative size-7 sm:size-8 lg:size-9 flex items-center justify-center shrink-0">
              <Image
                src={item.icon}
                alt={item.alt}
                width={36}
                height={36}
                className="max-h-7 sm:max-h-8 lg:max-h-9 w-auto object-contain brightness-100 select-none"
              />
            </div>

            {/* Larger Prominent Serif Typography */}
            <span className="font-serif font-normal text-sm sm:text-base md:text-lg lg:text-[19px] uppercase tracking-normal text-neutral-100 whitespace-nowrap">
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}
