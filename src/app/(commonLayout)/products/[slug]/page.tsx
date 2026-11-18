import { notFound } from "next/navigation";
import { Metadata } from "next";
import { DUMMY_PRODUCTS } from "@/data/dummyProducts";
import ProductDetailClient from "./ProductDetailClient";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = DUMMY_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: "Product Not Found | FIFTH SENSE",
    };
  }

  return {
    title: `${product.name} | Luxury Footwear | FIFTH SENSE`,
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
