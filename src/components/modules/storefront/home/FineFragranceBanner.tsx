import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function FineFragranceBanner() {
  return (
    <section
      className="relative w-full h-screen min-h-[640px] max-h-[1080px] flex items-center bg-fixed bg-cover bg-no-repeat bg-[position:80%_center] sm:bg-[position:72%_center] md:bg-center overflow-hidden select-none"
      style={{
        backgroundImage: "url('https://res.cloudinary.com/rhjebh23/image/upload/v1795431912/ecombd/site-assets/sectionimage.webp')",
      }}
    >
      {/* Content Layer - Centered in Full Height Screen */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-lg lg:max-w-xl py-12 sm:py-16 md:py-20 flex flex-col items-start justify-center text-left">
          {/* Brush Stroke with Script Accent */}
          <div className="relative inline-flex items-center justify-center mb-3 sm:mb-4">
            <Image
              src="/hero/brush.svg"
              alt=""
              width={522}
              height={81}
              priority
              className="w-[210px] sm:w-[250px] md:w-[275px] h-auto object-contain select-none pointer-events-none drop-shadow-xs"
            />
            <span
              className="absolute inset-0 flex items-center justify-center font-script text-lg sm:text-xl md:text-[23px] text-white select-none whitespace-nowrap pt-1 pl-1"
              style={{
                fontFamily: 'var(--font-script), "BrittanySignature", cursive',
              }}
            >
              Fine Fragrance Collection
            </span>
          </div>

          {/* Main Serif Heading */}
          <h2 className="font-heading font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[42px] xl:text-[46px] uppercase tracking-normal text-neutral-900 font-normal leading-[1.18] mb-3 sm:mb-4">
            CONTEMPORARY
            <br />
            FRAGRANCES DESIGNED
            <br />
            FOR EVERYDAY ELEGANCE
          </h2>

          {/* Description Subtext */}
          <p className="font-sans text-xs sm:text-[13px] md:text-sm text-neutral-800 font-normal leading-relaxed max-w-[440px] mb-6 sm:mb-7">
            Fifth Sense presents a curated range of premium fine fragrances,
            crafted for those who appreciate modern perfumery with a refined,
            long-lasting character.
          </p>

          {/* Sharp Rectangle Button */}
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-7 sm:px-8 py-2.5 sm:py-3 border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors text-xs font-sans font-medium uppercase tracking-normal rounded-none cursor-pointer backdrop-blur-[2px]"
          >
            SHOP NOW
          </Link>
        </div>
      </div>
    </section>
  );
}
