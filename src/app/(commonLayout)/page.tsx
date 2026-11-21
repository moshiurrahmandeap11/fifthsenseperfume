import Link from "next/link";
import { DUMMY_PRODUCTS } from "@/data/dummyProducts";
import ProductCard from "@/components/modules/storefront/catalog/ProductCard";
import HeroGridSection from "@/components/modules/storefront/home/HeroGridSection";
import FeatureTickerStrip from "@/components/modules/storefront/home/FeatureTickerStrip";
import AttarPromoBanners from "@/components/modules/storefront/home/AttarPromoBanners";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950">
      {/* 1. Cinematic Hero Grid: Video on Left + 2 Perfume Horizontal Sliders on Right */}
      <HeroGridSection />

      {/* 2. Feature Ticker Strip: Long Lasting, Natural Scents, Luxury Perfumes, Expertly Crafted */}
      <FeatureTickerStrip />

      {/* 3. House of Attars & Essential Oils Promo Banners (from Figma) */}
      <AttarPromoBanners />

      {/* 3. Best Sellers Products Showcase */}
      <section className="pt-8 sm:pt-12 pb-16 sm:pb-20 bg-white dark:bg-zinc-950 border-t border-neutral-100 dark:border-neutral-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Centered Editorial Section Header matching Figma */}
          <div className="text-center space-y-1">
            <p
              className="font-script text-2xl sm:text-3xl lg:text-4xl text-neutral-400 select-none"
              style={{
                fontFamily: 'var(--font-script), "BrittanySignature", cursive',
              }}
            >
              Best products
            </p>
            <h2 className="font-heading font-serif text-2xl sm:text-3xl lg:text-4xl uppercase tracking-normal text-neutral-950 dark:text-white font-normal">
              BEST SELLERS PRODUCTS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {DUMMY_PRODUCTS.map((prod, idx) => (
              <ProductCard key={prod.id} product={prod} priority={idx === 0} />
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-3 text-xs font-sans font-medium uppercase tracking-normal border border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors rounded-none"
            >
              View All Fragrances
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
