import Link from "next/link";
import { DUMMY_PRODUCTS } from "@/data/dummyProducts";
import ProductCard from "@/components/modules/storefront/catalog/ProductCard";
import HeroGridSection from "@/components/modules/storefront/home/HeroGridSection";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950">
      {/* 1. Cinematic Hero Grid: Video on Left + 2 Perfume Horizontal Sliders on Right */}
      <HeroGridSection />

      {/* 2. Curated Fragrances Showcase */}
      <section className="pt-6 sm:pt-8 pb-14 sm:pb-16 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
            <div>
              <h2 className="text-2xl sm:text-3xl font-normal tracking-tight font-heading text-zinc-950 dark:text-white">
                Curated Artisanal Elixirs
              </h2>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center text-sm font-normal text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white underline transition-colors"
            >
              View All Fragrances
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {DUMMY_PRODUCTS.map((prod, idx) => (
              <ProductCard key={prod.id} product={prod} priority={idx === 0} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
