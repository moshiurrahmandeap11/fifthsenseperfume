"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Top Carousel Images (High-res Luxury Perfumes)
const TOP_CAROUSEL_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1200&auto=format&fit=crop",
    alt: "Obsidian Noire Extrait de Parfum",
  },
  {
    url: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1200&auto=format&fit=crop",
    alt: "Arctic Horizon Amber Elixir",
  },
  {
    url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1200&auto=format&fit=crop",
    alt: "Velvet Santal & Rose Blanche",
  },
];

// Bottom Carousel Images (High-res Luxury Perfumes)
const BOTTOM_CAROUSEL_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1200&auto=format&fit=crop",
    alt: "Smoked Crystal Edition",
  },
  {
    url: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1200&auto=format&fit=crop",
    alt: "Golden Cognac Flacon",
  },
  {
    url: "https://images.unsplash.com/photo-1583445013765-46c20c4a6772?q=80&w=1200&auto=format&fit=crop",
    alt: "Opal Blanc Flacon",
  },
];

export default function HeroGridSection() {
  const [topIndex, setTopIndex] = useState(0);
  const [bottomIndex, setBottomIndex] = useState(0);

  // Auto-advance Top Carousel every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setTopIndex((prev) => (prev + 1) % TOP_CAROUSEL_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Auto-advance Bottom Carousel every 4.8 seconds (staggered for organic rhythm)
  useEffect(() => {
    const timer = setInterval(() => {
      setBottomIndex((prev) => (prev + 1) % BOTTOM_CAROUSEL_IMAGES.length);
    }, 4800);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full py-4 sm:py-6 lg:py-8 bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Clean Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
          
          {/* ======================================================== */}
          {/* 1. LEFT BIG BLOCK: PURE VIDEO (CLICK TO /products) */}
          {/* ======================================================== */}
          <Link
            href="/products"
            className={cn(
              "group relative lg:col-span-7 xl:col-span-8",
              "aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:min-h-[560px] xl:min-h-[620px]",
              "rounded-2xl sm:rounded-3xl overflow-hidden",
              "border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900",
              "shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer block"
            )}
            title="Explore Fragrance Catalog"
          >
            <video
              src="/hero/hero_video.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
            />
          </Link>

          {/* ======================================================== */}
          {/* 2. RIGHT SIDE: 2 STACKED IMAGE CAROUSELS (CLICK TO /products) */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4 sm:gap-6">
            
            {/* ---------------------------------------------------- */}
            {/* BOX 1 (TOP): PURE PERFUME IMAGE CAROUSEL */}
            {/* ---------------------------------------------------- */}
            <Link
              href="/products"
              className={cn(
                "group relative flex-1 min-h-[240px] sm:min-h-[270px] lg:min-h-0",
                "rounded-2xl sm:rounded-3xl overflow-hidden",
                "border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900",
                "shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer block"
              )}
              title="Explore Fragrances"
            >
              {TOP_CAROUSEL_IMAGES.map((item, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                    idx === topIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  )}
                >
                  <Image
                    src={item.url}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 35vw"
                    priority={idx === 0}
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
              ))}
            </Link>

            {/* ---------------------------------------------------- */}
            {/* BOX 2 (BOTTOM): PURE PERFUME IMAGE CAROUSEL */}
            {/* ---------------------------------------------------- */}
            <Link
              href="/products"
              className={cn(
                "group relative flex-1 min-h-[240px] sm:min-h-[270px] lg:min-h-0",
                "rounded-2xl sm:rounded-3xl overflow-hidden",
                "border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900",
                "shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer block"
              )}
              title="Explore Fragrances"
            >
              {BOTTOM_CAROUSEL_IMAGES.map((item, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                    idx === bottomIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  )}
                >
                  <Image
                    src={item.url}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 35vw"
                    priority={idx === 0}
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
              ))}
            </Link>

          </div>
        </div>
      </div>
    </section>
  );
}
