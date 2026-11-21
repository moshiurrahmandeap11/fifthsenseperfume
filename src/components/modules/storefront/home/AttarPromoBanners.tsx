import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PromoBannerItem {
  id: string;
  scriptTitle: string;
  scriptColor: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  href: string;
  buttonText: string;
}

const PROMO_BANNERS: PromoBannerItem[] = [
  {
    id: "attars",
    scriptTitle: "House of Attars",
    scriptColor: "#9c8a65",
    description: "Pure, alcohol-free compositions, rooted in Indian tradition and depth",
    imageSrc: "/hero/img1.jpg",
    imageAlt: "House of Attars Artisanal Perfume",
    href: "/products?category=attars",
    buttonText: "SHOP NOW",
  },
  {
    id: "essential-oils",
    scriptTitle: "Essential Oils",
    scriptColor: "#c89f78",
    description: "Natural extracts created for purity, wellness, and balance",
    imageSrc: "/hero/img2.jpg",
    imageAlt: "Essential Oils and Natural Elixirs",
    href: "/products?category=oils",
    buttonText: "SHOP NOW",
  },
];

export default function AttarPromoBanners() {
  return (
    <section className="w-full pt-8 sm:pt-10 lg:pt-12 pb-12 sm:pb-16 bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
          {PROMO_BANNERS.map((banner) => (
            <div
              key={banner.id}
              className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[1.82/1] min-h-[300px] sm:min-h-[330px] lg:min-h-[360px] overflow-hidden rounded-none border border-neutral-200/60 dark:border-neutral-800 bg-[#fbf9f6] dark:bg-neutral-900"
            >
              {/* Background Artwork with Flacon on Right (No Hover Zoom) */}
              <Image
                src={banner.imageSrc}
                alt={banner.imageAlt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-right select-none"
              />

              {/* Text & Button Overlay on Left */}
              <div className="relative z-10 h-full flex flex-col justify-center items-start p-6 sm:p-8 lg:p-12 max-w-[64%] sm:max-w-[60%]">
                {/* Script Title with BrittanySignature */}
                <h3
                  className="font-script text-4xl sm:text-5xl lg:text-[54px] leading-[1.08] mb-3 sm:mb-4 select-none"
                  style={{
                    color: banner.scriptColor,
                    fontFamily: 'var(--font-script), "BrittanySignature", cursive',
                  }}
                >
                  {banner.scriptTitle}
                </h3>

                {/* Description with Inter */}
                <p className="font-sans text-xs sm:text-[13px] lg:text-[15px] leading-[1.55] text-neutral-800 dark:text-neutral-200 mb-6 sm:mb-8 font-normal">
                  {banner.description}
                </p>

                {/* Shop Now Action Button */}
                <Link
                  href={banner.href}
                  className={cn(
                    "inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3",
                    "text-xs sm:text-[13px] font-sans font-medium uppercase tracking-normal",
                    "border border-neutral-900 dark:border-white text-neutral-950 dark:text-white bg-transparent",
                    "hover:bg-neutral-950 hover:text-white dark:hover:bg-white dark:hover:text-black",
                    "transition-colors duration-200 rounded-none select-none"
                  )}
                >
                  {banner.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
