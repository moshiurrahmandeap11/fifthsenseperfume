import { notFound } from "next/navigation";
import { Metadata } from "next";
import { connection } from "next/server";
import { DUMMY_PRODUCTS, NEW_ARRIVALS_PRODUCTS } from "@/data/dummyProducts";
import { getProductByIdOrSlug } from "@/services/product.services";
import { IProduct } from "@/types/product.types";
import ProductDetailClient from "./ProductDetailClient";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function resolveProduct(slug: string): Promise<IProduct | null> {
  try {
    const res = await getProductByIdOrSlug(slug);
    if (res?.data) {
      return res.data;
    }
  } catch {
    // Fallback to static catalog if not found in DB
  }
  return (
    [...DUMMY_PRODUCTS, ...NEW_ARRIVALS_PRODUCTS].find((p) => p.slug === slug) ||
    null
  );
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  await connection();
  const { slug } = await params;
  const product = await resolveProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found | FIFTH SENSE",
    };
  }

  return {
    title: `${product.name} | FIFTH SENSE PERFUMES`,
    description: product.shortDescription || product.description,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = DUMMY_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
