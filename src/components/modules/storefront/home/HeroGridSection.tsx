"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Top Slider Images (High-res Luxury Perfumes)
const TOP_SLIDER_IMAGES = [
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

// Bottom Slider Images (High-res Luxury Perfumes)
const BOTTOM_SLIDER_IMAGES = [
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

  // Auto-slide Top Carousel horizontally every 3.8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setTopIndex((prev) => (prev + 1) % TOP_SLIDER_IMAGES.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  // Auto-slide Bottom Carousel horizontally every 4.6 seconds (staggered timing)
  useEffect(() => {
    const timer = setInterval(() => {
      setBottomIndex((prev) => (prev + 1) % BOTTOM_SLIDER_IMAGES.length);
    }, 4600);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full py-2 sm:py-4 lg:py-6 bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Full-width Container Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
          
          {/* ======================================================== */}
          {/* 1. LEFT BIG BLOCK: PURE VIDEO (CLICK TO /products) */}
          {/* ======================================================== */}
          <Link
            href="/products"
            className={cn(
              "relative lg:col-span-7 xl:col-span-8",
              "aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:h-[420px] xl:h-[460px]",
              "rounded-xl sm:rounded-2xl overflow-hidden",
              "border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900",
              "cursor-pointer block"
            )}
            title="Explore Fragrance Catalog"
          >
            <video
              src="/hero/hero_video.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover object-center"
            />
          </Link>

          {/* ======================================================== */}
          {/* 2. RIGHT SIDE: 2 HORIZONTAL SLIDERS (CLICK TO /products) */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-3 sm:gap-4 lg:h-[420px] xl:h-[460px]">
            
            {/* ---------------------------------------------------- */}
            {/* BOX 1 (TOP): HORIZONTAL SLIDING PERFUME CAROUSEL */}
            {/* ---------------------------------------------------- */}
            <Link
              href="/products"
              className={cn(
                "relative flex-1 min-h-[190px] sm:min-h-[200px] lg:min-h-0",
                "rounded-xl sm:rounded-2xl overflow-hidden",
                "border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900",
                "cursor-pointer block"
              )}
              title="Explore Fragrances"
            >
              {/* Horizontal Slider Track */}
              <div
                className="flex h-full w-full transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${topIndex * 100}%)` }}
              >
                {TOP_SLIDER_IMAGES.map((item, idx) => (
                  <div key={idx} className="relative h-full w-full shrink-0">
                    <Image
                      src={item.url}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 35vw"
                      priority={idx === 0}
                      className="object-cover object-center"
                    />
                  </div>
                ))}
              </div>
            </Link>

            {/* ---------------------------------------------------- */}
            {/* BOX 2 (BOTTOM): HORIZONTAL SLIDING PERFUME CAROUSEL */}
            {/* ---------------------------------------------------- */}
            <Link
              href="/products"
              className={cn(
                "relative flex-1 min-h-[190px] sm:min-h-[200px] lg:min-h-0",
                "rounded-xl sm:rounded-2xl overflow-hidden",
                "border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900",
                "cursor-pointer block"
              )}
              title="Explore Fragrances"
            >
              {/* Horizontal Slider Track */}
              <div
                className="flex h-full w-full transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${bottomIndex * 100}%)` }}
              >
                {BOTTOM_SLIDER_IMAGES.map((item, idx) => (
                  <div key={idx} className="relative h-full w-full shrink-0">
                    <Image
                      src={item.url}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 35vw"
                      priority={idx === 0}
                      className="object-cover object-center"
                    />
                  </div>
                ))}
              </div>
            </Link>

          </div>
        </div>
      </div>
    </section>
  );
}
