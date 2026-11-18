"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Flame,
  ShoppingBag,
  Droplets,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";
import { DUMMY_PRODUCTS } from "@/data/dummyProducts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HeroGridSection() {
  // Video States
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  // Carousel 1 (Top Box: Signature Extraits)
  const [topIndex, setTopIndex] = useState(0);
  const [isTopHovered, setIsTopHovered] = useState(false);

  // Carousel 2 (Bottom Box: Seasonal & Olfactory Pyramids)
  const [bottomIndex, setBottomIndex] = useState(1); // Start with second perfume for variety
  const [isBottomHovered, setIsBottomHovered] = useState(false);

  // Toggle Video Mute
  const handleToggleMute = () => {
    if (videoRef.current) {
      const nextMute = !isMuted;
      videoRef.current.muted = nextMute;
      setIsMuted(nextMute);
    }
  };

  // Toggle Video Play/Pause
  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Auto-advance Carousel 1 (Top) every 4.5 seconds
  useEffect(() => {
    if (isTopHovered) return;
    const interval = setInterval(() => {
      setTopIndex((prev) => (prev + 1) % DUMMY_PRODUCTS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isTopHovered]);

  // Auto-advance Carousel 2 (Bottom) every 5.5 seconds (offset timer)
  useEffect(() => {
    if (isBottomHovered) return;
    const interval = setInterval(() => {
      setBottomIndex((prev) => (prev + 1) % DUMMY_PRODUCTS.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isBottomHovered]);

  const handleNextTop = useCallback(() => {
    setTopIndex((prev) => (prev + 1) % DUMMY_PRODUCTS.length);
  }, []);

  const handlePrevTop = useCallback(() => {
    setTopIndex((prev) => (prev - 1 + DUMMY_PRODUCTS.length) % DUMMY_PRODUCTS.length);
  }, []);

  const handleNextBottom = useCallback(() => {
    setBottomIndex((prev) => (prev + 1) % DUMMY_PRODUCTS.length);
  }, []);

  const handlePrevBottom = useCallback(() => {
    setBottomIndex((prev) => (prev - 1 + DUMMY_PRODUCTS.length) % DUMMY_PRODUCTS.length);
  }, []);

  const topProduct = DUMMY_PRODUCTS[topIndex];
  const bottomProduct = DUMMY_PRODUCTS[bottomIndex];

  const handleQuickAdd = (productName: string, flaconName?: string) => {
    toast.success(
      <div className="text-xs">
        <p className="font-semibold text-white">Added to Fragrance Bag</p>
        <p className="text-zinc-400">
          {productName} &bull; 100ml Flacon
        </p>
      </div>,
      {
        duration: 3500,
        style: {
          background: "#09090b",
          color: "#ffffff",
          border: "1px solid #27272a",
        },
      }
    );
  };

  return (
    <section className="relative w-full py-6 sm:py-8 lg:py-10 bg-black text-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 2-Column Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
          
          {/* ======================================================== */}
          {/* 1. LEFT BIG BLOCK: AUTOPLAY CINEMATIC SCENT VIDEO (8 cols) */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 xl:col-span-8 relative rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl flex flex-col justify-between min-h-[440px] sm:min-h-[520px] lg:min-h-[620px] group">
            {/* Background Video */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <video
                ref={videoRef}
                src="/hero/hero_video.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover object-center filter brightness-90 group-hover:scale-[1.02] transition-transform duration-1000 ease-out"
              />
            </div>

            {/* Ambient Glass Scrim Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/40 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent pointer-events-none" />

            {/* Top Video Header Bar (Badge + Media Controls) */}
            <div className="relative z-10 p-5 sm:p-7 flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-mono uppercase tracking-widest text-zinc-200">
                <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
                <span>Haute Parfumerie &bull; Film 01</span>
              </div>

              {/* Sound & Playback Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleMute}
                  aria-label={isMuted ? "Unmute video sound" : "Mute video sound"}
                  className="size-9 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer shadow-md"
                >
                  {isMuted ? (
                    <VolumeX className="size-4 text-zinc-300" />
                  ) : (
                    <Volume2 className="size-4 text-amber-400" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleTogglePlay}
                  aria-label={isPlaying ? "Pause video" : "Play video"}
                  className="size-9 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer shadow-md"
                >
                  {isPlaying ? (
                    <Pause className="size-4 text-zinc-300" />
                  ) : (
                    <Play className="size-4 text-amber-400 fill-amber-400 ml-0.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Bottom Hero Overlay Content */}
            <div className="relative z-10 p-6 sm:p-8 lg:p-10 space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-mono text-zinc-300">
                <Sparkles className="size-3 text-amber-400" />
                <span>Micro-Batch No. 2026-A</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading leading-tight text-white drop-shadow-md">
                THE ARCHITECTURE OF SCENT.
              </h1>

              <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed max-w-xl">
                Rare Cambodian oud, Grasse May rose, and aged French cognac
                distilled into 35% pure perfume oils with room-filling projection.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 h-12 px-6 rounded-2xl bg-white text-black hover:bg-zinc-200 font-semibold text-xs tracking-wider uppercase transition-all duration-200 shadow-xl hover:scale-105"
                >
                  <span>Explore All Fragrances</span>
                  <ArrowRight className="size-3.5" />
                </Link>

                <Link
                  href="/products?collection=winter"
                  className="inline-flex items-center gap-2 h-12 px-5 rounded-2xl border border-white/25 text-white bg-black/40 hover:bg-white/10 backdrop-blur-md text-xs font-mono uppercase tracking-wider transition-all"
                >
                  <Flame className="size-3.5 text-amber-400" />
                  <span>Winter Release</span>
                </Link>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 2. RIGHT SIDE: 2 VERTICALLY STACKED PERFUME CAROUSELS (4 cols) */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4 sm:gap-6 justify-between">
            
            {/* ---------------------------------------------------- */}
            {/* BOX 1 (TOP CAROUSEL): SIGNATURE EXTRAITS SHOWCASE */}
            {/* ---------------------------------------------------- */}
            <div
              className="relative flex-1 rounded-3xl border border-zinc-800 bg-zinc-950 p-5 sm:p-6 flex flex-col justify-between overflow-hidden shadow-xl transition-all duration-300 hover:border-zinc-700"
              onMouseEnter={() => setIsTopHovered(true)}
              onMouseLeave={() => setIsTopHovered(false)}
            >
              {/* Header: Title + Slide Nav Controls */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-white animate-pulse" />
                  <h3 className="text-xs font-mono font-semibold uppercase tracking-widest text-zinc-300">
                    Signature Extraits
                  </h3>
                </div>

                {/* Counter & Arrows */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-zinc-500">
                    {topIndex + 1} / {DUMMY_PRODUCTS.length}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handlePrevTop}
                      aria-label="Previous fragrance"
                      className="size-7 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextTop}
                      aria-label="Next fragrance"
                      className="size-7 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    >
                      <ChevronRight className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Carousel Content Body */}
              <div className="grid grid-cols-12 gap-4 py-4 items-center">
                {/* Flacon Visual */}
                <Link
                  href={`/products/${topProduct.slug}`}
                  className="col-span-5 relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 group/img"
                >
                  <Image
                    src={topProduct.thumbnailUrl}
                    alt={topProduct.name}
                    fill
                    sizes="(max-width: 1024px) 30vw, 15vw"
                    className="object-cover group-hover/img:scale-105 transition-transform duration-500"
                  />
                  {topProduct.isBestSeller && (
                    <Badge className="absolute top-2 left-2 bg-black/80 text-white border border-white/20 text-[9px] uppercase px-1.5 py-0.5">
                      Bestseller
                    </Badge>
                  )}
                </Link>

                {/* Details */}
                <div className="col-span-7 flex flex-col justify-center space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
                    {topProduct.heelHeight?.replace("Concentration: ", "") || "35% Extrait"}
                  </span>

                  <h4 className="font-heading font-bold text-sm text-white line-clamp-1 hover:text-zinc-300 transition-colors">
                    <Link href={`/products/${topProduct.slug}`}>
                      {topProduct.name}
                    </Link>
                  </h4>

                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {topProduct.upperMaterial?.replace("Top: ", "")} &bull;{" "}
                    {topProduct.insoleType?.replace("Base: ", "")}
                  </p>

                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-base font-bold font-mono text-white">
                      ৳{(topProduct.discountPrice ?? topProduct.basePrice).toLocaleString("en-BD")}
                    </span>
                    {topProduct.discountPrice && (
                      <span className="text-xs text-zinc-500 line-through font-mono">
                        ৳{topProduct.basePrice.toLocaleString("en-BD")}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Quick Action Bar & Indicators */}
              <div className="flex items-center justify-between pt-3 border-t border-zinc-900">
                {/* Liquid Bullet Dots */}
                <div className="flex items-center gap-1.5">
                  {DUMMY_PRODUCTS.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setTopIndex(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        i === topIndex
                          ? "w-6 bg-white"
                          : "w-1.5 bg-zinc-700 hover:bg-zinc-500"
                      )}
                    />
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => handleQuickAdd(topProduct.name)}
                    className="h-8 rounded-xl border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-white hover:text-black text-xs font-mono gap-1"
                  >
                    <ShoppingBag className="size-3" />
                    <span>Bag</span>
                  </Button>

                  <Link
                    href={`/products/${topProduct.slug}`}
                    className="inline-flex items-center gap-1 h-8 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-medium px-3 transition-colors"
                  >
                    <span>View</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            </div>

            {/* ---------------------------------------------------- */}
            {/* BOX 2 (BOTTOM CAROUSEL): WINTER & OLFACTORY DISCOVERY */}
            {/* ---------------------------------------------------- */}
            <div
              className="relative flex-1 rounded-3xl border border-zinc-800 bg-zinc-950 p-5 sm:p-6 flex flex-col justify-between overflow-hidden shadow-xl transition-all duration-300 hover:border-zinc-700"
              onMouseEnter={() => setIsBottomHovered(true)}
              onMouseLeave={() => setIsBottomHovered(false)}
            >
              {/* Header: Title + Slide Nav Controls */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <Flame className="size-3.5 text-orange-400" />
                  <h3 className="text-xs font-mono font-semibold uppercase tracking-widest text-zinc-300">
                    Winter &amp; Artisanal Drops
                  </h3>
                </div>

                {/* Counter & Arrows */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-zinc-500">
                    {bottomIndex + 1} / {DUMMY_PRODUCTS.length}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handlePrevBottom}
                      aria-label="Previous fragrance"
                      className="size-7 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextBottom}
                      aria-label="Next fragrance"
                      className="size-7 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    >
                      <ChevronRight className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Carousel Content Body */}
              <div className="grid grid-cols-12 gap-4 py-4 items-center">
                {/* Flacon Visual */}
                <Link
                  href={`/products/${bottomProduct.slug}`}
                  className="col-span-5 relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 group/img"
                >
                  <Image
                    src={bottomProduct.thumbnailUrl}
                    alt={bottomProduct.name}
                    fill
                    sizes="(max-width: 1024px) 30vw, 15vw"
                    className="object-cover group-hover/img:scale-105 transition-transform duration-500"
                  />
                  {bottomProduct.categoryId === "cat-winter-amber" && (
                    <Badge className="absolute top-2 left-2 bg-amber-950/90 text-amber-200 border border-amber-400/40 text-[9px] uppercase px-1.5 py-0.5">
                      Winter Drop
                    </Badge>
                  )}
                </Link>

                {/* Details */}
                <div className="col-span-7 flex flex-col justify-center space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                    {bottomProduct.category?.name || "Haute Parfumerie"}
                  </span>

                  <h4 className="font-heading font-bold text-sm text-white line-clamp-1 hover:text-zinc-300 transition-colors">
                    <Link href={`/products/${bottomProduct.slug}`}>
                      {bottomProduct.name}
                    </Link>
                  </h4>

                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {bottomProduct.shortDescription}
                  </p>

                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-base font-bold font-mono text-white">
                      ৳{(bottomProduct.discountPrice ?? bottomProduct.basePrice).toLocaleString("en-BD")}
                    </span>
                    {bottomProduct.discountPrice && (
                      <span className="text-xs text-zinc-500 line-through font-mono">
                        ৳{bottomProduct.basePrice.toLocaleString("en-BD")}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Quick Action Bar & Indicators */}
              <div className="flex items-center justify-between pt-3 border-t border-zinc-900">
                {/* Liquid Bullet Dots */}
                <div className="flex items-center gap-1.5">
                  {DUMMY_PRODUCTS.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setBottomIndex(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        i === bottomIndex
                          ? "w-6 bg-amber-400"
                          : "w-1.5 bg-zinc-700 hover:bg-zinc-500"
                      )}
                    />
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => handleQuickAdd(bottomProduct.name)}
                    className="h-8 rounded-xl border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-white hover:text-black text-xs font-mono gap-1"
                  >
                    <ShoppingBag className="size-3" />
                    <span>Bag</span>
                  </Button>

                  <Link
                    href={`/products/${bottomProduct.slug}`}
                    className="inline-flex items-center gap-1 h-8 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-medium px-3 transition-colors"
                  >
                    <span>View</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
