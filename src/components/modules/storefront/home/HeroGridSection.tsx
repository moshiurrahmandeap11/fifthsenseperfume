"use client";

import { useState, useEffect, useRef } from "react";
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

  // Sequential dual video playback state & refs
  const [activeVideoIdx, setActiveVideoIdx] = useState<0 | 1>(0);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);

  // When video 1 finishes playing, smoothly switch to video 2
  const handleVideo1Ended = () => {
    if (video2Ref.current) {
      video2Ref.current.currentTime = 0;
      video2Ref.current.play().catch(() => {});
    }
    setActiveVideoIdx(1);
  };

  // When video 2 finishes playing, smoothly switch back to video 1
  const handleVideo2Ended = () => {
    if (video1Ref.current) {
      video1Ref.current.currentTime = 0;
      video1Ref.current.play().catch(() => {});
    }
    setActiveVideoIdx(0);
  };

  // Initial autoplay on mount
  useEffect(() => {
    if (video1Ref.current) {
      video1Ref.current.play().catch(() => {});
    }
  }, []);

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
          {/* 1. LEFT BIG BLOCK: SEQUENTIAL DUAL VIDEOS (CLICK TO /products) */}
          {/* ======================================================== */}
          <Link
            href="/products"
            className={cn(
              "relative lg:col-span-7 xl:col-span-8",
              "aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:h-[420px] xl:h-[460px]",
              "rounded-xl sm:rounded-2xl overflow-hidden",
              "border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900",
              "cursor-pointer block group"
            )}
            title="Explore Fragrance Catalog"
          >
            {/* Video 1: hero_video.mp4 */}
            <video
              ref={video1Ref}
              src="/hero/hero_video.mp4"
              autoPlay
              muted
              playsInline
              preload="auto"
              onEnded={handleVideo1Ended}
              className={cn(
                "absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ease-in-out",
                activeVideoIdx === 0
                  ? "opacity-100 z-10"
                  : "opacity-0 z-0 pointer-events-none"
              )}
            />

            {/* Video 2: hero_video_2.mp4 */}
            <video
              ref={video2Ref}
              src="/hero/hero_video_2.mp4"
              muted
              playsInline
              preload="auto"
              onEnded={handleVideo2Ended}
              className={cn(
                "absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ease-in-out",
                activeVideoIdx === 1
                  ? "opacity-100 z-10"
                  : "opacity-0 z-0 pointer-events-none"
              )}
            />

            {/* Soft Ambient Bottom Gradient Vignette */}
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none z-[15]" />

            {/* Explore Now Button Overlay (Bottom-Left Corner) */}
            <div className="absolute bottom-5 left-5 sm:bottom-7 sm:left-7 z-20 pointer-events-none">
              <span className="inline-flex items-center justify-center px-6 py-2.5 sm:px-7 sm:py-3 rounded-full text-xs sm:text-sm font-normal tracking-wide text-zinc-950 bg-white/90 group-hover:bg-white group-hover:scale-[1.03] shadow-lg shadow-black/15 backdrop-blur-md border border-white/70 transition-all duration-300">
                Explore Now
              </span>
            </div>
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
