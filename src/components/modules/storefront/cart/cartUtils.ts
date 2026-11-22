import { ICartItemDetails } from "@/types/cart.types";
import { IProduct } from "@/types/product.types";

/**
 * Formats fragrance prices consistently across cards, drawer, and bag page.
 */
export function formatFragrancePrice(val: number): string {
  return val < 100 ? val.toFixed(2) : Math.round(val).toLocaleString("en-BD");
}

export interface AddProductOptions {
  colorIdx?: number;
  variantId?: string;
  quantity?: number;
}

/**
 * Converts a catalog IProduct + optional edition/volume selection into an ICartItemDetails entry.
 */
export function buildCartItemFromProduct(
  product: IProduct,
  options?: AddProductOptions
): ICartItemDetails {
  const color =
    product.colors?.[options?.colorIdx ?? 0] || product.colors?.[0];
  const variants = color?.variants || [];
  const variant = options?.variantId
    ? variants.find((v) => v.id === options.variantId) || variants[0]
    : variants[0];

  const unitPrice = product.discountPrice ?? product.basePrice;
  const originalPrice =
    product.discountPrice != null && product.discountPrice < product.basePrice
      ? product.basePrice
      : undefined;

  const stockAvailable = variant?.stockQuantity ?? 10;
  const qty = Math.max(1, Math.min(options?.quantity ?? 1, stockAvailable));
  const resolvedVariantId = variant?.id || `${product.id}-default`;

  return {
    id: `cart-item-${resolvedVariantId}`,
    variantId: resolvedVariantId,
    productId: product.id,
    productName: product.name,
    slug: product.slug,
    styleCode: product.styleCode,
    colorName: color?.colorName || "Signature Flacon",
    size: variant?.size || "50ml",
    sku: variant?.sku || product.styleCode,
    imageUrl:
      color?.images?.[0] ||
      product.thumbnailUrl ||
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop",
    unitPrice,
    originalPrice,
    quantity: qty,
    itemTotal: unitPrice * qty,
    stockAvailable,
    isAvailable: stockAvailable > 0,
    isOutOfStock: stockAvailable <= 0,
  };
}
