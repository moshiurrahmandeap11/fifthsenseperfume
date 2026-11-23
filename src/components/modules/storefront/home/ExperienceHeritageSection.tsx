import React from "react";
import Image from "next/image";

export default function ExperienceHeritageSection() {
  return (
    <section className="w-full py-16 sm:py-20 lg:py-28 bg-white dark:bg-zinc-950 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* 2x2 Interlocking Editorial Grid:
            - Desktop: 2 columns, 0 gap so the diagonal image corners touch at the center vertex.
            - Mobile: Clean stacked editorial flow.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-12 sm:gap-y-16 lg:gap-y-0 lg:gap-x-0 items-stretch">
          
          {/* Cell 1: Experience Text (Top-Left) */}
          <div className="flex flex-col items-start justify-center py-4 sm:py-8 lg:py-14 xl:py-16 pr-4 sm:pr-8 lg:pr-14 xl:pr-16 order-1">
            <span
              className="font-script text-2xl sm:text-3xl lg:text-[34px] leading-none mb-2 sm:mb-3.5 select-none"
              style={{
                color: "#c6b189",
                fontFamily: 'var(--font-script), "BrittanySignature", cursive',
              }}
            >
              Experience Section
            </span>
            <h2 className="font-heading font-serif text-3xl sm:text-4xl lg:text-[44px] uppercase tracking-normal text-[#181818] dark:text-neutral-100 font-normal leading-[1.12] mb-5 sm:mb-6">
              MORE THAN JUST A
              <br />
              FRAGRANCE
            </h2>
            <p className="font-sans text-sm sm:text-[15px] text-[#727272] dark:text-neutral-400 font-normal leading-[1.75] max-w-lg">
              A fragrance should not simply be worn — it should be experienced.
              From the first note to the lingering base, every Gishaq®
              creation unfolds gradually, revealing layers of warmth,
              sophistication, and identity.
            </p>
          </div>

          {/* Cell 2: Top Image (Top-Right) */}
          {/* Bottom-left corner of this image meets top-right corner of bottom image at center (50%, row boundary) */}
          <div className="relative w-full aspect-[601/413] overflow-hidden bg-neutral-100 dark:bg-neutral-900 rounded-none shadow-none order-2 z-10">
            <Image
              src="https://res.cloudinary.com/rhjebh23/image/upload/v1795431914/ecombd/site-assets/top.webp"
              alt="More than just a fragrance - Gishaq perfume crafting experience"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover w-full h-full select-none"
            />
          </div>

          {/* Cell 3: Bottom Image (Bottom-Left) */}
          {/* Top-right corner of this image meets bottom-left corner of top image at center (50%, row boundary) */}
          <div className="relative w-full aspect-[601/413] overflow-hidden bg-neutral-100 dark:bg-neutral-900 rounded-none shadow-none order-4 lg:order-3 z-10 lg:-mt-[1px]">
            <Image
              src="https://res.cloudinary.com/rhjebh23/image/upload/v1795431892/ecombd/site-assets/bottom.webp"
              alt="Since 1875 - A tradition of trust in fragrance craftsmanship"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover w-full h-full select-none"
            />
          </div>

          {/* Cell 4: Heritage Text (Bottom-Right) */}
          <div className="flex flex-col items-start justify-center py-4 sm:py-8 lg:py-14 xl:py-16 pl-4 sm:pl-8 lg:pl-14 xl:pl-16 order-3 lg:order-4">
            <span
              className="font-script text-2xl sm:text-3xl lg:text-[34px] leading-none mb-2 sm:mb-3.5 select-none"
              style={{
                color: "#c6b189",
                fontFamily: 'var(--font-script), "BrittanySignature", cursive',
              }}
            >
              Heritage Section
            </span>
            <h2 className="font-heading font-serif text-3xl sm:text-4xl lg:text-[44px] uppercase tracking-normal text-[#181818] dark:text-neutral-100 font-normal leading-[1.12] mb-5 sm:mb-6">
              SINCE 1875 — A
              <br />
              TRADITION OF TRUST
            </h2>
            <p className="font-sans text-sm sm:text-[15px] text-[#727272] dark:text-neutral-400 font-normal leading-[1.75] max-w-lg">
              With a legacy spanning over a century, G.S. Products has been
              synonymous with excellence in fragrance craftsmanship.
              Generations of expertise have shaped a deep understanding of scent
              — allowing us to create compositions that are not only refined,
              but timeless.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
