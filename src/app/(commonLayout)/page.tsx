import Link from "next/link";
import { DUMMY_PRODUCTS, NEW_ARRIVALS_PRODUCTS } from "@/data/dummyProducts";
import ProductCard from "@/components/modules/storefront/catalog/ProductCard";
import HeroGridSection from "@/components/modules/storefront/home/HeroGridSection";
import FeatureTickerStrip from "@/components/modules/storefront/home/FeatureTickerStrip";
import AttarPromoBanners from "@/components/modules/storefront/home/AttarPromoBanners";
import FineFragranceBanner from "@/components/modules/storefront/home/FineFragranceBanner";
import SectionHeader from "@/components/common/SectionHeader";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950">
      {/* 1. Cinematic Hero Grid: Video on Left + 2 Perfume Horizontal Sliders on Right */}
      <HeroGridSection />

      {/* 2. Feature Ticker Strip: Long Lasting, Natural Scents, Luxury Perfumes, Expertly Crafted */}
      <FeatureTickerStrip />

      {/* 3. House of Attars & Essential Oils Promo Banners (from Figma) */}
      <AttarPromoBanners />

      {/* 4. Best Sellers Products Showcase */}
      <section className="pt-6 sm:pt-8 lg:pt-10 pb-12 sm:pb-16 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
          {/* Centered Editorial Section Header matching Figma */}
          <SectionHeader
            scriptSubtitle="Best products"
            title="BEST SELLERS PRODUCTS"
            description="The stylish and organized cosmetic products"
          />

          {/* 4 Column Luxury Fragrance Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
            {DUMMY_PRODUCTS.slice(0, 4).map((prod, idx) => (
              <ProductCard
                key={prod.id}
                product={prod}
                priority={idx < 4}
                initialWishlisted={idx === 1}
              />
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

      {/* 5. Fine Fragrance Collection Feature Banner (from Figma) */}
      <FineFragranceBanner />

      {/* 6. New Arrivals Products Showcase (from Figma) */}
      <section className="pt-6 sm:pt-8 lg:pt-10 pb-16 sm:pb-24 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
          {/* Centered Editorial Section Header matching Figma */}
          <SectionHeader
            scriptSubtitle="New Arrivals"
            title="NEW ARRIVALS PRODUCTS"
            description="The stylish and organized cosmetic products"
          />

          {/* 4 Column Luxury Fragrance Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
            {NEW_ARRIVALS_PRODUCTS.map((prod, idx) => (
              <ProductCard
                key={prod.id}
                product={prod}
                priority={false}
              />
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              href="/products?filter=new-arrivals"
              className="inline-flex items-center justify-center px-8 py-3 text-xs font-sans font-medium uppercase tracking-normal border border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors rounded-none"
            >
              Discover New Arrivals
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
