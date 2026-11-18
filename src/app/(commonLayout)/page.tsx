import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Flame, Droplets } from "lucide-react";
import { DUMMY_PRODUCTS } from "@/data/dummyProducts";
import ProductCard from "@/components/modules/storefront/catalog/ProductCard";
import HeroGridSection from "@/components/modules/storefront/home/HeroGridSection";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Cinematic Hero Grid: Video on Left + 2 Perfume Carousels on Right */}
      <HeroGridSection />

      {/* 2. Olfactory Family Banners */}
      <section className="py-12 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/products?gender=MEN"
              className="group relative h-52 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-900 transition-all hover:shadow-lg"
            >
              <Image
                src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop"
                alt="Woody & Smoky Oud"
                fill
                className="object-cover opacity-60 group-hover:scale-105 group-hover:opacity-75 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400">
                  Extrait de Parfum
                </span>
                <h3 className="text-xl font-bold font-heading">Woody & Smoky Oud</h3>
                <span className="text-xs text-zinc-300 mt-1 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Explore Obsidian Noire &rarr;
                </span>
              </div>
            </Link>

            <Link
              href="/products?collection=winter"
              className="group relative h-52 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-900 transition-all hover:shadow-lg"
            >
              <Image
                src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=800&auto=format&fit=crop"
                alt="Warm Amber & Cognac"
                fill
                className="object-cover opacity-60 group-hover:scale-105 group-hover:opacity-75 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-300">
                  Winter Release
                </span>
                <h3 className="text-xl font-bold font-heading">Warm Amber & Cognac</h3>
                <span className="text-xs text-zinc-300 mt-1 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Explore Arctic Horizon &rarr;
                </span>
              </div>
            </Link>

            <Link
              href="/products?gender=WOMEN"
              className="group relative h-52 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-900 transition-all hover:shadow-lg"
            >
              <Image
                src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop"
                alt="Floral & Sandalwood"
                fill
                className="object-cover opacity-60 group-hover:scale-105 group-hover:opacity-75 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-300">
                  Eau de Parfum
                </span>
                <h3 className="text-xl font-bold font-heading">Floral & Sandalwood</h3>
                <span className="text-xs text-zinc-300 mt-1 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Explore Velvet Santal &rarr;
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Curated Fragrances Grid */}
      <section className="py-16 sm:py-24 bg-white dark:bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-1">
                Haute Parfumerie Archive
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight font-heading text-zinc-950 dark:text-white">
                CURATED ARTISANAL ELIXIRS
              </h2>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-sm font-semibold text-black dark:text-white hover:underline"
            >
              <span>View All 3 Fragrances</span>
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
