import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Shield, Footprints, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DUMMY_PRODUCTS } from "@/data/dummyProducts";
import ProductCard from "@/components/modules/storefront/catalog/ProductCard";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800 bg-black text-white">
        {/* Background Visual Texture */}
        <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1600&auto=format&fit=crop"
            alt="Leather craftsmanship"
            fill
            priority
            className="object-cover object-center filter grayscale brightness-50"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40 flex flex-col items-center text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-xs font-mono tracking-widest uppercase">
            <span className="size-2 rounded-full bg-white animate-pulse" />
            <span>Limited Batch Release &bull; Autumn / Winter 2026</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-heading max-w-4xl text-balance">
            SCULPTED ELEGANCE IN EVERY STEP.
          </h1>

          <p className="max-w-2xl text-base sm:text-lg text-zinc-300 font-light leading-relaxed">
            Crafted for connoisseurs. Italian full-grain calfskins, shearling thermal
            linings, and heavy-duty commando soles built for discerning urban terrains.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 h-13 px-8 rounded-2xl bg-white text-black hover:bg-zinc-200 font-semibold text-sm tracking-wide shadow-xl transition-all duration-200 hover:scale-105"
            >
              <span>Explore Full Catalog</span>
              <ArrowRight className="size-4" />
            </Link>

            <Link
              href="/products?collection=winter"
              className="inline-flex items-center gap-2 h-13 px-8 rounded-2xl border border-white/30 text-white bg-black/40 hover:bg-white/10 backdrop-blur-md font-medium text-sm transition-all"
            >
              <Flame className="size-4 text-amber-400" />
              <span>Winter Collection</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Quick Navigation Category Pillars */}
      <section className="py-12 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/products?gender=MEN"
              className="group relative h-48 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-900 transition-all hover:shadow-lg"
            >
              <Image
                src="https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop"
                alt="Men's collection"
                fill
                className="object-cover opacity-60 group-hover:scale-105 group-hover:opacity-75 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-300">
                  Collection
                </span>
                <h3 className="text-xl font-bold font-heading">Men&apos;s Formal & Casual</h3>
                <span className="text-xs text-zinc-300 mt-1 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Browse Derbys & Loafers &rarr;
                </span>
              </div>
            </Link>

            <Link
              href="/products?collection=winter"
              className="group relative h-48 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-900 transition-all hover:shadow-lg"
            >
              <Image
                src="https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=800&auto=format&fit=crop"
                alt="Winter collection"
                fill
                className="object-cover opacity-60 group-hover:scale-105 group-hover:opacity-75 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-300">
                  Featured
                </span>
                <h3 className="text-xl font-bold font-heading">Winter Thermal Drop</h3>
                <span className="text-xs text-zinc-300 mt-1 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Explore Shearling Boots &rarr;
                </span>
              </div>
            </Link>

            <Link
              href="/products?gender=WOMEN"
              className="group relative h-48 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-900 transition-all hover:shadow-lg"
            >
              <Image
                src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop"
                alt="Women's collection"
                fill
                className="object-cover opacity-60 group-hover:scale-105 group-hover:opacity-75 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-300">
                  Collection
                </span>
                <h3 className="text-xl font-bold font-heading">Women&apos;s Minimalist</h3>
                <span className="text-xs text-zinc-300 mt-1 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Browse Chelsea & Slip-ons &rarr;
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Curated Archive Grid */}
      <section className="py-16 sm:py-24 bg-white dark:bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-1">
                Handcrafted Archive
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight font-heading text-zinc-950 dark:text-white">
                CURATED SILHOUETTES
              </h2>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-sm font-semibold text-black dark:text-white hover:underline"
            >
              <span>View All 3 Silhouettes</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {DUMMY_PRODUCTS.map((prod, idx) => (
              <ProductCard key={prod.id} product={prod} priority={idx === 0} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
